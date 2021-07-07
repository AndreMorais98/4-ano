import os
import sys
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

os.system("dd if=./panda.bmp of=panda_enc.bmp bs=1 count=54 conv=notrunc")
# abre imagem bmp que irá ser cifrada
img = open("./panda.bmp","rb")
# guarda em data os bytes da imagem
data = img.read()
img.close()
# gera chave para o algoritmo AES no modo  ECB
key = os.urandom(32)
# seleciona o encription scheme
cipher = Cipher(algorithms.AES(key), modes.ECB())
# retorna instancia encryptor que irá ser usada para cifragem
encryptor = cipher.encryptor()
# seleciona algoritmo de padding
padder = padding.PKCS7(algorithms.AES.block_size).padder()
# adiciona padding ao último bloco de bytes da imagem de modo a ter tamanho do bloco do algoritmo AES
padded = padder.update(data)
# finaliza operação
padded += padder.finalize()
# cifra dados
ct=encryptor.update(padded)+encryptor.finalize()
# retorna instancia decryptor que irá ser usada para decifrarmgem
decryptor = cipher.decryptor()
# algoritmo para retirar padding para decifragem
unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
# decifra imagem
imgdata = decryptor.update(ct)
# retira bytes adicionados à imagem
unpadded = unpadder.update(imgdata) + unpadder.finalize()
# escreve para ficheiro resultado da imagem cifrada
f = open('./panda_enc.bmp', 'ab')
f.write(ct)
f.close()
# escreve para ficheiro resultado da imagem decifrada
f = open('./panda_dec.bmp','wb')
f.write(unpadded)
f.close()


