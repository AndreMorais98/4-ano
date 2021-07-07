import crypto
import cifra

KEY_DIGEST_LEN = 32 # Bytes
NONCE_LEN = 12 # Bytes
SALT_LEN = 16 # Bytes

class Receiver:
    def __init__(self, password,module):
        if module == 1:
            module_value = "crypto"
        elif module == 2:
            module_value = "cifra"
        self.module = module_value
        self.key = None
        self.password = password
    
    def unpack_data(self, dados):
        key_digest = dados[:KEY_DIGEST_LEN] # primeiros 32 bytes -> hash(keyEmitter)
        # Parte 1
        if self.module == "crypto":
            nonce = dados[KEY_DIGEST_LEN:KEY_DIGEST_LEN + NONCE_LEN]
            salt = dados[KEY_DIGEST_LEN + NONCE_LEN:KEY_DIGEST_LEN + NONCE_LEN + SALT_LEN]
            ct = dados[KEY_DIGEST_LEN + NONCE_LEN + SALT_LEN:]
        # Parte 2
        elif self.module == "cifra":
            salt = dados[KEY_DIGEST_LEN:KEY_DIGEST_LEN + SALT_LEN]
            ct = dados[KEY_DIGEST_LEN + SALT_LEN:]
            nonce = None
        return key_digest, ct, salt, nonce

    def derivate_key(self, dados):
        salt = self.unpack_data(dados)[-2]
        # Parte 1
        if self.module == "crypto":
            key = crypto.derivate_key(self.password.encode('utf-8'), salt)
        # Parte 2
        elif self.module == "cifra":
            seed = cifra.derivate_key(self.password.encode('utf-8'), salt)
            key = cifra.prg(seed)
        self.key = key

    def show_results(self, error, message):
        if error == None:
            print("Texto decifrado: %s" %message)
        elif error == 1:
            print("Falha na verificação da autenticidade.")
            
    def read_message(self, ct):
        key_digest, ct, salt, nonce = self.unpack_data(ct)
        # Autentica chave
        isValid = crypto.verify_HMAC(self.key, self.key, key_digest)
        if isValid == False:
            raise Exception("Falha na autenticidade da chave") 
        # Parte 1
        if self.module == "crypto":
            aad = None # Para a comparação ser mais justa
            error_code, texto_limpo = crypto.decode(ct, nonce, aad, self.key)
        # Parte 2
        elif self.module == "cifra":
            texto_limpo = cifra.decode(self.key, ct)
            error_code = None
        self.show_results(error_code, texto_limpo)
        
    
        
  