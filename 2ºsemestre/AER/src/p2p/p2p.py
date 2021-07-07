from threading import Thread
from node import Node
import netifaces as ni


def main():
    ni.ifaddresses("eth0")
    ipv6 = ni.ifaddresses("eth0")[ni.AF_INET6][0]["addr"]
    udp_addr = ipv6
    udp_port = 9976
    thread = Node(udp_addr, udp_port)
    thread.start()


if __name__ == "__main__":
    main()
