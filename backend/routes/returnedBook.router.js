const express = require("express");
const returnBookController = require("../controllers/returnedBookControllers");
const returnBookRouter = express.Router();

returnBookRouter.post("/return/:id", returnBookController.returnBook);
returnBookRouter.get("/return", returnBookController.getAllReturnedBook);
returnBookRouter.get("/return/:id", returnBookController.getReturnedBookByID);

module.exports = returnBookRouter;
