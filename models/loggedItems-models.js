const db = require("../db/connection")
const dateCheck = require("../utils/date-check")
const { postcodeCheck, postcodePrefixCheck } = require("../utils/postcode-checks")

function fetchAllLoggedItems(queries) {
  const { date, postcode, postcode_prefix, start, end } = queries

  let queryStr = `SELECT * FROM logged_items JOIN items ON logged_items.item_id = items.item_id JOIN materials ON items.material_id = materials.material_id JOIN USERS ON logged_items.user_id = users.user_id`

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

  if (postcode && !postcodeCheck(postcode)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid postcode format",
    })
  }

  if (postcode_prefix && !postcodePrefixCheck(postcode_prefix)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid postcode_prefix format",
    })
  }


  if (postcode) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE users.postcode = $1`
      valuesarray.push(postcode)
    } else {
      queryStr += ` AND users.postcode = $${valuesarray.length + 1}`
      valuesarray.push(postcode)
    }
  }

  if (postcode_prefix) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE users.postcode LIKE $1`
      valuesarray.push(`${postcode_prefix}%`)
    } else {
      queryStr += ` AND users.postcode LIKE $${valuesarray.length + 1}`
      valuesarray.push(`${postcode_prefix}%`)
    }
  }

  if (date) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE logged_items.date = $1`
      valuesarray.push(date)
    } else {
      queryStr += ` AND logged_items.date = $${valuesarray.length + 1}`
      valuesarray.push(date)
    }
  }

  return db.query(queryStr, valuesarray).then(({ rows }) => {
    return rows
  })
}

function fetchAllLoggedItemsByUserID(user_id, queries) {
  const { date, start, end } = queries
  let queryStr = `SELECT * FROM logged_items JOIN items ON logged_items.item_id = items.item_id JOIN materials ON items.material_id = materials.material_id WHERE user_id = $1`
  const valuesarray = [user_id]

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
    queryStr += ` AND logged_items.date BETWEEN $2 AND $3`
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


  if (date) {
    if (valuesarray.length === 0) {
      queryStr += ` WHERE logged_items.date = $2`
      valuesarray.push(date)
    } else {
      queryStr += ` AND logged_items.date = $${valuesarray.length + 1}`
      valuesarray.push(date)
    }
  }
  return db.query(queryStr, valuesarray).then(({ rows }) => {
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
