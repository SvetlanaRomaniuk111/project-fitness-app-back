const express = require("express");
const ctrl = require("../../controllers/customerSettings");
const { authenticate, validateBody } = require("../../midlewares");
const { addSchema } = require("../../models/customer");

const router = express.Router();

router.get("/", ctrl.getAllUsers);
router.post('/settings', authenticate, validateBody(addSchema), ctrl.setProfileSettings)

module.exports = router;