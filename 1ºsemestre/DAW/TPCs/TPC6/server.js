var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static')

var {parse} = require('querystring')

// Funções auxilidares
// Retrieves student info from request body --------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', function(bloco) {
            body += bloco.toString()
        })
        request.on('end', function(){
            console.log(body)
            callback(parse(body))
        })
    }
}

// POST Confirmation HTML Page Template -------------------------------------
function geraPostConfirm( t, d){
    return `
    <html>
    <head>
        <title>POST receipt: ${t.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${t.id} inserida</h1>
            </header>
            <div class="w3-container">
                <p><a href="/tasks/${t.id}">Aceda aqui à sua página.</a></p>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por André Morais :: DAW2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraDeleteTask(d){
    return `
    <html>
    <head>
        <title>DELETE receipt</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa apagada</h1>
            </header>
            <footer class="w3-container w3-teal">
                <address>Gerado por André Morais :: DAW2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

// Template para a página com a lista de tarefas ------------------
function geraPagTarefas(tarefas, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de tarefas</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>Lista de Tarefas</h2>
            </div>
            <center><u><h3>Tarefas por fazer</u></h3></center>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoria</th>
                    <th>Data de criação</th>
                    <th>Data de entrega</th>
                    <th>Editar</th>
                </tr>
  `
    tarefas.forEach(t => {
        if(t.done == "false"){
            pagHTML += `
                <tr>
                    <td><a href="/tasks/${t.id}">${t.title}</td>
                    <td>${t.person}</td>
                    <td>${t.category}</td>
                    <td>${t.creation_date}</td>    
                    <td>${t.due_date}</td>
                    <td>
                    <button onclick="window.location.href='http://localhost:7778/tasks/${t.id}/edit';"> 
                    <img width="100" height="100" src="https://media1.tenor.com/images/26367b882196bab0348c173ec61d9268/tenor.gif"/>
                </button>
                    </td>
                </tr>
            `
        }
  });
    pagHTML += `
            </table>
            <center><h3><u>Tarefas feitas</u></h3></center>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoria</th>
                    <th>Data de criação</th>
                    <th>Data de entrega</th>
                    <th>Apagar</th>
                </tr>
    `
    tarefas.forEach(t => {
        if(t.done == "true"){
            pagHTML += `
                <tr>
                    <td><a href="/tasks/${t.id}">${t.title}</td>
                    <td>${t.person}</td>
                    <td>${t.category}</td>
                    <td>${t.creation_date}</td>    
                    <td>${t.due_date}</td>
                    <td>
                    <button onclick="window.location.href='http://localhost:7778/tasks/${t.id}/delete';"> 
                        <img width="120" height="100" src="https://i.kym-cdn.com/photos/images/original/001/472/815/36f.jpg"/>
                    </button>
                    </td>
                </tr>
            `
        }
});

  pagHTML += `
        </table>
        <button onclick="window.location.href='http://localhost:7778/tasks/registo';">
            Nova Tarefa
           <img width="100" height="100" src="https://media.tenor.com/images/6eab85d212226d1af8c09bf2103ee955/tenor.gif"/>
        </button>
        <div class="w3-container w3-teal">
            <address>Gerado por André Morais :: DAW2020 em ${d}</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}

// Template para a página de tarefa -------------------------------------
function geraTask( t, d ){
    return `
    <html>
    <head>
        <title>Tarefa: ${t.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="../w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${t.id}</h1>
            </header>
            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Título: </b>${t.title}</li>
                    <li><b>Descrição: </b>${t.description}</li>
                    <li><b>Autor: </b>${t.person}</li>
                    <li><b>Categoria: </b>${t.category}</li>
                    <li><b>Data de criação: </b>${t.creation_date}</li>
                    <li><b>Data de entrega: </b>${t.due_date}</li>
                    <li><b>Feito: </b>${t.done}</li>
                </ul>
            </div>
            <footer class="w3-container w3-teal">
                <address>Gerado por André Morais :: DAW2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

// Template para o formulário de tarefa ------------------
function geraFormTask( d ){
    return `
    <html>
        <head>
            <title>Registo de uma tarefa</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de Tarefa</h2>
            </div>
            <form class="w3-container" action="/tasks" method="POST">
                <label class="w3-text-teal"><b>Título</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="title">
          
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="description">
                <label class="w3-text-teal"><b>Autor</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="person">
                <label class="w3-text-teal"><b>Categoria</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="category">
          
                <label class="w3-text-teal"><b>Data de criação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="creation_date" value="${d}">
                <label class="w3-text-teal"><b>Data de entrega</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="due_date">
                <label class="w3-text-teal"><b>Feito</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="done">
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
            <footer class="w3-container w3-teal">
                <address>Gerado por André Morais :: DAW2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </body>
    </html>
    `
}

function geraForm2Task(t,d){
    return `
    <html>
        <head>
            <title>Alteração da tarefa: ${t.id}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Alteração da tarefa: ${t.id}</h2>
            </div>
            <form class="w3-container" action="/tasks/edit" method="POST">
                <label class="w3-text-teal"><b>Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id" value="${t.id}">
                <label class="w3-text-teal"><b>Título</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="title" value="${t.title}">
          
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="description" value="${t.description}">
                <label class="w3-text-teal"><b>Autor</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="person" value="${t.person}">
                <label class="w3-text-teal"><b>Categoria</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="category" value="${t.category}">
          
                <label class="w3-text-teal"><b>Data de criação</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="creation_date" value="${d}">
                <label class="w3-text-teal"><b>Data de entrega</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="due_date" value="${t.due_date}">
                <label class="w3-text-teal"><b>Feito</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="done" value="${t.done}">
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
            <footer class="w3-container w3-teal">
                <address>Gerado por André Morais :: DAW2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </body>
    </html>
    `
}

// Criação do servidor

var tarefasServer = http.createServer(function (req, res) {

    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " - " + req.url + " - " + d)


    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /tasks --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/tasks")){
                    axios.get("http://localhost:3000/tasks")
                    .then(response => {
                        var tasks = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagTarefas(tasks,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(erro)
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
                }
                // GET /tasks/:id --------------------------------------------------------------------
                else if(/\/tasks\/[0-9]+$/.test(req.url)){
                    axios.get("http://localhost:3000" + req.url)
                    .then( response => {
                        let t = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraTask(t,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter esta tarefa...")
                        res.end()
                    })
                }
                // GET /tasks/registo --------------------------------------------------------------------
                else if(req.url == "/tasks/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormTask(d))
                    res.end()
                }
                // GET /tasks/:id/edit --------------------------------------------------------------------
                else if(/\/tasks\/[0-9]+\/edit$/.test(req.url)){
                    var idtarefa = req.url.split("/")[2]
                    axios.get("http://localhost:3000/tasks/" + idtarefa)
                    .then( response => {
                        let a = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraForm2Task(a,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter o registo da tarefa...</p>")
                        res.end()
                    })
                }
                // GET /tasks/:id/delete --------------------------------------------------------------------
                else if(/\/tasks\/[0-9]+\/delete$/.test(req.url)){
                    var idtarefa = req.url.split("/")[2]
                    axios.delete("http://localhost:3000/tasks/" + idtarefa)
                    .then( response => {
                        let a = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraDeleteTask(d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter o registo da tarefa...</p>")
                        res.end()
                    })
                }
                break
            case "POST":
                if(req.url == '/tasks'){
                    recuperaInfo(req, resultado => {
                        console.log('POST de tarefa:' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tasks', resultado)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm( resp.data, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })    
                }
                else if(req.url == '/tasks/edit'){
                    recuperaInfo(req, resultado => {
                        console.log('PUT de tarefa:' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/tasks/' + resultado.id, resultado)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm( resp.data, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no PUT: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

tarefasServer.listen(7778)
console.log('Servidor à escuta na porta 7778...')