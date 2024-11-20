const { fetchAllMaterials, fetchMaterialById } = require("../models/materials-models");

function getAllMaterials(request, response, next) {
  fetchAllMaterials()
    .then((materials) => {
      response.status(200).send({ materials });
    })
    .catch(next);
}

function getMaterialById(request, response, next) {
  const { material_id } = request.params;
  fetchMaterialById(material_id)
    .then((material) => {
      response.status(200).send({ material });
    })
    .catch(next);
}

module.exports = { getAllMaterials, getMaterialById };
