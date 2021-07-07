from threading import Thread
import json
from pdu import PDU
from cryptography.hazmat.primitives import padding

N = 2
M = 3


class Receiver(Thread):
    """
    Classe que recebe conexões de outros nodos
    """

    def __init__(self, sock, node, cond=None):
        Thread.__init__(self)
        self.sock = sock
        self.node = node
        self.transf = {}
        self.cond = cond

    def run(self):
        bs_node = None

        while True:
            data, addr = self.sock.recvfrom(514)  # buffer size is 1024 bytes
            msg_1 = data.decode().split("_")[0]
            cmd = data.decode().split(" ")

            if cmd[0] == "node_id_resp":
                try:
                    self.cond.acquire()
                    self.cond.notifyAll()
                    print("Meu Id:")
                    self.node.id = cmd[1]
                    print(cmd[1])
                finally:
                    self.cond.release()
            if self.node.id != None:
                if msg_1 == "bs":
                    cmd = data.decode().split(" ")
                    print(cmd[0])
                    if cmd[0] == "bs_peer_resp":
                        nnd = cmd[1:]  #  Node Network Data
                        peer_ip = nnd[0]
                        peer_id = nnd[1]
                        if bs_node == None:
                            print("bs node encontrado")
                            print(peer_ip)
                            bs_node = peer_id
                            # self.node.find(addr[0], self.node.id )
                            nnd = {"id": str(peer_id)}

                            self.node.update(nnd)
                            k = self.node.lookup_by_id(
                                str(self.node.id), peer_id, [nnd], [], []
                            )
                            print("Vou mandar pings?")
                            print(k)
                            if len(k) > 0:
                                for nnd in k:
                                    print("Mandando pings")
                                    print("Ping para", nnd["id"])
                                    self.node.ping(nnd["id"])

                else:
                    cmd = data.decode().split(" ")
                    if cmd[0] == "find_node_resp":
                        print("find_node_resp")
                        nnd = {"id": cmd[1]}
                        cmd2 = data.decode()
                        list_p = json.loads(cmd2[15:])
                        self.node.update(nnd)
                        for nnd in list_p:
                            if (
                                nnd not in self.node.peers
                                and nnd["id"] != self.node.id
                                and len(self.node.peers) < N
                            ):

                                self.node.ping(nnd["id"])

                    elif cmd[0] == "find_node":
                        print("find_node recebido")
                        node_id = cmd[1]
                        nnd = {"id": node_id}
                        self.node.update(nnd)
                        if len(self.node.peers) > 0:
                            peers_list = map(
                                lambda x: {
                                    "id": x["id"],
                                    "dist": self.node.distance(x["id"], node_id),
                                },
                                self.node.peers,
                            )
                            peers_list_sorted = sorted(
                                peers_list, key=lambda x: x["dist"]
                            )
                            msg = (
                                "find_node_resp/"
                                + cmd[1]
                                + "/"
                                + str(self.node.id)
                                + "/"
                                + str(M)
                                + "/"
                                + str(-1)
                            )
                            lst = []
                            for peer in peers_list_sorted:
                                lst.append({"id": peer["id"]})

                            data = json.dumps(lst).encode()
                            self.node.send_dtn_data(msg, data)

                    elif cmd[0] == "ping":
                        print("ping recebido")
                        self.node.pong(cmd[1])
                        nnd = {"id": cmd[1]}
                        self.node.update(nnd)

                    elif cmd[0] == "pong":
                        print("pong recebido")
                        nnd = {"id": cmd[1]}
                        self.node.update(nnd)

                    elif cmd[0] == "store":
                        print("store recebido ")
                        cmd2 = data.decode()
                        kv = json.loads(cmd2[6:])
                        print(kv)
                        self.node.save_data(kv["key"], kv["value"])

                    elif cmd[0] == "find_value":
                        print("find_value recebido ")

                        flag, res = self.node.find_data(cmd[2])
                        # msg = "find_value_resp "
                        resp = {"key": flag, "value": res}
                        # msg += json.dumps(resp)
                        msg = (
                            "find_value_resp/"
                            + cmd[1]
                            + "/"
                            + str(self.node.id)
                            + "/"
                            + str(M)
                            + "/"
                            + str(-1)
                        )
                        data = json.dumps(resp).encode()
                        self.node.send_dtn_data(msg, data)

                    elif cmd[0] == "download":
                        self.node.transfer(cmd[1], cmd[2])

                    elif cmd[0] == "transfer":
                        print("A fazer um transfer!")
                        msg = "transfer " + cmd[1] + " "
                        pdu_data = data[len(msg.encode("utf-8")) :]
                        pdu = PDU()
                        pdu.from_bytes(pdu_data)

                        if addr[0] not in self.transf:
                            self.transf[addr[0]] = {"pdus": [pdu], "total": pdu.total}
                        else:
                            self.transf[addr[0]]["pdus"].append(pdu)
                        print(len(self.transf[addr[0]]["pdus"]))
                        if (
                            len(self.transf[addr[0]]["pdus"])
                            == self.transf[addr[0]]["total"]
                        ):
                            pdu_sorted = sorted(
                                self.transf[addr[0]]["pdus"], key=lambda x: x.seq_number
                            )
                            payload = bytearray()
                            for pdu in pdu_sorted:
                                payload += pdu.payload
                            f = open("./downloads/" + cmd[1], "wb")
                            f.write(payload)
                            f.close()
                            print("Transferencia terminada!")
