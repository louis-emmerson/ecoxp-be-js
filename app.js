const express = require("express")
const { getAllItems } = require("./controllers/items-controller")
const app = express()

app.get("/api/items", getAllItems)

module.exports = app
