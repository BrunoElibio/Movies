#!/bin/bash

# Instala as dependências do Node.js com npm
npm install

# Executa o arquivo Python (substitua pelo caminho real para o seu arquivo app.py)
python app.py movielist.csv

# Inicia o servidor de desenvolvimento para o aplicativo React
npm start
