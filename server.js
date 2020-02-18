//Configurando o servidor
const express = require("express")
const server = express()

//Configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

//Configurar a conexão com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: 'd7l1q0',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

//Configurando Nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true
})


//Lista de doadores : Vetor ou Array



//Configurando apresentação da página
server.get("/", function (req, res) {
  db.query("SELECT * FROM donors", function(err, result){
    if(err) return res.send("ERRO DE BANCO DE DADOS")
    const donors = result.rows

    return res.render("index.html", { donors })
  })
})

server.post("/", function (req, res) {
  //Pegar dados do formulário 
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios")

  }

  //Colocando valores dentro do banco de dados
  const query =
    `INSERT INTO donors ("name", "email", "blood") 
              VALUES($1, $2, $3)`

  const values = [name, email, blood]
  db.query(query, values, function (err) {
    if (err) return res.send("erro no banco de dados")
    return res.redirect("/")


  })

})

//Ligando o servidor e permitindo o acesso na porta 8000
server.listen(8000, function () {
  console.log("Iniciei o servidor")
})