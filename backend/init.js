const { uuid } = require("uuidv4");
const connection = require("./dbConfig/sql");
const { bookData } = require("./Book");

async function initBookData(bookArray) {
  const sql = `
    INSERT INTO book
    (id, title, author, category, addby,availableqty, description, imgurl,imgname)
    VALUES ?
  `;

  const values = bookArray.map((book) => [
    uuid(), // bookId
    book.title,
    book.author,
    book.category[0], // JSON column
    book.adminId,
    book.availableqty,
    book.description,
    book.imgurl,
    book.title,
  ]);

  try {
    const [result] = await connection.query(sql, [values]);
    console.log(`✅ ${result.affectedRows} books inserted`);
    return result;
  } catch (error) {
    console.error("❌ Insert failed:", error.message);
    throw error;
  }
}

const allbooks = [...bookData];
initBookData(allbooks);
