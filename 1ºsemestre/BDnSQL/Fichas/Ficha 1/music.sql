
--2)


--AUTOR {ID_AUTOR, NOME}
--EDITORA {ID_EDITORA, NOME}
--GENERO {ID_GENERO, NOME}
--SUPORTE {ID_SUPORTE, NOME}
--TITULO (ID_TITULO, TITULO, PRECO, DTA_COMPRA, ID_EDITORA, ID_SUPORTE, ID_GENERO, ID_AUTOR}MUSICA {ID_MUSICA, NOME, ID_AUTOR, ID_TITULO}
--REVIEW { ID_REVIEW, ID_TITULO, DTA_REVIEW, CONTEUDO}

------------------------------------------------------------------------------------
--AUTOR {ID_AUTOR, NOME} 
------------------------------------------------------------------------------------

CREATE TABLE AUTOR 
(
 ID_AUTOR NUMBER(3, 0) NOT NULL ,
 NOME VARCHAR2(255) NOT NULL ,
 CONSTRAINT AUTOR_PK PRIMARY KEY ( ID_AUTOR ) 
 ENABLE 
);

------------------------------------------------------------------------------------
--EDITORA {ID_EDITORA, NOME}
------------------------------------------------------------------------------------

CREATE TABLE EDITORA 
(
  ID_EDITORA NUMBER(3, 0) NOT NULL 
, NOME VARCHAR2(255) NOT NULL 
, CONSTRAINT EDITORA_PK PRIMARY KEY ( ID_EDITORA )
  ENABLE 
);

------------------------------------------------------------------------------------
--GENERO {ID_GENERO, NOME}
------------------------------------------------------------------------------------

CREATE TABLE GENERO 
(
  ID_GENERO NUMBER(3, 0) NOT NULL 
, NOME VARCHAR2(255) NOT NULL 
, CONSTRAINT GENERO_PK PRIMARY KEY ( ID_GENERO )
  ENABLE 
);

------------------------------------------------------------------------------------
--SUPORTE {ID_SUPORTE, NOME}
------------------------------------------------------------------------------------

CREATE TABLE SUPORTE 
(
  ID_SUPORTE NUMBER(3, 0) NOT NULL 
, NOME VARCHAR2(255) NOT NULL 
, CONSTRAINT SUPORTE_PK PRIMARY KEY ( ID_SUPORTE )
  ENABLE 
);

------------------------------------------------------------------------------------------
--TITULO (ID_TITULO, TITULO, PRECO, DTA_COMPRA, ID_EDITORA, ID_SUPORTE, ID_GENERO, ID_AUTOR}
------------------------------------------------------------------------------------------

CREATE TABLE TITULO 
(
  ID_TITULO NUMBER NOT NULL 
, TITULO VARCHAR(255) NOT NULL 
, PRECO NUMBER(5, 2) NOT NULL 
, DTA_COMPRA DATE NOT NULL 
, ID_EDITORA NUMBER(3, 0) NOT NULL 
, ID_SUPORTE NUMBER(3, 0) NOT NULL 
, ID_GENERO NUMBER(3, 0) NOT NULL 
, ID_AUTOR NUMBER(3, 0) NOT NULL 
, CONSTRAINT TITULO_PK PRIMARY KEY ( ID_TITULO )
  ENABLE 
);

-- As chaves estrangeiras foram adicionadas a posterior no Oracle SQL Developer.

------------------------------------------------------------------------------------
--MUSICA {ID_MUSICA, NOME, ID_AUTOR, ID_TITULO}
------------------------------------------------------------------------------------

CREATE TABLE musica
(  
  ID_MUSICA  NUMBER(3,0)  NOT NULL
, NOME       VARCHAR(255) NOT NULL
, ID_AUTOR   NUMBER(3,0)  NOT NULL	 
, ID_TITULO  NUMBER(3,0)  NOT NULL
, CONSTRAINT MUSICA_PK PRIMARY KEY ( ID_MUSICA ) 
  ENABLE		 	
);

-- As chaves estrangeiras foram adicionadas a posterior no Oracle SQL Developer.


------------------------------------------------------------------------------------
--REVIEW { ID_REVIEW, ID_TITULO, DTA_REVIEW, CONTEUDO}
------------------------------------------------------------------------------------

