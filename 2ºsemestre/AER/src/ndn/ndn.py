from node import Node
import netifaces as ni
import uuid


def main():
    ni.ifaddresses("eth0")
    ipv6 = ni.ifaddresses("eth0")[ni.AF_INET6][0]["addr"]
    udp_addr = ipv6
    udp_port = 9970
    node_id = uuid.uuid1().int
    thread = Node(udp_addr, udp_port, node_id)
    thread.start()


if __name__ == "__main__":
    main()
