const { uuid } = require("uuidv4");
const connection = require("../dbConfig/sql");

const addNewBook = async (req, res) => {
  let id = uuid();

  try {
    let adminId = req.params.id;
    let { title, author, category, availableqty, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "File not received by server" });
    }

    let imgurl = req.file.path;

    let sql = `INSERT INTO book (id, title, author, category, availableqty,description,imgname,imgurl,addby)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    connection.query(
      sql,
      [
        id,
        title,
        author,
        category,
        availableqty,
        description,
        title,
        imgurl,
        adminId,
      ],
      (err, result) => {
        if (err) {
          res.json({ message: "Something Went Wrong" });
          return;
        } else {
          res.json({ success: true, message: "New book added sucuessfully" });
        }
      },
    );
  } catch (error) {
    console.error("error during add book", error);
  }
};

const seacrhBookByName = async (req, res) => {
  res.send("got book by name");
};

const getAllBooks = async (req, res) => {
  try {
    connection.query("SELECT * FROM book", (err, result) => {
      if (err) {
        console.error(err);
      }
      res.json(result);
    });
  } catch (error) {
    console.error("error during get all book", error);
  }
};

const getBookByID = async (req, res) => {
  try {
    let id = req.params.id;
    let sql = `SELECT * FROM book WHERE id = ?`;
    connection.query(sql, id, (err, result) => {
      if (err) {
        console.error(err);
      }
      if (result.length == 0) {
        res.json({ message: "No book Found" });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("error during get a book", error);
  }
};

const updateBook = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, author, description } = req.body;
    let sql = `UPDATE book SET title = ?, author = ?, description = ? WHERE id = ?`;
    connection.query(sql, [title, author, description, id], (err, result) => {
      if (err) {
        console.error(err);
      }
      if (result.changedRows == 0) {
        res.status(404).json({ message: "book Not Found" });
      } else {
        res.json({ message: "book Updated Succesfully" });
      }
    });
  } catch (error) {
    console.error("error during update book", error);
  }
};

const deleteBookById = async (req, res) => {
  try {
    let { id, addby } = req.params;
    let sql = `DELETE FROM book WHERE id = ? AND addby = ?`;
    connection.query(sql, [id, addby], (err, result) => {
      if (err) {
        console.error(err);
      }
      if (result.affectedRows == 0) {
        res.json({ message: "You Can''t Delete this book" });
      } else {
        res.json({ success: true, message: "Book Deleted" });
      }
    });
  } catch (error) {
    console.error("error during delete book", error);
  }
};

module.exports = {
  addNewBook,
  getAllBooks,
  getBookByID,
  updateBook,
  deleteBookById,
  seacrhBookByName,
};
