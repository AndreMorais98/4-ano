import os
import random
import sys
import time 

from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.primitives import padding

N = 1
BLOCK_SIZE = 8 # 64 bits (8 bytes)

def derivate_key(password, salt):
    # derive
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        )
    key = kdf.derive(password)
    return key

def prg(seed):
    digest = hashes.Hash(hashes.SHAKE256(BLOCK_SIZE * pow(2,N)))
    digest.update(seed)
    words = digest.finalize()
    return words
        
def encode(key,message):
    ct = b''
    padder = padding.PKCS7(64).padder()
    # Adiciona padding ao último bloco de bytes da mensagem de modo a esta ter tamanho múltiplo do bloco 
    padded = padder.update(message) + padder.finalize()
    # Divide mensagem em blocos de 8 bytes
    p = [padded[i:i+BLOCK_SIZE] for i in range(0, len(padded), BLOCK_SIZE)] 
    # XOR dos bytes do bloco da mensagem com os bytes do bloco de palavras chaves
    for x in range (len(p)): # Percorre blocos do texto limpo
        for index, byte in enumerate(p[x]): # Percorre bytes do bloco do texto limpo
            ct += bytes([byte ^ key[x:(x+1)*BLOCK_SIZE][index]]) 
    return ct

def decode(key, ct):
    pt = b''
    # Divide texto cifrado em blocos de 8 bytes
    p = [ct[i:i+BLOCK_SIZE] for i in range(0, len(ct), BLOCK_SIZE)] 
    # XOR dos bytes do bloco do texto cifrado com os bytes do bloco de palavras chaves
    for x in range (len(p)): # Percorre blocos do texto cifrado
        for index, byte in enumerate(p[x]): # Percorre bytes do bloco do texto cifrado
            pt += bytes([byte ^ key[x:(x+1)*BLOCK_SIZE][index]]) 
    # Algoritmo para retirar padding para decifragem
    unpadder = padding.PKCS7(64).unpadder()
    # Retira bytes adicionados 
    unpadded = unpadder.update(pt) + unpadder.finalize()
    return unpadded.decode("utf-8")

def main():
    password = input("Insira a sua password: ")
    salt = os.urandom(16)
    seed = derivate_key(password.encode("utf-8"), salt)
    key = prg(seed)
    ct = encode(key, "Segredo".encode("utf-8"))
    print("Texto limpo: " + decode(key, ct))

if __name__ == "__main__":
    main()