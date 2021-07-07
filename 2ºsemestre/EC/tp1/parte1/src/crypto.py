import os

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import hmac
import cryptography.exceptions 

AES_BLOCK_LEN_BITS = 128 
AES_BLOCK_LEN_BYTES = 16
MAC_LEN = 32 # BYTES

class Crypto:
    def __init__(self, key):
        self.key = key
        self.nounce_list = []
   
    def nounce_generator(self, size):
        nounce = os.urandom(size)
        while nounce in self.nounce_list:
            nounce = os.urandom(size)
        self.nounce_list.append(nounce)
        return nounce

    def encode(self, msg):
        padder = padding.PKCS7(AES_BLOCK_LEN_BITS).padder()
        # Adiciona padding ao último bloco de bytes da mensagem de modo a esta ter tamanho múltiplo do tamanho do bloco.
        padded_data = padder.update(msg) + padder.finalize()
        iv = self.nounce_generator(AES_BLOCK_LEN_BYTES)
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(iv))
        encryptor = cipher.encryptor()
        ct = encryptor.update(padded_data) + encryptor.finalize()
        return iv + ct
    
    def decode(self, msg):
        iv, ct = msg[:AES_BLOCK_LEN_BYTES], msg[AES_BLOCK_LEN_BYTES:]
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        pt = decryptor.update(ct) + decryptor.finalize()
        unpadder = padding.PKCS7(AES_BLOCK_LEN_BITS).unpadder()
        pt = unpadder.update(pt) + unpadder.finalize()
        return pt

    def authenticate_hmac(self, msg):
        h = hmac.HMAC(self.key, hashes.SHA256())
        h.update(msg)
        digest = h.finalize()
        return digest

    def verify_hmac(self, signature, msg):
        h = hmac.HMAC(self.key, hashes.SHA256())
        # Gera digest para a mensagem.
        h.update(msg)
        try :
            # Verifica se o digest gerado acima é igual ao digest recebido como parâmetro.
            h.verify(signature)
            print("Criptograma autenticado.")
            return True
        except cryptography.exceptions.InvalidSignature:
            print("Falha na autenticação do criptograma.")
            return False

    # Autenticação e cifragem do criptograma através de Encrypt-then-MAC.
    def etm_enc(self, msg):
        # Cifra a mensagem: E(m)
        c = self.encode(msg)
        iv, ct = c[:AES_BLOCK_LEN_BYTES], c[AES_BLOCK_LEN_BYTES:] 
        # Digest do texto cifrado hmac(E(m)).
        digest = self.authenticate_hmac(ct)
        return digest + iv + ct
    
    # Verifica autenticação e decifra  criptograma através de Encrypt-then-MAC.
    def etm_dec(self, msg):
        # Retira mac da msg = digest + iv + ct.
        sig, c = msg[:MAC_LEN], msg[MAC_LEN:]
        ct = c[AES_BLOCK_LEN_BYTES:]
        # Valida mac / mac etm é dado por mac(E(m)).
        self.verify_hmac(sig, ct)
        # Decifra mensagem.
        pt = self.decode(c)
        return pt
      
    