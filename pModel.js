const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    filePath: { path: String, contentType: String },
    fileName: String

});

const pUser = mongoose.model('pUpload', UserSchema);

module.exports = pUser;