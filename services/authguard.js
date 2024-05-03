const userModel = require('../models/userModel')

const authguard = async (req, res, next) => {
    try {
        errorAuth = req.session.errorAuth
        delete req.session.errorAuth
        if (req.session.user) {

            let user = await userModel.findOne({ _id: req.session.user });
            if (user) {
                return next(); // Utilisateur trouvé dans la base de données, autorisez l'accès à la route suivante
            }
        }
        throw new Error("Utilisateur non connecté");
    } catch (error) {
        req.session.errorAuth = errorAuth
        res.redirect("/login")
    }
};

module.exports = authguard