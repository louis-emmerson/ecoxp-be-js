const {
  fetchAllLoggedItems,
  fetchAllLoggedItemsByUserID,
} = require("../models/loggedItems-models")

function getAllLoggedItems(request, response) {
  fetchAllLoggedItems().then((loggedItems) => {
    response.status(200).send({ loggedItems })
  })
}

function getLoggedItemsByUserID(request, response, next) {
  const { user_id } = request.params
  fetchAllLoggedItemsByUserID(user_id)
  .then((loggedItems) => {
    response.status(200).send({loggedItems})
  }).catch((err)=>{
    next(err)
  })
}

module.exports = { getAllLoggedItems, getLoggedItemsByUserID }
