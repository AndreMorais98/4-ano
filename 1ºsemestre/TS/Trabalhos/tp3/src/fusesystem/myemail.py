import smtplib
import os,sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
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

def send (userEmail,code):
    
    config = configparser.ConfigParser()
    # inicia parsing do ficheiro de configuração
    config.read(_resource_path('../configs/config.data'))

    gmail_user = config['GmailUser']['gmail_user']
    gmail_password = config['GmailUser']['gmail_password']

    sent_from = 'fusemailtestts@gmail.com'
    to = userEmail
    subject = 'Código de acesso'
    body = 'Código:' + code

    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sent_from
    message['To'] = userEmail
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_password)
        email_text = message.as_string()
        server.sendmail(sent_from, to, email_text)
        server.close()
        print('Email enviado')
    except Exception as e: print(e)
    
    
