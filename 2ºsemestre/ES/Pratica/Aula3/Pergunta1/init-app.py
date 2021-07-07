"""
Command line app that writes initComponents and pRDashComponents to STDOUT.
"""

import sys
from eVotUM.Cripto import eccblind

def printUsage():
    print("Usage: python3 init-app.py [-init] \n\nDevolve o R' (i.e., pRDashComponents) \n\noptional arguments:\n -init            --> inicializa as várias componentes (InitComponents e pRDashComponents) e guarda-as num ficheiro de texto")

def parseArgs():
    if (len(sys.argv) > 2):
        printUsage()
    elif (len(sys.argv) == 1):
        main(2)
    elif (len(sys.argv) == 2 and sys.argv[1] == "-init"):
        main(1)
    else:
        printUsage()


def printPrDash(pr):
    print("pRDashComponents: %s" % pr)

def writeFich(pr, init):
    with open('assinante.txt', 'w') as the_file:
        the_file.writelines(["initComponents: " + init + "\n" , "pRDashComponents: " + pr])



def main(option):
    initComponents, pRDashComponents = eccblind.initSigner()
    if(option == 1): 
        writeFich(pRDashComponents, initComponents)
        print("Componentes guardadas")
    if(option == 2):
        printPrDash(pRDashComponents)
if __name__ == "__main__":
    parseArgs()
