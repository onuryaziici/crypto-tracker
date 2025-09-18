import type { Coin } from '../types/crypto';
import { useNavigate } from 'react-router-dom';

type CoinRowProps = {
  coin: Coin;
  index: number;
};

const CoinRow = ({ coin, index }: CoinRowProps) => {
  // useNavigate hook'u, programatik olarak yönlendirme yapmamızı sağlar
  const navigate = useNavigate();
  
  // Fiyat değişimine göre renk belirleme (kırmızı veya yeşil)
  const priceChangeColor = coin.price_change_percentage_24h < 0 ? 'red' : 'green';

  // Satıra tıklandığında çalışacak fonksiyon
  const handleRowClick = () => {
    // navigate fonksiyonunu kullanarak dinamik bir URL'e yönlendiriyoruz
    // Örneğin, coin.id 'bitcoin' ise, '/coin/bitcoin' adresine gidilir.
    navigate(`/coin/${coin.id}`);
  };

  return (
    // Satır elementine (tr) bir onClick olayı ve fare imlecini işaretçi yapmak için stil ekliyoruz
    <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
      <td>{index}</td>
      <td className="coin-info">
        <img src={coin.image} alt={coin.name} width="25" />
        <span>
          {coin.name} ({coin.symbol.toUpperCase()})
        </span>
      </td>
      <td>${coin.current_price.toLocaleString()}</td>
      <td style={{ color: priceChangeColor }}>
        {coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>${coin.market_cap.toLocaleString()}</td>
    </tr>
  );
};

export default CoinRow;