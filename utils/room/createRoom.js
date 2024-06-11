const { v4: uuidv4 } = require('uuid');

module.exports = () => ({id: uuidv4(), cardset: []});