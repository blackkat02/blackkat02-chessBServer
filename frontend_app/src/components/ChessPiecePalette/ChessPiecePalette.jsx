import React from 'react';
import Square from '../Square/Square'; // Твій існуючий компонент Square
import styles from './ChessPiecePalette.module.css'; // CSS модуль для стилів палітри

// Масив фігур для відображення в меню.
// ID клітинки (key для React, а також id пропс для Square) буде збігатися з назвою фігури.
// Важливо: кожна назва фігури тут має бути УНІКАЛЬНОЮ, якщо ти використовуєш її як ID.
// У шахах це зазвичай так (wp, bp, wr, br, etc. - кожна унікальна).
const menuPieces = [
    'wp', 'wr', 'wn', 'wb', 'wq', // Білі фігури
    'wk', 'bp', 'br', 'bn', 'bb', // Чорні фігури + білий король
    // Якщо ти хочеш мати кілька пішаків, наприклад, 'wp1', 'wp2' - тоді потрібні будуть унікальні ID.
    // Але для палітри вибору зазвичай достатньо одного екземпляра кожного типу фігури.
];

const ChessPiecePalette = ({ onPieceSelected, selectedPieceInPalette }) => {
    const paletteSquares = [];
    const numRows = 2; // Кількість рядків у сітці меню
    const numCols = 5; // Кількість колонок у сітці меню

    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const index = r * numCols + c; // Обчислюємо індекс елемента в масиві menuPieces

            // Отримуємо тип фігури за індексом. Якщо індекс виходить за межі масиву, pieceType буде null.
            const pieceType = menuPieces[index] || null; 
            
            // Якщо pieceType існує, використовуємо його як ID клітинки.
            // Якщо pieceType = null (порожня клітинка), потрібно дати їй унікальний ID,
            // щоб React не скаржився на дублювання ключів.
            const squareId = pieceType || `empty-${index}`; 

            const isLight = (r + c) % 2 === 0; // Для чергування кольорів (візуально як шахівниця)
            
            // isSelected тепер порівнюється з типом фігури, яка зараз вибрана з палітри
            const isSelected = selectedPieceInPalette === pieceType;

            paletteSquares.push(
                <Square
                    key={squareId}    // Ключ React. Унікальний для кожної клітинки.
                    id={squareId}     // ID, що передається в Square. Може бути назвою фігури або "empty-X".
                    isLight={isLight}
                    pieceType={pieceType} // Тип фігури (наприклад, 'wp', 'br') для відображення
                    isSelected={isSelected}
                    // При кліку передаємо саме ТИП фігури.
                    // Якщо клікнули на порожню клітинку в меню (pieceType = null), то передаємо null.
                    onClick={() => onPieceSelected(pieceType)}
                    showSquareId={false} // Зазвичай ID клітинок у меню не показують
                />
            );
        }
    }

    return (
        <div className={styles.paletteContainer}>
            <h3>Виберіть фігуру</h3>
            <div className={styles.paletteGrid}>
                {paletteSquares}
            </div>
        </div>
    );
};

export default React.memo(ChessPiecePalette);