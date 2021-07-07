class PDU:
    """ """

    def __init__(self, seq_number=None, last=None, total=None, payload=None):
        self.seq_number = seq_number
        self.last = last
        self.total = total
        self.payload = payload

    def __str__(self):
        string = "PDU: "
        string += "sn: " + str(self.seq_number)
        string += " islast: " + str(self.last)
        return string

    def to_bytes(self):
        packet = b""
        packet += self.seq_number.to_bytes(4, "big")
        packet += self.last.to_bytes(4, "big")
        packet += self.total.to_bytes(4, "big")
        packet += self.payload
        return packet

    def from_bytes(self, pdu):
        self.seq_number = int.from_bytes(pdu[:4], "big")
        self.last = int.from_bytes(pdu[4:8], "big")
        self.total = int.from_bytes(pdu[8:12], "big")
        self.payload = pdu[12:]
