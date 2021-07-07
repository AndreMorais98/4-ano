#!/usr/bin/python
import os
# import relevant cryptographic primitives
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

AES_BLOCK_LENGTH = 16 # bytes
AES_KEY_LENGTH = 32 # bytes

# Insecure CBCMAC.
def cbcmac(key, msg):
  if not _validate_key_and_msg(key, msg): return False

  # Implement CBCMAC with either a random IV, or with a tag consisting of all
  # ciphertext blocks.

  # Vetor de inicialização a 0s
  iv = bytearray(AES_BLOCK_LENGTH)
  # seleciona o encryption scheme
  cipher = Cipher(algorithms.AES(key),modes.CBC(iv))
  # retorna instancia encryptor que irá ser usada para cifragem
  encryptor = cipher.encryptor()

  # Cifra mensagem com cifra AES modo CBC e retorna todos os blocos
  ct = encryptor.update(msg) + encryptor.finalize()
  
  # return tag
  return ct


def verify(key, msg, tag):
  if not _validate_key_and_msg(key, msg): return False
 
  # se tag resultante de cbcmac == tag então valida
  if cbcmac(key,msg) == tag :
    return True
  else :
    return False
  # If parameters are valid, then recalculate the mac.
  # Implement this recalculation.

  # return True/False


# Receives a pair consisting of a message, and a valid tag.
# Outputs a forged pair (message, tag), where message must be different from the
# received message (msg).
# ---> Note that the key CANNOT be used here! <---
def produce_forgery(msg, tag):
  # Implement a forgery, that is, produce a new pair (m, t) that fools the
  # verifier.
  new_msg=b''

  # xor de M2 com A1 
  # para cada elemente de M2 vai realizar xor com elemento correspondete em A1
  # primeiro bloco da nova mensagem
  one = bytes(a ^ b for (a, b) in zip(tag[:AES_BLOCK_LENGTH], msg[AES_BLOCK_LENGTH:]))
  
  # xor de M1 com A2
  # segundo bloco da nova mensagem
  two = bytes(a ^ b for (a, b) in zip(tag[AES_BLOCK_LENGTH:], msg[:AES_BLOCK_LENGTH]))

  # nova mensagem = A1 xor M2 || A2 xor M1 
  new_msg = one + two

  # nova tag A2||A1
  new_tag = tag[AES_BLOCK_LENGTH:] + tag[:AES_BLOCK_LENGTH]
 
  return (new_msg, new_tag)

def check_forgery(key, new_msg, new_tag, original_msg):
  if new_msg == original_msg:
    print("Having the \"forged\" message equal to the original " + "one is not allowed...")
    return False

  if verify(key, new_msg, new_tag) == True:
    print("MAC successfully forged!")
    return True
  else:
    print("MAC forgery attempt failed!")
    return False

def _validate_key_and_msg(key, msg):
  if type(key) is not bytes:
    print("Key must be array of bytes!")
    return False
  elif len(key) != AES_KEY_LENGTH:
    print("Key must be have %d bytes!" % AES_KEY_LENGTH)
    return False
  if type(msg) is not bytes:
    print("Msg must be array of bytes!")
    return False
  elif len(msg) != 2*AES_BLOCK_LENGTH:
    print("Msg must be have %d bytes!" % (2*AES_BLOCK_LENGTH))
    return False
  return True

def main():
  key = os.urandom(32)
  msg = os.urandom(32)

  tag = cbcmac(key, msg)

  # Should print "True".
  print(verify(key, msg, tag))

  (mprime, tprime) = produce_forgery(msg, tag)

  # GOAL: produce a (message, tag) that fools the verifier.
  check_forgery(key, mprime, tprime, msg)

if __name__ == '__main__':
  main()
