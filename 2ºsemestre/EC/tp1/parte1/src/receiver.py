from multiprocessing import Process
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import dsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from cryptography.hazmat.primitives.serialization import PrivateFormat
from cryptography.hazmat.primitives.serialization import NoEncryption
from cryptography.hazmat.primitives.asymmetric import dh
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.serialization import load_der_private_key
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives.serialization import load_der_public_key
from cryptography.hazmat.primitives.asymmetric import ec
from crypto import Crypto

# RFC 3526's parameters. Easier to hardcode...
p = 0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF
g = 2
params_numbers = dh.DHParameterNumbers(p,g)
parameters = params_numbers.parameters()

class Receiver(Process):
    def __init__(self, conn, elicurves = False):
        super(Receiver, self).__init__()
        # Conexão pipe
        self.conn = conn
        # Módulo Crypto
        self.crypto = None
        # Chave simétrica
        self.key = None
        
        # Uso do protocolo com Curvas Elípticas
        self.ec = elicurves
        
        # Uso de curvas elípticas
        if self.ec == True :
            # Chave privada assimétrica
            self.private_key = ec.generate_private_key(ec.SECP384R1())
            # Chave pública assimétrica
            self.public_key = self.private_key.public_key().public_bytes( 
                                encoding=serialization.Encoding.DER,
                                format=serialization.PublicFormat.SubjectPublicKeyInfo) 
        else:
            # Chave privada assimétrica
            self.private_key = dsa.generate_private_key(key_size=1024)
            # Chave pública assimétrica
            self.public_key = self.private_key.public_key().public_bytes(
                                encoding = serialization.Encoding.DER,
                                format = serialization.PublicFormat.SubjectPublicKeyInfo)

    def sts(self):
        if self.ec == True:
            dh_priv_key = ec.generate_private_key(ec.SECP384R1())
        else:
            # Gerar (g^x).
            dh_priv_key = parameters.generate_private_key()
      
        # g^x em bytes para poder ser transmitido pelo pipe.
        dh_priv_key_as_bytes = dh_priv_key.private_bytes(Encoding.DER, PrivateFormat.PKCS8,NoEncryption())
        dh_pub_key_as_bytes = dh_priv_key.public_key().public_bytes(Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
        
        # Envia para o emitter (g^x).
        self.conn.send(dh_pub_key_as_bytes)
        
        # Recebe do emitter: g^y + E[S(g^y,g^x)] + chave pública emitter.
        mensagem = self.conn.recv() 
      
        msg_splitted = mensagem.split(sep=b"\r\n\r\n")

        # g^y em bytes.
        dh_peer_pub_key_as_bytes = msg_splitted[0]  
        # g^y serializado.
        dh_peer_pub_key = load_der_public_key(dh_peer_pub_key_as_bytes, None) 
        
        if self.ec == True:
            shared_key = dh_priv_key.exchange(ec.ECDH(), dh_peer_pub_key)
        else:
            # Chave partilhada (g^y^x)
            shared_key = dh_priv_key.exchange(dh_peer_pub_key)

        # Deriva a chave partilhada.
        derived_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b'handshake data',
        ).derive(shared_key)
        
        self.key = derived_key
        
        self.crypto = Crypto(self.key)

        # Chave pública do emitter.
        public_key_emitter_as_bytes = msg_splitted[2]
        # Serializa chave.
        public_key_emitter = load_der_public_key(public_key_emitter_as_bytes, None) 
      
        # Assinatura do emitter.     
        signature = self.crypto.etm_dec(msg_splitted[1])
    
        try:
            # Verifica assinatura do emitter.
            self.verify(public_key_emitter, dh_peer_pub_key_as_bytes + dh_pub_key_as_bytes, signature)
            print("Assinatura do Emitter válida.")
        except:
            print("Assinatura do Emitter inválida")

        separador = b"\r\n\r\n"
        
        # Mensagem com assinatura e chave pública do receiver.
        sig = self.sign(dh_pub_key_as_bytes + dh_peer_pub_key_as_bytes)
        mensagem = self.crypto.etm_enc(sig) + separador + self.public_key
        # Envia mensagem ao emitter.
        self.conn.send(mensagem) 
   
    # Função usada para assinar a mensagem com a chave privada, serve para provar/autenticar que é o receiver que está a mandar a mensagem(não repúdio),
    # uma vez que só o emitter tem esta chave privada, a mensagem ao ser as chaves DH tem como objetivo manter a integridade destas,
    # já que um atacante no meio da conexão as poderia alterar, após assinatura,
    # o receiver pode verificar a assinatura garantindo o não repúdio e integridade da mensagem.
    def sign(self, msg):
        if self.ec == True:
            signature = self.private_key.sign(
            msg,
            ec.ECDSA(hashes.SHA256()))
        else:
            signature = self.private_key.sign(
            msg,
            hashes.SHA256())
            
        return signature
             
    # Função usada para verificar se a assinatura do emitter foi mesmo realizada por este, já que ao verificarmos com a chave pública
    # temos uma maior segurança contra ataques man-in-the-middle, com a verificação garantimos que a mensagem
    # não foi modificada e foi gerada com a chave privada do emitter,
    # dado que só a chave pública do emitter a pode verificar.
    def verify(self, public_key, msg, sig):
        if self.ec == True:
            public_key.verify(
            sig,
            msg,
            ec.ECDSA(hashes.SHA256()))
        else:
            public_key.verify(
            sig,
            msg,
            hashes.SHA256())
        
    def read_msg(self):
        msg = self.conn.recv()
        print("Mensagem recebida: " + self.crypto.etm_dec(msg).decode('utf-8'))   
        
    def run(self):
        self.sts()
        self.read_msg()
    
