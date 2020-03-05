const express = require('express')
const router = express.Router();
const Article = require('./Article');
const Category = require('../categories/Category');
const slugify = require('slugify');


router.get('/admin/articles', (req, res) => {
    Article.findAll({
        order: [
          ['id', 'DESC']
        ],
        include:[{model: Category}]
    }).then(articles => {
        Category.findAll().then(categories => {
          res.render('admin/articles/index.ejs', {articles: articles, categories: categories});
        });        
    });    
});

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then(categories=>{
    res.render('admin/articles/new',{categories: categories});
  })  
})

router.post('/articles/save', (req, res) => {
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.create({
    title: title,
    body: body,    
    slug: slugify(title.toLowerCase()),
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles');
  });  
})

router.post('/articles/update', (req, res) => {
    var id = req.body.article_id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    if (title != undefined){
        Article.update({
          title: title,
          slug: slugify(title.toLowerCase()),
          body: body,
          categoryId: category
        }, {
          where: {
            id: id
          }
        }).then(()=>{
          res.redirect('/admin/articles');
        });
    } else { // Se for nulo
        res.redirect('/admin/articles/edit');
    }
})

router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;
    
    if(isNaN(id)){ //Verifica se existe o id passado no get, se não existir retornar para tela de listagem
        res.redirect('/admin/articles');
    }

    Article.findByPk(id).then(article => {
        if (article != undefined){
            Category.findAll().then(categories => { // Linha necessária para preencher a navbar
              res.render('admin/articles/edit', {article: article, categories: categories})  
            });
        } else {
            res.redirect('/admin/articles/edit')
        }
    });   
})

router.get('/admin/articles/delete/:id', (req, res) => {
    var id = req.params.id;  
    if (id != undefined) {
        if(!isNaN(id)){
          Article.destroy({
            where: {
              id:id
            }
          }).then(()=>{
            res.redirect('/admin/articles');
          });
        } else { // se o id não for número      
          res.redirect('/admin/articles');
        }
    } else { // Se for nulo
        res.redirect('/admin/articles');
    }
})

router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 0 || page == 1){
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 4; // O offset deve ser igual ao offset multiplado pelo qnt de registros na
    }
    
    // Esse método pesquisa todos os elemntos no BD retornando a quantidade de elementos nessa tabela
    Article.findAndCountAll({
        limit: 4, // limita a quantidade de registro por listagem
        offset: offset, // Retorna dados a partir de um valor. Ex.: retornar os artigos após o 10º registro. Assim, o offset faz com que apareçam os artigos do 10º ao 14º
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        var next;
        
        if(offset + 4 >= articles.count){ // Verifica se a quntidade de artigos ultrapassou a qnt de artigos existentes no banco de dados
            next = false
        } else {
            next = true;
        }

        var result = {
          next: next,
          articles: articles
        }

        res.json(result);
    });
})

module.exports = router;