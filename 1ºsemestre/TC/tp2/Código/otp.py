import re
import copy
from pprint import pprint
from contextlib import redirect_stdout

alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# Função que vai gerar textos com as diferenças entre as várias combinações de criptogramas
def generateDifference(array):
    txt=[]
    letra=""

    # ficheiro com os criptogramas
    f = open("tp2.txt","r")

    # guarda os criptogramas em txt(array)
    for x in range(20):
        txt.append(f.readline())
        f.readline()
    f.close()

    data={}
    i=0

    # associa A-0,B-1 ... Z-25
    for x in alphabet :
        data[x]=i # associa alfabeto a número
        i+=1

    # vai gerar os textos com as diferenças entre as várias combinações(19C2) de criptogramas
    conta = 0
    for x in range(len(txt)):
        for y in range(len(txt)):
            t=""
            if (x!=y and x<y): # não ver diferença entre os mesmos criptogramas e diferenças entre por exemplo
                               # 0,1 e 1,0 ver apenas 0,1(não ter em conta a ordem)
                for i in range(len(txt[x])-1):
                    valor = data[txt[x][i]]- data[txt[y][i]] # diferença entre letras dos criptogramas
                    if(valor < 0):
                        valor = valor % 26

                    for key, value in data.items(): # procura pela letra correspondente ao valor
                        if valor == value: 
                            letra=key

                    t += letra # vai guardando em t o texto com as diferenças

                array.append((copy.deepcopy(t), x , y)) # guarda o tuplo com o texto gerado e os 
                                                        # criptogramas apartir dos quais o gerou
    return array

# Ordena tuplo pelo número de ocorrências
def Sort_Tuple(tup):
    lst = len(tup)  
    for i in range(0, lst):  
        for j in range(0, lst-i-1):  
            if (tup[j][1] < tup[j + 1][1]):  
                temp = tup[j]  
                tup[j]= tup[j + 1]  
                tup[j + 1]= temp  
    return tup  

# Retorna lista de tuplos com frequência e número de ocorrências com que uma letra ocorre num dado texto
def conta(texto):
    lista = []
    for x in alphabet:
        y = texto.count(x)
        if(y==0):
            prob = 0   
        else :
            prob = (y/len(texto))*100

        t = (x,y,prob)
        lista.append(t)    
    return Sort_Tuple(lista)

# Procurar texto com maior frequência da letra 'A'
def search(dic):
	maior=0	
	maior_tuplo=()
	for x in dic.values():
	 	if x[0][0][0]=='A':
	 		if x[0][0][2] > maior :
	 			maior = x[0][0][2]
	 			maior_tuplo=x
	print(maior_tuplo)


def main():
    array=[]
    d={}
    i = generateDifference(array) # estrutura de dados(array) com tuplos de texto gerado e criptogramas
                                  # que lhe deram origem   ex: ("ABC",0,1)

    # para cada texto gerado vai realizar uma análise de frequências(função conta) e guardar em dicionário
    # ex: key:"ABC" value: ([("A",1,33.3),("B",1,33.3),("C",1,33.3)],0,1)                              
    for x in i:
        d[x[0]] = (conta(x[0]),x[1]+1,x[2]+1)

    # redireciona para ficheiro um dicionário
    # com key : texto com diferenças e value : tuplo
    # com análise de frequências de letras e número dos
    # criptogramas que deram origem a esse texto
    with open('differences.txt', 'w') as f:
    	with redirect_stdout(f):
    		print(d)

    search(d)

if __name__ == "__main__":
    main()