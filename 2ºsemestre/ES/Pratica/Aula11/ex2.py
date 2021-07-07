import re
import datetime

'''
-valor a pagar,
-data de nascimento,
-nome,
-número de identificação fiscal (NIF),
-número de identificação de cidadão (NIC),
-numero de cartão de crédito, validade e CVC/CVV.
'''

def getName():
    while True:
        nome = input('Escreva o seu nome completo: \n')
        if re.match("^([A-Z][a-z]{0,9})(\s[A-Z][a-z]{0,9}){1,5}$", nome):
            return nome
        else:
            print("Escreva apenas o seu primeiro e último nome, sem acentos!")

def getPreco():
        while True:
            preco = input('Valor a pagar: \n')
            if re.match("^[0-9]{1,5},[0-9]{2}$$", preco):
                return preco
            else:
                print("Insira o valor correto, com uma vírgula a separar os cêntimos")
            
def getDataNasc():
    while True:
        dob = input('Insira a sua data de nascimento (DD/MM/AAAA): \n')
        try:
            date = datetime.datetime.strptime(dob, '%d/%m/%Y')
            today = datetime.datetime.today()
            if(date < today):
                 return dob
            else:
                print("Data de nascimento inválida")
        except ValueError:
            print("Data de nascimento inválida, tente DD/MM/AAAA")

def getNif(): 
    while True:
        nif = input('Escreva o seu NIF: \n')
        if re.match("^[0-9]{9}$", nif):
            return nif
        else:
            print("Escreva o NIF no formato correto")

def getNic():
    while True:
        nic = input('Escreva o seu número de identificação de cidadão:\n')
        if re.match("^[0-9]{8}\s[0-9]\s([A-Z]|[0-9]){2}[0-9]$", nic):
            return nic
        else:
            print("Escreva o seu NIC no formato correto")

def getcardNr():
    while True:
        nr = input('Insira o seu número de cartão de crédito\n')
        if re.match("^[0-9]{14}$", nr):
            return nr
        else:
            print("Formato incorreto")


def getcardData():
    while True:
        val = input('Insira a data de validade do cartão:\n')
        if re.match("^(0[6-9]/20|(0[1-9]|[1][0,1,2])/2[1-6])$", val):
            return val
        else:
            print("Formato ou data inválida, tente MM/AA")

def getCvv():
    while True:
        cvv = input('Insira o seu CVC/CVV:\n')
        if re.match("^[0-9]{3,4}$", cvv):
            return cvv
        else:
            print("Formato inválido, tente novamente")



def getcardcredito(): # Nr. cartão de crédito, validade e CVC/CVV
    nc = getcardNr()
    dv = getcardData()
    c = getCvv()
    return nc, dv, c



def main():
    nome = getName()
    preco = getPreco()
    data = getDataNasc()
    nifs = getNif()
    nics = getNic()
    a, b, d = getcardcredito()

    print("\n")
    print("                        Mostrando dados recolhidos: \n")
    print(" _________________________________________________________________________")
    print("|                         Nome: " + nome     + "                              |")
    print("|                          Valor a pagar: " + preco + "€                          |")
    print("|                       Data de nascimento: " + data +"                    |")
    print("|                             NIF: " + nifs + "                              |")
    print("|                          NIC: " + nics + "                            |")
    print("|  Cartão de crédito nr.: " + a + " , Validade " + b + " e CVC/CVV " + d + "   |")
    print("|_________________________________________________________________________|")
if __name__ == "__main__":
    main()