const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

// const checkFine = (id, date) => {
//   return new Promise((resolve, resject) => {
//     let sql = `SELECT DueDate FROM issuerecord WHERE BookID = ?`;
//     connection.query(sql, id, (err, result) => {
//       if (err) return resject(err);
//       console.log(result);
//       console.log(result[0] < date);
//       resolve(result[0] < date);
//     });
//   });
// };

const setFine = (book, returnDate) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE issuerecord SET fine = CASE WHEN ? > DueDate THEN DATEDIFF(ReturnDate, DueDate) * 10 ELSE 0
END ,ReturnDate =? WHERE BookID =?`;
    connection.query(sql, [returnDate, returnDate, book], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const checkBookInIssue = (bookId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM issuerecord WHERE BookID =?`;
    connection.query(sql, bookId, (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0);
    });
  });
};
const returnBook = async (req, res) => {
  try {
    let id = req.params.id;
    // let { title, author, bookid } = req.body;
    let { bookid } = req.body;
    let today = new Date();
    let returnDate = today.toISOString().split("T")[0];
    await setFine(bookid, returnDate);

    // let sql = ` INSERT INTO returnedbook (title,author,returnDate,fromuser) Value (?, ?, ?, ?)`;
    let bookInIssue = await checkBookInIssue(bookid);
    if (!bookInIssue) {
      return res.json({ message: "Book Doesn't belong to Issue" });
    }
    // connection.query(sql, [title, author, returnDate, id], (err, result) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.json({ message: "You have returned the book" });
    //   }
    // });
    res.json({ success: true, message: "Book Returned Successfully" });
  } catch (error) {
    console.error("Error in return", error);
  }
};

const getAllReturnedBook = async (req, res) => {
  try {
    let sql = `SELECT * FROM returnedbook`;
    connection.query(sql, (err, result) => {
      if (err) {
        return err;
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("Error in return", error);
  }
};

const getReturnedBookByID = async (req, res) => {
  try {
    let userId = req.params.id;
    let sql = `SELECT * FROM returnedbook WHERE fromuser = ?`;
    connection.query(sql, userId, (err, resukt) => {
      if (err) {
        return err;
      } else {
        res.json(resukt);
      }
    });
  } catch (error) {
    console.error("Error in return", error);
  }
};

module.exports = {
  returnBook,
  getAllReturnedBook,
  getReturnedBookByID,
};
