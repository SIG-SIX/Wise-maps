const express = require("express");
const pointsController = require("../controllers/PointsController");

const router = express.Router();

router.get("/getpoints", pointsController.getAllPoints);

module.exports = router;
