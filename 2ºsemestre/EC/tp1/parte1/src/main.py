from multiprocessing import Pipe, Process
from emitter import Emitter
from receiver import Receiver
 
def main():
    # Cria pipe.
    parent_conn, child_conn = Pipe()
    # Cria novos processos.
    e = Emitter(parent_conn)
    r = Receiver(child_conn)
    # Corre os processos.
    e.start()
    r.start()
    # Espera que os processos terminem.
    e.join()
    r.join()
    
    print("---------Com Curvas Elípticas-------------")
    # Cria pipe.
    parent_conn, child_conn = Pipe()
    # Cria novos processos.
    e = Emitter(parent_conn, True)
    r = Receiver(child_conn, True)
    # Corre os processos.
    e.start()
    r.start()
    # Espera que os processos terminem.
    e.join()
    r.join()
    
if __name__ == "__main__":
    main()




