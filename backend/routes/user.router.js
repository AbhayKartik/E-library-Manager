const express = require("express");
const userController = require("../controllers/userControllers");
const userRouter = express.Router();

userRouter.get("/allusers", userController.getAllUsers);
userRouter.get("/allAdmin", userController.getAllAdmin);
userRouter.post("/signup", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/userprofile/:id", userController.getUserProfile);
userRouter.put("/updateuser/:id", userController.updateUserProfile);
userRouter.delete("/deleteuser/:id", userController.deleteUserProfile);

module.exports = userRouter;
