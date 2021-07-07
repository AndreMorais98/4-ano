import java.io.*;
import java.net.Socket;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.snmp4j.util.DefaultPDUFactory;
import org.snmp4j.util.TreeEvent;
import org.snmp4j.util.TreeUtils;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import ca.szc.configparser.Ini;
import ca.szc.configparser.exceptions.IniParserException;


public class SNMPClient implements Runnable{

    String comm;
    Snmp snmp = null;
    String address ;
    String port;
    CommunityTarget target;
    String ram;
    private int idCliente;




    //Construtores
    public SNMPClient(int id, String address, String comm, String ram) throws IOException {
        this.idCliente = id;
        this.port = port;
        this.address = address;
        this.comm = comm;
        this.ram = ram;
        target = new CommunityTarget();
        getTarget();
    }



    public void getTarget (){
        target.setCommunity(new OctetString(comm));
        target.setAddress(GenericAddress.parse("udp:" + address));
        target.setRetries(2);
        target.setTimeout(1500);
        target.setVersion(SnmpConstants.version2c);
    }

    public void start() throws IOException {
        TransportMapping transport = new DefaultUdpTransportMapping();
        snmp = new Snmp(transport);
        transport.listen();
    }



    public void criar() throws IOException {
        Map<String, String> result = snmpWalk(".1.3.6.1.2.1.25.4.2.1.2"); // ifTable, mib-2 interfaces
        String key = null;
        String id;
        String name = null;
        //get ID & nome
        for (Map.Entry<String, String> entry : result.entrySet()) {
            key = entry.getKey();
            name = entry.getValue();
            //System.out.println(key + "," + name);

            Pattern pattern = Pattern.compile("[0-9]+$");
            Matcher matcher = pattern.matcher(key);
            matcher.find();
            id = matcher.group();
            //System.out.println(id);



            //CRIAR FICHEIRO CPU
            String path = "/home/morais/Desktop/snmp/src/logs/cpu/" + "host" + idCliente + "/" + id + ".txt" ;
            File file = new File(path);
            file.createNewFile();

            //ESCREVER NOME DO PROCESSO
            FileWriter fileWriter = new FileWriter("/home/morais/Desktop/snmp/src/logs/cpu/" + "host" + idCliente + "/" + id + ".txt" , true );
            PrintWriter printWriter = new PrintWriter(fileWriter);
            printWriter.println(name);
            printWriter.close();

            //CRIAR FICHEIRO RAM
            String path2 = "/home/morais/Desktop/snmp/src/logs/ram/" + "host" + idCliente +"/" + id + ".txt" ;
            File file2 = new File(path2);
            file2.createNewFile();

            //ESCREVER NOME DO PROCESSO
            FileWriter fileWriter2 = new FileWriter("/home/morais/Desktop/snmp/src/logs/ram/" + "host" + idCliente + "/" + id + ".txt" , true );
            PrintWriter printWriter2 = new PrintWriter(fileWriter2);
            printWriter2.println(name);
            printWriter2.close();

        }
    }

    public void escrever_cpu() throws IOException {
        Map<String, String> result = snmpWalk(".1.3.6.1.2.1.25.5.1.1.1"); // ifTable, mib-2 interfaces
        LocalDateTime data = LocalDateTime.now();
        String valor;
        int percentagem;
        String key;
        String id;
        for (Map.Entry<String, String> entry : result.entrySet()) {
            key = entry.getKey();
            valor = entry.getValue();

            //System.out.println(key + "," + valor);

            Pattern pattern = Pattern.compile("[0-9]+$");
            Matcher matcher = pattern.matcher(key);
            matcher.find();
            id = matcher.group();


            FileWriter fileWriter = new FileWriter("/home/morais/Desktop/snmp/src/logs/cpu/" + "host" + idCliente + "/"  + id + ".txt" , true );
            PrintWriter printWriter = new PrintWriter(fileWriter);
            printWriter.println(valor + "," + data);
            printWriter.close();
        }
    }

    public void escrever_ram() throws IOException {
        Map<String, String> result = snmpWalk(".1.3.6.1.2.1.25.5.1.1.2"); // ifTable, mib-2 interfaces
        LocalDateTime data = LocalDateTime.now();
        String valor;
        double percentagem;
        String key;
        String id;
        for (Map.Entry<String, String> entry : result.entrySet()) {
            key = entry.getKey();
            valor = entry.getValue();
            percentagem= (Double.parseDouble(valor)) / (Double.parseDouble(ram)) * 100;
            //System.out.println(key + "," + valor);

            Pattern pattern = Pattern.compile("[0-9]+$");
            Matcher matcher = pattern.matcher(key);
            matcher.find();
            id = matcher.group();


            FileWriter fileWriter = new FileWriter("/home/morais/Desktop/snmp/src/logs/ram/" + "host" + idCliente + "/" + id + ".txt" , true );
            PrintWriter printWriter = new PrintWriter(fileWriter);
            printWriter.println(percentagem + "," +  data);
            printWriter.close();
        }
    }


    public Map<String, String> snmpWalk(String tableOid) {
        Map<String, String> result = new TreeMap<>();
        TreeUtils treeUtils = new TreeUtils(snmp, new DefaultPDUFactory());
        List<TreeEvent> events = treeUtils.getSubtree(target, new OID(tableOid));

        if (events == null || events.size() == 0) {
            System.out.println("Error: Unable to read table!");
            return result;
        }

        for (TreeEvent event : events) {
            if (event == null) {
                continue;
            }
            if (event.isError()) {
                System.out.println("Error: table OID [" + tableOid + "] " + event.getErrorMessage());
                continue;
            }

            VariableBinding[] varBindings = event.getVariableBindings();
            if (varBindings == null || varBindings.length == 0) {
                continue;
            }
            for (VariableBinding varBinding : varBindings) {
                if (varBinding == null) {
                    continue;
                }
                result.put("." + varBinding.getOid().format(), varBinding.getVariable().toString());
            }
        }

        return result;
    }

    public void run() {
        try{
            this.start();
            this.criar();
            System.out.println("A criar ficheiros...");
            while (true){
                this.escrever_cpu();
                System.out.println("A escrever os dados nos ficheiros cpu...");
                this.escrever_ram();
                System.out.println("A escrever os dados nos ficheiros ram...");
                Thread.sleep(30000);
            }
        }
        catch (Exception e){e.printStackTrace();}
    }
}