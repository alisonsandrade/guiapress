const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

// Carregar view engine
app.set('view engine', 'ejs');

//Configuração do body-parser para trabalhar com formulários
app.use(bodyParser.urlencoded({extends: false}));
app.use(bodyParser.json());

// Configuração de carregamento dos arquivos estáticos
app.use(express.static('public'));

// Conexão com o bando de dados
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso ao BD');
    }).catch((error)=> {
        console.log('Erro ao tentar conectar o BD. '+error);
    });

app.use('/', categoriesController);
app.use('/', articlesController);


app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        include:[{model: Category}]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index.ejs', {articles: articles, categories: categories});
        });        
    });    
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article,
            include: [{model: Category}],
        }]    
    }).then(article => {
        if (article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            }); 
        } else {
            res.redirect('/');
        }
    }).catch(error => {
        console.log('Ocorreu um erro: '+error);
        res.redirect('/');
    });
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] //Serve como um join para ligar category e article
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        } else {
            res.redirect('/');
        }
    }).catch(error => {
        console.log('Ocorreu um erro: '+error)
        res.redirect('/');
    });
})

// Iniciando o servidor do express
app.listen(8080, () => {
    console.log('Servidor iniciado com sucesso! Porta: 8080');
});




// www.tiny.cloud/get-tiny/self-hosted