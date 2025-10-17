import React, { useState, useCallback } from 'react';
import ChessBoardView from '../ChessBoardView/ChessBoardView';
import ChessPiecePalette from '../ChessPiecePalette/ChessPiecePalette'; // Імпортуємо новий компонент палітри
// import { initialBoardPiecesObject } from '../../redux/positions'; // Якщо потрібна початкова позиція для дошки

const ChessSandbox = () => {
    // Стан для обраної фігури з палітри
    const [selectedPieceFromPalette, setSelectedPieceFromPalette] = useState(null);
    // Стан дошки для пісочниці (порожня початково, або завантажена з initialBoardPiecesObject)
    const [boardPiecesObject, setBoardPiecesObject] = useState({});

    // Функція, що викликається при виборі фігури з палітри
    const handlePieceSelectedFromPalette = useCallback((pieceType) => {
        // Якщо клікнули на ту саму фігуру, зняти виділення (для скасування вибору)
        if (selectedPieceFromPalette === pieceType) {
            setSelectedPieceFromPalette(null);
            console.log(`Вибір фігури скасовано: ${pieceType}`);
        } else {
            setSelectedPieceFromPalette(pieceType);
            console.log(`Вибрано фігуру: ${pieceType}`);
        }
    }, [selectedPieceFromPalette]);

    // Функція, що викликається при кліку на клітинку шахівниці в пісочниці
    const handleSandboxSquareClick = useCallback((squareId) => {
        // Якщо обрано фігуру з палітри
        if (selectedPieceFromPalette) {
            // Розміщуємо обрану фігуру на клітинці
            const newBoard = { ...boardPiecesObject, [squareId]: selectedPieceFromPalette };
            setBoardPiecesObject(newBoard);
            console.log(`Розміщено ${selectedPieceFromPalette} на ${squareId}`);
            setSelectedPieceFromPalette(null); // Скидаємо вибір після розміщення
        } else {
            // Якщо нічого не вибрано з палітри, але клікнули на клітинку дошки
            // Можемо видалити фігуру з клітинки, якщо вона там є
            const newBoard = { ...boardPiecesObject };
            if (newBoard[squareId]) {
                delete newBoard[squareId];
                setBoardPiecesObject(newBoard);
                console.log(`Видалено фігуру з ${squareId}`);
            } else {
                console.log(`Клік на ${squareId}: нічого не вибрано з палітри і клітинка порожня.`);
            }
        }
    }, [selectedPieceFromPalette, boardPiecesObject]);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <h1>Шахова Пісочниця</h1>

            {/* Палітра вибору фігур */}
            <ChessPiecePalette 
                onPieceSelected={handlePieceSelectedFromPalette}
                selectedPieceInPalette={selectedPieceFromPalette}
            />

            {/* Інформація про поточний вибір */}
            {selectedPieceFromPalette && (
                <p style={{ fontWeight: 'bold', color: '#007bff' }}>
                    Вибрано: {selectedPieceFromPalette}. Клікніть на клітинку дошки, щоб розмістити.
                </p>
            )}
            {!selectedPieceFromPalette && (
                <p style={{ color: '#555' }}>
                    Виберіть фігуру з меню або клікніть на фігуру на дошці для видалення.
                </p>
            )}

            {/* Основна шахівниця пісочниці */}
            <ChessBoardView
                boardPiecesObject={boardPiecesObject} // Передаємо поточний стан дошки
                onSquareClick={handleSandboxSquareClick} // Передаємо обробник кліку
                showSquareId={true} // Можна показувати ID для налагодження
            />
        </div>
    );
};

export default ChessSandbox;