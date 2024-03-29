import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick } >
      { props.value }
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {

    renderSquare(i) {
    return (
    <Square 
      key = {i}
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
    />
    );
  }

  createBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare((i * 3) + j));
      }
      board.push(<div className='board-row' key={ 'row' + i }> { row } </div>)
    }
    return board;
  }

  render() {
    return (
      <div>
        { this.createBoard() }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history : [
        {
          squares : Array(9).fill(null),
        }
      ],
      xIsNext : true,
      stepNumber : 0,
      ascendingMoves : true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history : history.concat([{
        squares : squares, 
        col : ((i + 1) % 3) === 0 ? 3 : ((i + 1) % 3),
        row : Math.ceil((i + 1) / 3)
      }]),
      xIsNext : !this.state.xIsNext,
      stepNumber : history.length,
    });
  }

  reverseMoves() {
    this.setState({
      ascendingMoves : !this.state.ascendingMoves,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const description = move ?  
        "Go to move #" + move  + "(" + step.row + ", " + step.col + ")": 
        "Go to game start";
      const bold = move === this.state.stepNumber ? "bold" : "";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={bold}> { description } </button>
        </li>
      )
    });
    console.log(this.state.ascendingMoves);
    if (!this.state.ascendingMoves) {
      moves.reverse();
    }
    let status;
    if (winner) {
      status = "Winner: " + winner + "!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>
            <button onClick={() => this.reverseMoves()}>
              { this.state.ascendingMoves ? "Moves Ascending" : "Moves Descending" }
            </button>
          </div>
          <ul>{ moves }</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

