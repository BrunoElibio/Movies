# Filmes

API em Flask realizada para carregamento de uma lista de filmes via arquivo CSV com o formato "year;title;studios;producers;winner"

## Getting Started

### Technologies

* Flask
* Request
* React
* Sqlite/Sqlalchemy
* Apache 2.4.43
* Axios

### Executing program

* A pasta principal "Movies" contém os arquivos de backend, onde pode ser executada com o comando, sendo 'movielist.csv' o nome do arquivo que contém as informações dos filmes.

```
python .\app.py .\movielist.csv

```

* Após iniciar a API, ela pode ser acessada através do endereço ** http://127.0.0.1:5000 **


* Na pasta movies dashboard se encontra o frontend em React, para que seja possível rodar é necessário fazer a instalação dos pacotes;
  
```
npm install
```

* Após instalação é possível rodar via; Isso ira carregar automaticamente a tela de DashBoard e Lista de Filmes
  
```
npm start
```

* Rota adicionada para buscar a lista de produtores e toda a lista de vitórias

```
http://127.0.0.1:5000/produtor/todos-intervalos

```


## Author

Bruno Correa Elibio
https://www.linkedin.com/in/brunoelibio/
