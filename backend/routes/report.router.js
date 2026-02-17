const express = require("express");
const reportsController = require("../controllers/reportsControllers");
const reportRouter = express.Router();

reportRouter.post("/report/:id", reportsController.genReport);
reportRouter.get("/report/:id", reportsController.getReportById);

module.exports = reportRouter;
