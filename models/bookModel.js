const mongoose = require('mongoose');
const userModel = require('./userModel');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Entrez un titre valide"
        },
    },
    author: {
        type: String,
        required: [true, "L'auteur est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Entrez un nom d'auteur valide"
        },
    },
    publishedDate: {
        type: Date,
        required: [true, "La date de publication est requise"],
    },
});


bookSchema.pre("save", async function (next) {
    await userModel.updateOne(
        { _id: this._user },
        { $addToSet: { bookCollection: this._id } }
    );
    next();
});



bookSchema.post("deleteOne", async function () {
    const deletedBookId = this.getQuery()._id;
    await userModel.updateOne({ bookCollection: { $in: [deletedBookId] } },{$pull: {bookCollection : deletedBookId}});   
});


const bookModel = mongoose.model("Books", bookSchema);
module.exports = bookModel;
