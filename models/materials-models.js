const db = require("../db/connection");

function fetchAllMaterials() {
  return db.query("SELECT * FROM materials;").then(({ rows }) => {
    return rows;
  });
}

function fetchMaterialById(material_id) {
  return db
    .query("SELECT * FROM materials WHERE material_id = $1", [material_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Material does not exist" });
      }
      return rows[0];
    });
}

module.exports = { fetchAllMaterials, fetchMaterialById };
