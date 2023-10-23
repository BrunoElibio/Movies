import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Novos estados para os painéis
  const [yearsMultipleWinners, setYearsMultipleWinners] = useState([]);
  const [topStudios, setTopStudios] = useState([]);
  const [producerWithMaxInterval, setProducerWithMaxInterval] = useState({
    produtor_maior_intervalo: '',
    maior_intervalo: 0,
    ano_inicial_maior_intervalo: 0,
    ano_final_maior_intervalo: 0,
  });

  const [producerWithMinInterval, setProducerWithMinInterval] = useState({
    produtor_menor_intervalo: '',
    menor_intervalo: 0,
    ano_inicial: 0,
    ano_final: 0,
  });

  const [selectedYear, setSelectedYear] = useState('');
  const [winnersForYear, setWinnersForYear] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/filmes');
        setMovies(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchMovies();
  }, []);

  useEffect(()=>{
    async function fetchMinInterval(){
      try {
        const response = await axios.get('http://127.0.0.1:5000/produtor/menor-intervalo');
        setProducerWithMinInterval(response.data);
        setIsLoading(false);
        }catch (error) {
          console.error('Erro ao buscar dadps:', error);
        }
      }
      fetchMinInterval();
    }, []);

    useEffect(()=>{
      async function fetchMaxInterval(){
        try {
          const response = await axios.get('http://127.0.0.1:5000/produtor/maior-intervalo');
          setProducerWithMaxInterval(response.data);
          setIsLoading(false);
          }catch (error) {
            console.error('Erro ao buscar dadps:', error);
          }
        }
        fetchMaxInterval();
      }, []);

  useEffect(() => {
    // Lógica para calcular os dados dos painéis a partir da lista de filmes
    if (!isLoading) {
      // Calcular anos com múltiplos vencedores
      const yearsWithMultipleWinners = movies.reduce((years, movie) => {
        if (movie.winner === 'yes') {
          years[movie.year] = (years[movie.year] || 0) + 1;
        }
        return years;
      }, {});

      // Ordenar os estúdios por número de vitórias
      const studioWins = movies.reduce((studioWins, movie) => {
        if (movie.winner) {
          movie.studios.split(',').forEach((studio) => {
            studioWins[studio] = (studioWins[studio] || 0) + 1;
          });
        }
        return studioWins;
      }, {});

      const sortedStudios = Object.entries(studioWins)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      // Lógica para calcular produtores com maior e menor intervalo

      // Atualizar os estados dos painéis
      setYearsMultipleWinners(
        Object.keys(yearsWithMultipleWinners).filter(
          (year) => yearsWithMultipleWinners[year] > 1
        )
      );
      setTopStudios(sortedStudios);
    }
  }, [movies, isLoading]);

  const handleSearch = async () => {
    if (selectedYear.trim() === '') {
      alert('Por favor, insira um ano válido.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/vencedores?year=${selectedYear}`);
      const data = await response.json();
      setWinnersForYear(data);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
      {/* Painel de Anos com Mais de um Vencedor */}
      <div>
        <h2>Anos com Múltiplos Vencedores</h2>
        <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            <table>
            <thead>
                <tr>
                <th>Ano</th>
                </tr>
            </thead>
            <tbody>
                {yearsMultipleWinners.map((year) => (
                <tr key={year}>
                    <td>{year}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>


      {/* Painel de Três Estúdios com Mais Vitórias */}
      <div>
        <h2>Três Estúdios com Mais Vitórias</h2>
        <table>
          <thead>
            <tr>
              <th>Estúdio</th>
              <th>Vitórias</th>
            </tr>
          </thead>
          <tbody>
            {topStudios.map(([studio, wins]) => (
              <tr key={studio}>
                <td>{studio}</td>
                <td>{wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Painel de Produtores com Maior e Menor Intervalo entre Vitórias */}
      <div>
        <h2>Produtores com Maior e Menor Intervalo entre Vitórias</h2>
        <table>
        <thead>
            <tr>
              <th>Produtor</th>
              <th>Intervalo</th>
              <th>Ano anterior</th>
              <th>Ano seguinte</th>
            </tr>
          </thead>
          <tbody>
          {producerWithMinInterval && (
            <tr>
              <td>{producerWithMinInterval.produtor_menor_intervalo}</td>
              <td>{producerWithMinInterval.menor_intervalo}</td>
              <td>{producerWithMinInterval.ano_inicial}</td>
              <td>{producerWithMinInterval.ano_final}</td>
            </tr>
          )}
          </tbody>
        </table>
        <table>
        <thead>
            <tr>
              <th>Produtor</th>
              <th>Intervalo</th>
              <th>Ano anterior</th>
              <th>Ano seguinte</th>
            </tr>
          </thead>
          <tbody>
          {producerWithMaxInterval && (
            <tr>
              <td>{producerWithMaxInterval.produtor_maior_intervalo}</td>
              <td>{producerWithMaxInterval.maior_intervalo}</td>
              <td>{producerWithMaxInterval.ano_inicial_maior_intervalo}</td>
              <td>{producerWithMaxInterval.ano_final_maior_intervalo}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Painel para Buscar Vencedores por Ano */}
      <div>
        <h2>Buscar Vencedores por Ano</h2>
        <div style={{ display: 'flex'}}>
          <input
            placeholder='Ano'
            style={{
              width: '125px',
              height: '50px',
            }}
            maxLength='4'
            type="text"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
          <button             style={{
              width: '125px',
              height: '50px',
            }} onClick={handleSearch}>Buscar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Produtor</th>
              <th>Estúdio</th>
            </tr>
          </thead>
          <tbody>
            {winnersForYear.map((winner, index) => (
              <tr key={index}>
                <td>{winner.title}</td>
                <td>{winner.producers}</td>
                <td>{winner.studios}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
