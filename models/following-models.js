const db = require("../db/connection")
function fetchAllFollowingByUserID(user_id) {
  return db
    .query(
      `SELECT 
    following.user_id AS original_user_id, 
    users.user_id AS follower_user_id, 
    users.username, 
    users.first_name, 
    users.avatar_img_url, 
    users.postcode, 
    users.xp FROM following JOIN 
    users ON following.follower_id = users.user_id WHERE following.user_id = $1`,[user_id]
    )
    .then(({rows, rowCount}) => {
        if(rowCount === 0) return Promise.reject({status:404, msg:"No user found with that id"})
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

module.exports = { fetchAllFollowingByUserID, addNewFollowingByUserID }

