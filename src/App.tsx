import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Coin } from './types/crypto';
import './App.css';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=false`;

    const fetchCoins = async () => {
      // Sadece sayfa ilk yüklendiğinde veya sayfa değiştiğinde loading'i tetikleme, interval için değil.
      if (!coins.length || page !== 1) setLoading(true);

      try {
        const response = await axios.get<Coin[]>(API_URL);
        setCoins(response.data);
      } catch (error) {
        console.error("Veri çekerken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();

    const intervalId = setInterval(fetchCoins, 30000);

    return () => clearInterval(intervalId);
  }, [page]);


  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h2>Yükleniyor...</h2>;
  }

  return (
    <div className="app-container">
      <h1>Kripto Fiyat Takip Uygulaması</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Kripto para ara..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="coin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Fiyat</th>
            <th>24s Değişim</th>
            <th>Piyasa Değeri</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin, index) => (
            <tr key={coin.id}>
              <td>{(page - 1) * 25 + index + 1}</td>
              <td className="coin-info">
                <img src={coin.image} alt={coin.name} width="25" />
                <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_24h < 0 ? 'red' : 'green' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Önceki Sayfa
        </button>
        <span>Sayfa {page}</span>
        <button onClick={() => setPage(page + 1)}>
          Sonraki Sayfa
        </button>
      </div>
    </div>
  );
}

export default App;