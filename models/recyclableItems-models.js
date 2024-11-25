const db = require("../db/connection");

function fetchListRecyclableItems() {
  return db.query(`SELECT * FROM council_material_recyclability`).then(({ rows }) => {
    return rows;
  });
}

function fetchListRecyclableItemsById(council, material) {
  return db
    .query("SELECT * FROM council_material_recyclability WHERE council = $1 AND material = $2", [
      council,
      material,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "The postcode prefix or material you have entered does not exist",
        });
      }
      return rows[0];
    });
}

module.exports = { fetchListRecyclableItems, fetchListRecyclableItemsById };
