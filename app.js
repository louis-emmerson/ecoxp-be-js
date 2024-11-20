const express = require("express")
const { getAllItems, getItemById, getItemByBarcode } = require("./controllers/items-controller")
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handlers.js");
const { getAllUsers, getUserByID } = require("./controllers/user-controller.js");
const app = express()


app.get("/api/items", getAllItems)

app.get("/api/items/:item_id", getItemById)

app.get("/api/items/barcode/:barcode", getItemByBarcode)

app.get("/api/users", getAllUsers)

app.get("/api/users/:user_id", getUserByID)

app.all("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app
