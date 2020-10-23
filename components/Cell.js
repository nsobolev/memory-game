import React from 'react';

// Мы совмещаем компонент и хелперов в одном модуле

// ==== Logic ===
/*
  Ячейка
  cell = {
    symbol: 'A',
    status: Status.Open
  }
*/


// Хелперы, для сокращения кода для проверки на статус
export const Status = {
  Open: 'Open',
  Closed: 'Closed',
  Done: 'Done',
  Failed: 'Failed',
}

export const isOpen = (cell) => cell.status === Status.Open;
export const isClosed = (cell) => cell.status === Status.Closed;
export const isDone = (cell) => cell.status === Status.Done;
export const isFailed = (cell) => cell.status === Status.Failed;
export const isBlocking = (cell) => isOpen(cell) || isFailed(cell);

export const statusToBackground = (status) => {
  switch(status) {
    case Status.Closed: return 'darkgray';
    case Status.Open: return '#dcdcdc';
    case Status.Done: return '#a8db8f';
    case Status.Failed: return '#db8f8f';
    default: return 'gray';
  }
};

// === Views ===

export const View = ({ cell, onClick }) => {
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