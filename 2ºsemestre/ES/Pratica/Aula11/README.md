# Aula TP - 11/05/2021

Cada grupo deve colocar a resposta às perguntas dos seguintes exercícios na área do seu grupo no Github até ao final do dia 25/Mai/2021. Por cada dia de atraso será descontado 0,15 valores à nota desse trabalho.


### 1\. Validação de Input

#### Pergunta 1.1
#### 1)
Há duas vulnerabilidades presentes neste código:
- A função **system** permite a execução do programa passado como argumento, com as variáveis do processo-pai. O utilizador pode passar uma string como argumento, que não vai ser verificada. Ou seja, um atacante poderia utilizar esta função para correr comandos não autorizados

- O programa devia ter em atenção os metacaracteres que podem ser aceites. Um atacante pode recorrer à injeção de separadores, como por exemplo, ';' ou à injeção de separadores de pasta com a ajuda do autocomplete (_path traversal attack_), ficando a conhecer toda a estrutura de diretorias.

#### 2)
Para explorar a primeira vulnerabilidade referente ao `system`, poderiamos executar o seguinte código:

`./filetype "/etc/passwd"`

Aqui o atacante iria ter acesso ao ficheiro passwd do sistema

Para explorar a segunda vulnerabilidade, podemos recorrer ao ';' quer permite correr vários comandos de uma só vez. 

`./filetype filetype.c;ls`

Podemos verificar na seguinte imagem, que conseguimos executar o comando **ls** e ainda poderiamos encadear mais comandos e fazer o uso do autocomplete também.

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/841308939307581470/unknown.png)

#### 3)
Se o programa tivesse permissões _setuid root_ passaria a ter permissões de root quando o programa fosse executado e o sistema ficaria comprometido uma vez que permitiria a um utilizador com poucas permissões executar comandos como root para ter acesso à informações sensíveis.


#### Pergunta 1.2

