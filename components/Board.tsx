import React, { FC } from 'react';
import * as Cell from './Cell';
import * as R from 'rambda';
import * as L from '../lib';
import { PredFn } from './Cell';

// === Logic ===
// let cell 1 = ...;
// let board = [cell1, cell2, ... ];

export type Board = Cell.Cell[];

export const getStatusAt = (index : number) => (board : Board) : Cell.Status => {
  return R.view(R.lensPath(`${index}.status`), board);
};

export const setStatusAt = (index : number) => (status : Cell.Status) => (board : Board) : Board => {
  return R.set(R.lensPath(`${index}.status`), status, board);
};

export const setStatusesBy = (predFn : Cell.PredFn) => (status : Cell.Status) => (board : Board) : Board => {
  return R.map(cell => predFn(cell) ? { ...cell, status } : cell, board);
};

export const getStatusesBy = (predFn : Cell.PredFn) => (board : Board) : Cell.Status[] => {
  return R.chain(cell => predFn(cell) ? [cell.status] : [], board);
};

export const getSymbolsBy = (predFn : PredFn) => (board : Board) : string[]  => {
  return R.chain(cell => predFn(cell) ? [cell.symbol] : [], board);
};

export const canOpenAt = (index : number) => (board : Board) : boolean => {
  return index < board.length 
    && Cell.isClosed(board[index])
    && getStatusesBy(Cell.isBlocking)(board).length < 2;
};

export const areOpensEqual = (board : Board) : boolean => {
  const openSymbols = getSymbolsBy(Cell.isOpen)(board);
  return openSymbols.length >= 2 && L.allEquals(openSymbols);
};

export const areOpensDifferent = (board : Board) : boolean => {
  const openSymbols = getSymbolsBy(Cell.isOpen)(board);
  return openSymbols.length >= 2 && !L.allEquals(openSymbols);
};

const charCodeA = 'A'.charCodeAt(0);

export const makeBoard = (m : number, n : number) : Board => {
  if ((m * n / 2) > 26) throw new Error('Too big');
  if ((m * n) % 2) throw new Error('Must be even');

  return R.pipe(
    () => R.range(0, m * n / 2),
    R.map((i : number) => String.fromCharCode(i + charCodeA)),
    R.chain(x => [x, x]),
    L.shuffle,
    R.map((symbol : string) => ({ symbol, status: Cell.Status.Closed })),
  )() as Board; // Подскажем для TypeScript, что выходной тип будет Board
};

// === View ===
type BoardViewProps = {
   board: Board,
   onClickAt: (index: number) => void,
}

export const BoardView : FC<BoardViewProps> = ({ board, onClickAt }) => {
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

type ScreenView = {
  background: string,
  children: React.ReactNode,
};

export const ScreenView : FC<ScreenView> = ({ background, children }) => {
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