import sys
import math
import re
from string import ascii_lowercase

# Co-primos com 26 sendo estes menores que 26
coprimes26=[1,3,5,7,9,11,15,17,19,21,23,25]

# Calcula a inversa da multiplicação modular necessária 
# para decifragem de uma cifra affine
def modInverse(a, m): 
    a = a % m 
    for x in range(1, m): 
        if ((a * x) % m == 1): 
            return x 
    return 1

# Heurística que com base no trigrama mais frequente tentamos encontar a função 
# afim de forma
# a que as letras do trigrama mais frequente correspondam a THE(19,4,7)
def generateKey(trigram,alphabet) :
    x = 0
    y = 0
    flag=0
    for a in coprimes26:
        for b in range(26):
            if ((modInverse(a,26)*(alphabet[trigram[0].lower()]-b))%26)==19 and ((modInverse(a,26)*(alphabet[trigram[1].lower()]-b))%26) == 7 and ((modInverse(a,26)*(alphabet[trigram[2].lower()]-b))%26) == 4 :        
                if a in coprimes26 : # restrição a tem de ser co-primo com 26
                    x=a
                    y=b
                    flag=1
                break;
    if not flag :
        print("No key")
    return (x,y)

# Ordena os tuplos pelo segundo argumento(frequência)
def Sort_Tuple(tup):
    lst = len(tup)  
    for i in range(0, lst):  
        for j in range(0, lst-i-1):  
            if (tup[j][1] < tup[j + 1][1]):  
                temp = tup[j]  
                tup[j]= tup[j + 1]  
                tup[j + 1]= temp  
    return tup  

# Palavra com três letras mais frequente no criptograma
def mostFrequentTrigram(txt):
    count = 0
    listaPal = []
    searched = []
    txt_limpo = re.sub("[,|.|;|)|(]", "", txt)
    words = txt_limpo.split(" ")
    for x in words:
        if(x not in searched and len(x)==3):
            count = words.count(x)
            t=(x,count)
            listaPal.append(t)
        searched.append(x)
    # ordena lista de tuplos(trigrama,ocorrências) pelo número de ocorrências
    Sort_Tuple(listaPal)   
    return(listaPal[0][0][0],listaPal[0][0][1],listaPal[0][0][2])

# Decifragem do criptograma 
def decode(key,ciphertext,alphabet) :
    clean_text = ""
    i=0
    for letter in ciphertext :
        isLetra=re.match("[A-Z]",letter) # Verifica se caractere é uma letra
        if(isLetra):
            value_letter=(modInverse(key[0],26)*(alphabet[letter.lower()]-key[1]))%26
            for letra, value_letra in alphabet.items(): # procura a letra associada ao valor decifrado
                if value_letra == value_letter:
                    decrypted_letter = letra
            clean_text += decrypted_letter.upper()
        else:
            clean_text += letter.upper()
    print(clean_text)

