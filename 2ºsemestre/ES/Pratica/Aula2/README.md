# Aula TP - 02/Mar/2021

Cada grupo deve colocar a resposta às **perguntas** (note que as respostas é apenas às perguntas e não às experiências) dos seguintes exercícios na área do seu grupo no Github até ao final do dia 16/Mar/21. Por cada dia de atraso será descontado 0,15 valores à nota desse trabalho.

Note que os exercícios devem ser efetuados numa máquina Linux.

## Exercícios

### 1\. Números aleatórios/pseudoaleatórios


#### Pergunta P1.1

Teste os seguintes comandos, que vão obter 1024 bytes pseudoaleatórios do sistema e os apresentam em base64:

- `head -c 32 /dev/random | openssl enc -base64`
- `head -c 64 /dev/random | openssl enc -base64`
- `head -c 1024 /dev/random | openssl enc -base64`
- `head -c 1024 /dev/urandom | openssl enc -base64`

Que conclusões pode tirar? Em que se baseia para essas conclusões ?

> Nota: Após algumas questões levantadas pelos alunos, pelo facto do `head -c 1024 /dev/random | openssl enc -base64` não bloquear até existir entropia suficiente, estive a rever este assunto, e:
>
> - Desde 2020, Linux kernel version 5.6 e superior, o /dev/random só bloqueia quando (ou enquanto) o CPRNG (_cryptographic pseudorandom number generator_) não foi inicializado. Após ter sido inicializado, o [/dev/random e /dev/urandom têm o mesmo comportamento](https://www.phoronix.com/scan.php?page=news_item&px=Linux-5.6-Random-Rework).
> - Discussão sobre a remoção do bloqueio ao /dev/random pode ser lida [aqui](https://lwn.net/Articles/808575/).
> - Para quem quiser testar o funcionamento pré-kernel 5.6, pode utilizar [esta máquina virtual](https://meocloud.pt/link/f188f15b-7145-4e11-b59e-6a64f61084a6/CSI.EngSeg.ova/), que tem definido os seguintes utilizador / password: 
>   + user / user
>   + root / root
>

#### Pergunta P1.2

O haveged - <http://www.issihosts.com/haveged/index.html> - é um daemon de entropia adaptado do algoritmo HAVEGE (_Hardware Volatile Entropy Gathering and Expansion_) - <http://www.irisa.fr/caps/projects/hipsor/> -.

Instale a package haveged na sua máquina com o seguinte comando: `sudo apt-get install haveged` (ou comando similar de instalação do seu _flavor_ Linux).

Teste novamente os seguintes comandos, que vão obter 1024 bytes pseudoaleatórios do sistema e os apresentam em base64:

- `head -c 1024 /dev/random | openssl enc -base64`
- `head -c 1024 /dev/urandom | openssl enc -base64`

Que conclusões pode tirar? Em que se baseia para essas conclusões ?



### 2\. Partilha/Divisão de segredo (Secret Sharing/Splitting)


#### Pergunta P2.1

Na diretoria das aulas (Aula2/ShamirSharing) encontra os ficheiros *createSharedSecret-app.py*, *recoverSecretFromComponents-app.py* e *recoverSecretFromAllComponents-app.py* baseado no módulo eVotUM.Cripto (https://gitlab.com/eVotUM/Cripto-py) - siga as instruções de instalação na [branch develop](https://gitlab.com/eVotUM/Cripto-py/-/tree/develop) que já é _compliant_ com o Python 3 -. 

A. Analise e execute esses programas, indicando o que teve que efectuar para dividir o segredo "Agora temos um segredo extremamente confidencial" em 8 partes, com quorom de 5 para reconstruir o segredo.

Note que a utilização deste programa é ``python createSharedSecret-app.py number_of_shares quorum uid private-key.pem`` em que:
+ number_of_shares - partes em que quer dividir o segredo
+ quorum - número de partes necessárias para reconstruir o segredo
+ uid - identificador do segredo (de modo a garantir que quando reconstruir o segredo, está a fornecer as partes do mesmo segredo)
+ private-key.pem - chave privada, já que cada parte do segredo é devolvida num objeto JWT assinado, em base 64

B. Indique também qual a diferença entre *recoverSecretFromComponents-app.py* e *recoverSecretFromAllComponents-app.py*, e em que situações poderá ser necessário utilizar *recoverSecretFromAllComponents-app.py* em vez de *recoverSecretFromComponents-app.py*.


Nota: Relembre-se que a geração do par de chaves pode ser efetuada com o comando ``openssl genrsa -aes128 -out mykey.pem 1024``. O correspondente certificado pode ser gerado com o comando ``openssl req -key mykey.pem -new -x509 -days 365 -out mykey.crt``

### 3\. Authenticated Encryption

**Cenário:**

> A sua empresa quer colocar um serviço no mercado com as seguintes características:
>  + cifragem (com cifra simétrica) de segredos;
>  + decifragem do segredo previamente cifrado;
>  + o cliente pode decifrar o(s) segredo(s) que cifrou durante o tempo em que pagar a anuidade do serviço;
>  + de modo ao cliente saber o que cifrou, pode etiquetar o segredo.

> Para tal, a sua empresa adquiriu um hardware específico de cifra/decifra, em que a chave de cifra é automaticamente mudada todos os dias, sendo identificada por "ano.mes.dia". Esse hardware também efectua HMAC_SHA256 e tem uma API com as seguintes funções:
>  + cifra (segredo_plaintext), devolvendo segredo_cyphertext
>  + decifra (segredo_cyphertext, chave_cifra), devolvendo segredo_plaintext ou erro
>  + hmac (k, str), devolvendo o HMAC_SHA256 da str a autenticar com chave secreta k


### 4\. Algoritmos e tamanhos de chaves

O site https://webgate.ec.europa.eu/tl-browser/ disponibiliza a lista de Entidades com serviços qualificados de confiança, de acordo com o Regulamento EU 910/2014 (eIDAS) - falaremos deste Regulamento noutra aula -.

Entre esses seviços encontra-se o serviço de emissão de certificados digitais qualificados para pessoa física, designado por "QCert for ESig".

#### Pergunta P4.1

Cada grupo indicado abaixo deve identificar os algoritmos e tamanhos de chave utilizados nos certificados das Entidades de Certificação (EC) que emitem certificados digitais qualificados, e verificar se são os mais adequados (e se não forem, propor os que considerar mais adequados):
+ Grupo 7 - Holanda, para a EC "CIBG";

Nota 1: Para Entidades de Certificação que já tenham vários certificados de EC, considere apenas o último certificado emitido.

Nota 2: Para obter o tamanho das chaves e algoritmos utilizados, deverá:
1. escolher o certificado da EC,
2. selecionar _Base 64-encoded_,
3. copiar o conteúdo do _Base 64-encoded_ e gravar em ficheiro (por ex., cert.crt),
4. inserir -----BEGIN CERTIFICATE----- no inicio do ficheiro,
5. inserir -----END CERTIFICATE----- no final do ficheiro,
6. executar o seguinte comando ``openssl x509 -in cert.crt -text -noout`` (substitua cert.crt pelo nome que deu ao ficheiro no passo 3.)

Nota 3: Na sua resposta inclua o resultado do comando ``openssl x509 -in cert.crt -text -noout``, referido na nota anterior.
