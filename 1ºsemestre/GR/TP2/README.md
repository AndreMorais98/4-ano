# Projeto GR (Gestão de Rede)

## Sobre 
### Monitoring & SNMP Cliente

Plataforma que disponibiliza recursos educativos de vários tipos: livros, artigos, aplicações, trabalhos de alunos, monografias, relatórios

## Requisitos

**java** - Run the</br>
**npm** - Installs package dependencies</br>


## Instalação

- Mudar na config todos os campos da config que desejar
```
[host0]
address = XXX.X.X.X
port = XXX
community = gr2020
ram = MAX_RAM
email = EMAIL
proc = Nº DE PID 
max = MAX DE PERCENTAGEM
```
- Na parte do Java, ter em atenção os path's das pastas cpu's e ram's

- Clone/download repositório.
- Para cada componente(servidor), instalar as dependências:
```
cd web
```
```
npm i
```
## Uso
**Depois de instaladas as dependências, ligar o servidor :**</br>
- Correr o programa java
- Correr ao mesmo tempo, dentro da pasta web
``` 
npm start 
``` 
