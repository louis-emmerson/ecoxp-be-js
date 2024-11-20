const db = require("../db/connection")

function fetchAllUsers(postcode_prefix) {
  let querystr = `SELECT * FROM users`

  allowedPostcodePrefixs = ["WF", "YO", "LS"]

  if (postcode_prefix) {
    if (allowedPostcodePrefixs.includes(postcode_prefix)) {
      querystr += ` WHERE postcode Like '${postcode_prefix}%'`
    }else{
        return Promise.reject({
            status: 400,
            msg: "Bad Request"
          })
    }
  }
  return db.query(querystr)
  .then(({rows}) => {
    return rows
  })
}
function fetchUserByID(user_id) {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then(({ rows, rowCount }) => {
      if (!rowCount)
        return Promise.reject({
          status: 404,
          msg: "No user with that id found",
        })
      return rows[0]
    })
}

module.exports = { fetchAllUsers, fetchUserByID }
