const express = require("express")
const { getAllItems } = require("./controllers/items-controller")
const app = express()

app.all("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})


app.get("/api/items", getAllItems)



module.exports = app
