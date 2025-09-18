import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { CoinDetail } from '../types/crypto';
import ExpandableText from '../components/ExpandableText';
import '../App.css';

// Recharts kütüphanesinden gerekli bileşenleri import ediyoruz
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Grafik verisinin yapısı için bir tip tanımlıyoruz
type ChartDataPoint = {
  date: string;
  price: number;
};

const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]); // <-- GRAFİK İÇİN YENİ STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      try {
        // İki API isteğini aynı anda yapmak için Promise.all kullanıyoruz
        const [detailResponse, chartResponse] = await Promise.all([
          axios.get<CoinDetail>(`https://api.coingecko.com/api/v3/coins/${id}`),
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`)
        ]);

        setCoin(detailResponse.data);

        // Grafik verisini Recharts'ın anlayacağı formata dönüştürüyoruz
        const formattedChartData = chartResponse.data.prices.map((pricePoint: [number, number]) => ({
          date: new Date(pricePoint[0]).toLocaleDateString(),
          price: pricePoint[1],
        }));
        setChartData(formattedChartData);

      } catch (error) {
        console.error("Veri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinData();
    }
  }, [id]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Yükleniyor...</h2>;
  if (!coin) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Coin bulunamadı.</h2>;

  return (
    <div className="coin-detail-container">
      <button onClick={() => navigate(-1)} className="back-button"> &larr; Geri </button>

      <div className="coin-detail-header">
        <img src={coin.image.large} alt={coin.name} />
        <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
        <h2>Sıralama #{coin.market_cap_rank}</h2>
      </div>

      {/* --- GRAFİK BÖLÜMÜ --- */}
      <div className="chart-container">
        <h3>Son 7 Günlük Fiyat Değişimi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" domain={['dataMin', 'dataMax']} tickFormatter={(price) => `$${price.toLocaleString()}`} />
            <Tooltip contentStyle={{ backgroundColor: '#2c2c2e', border: '1px solid #444' }} />
            <Line type="monotone" dataKey="price" stroke="#87CEEB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* --- GRAFİK SONU --- */}

      <div className="coin-stats">
        <div><label>Fiyat</label><span>${coin.market_data.current_price.usd.toLocaleString()}</span></div>
        <div><label>24s Değişim</label><span style={{ color: coin.market_data.price_change_percentage_24h < 0 ? 'red' : 'green' }}>{coin.market_data.price_change_percentage_24h.toFixed(2)}%</span></div>
        <div><label>Piyasa Değeri</label><span>${coin.market_data.market_cap.usd.toLocaleString()}</span></div>
        <div><label>24s Hacim</label><span>${coin.market_data.total_volume.usd.toLocaleString()}</span></div>
      </div>
      
      <div className="coin-description">
        <h3>Açıklama</h3>
        <ExpandableText htmlText={coin.description.en} />
      </div>
    </div>
  );
};

export default CoinDetailPage;