const db = require("../db/connection")
const dateCheck = require("../utils/date-check")

function fetchAllLoggedItems(queries) {
  const { date, postcode, start, end } = queries

  let queryStr = `SELECT * FROM logged_items JOIN users ON logged_items.user_id = users.user_id`

  const valuesarray = []

  if (date && !dateCheck(date)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    })
  }
  if (start && !dateCheck(start)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    })
  }
  if (end && !dateCheck(end)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    })
  }

  if (start && end) {
    queryStr += `  WHERE logged_items.date BETWEEN $1 AND $2`
    valuesarray.push(start)
    valuesarray.push(end)
  }

  if (!start && end) {
    queryStr += `  WHERE logged_items.date <= $1`
    valuesarray.push(end)
  }

  if (start && !end) {
    queryStr += `  WHERE logged_items.date >= $1`
    valuesarray.push(start)
  }

  if (postcode) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE users.postcode = $1`
      valuesarray.push(postcode)
    } else {
      queryStr += ` AND users.postcode = $3`
      valuesarray.push(postcode)
    }
  }

  if (date) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE logged_items.date = $1`
      valuesarray.push(date)
    } else {
      queryStr += ` AND users.postcode = $${valuesarray.length + 1}`
      valuesarray.push(date)
    }
  }
  return db.query(queryStr, valuesarray).then(({ rows }) => {
    return rows
  })
}

function fetchAllLoggedItemsByUserID(user_id, queries) {
  const { date } = queries
  let queryStr = `SELECT * FROM logged_items JOIN items ON logged_items.item_id = items.item_id JOIN materials ON items.material_id = materials.material_id WHERE user_id = $1`
  const valuesarray = [user_id]

  if (date && !dateCheck(date)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid date format",
    })
  }

  if (date) {
    queryStr += ` AND date = $2`
    valuesarray.push(date)
  }
  return db.query(queryStr, valuesarray).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "no logged items found by that user",
      })
    }
    return rows
  })
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
        return Promise.reject({ status: 400, msg: "Missing required fields" })
      }
      return rows[0]
    })
}

module.exports = {
  fetchAllLoggedItems,
  fetchAllLoggedItemsByUserID,
  addLoggedItem,
}
