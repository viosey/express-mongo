const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const jwtMW = require("../../middlewares/jwt.mw");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/vt", jwtMW.verifyToken);

module.exports = router;
