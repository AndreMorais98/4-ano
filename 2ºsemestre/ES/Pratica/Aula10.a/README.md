# Aula TP - 04/Mai/2021

Cada grupo deve colocar a resposta às perguntas dos seguintes exercícios na área do seu grupo no Github até ao final do dia 18/Mai/2021. Por cada dia de atraso será descontado 0,15 valores à nota desse trabalho.

## Exercícios

### 1\. _Buffer Overflow_

#### Pergunta P1.1 - Buffer overflow em várias linguagens

O programa começa por criar uma lista de tamanho 10. Espera que o utilizador de inputs que quer colocar nessa lista. No entanto pode ocorrer _buffer overflow_ se inserir mais de 10 elementos na lista

**Java**

Ao inserir o 11º elemento, obtemos uma _exception_:
```
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 10
        at LOverflow3.main(LOverflow3.java:18)
```

**Python3**

No caso do _python_ podemos perceber que ao inserir o 11º elemento, ocorre um erro e o programa termina. 
```
Traceback (most recent call last):
  File "LOverflow2.py", line 5, in <module>
    tests[i]=test
IndexError: list assignment index out of range
```

**C++**

Em C++, o programa continua a aceitar os números inseridos, sem qualquer sinal de erro. No final o programa aborta devido a um _core dumped_
```
*** stack smashing detected ***: <unknown> terminated
Aborted (core dumped)
```

#### Pergunta P1.2 - Buffer overflow

**RootExploit.c**

No início da função `main` são declaradas duas novas variáveis. Estas quão declaradas, vão para o enderaço mais alto da Stack para o mais baixo (**L**ast**I**n**F**irst**O**ut). Ou seja, a variável _pass_ vai ocupar um espaço de 4 bytes (int) e a variável _buff_ vaii ocuper os 4 bytes seguintes.

Se o input ocupar mais de 4 bytes, vai causar um _Buffer Overflow_ pois vai escrever no espaço de memória da variável _pass_. Temos só de ter em atenção que o último caracter tem de ser diferente de '0' pois essa é a condição para poder-mos imprimir a permissão de acesso.

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/840254161433264148/unknown.png)

**0-simple.c**

Foi preciso conhecer a distância entre as variáveis _buffer_ e _control_. A variável buffer neste caso tinha 64 bytes. Para excerdemo o espaço de memória do buffer precisamos de 77 caracteres para alterar o valor da variável _control_

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/840254220169904138/unknown.png)

#### Pergunta P1.3 - Read overflow

Após a análise do código do ficheiro **ReadOverflow.c** podemos concluir que não existe um controlo dos limites daquilo que é lidao no final do programa, sendo possível, graças ao _fgets_, aceder a informação que se encontra para além do limite do _buff_. Podemos observar o seguinte exemplo que se apenas escrever uma palavra com 7 caracteres e mandar ler 50, ele vai devolver "lixo"

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/840233123550593044/unknown.png)

#### Pergunta P1.4

Após verificar que a minha máquina utiliza **little endian**, ou seja, o byte menos significativo é guardado na primeira posição de memória e o mais significativo na última. Os valores hexadecimal **0x61626364** correspondem as caracteres **dcba**. Por fim, inserimos um input de tamanho elevado para causar um _Buffer Overflow_ e concatenamos no final da string **dcba** que corresponde ao código de maneira a explorar a vulnerabilidade

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/840236640085344306/unknown.png)

#### Pergunta P1.5 - Buffer overflow na Heap

- Utilizar a função **strncpy** em vez de **strcpy**
- Verificar a memória necessária para armazenar argc[1] e a string 'laranja', e posteriormente alocar em memória esses tamanhos
- Verificar o número de inputs

Pode abrir o ficheiro [overflowHeap.1.c](https://github.com/uminho-miei-engseg-20-21/Grupo7/blob/main/Pratica/Aula10.a/codigofonte/overflowHeap.1.c) para ver as modificações feitas

#### Pergunta P1.6 - Buffer overflow na Stack

- Truncar o array de caracteres ao tamanho do buffer inserindo o caracter de fim de string na posição x do array str, ond x é o comprimento do buffer

Pode abrir o ficheiro [stack.c](https://github.com/uminho-miei-engseg-20-21/Grupo7/blob/main/Pratica/Aula10.a/codigofonte/stack.c) para ver as modificações feitas
