from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from models import Filme
import csv
from database import db
import io
import argparse
from collections import defaultdict
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'  # Usando o SQLite com um arquivo chamado test.db
db = SQLAlchemy(app)

# Configurar o modelo Filme, certificando-se de importá-lo e definir os campos da tabela conforme sua estrutura
class Filme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer)
    title = db.Column(db.String(255))
    studios = db.Column(db.String(255))
    producers = db.Column(db.String(255))
    winner = db.Column(db.String(3))

@app.route('/filmes', methods=['GET'])
def obter_filmes():
    filmes = Filme.query.all()
    filmes_list = [
        {
            "year": filme.year,
            "title": filme.title,
            "studios": filme.studios,
            "producers": filme.producers,
            "winner": filme.winner
        }
        for filme in filmes
    ]
    return jsonify(filmes_list)

@app.route('/produtor/menor-intervalo', methods=['GET'])
def produtor_menor_intervalo():
    produtores = defaultdict(list)

    filmes = Filme.query.order_by(Filme.producers).all()
    for filme in filmes:
        produtores[filme.producers].append(filme.year)

    menor_intervalo = None
    produtor_menor_intervalo = None
    anos_menor_intervalo = None

    for produtor, anos in produtores.items():
        anos_ordenados = sorted(anos)
        intervalos = calcular_intervalo_consecutivo(anos_ordenados)

        if len(intervalos) > 1:
            min_intervalo = min(intervalos)

            if menor_intervalo is None or min_intervalo < menor_intervalo:
                menor_intervalo = min_intervalo
                produtor_menor_intervalo = produtor
                # Obter os anos referentes ao menor intervalo
                anos_menor_intervalo = [anos_ordenados[i:i+2] for i in range(len(anos_ordenados) - 1) if anos_ordenados[i+1] - anos_ordenados[i] == min_intervalo]

    if produtor_menor_intervalo is not None and anos_menor_intervalo:
        # Se houver anos no intervalo, retorne ambos separadamente
        ano_inicial, ano_final = anos_menor_intervalo[0]
        return jsonify({
            "produtor_menor_intervalo": produtor_menor_intervalo,
            "menor_intervalo": menor_intervalo,
            "ano_inicial": ano_inicial,
            "ano_final": ano_final
        })
    else:
        return jsonify({"message": "Nenhum produtor com mais de um prêmio consecutivo encontrado."})


@app.route('/produtor/maior-intervalo', methods=['GET'])
def produtor_maior_intervalo():
    produtores = defaultdict(list)

    filmes = Filme.query.order_by(Filme.producers).all()
    for filme in filmes:
        produtores[filme.producers].append(filme.year)

    maior_intervalo = None
    produtor_maior_intervalo = None
    ano_inicial_maior_intervalo = None
    ano_final_maior_intervalo = None

    for produtor, anos in produtores.items():
        anos_ordenados = sorted(anos)
        intervalos = calcular_intervalo_consecutivo(anos_ordenados)

        if len(intervalos) > 1:
            max_intervalo = max(intervalos)

            if maior_intervalo is None or max_intervalo > maior_intervalo:
                maior_intervalo = max_intervalo
                produtor_maior_intervalo = produtor
                # Encontre os anos correspondentes ao maior intervalo
                index_max_intervalo = intervalos.index(max_intervalo)
                ano_inicial_maior_intervalo = anos_ordenados[index_max_intervalo]
                ano_final_maior_intervalo = anos_ordenados[index_max_intervalo + 1]

    if produtor_maior_intervalo is not None:
        return jsonify({
            "produtor_maior_intervalo": produtor_maior_intervalo,
            "maior_intervalo": maior_intervalo,
            "ano_inicial_maior_intervalo": ano_inicial_maior_intervalo,
            "ano_final_maior_intervalo": ano_final_maior_intervalo
        })
    else:
        return jsonify({"message": "Nenhum produtor com mais de um prêmio consecutivo encontrado."})

@app.route('/vencedores', methods=['GET'])
def vencedores():
    year = request.args.get('year')
    
    # Consulta os vencedores no banco de dados com base no ano selecionado
    winners_for_year = Filme.query.filter_by(year=year, winner='yes').all()

    # Converte os resultados em um formato que pode ser serializado para JSON
    winners_data = []
    for winner in winners_for_year:
        winners_data.append({
            'id': winner.id,
            'year': winner.year,
            'title': winner.title,
            'studios': winner.studios,
            'producers': winner.producers,
            'winner': winner.winner
        })

    return jsonify(winners_data)


def calcular_intervalo_consecutivo(prizes):
    intervalos = []
    for i in range(1, len(prizes)):
        intervalo = prizes[i] - prizes[i - 1]
        intervalos.append(intervalo)
    return intervalos

# Configurar a função para carregar o CSV com base no argumento do nome do arquivo
def carregar_csv(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        Filme.query.delete()
        reader = csv.reader(file, delimiter=';')
        next(reader)  # Pular cabeçalho
        for row in reader:
            year, title, studios, producers, winner = row
            #print(f'Filme: {title}, Ano: {year}, Estudio: {studios}, Produtor: {producers}, Vencedor: {winner}')
            if winner == '':
                winner = 'no'
            filme = Filme(year=year, title=title, studios=studios, producers=producers, winner=winner)
            db.session.add(filme)
        db.session.commit()

def create_tables():
    db.create_all()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Carregar dados a partir de um arquivo CSV')
    parser.add_argument('filename', type=str, help='Nome do arquivo CSV para carregar')
    args = parser.parse_args()


    with app.app_context():
        create_tables()
        carregar_csv(args.filename)  # Carrega o arquivo CSV especificado
        app.run(host='127.0.0.1', port='5000')
