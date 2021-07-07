import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes, hmac
import cryptography.exceptions 

def derivate_key(password, salt):
    """
    Recebe uma password e utiliza um KDF(PBKDF), que é tipicamente
    usado para derivar uma chave a partir de uma password.
    
    Args:
        password (bytes): Password
        salt (bytes): Salt

    Returns:
        bytes: Chave derivada.
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        )
    key = kdf.derive(password)
    return key

def authenticate_HMAC(key, message):
    """
    Gera digest para uma mensagem.
    
    Args:
        key (bytes): Chave usada pelo hmac (is recommended to be equal in length to the digest_size)
        message (bytes): Mensagem 

    Returns:
        bytes: digest
    """
    h = hmac.HMAC(key, hashes.SHA256())
    h.update(message)
    digest = h.finalize()
    return digest
    
def verify_HMAC(key, message, signature) :
    """
    Valida digest.
    
    Args:
        key (bytes): Chave usada pelo hmac
        message (bytes): Mensagem 
        signature (bytes): Bytes que irão ser usados para comparar com o digest
        
    Returns:
        bool: True se for válido, false se não for
    """
    h = hmac.HMAC(key, hashes.SHA256())
    # gera digest para a mensagem
    h.update(message)
    try :
        # verifica se o digest gerado acima é igual ao digest recebido como parâmetro
        h.verify(signature)
        return True
    except cryptography.exceptions.InvalidSignature:
        return False

def encode(message, aad, key):
    """
    Cifra mensagem.

    Args:
        message (bytes): Mensagem a cifrar
        aad (bytes): Metadados que irão ser autenticados, mas não cifrados
        key (bytes): Chave

    Returns:
        tuplo: [nonce (bytes), texto cifrado (bytes)].
    """
    nonce = os.urandom(12) # NIST recommends a 96-bit length
    aesgcm = AESGCM(key)
    ct = aesgcm.encrypt(nonce, message, aad)
    return nonce, ct 

def decode(ciphertext, nonce, aad, key):
    """
    Decifra mensagem.
    
    Args:
        ciphertext (bytes): Texto cifrado
        key (bytes): Chave

    Returns:
        tuplo: [código de erro (int), texto limpo(str)].
    """
    aesgcm = AESGCM(key)
    try:
        texto_limpo = aesgcm.decrypt(nonce, ciphertext, aad)
    except cryptography.exceptions.InvalidTag: 
        # Falha na verificação da autenticidade 
        return 1, None
    return None, texto_limpo.decode('utf-8')
    