CREATE TABLE REVIEW 
(
  ID_REVIEW NUMBER(3, 0) NOT NULL 
, ID_TITULO NUMBER(3, 0) NOT NULL 
, DTA_REVIEW DATE NOT NULL 
, CONTEUDO VARCHAR(255) NOT NULL 
, CONSTRAINT REVIEW_PK PRIMARY KEY ( ID_REVIEW )
  ENABLE 
);


--a) Quantos t�tulos possui a cole��o ?

SELECT COUNT (TITULO) "TOTAL DE T�TULOS" FROM TITULO; 

------------------------------------------------------------------------------------

------------------------------------------------------------------------------------
--b) Quantas m�sicas existem na cole��o ?

SELECT COUNT (ID_MUSICA) "TOTAL DE M�SICAS" FROM MUSICA; 

------------------------------------------------------------------------------------

------------------------------------------------------------------------------------
--c) Quantos autores existem na cole��o ?

SELECT COUNT (ID_AUTOR) "TOTAL DE AUTORES" FROM AUTOR; 

----------------------------------------------------------------------------------------------
--Quantas editoras distintas existem na cole��o ?

SELECT COUNT (DISTINCT NOME) FROM EDITORA; 
----------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------
--e)  O autor "Max Changmin" � o principal autor de quantos t�tulo ?

SELECT A.NOME,count(A.ID_AUTOR) AS "Total de T�tulos" FROM AUTOR A
INNER JOIN TITULO T on T.ID_AUTOR=A.ID_AUTOR
where A.NOME = 'Max Changmin'
group by A.NOME;
    

	
------------------------------------------------------------------------------------


------------------------------------------------------------------------------------

--f) No ano de 1970, quais foram os t�tulos comprados pelo utilizador?

SELECT TITULO,PRECO,DTA_COMPRA AS "DATA DA COMPRA" FROM TITULO 
WHERE EXTRACT (year FROM DTA_COMPRA) = '1970';



------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--g) Qual o autor do t�tulo que foi adquirido em �01-02-2010�, cujo pre�o foi de 12�?

SELECT A.NOME "AUTOR",T.TITULO "T�TULO",T.PRECO "PRE�O",T.DTA_COMPRA "DATA DA COMPRA" FROM TITULO T
INNER JOIN AUTOR A ON A.ID_AUTOR = T.ID_AUTOR
WHERE T.DTA_COMPRA = to_date('01-02-2010','DD-MM-YYYY') AND T.PRECO = 12;
    
        
    
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--h) Na al�nea anterior indique qual a editora desse t�tulo?

SELECT A.NOME "AUTOR",T.TITULO "T�TULO",T.PRECO "PRE�O",E.NOME "EDITORA",T.DTA_COMPRA "DATA DA COMPRA" FROM TITULO T
INNER JOIN AUTOR A ON A.ID_AUTOR = T.ID_AUTOR
INNER JOIN EDITORA E ON E.ID_EDITORA = T.ID_EDITORA 
WHERE T.DTA_COMPRA = to_date('01-02-2010','DD-MM-YYYY') AND T.PRECO = 12;
    
        

------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--i) Quais as reviews (data e classifica��o) existentes para o t�tulo �oh whoa oh� ?

SELECT T.TITULO "T�TULO",R.DTA_REVIEW "DATA DA CLASSIFICA��O",R.CONTEUDO "CLASSIFICA��O" FROM TITULO T
INNER JOIN REVIEW R ON R.ID_TITULO = T.ID_TITULO
WHERE T.TITULO = 'oh whoa oh' ;
        
      

------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--j) Quais as reviews (data e classifica��o) existentes para o t�tulo� pump�, ordenadas por data da mais antiga para a mais recente?

SELECT T.TITULO "T�TULO",R.DTA_REVIEW "DATA DA CLASSIFICA��O",R.CONTEUDO "CLASSIFICA��O" FROM TITULO T
INNER JOIN REVIEW R ON R.ID_TITULO = T.ID_TITULO
WHERE T.TITULO = 'pump' 
ORDER BY R.DTA_REVIEW ASC;
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--k) Quais os diversos autores das m�sicas do t�tulo lan�ado a �04-04-1970� com o pre�o de 20�?

