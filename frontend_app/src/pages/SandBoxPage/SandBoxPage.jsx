import React, { useState } from 'react';
// import { useDispatch } from 'react-redux'; // Якщо Redux буде потрібен, розкоментуй
import ChessSandbox from '../../components/ChessSandbox/ChessSandbox'; // Імпортуємо головний компонент пісочниці
import Button from '../../components/Button/Button';
import styles from './SandBoxPage.module.css';

const SandBoxPage = () => {
  // Стан для showSquareId, який може бути переданий до ChessSandbox
  const [showSquareId, setShowSquareId] = useState(false);

  const handleShowId = () => {
    setShowSquareId(true);
  };

  const handleHideId = () => {
    setShowSquareId(false);
  };

  return (
    <div className={styles.homePageWrapper}>
      <h1>Шахова Пісочниця MVP</h1>

      {/* Рендеримо головний компонент пісочниці.
          Він сам містить палітру вибору фігур та шахівницю.
          Передаємо showSquareId, якщо SandBoxPage має ним керувати. */}
      <ChessSandbox 
        showSquareId={showSquareId} 
        // Якщо ChessSandbox потребує додаткових пропсів від SandBoxPage, додай їх тут
      />

      <div className={styles.buttonGroup}>
        <Button
          onClick={handleShowId}
          id="show-id-button"
          className={styles.primaryButton}
        >
          Показати назву поля
        </Button>
        <Button
          onClick={handleHideId}
          id="hide-id-button"
          className={styles.secondaryButton}
        >
          Приховати назву поля
        </Button>
      </div>
    </div>
  );
};

export default SandBoxPage;