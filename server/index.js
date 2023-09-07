const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("@elastic/elasticsearch");
const { ES } = require("./conf.json");
const client = new Client({ node: ES.IP });
const path = require("path");

const pointsRoutes = require("./routes/PointsRoutes");

async function checkConnection() {
  try {
    await client.ping();
    console.log("Connected to Elasticsearch");
  } catch (error) {
    console.error("Elasticsearch connection error:", error);
  }
}

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(bodyParser.json());
app.use(cors());
app.use("/maps", pointsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { client };
