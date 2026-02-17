const express = require("express");
const pendingIssueController = require("../controllers/pendingIssueControllers");
const pendingIssueRouter = express.Router();

pendingIssueRouter.get("/pending/:id", pendingIssueController.getPendingIssue);
pendingIssueRouter.get(
  "/pendingforuser/:id",
  pendingIssueController.getPendingIssueForUser,
);
pendingIssueRouter.post("/pending/:id", pendingIssueController.assignInPending);

module.exports = pendingIssueRouter;
