import React, { useState } from 'react';
import { useEffect } from 'react';

function FilmList() {

    const [films, setFilms] = useState([]);
    const rowsPage = 10;

    useEffect(() => {
        fetch('http://127.0.0.1:5000/filmes')
          .then((response) => response.json())
          .then((data) => setFilms(data))
          .catch((error) => console.error('Erro na solicitação GET:', error));
      }, []);

  const [filterYear, setFilterYear] = useState('');
  const [filterWinner, setFilterWinner] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPage);

  const handleOptionChange = (value) => {
    if (filterWinner === value) {
      setFilterWinner(null);
    } else {
      setFilterWinner(value);
    }
  };

  const filteredfilms = films.filter((movie) => {
    const yearMatch = !filterYear || movie.year.toString() === filterYear;
    const winnerMatch =
      !filterWinner || movie.winner.toString() === filterWinner;

    return yearMatch && winnerMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Produtores</th>
            <th>Ano
            <div>
        <label htmlFor="yearFilter">Filtrar por Ano: </label>
        <input
          type="text"
          id="yearFilter"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
      </div>
            </th>
            <th>Estúdios</th>
            <th>Vencedor
          <div>
            <button
              id="winnerFilterSim"
              name="winnerFilter"
              value="yes"
              onClick={(e) => handleOptionChange(e.target.value)}
            >Sim</button>
            <button
              id="winnerFilterNao"
              name="winnerFilter"
              value="no"
              onClick={(e) => handleOptionChange(e.target.value)}
            >Não</button>
          </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredfilms.slice(startIndex,endIndex).map((movie, index) => (
            <tr key={index}>
              <td>{movie.title}</td>
              <td>{movie.producers}</td>
              <td>{movie.year}</td>
              <td>{movie.studios}</td>
              <td>{movie.winner==='yes' ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <button onClick={()=>{setEndIndex(index=>index>rowsPage ? index-rowsPage : rowsPage)
                                        setStartIndex(index=>index>=rowsPage ? index-rowsPage : 0)}}>Previous</button>
      <button onClick={()=>{setEndIndex(index=>index+rowsPage)
                                        setStartIndex(index=>index+rowsPage)}}>Next</button>
      </div>
    </div>
  );
}

export default FilmList;
