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
    let [rows] = await connection.query(sql, [
      id,
      title,
      author,
      category,
      availableqty,
      description,
      title,
      imgurl,
      adminId,
    ]);
    res.json({ success: true, message: "New book added sucuessfully" });
  } catch (error) {
    console.error("error during add book", error);
    res.status(500).json({ message: "Database error" });
  }
};

const seacrhBookByName = async (req, res) => {
  res.send("got book by name");
};

const getAllBooks = async (req, res) => {
  try {
    let [rows] = await connection.query("SELECT * FROM book");

    res.json(rows);
  } catch (error) {
    console.error("error during get all book", error);
    res.status(500).json({ message: "Database error" });
  }
};

const getBookByID = async (req, res) => {
  try {
    let id = req.params.id;
    let sql = `SELECT * FROM book WHERE id = ?`;
    let [rows] = await connection.query(sql, id);
    res.json(rows);
  } catch (error) {
    console.error("error during get a book", error);
    res.status(500).json({ message: "Database error" });
  }
};

const updateBook = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, author, description } = req.body;
    let sql = `UPDATE book SET title = ?, author = ?, description = ? WHERE id = ?`;
    connection.query(sql, [title, author, description, id]);
    res.json({ success: true, message: "book Updated Succesfully" });
  } catch (error) {
    console.error("error during update book", error);
    res.status(500).json({ message: "Database error" });
  }
};

const deleteBookById = async (req, res) => {
  try {
    let { id, addby } = req.params;
    let sql = `DELETE FROM book WHERE id = ? AND addby = ?`;
    connection.query(sql, [id, addby]);
    res.json({ success: true, message: "Book Deleted" });
  } catch (error) {
    console.error("error during delete book", error);
    res.status(500).json({ message: "Database error" });
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
