const { fetchAllUsers, fetchUserByID } = require("../models/users-models")

function getAllUsers(request, response,next){
    const {postcode_prefix}=request.query
    fetchAllUsers(postcode_prefix).then((users)=>{
        response.status(200).send({users})
    }).catch((err)=>{
        next(err)
    })
}

function getUserByID(request, response,next){
    const {user_id} = request.params
    fetchUserByID(user_id).then((user)=>{
        response.status(200).send({user})
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {getAllUsers, getUserByID}