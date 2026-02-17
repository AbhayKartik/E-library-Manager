const express = require("express");
const bookController = require("../controllers/bookControllers");
const bookRouter = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig/cloudConfig");
const upload = multer({ storage });
bookRouter.get("/allbooks", bookController.getAllBooks);
bookRouter.post(
  "/addbook/:id",
  upload.single("imgurl"),
  bookController.addNewBook,
);
bookRouter.delete("/book/:id/:addby", bookController.deleteBookById);

module.exports = bookRouter;
