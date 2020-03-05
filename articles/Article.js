const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

/*
* Se o desenvolvedor quiser ele pode criar apenas um dos relacionamentos abaixo,
* não sendo necessário criar ambos os relacionamento.
*/

// hasMany significa que 1 categoria TEM MUITOS artigos
Category.hasMany(Article); // Relacionamento 1:n

// belongsTo significa "pertence a"
Article.belongsTo(Category); // Representação de relacionamento 1:1

// Sincronização do modelo para criação do BD
// Após a sincronização da tabela é necessário apagar a linha abaixo para
// não ficar tentando criar a tabela toda vez que iniciar a aplicação
//Article.sync({force:true});

module.exports = Article;