import os
import sys
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

os.system("dd if=./panda.bmp of=panda_enc.bmp bs=1 count=54 conv=notrunc")
#os.system("dd if=./panda.bmp of=panda_dec.bmp bs=1 count=54 conv=notrunc")

img = open("./panda.bmp","rb")
data = img.read()
img.close()

key = os.urandom(32)
iv = os.urandom(16)

cipher = Cipher(algorithms.AES(key),modes.CBC(iv))

encryptor = cipher.encryptor()

padder = padding.PKCS7(algorithms.AES.block_size).padder()
padded = padder.update(data)
padded += padder.finalize()

ct=encryptor.update(padded)+encryptor.finalize()

decryptor = cipher.decryptor()

unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
imgdata = decryptor.update(ct)
unpadded = unpadder.update(imgdata) + unpadder.finalize()

f = open('./panda_enc.bmp', 'ab')
f.write(ct)
f.close()

f = open('./panda_dec.bmp','ab')
f.write(unpadded)
f.close()


