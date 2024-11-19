const express = require("express")
const { getAllItems } = require("./controllers/items-controller")
const app = express()



app.get("/api/items", getAllItems)

app.all("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})


module.exports = app
