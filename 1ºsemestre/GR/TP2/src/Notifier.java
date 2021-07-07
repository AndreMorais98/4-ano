import ca.szc.configparser.Ini;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Properties;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;




public class Notifier implements Runnable {


    public void run(){
        try{
            int i = 0;
            String mail = "";
            double max = 0;
            String proc = "";
            Path input = Paths.get("/home/morais/Desktop/snmp/src/logs/config.cfg");
            Ini ini = new Ini().read(input);
            Map<String, Map<String, String>> sections = ini.getSections();
            for (Map<String, String> section : sections.values()) {
                if (section.containsKey("email"))
                    mail = section.get("email");
                if (section.containsKey("max"))
                    max = Double.parseDouble(section.get("max"));
                if (section.containsKey("proc"))
                    proc = section.get("proc");
            }

            String fileName = "/home/morais/Desktop/snmp/src/logs/ram/" + "host"+ i + "/" + proc + ".txt";
            System.out.println("A procurar ficheiro");
            Thread.sleep(7000);
            System.out.println("Encontrado");

            String nome, last=null, line;
            BufferedReader in = new BufferedReader(new FileReader(fileName));
            nome = in.readLine();
            while ((line = in.readLine()) != null) {
                if (line != null) {
                    last = line;
                }
            }
            System.out.println("Nome proc:" + nome);
            in.close();
            double perc = Double.parseDouble(last.split(",")[0]);
            System.out.println(perc);

            while(true){
                if(max < perc) {
                    Properties props = new Properties();
                    /** Parâmetros de conexão com servidor Gmail */
                    props.put("mail.smtp.host", "smtp.gmail.com");
                    props.put("mail.smtp.socketFactory.port", "465");
                    props.put("mail.smtp.socketFactory.class",
                            "javax.net.ssl.SSLSocketFactory");
                    props.put("mail.smtp.auth", "true");
                    props.put("mail.smtp.port", "465");

                    Session session = Session.getDefaultInstance(props,
                            new javax.mail.Authenticator() {
                                protected PasswordAuthentication getPasswordAuthentication() {
                                    return new PasswordAuthentication("fusemailtestts@gmail.com",
                                            "fusemailtstest");
                                }
                            });

                    /** Ativa Debug para sessão */
                    session.setDebug(true);

                    Message message = new MimeMessage(session);
                    message.setFrom(new InternetAddress("fusemailtestts@gmail.com"));
                    //Remetente

                    Address[] toUser = InternetAddress.parse(mail);
                    message.setRecipients(Message.RecipientType.TO, toUser);
                    message.setSubject("ALERT NOTIFICATION");//Assunto
                    message.setText("The process " + proc + " has reached the limit that was estabilished, that is " + max +"% of ram.");
                    /**Método para enviar a mensagem criada*/
                    Transport.send(message);

                    System.out.println("Email sent!");
                }
                Thread.sleep(30000);
            }
        }
        catch(Exception e){e.printStackTrace();}
    }
}
