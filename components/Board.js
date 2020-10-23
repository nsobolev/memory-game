import React from 'react';
import * as Cell from './Cell';
import * as R from 'rambda';
import * as L from '../lib';

// === Logic ===
// let cell 1 = ...;
// let board = [cell1, cell2, ... ];

export const getStatusAt = R.curry((index, board) => {
  return R.view(R.lensPath(`${index}.status`), status, board);
});

export const setStatusAt = R.curry((index, status, board) => {
  return R.set(R.lensPath(`${index}.status`), status, board);
});

export const setStatusesBy = R.curry((predFn, status, board) => {
  return R.map(cell => predFn(cell) ? { ...cell, status } : cell, board);
});

export const getStatusesBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.status] : [], board);
});

export const getSymbolsBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.symbol] : [], board);
});

export const canOpenAt = R.curry((index, board) => {
  console.log('isclosed', Cell.isClosed(board[index]));
  return index < board.length 
    && Cell.isClosed(board[index])
    && getStatusesBy(Cell.isBlocking, board).length < 2;
});

export const areOpensEqual = (board) => {
  const openSymbols = getSymbolsBy(Cell.isOpen, board);
  return openSymbols.length >= 2 && L.allEquals(openSymbols);
};

export const areOpensDifferent = (board) => {
  const openSymbols = getSymbolsBy(Cell.isOpen, board);
  return openSymbols.length >= 2 && !L.allEquals(openSymbols);
};

const charCodeA = 'A'.charCodeAt(0);

export const makeBoard = (m, n) => {
  if ((m * n / 2) > 26) throw new Error('Too big');
  if ((m * n) % 2) throw new Error('Must be even');

  return R.pipe(
    () => R.range(0, m * n / 2),
    R.map(i => String.fromCharCode(i + charCodeA)),
    R.chain(x => [x, x]),
    L.shuffle,
    R.map(symbol => ({ symbol, status: Cell.Status.Closed })),
  )()
};

// === View ===
export const BoardView = ({ board, onClickAt }) => {
  return (
    <>
      <div className="board">
        {
          board.map((cell, index) => (
            <Cell.View 
              key={ index } 
              cell={ cell } 
              onClick={_ => onClickAt(index) } 
            />
          ))
        }
      </div>

      <style jsx>{`
        .board {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          width: 640px;
          height: 480px;
          gap: 2px;
        }
      `}</style>
    </>
  )
};

export const ScreenView = ({ background, children }) => {
  return (
    <>
      <div className="screen">
        { children }
      </div>

      <style jsx>{`
        .screen {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 640px;
          height: 480px;
          cursor: pointer;
          background-color: ${background};
        }
        
        :global(.screen h1) {
          font-size: 3rem;
        }
      `}</style>
    </>
  )
};