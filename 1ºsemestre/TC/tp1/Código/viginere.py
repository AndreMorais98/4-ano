import re
from pprint import pprint

# Ter cuidado com os espaços
ciphertext1 = "WMP BRHEMGQJ JD YSZ RWTBGQ ZA RZC QHAPMYO OJKHXEDA WLXCV QMMP DZTHWLG DGZMGJNYVJ XEJANX, FDX WCHS XYUWTZB YZ YQ LWQXWO CAYCZKH MT VTXZ DZECMUX. RKJJ ZHQTZTH ECYW PQCUD MYFJ RFLHS ZUJPYQ YCPC, WZR YSZ GNDOGQHEDTH NCYUFNOCUX WC JGZP XZ QONRCR, SVQ MLY LYD ULQO NUTEJRBUP. DY OFLX MYWJ OFHWP KXXE FDAP CANDOCG LO OJLNR F NARWP MI DKCFNPN RK RGOI XYWYWZ, FD KDSJ QKJPK, FYY VJGZPDQ BMDYD, LS ZSUTAZ DQZIC, LIB XPQCUFW CYJY ULYSDL LCZYW MMGWFTI. TYZ DZECMU MZJLJGZQ YSVR YSZPH QJPPJCGW JIDQWJO COJGZL BTGB XAZALJD MI DCCHU KCFZWDYU EJ JWPVR GCDRDNY! ZMPI ZJ WCDW DL RTIB YSVR GCDRDNY FDX IMZ YJR TYZ SJNPJLFC KDRXVJ, LIB KCVLFJ WSW QZU ITNRLSNO IWZH WMZNC TQ EHWXVLB, VLG DJ ZNEC KZYBYUD, QSFTI, JEX., MPR YSVR JLXF TQ RKJDZ NNYBBRRD NRXDZQVJD QHAPMYO AZAXQTVP GCZCGX JD HLOROJ, QKJPK, JEX., HZ PZDO DIXDR YSVR RLIW IZHCVYTX EWPZBV XPQW SVTH ZMGJNYVRHI DL JFMMSJ; DRW RFHSNZ RYSZPZNDZ FTFGB YSZW MLQC GPZL IPMGYJO? VT DR ND GQ TIBLF. CYJY GQ ECC HLNC TQ RKJ WPHJON RK OFH OJKHXEDA IZB WMCJSJMZPR YSZ ZTCGB, HCGFM D DIXDR FCZ GJDXCQIPY IWZH VJGZPDQ RGOI NNHHTZQ, TO FFYIMW MZ GTFWRHI OFDY OFHWP FDX WCHS VL NXHCQXP YPTFIR TQ GQMPMGWJO TDWTVRLTY; ITC UKT RGOQ WCONPQC YSVR FYDKDQD AOTDZJB CZQHRMGGQL OFH TOYONLI JWPTFRZYY, YSZ EQZJBKTFIB, ECC GFGJ-IZB, UFB-GTR, RW WJHSSZGP DKYQNPG, JEX.—XZ SQQTFC FWG ZNWY FFYDBDJ—ZTHW ZVLXEZB NY Y XEVRH ZA QFEPPH? DR MLN RKEZL GPZL QZJQHQJ QDNO RKFE YOQ JSU CVAHX JD IZBQ MLQC GPZL UCJBXHPY ED OFH NMMVXTIE TQ Y KPR DGZMGJNYVJ XAZALJD; EZE ZB NMMVXTIE BP ADS JLOD BCW QJPPX DL XZHC IPBPHJ DLWJCHCGNLOC GPOUHJY RKJTM SFCZLWX; YQI DD BP YFHZPLW QJP TFM VJGZPDQ YMPJDOGF CVAHX WW YSDQ UCJAHXD, ZJ HSVY VBPNE RKJ AMURPM HCTNRHSNZ RK OFH XJQW PSRUJXZ ITCHQ, LN WMP GWFWDYQ RMCBMZPLG, WJRTOCMXSO, EZWG-GTR, HYN., NY RKJ RGOI NRDYP. PTCZMYJC, WMP NRXDDZLQTOW TQ KDPTIE ITNRLSNO UFNZQ GJ AUTDNGQL CYV MZCQ RMCDYWT HCLBEHWLOCG. HYQD XYVJD YUJ JL WPXMUI NFRBTIE YSVR F MYFJ HYB MZ PTODDLJO ZB ZXADXTJLDQ XPRXDZQ NQ YLIPY ED OFH NVPHKFG VJWZAWNZI RK OFH TIBLATYSDQD UKNNC SWPNCQY OFH OZQLWPY FMLMYFYPM; GFO WT JZWFTI D CVAH TIRHWXZBLFEZ EJERCHS OUR BPGWJ YGVYTIAW CVAHX RMXQO ZH GZPB ODDINNPJW. NGU U. VJMMGJME CAUCZQVQJ CAUPMGPJYOCG HDRK ECGV ZWHHHE YQI AYLQPY. YSZ RKQNNUNYB IWZH WMP DLWDO FWZNQ GPOUHJY RZT KSUJ WPHJON LX OMOJCVZOD VLG DJKHYTHCV (VQ N CYYJ AMXSO ULYS NLLPJLV) LSLYP SQNQJPP TI FMLMYFYPM, FYY HAPMW YSDLJ DZCPX NGPUWZ HSZPEK; WSW HCCQ ECCVJ HMQLCZJV LMC HCJQVJO MQJ RGWM VLRYSZP KZM VJGZPDQ BCQJCVRLTYN, MLMBOD OUR ZA WMPH DWP YONVZ, FYY WMPI WMP BLKQDAXQET RK OFH EVQN MZARRPN PFYDDHXE."
key_length = 5

