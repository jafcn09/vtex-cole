const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        min:1,
        max:9,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    calle: {
        type: String,
        default: ''
    },
    apartamento: {
        type: String,
        default: ''
    },
    postal :{
        type: String,
        default: ''
    },
    ciudad: {
        type: String,
        default: ''
    },
    pais: {
        type: String,
        default: ''
    },
    sexo:{
        type:String,
        required:true
    },
    fecha_nacimiento:{
        type:Date,
        required:true,
        uniqued:true,
    },
      dateCreated: {
        type: Date,
        default: Date.now,
    },

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;