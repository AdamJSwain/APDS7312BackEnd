const mongoose = require('mongoose')

const postschema = mongoose.Schema(
    {
        department: {type: String, required:true},
        content: {type: String, required:true}
    }
)

module.exports = mongoose.model('post', postschema)