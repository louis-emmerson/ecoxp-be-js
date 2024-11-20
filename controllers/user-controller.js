const { fetchAllUsers, fetchUserByID, updateXPbyUserID } = require("../models/users-models");

function getAllUsers(request, response, next) {
  const query = request.query;
  fetchAllUsers(query)
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByID(request, response, next) {
  const { user_id } = request.params;
  fetchUserByID(user_id)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function patchXPByUserID(request, response, next) {
  const { user_id } = request.params;
  const { inc_xp } = request.body;
  updateXPbyUserID(user_id, inc_xp)
    .then((updatedUser) => {
      if (!updatedUser) {
        return response.status(404).send({ msg: "User not found" });
      }
      response.status(200).send(updatedUser);
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserByID, patchXPByUserID };
