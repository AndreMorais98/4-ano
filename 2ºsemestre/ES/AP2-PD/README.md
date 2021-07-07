# Avaliação prática 2 - Projeto de desenvolvimento (PD)

De seguida são apresentados os vários projetos de desenvolvimento. O relatório final e o código fonte deverá ser colocado na área do Grupo no github até ao dia 15/06/2021, na subdiretoria "AP2-PD". Note que no relatório tem de indicar os passos necessários para se poder testar o código fonte, incluindo o ambiente (que se espera que seja preferencialmente Linux).

A apresentação e discussão do trabalho será posteriormente marcada em data/hora a indicar.

Note que o projeto de desenvolvimento, para além do desenvolvimento em si, inclui componentes de:

+ Identificação do “_Software Assurance Maturity Model_ (SAMM)” da equipa, 
+ RGPD PIA, e
+ _Compliance_ com boas práticas de desenvolvimento.

Para algumas destas componentes terão que entregar um relatório no âmbito das fichas de trabalho (avaliação prática 1), na sequência de aulas teóricas sobre o tema. Esses relatórios farão parte do relatório final do projeto de desenvolvimento.

## Objectivos

O objetivo destes projetos de desenvolvimento não é aprender a programar (esse poderia ser o objetivo se fosse um projeto no âmbito da licenciatura), mas

+ Integrar/utilizar/alterar frameworks, APIs, código de terceiros, ..., que sejam relevantes para o seu projeto, de modo a simplificarem o desenvolvimento e/ou aumentarem a segurança;
+ Utilizar metodologia de desenvolvimento de software seguro, realçando-se a [_Fundamental Practices for Secure Software Development_](https://safecode.org/fundamental-practices-secure-software-development-2/), o [_Mitigating the Risk of Software Vulnerabilities by Adopting a Secure Software Development Framework_ (SSDF)](https://csrc.nist.gov/publications/detail/white-paper/2020/04/23/mitigating-risk-of-software-vulnerabilities-with-ssdf/final), e o [Microsoft _Security Development Lifecycle_ (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl);
+ Identificar e melhorar as capacidades do grupo de trabalho no desenvolvimento de software seguro, através do modelo de maturidade [OWASP _Software Assurance Maturity Model_ (SAMM)](https://owasp.org/www-project-samm/);
+ Seguir o standard de verificação de segurança de aplicações ([OWASP _Application Security Verification Standard_](https://github.com/OWASP/ASVS)), no desenvolvimento do projeto;
+ Utilizar [ferramentas de análise de impacto da proteção de dados](https://www.cnil.fr/en/privacy-impact-assessment-pia) (PIA - _Privacy Impact Assessment_), de modo a demonstrar compliance com o RGPD (Regulamento Geral de Proteção de Dados).

Na aula 5 foi pedido para:

+ Utilizar o ciclo de melhoria contínua do SAMM, aplicada ao projeto de desenvolvimento de software que o seu grupo está a desenvolver. A resposta às perguntas da secção 2 da ficha de trabalho dessa aula, para além de serem respondidas no âmbito da ficha de trabalho, devem também ser adicionadas como anexo ao relatório do projeto de desenvolvimento;
+ Seguir as fases do [Microsoft _Security Development Lifecycle_ (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl) que forem relevantes para o seu projeto de desenvolvimento, indicando (no relatório do projeto de desenvolvimento) o que foi feito em relação a cada uma delas.



## 2. Projetos de tipo 2 - Plataforma de emissão de certificados, com CRL, OCSP e timestamp

Com este projeto pretende-se obter uma plataforma para emissão de certificados de teste, que também emita CRL, timestamps e disponibilize o serviço OCSP. Adicionalmente deve ter um interface web para os utilizadores, que os permita autenticar, emitir certificados nas hierarquia configuradas, aceder aos seus certificados (certificados até à raiz da hierarquia de confiança) e chaves, e validar se os certificados ainda estão válidos (no CRL e OCSP), assim como obter e validar timestamps.

As hierarquias configuradas devem ser similares às do Cartão de Cidadão e da Chave Móvel Digital, devendo permitir emitir certificados de autenticação (do Cartão de Cidadão) e assinatura (do Cartão de Cidadão e Chave Móvel Digital), de acordo com os perfis de certificado identificados em <http://pki.cartaodecidadao.pt>.


### 2.3 Baseado em Dogtag e BouncyCastle

**Projeto a efetuar por Grupo 7.**

Neste projeto a componente de emissão de certificados, CRL e OCSP deve ser baseado em [Dogtag](https://www.dogtagpki.org/wiki/PKI_Main_Page). Para a componente de emissão de timestamp deve utilizar a [BouncyCastle Crypto API](https://www.bouncycastle.org) (de modo a ser mais simples essa implementação, pode ver como tal é efetuado no [TimeStampResponder-CSharp](https://github.com/JemmyLoveJenny/TimeStampResponder-CSharp)).


