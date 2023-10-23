import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import FilmList from './FilmList';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' ou 'filmList'

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="App">
      <div className="text-center"> {/* Adicione a classe text-center aqui */}
        <button onClick={() => switchView('dashboard')}>Dashboard</button>
        <button onClick={() => switchView('filmList')}>Lista de Filmes</button>
      </div>
      {view === 'dashboard' ? <Dashboard /> : <FilmList />}
    </div>
  );
}

export default App;
