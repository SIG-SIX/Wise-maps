const { Client: Client7 } = require("@elastic/elasticsearch");
const { ES } = require("../conf.json");

const insertElastic = async (_index, _data) => {
  try {
    const client = new Client7({ node: ES.IP });
    let response = await client.index({
      index: _index,
      body: _data,
    });
    await client.close();
    return response;
  } catch (error) {
    console.log(error);
    return {
      err: true,
      errMsg: error,
      data: _data,
    };
  }
};

const searchElastic = async (search, index_dest) => {
  try {
    const client = new Client7({ node: ES.IP });
    let { body } = await client.search({
      index: index_dest,
      body: search,
    });
    await client.close();
    return body;
  } catch (error) {
    console.log(error);
    return {
      search,
      err: true,
    };
  }
};

const deleteElastic = async (query, index_dest) => {
  try {
    const client = new Client7({ node: ES.IP });
    let { body } = await client.deleteByQuery({
      index: index_dest,
      body: query,
    });

    await client.close();
    return body;
  } catch (error) {
    return {
      err: true,
      error,
      query,
    };
  }
};

const searchMultipleKeyElastic = async (
  keyValArr = [],
  index_dest,
  option = "search",
  boolOption = "must",
  agg = null,
  size = 10000
) => {
  try {
    let query = {
      query: {
        match_all: {},
      },
      size: 10000,
    };

    if (keyValArr.length)
      query = {
        query: {
          bool: {
            [boolOption]: [
              keyValArr.map((elem) => {
                return {
                  [elem.method]: {
                    [elem.key]: elem.value,
                  },
                };
              }),
            ],
          },
        },
        size: size,
      };

    if (agg !== null)
      query.aggs = {
        ...agg,
      };

    switch (option) {
      case "delete":
        return await deleteElastic(query, index_dest);
      default:
        return await searchElastic(query, index_dest);
    }
  } catch (error) {
    console.error(error);
    return {
      error,
      query,
      err: true,
    };
  }
};

const updateElastic = async (_index, _id, updatedData) => {
  try {
    const client = new Client7({ node: ES.IP });

    let response = await client.update({
      id: _id,
      index: _index,
      body: {
        doc: updatedData,
      },
    });
    await client.close();
    return response;
  } catch (error) {
    console.log(error);
    return {
      err: true,
      errMsg: error,
    };
  }
};

module.exports = {
  insertElastic,
  searchMultipleKeyElastic,
  searchElastic,
  deleteElastic,
  updateElastic,
};
