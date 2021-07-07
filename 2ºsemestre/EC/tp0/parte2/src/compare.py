import os
import time
from emitter import Emitter
from receiver import Receiver

def read_input():
    password = input("Insira a sua password: ")
    return password

def main():
    print("################################## Algoritmo 1 #########################################\n")
    print("Calcular o tempo de execução do algoritmo da parte 1\n")
    password = read_input()
    #Começa a contar o tempo
    start = time.perf_counter()
    emmiter = Emitter(password,1)
    emmiter.derivate_key()
    dados = emmiter.send_message("Segredo 1")
    #Acaba de contar o tempo
    stop = time.perf_counter()
    delta_time_1 = stop - start

    password = read_input()
    #Começa a contar o tempo
    start = time.perf_counter()
    receiver = Receiver(password,1)
    receiver.derivate_key(dados)
    try:
        receiver.read_message(dados)
    except:
        print("Falha na autenticação da chave")  
    #Acaba de contar o tempo
    stop = time.perf_counter()
    #Soma dos tempos
    delta_time_2 = stop - start
    total_time = delta_time_1 + delta_time_2
    print("Tempo de execução: %f " %total_time)

    print("################################## Algoritmo 2 #########################################\n")
    print("Calcular o tempo de execução do algoritmo da parte 2 \n")
    password = read_input()
    #Começa a contar o tempo
    start = time.perf_counter()
    emmiter = Emitter(password,2)
    emmiter.derivate_key()
    dados = emmiter.send_message("Segredo 1")
    #Acaba de contar o tempo
    stop = time.perf_counter()
    delta_time_1 = stop - start

    password = read_input()
    #Começa a contar o tempo
    start = time.perf_counter()
    receiver = Receiver(password,2)
    receiver.derivate_key(dados)
    try:
        receiver.read_message(dados)
    except:
        print("Falha na autenticação da chave")  
    #Acaba de contar o tempo
    stop = time.perf_counter()
    #Soma dos tempos
    delta_time_2 = stop - start
    total_time = delta_time_1 + delta_time_2
    print("Tempo de execução: %f " %total_time)

if __name__ == "__main__":
    main()