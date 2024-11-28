const endpoints = require("../endpoints.json")
function getAllEndpoints(request,response,next){
        response.status(200).send({endpoints})
}

module.exports = {getAllEndpoints}