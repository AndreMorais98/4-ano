import os
import time
from emitter import Emitter
from receiver import Receiver

def read_input():
    password = input("Insira a sua password: ")
    return password

def main():
    # Leitura password do emmiter
    password = read_input()
    emmiter = Emitter(password)
    # Deriva chave do emitter
    emmiter.derivate_key()
    # Emmiter envia dados: key_digest + nonce + salt + mensagem
    dados = emmiter.send_message("Segredo que não se pode partilhar")

    # Leitura password do receiver
    password = read_input()
    receiver = Receiver(password)
    # Deriva chave do receiver
    receiver.derivate_key(dados)
    try:
        # Receiver decifra mensagem
        receiver.read_message(dados)
    except:
        # Falha na autenticação da chave
        print("Falha na autenticação da chave")  
    

if __name__ == "__main__":
    main()