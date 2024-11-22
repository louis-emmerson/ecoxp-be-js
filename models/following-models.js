const db = require("../db/connection")
function fetchAllFollowingByUserID(user_id) {
  return db
    .query(
      `SELECT 
    following.user_id AS original_user_id, 
    users.user_id AS follower_user_id, 
    users.username, 
    users.avatar_img_url, 
    users.postcode, 
    users.xp FROM following JOIN 
    users ON following.user_id = users.user_id WHERE following.user_id = $1`,[user_id]
    )
    .then(({rows}) => {
      return rows
    })
}

function fetchAllFollowersByUserID(user_id) {
    return db
      .query(
        `SELECT 
        following.user_id AS original_user_id, 
        users.* 
    FROM 
        following
    JOIN 
        users 
    ON 
        following.follower_id = users.user_id
    WHERE 
        following.follower_id = $1
    
`,[user_id]
      )
      .then(({rows}) => {
        return rows
      })
  }

function addNewFollowingByUserID(user_id,newFollower_id){
    const user_id_num = Number(user_id)
    const newFollower_id_num = Number(newFollower_id)
    return db.query(`INSERT INTO following (user_id, follower_id) VALUES ($1, $2)
        RETURNING *`,[user_id_num,newFollower_id_num ])
    .then(({rows})=>{
        return rows[0]
    })
}

module.exports = { fetchAllFollowingByUserID, addNewFollowingByUserID, fetchAllFollowersByUserID }

