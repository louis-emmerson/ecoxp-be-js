const {
  fetchListRecyclableItems,
  fetchListRecyclableItemsById,
} = require("../models/recyclableItems-models");

function getListRecyclableItems(request, response, next) {
  fetchListRecyclableItems()
    .then((items) => {
      response.status(200).send({ items });
    })
    .catch(next);
}

function getListRecyclableItemsById(request, response, next) {
  const { council, material } = request.params;
  fetchListRecyclableItemsById(council, material)
    .then((data) => {
      response.status(200).send({ data });
    })
    .catch(next);
}

module.exports = { getListRecyclableItems, getListRecyclableItemsById };
