from threading import Thread
import json
from pdu import PDU
from cryptography.hazmat.primitives import padding
import threading
import time
import uuid


class Receiver(Thread):
    """
    Classe que recebe conexões de outros nodos
    """

    def __init__(self, sock, node, host):
        Thread.__init__(self)
        self.sock = sock
        self.node = node
        self.host = host
        # self.contacts = queue.Queue()
        self.contacts = []
        self.threads = []
        self.atendidos = []
        self.acks = {}

    def polling(self):
        while True:
            self.check_contacts()  # Inicia monitorização de processos
            time.sleep(5)  # Polling

    def polling2(self):
        time.sleep(5)
        while True:
            for key, value in self.acks.items():
                if self.acks[key]["value"] == "0":

                    print("WAIT 2")
                    t.start()
                    t = threading.Thread(
                        name="wait2",
                        target=self.wait_contact2,
                        args=(value["id"], value["pdu"]),
                    )
                    t.start()
            time.sleep(5)

            time.sleep(5)  # Polling

    def check_contacts(self):
        msg = "contact/" + str(self.node.id)
        contact_pdu = PDU(1, msg)
        self.node.send_multicast(contact_pdu.to_bytes())  # obter contactos

    def wait_contact2(self, id, pdu):
        break_flag = False
        while True:
            for i in list(self.contacts):
                if i["id"] == id:  # ver se destino está nos contactos
                    try:
                        print("WAIT 2 4REAL")
                        self.node.send_pdu(pdu, i["ip"])

                        break_flag = True
                        break
                    except IOError as e:
                        self.contacts.remove(i)
                        self.check_contacts()
                        print("UNREACHABLE!!!")

    def send_copies(self, nounce, cmd, ppdu, type_pdu=1):
        print("no send copies")
        visited = []
        count = 0
        copy_num = self.node.cache[nounce]
        while True:
            if count < int(copy_num):
                new_copy_num = (int(copy_num) - 1) // 2

                if len(self.contacts) > 0:
                    for i in list(self.contacts):
                        if count < int(copy_num):
                            idp = str(uuid.uuid1().int)
                            if (
                                cmd[0] == "download"
                                or cmd[0] == "find_value"
                                or cmd[0] == "transfer"
                            ):
                                msg = (
                                    cmd[0]
                                    + "/"
                                    + cmd[1]
                                    + "/"
                                    + cmd[2]
                                    + "/"
                                    + str(new_copy_num)
                                    + "/"
                                    + cmd[4]
                                    + "/"
                                    + idp
                                )
                            else:
                                msg = (
                                    cmd[0]
                                    + "/"
                                    + cmd[1]
                                    + "/"
                                    + cmd[2]
                                    + "/"
                                    + str(new_copy_num)
                                    + "/"
                                    + idp
                                )
                            if type_pdu == 1:
                                msg_pdu = PDU(1, msg, nounce)
                            else:
                                ppdu.content_name = msg
                                msg_pdu = ppdu

                            if i["id"] not in visited:
                                print("Mandando copias")
                                print("para,", i["id"])

                                try:
                                    self.node.send_pdu(msg_pdu, i["ip"])
                                    self.node.cache[nounce] = (
                                        int(self.node.cache[nounce]) - 1
                                    )
                                    count += 1
                                    self.acks[idp] = {
                                        "val": "0",
                                        "pdu": msg_pdu,
                                        "dest": i["id"],
                                    }
                                    visited.append(i["id"])
                                except IOError as e:
                                    self.contacts.remove(i)
                                    self.check_contacts()
                                    print("UNREACHABLE!!!")
                                    break
            else:
                break

    def wait_contact(self, nounce, cmd, ppdu, type_pdu=1):
        break_flag = False
        while True:
            for i in list(self.contacts):
                if i["id"] == cmd[1]:  # ver se destino está nos contactos
                    print("WAIT CONTACT")
                    msg = cmd[0] + "/" + cmd[1] + "/" + cmd[2]

                    if (
                        cmd[0] == "download"
                        or cmd[0] == "find_value"
                        or cmd[0] == "transfer"
                    ):
                        msg = (
                            cmd[0]
                            + "/"
                            + cmd[1]
                            + "/"
                            + cmd[2]
                            + "/"
                            + str(0)
                            + "/"
                            + cmd[4]
                            + "/"
                            + cmd[5]
                        )
                    else:
                        msg = (
                            cmd[0]
                            + "/"
                            + cmd[1]
                            + "/"
                            + cmd[2]
                            + "/"
                            + str(0)
                            + "/"
                            + cmd[4]
                        )

                    if type_pdu == 1:
                        msg_pdu = PDU(1, msg, nounce)
                    else:
                        ppdu.content_name = msg
                        msg_pdu = ppdu
                    try:
                        self.node.send_pdu(msg_pdu, i["ip"])
                        print("WAIT CONTACT CONFIRMADO")
                        del self.node.cache[nounce]
                        break_flag = True
                        break
                    except IOError as e:
                        self.contacts.remove(i)
                        self.check_contacts()
                        print("UNREACHABLE!!!")
            if break_flag == True:
                break

    def send_ack(self, idd, idp):
        msg = "ack/" + idd + "/" + idp
        ack_pdu = PDU(1, msg)
        self.node.send_multicast(ack_pdu.to_bytes())  # obter contactos

    def run(self):
        # Obter contactos
        t = threading.Thread(
            name="check_contactss",
            target=self.polling,
            args=(),
        )
        t.start()

        while True:
            data, addr = self.sock.recvfrom(769)  # buffer size is 1024 bytes

            pdu = PDU()
            pdu.from_bytes(data)
            print(pdu)
            flag = 0

            if pdu.tipo == 1:  # Interesse
                cmd = pdu.content_name.split("/")
                cmd_cleans = [s.strip("\0\1") for s in cmd]

                if cmd_cleans[0] == "contact":
                    print("no contact")
                    msg = (
                        "contact_resp/"
                        + cmd[1]
                        + "/"
                        + str(self.node.id)
                        + "/"
                        + str(self.host)
                    )
                    pdu = PDU(1, msg)
                    flag = 1
                    self.node.send_multicast(pdu.to_bytes())
                if cmd_cleans[0] == "ack":
                    if cmd[2] in self.acks:
                        self.acks[cmd[2]]["val"] = "1"
                    flag = 1
                if cmd_cleans[0] == "node_id":
                    msg = "node_id_resp " + str(self.node.id)
                    flag = 1
                    self.node.send_app(msg.encode(), 9976)
                if cmd_cleans[0] == "contact_resp":
                    flag = 1

                if (
                    cmd[1] == str(self.node.id) and cmd_cleans[0] != "contact"
                ):  # pacotes destinados

                    if cmd[0] == "peers":
                        msg = "find_node"
                        self.node.send_app(msg.encode(), 9976)

                    if cmd_cleans[0] == "contact_resp":
                        print("contact_resp")
                        flag = 1
                        val = {"id": cmd[2], "ip": cmd[3]}

                        if val not in self.contacts:
                            print("vou adicionar")
                            self.contacts.append(val)

                    if cmd_cleans[0] == "find_value":
                        print("no find value")
                        print(cmd[4])
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "find_value " + cmd[2] + " " + cmd[4]
                            self.node.send_app(msg.encode(), 9976)
                            self.send_ack(cmd[1], cmd[4])
                    if cmd_cleans[0] == "download":
                        # download/des/orig/M/PATH/hash
                        print("no find download")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "download " + cmd[4] + " " + cmd[2]
                            self.node.send_app(msg.encode(), 9976)
                            self.send_ack(cmd[1], cmd[5])
                    if cmd[0] == "ping":
                        print("ping")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "ping " + cmd[2]
                            self.node.send_app(msg.encode(), 9976)
                            self.send_ack(cmd[1], cmd[4])
                    elif cmd[0] == "pong":
                        print("pong")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "pong " + cmd[2]
                            self.node.send_app(msg.encode(), 9976)
                            self.send_ack(cmd[1], cmd[4])
                    elif cmd_cleans[0] == "find_node":
                        print("find node recebido")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "find_node " + cmd[2]
                            self.node.send_app(msg.encode("utf-8"), 9976)
                            self.send_ack(cmd[1], cmd[4])

                else:  # Pacote não destinado
                    if flag == 0:
                        if pdu.nounce not in self.node.cache:  # PDU ñ está em cache
                            print("adicionando pacote à cache")
                            self.node.cache[pdu.nounce] = cmd[3]
                            print("Valor da cache:", self.node.cache[pdu.nounce])
                            # recebi uma copia
                            if cmd[0] != "contact" or cmd[0] != "contact_resp":
                                if (
                                    cmd[0] == "download"
                                    or cmd[0] == "find_value"
                                    or cmd[0] == "transfer"
                                ):
                                    if cmd[5] != "-1":
                                        self.send_ack(cmd[1], cmd[5])
                                else:
                                    if cmd[4] != "-1":
                                        self.send_ack(cmd[1], cmd[4])

                        if pdu.nounce in self.node.cache:
                            if int(self.node.cache[pdu.nounce]) > 0:  # tem cópias
                                print("Com copias")
                                print("Pacote não destinado tipo 1")
                                # Thread para mandar cópias
                                t = threading.Thread(
                                    name="sendcopies",
                                    target=self.send_copies,
                                    args=(pdu.nounce, cmd, pdu, 0),
                                )
                                t.start()
                                self.threads.append(t)
                            else:  # ñ tem cópias
                                print("sem copias")
                                # Thread para esperar pelo contacto
                                t = threading.Thread(
                                    name="waitcontact",
                                    target=self.wait_contact,
                                    args=(pdu.nounce, cmd, pdu, 0),
                                )
                                t.start()

            else:  # Pacotes de dados
                print("Pacote de dados tipo 0")
                cmd = pdu.content_name.split("/")
                cmd_cleans = [s.strip("\0\1") for s in cmd]

                if cmd[1] == str(self.node.id):  # Pacotes destinados

                    if cmd_cleans[0] == "find_node":
                        print("no find node")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "find_node " + cmd[2]
                            self.node.send_app(msg, 9976)
                            self.send_ack(cmd[1], cmd[4])
                    if cmd_cleans[0] == "find_node_resp":
                        print("find node resp")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            value = json.loads((pdu.data))
                            value_dum = json.dumps(value)
                            msg = "find_node_resp " + cmd[2] + " " + value_dum
                            self.node.send_app(msg.encode("utf-8"), 5000)
                            self.send_ack(cmd[1], cmd[4])
                    if cmd_cleans[0] == "store":
                        print("Store recebido")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            value = json.loads(pdu.data)
                            value_dum = json.dumps(value)
                            msg = "store " + value_dum
                            self.node.send_app(msg.encode("utf-8"), 9976)
                            self.send_ack(cmd[1], cmd[4])
                    if cmd_cleans[0] == "find_value":
                        print("no find value")
                        print(cmd[4])
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            msg = "find_value " + cmd[2] + " " + cmd[4]
                            self.node.send_app(msg, 9976)
                            self.send_ack(cmd[1], cmd[5])
                    if cmd_cleans[0] == "find_value_resp":
                        print("find value resp")
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            value = json.loads((pdu.data))
                            value_dum = json.dumps(value)
                            msg = "find_value_resp " + cmd[2] + " " + value_dum
                            self.node.send_app(msg.encode("utf-8"), 5001)
                            self.send_ack(cmd[1], cmd[4])
                    if cmd_cleans[0] == "transfer":
                        # c          cn = "transfer/" + add + "/" + str(self.id) + "/" + str(M) + "/" + path
                        if pdu.nounce not in self.atendidos:
                            self.atendidos.append(pdu.nounce)
                            print("Recebi tranfer")
                            msg = b"transfer " + cmd[4].encode("utf-8") + b" "
                            msg += pdu.data
                            self.node.send_app(msg, 9976)
                            self.send_ack(cmd[1], cmd[5])
                else:  # Pacote não destinado
                    if flag == 0:
                        if pdu.nounce not in self.node.cache:  # PDU ñ está em cache
                            print("adicionando pacote à cache")
                            self.node.cache[pdu.nounce] = cmd[3]
                            print("Valor da cache:", self.node.cache[pdu.nounce])

                            if (
                                cmd[0] == "download"
                                or cmd[0] == "find_value"
                                or cmd[0] == "transfer"
                            ):
                                if cmd[5] != "-1":
                                    self.send_ack(cmd[1], cmd[5])
                            else:
                                if cmd[4] != "-1":
                                    self.send_ack(cmd[1], cmd[4])

                        if int(self.node.cache[pdu.nounce]) > 0:  # tem cópias
                            print("Com copias")
                            print("Pacote não destinado tipo 1")
                            # Thread para mandar cópias
                            t = threading.Thread(
                                name="sendcopes",
                                target=self.send_copies,
                                args=(pdu.nounce, cmd, pdu, 0),
                            )
                            t.start()
                            self.threads.append(t)
                        else:  # ñ tem cópias
                            print("sem copias")
                            # Thread para esperar pelo contacto
                            t = threading.Thread(
                                name="waitcontact",
                                target=self.wait_contact,
                                args=(pdu.nounce, cmd, pdu, 0),
                            )
                            t.start()
