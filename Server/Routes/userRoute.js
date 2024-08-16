const express= require("express");
const Router = express.Router();
//authentication midleware
const authMiddleware =require("../middleware/authMiddleware");
//USER controller
const {register,login,checkUsers}=require("../Controller/userController")
// register router
Router.post("/register", register);
// login user
Router.post("/login", login)
//check user
Router.get("/check",authMiddleware, checkUsers)

module.exports=Router;
