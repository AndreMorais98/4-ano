# Aula TP - 09/Mar/2021


#### Pergunta P1.1

Como foi visto na aula teórica, a assinatura cega tem três participantes que participam em fases diferentes (cf. slide 11 da aula teórica):

- Requerente - efetua a fase de ofuscação e desofuscação,
- Assinante - efetua a fase de Inicialização e Assinatura,
- Verificador - efetua a fase de Verificação.

Pretende-se que altere o código fornecido para a experiência 1.2, de forma a simplificar o input e output, do seguinte modo (pode adicionar outras opções, se assim o desejar):

- Assinante:

  - `init-app.py`

    - devolve o R' (i.e., pRDashComponents)

  - `init-app.py -init`

    - inicializa as várias componentes (InitComponents e pRDashComponents) e guarda-as (por exemplo, em ficheiro do assinante)

  - `blindSignature-app.py -key <chave privada> -bmsg <Blind message>`

    - devolve s (i.e., Blind Signature)

- Requerente:

  - `ofusca-app.py -msg <mensagem a assinar> -RDash <pRDashComponents>`

    - devolve m' (i.e., Blind message) e guarda as restantes componentes (Blind components e pRComponents) em ficheiro do requerente

  - `desofusca-app.py -s <Blind Signature> -RDash <pRDashComponents>`

    - devolve s' (i.e., Signature)

- Verificador:

  - `verify-app.py -cert <certificado do assinante> -msg <mensagem original a assinar> -sDash <Signature> -f <ficheiro do requerente>`

    - devolve informação sobre se a assinatura sDash sobre a mensagem msg é ou não válida.
