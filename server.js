// configurando o servidor
const express = require('express')
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'turmadobs2012',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// configurando a template engine (permite o envio de dados para dentro do html)
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true //Boolean ou booleano aceita 2 valores, verdadeiro ou falso
})



// configurar a apresentação da página
server.get('/', function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send('Erro no banco de dados.')

        const donors = result.rows
        return res.render('index.html', { donors }) 
    })

})


server.post('/', function(req, res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // se o name for vazio
    // ou o email for vazio
    // ou o blood for vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) return res.send("Erro no banco de dados.")


        // fluxo ideal
        return res.redirect('/')
    })
})



// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log('iniciando servidor')
})