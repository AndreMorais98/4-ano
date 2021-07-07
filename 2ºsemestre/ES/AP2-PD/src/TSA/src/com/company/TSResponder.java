package com.company;

import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.oiw.OIWObjectIdentifiers;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.ocsp.CertificateID;
import org.bouncycastle.cms.CMSAlgorithm;
import org.bouncycastle.cms.SignerInfoGenerator;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.crypto.Digest;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.internal.AsymmetricCipherKeyPair;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.provider.X509CertificateObject;
import org.bouncycastle.operator.*;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoGeneratorBuilder;
import org.bouncycastle.operator.bc.BcDigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.openssl.*;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcePEMDecryptorProviderBuilder;
import org.bouncycastle.operator.DigestCalculator;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.tsp.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.CertificateEncodingException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import org.bouncycastle.asn1.nist.NISTObjectIdentifiers;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;

import java.math.BigInteger;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import java.util.Random;

public class TSResponder {
    public X509Certificate x509Cert;
    public PrivateKey priKey;
    public String hashAlg;

    public TSResponder(InputStream x509Cert, String privateKeyFileName, String hashAlg){
        this.x509Cert = setCert(x509Cert);
        this.priKey = setPriKey(privateKeyFileName);
        this.hashAlg = hashAlg;

    }

    public X509Certificate setCert(InputStream x509Cert){
        InputStream in = null;
        try {
            in = new FileInputStream("key.crt");
            CertificateFactory factory = CertificateFactory.getInstance("X.509");
            X509Certificate cert = (X509Certificate) factory.generateCertificate(in);
            System.out.println(cert);
            return cert;
        } catch (FileNotFoundException | CertificateException e) {
            e.printStackTrace();
        }


        return null;
    }

