const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const setFine = async (book, returnDate) => {
  try {
    let sql = `UPDATE issuerecord SET fine = CASE WHEN ? > DueDate THEN DATEDIFF(ReturnDate, DueDate) * 10 ELSE 0
END ,ReturnDate =? WHERE BookID =?`;
    let [result] = await connection.query(sql, [returnDate, returnDate, book]);
    return result;
  } catch (error) {
    console.error("Error set Fine:", error);
    throw error;
  }
};

const checkBookInIssue = async (bookId) => {
  try {
    let sql = `SELECT * FROM issuerecord WHERE BookID =?`;
    let [result] = await connection.query(sql, bookId);
    return result.length > 0;
  } catch (error) {
    console.error("Error checkbook in issue:", error);
    throw error;
  }
};
const returnBook = async (req, res) => {
  try {
    let id = req.params.id;
    let returnedID = uuid();
    let { bookid, title, email, username } = req.body;
    let today = new Date();
    let returnDate = today.toISOString().split("T")[0];
    await setFine(bookid, returnDate);

    let sql = ` INSERT INTO returnedbook (title,returnDate,fromuser,Library,LibraryEmail,id) Value (?, ?, ?, ?)`;
    let bookInIssue = await checkBookInIssue(bookid);
    if (!bookInIssue) {
      return res.json({ message: "Book Doesn't belong to Issue" });
    }
    await connection.query(sql, [
      title,
      returnDate,
      id,
      username,
      email,
      returnedID,
    ]);
    res.json({ success: true, message: "Book Returned Successfully" });
  } catch (error) {
    console.error("Error in return", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getAllReturnedBook = async (req, res) => {
  try {
    let sql = `SELECT * FROM returnedbook`;
    let [result] = await connection.query(sql);
    res.json(result);
  } catch (error) {
    console.error("Error in return", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getReturnedBookByID = async (req, res) => {
  try {
    let userId = req.params.id;
    let sql = `SELECT * FROM returnedbook WHERE fromuser = ?`;
    let [result] = await connection.query(sql, userId);
    res.json(result);
  } catch (error) {
    console.error("Error in return", error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  returnBook,
  getAllReturnedBook,
  getReturnedBookByID,
};
