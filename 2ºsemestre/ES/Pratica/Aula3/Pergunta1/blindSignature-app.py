"""
Command line app that receives signer's private key from file and Passphrase, Blind message and
initComponents from STDIN and writes Blind signature to STDOUT.
"""

from eVotUM.Cripto import utils

import sys
from eVotUM.Cripto import eccblind

def printUsage():
    print("Usage: python3 blindSignature-app.py -key <chave privada> -bmsg <Blind message>")

def parseArgs():
    if (len(sys.argv) != 5):
        printUsage()
    elif (sys.argv[1] != "-key" or sys.argv[3] != "-bmsg"):
        printUsage()
    else:
        eccPrivateKeyPath = sys.argv[2]
        blindM = sys.argv[4]
        main(eccPrivateKeyPath, blindM)

def showResults(errorCode, blindSignature):
    if (errorCode is None):
        print("Blind signature: %s" % blindSignature)
    elif (errorCode == 1):
        print("Error: it was not possible to retrieve the private key")
    elif (errorCode == 2):
        print("Error: init components are invalid")
    elif (errorCode == 3):
        print("Error: invalid blind message format")

def main(eccPrivateKeyPath, blindM):
    pemKey = utils.readFile(eccPrivateKeyPath)
    # @Jan/2021 - changed raw_input() to input()
    passphrase = input("Passphrase: ")
    initComponents = input("Init components: ")
    errorCode, blindSignature = eccblind.generateBlindSignature(pemKey, passphrase, blindM, initComponents)
    showResults(errorCode, blindSignature)

if __name__ == "__main__":
    parseArgs()
