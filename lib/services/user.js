'use strict';

var Users = require('../users.json');

var internals = {};
internals.users = Users;

exports.setUsers = function(users) {
    internals.users = users;
};

exports.getById = function(id) {
    return internals.users.find(function(user) {
        return user.id === id;
    });
};

exports.getByEmail = function(email) {
    return internals.users.find(function(user) {
        return user.email === email;
    });
};