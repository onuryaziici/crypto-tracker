import { useState, useEffect } from 'react';
import axios from 'axios';
import type { TrendingCoin } from '../types/crypto';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrending = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending', { signal: controller.signal });
        setTrending(response.data.coins);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Trending request canceled', error.message);
        } else {
          console.error("Trending coins could not be fetched:", error);
        }
      }
    };

    fetchTrending();

    return () => {
      controller.abort();
    };
  }, []); // Boş bağımlılık dizisi, sadece ilk render'da çalışır

  return (
    <aside className="sidebar">
      <div className="sidebar-module">
        <h3>Trending Coins</h3>
        <ul>
          {trending.map(coin => (
            <li key={coin.item.id} onClick={() => navigate(`/coin/${coin.item.id}`)}>
              <img src={coin.item.thumb} alt={coin.item.name} />
              <div className="trending-info">
                <span>{coin.item.name} ({coin.item.symbol.toUpperCase()})</span>
                <small>Rank: #{coin.item.market_cap_rank}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-module">
        <h3>Global Stats</h3>
        <p style={{textAlign: "center", color: "var(--secondary-text)"}}>Coming Soon...</p>
      </div>
    </aside>
  );
};

export default Sidebar;