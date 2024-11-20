const express = require("express");
const { getAllItems, getItemById, getItemByBarcode } = require("./controllers/items-controller");
const { getAllMaterials, getMaterialById } = require("./controllers/materials-controller");
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handlers.js");
const app = express();

app.get("/api/items", getAllItems);

app.get("/api/items/:item_id", getItemById);

app.get("/api/items/barcode/:barcode", getItemByBarcode);

// Materials
app.get("/api/materials", getAllMaterials);

app.get("/api/materials/:material_id", getMaterialById);

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Route not found!" });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
