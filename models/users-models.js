const db = require("../db/connection")

function fetchAllUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows
  })
}

function fetchUserByID(user_id) {
  return db
    .query("SELECT * FROM users WHERE user_id = $1;", [user_id])
    .then(({ rows, rowCount }) => {
       if(rowCount === 0){
        return Promise.reject({status:404, msg:"No user with that id found"})
       }
       return rows[0]
    })
    
}

module.exports = { fetchAllUsers, fetchUserByID }
