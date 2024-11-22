const db = require("../db/connection");

function fetchAllLoggedItems(queries) {
  const { date, postcode } = queries;

  let queryStr = `SELECT * FROM logged_items JOIN users ON logged_items.user_id = users.user_id`;

  const valuesarray = [];

  const dateRegex = /^\d{4,4}-\d{1,2}-\d{1,2}$/;
  if (date && !dateRegex.test(date)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    });
  }

  if (date) {
    queryStr += ` WHERE date = $1`;
    valuesarray.push(date);
  }

  if (postcode) {
    if (queryStr.includes(" WHERE")) {
      queryStr += ` AND users.postcode = $2`;
      valuesarray.push(postcode);
    } else {
      queryStr += ` WHERE users.postcode = $1`;
      valuesarray.push(postcode);
    }
  }
  return db.query(queryStr, valuesarray).then(({ rows }) => {
    return rows;
  });
}

function fetchAllLoggedItemsByUserID(user_id, queries) {
  const { date, postcode } = queries;
  let queryStr = `SELECT * FROM logged_items WHERE user_id = $1`;
  const valuesarray = [user_id];

  const dateRegex = /^\d{4,4}-\d{1,2}-\d{1,2}$/;
  if (date && !dateRegex.test(date)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    });
  }

  if (date) {
    queryStr += ` AND date = $2`;
    valuesarray.push(date);
  }
  return db.query(queryStr, valuesarray).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "no logged items found by that user",
      });
    }
    return rows;
  });
}

function addLoggedItem({ item_id, user_id, date }) {
  return db
    .query(
      `INSERT INTO logged_items (item_id, user_id, date)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [item_id, user_id, date]
    )
    .then(({ rows }) => {
      if (rows.length === 0 || !rows[0].item_id || !rows[0].user_id) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
      }
      return rows[0];
    });
}

module.exports = { fetchAllLoggedItems, fetchAllLoggedItemsByUserID, addLoggedItem };
