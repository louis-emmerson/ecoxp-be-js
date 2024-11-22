const db = require("../db/connection");

function fetchPostcodeByUserPostcode(postcode) {
  return db.query(`SELECT * FROM postcodes WHERE postcode = $1`, [postcode]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Postcode does not exist on the system" });
    }
    return rows[0];
  });
}

module.exports = { fetchPostcodeByUserPostcode };
