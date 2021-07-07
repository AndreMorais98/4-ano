# Aula TP - 04/Mai/2021

Cada grupo deve colocar a resposta às perguntas dos seguintes exercícios na área do seu grupo no Github até ao final do dia 18/Mai/2021. Por cada dia de atraso será descontado 0,15 valores à nota desse trabalho.



## Exercícios

### 1\. Vulnerabilidade de inteiros

#### Pergunta P1.1

##### 1)
A vulnerabilidade da função está relacionada com o overflow de inteiros. A variável `i` é um **inteiro** e a variável `x` é um **size_t (unsigned)** em que esta última suporta números maiores. Sabendo que o máximo suportado por um **int** é 2147483647, se a variável x apresentar uma valor maior que este, o **i** vai começar a contar do 0 outra vez. O mesmo acontece com as variáveis `j` e `y`.
Resumidamente: 
- Max int size: 2147483647
- SIZE_MAX (tamanho máximo de size_t): 18446744073709551615

##### 2)

Para verificar esta vulnerabilidade foi alterada a função main de modo a que o valor de x*y seja superior ao valor máximo de um size_t

```
int main() {
        char *matrix;
	vulneravel(matrix,100000000,100000000,'a');
}
```

##### 3)

Ao compilar o ficheiro C e se executar-mos com as alterações feitas na `main()`, obtemos o erro  **Segmentation fault**

![alt text](https://cdn.discordapp.com/attachments/440579421884252171/840249271864918036/unknown.png)

#### Pergunta P1.2

##### 1)

A vulnerabilidade existente é a de _integer underflow_


##### 2)

```
int main() {
  char *origem = 'secreteword';
  vulneravel(origem, 0);
}
```

##### 3)

Ao executar ocorre um segmentation fault.

##### 4)

- Alteramos o if da função para fazer com que o tamanho recebido tenha que ser superior ao valor mínimo de uma variável do tipo size_t.

Pode verificar o código em [underflow.c](https://github.com/uminho-miei-engseg-20-21/Grupo7/blob/main/Pratica/Aula10.b/codigo/underflow.c)