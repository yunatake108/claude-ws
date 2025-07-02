import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Completion.css';

const Completion = () => {
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rentalData = localStorage.getItem('currentRental');
    const token = localStorage.getItem('authToken');
    
    if (!rentalData || !token) {
      navigate('/login');
      return;
    }
    
    setRental(JSON.parse(rentalData));
  }, [navigate]);

  const handleCompleteRental = async () => {
    if (!rental) return;
    
    setIsCompleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/rentals/${rental.id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const completedRental = await response.json();
        setRental(completedRental);
        localStorage.removeItem('currentRental');
        
        setTimeout(() => {
          navigate('/rental');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'レンタル完了処理に失敗しました');
      }
    } catch (err) {
      setError('サーバーに接続できません');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNewRental = () => {
    localStorage.removeItem('currentRental');
    navigate('/rental');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentRental');
    navigate('/login');
  };

  if (!rental) {
    return (
      <div className="completion-container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  const isActive = rental.status === 'active';
  const isCompleted = rental.status === 'completed';

  return (
    <div className="completion-container">
      <div className="completion-card">
        <div className="completion-header">
          {isActive && (
            <>
              <div className="success-icon">✓</div>
              <h1>レンタル開始完了</h1>
              <p>自転車のレンタルが正常に開始されました</p>
            </>
          )}
          
          {isCompleted && (
            <>
              <div className="success-icon">🎉</div>
              <h1>レンタル完了</h1>
              <p>ご利用ありがとうございました</p>
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="rental-details">
          <h2>レンタル詳細</h2>
          <div className="detail-item">
            <span className="label">レンタルID:</span>
            <span className="value">{rental.id}</span>
          </div>
          <div className="detail-item">
            <span className="label">自転車:</span>
            <span className="value">{rental.bicycle?.model_name || '不明'}</span>
          </div>
          <div className="detail-item">
            <span className="label">開始時刻:</span>
            <span className="value">
              {new Date(rental.rental_start_time).toLocaleString('ja-JP')}
            </span>
          </div>
          
          {isCompleted && rental.rental_end_time && (
            <>
              <div className="detail-item">
                <span className="label">終了時刻:</span>
                <span className="value">
                  {new Date(rental.rental_end_time).toLocaleString('ja-JP')}
                </span>
              </div>
              {rental.total_cost && (
                <div className="detail-item cost">
                  <span className="label">利用料金:</span>
                  <span className="value">¥{rental.total_cost}</span>
                </div>
              )}
            </>
          )}
          
          <div className="detail-item">
            <span className="label">ステータス:</span>
            <span className={`value status ${rental.status}`}>
              {rental.status === 'active' ? 'レンタル中' : 'レンタル完了'}
            </span>
          </div>
        </div>

        <div className="action-buttons">
          {isActive && (
            <button
              onClick={handleCompleteRental}
              className="complete-button"
              disabled={isCompleting}
            >
              {isCompleting ? 'レンタル完了処理中...' : 'レンタルを完了する'}
            </button>
          )}
          
          {isCompleted && (
            <button
              onClick={handleNewRental}
              className="new-rental-button"
            >
              新しいレンタルを開始
            </button>
          )}
          
          <button
            onClick={handleNewRental}
            className="back-button"
          >
            レンタル画面に戻る
          </button>
          
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            ログアウト
          </button>
        </div>

        {isCompleted && (
          <div className="auto-redirect">
            <p>3秒後に自動的にレンタル画面に戻ります...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Completion;