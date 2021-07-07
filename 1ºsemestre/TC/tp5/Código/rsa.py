import os
import math
import itertools

# Valores públicos do módulo 'N' e expoente 'e'.
N = 213271
E = 17

# Texto cifrado.
ciphertxt = [6876, 90542, 209524, 180723, 68349,24407, 1927, 183075, 37458,77446,197372,14551,148450,213237,55592,56745,
15085,103645,154406, 67322, 2002, 39417, 127400, 178722,76999, 37458, 79735,198950,161111,69856,142050,
22632,39091,16950,168529,162080,83943, 72950,24407, 207238, 18354, 38021, 186689, 59975,125376,161647,195221,
44657,48754,96701,72273,108266,209524,16077,112276, 69856, 142050, 22632, 84465, 162080, 36730,
27249, 34758,79735,200474, 186981, 99905, 81699, 56760, 56967,151769, 67608,137974, 76557,
187031, 103901, 128885, 148040, 128883, 54852,166919,168279,44550,19456,80788,141636,159372,
90688,35758,168747,142924,190769,174948,2791,69856,142050,22632,84465,162080,157426,59221,65034,
158258,128733,108251,11016,3376,31144,79735,162990,200008,141687,136850,22342,196127,117300,100284,
64381, 36124, 93455, 97454, 158631, 60424, 91786, 209412,57924,183075, 101801, 55880, 56760, 68019, 164064, 2791,
37458,209662,188390, 68954, 169696, 168434, 115729, 156200, 52926,73555, 193991,37458, 12591, 64130, 61216, 79735,
132216, 194613,167517, 196127,84228, 57242, 122520, 123552, 103901, 176508,43547,145243,69650,209524,
202257,99142,51498,162203,117210,127989, 102955, 77762, 24166, 147550]

# Gera números primos até N.
def primes():
    primes = []
    for num in range(2,11225):  # N/19
        if num > 1:
            for i in range(2, num):
                if (num % i) == 0:
                    break
            else:
                primes.append(num)
    return primes

# Com base nos números primos descobre dois(p,q) tal que p*q = N.
def generateN(primes):
    return [par for par in itertools.combinations(primes,2) if (par[0]*par[1]) == N][0]
    # combinações de produtos entre todos os números primos
    # if (par[0]*par[1]) == N  -> verifica se o produto da combinação é N

# Calcula least common multiple de p e q
def lcm(par):
    return ((par[0]-1)*(par[1]-1))/(math.gcd(par[0]-1,par[1]-1))

# Através do valor de t e E descobre-se d(expoente privado para decifrar) e*d = t*k + 1 para qql k.
def discoverD(t):
    for k in range(0,N):
        if (t*k+1) % E == 0 : # d deve ser um inteiro
            d = (t*k+1)/E
            break
    return d

# Decifra criptograma com chave pública E(17) através do expoente d descoberto.
# --------------------------------------------------------------------------------
# RSA : (valor letra)^e mod N -> cifrar
# RSA : (valor cifrado)^d mod N -> decifrar
# ---------------------------------------------------------------------------------
# RSA Trabalho
# 1)Mapear uma sequência de 3 letras/espaços para um valor = 27^2 * L1 + 27 * L2 + 27 * L3
# 2)cifrar : (valor_sequencia_de_3_mapeada)^e mod N 
# 3)decifrar : (valor_sequencia_de_3_cifrada)^d mod N 
# --------------------------------------------------------------------------------
# RSA resolução trabalho : decifrar valor mapeado = (valor_sequencia_de_3_cifrada)^d mod N -> valor decifrado ->
# através do valor decifrado obter letras ->
# tal que : 27^2 * L1 + 27 * L2 + 27 * L3 = valor decifrado
# ---------------------------------------------------------------------------------
def decode(d,alphabet):
    text_dec = ""
    for x in ciphertxt:
        valor_dec = pow(int(x),int(d),N) # obter valor decifrado : (valor da sequência de 3 letras/espaços cifrada)^d mod N
        seq_letras = () # tuplo que representa as 3 letras/espaços da sequência
        for a in range(0,27):
            for b in range(0,27):
                for c in range(0,27):
                    if (pow(27,2) * a + 27 * b + c) == valor_dec: # 27^2 * L1 + 27 * L2 + 27 * L3 = valor decifrado
                        seq_letras=(alphabet[a],alphabet[b],alphabet[c]) # decifra primeira letra/espaço da sequência (a-L1)
                                                                         # decifra segunda letra/espaço da sequência  (b-L2)
                                                                         # decifra terceira letra/espaço da sequência (c-L3)
        text_dec+= seq_letras[0] + seq_letras[1] + seq_letras[2]

    print(text_dec)

def main():
    i = 0
    mapeamento = {}

    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "

    # mapeia 0-A, 1-B, ..., 25-Z, 26-' '
    for x in alphabet :
        mapeamento[i] = x # associa número a caracter
        i += 1

    par = generateN(primes()) # descobre dois números primos p e q, tal que p*q = n e retorna (p,q)
    t = lcm(par) # cacula t = least common multiple(p-1,q-1)
    d = discoverD(t) # descobre o valor de d
    decode(d,mapeamento) # decifra texto com d

if __name__ == '__main__':
    main()


