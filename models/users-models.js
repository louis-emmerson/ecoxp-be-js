const db = require("../db/connection");

function fetchAllUsers(query) {
  const { postcode_prefix, postcode } = query;
  let querystr = `SELECT * FROM users`;
  const params = [];

  const allowedPostcodePrefixes = ["WF", "YO", "LS"];

  if (postcode_prefix) {
    if (allowedPostcodePrefixes.includes(postcode_prefix)) {
      querystr += ` WHERE postcode LIKE $1`;
      params.push(`${postcode_prefix}%`);
    } else {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
      });
    }
  }

  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  if (postcode && !postcodeRegex.test(postcode)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid postcode format",
    });
  }

  if (postcode) {
    if (querystr.includes("WHERE")) {
      querystr += ` AND postcode = $2`;
      params.push(postcode);
    } else {
      querystr += ` WHERE postcode = $1`;
      params.push(postcode);
    }
  }
  return db.query(querystr, params).then(({ rows }) => {
    return rows;
  });
}
function fetchUserByID(user_id) {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then(({ rows, rowCount }) => {
      if (!rowCount)
        return Promise.reject({
          status: 404,
          msg: "No user with that id found",
        });
      return rows[0];
    });
}

function updateXPbyUserID(user_id, inc_xp) {
  return db
    .query(
      `
      UPDATE users
        SET xp = xp + $1
        WHERE user_id = $2
      RETURNING *
      `,
      [inc_xp, user_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No user with that id found",
        });
      }
      return rows[0];
    });
}

module.exports = { fetchAllUsers, fetchUserByID, updateXPbyUserID };
