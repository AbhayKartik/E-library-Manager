const express = require("express");
const issueRecordController = require("../controllers/issueRecordControllers");
const recordRouter = express.Router();

recordRouter.get("/record", issueRecordController.getAllRecord);
recordRouter.get("/record/:id", issueRecordController.getRecordById);
recordRouter.post("/record/:id", issueRecordController.issueRecord);

module.exports = recordRouter;
