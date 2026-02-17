const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const checkDuplicate = (bookId, MemberID) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT BookID FROM pendingissue WHERE BookID = ? AND MemberID = ?";

    connection.query(sql, [bookId, MemberID], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0);
    });
  });
};

const checkIsAdminIssue = (memberid) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT EXISTS (SELECT 1 FROM admin WHERE id = ?) AS id_exists";
    connection.query(sql, [memberid], (err, result) => {
      if (err) return reject(err);
      resolve(result[0].id_exists);
    });
  });
};

const decqty = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE book SET availableqty = availableqty - 1 WHERE id = ? AND availableqty > 0";
    connection.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

const assignInPending = async (req, res) => {
  try {
    let id = uuid();
    let bookId = req.params.id;
    let { MemberID } = req.body;

    const duplicate = await checkDuplicate(bookId, MemberID);
    const isAdminapply = await checkIsAdminIssue(MemberID);

    if (isAdminapply == 1) {
      return res.json({ message: "Admin Can't Borrow" });
    }

    if (duplicate) {
      return res.json({ message: "Duplicate found" });
    }
    const sql = `INSERT INTO pendingissue (id , BookID , MemberID) VALUES (?, ?, ?)`;
    connection.query(sql, [id, bookId, MemberID], (err, result) => {
      if (err) {
        res.json({ message: "Invalid Credentials" });
        console.log(err);
      } else {
        decqty(bookId);
        res.json({ success: true, message: "Pending... Wait for the issue" });
      }
    });
  } catch (error) {
    console.error("error in assiging pending", error);
  }
};

const getPendingIssueForUser = async (req, res) => {
  try {
    let { id } = req.params;
    let sql = `SELECT
    p.id AS pendingissue_id,
    p.status,

    b.id AS book_id,
    b.title,


    a.id AS admin_id,
    a.username AS admin_name,
    a.email AS admin_email,
    a.contact AS admin_contact,
    a.address AS admin_address

FROM pendingissue p

JOIN book b
    ON p.BookID = b.id

JOIN admin a
    ON b.addby = a.id
    
    WHERE MemberID = ?`;
    connection.query(sql, id, (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Invalid Credentials", err);
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("error in get user pending", error);
  }
};

const getPendingIssue = async (req, res) => {
  try {
    let { id } = req.params;
    let sql = `SELECT p.BookID, p.MemberID, p.status, 
                b.title, b.addby,
                m.username, m.email, m.contact
                FROM pendingissue p
                JOIN book b
               ON p.BookID = b.id
              JOIN users m
             ON p.MemberID = m.id
              WHERE b.addby = ?`;
    connection.query(sql, id, (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Invalid Credentials");
      }
      if (result.length == 0) {
        res.send("Empty Pending");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("error in admin pending", error);
  }
};

module.exports = { assignInPending, getPendingIssue, getPendingIssueForUser };
