const router=require("express").Router();

const UserController= require('../controller/user_controller');

router.post("/registration",UserController.register);
router.post('/userLogin',UserController.login);
router.put("/updateProfile", UserController.updateProfile);
router.get("/getUserInfo",UserController.getUserInfo);

module.exports= router;