const { client } = require("../index");
const { ES } = require("../conf.json");
const { Client: Client7 } = require("@elastic/elasticsearch");

const { searchMultipleKeyElastic } = require("../db/elastic");

exports.getAllPoints = async (req, res) => {
  try {
    const points = await searchMultipleKeyElastic(
      [],
      ES.INDEX_DATE,
      "search",
      "must",
      null,
      10000
    );

    const pointsData = points.hits.hits;

    return res.send({ pointsData });
  } catch (e) {
    return res.status(455).send({
      error: "Error at getting all users " + e,
    });
  }
};
