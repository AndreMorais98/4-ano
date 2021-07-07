#!/usr/bin/python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, hmac
import os, sys

# Gerar dois arrays (diferentes!!) de bytes de tamanhos adequados, a utilizar
# como chave para a cifra e para o mac. Estes valores deverão estar hardcoded em
# ambos ficheiros enc.py e dec.py.

key = bytearray(b'%R8\xd9\xb7=\xe8\xa3\xc3\xfd\xf3{\xa1\xdf\x98\x9b\xf8\x00\x88H\xc7IL\xb1\xbd\xf5\x03y+\xd3&\xa0')
hmackey = bytearray(b'\xd5\xc3\xe6\xfa\xfbO\x94\xc6\xe2JL?V\x18d1\x92\x9c\xfci\xb3#\xf9h\xc0C\xc3\xf4\x8fM\xb4b')
nonce = bytearray(b'\x98!\xa7\xc5.Jw\xed\xa1\xba<\xfa,\xf3\x93\x00')

def rff(nomeficheiro):
  with open(nomeficheiro, 'rb') as f:
    return f.read()

def validate_signature(signature,message) :
    h = hmac.HMAC(hmackey, hashes.SHA256(),backend=default_backend())
    # gera tag para a mensagem
    h.update(message)
    try :
        # vê se tag gerada acima é igual a signature(tag que vem com a mensagem)
        h.verify(signature)
        print("Signature válida!")
    except :
        print("Signature inválida!")

def etm():
  data = rff("dados-etm.dat")

  # tamanho dos dados (m||tag)
  data_size=len(data)

  # retira mensagem cifrada dos dados 
  ct = data[:data_size-32] # 32 -> tamanho do mac
  
  # retira mac dos dados
  signature = data[data_size-32:]

  # valida mac / mac etm é dado por mac(E(m))
  validate_signature(signature,ct)
  
  # decifra mensagem
  algorithm = algorithms.ChaCha20(key, nonce)
  cipher = Cipher(algorithm, mode=None, backend=default_backend())
  decryptor = cipher.decryptor()
  decifrado = decryptor.update(ct)
  
  print("Texto decifrado: ",decifrado.decode('utf8'))

def eam():
  data = rff("dados-eam.dat")

  # tamanho dos dados
  data_size=len(data)

  # retira mensagem cifrada dos dados
  ct = data[:data_size-32] # tamanho do mac
  
  # retira mac dos dados
  signature = data[data_size-32:]

  # decifra mensagem
  algorithm = algorithms.ChaCha20(key, nonce)
  cipher = Cipher(algorithm, mode=None, backend=default_backend())
  decryptor = cipher.decryptor()
  decifrado = decryptor.update(ct)
  
  # valida mac  mac eam é dado por mac(m)
  validate_signature(signature,decifrado)
  
  print("Texto decifrado: ",decifrado.decode('utf8'))

def mte():
  data = rff("dados-mte.dat")
  
  # Decifra dados
  algorithm = algorithms.ChaCha20(key, nonce)
  cipher = Cipher(algorithm, mode=None, backend=default_backend())
  decryptor = cipher.decryptor()
  data_decifrada = decryptor.update(data)
  
  # tamanho dos dados
  data_size = len(data_decifrada)

  # retira mac dos dados
  signature = data_decifrada[data_size-32:]

  # retira texto limpo dos dados
  texto_limpo = data_decifrada[:data_size-32] # 32 -> tamanho do mac

  # valida tag
  validate_signature(signature,texto_limpo)

  print("Texto decifrado: ", texto_limpo.decode('utf-8'))
  

def main():

  if len(sys.argv) != 2:
    print("Please provide one of: eam, etm, mte")
  elif sys.argv[1] == "eam":
    eam()
  elif sys.argv[1] == "etm":
    etm()
  elif sys.argv[1] == "mte":
    mte()
  else:
    print("Please provide one of: eam, etm, mte")

if __name__ == '__main__':
  main()
