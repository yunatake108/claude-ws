import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rental.css';

const Rental = () => {
  const [bicycles, setBicycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchAvailableBicycles();
  }, [navigate]);

  const fetchAvailableBicycles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/bicycles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBicycles(data.filter(bike => bike.status === 'available'));
      } else {
        setError('自転車情報の取得に失敗しました');
      }
    } catch (err) {
      setError('サーバーに接続できません');
    } finally {
      setLoading(false);
    }
  };

  const handleRental = async (bicycleId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/rentals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bicycle_id: bicycleId }),
      });

      if (response.ok) {
        const rental = await response.json();
        localStorage.setItem('currentRental', JSON.stringify(rental));
        navigate('/completion');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'レンタルに失敗しました');
      }
    } catch (err) {
      setError('サーバーに接続できません');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentRental');
    navigate('/login');
  };

  if (loading && bicycles.length === 0) {
    return (
      <div className="rental-container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="rental-container">
      <div className="rental-header">
        <h1>レンタル自転車選択</h1>
        {user && (
          <div className="user-info">
            <span>こんにちは、{user.username}さん</span>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="rental-content">
        <h2>レンタルしますか？</h2>
        
        {bicycles.length === 0 ? (
          <div className="no-bicycles">
            <p>現在利用可能な自転車がありません</p>
            <button onClick={fetchAvailableBicycles} className="refresh-button">
              更新
            </button>
          </div>
        ) : (
          <div className="bicycle-list">
            <p>利用可能な自転車: {bicycles.length}台</p>
            {bicycles.map((bicycle) => (
              <div key={bicycle.id} className="bicycle-card">
                <div className="bicycle-info">
                  <h3>{bicycle.model_name}</h3>
                  <p>場所: {bicycle.location}</p>
                  <p>状態: 利用可能</p>
                </div>
                <div className="bicycle-actions">
                  <button
                    onClick={() => handleRental(bicycle.id)}
                    className="rental-yes-button"
                    disabled={loading}
                  >
                    この自転車をレンタル
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="action-buttons">
          <button
            onClick={() => navigate('/login')}
            className="rental-no-button"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rental;