import os
import crypto

class Emitter:
  def __init__(self, password):
      self.key = None
      self.password = password
      self.key_salt = os.urandom(16)
      
  def derivate_key(self):
      key = crypto.derivate_key(self.password.encode('utf-8'), self.key_salt)
      self.key = key   
    
  def send_message(self, message):
      key_digest = crypto.authenticate_HMAC(self.key, self.key)
      aad = self.key_salt
      nonce, ct = crypto.encode(message.encode('utf-8'), aad, self.key)
      return key_digest + nonce + self.key_salt + ct
      
