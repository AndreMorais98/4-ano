import ca.szc.configparser.Ini;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.nio.file.Files;



public class Monitor {
    public static void main(String[] args) throws IOException {
        //ServerSocket sv = new ServerSocket(12345);
        int i = 0;
        String port = "";
        String adr = "";
        String comm = "";
        String address = "";
        String ram = "";
        Path input = Paths.get("/home/morais/Desktop/snmp/src/logs/config.cfg");
        Ini ini = new Ini().read(input);
        Map<String, Map<String, String>> sections = ini.getSections();
        for (Map<String, String> section : sections.values()) {
            if (section.containsKey("address"))
                adr = section.get("address");
            if (section.containsKey("port"))
                port = section.get("port");
            if (section.containsKey("community"))
                comm = section.get("community");
            if (section.containsKey("ram"))
                ram = section.get("ram");
            //Socket s = sv.accept();

            address = adr + "/" + port;

            String fileName = "/home/morais/Desktop/snmp/src/logs/cpu/" + "host"+ i + "/";

            String fileName1 = "/home/morais/Desktop/snmp/src/logs/ram/" + "host"+ i + "/";



            Path path = Paths.get(fileName);
            Path path1 = Paths.get(fileName1);

            if (!Files.exists(path)) {

                Files.createDirectory(path);
                System.out.println("Directory created");
            } else {

                System.out.println("Directory already exists");
            }

            if (!Files.exists(path1)) {

                Files.createDirectory(path1);
                System.out.println("Directory created");
            } else {

                System.out.println("Directory already exists");
            }


            new Thread(new SNMPClient(i, address, comm, ram)).start();
            i++;
            System.out.println("Cliente a correr...");

            new Thread(new Notifier()).start();
            System.out.println("Notifier a correr...");
        }
    }
}