def main():
    alphabet={}
    i=0

    # Associa por exemplo A->0 B->1 ... Z->26
    for c in ascii_lowercase:
        alphabet[c]=i
        i+=1

    ciphertxt2="""SJ SY VGJ JGG KUEH JG NACUSNA JHIJ QHIJ JHA QSYAYJ GL KIVOSVP, JHGYAQHG
    INA TAYJ AVJSJZAP JG JNUYJ JHASN GQV DUPWKAVJ, LSVP VAEAYYINM JGQINNIVJ JHASN
    NAZMSVW GV SJ, YHGUZP TA YUTKSJJAP JG TM JHIJKSYEAZZIVAGUY EGZZAEJSGV GL I LAQ
    QSYA IVP KIVM LGGZSYH SVPSFSPUIZY,EIZZAP JHA RUTZSE. JHA KGYJ SVJGZANIVJ GL
    EHUNEHAY, JHA NGKIV EIJHGZSEEHUNEH, AFAV IJ JHA EIVGVSYIJSGV GL I YISVJ, IPKSJY,
    IVP ZSYJAVYRIJSAVJZM JG, I "PAFSZ'Y IPFGEIJA." JHA HGZSAYJ GL KAV, SJ IRRAINY,
    EIVVGJ TA IPKSJJAP JG RGYJHUKGUY HGVGUNY, UVJSZ IZZ JHIJ JHA PAFSZEGUZP YIM
    IWISVYJ HSK SY OVGQV IVP QASWHAP. SL AFAV JHA VAQJGVSIVRHSZGYGRHM QANA VGJ
    RANKSJJAP JG TA CUAYJSGVAP, KIVOSVP EGUZP VGJ LAAZIY EGKRZAJA IYYUNIVEA GL SJY
    JNUJH IY JHAM VGQ PG. JHA TAZSALY QHSEHQA HIFA KGYJ QINNIVJ LGN, HIFA VG
    YILAWUINP JG NAYJ GV, TUJ I YJIVPSVWSVFSJIJSGV JG JHA QHGZA QGNZP JG RNGFA JHAK
    UVLGUVPAP. SL JHAEHIZZAVWA SY VGJ IEEARJAP, GN SY IEEARJAP IVP JHA IJJAKRJ
    LISZY, QAINA LIN AVGUWH LNGK EANJISVJM YJSZZ; TUJ QA HIFA PGVA JHA TAYJ JHIJJHA
    ABSYJSVW YJIJA GL HUKIV NAIYGV IPKSJY GL; QA HIFA VAWZAEJAPVGJHSVW JHIJ EGUZP
    WSFA JHA JNUJH I EHIVEA GL NAIEHSVW UY: SL JHAZSYJY INA OARJ GRAV, QA KIM HGRA
    JHIJ SL JHANA TA I TAJJAN JNUJH, SJQSZZ TA LGUVP QHAV JHA HUKIV KSVP SY
    EIRITZA GL NAEASFSVW SJ; IVP SVJHA KAIVJSKA QA KIM NAZM GV HIFSVW IJJISVAP
    YUEH IRRNGIEH JG JNUJH, IYSY RGYYSTZA SV GUN GQV PIM. JHSY SY JHA IKGUVJ GL
    EANJISVJM IJJISVITZATM I LIZZSTZA TASVW, IVP JHSY JHA YGZA QIM GL IJJISVSVW SJ."""
   
    ciphertxt3 = "HG UOVI UJJXUTV VI GI BX, NRG H UB CIG USUTX GQUG UCA MIBBRCHGA QUV U THKQG GI ZITMX UCIGQXT GI NX MHFHOHVXL. VI OICK UV GQX VRZZXTXTV NA GQX NUL OUS LI CIG HCFIPX UVVHVGUCMX ZTIB IGQXT MIBBRCHGHXV, H MUCCIG ULBHG GQUG JXTVICV XCGHTXOA RCMICCXMGXL SHGQ GQXB IRKQG GI VGXJ HC UCL TXYRHTX GQUG U MICLHGHIC IZ GQHCKV SHGQ SQHMQ UOO SQI UTX LHTXMGOA HCGXTXVGXL UJJXUT GI NX VUGHVZHXL, VQIROL NX JRG UC XCL GI NXMURVX HG HV U VMUCLUO GI JXTVICV VIBX GQIRVUCLV IZ BHOXV LHVGUCG, SQI QUFX CI JUTG IT MICMXTC HC HG. OXG GQXB VXCL BHVVHICUTHXV, HZ GQXA JOXUVX, GI JTXUMQ UKUHCVG HG; UCL OXG GQXB, NA UCA ZUHT BXUCV (IZ SQHMQ VHOXCMHCK GQX GXUMQXTV HV CIG ICX), IJJIVX GQX JTIKTXVV IZ VHBHOUT LIMGTHCXV UBICK GQXHT ISC JXIJOX. HZ MHFHOHVUGHIC QUV KIG GQX NXGGXT IZ NUTNUTHVB SQXC NUTNUTHVB QUL GQX SITOL GI HGVXOZ, HG HV GII BRMQ GI JTIZXVV GI NX UZTUHL OXVG NUTNUTHVB, UZGXT QUFHCK NXXC ZUHTOA KIG RCLXT, VQIROL TXFHFX UCL MICYRXT MHFHOHVUGHIC. U MHFHOHVUGHIC GQUG MUC GQRV VRMMRBN GI HGV FUCYRHVQXL XCXBA, BRVG ZHTVG QUFX NXMIBX VI LXKXCXTUGX, GQUG CXHGQXT HGV UJJIHCGXL JTHXVGV UCL GXUMQXTV, CIT UCANILA XOVX, QUV GQX MUJUMHGA, IT SHOO GUPX GQX GTIRNOX, GI VGUCL RJ ZIT HG. HZ GQHV NX VI, GQX VIICXT VRMQ U MHFHOHVUGHIC TXMXHFXV CIGHMX GI YRHG, GQX NXGGXT. HG MUC ICOA KI IC ZTIB NUL GI SITVX, RCGHO LXVGTIAXL UCL TXKXCXTUGXL (OHPX GQX SXVGXTC XBJHTX) NA XCXTKXGHM NUTNUTHUCV."
   
    triagram=mostFrequentTrigram(ciphertxt2)
    print("-------------------------")
    print("Palavra mais frequente com 3 letras:\n")
    print(mostFrequentTrigram(ciphertxt2))
    print("-------------------------")
    print("Valor de (a,b):\n")
    print(generateKey(triagram,alphabet))
    key=generateKey(triagram,alphabet)
    print("-------------------------")
    print("Texto final:\n")
    decode(key,ciphertxt2,alphabet)
    

if __name__ == "__main__":
    main()
