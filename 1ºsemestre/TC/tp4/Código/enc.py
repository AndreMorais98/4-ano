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

msg = "Isto é uma mensagem não muito secreta!"

def etm():
  # Cifra a mensagem E(m)
  encryptor = cipher.encryptor()
  algorithm = algorithms.ChaCha20(key, nonce) # Cifra chacha20  
  cipher = Cipher(algorithm, mode=None, backend=default_backend()) # Modo da cifra (encryption scheme)
  encryptor = cipher.encryptor() # retorna instancia encryptor que irá ser usada para cifragem
  ct = encryptor.update(bytes(msg, 'utf-8'))
  
  # Tag do texto cifrado mac(E(m))
  h = hmac.HMAC(hmackey, hashes.SHA256(),backend=default_backend())
  h.update(ct)
  mac = h.finalize()
  
  # Retorna o texto cifrado e o mac do texto cifrado ( (ct || mac(E(m)))
  dados = ct + mac

  w2f("dados-etm.dat", dados)

def eam():
  # Cifra a menssagem  E(m)
  algorithm = algorithms.ChaCha20(key, nonce)
  cipher = Cipher(algorithm, mode=None, backend=default_backend()) # Modo da cifra (encryption scheme)
  encryptor = cipher.encryptor() # retorna instancia encryptor que irá ser usada para cifragem
  ct = encryptor.update(bytes(msg, 'utf-8'))
  
  # Tag da mensagem  mac(m)
  h = hmac.HMAC(hmackey, hashes.SHA256(),backend=default_backend())
  h.update(bytes(msg, 'utf-8'))
  mac = h.finalize()
  
  # Retorna o texto cifrado e o mac da mensagem ( (ct || mac(m))
  dados = ct + mac

  w2f("dados-eam.dat", dados)

def mte():
  # Tag da mensagem mac(m)
  h = hmac.HMAC(hmackey, hashes.SHA256(),backend=default_backend())
  h.update(bytes(msg, 'utf-8'))
  mac = h.finalize()

  # m||mac(m)
  text = bytes(msg, 'utf-8') + mac

  # Cifra mac e mensagem E(m||mac(m))
  algorithm = algorithms.ChaCha20(key, nonce)
  cipher = Cipher(algorithm, mode=None, backend=default_backend())  # Modo da cifra (encryption scheme)
  encryptor = cipher.encryptor()  # retorna instancia encryptor que irá ser usada para cifragem
  ct = encryptor.update(text)

  # Return E(m||mac(m))
  dados = ct

  w2f("dados-mte.dat", dados)

def w2f(nomeficheiro, data):
  with open(nomeficheiro, 'wb') as f:
    f.write(data)

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
