<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:result-document href="arqs/index.html">
            <html>
                <head>
                    <title>Arqueossítios do Nordeste Português</title>
                    <meta charset="UTF-8"/>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
                </head>
                <body>
                    <h2>Arqueossítio do Nordeste Português</h2>
                    <h3>Índice</h3>
                    <ul>
                        <xsl:apply-templates select="//ARQELEM[not(CONCEL=preceding::CONCEL)]">
                            <!-- tenho q normalizar os espaços no sort, a parte do valueof -> o html trata disso --> 
                            <xsl:sort select="normalize-space(CONCEL)"/>
                        </xsl:apply-templates>
                    </ul>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates select="//ARQELEM" mode="individual">         
        </xsl:apply-templates>
        <xsl:apply-templates/>
    </xsl:template>
    
    <!-- Templates de Índice-->
    
    <xsl:template match="ARQELEM">
        <!-- para não haver ambiguidade no xsl em baixo do concelho, cria-se uma variável -->
        <xsl:variable name="c" select="CONCEL"/>
        <li>
            <!-- Ordenar dentro do Concelho -->
            <xsl:value-of select="CONCEL"/>
            <ul>
                <xsl:apply-templates mode="subindice" select="//ARQELEM[CONCEL=$c]">
                    <xsl:sort select="IDENTI"/>
                </xsl:apply-templates>
            </ul>
        </li>
    </xsl:template>
    
    <xsl:template match="ARQELEM" mode="subindice">
        <li>
            <a href="arq{count(preceding-sibling::*)+1}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <!-- Templates para conteúdo-->
    
    <xsl:template match="ARQELEM" mode="individual">
        <xsl:result-document href="arqs/arq{count(preceding-sibling::*)+1}.html"> <!-- conteudo vai para ficheiro-->
            <hmtl>
                <head>
                    <meta charset="UTF-8"/>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
                </head>
                <body>
                    <h1 style="text-align:center">Arqueossítios do Nordeste Português</h1>
                    <p><b>Identificação:</b><Large><xsl:value-of select="IDENTI"/></Large><br/></p>
                    <p><b>Descrição:</b><Large><xsl:value-of select="DESCRI"/></Large><br/></p>
                   
                    <table class="w3-table w3-striped">
                        <xsl:choose><xsl:when test="CRONO">
                            <tr>
                                <th><b>Cronologia:</b></th>
                                <td><xsl:value-of select="CRONO"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="CODAM">
                            <tr>
                                <th><b>Código:</b></th>
                                <td><xsl:value-of select="CODAM"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                   
                        
                        <tr>
                            <th>Tipo:</th><td><xsl:value-of select="TIPO/@ASSUNTO"/></td>
                        </tr>
                        
                        <xsl:choose><xsl:when test="LUGAR">
                            <tr>
                                <th><b>Lugar:</b></th>
                                <td><xsl:value-of select="LUGAR"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="FREGUE">
                            <tr>
                                <th><b>Freguesia:</b></th>
                                <td><xsl:value-of select="FREGUE"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="CONCEL">
                            <tr>
                                <th><b>Concelho:</b></th>
                                <td><xsl:value-of select="CONCEL"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="LATITU">
                            <tr>
                                <th><b>Latitude:</b></th>
                                <td><xsl:value-of select="LATITU"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="LONGIT">
                            <tr>
                                <th><b>Longitude:</b></th>
                                <td><xsl:value-of select="LONGIT"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="ALTITU">
                            <tr>
                                <th><b>Altitude:</b></th>
                                <td><xsl:value-of select="ALTITU"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                    </table>
                    <hr/>
                    
                    <table class="w3-table">
                        <xsl:choose><xsl:when test="ACESSO">
                            <tr>
                                <th><b>Acesso:</b></th>
                                <td><xsl:value-of select="ACESSO"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="QUADRO">
                            <tr>
                                <th><b>Quadro:</b></th>
                                <td><xsl:value-of select="QUADRO"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                        <xsl:choose><xsl:when test="AUTOR">
                            <tr>
                                <th><b>Autor:</b></th>
                                <td><xsl:value-of select="AUTOR"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>

                        <xsl:choose><xsl:when test="BIBLIO">
                            <tr>
                                <th><b>Bibliografia:</b></th>
                                <td><xsl:value-of select="BIBLIO"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="DEPOSI">
                            <tr>
                                <th><b>Depósito:</b></th>
                                <td><xsl:value-of select="DEPOSI"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="DESARQ">
                            <tr>
                                <th><b>Desenho Arquitetural:</b></th>
                                <td><xsl:value-of select="DESARQ"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="INTERE">
                            <tr>
                                <th><b>Interesse:</b></th>
                                <td><xsl:value-of select="INTERE"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="INTERP">
                            <tr>
                                <th><b>Interpretação:</b></th>
                                <td><xsl:value-of select="INTERP"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>

                        <xsl:choose><xsl:when test="TRAARQ">
                            <tr>
                                <th><b>Trabalhos no Arquiossítio:</b></th>
                                <td><xsl:value-of select="TRAARQ"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        <xsl:choose><xsl:when test="DATA">
                            <tr>
                                <th><b>Data:</b></th>
                                <td><xsl:value-of select="DATA"/></td>
                            </tr>
                        </xsl:when>
                        </xsl:choose>
                        
                    </table>
                    
                    
                    <hr/>
                    
                    <address>
                        [<a href="index.html">Voltar à home</a>]
                    </address> 
                </body>
            </hmtl>     
        </xsl:result-document> 
    </xsl:template>
    
</xsl:stylesheet>