# Sobre
### Autorizacão de Operações ao nível do Sistema de Ficheiros.</br>
Desenvolvimento de um mecanismo complementar de controlo de acesso de um sistema de ficheiros tradicional do sistema operativo Linux com um mecanismo adicional de autorizacão de operacões de abertura de ficheiros.  O mecanismo a desenvolver é concretizado sob a forma de um novo sistema de ficheiros baseado em libfuse.</br>
O mecanismo autoriza a operacão de abertura apenas depois da introducão de um código de segurança ́unico enviado ao utilizador que a despoletou. O código de  segurança é enviado via correio electrónico.

# Requisitos

**python3** - 3.5-3.9 </br>
**pip** - Installs package dependencies(pyfyse3,configparser,pymongo,websockets)</br>
**mongodb** - Database</br>
**libfuse** </br>

# Instalação

- Clone/download repositório.
- Instalar pyinstaller, necessário para os executáveis
```
pip install pyinstaller
```
- Correr script install para gerar directorias com certas permissões e executáveis
```
python3 install.py
```
### Configurar Database 
Criar user no mongo com permissões para aceder à bd do filesystem
exemplo:

```mongo
db.createUser({
  user: "root",
  pwd: "root",     
  roles: [
    { role: "readWrite", db: "filesystem" }
  ]
 })
```
- Restart mongo
- Adicionar as credenciais mongo e gmail em ./src/configs/config.data, bem como host e port do socket.

# Uso
**Depois de instalado na diretoria dist/, encontram-se os executáveis.**</br>
- ``` cd ./dist ```
- Definir os utilizadores que têm acesso a um ficheiro e o seu email:</br>
``` ./acl <path_ficheiro> <username> <useremail>```</br>

- Servidor</br>
```  ./server ``` </br>

- Mount a filesystem:</br>
```  ./passthrough <diretoria_a_replicar> <mount_directory>``` </br>



