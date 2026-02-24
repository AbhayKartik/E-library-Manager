const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const checkDuplicate = async (bookId, MemberID) => {
  try {
    const sql =
      "SELECT BookID FROM pendingissue WHERE BookID = ? AND MemberID = ?";
    let [result] = await connection.query(sql, [bookId, MemberID]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error Check duplicate:", error);
    throw error;
  }
};

const checkIsAdminIssue = async (memberid) => {
  try {
    const sql = "SELECT EXISTS (SELECT 1 FROM admin WHERE id = ?) AS id_exists";
    let [result] = await connection.query(sql, [memberid]);
    return result[0].id_exists;
  } catch (error) {
    console.error("Error check is admin:", error);
    throw error;
  }
};

const decqty = async (id) => {
  try {
    const sql =
      "UPDATE book SET availableqty = availableqty - 1 WHERE id = ? AND availableqty > 0";
    let [result] = await connection.query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error decqty:", error);
    throw error;
  }
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
    let [result] = await connection.query(sql, [id, bookId, MemberID]);
    if (result.affectedRows == 1) {
      decqty(bookId);
    }
    res.json({ success: true, message: "Pending... Wait for the issue" });
  } catch (error) {
    console.error("error in assiging pending", error);
    res.status(500).json({ message: "Database error" });
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
    let [result] = await connection.query(sql, id);
    res.json(result);
  } catch (error) {
    console.error("error in get user pending", error);
    res.status(500).json({ message: "Database error" });
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
    let [result] = await connection.query(sql, id);
    res.json(result);
  } catch (error) {
    console.error("error in admin pending", error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = { assignInPending, getPendingIssue, getPendingIssueForUser };
