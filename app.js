const express = require("express")
const {
  getAllItems,
  getItemById,
  getItemByBarcode,
  postNewItem,
} = require("./controllers/items-controller")
const {
  getAllMaterials,
  getMaterialById,
} = require("./controllers/materials-controller")
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers.js")
const {
  getAllLoggedItems,
  getLoggedItemsByUserID,
  postLoggedItem,
} = require("./controllers/loggedItems-controller.js")
const {
  getAllUsers,
  getUserByID,
  patchXPByUserID,
} = require("./controllers/user-controller.js")

const cors = require("cors")
const {
  getAllFollowingByUserID,
  postFollowingByUserID,
  getAllFollowersByUserID,
} = require("./controllers/following-controller.js")
const {
  getPostcodeByUserPostcode,
} = require("./controllers/binDates-controllers.js")
const {
  getListRecyclableItems,
  getListRecyclableItemsById,
} = require("./controllers/recyclable-items-controllers.js")
const { getAllEndpoints } = require("./controllers/endpoints-controller.js")

const app = express()

app.use(cors())

app.use(express.json())

app.get("/api", getAllEndpoints)

// Items
app.get("/api/items", getAllItems)
app.get("/api/items/:item_id", getItemById)
app.get("/api/items/barcode/:barcode", getItemByBarcode)
app.post("/api/items", postNewItem)

// Materials
app.get("/api/materials", getAllMaterials)

app.get("/api/materials/:material_id", getMaterialById)

// Users
app.get("/api/users", getAllUsers)

app.get("/api/users/:user_id", getUserByID)

app.patch("/api/users/:user_id", patchXPByUserID)

//Logged Items
app.get("/api/logged-items", getAllLoggedItems)
app.get("/api/:user_id/logged-items", getLoggedItemsByUserID)
app.post("/api/logged-items", postLoggedItem)

//following
app.get("/api/:user_id/following", getAllFollowingByUserID)

app.get("/api/:user_id/followers", getAllFollowersByUserID)

app.post("/api/:user_id/following", postFollowingByUserID)

// Bin dates
app.get("/api/postcodes/:postcode", getPostcodeByUserPostcode)

// Recyclable items
app.get("/api/recyclability", getListRecyclableItems)
app.get("/api/recyclability/:council/:material", getListRecyclableItemsById)

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Route not found!" })
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
