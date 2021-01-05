const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    fileData: { data: Buffer, contentType: String },
    fileName: String

});

const bUser = mongoose.model('bUpload', UserSchema);

module.exports = bUser;