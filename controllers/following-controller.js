const { fetchAllFollowingByUserID, addNewFollowingByUserID, fetchAllFollowersByUserID } = require("../models/following-models")

function getAllFollowingByUserID(request, response, next){
    const {user_id}= request.params
    fetchAllFollowingByUserID(user_id).then((following)=>{
        response.status(200).send({following})
    }).catch((err)=>{
        next(err)
    })
}

function getAllFollowersByUserID(request, response, next){
    const {user_id}= request.params
    fetchAllFollowersByUserID(user_id).then((followers)=>{
        response.status(200).send({followers})
    }).catch((err)=>{
        next(err)
    })
}

function postFollowingByUserID(request, response, next){
    const {user_id} = request.params
    const newFollower_id =request.body.follower_id
 
    addNewFollowingByUserID(user_id,newFollower_id).then((newFollow)=>{
        response.status(201).send({newFollow})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {getAllFollowingByUserID, postFollowingByUserID,getAllFollowersByUserID}