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

export const classByStatus = (status) => {
  return status.toLowerCase();
};

// === Views ===

export const View = ({ cell, onClick }) => {
  const { status, symbol } = cell; 

  return (
    <div className={`cell ${classByStatus(status)}`} onClick={ onClick }>
      { status === Status.Closed ? "" : symbol }
    </div>
  )
};