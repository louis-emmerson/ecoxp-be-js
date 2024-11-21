const { fetchAllFollowingByUserID, addNewFollowingByUserID } = require("../models/following-models")

function getAllFollowingByUserID(request, response, next){
    const {user_id}= request.params
    fetchAllFollowingByUserID(user_id).then((following)=>{
        response.status(200).send({following})
    }).catch((err)=>{
        next(err)
    })
}

function patchFollowingByUserID(request, response, next){
    const {user_id} = request.params
    const newFollower_id =request.body.follower_id
 
    addNewFollowingByUserID(user_id,newFollower_id).then((newFollow)=>{
        response.status(201).send({newFollow})
    })
}

module.exports = {getAllFollowingByUserID, patchFollowingByUserID}