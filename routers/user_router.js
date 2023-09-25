const router=require("express").Router();

const UserController= require('../controller/user_controller');

router.post("/registration",UserController.register);
router.post('/login',UserController.login);
router.put("/updateProfile", UserController.updateProfile);
router.get("/getUserInfo",UserController.getUserInfo);

module.exports= router;