SELECT M.NOME "MUSICA",A.NOME "AUTOR",T.TITULO "T�TULO",T.DTA_COMPRA "DATA",T.PRECO"PRE�O" FROM MUSICA M
INNER JOIN TITULO T ON T.ID_TITULO=M.ID_TITULO
INNER JOIN AUTOR  A ON A.ID_AUTOR=M.ID_AUTOR
WHERE T.DTA_COMPRA = to_date('04-04-1970','DD-MM-YYYY') AND T.PRECO = 20;


------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--l) Qual foi o total de dinheiro investido em compras de t�tulo da editora �EMI�?

SELECT E.NOME "EDITORA",SUM(T.PRECO) "TOTAL INVESTIDO EM COMPRAS DE T�TULO" FROM TITULO T
INNER JOIN EDITORA E ON E.ID_EDITORA=T.ID_EDITORA
WHERE E.NOME='EMI'
GROUP BY E.NOME;
    


------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--m) Qual o t�tulo mais antigo cujo pre�o foi de 20�?

SELECT ID_TITULO "ID",TITULO "T�TULO", DTA_COMPRA "DATA", PRECO "PRE�O" FROM TITULO  
WHERE PRECO = 20
ORDER BY DTA_COMPRA ASC
FETCH NEXT 1 ROWS ONLY;    
     

------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

--n) Quantos �MP3� tem a cole��o?

SELECT COUNT(ID_TITULO)"TOTAL DE MP3s" FROM TITULO T
INNER JOIN SUPORTE S ON S.ID_SUPORTE = T.ID_SUPORTE
WHERE S.NOME='MP3';

------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

--o) Destes mp3 quais s�o o t�tulos cujo g�nero �: Pop Rock?

SELECT TITULO "T�TULO",S.NOME"SUPORTE",G.NOME"G�NERO" FROM TITULO T
INNER JOIN SUPORTE S ON S.ID_SUPORTE=T.ID_SUPORTE
INNER JOIN GENERO  G ON G.ID_GENERO=T.ID_GENERO
WHERE S.NOME='MP3' AND G.NOME='Pop Rock';
    
------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

--p) Qual o custo total com �Blue-Ray�?

SELECT S.Nome "SUPORTE",SUM(T.PRECO) "CUSTO TOTAL" FROM TITULO T
INNER JOIN SUPORTE S ON S.ID_SUPORTE = T.ID_SUPORTE
WHERE S.NOME='Blue-Ray'
GROUP BY S.NOME;
------------------------------------------------------------------------------------


------------------------------------------------------------------------------------

--q) Qual o custo total com �Blue-Ray� cuja editora � a EMI?
  
SELECT E.NOME,S.Nome "SUPORTE",SUM(T.PRECO) "CUSTO TOTAL" FROM TITULO T
INNER JOIN SUPORTE S ON S.ID_SUPORTE = T.ID_SUPORTE
INNER JOIN EDITORA E ON E.ID_EDITORA = T.ID_EDITORA
WHERE S.NOME='Blue-Ray'AND  E.NOME='EMI'
GROUP BY S.NOME,E.NOME;
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--r) Qual o patrim�nio total dos t�tulos da cole��o?

SELECT SUM (PRECO) " PATRIM�NIO TOTAL DOS T�TULOS" FROM TITULO;
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--s)Qual a editora na qual o colecionador investiu mais dinheiro?

SELECT E.NOME "EDITORA", sum(PRECO) "TOTAL INVESTIDO" FROM TITULO T
INNER JOIN EDITORA E ON E.ID_EDITORA=T.ID_EDITORA
GROUP BY E.NOME 
ORDER BY "TOTAL INVESTIDO" DESC;
    
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------

--t) Qual a editora que possui mais t�tulos de �Heavy Metal� na cole��o? Quanto titulo possui essa editora?

SELECT e.nome AS editora, COUNT(*) AS total FROM titulo t 
INNER JOIN genero g ON g.id_genero=t.id_genero 
INNER JOIN editora e ON e.id_editora=t.id_editora 
WHERE g.nome='Heavy Metal' 
GROUP BY e.nome 
ORDER BY total DESC
FETCH FIRST 1 ROWS ONLY;

------------------------------------------------------------------------------------

