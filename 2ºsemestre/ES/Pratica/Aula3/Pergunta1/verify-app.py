"""
Command line app that receives signer's public key from file and Data, Signature, Blind Components and
prComponents from STDIN and writes a message to STDOUT indicating if the signature is valid..
"""

from eVotUM.Cripto import utils

import sys
from eVotUM.Cripto import eccblind


def printUsage():
    print("Usage: python3 verify-app.py -cert <certificado do assinante> -msg <mensagem original a assinar> -sDash <Signature> -f <ficheiro do requerente>")


def parseArgs():
    if (len(sys.argv) != 9):
        printUsage()
    elif (sys.argv[1] != "-cert" or sys.argv[3] != "-msg" or sys.argv[5] != "-sDash" or sys.argv[7] != "-f"):
        printUsage()
    else:
        eccPublicCertPath = sys.argv[2]
        msg = sys.argv[4]
        signature = sys.argv[6]
        requerente = sys.argv[8]
        main(eccPublicCertPath, msg, signature, requerente)


def showResults(errorCode, validSignature):
    if (errorCode is None):
        if (validSignature):
            print("Valid signature")
        else:
            print("Invalid signature")
    elif (errorCode == 1):
        print("Error: it was not possible to retrieve the public key")
    elif (errorCode == 2):
        print("Error: pR components are invalid")
    elif (errorCode == 3):
        print("Error: blind components are invalid")
    elif (errorCode == 4):
        print("Error: invalid signature format")


def parseFile(requerente):
    with open(requerente, encoding = 'utf-8') as f:
        blindComponents = f.readline().split(":")[1].strip()
        prComponents = f.readline().split(":")[1].strip()
    return blindComponents,prComponents


def main(eccPublicCertPath, msg, signature, requerente):
    pemPublicCert = utils.readFile(eccPublicCertPath)
    result = parseFile(requerente)
    blindComponents, prComponents = result
    # @Jan/2021 - changed raw_input() to input()
    errorCode, validSignature = eccblind.verifySignature(
        pemPublicCert, signature, blindComponents, prComponents, msg)
    showResults(errorCode, validSignature)


if __name__ == "__main__":
    parseArgs()