# Retorna todas as palavras com 3 letras e o índice onde estas aparecem no criptograma
def contaPalavras(ciphertxt):
    dic = {}
    i = 0
    count = 0
    lista = []
    txt_limpo = re.sub("[!|?|—|-|,|.|;|)|(]", " ", ciphertxt)
    words = txt_limpo.split(" ")
    parts = list(set(words))
    for x in parts:
        i += 1
        if (len(x) == 3):
            # encontra offset do início de cada palavra
            l= [m.start() for m in re.finditer(x, ciphertxt)]
            par = (x,l)
            lista.append(par)
    return lista

# Divide criptograma em blocos de 5
def divide(txt):
    lst = [txt[i:i+key_length] for i in range(0, len(txt), key_length)]
    return lst

# Retorna o texto limpo do criptograma passado por argumento através da chave que lhe é dada
def decode_viginere(ciphertxt):
    chave="DFLVY" 
    alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
   
    data={}
    i=0

    for x in alphabet :
        data[x]=i # associa alfabeto a número ex: A->0,B->1 ... Z->26
        i+=1
    
    index_key=0 # key vai ser repetida ao longo do texto com periodo len(key)
    cif=0
    letra=""
    texto_decifrado=""
    res = ciphertxt.split(' ')  
    texto_size=len(res)
    for word in res : # para cada palavra do criptograma
        for x in word : # para cada letra da palavra do criptograma
            special=re.match("[();,-.—?!\'`´]",x) # caracteres que não são cifrados
            if not special :
                decif=(data[x]-data[chave[index_key]]) % len(alphabet) # função decode 
                for key, value in data.items(): # letra correspondente ao número decifrado
                     if decif == value: 
                        letra = key
                texto_decifrado += letra # adiciona ao texto limpo
            else : 
                texto_decifrado += x # se for caratere não correspondente ao alfabeto fica como está
            index_key+=1 # aumenta key
            if index_key == len(chave) : # periodicidade da key
                index_key=0
        texto_size-=1 # percorre palavras
        if texto_size >= 1 :
            index_key += 1 # aumenta key
            if index_key == len(chave) : # periodicidade da key
                index_key=0
            texto_decifrado += ' ' # adiciona espaço entre palavras 
    return texto_decifrado


def main():
    print("-------------------------")
    print("Índice das palavras com 3 letras:\n")
    pprint(contaPalavras(ciphertext1))
    print("-------------------------")
    print("Criptograma em blocos:\n")
    print(divide(ciphertext1))
    print("-------------------------")
    print("Texto final:\n")
    print(decode_viginere(ciphertext1))

if __name__ == "__main__":
    main()

