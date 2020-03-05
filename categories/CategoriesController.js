const express = require('express')
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/categories', (req, res) => {
  res.send('Rota de categorias');
});

router.get('/admin/categories/new', (req, res) => {
    Category.findAll({
        order: [
          ['id', 'DESC']
        ]
    }).then(categories => {
        res.render('admin/categories/new', {categories: categories});
    });        
})

router.post('/categories/save', (req, res) => {
  var title = req.body.title;
  if (title != undefined){
    Category.create({      
      title: title,
      slug: slugify(title.toLowerCase())
    }).then(()=>{
      res.redirect('/admin/categories');
    });
  } else {
    res.redirect('/admin/categories/new');
  }
})

router.post('/categories/update', (req, res) => {
  var id = req.body.categorie_id;
  var title = req.body.title;
  if (title != undefined){

    Category.update({
      title: title,
      slug: slugify(title.toLowerCase())
    }, {
      where: {
        id: id
      }
    }).then(()=>{
      res.redirect('/admin/categories');
    });
 } else { // Se for nulo
    res.redirect('/admin/categories/edit');
  }
})

router.get('/admin/categories', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', {categories:categories});
  });  
})

router.get('/admin/categories/delete/:id', (req, res) => {
  var id = req.params.id;  
  if (id != undefined) {
    if(!isNaN(id)){
      Category.destroy({
        where: {
          id:id
        }
      }).then(()=>{
        res.redirect('/admin/categories');
      });
    } else { // se o id não for número      
      res.redirect('/admin/categories');
    }
  } else { // Se for nulo
    res.redirect('/admin/categories');
  }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id).then(categorie => {
        if(categorie != undefined){
            Category.findAll({
                order: [
                    ['id', 'DESC']
                ]
            }).then(categories => {
                res.render('admin/categories/edit', {categorie:categorie, categories: categories});
            });            
        } else {
            res.redirect('/admin/categories');
        }
      }).catch(error => {
          console.log('Ocorreu um erro: '+error);
          res.redirect('/admin/categories');
      });

})

module.exports = router;