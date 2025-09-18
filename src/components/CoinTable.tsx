import type { Coin } from '../types/crypto';
import CoinRow from './CoinRow';

type CoinTableProps = {
  coins: Coin[];
  page: number;
};

const CoinTable = ({ coins, page }: CoinTableProps) => {
  return (
    <table className="coin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>24h Change</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin, index) => (
          <CoinRow 
            key={coin.id} 
            coin={coin} 
            index={(page - 1) * 25 + index + 1} 
          />
        ))}
      </tbody>
    </table>
  );
};

export default CoinTable;