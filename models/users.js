const mongoose = require('mongoose')
const  userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: false
    },
    married:{
        type: String,
        required:false
    }
})

module.exports = mongoose.model('Users', userSchema)