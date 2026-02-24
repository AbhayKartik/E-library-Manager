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
    let [rows] = await connection.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("Error in get all issue", error);
    res.status(500).json({ message: "Database error" });
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

    let [rows] = await connection.query(sql, userId);
    res.json(rows);
  } catch (error) {
    console.error("Error in get all issue", error);
    res.status(500).json({ message: "Database error" });
  }
};

const setToIssued = async (bookId) => {
  const sql = "UPDATE pendingissue SET status = 'issued' WHERE BookID = ?";

  try {
    const [result] = await connection.query(sql, [bookId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
};

const setTorejected = async (bookId) => {
  const sql = "UPDATE pendingissue SET status = 'rejected' WHERE BookID = ?";
  try {
    const [result] = await connection.query(sql, [bookId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating rejected status:", error);
    throw error;
  }
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
      await connection.query(sql, [id, bookID, MemberID, issueDate, dueDate]);
      res.json({ success: true, message: "Book Issued Successfully" });
    } else {
      await setTorejected(bookID);
      res.json({ message: "Book Rejected" });
    }
  } catch (error) {
    console.error("Error in issue", error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  getAllRecord,
  getRecordById,
  issueRecord,
};
