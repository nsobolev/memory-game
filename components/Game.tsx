import React, { useEffect, useState, FC } from 'react';
import * as Cell from './Cell';
import * as Board from './Board';

import * as R from 'rambda';

// === Logic ===
export enum Status {
  Stopped, Running, Won, Lost
}

export type State = {
  board : Board.Board,
  secondsLeft : number,
  status: Status,
}

const startGame = () : State => ({
  board: Board.makeBoard(4, 3),
  status: Status.Running,
  secondsLeft: 60,
});

const openCell = (index : number) => (state : State) : State => ({
  ...state, 
  board: Board.setStatusAt(index)(Cell.Status.Open)(state.board)
});

const succeedStep = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen)(Cell.Status.Done)(state.board)
});

const failStep = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen)(Cell.Status.Failed)(state.board)
});

const resetStep = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy(Cell.isFailed)(Cell.Status.Closed)(state.board)
});

const nextSecond = (state: State) : State => ({
  ...state,
  secondsLeft: Math.max(state.secondsLeft - 1, 0),
});

const hasWinningCond = (state : State) : boolean => {
  return R.filter(Cell.isDone, state.board).length === state.board.length;
};

const hasLosingCond = (state : State) : boolean => !state.secondsLeft;
const setStatus = (status : Status) => (state : State) : State => ({ ...state, status });

const canOpenCell = (index : number) => (state : State) : boolean => {
  return Board.canOpenAt(index)(state.board);
};

const statusToBackground = (status : Status) : string => {
  switch(status) {
    case Status.Won:  return '#a8db8f';
    case Status.Lost: return '#db8f8f';
    default:          return '#dcdcdc';
  }
};

export type ScreenBoxViewProps = {
  status : Status,
  board : Board.Board,
  onClickAt : (index: number) => void,
}

const ScreenBoxView : FC<ScreenBoxViewProps> = ({ status, board, onClickAt }) => {
  switch(status) {
    case Status.Running: 
      return  <Board.BoardView board={ board } onClickAt={ (index) => onClickAt(index) } />
    
    case Status.Stopped: 
      return <Board.ScreenView background={ statusToBackground(status) }>
        <div>
          <h1>Memory game</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to start!</p>
        </div>
      </Board.ScreenView>

    case Status.Won: 
      return <Board.ScreenView background={ statusToBackground(status) }>
        <div>
          <h1>Victory!</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>

    case Status.Lost: 
      return <Board.ScreenView background={ statusToBackground(status) }>
        <div>
          <h1>Defeat!</h1>
          <p className="small" style={{ textAlign: 'center' }}>Click anywhere to try again!</p>
        </div>
      </Board.ScreenView>
  }
};

export type StatusLineViewProps = {
  status : Status,
  secondsLeft : number;
}

const StatusLineView : FC<StatusLineViewProps> = ({ status, secondsLeft }) => {
  return (
    <>
      <div className="status-line">
        <div>{ status === Status.Running ? ":)" : "Lets Go!" }</div>
        <div className="timer">
          { status === Status.Running && `Seconds left: ${secondsLeft}` }
        </div>
      </div>
      <style jsx>{`
        .status-line {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          color: gray;
        }

        .timer {
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  )
};

export const GameView : FC = () => {
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

  const handleRunningClick = (index : number) => {
    if (status === Status.Running && canOpenCell(index)(state)) {
      setState(openCell(index));
    }
  };

  useEffect(() => {
    if (status === Status.Running) {
      if (hasWinningCond(state)) {
        return setState(setStatus(Status.Won));
      } else if (hasLosingCond(state)) {
        return setState(setStatus(Status.Lost));
      }
    }
  }, [state]);

  useEffect(() => {
    if (Board.areOpensEqual(board)) {
      setState(succeedStep);
    } else if (Board.areOpensDifferent(board)) {
      setState(failStep);

      setTimeout(() => {
        setState(resetStep)
      }, 500);
    }
  }, [board]);

  useEffect(() => {
    let timer : ReturnType<typeof setInterval> | null = null;

    if (status === Status.Running && !timer) {
      timer = setInterval(() => {
        setState(nextSecond)
      }, 1000);
    }

    return () => {
      timer ? clearInterval(timer) : null;
    }
  }, [status]);

  return (
    <div onClick={ handleStartingClick }>
      <StatusLineView 
        status={ status } 
        secondsLeft={ secondsLeft } 
      />
      <ScreenBoxView 
        status={ status } 
        board={ board }
        onClickAt={ handleRunningClick }
      />
    </div>
  )
};