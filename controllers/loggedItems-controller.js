const {
  fetchAllLoggedItems,
  fetchAllLoggedItemsByUserID,
} = require("../models/loggedItems-models")

function getAllLoggedItems(request, response, next) {
  const queries = request.query
  fetchAllLoggedItems(queries).then((loggedItems) => {
    response.status(200).send({ loggedItems })
  }).catch((err)=>{
    next(err)
  })
}

function getLoggedItemsByUserID(request, response, next) {
  const { user_id } = request.params
  const queries = request.query 
  fetchAllLoggedItemsByUserID(user_id, queries)
    .then((loggedItems) => {
      response.status(200).send({ loggedItems })
    })
    .catch((err) => {
      next(err)
    })
}

module.exports = { getAllLoggedItems, getLoggedItemsByUserID }
