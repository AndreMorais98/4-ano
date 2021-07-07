"""
Command line app that receives Data and pRDashComponents from STDIN and writes
blindMessage and blindComponents and pRComponents to STDOUT.
"""

import sys
from eVotUM.Cripto import eccblind

def printUsage():
    print("Usage: python3 ofusca-app.py -msg <mensagem a assinar> -RDash <pRDashComponents>")

def parseArgs():
    if (len(sys.argv) != 5):
        printUsage()
    elif (sys.argv[1] != "-msg" or sys.argv[3] != "-RDash"):
        printUsage()
    else:
        msg = sys.argv[2]
        pRDash = sys.argv[4]
        main(msg, pRDash)
    
def writeFile(blind, pr):
    with open('requerente.txt', 'w') as the_file:
        the_file.write("blindComponents: " + blind + "\n" + "prComponents: " + pr + "\n")


def showResults(errorCode, result):
    if (errorCode is None):
        blindComponents, pRComponents, blindM = result
        print("Blind message: %s" % blindM)
        writeFile(blindComponents, pRComponents)
    elif (errorCode == 1):
        print("Error: pRDash components are invalid")

def main(data,pRDashComponents):
    # @Jan/2021 - changed raw_input() to input()
    errorCode, result = eccblind.blindData(pRDashComponents, data)
    showResults(errorCode, result)

if __name__ == "__main__":
    parseArgs()
