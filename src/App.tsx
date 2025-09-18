import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoinDetailPage from './pages/CoinDetailPage';
import './App.css'; // Global stiller burada kalabilir

function App() {
  return (
    // Routes bileşeni, URL'e göre hangi Route'un render edileceğine karar verir
    <Routes>
      {/* path="/" : Ana sayfaya gidildiğinde HomePage'i göster */}
      <Route path="/" element={<HomePage />} />

      {/* path="/coin/:id" : /coin/ ile başlayan bir yola gidildiğinde CoinDetailPage'i göster */}
      <Route path="/coin/:id" element={<CoinDetailPage />} />
    </Routes>
  );
}

export default App;