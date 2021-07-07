import re

ciphertxt3 = """HG UOVI UJJXUTV VI GI BX, NRG H UB CIG USUTX GQUG UCA MIBBRCHGA QUV U THKQG GI
ZITMX UCIGQXT GI NX MHFHOHVXL. VI OICK UV GQX VRZZXTXTV NA GQX NUL OUS LI CIG HCFIPX 
UVVHVGUCMX ZTIB IGQXT MIBBRCHGHXV, H MUCCIG ULBHG GQUG JXTVICV XCGHTXOA RCMICCXMGXL
SHGQ GQXB IRKQG GI VGXJ HC UCL TXYRHTX GQUG U MICLHGHIC IZ GQHCKV SHGQ SQHMQ UOO SQI 
UTX LHTXMGOA HCGXTXVGXL UJJXUT GI NX VUGHVZHXL, VQIROL NX JRG UC XCL GI NXMURVX HG HV
U VMUCLUO GI JXTVICV VIBX GQIRVUCLV IZ BHOXV LHVGUCG, SQI QUFX CI JUTG IT MICMXTC HC
HG. OXG GQXB VXCL BHVVHICUTHXV, HZ GQXA JOXUVX, GI JTXUMQ UKUHCVG HG; UCL OXG GQXB,
NA UCA ZUHT BXUCV (IZ SQHMQ VHOXCMHCK GQX GXUMQXTV HV CIG ICX), IJJIVX GQX JTIKTXVV
IZ VHBHOUT LIMGTHCXV UBICK GQXHT ISC JXIJOX. HZ MHFHOHVUGHIC QUV KIG GQX NXGGXT IZ
NUTNUTHVB SQXC NUTNUTHVB QUL GQX SITOL GI HGVXOZ, HG HV GII BRMQ GI JTIZXVV GI NX
UZTUHL OXVG NUTNUTHVB, UZGXT QUFHCK NXXC ZUHTOA KIG RCLXT, VQIROL TXFHFX UCL MICYRXT
MHFHOHVUGHIC. U MHFHOHVUGHIC GQUG MUC GQRV VRMMRBN GI HGV FUCYRHVQXL XCXBA, BRVG ZHTVG
QUFX NXMIBX VI LXKXCXTUGX, GQUG CXHGQXT HGV UJJIHCGXL JTHXVGV UCL GXUMQXTV, CIT 
UCANILA XOVX, QUV GQX MUJUMHGA, IT SHOO GUPX GQX GTIRNOX, GI VGUCL RJ ZIT HG. HZ 
GQHV NX VI, GQX VIICXT VRMQ U MHFHOHVUGHIC TXMXHFXV CIGHMX GI YRHG, GQX NXGGXT.
HG MUC ICOA KI IC ZTIB NUL GI SITVX, RCGHO LXVGTIAXL UCL TXKXCXTUGXL (OHPX
GQX SXVGXTC XBJHTX) NA XCXTKXGHM NUTNUTHUCV."""

abc = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S",
"T","U","V","W","X","Y","Z"]

# Ordena os tuplos pelo segundo argumento
def Sort_Tuple(tup):
    lst = len(tup)  
    for i in range(0, lst):  
        for j in range(0, lst-i-1):  
            if (tup[j][1] < tup[j + 1][1]):  
                temp = tup[j]  
                tup[j]= tup[j + 1]  
                tup[j + 1]= temp  
    return tup  

# Conta o número de caracteres
def conta(txt):
    count = 0
    lista = []
    for x in abc:
        y = txt.count(x)
        t = (x,y)
        lista.append(t)
    Sort_Tuple(lista)    
    print(lista)

# Conta o número de vezes que uma palavra aparece retornando (palavra, int)
def contaPalavras(txt):
    count = 0
    listaPal = []
    searched = []
    txt_limpo = re.sub("[,|.|;|)|(]", " ", txt)
    words = txt_limpo.split(" ")
    for x in words:
        if(x not in searched):
            count = words.count(x)
            t=(x,count)
            listaPal.append(t)
        searched.append(x)
    Sort_Tuple(listaPal)    
    print(listaPal)

# Substitui a letra x por a letra y
def subs(txt):
    dic = {}
    dic["U"]="A"
    dic["N"]="B"
    dic["M"]="C"
    dic["L"]="D"
    dic["X"]="E"
    dic["Z"]="F"
    dic["K"]="G"
    dic["Q"]="H"
    dic["H"]="I"
    dic["P"]="K"
    dic["O"]="L"
    dic["B"]="M"
    dic["C"]="N"
    dic["I"]="O"
    dic["J"]="P"
    dic["Y"]="Q"
    dic["T"]="R"
    dic["V"]="S"
    dic["G"]="T"
    dic["R"]="U"
    dic["F"]="V"
    dic["S"]="W"
    dic["A"]="Y"
    txt_limpo = ""
    for x in txt:
        isLetra=re.match("[A-Z]",x)
        if (x not in dic and isLetra):
            txt_limpo += "_"
        elif(not isLetra):
            txt_limpo += x
        else:
            txt_limpo += dic[x]
    return txt_limpo

def main():
    print("Número de Caracteres:\n")
    conta(ciphertxt3)
    print("-------------------------")
    print("Número de Palavras:\n")
    contaPalavras(ciphertxt3)
    print("-------------------------")
    print("Texto final:\n")
    print(subs(ciphertxt3))

if __name__ == "__main__":
    main()
