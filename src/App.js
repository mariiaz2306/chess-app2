import React, { useState } from "react";
import './App.css';

const ChessSquare = ({ color, piece, onClick }) => (
  <div className={`chess-square ${color}`} onClick={() => onClick(piece)}>
    {piece && <span className={`chess-piece ${piece.color}`}>{piece.symbol}</span>}
  </div>
);

const Chessboard = () => {
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const isMoveWithinBoard = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;

  const validateMove = (source, target) => {
    const piece = board[source.row][source.col];
    const targetPiece = board[target.row][target.col];

    if (!isMoveWithinBoard(target.row, target.col)) {
      return false;
    }

    if (targetPiece && piece.toUpperCase() === targetPiece.toUpperCase()) {
      return false;
    }

    if (piece.toLowerCase() === 'p') {
      const forwardDirection = piece === 'p' ? 1 : -1;

      if (source.col === target.col && target.row === source.row + forwardDirection && !targetPiece) {
        return true;
      }

      if (Math.abs(target.col - source.col) === 1 && target.row === source.row + forwardDirection && targetPiece && piece !== targetPiece) {
        return true;
      }
    }

    if (piece.toLowerCase() === 'n') {
      const rowDiff = Math.abs(target.row - source.row);
      const colDiff = Math.abs(target.col - source.col);

      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    if (piece.toLowerCase() === 'b') {
      return Math.abs(target.row - source.row) === Math.abs(target.col - source.col);
    }

    if (piece.toLowerCase() === 'r') {
      return source.row === target.row || source.col === target.col;
    }

    if (piece.toLowerCase() === 'q') {
      return (
        source.row === target.row || source.col === target.col || Math.abs(target.row - source.row) === Math.abs(target.col - source.col)
      );
    }

    if (piece.toLowerCase() === 'k') {
      const rowDiff = Math.abs(target.row - source.row);
      const colDiff = Math.abs(target.col - source.col);

      return rowDiff <= 1 || colDiff <= 1;
    }

    return false;
  };

  const handleSquareClick = (row, col, selectedPiece) => {
    if (!selectedSquare) {
      if (selectedPiece) {
        setSelectedSquare({ row, col });
      }
    } else {
      const targetSquare = { row, col };
      const isValidMove = validateMove(selectedSquare, targetSquare);

      if (isValidMove) {
        movePiece(selectedSquare, targetSquare);
      }

      setSelectedSquare(null);
    }
  };

  const movePiece = (source, target) => {
    const updatedBoard = [...board];
    const piece = updatedBoard[source.row][source.col];

    updatedBoard[source.row][source.col] = null;
    updatedBoard[target.row][target.col] = piece;
    setBoard(updatedBoard);
  };

  return (
    <div className="chessboard">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="chess-row">
          {row.map((piece, colIndex) => (
            <ChessSquare
              key={colIndex}
              color={(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}
              piece={piece ? { symbol: piece, color: piece === piece.toUpperCase() ? 'white' : 'black' } : null}
              onClick={(selectedPiece) => handleSquareClick(rowIndex, colIndex, selectedPiece)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Chessboard />
    </div>
  );
}

export default App;
