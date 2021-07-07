from threading import Thread
import socket
import struct


class Multicast(Thread):
    """
    Classe que recebe conexões de outros nodos em multicast
    """

    def __init__(self, host, port, node_id):
        Thread.__init__(self)
        self.host = host
        self.port = port
        self.id = node_id

    def send_message(self, msg, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(msg, (target_add, 9976))

    def run(self):
        MCAST_PORT = 6667
        addrinfo = socket.getaddrinfo("ff15:7079:7468:6f6e:6465:6d6f:6d63:6173", None)[
            0
        ]
        s = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)

        # Set multicast interface
        local_addr = "::"
        ifn = "eth0"
        ifi = socket.if_nametoindex(ifn)
        ifis = struct.pack("I", ifi)
        s.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_MULTICAST_IF, ifis)

        # Set multicast group to join
        group = (
            socket.inet_pton(socket.AF_INET6, "ff15:7079:7468:6f6e:6465:6d6f:6d63:6173")
            + ifis
        )
        s.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_JOIN_GROUP, group)

        sock_addr = socket.getaddrinfo(
            local_addr, MCAST_PORT, socket.AF_INET6, socket.SOCK_DGRAM
        )[0][4]
        s.bind(sock_addr)

        while True:
            data, sender = s.recvfrom(514)
            if sender[0] != self.host:
                while data[-1:] == "\0":
                    data = data[:-1]  # Strip trailing \0's
                if data.decode("utf-8") == "peers":
                    msg = "bs_peer_resp " + self.host + " " + str(self.id)
                    self.send_message(msg.encode("utf-8"), str(sender[0]))
