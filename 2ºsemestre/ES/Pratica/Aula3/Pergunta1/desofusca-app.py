"""
Command line app that receives Blind signature, Blind components and prDashComponents
from STDIN and writes the unblinded signature to STDOUT.
"""

import sys
from eVotUM.Cripto import eccblind


def printUsage():
    print("Usage: python3 desofusca-app.py -s <Blind Signature> -RDash <pRDashComponents>")

def parseArgs():
    if (len(sys.argv) != 5):
        printUsage()
    elif (sys.argv[1] != "-s" or sys.argv[3] != "-RDash"):
        printUsage()
    else:
        blindS = sys.argv[2]
        pRDash = sys.argv[4]
        main(blindS, pRDash)

def showResults(errorCode, signature):
    if (errorCode is None):
        print("Signature: %s" % signature)
    elif (errorCode == 1):
        print("Error: pRDash components are invalid")
    elif (errorCode == 2):
        print("Error: blind components are invalid")
    elif (errorCode == 3):
        print("Error: invalid blind signature format")

def main(blindS, pRDash):
    # @Jan/2021 - changed raw_input() to input()
    blindComponents = input("Blind components: ")
    errorCode, signature = eccblind.unblindSignature(blindS, pRDash, blindComponents)
    showResults(errorCode, signature)

if __name__ == "__main__":
    parseArgs()
