//userRouter.js
const userRouter = require('express').Router();
const userModel = require('../models/userModel')
const authguard = require("../services/authguard")
const bcrypt = require('bcrypt')

userRouter.get('/subscribe', (req, res) => {
   res.render('pages/subscribe.twig',
      {
         title: "inscription - bookstore"
      })
})

userRouter.post("/subscribe", async (req, res) => {
   try {
      const user = new userModel(req.body);
      await user.save();
      res.redirect('/login')
   } catch (error) {
      res.render('pages/subscribe.twig',
         {
            error: error,
            title: "inscription - bookstore"
         })
   }
});

userRouter.get('/login', (req, res) => {
   const errorAuth = req.session.errorAuth // on creer une variable de session error auth qui sauvegarde le message d'erreur du authguard
   delete req.session.errorAuth // on delete l'erreur dans la session, pour eviter qu'au refresh, elle se réaffiche, on ne veux l'afficher qu'une fois
   res.render('pages/login.twig',
      {
         title: "connexion - bookstore",
         errorAuth: errorAuth
      })
})


userRouter.post('/login', async (req, res) => {
   try {
      let user = await userModel.findOne({ email: req.body.email }) //on recherche l'utilisateur
      if (user) { //si il existe
         if (await bcrypt.compare(req.body.password, user.password)) { //on compare les mots de passe
            req.session.user = user._id //on stock l'id de l'utilisateur en session
            res.redirect('dashboard') // on redirige vers la future route dahsboard
         } else {
            throw { password: "Mauvais mot de passe" } // on releve l'exception mot de passe
         }
      } else {
         throw { email: "Cet utilisateur n'est pas enregistrer" } // on releve l'exception si l'user n'existe pas
      }
   } catch (error) {
      // on rend la vue connexion avec l'erreur
      res.render('pages/login.twig',
         {
            title: "connexion - bookstore",
            error: error
         })
   }
})


userRouter.get('/dashboard', authguard, async (req, res) => {
   res.render('pages/dashboard.twig',
      {
         // on recupere l'utilisateur qui est connecter, on peuple de book, sa propriété bookCollection et le passe a la vue
         user: await userModel.findById(req.session.user).populate("bookCollection"),
         title: "dashboard - bookstore"
      })
})






module.exports = userRouter