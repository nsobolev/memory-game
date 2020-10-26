import React, { FC } from 'react';

// Мы совмещаем компонент и хелперов в одном модуле

// ==== Logic ===
/*
  Ячейка
  cell = {
    symbol: 'A',
    status: Status.Open
  }
*/

export type Cell =  {
  symbol : string,
  status : Status,
}

export enum Status {
  Open, Closed, Done, Failed
}


// Хелперы, для сокращения кода для проверки на статус

export type PredFn = (cell : Cell) => boolean;

export const isOpen : PredFn = (cell) =>
 cell.status === Status.Open;

export const isClosed = (cell : Cell) : boolean =>
 cell.status === Status.Closed;

export const isDone = (cell : Cell) : boolean =>
 cell.status === Status.Done;

export const isFailed = (cell : Cell) : boolean =>
 cell.status === Status.Failed;

export const isBlocking = (cell : Cell) : boolean =>
 isOpen(cell) || isFailed(cell);

export const statusToBackground = (status: Status) => {
  switch(status) {
    case Status.Closed: return 'darkgray';
    case Status.Open: return '#dcdcdc';
    case Status.Done: return '#a8db8f';
    case Status.Failed: return '#db8f8f';
    default: return 'gray';
  }
};

// === Views ===
type CellViewProps = {
  cell : Cell,
  onClick : (event : React.MouseEvent) => void,
}

export const View : FC<CellViewProps> = ({ cell, onClick }) => {
  const { status, symbol } = cell; 

  return (
    <>
      <div className="cell" onClick={ onClick }>
        { status === Status.Closed ? "" : symbol }
      </div>
      
      <style jsx>{`
        .cell {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100px;
          font-size: 4rem;
          background-color: ${statusToBackground(status)};
          cursor: ${ status === Status.Closed ? 'pointer': 'auto' };
        }
      `}</style>
    </>
  )
};