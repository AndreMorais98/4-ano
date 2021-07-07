import socket
import threading
from threading import Thread
from receiver import Receiver
from multicast import Multicast
from pdu import PDU
from ndnpdu import PDU as NPDU
import struct
import json
import queue
import hashlib

N = 2
A = 1
M = 2


class Node(Thread):
    """
    Classe que implementa um nodo que é capaz de se conectar a outros, bem como
    aceitar conexões de outros nodos.
    """

    def __init__(self, host, port, node_id=None):
        Thread.__init__(self)
        self.host = host
        self.port = port
        self.peers = []
        self.data = {}
        self.id = node_id

    def send_dtn(self, msg):
        npdu = NPDU(1, msg)
        print("sssendd dtn")
        print(npdu)
        # print(npdu.to_bytes())
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(npdu.to_bytes(), (self.host, 9970))

    def send_dtn_data(self, cn, msg):
        npdu = NPDU(tipo=0, content_name=cn, data=msg)
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(npdu.to_bytes(), (self.host, 9970))

    def init_receiver(self, node, condition=None):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.bind((self.host, self.port))
        thread = Receiver(sock, node, condition)
        thread.start()

    def init_multicast(self, node_id):
        print("iniciando mcast")
        thread = Multicast(self.host, self.port, node_id)
        thread.start()

    def send_message(self, msg, target_add, encoded=False):

        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        if encoded == True:
            sock.sendto(msg, (target_add, self.port))
        else:
            sock.sendto(msg.encode("utf-8"), (target_add, self.port))

    def send_message2(self, msg, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(msg.encode("utf-8"), (target_add, 5000))

    def send_message3(self, msg, target_add):
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        sock.sendto(msg.encode("utf-8"), (target_add, 5001))

    def send_multicast(self):
        print("send multicast")
        MCAST_GRP = "ff15:7079:7468:6f6e:6465:6d6f:6d63:6173"
        MCAST_PORT = 6667
        MESSAGE = b"peers"
        MULTICAST_TTL = 2
        ttl_bin = struct.pack("@i", MULTICAST_TTL)
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        sock.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_MULTICAST_HOPS, ttl_bin)
        sock.sendto(MESSAGE, (MCAST_GRP, MCAST_PORT))

    def find(self, receiver_add, node_id):
        msg = "find_node " + str(node_id)
        self.send_message(msg, receiver_add)

    def lookup_worker(self, node_id, cn, visited_list, size, lst, q):
        port = 5000
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        lists = []
        flag = False
        sock.bind((self.host, port))
        reponses_numb = 0
        last_list = lst
        while True:
            if reponses_numb == size:
                break
            # data received from client
            data, addr = sock.recvfrom(1024)
            cmd = data.decode().split(" ")
            if cmd[0] == "find_node_resp":
                print("recebnedo find_node resp")
                reponses_numb += 1
                cmd2 = data.decode()
                list_p = json.loads(str(cmd2[15 + 33 + 6 :]))
                lists += list_p
                visited_list.append(str(cmd[1]))

        peers_list = list(
            map(
                lambda x: {"id": x["id"], "dist": self.distance(x["id"], node_id)},
                lists,
            )
        )
        res = []
        [
            res.append(x)
            for x in peers_list
            if x not in res and x["id"] not in visited_list
        ]  # remove duplicados e visitados

        for nnd in res:
            if nnd["id"] == node_id:  # encontrou
                flag = True
            if nnd["id"] == str(self.id):
                res.remove(nnd)

        peers_list_sorted = sorted(res, key=lambda x: x["dist"])[:N]
        sock.close()
        q.put((peers_list_sorted, flag, visited_list, last_list))

    def lookup_by_id(
        self, node_id, cn, peers_list_sorted, visited_list, last_list, found=False
    ):
        print("Lookup iniciado")
        if found == True:
            print("Encontrado")
            return peers_list_sorted

        print(peers_list_sorted[0]["id"])
        a = self.distance(peers_list_sorted[0]["id"], node_id)
        b = self.distance(str(cn), node_id)

        if a > b:
            print("Mais próximos:")
            print(last_list)
            return last_list
        else:
            closestNode = peers_list_sorted[0]["id"]

        alpha_lst = peers_list_sorted[:A]

        q = queue.Queue()
        x = threading.Thread(
            target=self.lookup_worker,
            args=(node_id, closestNode, visited_list, len(alpha_lst), alpha_lst, q),
        )
        x.start()

        for peer in alpha_lst:
            msg = (
                "find_node/"
                + peer["id"]
                + "/"
                + str(self.id)
                + "/"
                + str(M)
                + "/"
                + str(-1)
            )
            # self.send_message(msg, peer["ip"])
            self.send_dtn(msg)

        x.join()
        peers_list_sorted, flag, vl, last_list = q.get()
        return self.lookup_by_id(
            node_id, closestNode, peers_list_sorted, vl, last_list, flag
        )

    def save_data(self, key, value):
        self.data[key] = value

    def store(self, file_name):
        print("A dar store")
        m = hashlib.sha256()
        m.update(file_name.encode("utf-8"))
        file_id = m.digest().hex()
        print("ID file")
        print(file_id)
        kv = {"key": file_id, "value": self.id}
        print(kv)
        peers_list = map(
            lambda x: {
                "id": x["id"],
                "dist": self.distance(x["id"], str(file_id)),
            },
            self.peers,
        )
        peers_list_sorted = sorted(peers_list, key=lambda x: x["dist"])
        add = self.lookup_by_id(
            str(file_id), peers_list_sorted[0]["id"], peers_list_sorted, [], []
        )

        cn = (
            "store/"
            + str(add[0]["id"])
            + "/"
            + str(self.id)
            + "/"
            + str(M)
            + "/"
            + str(-1)
        )
        data = json.dumps(kv).encode()

        # store/iddestino/idsource/hash

        self.send_dtn_data(cn, data)

    def ping(self, node_id):
        msg = "ping/" + str(node_id) + "/" + str(self.id) + "/" + str(M) + "/" + str(-1)
        self.send_dtn(msg)

    def pong(self, node_id):
        msg = "pong/" + str(node_id) + "/" + str(self.id) + "/" + str(M) + "/" + str(-1)
        self.send_dtn(msg)

    def distance(self, a, b):
        return int(a, 16) ^ int(b, 16)

    def update(self, nnd):
        print("Recebendo update")

        if nnd in self.peers:
            for index, item in enumerate(self.peers):
                if item["id"] == nnd["id"]:

                    self.peers.append(self.peers.pop(index))

        elif len(self.peers) < N:

            self.peers.append(nnd)

    def find_data(self, key):
        print("No finda data")
        print(self.peers)
        lst = []
        if key in self.data:
            print("Key encontrada")
            return True, self.data[key]
        elif len(self.peers) > 0:
            peers_list = map(
                lambda x: {
                    "id": x["id"],
                    "dist": self.distance(x["id"], key),
                },
                self.peers,
            )
            peers_list_sorted = sorted(peers_list, key=lambda x: x["dist"])
            for peer in peers_list_sorted:
                lst.append({"id": peer["id"]})
        return False, lst

    def find_value_worker(self, node_id, cn, visited_list, size, q):
        port = 5001
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)  # Internet  # UDP
        lists = []
        flag = False
        sock.bind((self.host, port))
        reponses_numb = 0
        peers_list_sorted = []
        while True:
            if reponses_numb == size or flag == True:
                break
            # data received from client
            data, addr = sock.recvfrom(1024)
            cmd = data.decode().split(" ")
            # json{"key" vale}
            if cmd[0] == "find_value_resp":
                print("find_value_resp recebido")
                reponses_numb += 1
                cmd2 = data.decode()
                json_data = json.loads(cmd2[16 + 33 + 6 :])
                print(json_data)
                if json_data["key"] == True:
                    flag = True
                    peers_list_sorted = json_data["value"]
                    break
                else:
                    lists += json_data["value"]
                    visited_list.append(str(cmd[1]))
        if flag == False:
            peers_list = list(
                map(
                    lambda x: {
                        "id": x["id"],
                        "dist": self.distance(x["id"], node_id),
                    },
                    lists,
                )
            )
            res = []
            [
                res.append(x)
                for x in peers_list
                if x not in res
                and x["id"] not in visited_list
                and x["id"] != str(self.id)
            ]  # remove duplicados e visitados
            peers_list_sorted = sorted(res, key=lambda x: x["dist"])[:N]

        sock.close()
        q.put((peers_list_sorted, flag, visited_list))

    def find_value(self, node_id, cn, peers_list_sorted, visited_list, found=False):
        print("Find value iniciado")

        if found == True:
            print("Encontrado valor em:")
            return peers_list_sorted

        a = self.distance(peers_list_sorted[0]["id"], node_id)
        b = self.distance(str(cn), node_id)

        if a > b:
            print("Valor nao encontrado, mais próximos")
            return peers_list_sorted
        else:
            closestNode = peers_list_sorted[0]["id"]

        alpha_lst = peers_list_sorted[:A]

        q = queue.Queue()
        x = threading.Thread(
            target=self.find_value_worker,
            args=(node_id, closestNode, visited_list, len(alpha_lst), q),
        )
        x.start()

        for peer in alpha_lst:
            msg = (
                "find_value/"
                + peer["id"]
                + "/"
                + str(self.id)
                + "/"
                + str(M)
                + "/"
                + node_id
                + "/"
                + str(-1)
            )
            self.send_dtn(msg)

        x.join()
        peers_list_sorted, flag, vl = q.get()
        return self.find_value(node_id, closestNode, peers_list_sorted, vl, flag)

    def init_id(self, node, condition):
        # Iniciar thread para receber conexões.
        print("init_id")
        self.init_receiver(node, condition)
        self.send_dtn("node_id/")  # receber id
        return node

    def bootstrap(self, node, cv, q):
        try:
            cv.acquire()
            cv.wait()
            # Receber multicast
            self.init_multicast(node.id)
            self.send_multicast()  # anunciar-se à rede
            while True:
                if len(node.peers) == N:
                    print("Bootstrap terminado")
                    print("Meus vizinhos:")
                    print(node.peers)
                    q.put(node)
                    return node
        finally:
            cv.release()

    def transfer(self, path, add):

        with open("./myfiles/" + path, "rb") as f:
            print("Vou transferir o ficheiro!-")

            data = f.read()
            last = 0
            file_name = str(path.split("/")[-1])
            msg = b"transfer " + file_name.encode("utf-8") + b" "

            payload_size = 242

            pdu_numb = (int(len(data)) // payload_size) + 1
            print("!!!")
            print(pdu_numb)
            for x in range(pdu_numb):
                msg = b"transfer " + file_name.encode("utf-8") + b" "
                if x == pdu_numb - 1:
                    last = 1

                payload = data[x * payload_size : (x + 1) * payload_size]

                pdu = PDU(x, last, pdu_numb, payload)
                data_msg = pdu.to_bytes()
                # msg += data_msg
                cn = (
                    "transfer/"
                    + add
                    + "/"
                    + str(self.id)
                    + "/"
                    + str(M)
                    + "/"
                    + path
                    + "/"
                    + str(-1)
                )
                dataa = data_msg

                # store/iddestino/idsource/hash

                self.send_dtn_data(cn, dataa)
                # self.send_message(msg, add, True)

    def run(self):

        condition = threading.Condition()

        node_i = Node(self.host, self.port)
        q = queue.Queue()
        # Escolher peers
        t = threading.Thread(
            name="bootstrap", target=self.bootstrap, args=(node_i, condition, q)
        )
        t.start()

        node_i = self.init_id(node_i, condition)
        node = q.get()
        while True:
            c = input()
            cmd = c.split(" ")
            if cmd[0] == "store":
                node.store(cmd[1])
            elif cmd[0] == "find":
                m = hashlib.sha256()
                m.update(cmd[1].encode("utf-8"))
                file_id = m.digest().hex()
                print("File id")
                print(file_id)
                val = node.find_data(str(file_id))
                print(val)
                if val[0] == False:

                    peers_list = map(
                        lambda x: {
                            "id": x["id"],
                            "dist": self.distance(x["id"], str(file_id)),
                        },
                        node.peers,
                    )
                    peers_list_sorted = sorted(peers_list, key=lambda x: x["dist"])
                    print(peers_list_sorted)
                    res = node.find_value(
                        str(file_id), peers_list_sorted[0]["id"], peers_list_sorted, []
                    )
                else:
                    res = val[1]

                print("Resultado find value")
                print(res)

                msg = (
                    "download/"
                    + str(res)
                    + "/"
                    + str(node.id)
                    + "/"
                    + str(M)
                    + "/"
                    + str(cmd[1])
                    + "/"
                    + str(-1)
                )
                node.send_dtn(msg)

            elif cmd[0] == "download":
                msg = (
                    "download/"
                    + str(cmd[1])
                    + "/"
                    + str(node.id)
                    + "/"
                    + str(M)
                    + "/"
                    + str(cmd[2])
                    + "/"
                    + str(-1)
                )
                node.send_dtn(msg)
