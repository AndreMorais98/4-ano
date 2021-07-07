import socket
from threading import Thread
from pdu import PDU
from multicast import Multicast
from receiver import Receiver
import struct
from cryptography.hazmat.primitives import padding


class Node(Thread):
    """
    Classe que implementa um nodo que é capaz de se conectar a outros, bem como
    aceitar conexões de outros nodos.
    """

    def __init__(self, host, port, node_id):
        Thread.__init__(self)
        self.id = node_id
        self.host = host
        self.port = port
        self.cache = {}
        self.contacts = {}
        print(self.id)

    def add_cache(self, pdu):
        self.cache.append(pdu)

    def send_multicast(self, ppdu):
        MCAST_GRP = "ff15:7079:7468:6f6e:6465:6d6f:6d63:6173"
        MCAST_PORT = 6666
        MULTICAST_TTL = 1
        ttl_bin = struct.pack("@i", MULTICAST_TTL)
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        sock.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_MULTICAST_HOPS, ttl_bin)
        sock.sendto(ppdu, (MCAST_GRP, MCAST_PORT))

    def init_receiver(self, node):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.bind((self.host, self.port))
        thread = Receiver(sock, node, node.host)
        thread.start()

    def send_interest(self, content_name, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        pdu = PDU(1, content_name)
        pdu_bytes = pdu.to_bytes()
        sock.sendto(pdu_bytes, (target_add, self.port))

    def send_data(self, data, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        pdu = PDU(0, data)
        pdu_bytes = pdu.to_bytes()

        sock.sendto(pdu_bytes, (target_add, self.port))

    def self_message(self, msg, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(msg, (target_add, 9970))

    def send_pdu(self, data, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        pdu_bytes = data.to_bytes()
        sock.sendto(pdu_bytes, (target_add, self.port))

    def send_app(self, data, port):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        print("enviando para app")
        print(self.host)
        print(len(data))
        sock.sendto(data, (self.host, port))

    def init_multicast(self):
        thread = Multicast(self.host, self.port, self.id)
        thread.start()

    def run(self):
        self.init_multicast()
        node = Node(self.host, self.port, self.id)
        self.init_receiver(node)
        while True:
            pass
