import React, { useEffect, useState } from 'react';
import * as Cell from './Cell';
import * as Board from './Board';

import * as R from 'rambda';

// === Logic ===
const Status = {
  Running: 'Running',
  Stopped: 'Stopped',
  Won: 'Won',
  Lost: 'Lost',
};

const startGame = (state) => ({
  board: Board.makeBoard(5, 4),
  status: Status.Running,
  secondsLeft: 60,
});

const openCell = R.curry((index, state) => ({
  ...state, 
  board: Board.setStatusAt(index, Cell.Status.Open, state.board)
}));

const succeedStep = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Done, state.board)
});

const failStep = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Failed, state.board)
});

const resetStep = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isFailed, Cell.Status.Closed, state.board)
});

const nextSecond = (state) => ({
  ...state,
  secondsLeft: Math.max(state.secondsLeft - 1, 0),
});

const hasWinningCond = (state) => {
  return R.filter(Cell.isDone, state.board).length === state.board.length;
};

const hasLosingCond = (state) => !state.secondsLeft;
const setStatus = R.curry((status, state) => ({ ...state, status }));

const canOpenCell = R.curry((index, state) => {
  return Board.canOpenAt(index, state.board);
});

const ScreenBoxView = ({ status, board, onClickAt }) => {
  switch(status) {
    case Status.Running: 
      return  <Board.BoardView board={ board } onClickAt={ (index) => onClickAt(index) } />
    
    case Status.Stopped: 
      return <Board.ScreenView className="gray">
        <div>
          <h1>Memory game</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to start!</p>
        </div>
      </Board.ScreenView>

    case Status.Won: 
      return <Board.ScreenView className="green">
        <div>
          <h1>Victory!</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>

    case Status.Lost: 
      return <Board.ScreenView className="red">
        <div>
          <h1>Defeat!</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>
  }
};

const StatusLineView = ({ status, secondsLeft }) => {
  return (
    <div className="status-line">
      <div>{ status === Status.Running ? ":)" : "Lets Go!" }</div>
      <div className="timer">
        { status === Status.Running && `Seconds left: ${secondsLeft}` }
      </div>
    </div>
  )
};

export const View = () => {
  const [state, setState] = useState({
    ...startGame(),
    status: Status.Stopped,
  });

  const { status, board, secondsLeft } = state;

  const handleStartingClick = () => {
    if (status !== Status.Running) {
      setState(startGame);
    }
  };

  const handleRunningClick = (index) => {
    if (status === Status.Running && canOpenCell(index, state)) {
      setState(openCell(index));
    }
  };

  useEffect(_ => {
    if (status === Status.Running) {
      if (hasWinningCond(state)) {
        return setState(setStatus(Status.Won));
      } else if (hasLosingCond(state)) {
        return setState(setStatus(Status.Lost));
      }
    }
  }, [state]);

  useEffect(_ => {
    if (Board.areOpensEqual(board)) {
      setState(succeedStep);
    } else if (Board.areOpensDifferent(board)) {
      setState(failStep);

      setTimeout(_ => {
        setState(resetStep)
      }, 500);
    }
  }, [board]);

  useEffect(_ => {
    let timer = null;

    if (status === Status.Running && !timer) {
      timer = setInterval(() => {
        setState(nextSecond)
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    }
  }, [status]);

  return (
    <div onClick={ handleStartingClick }>
      <StatusLineView status={ status } secondsLeft={ secondsLeft } />
      <ScreenBoxView 
        status={ status } 
        board={ board }
        onClickAt={ handleRunningClick }
      />
    </div>
  )
};