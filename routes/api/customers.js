const express = require("express");
const ctrl = require("../../controllers/customers");

const router = express.Router();

router.get("/", ctrl.getAllUsers);

module.exports = router;