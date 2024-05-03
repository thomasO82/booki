const bookRouter = require('express').Router();
const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const authguard = require("../services/authguard")

bookRouter.get('/addbook', authguard, async (req, res) => {
   res.render('pages/addbook.twig',
      {
         title: "Ajouter un livre - bookstore",
         user: await userModel.findById(req.session.user)
      })
})

bookRouter.post('/addbook', authguard, async (req, res) => {
   try {
      let book = new bookModel(req.body)
      book._user = req.session.user //on creer un attribut _user temporaire qui nous permettra de l'utiliser dans les hooks
      await book.save()
      res.redirect("/dashboard")
   } catch (error) {
      res.render('pages/addbook.twig',
         {
            title: "Ajouter un livre - bookstore",
            user: await userModel.findById(req.session.user),
            error: error,
         })
   }
})

bookRouter.get('/bookdelete/:bookid', authguard, async (req, res) => {
   try {
      await bookModel.deleteOne({ _id: req.params.bookid });
      res.redirect("/dashboard");
   } catch (error) {
      console.log(error.message);
      res.render('pages/dashboard.twig',
         {
            errorMessage: "Un probleme est survenu pendant la suppression",
            user: await userModel.findById(req.session.user).populate("bookCollection"),
            title: "dashboard - bookstore"
         })
   }
});

bookRouter.get('/bookupdate/:bookid', authguard, async (req, res) => {
   try {
      let book = await bookModel.findById(req.params.bookid);
      res.render('pages/addbook.twig',
         {
            title: "Modifier un livre - bookstore",
            user: await userModel.findById(req.session.user),
            book: book
         })
   } catch (error) {
      res.render('pages/dashboard.twig',
         {
            errorMessage: "Le livre que vous souhaitez modifier n'existe pas",
            user: await userModel.findById(req.session.user),
            title: "dashboard - bookstore"
         })
   }
});


bookRouter.post('/bookupdate/:bookid', authguard, async(req,res)=>{
   
      await bookModel.updateOne({_id: req.params.bookid},req.body)
      res.redirect("/dashboard")
  
})



module.exports = bookRouter