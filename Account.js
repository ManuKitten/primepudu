const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    accountId: String,
    password: String,
    progress: {
        completed: [String],
        individualSections: Object
    },
    streak: String,
    creationDate: String,
}, { strict: false } );

module.exports = mongoose.model('Account', accountSchema);