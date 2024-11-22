const { fetchPostcodeByUserPostcode } = require("../models/binDates-models");

function getPostcodeByUserPostcode(request, response, next) {
  const {postcode} = request.params;
  fetchPostcodeByUserPostcode(postcode)
    .then((postcode) => {
      response.status(200).send({ postcode });
    })
    .catch(next);
}

module.exports = { getPostcodeByUserPostcode };
