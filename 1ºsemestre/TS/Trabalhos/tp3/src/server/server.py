#!/usr/bin/env python

import asyncio
import websockets
import socket
import configparser

def _resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
        return os.path.join(base_path, "config.data")
    except Exception:
        base_path = os.path.abspath(".")
        return os.path.join(base_path, relative_path)

async def connect(websocket, path):
    code = await websocket.recv() # recebe input do form html
    print(f"< {code}")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    config = configparser.ConfigParser()
    # inicia parsing do ficheiro de configuração
    config.read(_resource_path('../configs/config.data'))
    host = config['SocketTCP']['host']
    port = int(config['SocketTCP']['port'])
    sock.connect((host, port)) # conecta-se ao ao socker do filesystem
    sock.sendall(bytes.fromhex(code)) # invia input para socket no filesystem

start_server = websockets.serve(connect, "localhost", 9998)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
