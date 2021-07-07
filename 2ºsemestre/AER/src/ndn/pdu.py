import os
from cryptography.hazmat.primitives import padding


class PDU:
    """ """

    def __init__(self, tipo=None, content_name=None, nounce=None, data=None):
        self.tipo = tipo
        self.content_name = content_name
        if nounce == None:
            self.nounce = self.nounce_generator()
        else:
            self.nounce = nounce
        self.data = data

    def nounce_generator(self):
        nounce = os.urandom(32)
        return nounce

    def __str__(self):
        string = "PDU: "
        string += "tipo: " + str(self.tipo)
        string += " cn: " + self.content_name
        # string += ' nounce: ' + self.nounce.decode()
        return string

    def to_bytes(self):
        packet = b""
        packet += self.tipo.to_bytes(4, "big")  # 4 bytes

        if self.tipo == 1:
            if len(self.content_name.encode("utf-8")) < 255:
                padder = padding.PKCS7(2040).padder()  # bits
                padded_data = (
                    padder.update((self.content_name.encode("utf-8")))
                    + padder.finalize()
                )
                packet += padded_data  # max 255

            if len(self.nounce) < 255:
                padder = padding.PKCS7(2040).padder()  # bits
                padded_data = padder.update(self.nounce) + padder.finalize()
                packet += padded_data  # 32

            if self.data == None:
                data = bytearray(255)
                packet += data
        else:
            if len(self.content_name.encode("utf-8")) < 255:
                padder = padding.PKCS7(2040).padder()  # bits
                padded_data = (
                    padder.update((self.content_name.encode("utf-8")))
                    + padder.finalize()
                )
                packet += padded_data  # max 255

            if len(self.data) < 255:
                padder = padding.PKCS7(2040).padder()
                padded_data = padder.update(self.data) + padder.finalize()
                packet += padded_data

            if len(self.nounce) < 255:
                padder = padding.PKCS7(2040).padder()  # bits
                padded_data = padder.update(self.nounce) + padder.finalize()
                packet += padded_data  # 32

        return packet

    def from_bytes(self, pdu):
        self.tipo = int.from_bytes(pdu[:4], "big")

        if self.tipo == 1:
            unpadder = padding.PKCS7(2040).unpadder()
            content_name_padded = pdu[4:-510]
            contant_name_unp = (
                unpadder.update(content_name_padded) + unpadder.finalize()
            )
            self.content_name = contant_name_unp.decode("utf-8")

            unpadder = padding.PKCS7(2040).unpadder()
            nounce_padded = pdu[-510:-255]
            nounce_unp = unpadder.update(nounce_padded) + unpadder.finalize()
            self.nounce = nounce_unp
            self.data = None
        else:
            unpadder = padding.PKCS7(2040).unpadder()
            content_name_padded = pdu[4:-510]
            contant_name_unp = (
                unpadder.update(content_name_padded) + unpadder.finalize()
            )
            self.content_name = contant_name_unp.decode("utf-8")

            unpadder = padding.PKCS7(2040).unpadder()
            data_unp = unpadder.update(pdu[-510:-255]) + unpadder.finalize()
            self.data = data_unp

            unpadder = padding.PKCS7(2040).unpadder()
            nounce_padded = pdu[-255:]
            nounce_unp = unpadder.update(nounce_padded) + unpadder.finalize()
            self.nounce = nounce_unp
