package com.company;

import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.tsp.TSPException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyPair;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Date;

public class Main {

    public static void main(String[] args) {
        FileInputStream is = null;
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        try {
            is = new FileInputStream("key.crt");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        TSResponder tsResponder = new TSResponder(is,"key.key","SHA256");

        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        String text = "Text to hash, cryptographically.";

        // Change this to UTF-16 if needed
        md.update(text.getBytes(StandardCharsets.UTF_8));
        byte[] digest = md.digest();
        byte[] slice = Arrays.copyOfRange(digest, 0, 110);


        try {
            System.err.println((tsResponder.createTspResponse(tsResponder.createTspRequest(new byte[48]))));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TSPException e) {
            e.printStackTrace();
        } catch (OperatorCreationException e) {
            e.printStackTrace();
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        }


    }
}
