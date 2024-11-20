const db = require("../db/connection")

function fetchAllLoggedItems() {
  return db.query(`SELECT * FROM logged_items;`).then(({ rows }) => {
    return rows
  })
}

function fetchAllLoggedItemsByUserID(user_id) {
  return db
    .query(`SELECT * FROM logged_items WHERE user_id = $1;`, [user_id])
    .then(({ rows, rowCount}) => {
        if(rowCount === 0) return Promise.reject({status:404, msg:"no logged items found by that user"})
      return rows
    })
}

module.exports = { fetchAllLoggedItems, fetchAllLoggedItemsByUserID }
