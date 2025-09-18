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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API isteklerini iptal edebilmek için bir AbortController oluşturuyoruz
    const controller = new AbortController();

    const fetchCoinData = async () => {
      setLoading(true);
      try {
        // İki API isteğini aynı anda ve paralel olarak yapmak için Promise.all kullanıyoruz
        const [detailResponse, chartResponse] = await Promise.all([
          axios.get<CoinDetail>(`https://api.coingecko.com/api/v3/coins/${id}`, { signal: controller.signal }),
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`, { signal: controller.signal })
        ]);

        // Gelen verileri state'lere kaydediyoruz
        setCoin(detailResponse.data);

        // Grafik verisini Recharts'ın anlayacağı formata dönüştürüyoruz
        const formattedChartData = chartResponse.data.prices.map((pricePoint: [number, number]) => ({
          date: new Date(pricePoint[0]).toLocaleDateString(), // Tarihi okunabilir hale getir
          price: pricePoint[1], // Fiyat
        }));
        setChartData(formattedChartData);

      } catch (error) {
        // Eğer hata, isteğin iptal edilmesinden kaynaklanıyorsa, bunu normal kabul et
        if (axios.isCancel(error)) {
          console.log('Detail page request canceled:', error.message);
        } else {
          console.error("Data could not be fetched:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoinData();
    }

    // Bu useEffect'in "temizlik" fonksiyonu.
    // Komponent ekrandan kaldırıldığında (unmount) veya `id` değiştiğinde çalışır.
    return () => {
      controller.abort(); // Devam eden API isteklerini iptal et
    };
  }, [id]); // Bu effect, URL'deki `id` değiştiğinde yeniden çalışır

  if (loading) return <h2>Loading...</h2>;
  if (!coin) return <h2>Coin not found.</h2>;

  return (
    <div className="coin-detail-container">
      <button onClick={() => navigate(-1)} className="back-button"> &larr; Back </button>

      <div className="coin-detail-header">
        <img src={coin.image.large} alt={coin.name} />
        <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
        <h2>Rank #{coin.market_cap_rank}</h2>
      </div>

      <div className="chart-container">
        <h3>Last 7 Days Price Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={getComputedStyle(document.documentElement).getPropertyValue('--border')} />
            <XAxis dataKey="date" stroke={getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')} />
            <YAxis stroke={getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')} domain={['dataMin', 'dataMax']} tickFormatter={(price) => `$${Math.round(price).toLocaleString()}`} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }} />
            <Line type="monotone" dataKey="price" stroke={getComputedStyle(document.documentElement).getPropertyValue('--accent')} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="coin-stats">
        <div><label>Price</label><span>${coin.market_data.current_price.usd.toLocaleString()}</span></div>
        <div>
            <label>24h Change</label>
            <span style={{ color: coin.market_data.price_change_percentage_24h < 0 ? 'var(--red)' : 'var(--green)' }}>
                {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
        </div>
        <div><label>Market Cap</label><span>${coin.market_data.market_cap.usd.toLocaleString()}</span></div>
        <div><label>24h Volume</label><span>${coin.market_data.total_volume.usd.toLocaleString()}</span></div>
      </div>
      
      <div className="coin-description">
        <h3>Description</h3>
        <ExpandableText htmlText={coin.description.en} />
      </div>
    </div>
  );
};

export default CoinDetailPage;