# Aula TP - 16/Mar/2021

Cada grupo deve colocar a resposta às perguntas dos seguintes exercícios na área do seu grupo no Github até ao final do dia 30/Mar/2021\. Por cada dia de atraso será descontado 0,15 valores à nota desse trabalho.


## Exercícios

### 1\. TOR (The Onion Router)

Para este ponto necessita de instalar o **tor**, **secure-delete**, **curl** e **anonsurf** na sua máquina ou (preferencialmente) numa máquina virtual Linux. Sugere-se que efetue a seguinte sequência de comandos (supondo máquina Debian Linux):

> `sudo apt-get install tor secure-delete curl`

> `git clone https://github.com/Und3rf10w/kali-anonsurf.git`

> `cd kali-anonsurf`

> `sudo ./installer.sh`


#### Pergunta P1.1

Para aceder a alguns sites nos EUA tem que estar localizado nos EUA.

1. Efetuando o comando `sudo anonsurf start` consegue garantir que está localizado nos EUA?
2. Porquê? Utilize características do protocolo TOR para justificar.


#### Pergunta P1.2

No seguimento da experiência anterior, aceda a <http://zqktlwi4fecvo6ri.onion/wiki/index.php/Main_Page>, <http://ciadotgov4sjwlzihbbgxnqg3xiyrg7so2r2o3lt5wz5ypk4sxyjstad.onion> ou <https://www.facebookcorewwwi.onion/>.

1. Clique no lado esquerdo da barra de URL (no símbolo do _onion_) e verifique qual é o circuito para esse site.

2. Porque existem 6 "saltos" até ao site Onion, sendo que 3 deles são "_relay_"? Utilize características do protocolo TOR para justificar.

3. Qual é o _Rendez-vous Point_?
