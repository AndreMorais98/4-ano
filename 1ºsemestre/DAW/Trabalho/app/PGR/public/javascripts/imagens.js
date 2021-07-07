function showImage(name,ext,tipo,user){
   var name_without_ext = name.split('.').slice(0, -1).join('.')
   if(tipo == "aplicacao")
       var ficheiro = '<p>' + name + ', ' + ext + '</p>'
   else
       var ficheiro = '<a href=/fileStore/' + user + '/' + name_without_ext + "/" + name_without_ext + "." + ext + ' target="_blank">Ver Ficheiro</a>'

   var fileObj = `
       <div class="w3-row w3-margin">
           <div class="w3-col s6">
               ${ficheiro}
           </div>
           <div class="w3-col s6 w3-border">
               <p>Filename: ${name}</p>
               <p>Tipo: ${tipo}</p>
               <p>Formato: ${ext}</p>
           </div>
       </div>
   `
   
   var download = $('<div><a href="/files/download/' + name + '">Download</a></div>')
   $("#display").empty()
   $("#display").append(fileObj,download)
   $("#display").modal()
}

var count = 0

function addFile(){
    count++;
    var file = `
    <hr>

    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Descrição</label></div>
       <div class="w3-col s9 w3-border"><input class="w3-input w3-border w3-light-grey" type="text" name="desc" /></div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Título</label></div>
       <div class="w3-col s9 w3-border"><input class="w3-input w3-border w3-light-grey" type="text" name="titulo" /></div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Subtítulo</label></div>
       <div class="w3-col s9 w3-border"><input class="w3-input w3-border w3-light-grey" type="text" name="subtitulo" /></div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3">
            <label class="w3-text-teal">Tags</label>
       </div>
       <div class="w3-col s9" id=${count}>
          <input class="w3-input w3-border w3-light-grey tags" type="text" id="hashtags2${count}" name="hashtags2${count}" autocomplete="off" onkeydown="tags(this)"/>
          <input class="w3-input w3-border w3-light-grey tags" type="hidden" id="hashtags${count}" name="hashtags[]" autocomplete="off" />
          <div class="tag-container" id="tag-container${count}"></div>
       </div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Escolher Ficheiro</label></div>
       <div class="w3-col s9"><input class="w3-input w3-border w3-light-grey" type="file" name="myFile" accept=".zip"/></div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Tipo do Ficheiro</label></div>
       <div class="w3-col s9">
          <select id="tipo" name="tipo">
             <option value="relatorio">Relatório</option>
             <option value="tese">Tese</option>
             <option value="artigo">Artigo</option>
             <option value="aplicacao">Aplicação</option>
             <option value="slides">Slides</option>
             <option value="teste">Teste</option>
             <option value="problema">Problema Resolvido</option>
             <option value="cartaz">Cartaz</option>
          </select>
       </div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Visibilidade</label></div>
       <div class="w3-col s9">
          <select id="visibilidade" name="visibilidade">
             <option value="publico">Publico</option>
             <option value="privado">Privado</option>
          </select>
       </div>
    </div>
    <div class="w3-row w3-margin-bottom">
       <div class="w3-col s3"><label class="w3-text-teal">Data de criação</label></div>
       <div class="w3-col s9"><input class="w3-light-grey" type="text" id="datepicker${count}" onclick='picker(this)' name="dataCriacao" /></div>
    </div>

</div>

    `
    $("#adiciona").append(file)
}