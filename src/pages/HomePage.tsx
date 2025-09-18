import { useState, useEffect } from 'react';
import axios from 'axios';

// Tiplerimizi ve bileşenlerimizi doğru yollardan import ediyoruz
import type { Coin } from '../types/crypto';
import CoinTable from '../components/CoinTable';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';

// CSS dosyasını da bir üst dizinden import ediyoruz
import '../App.css';

function HomePage() {
  // --- STATE YÖNETİMİ ---
  // Bu sayfa için gerekli tüm state'ler burada tutulur
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // --- VERİ ÇEKME MANTIĞI (EFFECTS) ---
  // Bu useEffect, sadece `page` state'i değiştiğinde yeniden çalışır
  useEffect(() => {
    const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=false`;

    const fetchCoins = async () => {
      setLoading(true); // Her yeni sayfa isteğinde yükleniyor durumuna geç
      try {
        const response = await axios.get<Coin[]>(API_URL);
        setCoins(response.data);
      } catch (error) {
        console.error("Veri çekerken bir hata oluştu:", error);
      } finally {
        setLoading(false); // İstek bitince yükleniyor durumunu kapat
      }
    };
    
    fetchCoins();
  }, [page]); // Bağımlılık dizisi: `page` değiştiğinde bu kod bloğu yeniden tetiklenir

  // --- FİLTRELEME MANTIĞI ---
  // Arama state'ine göre coin listesini filtreler
  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // --- RENDER (GÖRÜNÜM) ---
  // Yüklenme durumunda basit bir mesaj gösterilir
  if (loading) {
    return (
        <div className="app-container">
            <h1>Kripto Fiyat Takip Uygulaması</h1>
            {/* Yüklenirken bile arama çubuğu görünebilir, bu daha iyi bir UX sağlar */}
            <SearchInput onSearch={setSearch} />
            <h2>Yükleniyor...</h2>
        </div>
    );
  }

  // Veri yüklendiğinde, bileşenler ekrana çizilir
  return (
    <div className="app-container">
      <h1>Kripto Fiyat Takip Uygulaması</h1>

      {/* Arama bileşenine state'i güncelleyecek fonksiyonu prop olarak geçiyoruz */}
      <SearchInput onSearch={setSearch} />

      {/* Tablo bileşenine filtrelenmiş coin listesini ve sayfa numarasını prop olarak geçiyoruz */}
      <CoinTable coins={filteredCoins} page={page} />

      {/* Sayfalama bileşenine mevcut sayfayı ve sayfayı değiştirecek fonksiyonu prop olarak geçiyoruz */}
      <Pagination currentPage={page} onPageChange={setPage} />

    </div>
  );
}

export default HomePage;