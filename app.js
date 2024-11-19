const express = require("express")
const { getAllItems } = require("./controllers/items-controller")
const { getAllUsers, getUserByID } = require("./controllers/users-controller")
const app = express()



app.get("/api/items", getAllItems)

app.get("/api/users", getAllUsers)

app.get("/api/users/:user_id", getUserByID)

app.all("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})

app.use((err, req, res, next)=>{
    if(err.status){
    res.status(err.status).send({msg: err.msg})
    }else{
    next(err)
    }
})

app.use((err, request, response, next)=>{
    if(err.code === '22P02' || err.code === '23503'|| err.code === '23502' || err.code === '23505'){
        response.status(400).send({msg: "Bad Request"})
    }else{
        next(err)
    }
})



module.exports = app
