const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v);
            },
            message: "Entrez un nom valide"
        },
    },
    firstname: {
        type: String,
        required: [true, "Le prénom est requis"],
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
            },
            message: "Entrez un mail valide"
        },
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
            },
            message: "Entrez un mot de passe valide"
        },
    },
    bookCollection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }]
});

userSchema.pre("validate", async function (next) {
    try {
        // Vérifiez si l'email est unique
        const existingUser = await this.constructor.findOne({ email: this.email });
        if (existingUser) {
            this.invalidate("email", "Cet email )est déjà enregistré."); //methode invalidate qui permet de generer une erreur de validation
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) { 
        return next();
    }
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash;
        next();
    });
});

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;







