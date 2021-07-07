# Aula TP - 06/Abr/2021

### 1. Blockchain

#### Pergunta 1.1
Antes de correr o código, instalar as dependências com `npm i`
```js
var moment = require('moment')

createGenesisBlock(){
        var data = moment(new Date(Date.now())).format('DD/MM/YYYY')
        return new Block(0, data , "Bloco inicial da koreCoin", "0");
    }
```

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/831914334736744458/unknown.png)

#### Pergunta 1.2

```js
koreCoin.addBlock(new Block (4, "10/02/2021", {amount: 100}));
koreCoin.addBlock(new Block (5, "26/01/2021", {amount: 10 , rcv: 'Bloco1', snd: 'Bloco2'}));
koreCoin.addBlock(new Block (6, "20/03/2021", {amount: 50 , rcv: 'Bloco3', snd: 'Bloco4'}));
```

Se quiser verificar o código a correr, `node pergunta1`


### 2. Proof of Work Consensus Model

#### Pergunta 2.1

**Dificuldade 2**

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/831912998318768158/unknown.png)


**Dificuldade 3**

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/831913134301904946/unknown.png)


**Dificuldade 4**

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/831913236249051198/unknown.png)


**Dificuldade 5**

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/831913566454022214/unknown.png)


#### Pergunta 2.2

1. Para criar um novo bloco, o computador do mineiro tem que incrementar um número, número esse que tem de ser divisível por 9 e pelo número de prova (proof number) do último bloco.

2. Um algoritmo de proof-of-work deve ser, computacionalmente, difícil de resolver e a sua complexidade deve aumentar cada vez que a blockchain expande, o que não acontece aqui. Por isso, não parece ser o algoritmo indicado para minerar, pois o número a descobrir é facilmente descoberto

