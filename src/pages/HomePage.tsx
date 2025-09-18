import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Coin } from '../types/crypto';
import CoinTable from '../components/CoinTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import '../App.css';

function HomePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCoins = async () => {
      setLoading(true);
      const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=false`;
      
      try {
        const response = await axios.get<Coin[]>(API_URL, { signal: controller.signal });
        setCoins(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error("Veri çekerken bir hata oluştu:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoins();

    // 3. useEffect'in cleanup fonksiyonu. Komponent unmount olduğunda çalışır.
    return () => {
      // Devam eden isteği iptal et.
      controller.abort();
    };
  }, [page]);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Crypto Price Tracker</h1>
        <SearchInput onSearch={setSearch} />
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <CoinTable coins={filteredCoins} page={page} />
            <Pagination currentPage={page} onPageChange={setPage} />
          </>
        )}
      </div>
      <Sidebar />
    </div>
  );
}

export default HomePage;