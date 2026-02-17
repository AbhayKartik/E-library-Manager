const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const getAllRecord = async (req, res) => {
  try {
    let sql = `SELECT 
    b.id,
    b.title,
    m.id,
    m.username,
    m.contact,
    i.IssueDate,
    i.DueDate,
    i.ReturnDate,
    i.Fine,
    i.id AS Issued_Id
FROM issuerecord i
JOIN book b
    ON i.BookID = b.id
JOIN users m
    ON i.MemberID = m.id;`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log("got err", err);
      }

      if (result.length == 0) {
        res.json({ message: "Empty Record" });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("Error in get all issue", error);
  }
};

const getRecordById = async (req, res) => {
  try {
    let userId = req.params.id;
    let sql = `SELECT 
    b.title,
    b.addby,
    b.id,
    m.username,
    m.email,
    i.IssueDate,
    i.DueDate,
    i.ReturnDate,
    i.Fine
FROM issuerecord i
JOIN book b
    ON i.BookID = b.id
JOIN admin m
    ON b.addby = m.id
    WHERE MemberID = ?`;
    // let sql = `SELECT * FROM issuerecord WHERE MemberID = ?`;

    connection.query(sql, userId, (err, result) => {
      if (err) {
        console.log("error in getrecord if ", err);
      }

      res.json(result);
    });
  } catch (error) {
    console.error("Error in get all issue", error);
  }
};

const setToIssued = (bookId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE pendingissue SET status = 'issued' WHERE BookID = ?";

    connection.query(sql, [bookId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

const setTorejected = (bookId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE pendingissue SET status = 'rejected' WHERE BookID = ?";

    connection.query(sql, [bookId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

const issueRecord = async (req, res) => {
  try {
    let id = uuid();
    let bookID = req.params.id;
    let { MemberID, isIssue } = req.body;
    const today = new Date();
    const futureDate = new Date(today);

    futureDate.setDate(today.getDate() + 16);
    let issueDate = today.toISOString().split("T")[0];
    let dueDate = futureDate.toISOString().split("T")[0];

    if (isIssue) {
      await setToIssued(bookID);

      let sql = `INSERT INTO issuerecord (id , BookID,MemberID, IssueDate, DueDate) VALUES (?, ?, ?, ?, ?)`;
      connection.query(
        sql,
        [id, bookID, MemberID, issueDate, dueDate],
        (err, result) => {
          if (err) {
            console.log("error in issue", err);
          }
        },
      );

      res.json({ success: true, message: "Book Issued Successfully" });
    } else {
      await setTorejected(bookID);
      res.json({ message: "Book Rejected" });
    }
  } catch (error) {
    console.error("Error in issue", error);
  }
};

module.exports = {
  getAllRecord,
  getRecordById,
  issueRecord,
};
