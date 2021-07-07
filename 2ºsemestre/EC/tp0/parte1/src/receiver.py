import crypto

KEY_DIGEST_LEN = 32 # Bytes
NONCE_LEN = 12 # Bytes
SALT_LEN = 16 # Bytes

class Receiver:
    def __init__(self, password):
      self.key = None
      self.password = password
    
    def unpack_data(self, dados):
        # dados : key_digest + nonce + salt + mensagem
        # 0 - 31 : key_digest (32 bytes)
        # 32 - 43 : nonce para decode (12 bytes)
        # 44 - 59 : salt para derivar chave (16 bytes)
        # 60 ... : texto cifrado
        key_digest = dados[:KEY_DIGEST_LEN]  # primeiros 32 bytes -> hash(keyEmitter)
        nonce = dados[KEY_DIGEST_LEN:KEY_DIGEST_LEN + NONCE_LEN]
        salt = dados[KEY_DIGEST_LEN + NONCE_LEN:KEY_DIGEST_LEN + NONCE_LEN + SALT_LEN]
        ct = dados[KEY_DIGEST_LEN + NONCE_LEN + SALT_LEN:]
        
        return key_digest, ct, salt, nonce
        
    def derivate_key(self, dados):
        salt = self.unpack_data(dados)[-2]
        key = crypto.derivate_key(self.password.encode('utf-8'), salt)
        self.key = key
        
    def show_results(self, error, message):
        if error == None:
            print("Texto decifrado: %s" %message)
        elif error == 1:
            print("Falha na verificação da autenticidade.")
               
    def read_message(self, ct):
        key_digest, ct, salt, nonce = self.unpack_data(ct)
        # Verifica autenticidade da chave
        isValid = crypto.verify_HMAC(self.key, self.key, key_digest)
        if isValid == False:
            raise Exception("Falha na autenticidade da chave") 
        aad = salt + nonce 
        error_code, texto_limpo = crypto.decode(ct, nonce, aad, self.key)
        self.show_results(error_code, texto_limpo)
        
    
        
  