    public PrivateKey setPriKey(String keyFile){

        KeyFactory factory = null;
        try {
            factory = KeyFactory.getInstance("RSA");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        try (FileReader keyReader = new FileReader("key.key");
             PemReader pemReader = new PemReader(keyReader)) {

            PemObject pemObject = pemReader.readPemObject();
            byte[] content = pemObject.getContent();
            PKCS8EncodedKeySpec privKeySpec = new PKCS8EncodedKeySpec(content);
            return (RSAPrivateKey) factory.generatePrivate(privKeySpec);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }


        return null;


    }

    public byte[] GenResponse(byte[] bRequest, Date signTime) {
        byte[] bSerial = new byte[16];
        new Random().nextBytes(bSerial);
        BigInteger biSerial = new BigInteger(1, bSerial);
        return RFC3(bRequest, signTime, biSerial);
    }

    private byte[] RFC3(byte[] bRequest, Date signTime, BigInteger biSerial) {

        try {
            TimeStampRequestGenerator reqGen = new TimeStampRequestGenerator();
            reqGen.setCertReq(true);
            byte[] encRequest = reqGen.generate(TSPAlgorithms.SHA256, bRequest).getEncoded();
            AlgorithmIdentifier digestAlgorithm = new AlgorithmIdentifier(NISTObjectIdentifiers.id_sha256);
            DigestCalculatorProvider digProvider = new JcaDigestCalculatorProviderBuilder().build();
            TimeStampTokenGenerator tsTokenGen = new TimeStampTokenGenerator(
                    new JcaSimpleSignerInfoGeneratorBuilder().build("SHA256withRSA", priKey, this.x509Cert),
                    digProvider.get(digestAlgorithm),
                    new ASN1ObjectIdentifier("1.2"));

            TimeStampResponseGenerator tsRespGen = new TimeStampResponseGenerator(tsTokenGen, TSPAlgorithms.ALLOWED);
            TimeStampResponse x = tsRespGen.generate(new TimeStampRequest(encRequest), new BigInteger("23"), new Date());
            byte[] result = x.getEncoded();
            System.out.println(x.getTimeStampToken());
            return result;

        } catch (OperatorCreationException | TSPException | IOException | CertificateEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public byte[] createTspRequest(byte[] sha256Data)
            throws IOException
    {
        TimeStampRequestGenerator reqGen = new TimeStampRequestGenerator();
        reqGen.setCertReq(true);
        return reqGen.generate(TSPAlgorithms.SHA256, sha256Data).getEncoded();
    }

    public byte[] createTspResponse(byte[] encRequest)
            throws TSPException, OperatorCreationException, GeneralSecurityException, IOException
    {
        AlgorithmIdentifier digestAlgorithm = new AlgorithmIdentifier(NISTObjectIdentifiers.id_sha256);
        DigestCalculatorProvider digProvider = new JcaDigestCalculatorProviderBuilder().build();
        TimeStampTokenGenerator tsTokenGen = null;
        try {
            tsTokenGen = new TimeStampTokenGenerator(
                    new JcaSimpleSignerInfoGeneratorBuilder().build("SHA256withRSA", this.priKey, this.x509Cert),
                    digProvider.get(digestAlgorithm),
                    new ASN1ObjectIdentifier("1.2"));
        } catch (CertificateEncodingException e) {
            e.printStackTrace();
        }


        TimeStampResponseGenerator tsRespGen = new TimeStampResponseGenerator(tsTokenGen, TSPAlgorithms.ALLOWED);
        TimeStampResponse response = tsRespGen.generate(new TimeStampRequest(encRequest), new BigInteger("23"), new Date());
        System.out.println(response.getTimeStampToken());
        return response.getEncoded();
    }


    public boolean verifyTspResponse(byte[] encResponse)
            throws IOException, TSPException, OperatorCreationException
    {
        TimeStampResponse tsResp = new TimeStampResponse(encResponse);

        TimeStampToken tsToken = tsResp.getTimeStampToken();

        tsToken.validate(new JcaSimpleSignerInfoVerifierBuilder().build(this.x509Cert));

        return true;
    }

    private byte[] RFC3161(byte[] bRequest, Date signTime, BigInteger biSerial) {

        try {
            TimeStampRequestGenerator tsReqGen = new TimeStampRequestGenerator();
            TimeStampRequest timeStampRequest = tsReqGen.generate(CMSAlgorithm.SHA256, bRequest);
            /** Gerar Token **/
            AlgorithmIdentifier id = AlgorithmIdentifier.getInstance(new DefaultSignatureAlgorithmIdentifierFinder().find("SHA256withRSA"));
            System.out.println(id);
            DigestCalculator dgCalc = new BcDigestCalculatorProvider().get(new AlgorithmIdentifier(OIWObjectIdentifiers.idSHA1));
            //DigestCalculator dgCalc = new BcDigestCalculatorProvider().get(id);
            ContentSigner signer = new JcaContentSignerBuilder("SHA256WithRSA").build(this.priKey);
            SignerInfoGenerator siGen = (new JcaSignerInfoGeneratorBuilder(new JcaDigestCalculatorProviderBuilder().build()).build(signer, this.x509Cert));
            ASN1ObjectIdentifier policy = new ASN1ObjectIdentifier("1.2.3.4.5.6"); // Replace by your timestamping policy OID
            TimeStampTokenGenerator timeStampTokenGenerator = new TimeStampTokenGenerator(siGen, dgCalc, policy);

            /** Gerar Resposta **/
            TimeStampResponseGenerator timeStampResponseGenerator = new TimeStampResponseGenerator(timeStampTokenGenerator,TSPAlgorithms.ALLOWED);
            TimeStampResponse  timeStampResponse = timeStampResponseGenerator.generate(timeStampRequest, biSerial, signTime);
            byte[] result = timeStampResponse.getEncoded();
            System.out.println(timeStampResponse.getTimeStampToken());

            return result;
        } catch (OperatorCreationException | TSPException | IOException | CertificateEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }
}
