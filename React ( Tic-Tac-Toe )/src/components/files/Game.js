
import React, { Component } from "react";
import "../styles/game.css";
import history from "../../../src/history";

class Game extends Component {
 
  constructor(props) {
    super(props);

    this.handleResetButton = this.handleResetButton.bind(this);
    this.handleSinglePlayerButton = this.handleSinglePlayerButton.bind(this);
    this.handleMultiPlayerButton = this.handleMultiPlayerButton.bind(this);


    this.state = {
      showPopup: false,
      vsPC: null,
      player_one_symbol: 'X',
      player_two_symbol: 'O',
      x_turn: true,
      board: ["", "", "", "", "", "", "", "", ""],
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  handleCellClick(index, keep_playing) {
    if (this.state.board[index] === "" && keep_playing === true && this.state.vsPC !== null) {
      let update_board = this.state.board;

      if (this.state.vsPC === false) {
        let symbol = this.state.x_turn ? this.state.player_one_symbol : this.state.player_two_symbol;
        let next_turn = !this.state.x_turn;
        update_board[index] = symbol;

        this.setState({
          board: update_board,
          x_turn: next_turn,
        });
      }

      if (this.state.vsPC === true) {
        update_board[index] = this.state.player_one_symbol;

        this.setState({ board: update_board });

        let ai_index = find_best_move(update_board);
        if (ai_index !== -4) update_board[ai_index] = this.state.player_two_symbol;

        this.setState({ board: update_board });
      }
    }
  }

  handleResetButton() {
    this.setState({
      board: ["", "", "", "", "", "", "", "", ""],
      x_turn: true
    });
  }

  handleSinglePlayerButton() {
    if (this.state.vsPC === null)
      this.setState({ vsPC: true });
  }

  handleMultiPlayerButton() {
    if (this.state.vsPC === null)
      this.setState({ vsPC: false });
  }
  showimage(cell) {
    console.log(cell);
    if (cell == 'X') {
      return <img className="xicon" src={require('../../images/x-icon.png')} />
    }
    else if (cell == 'O') {
      return <img className="oicon" src={require('../../images/o-icon.png')} />
    }

  }

  render() {
    this.handleMultiPlayerButton();
    let have_winner = winner(this.state.board);
    let keep_playing = have_winner === null ? true : false;

    if (have_winner !== null) {
      
      if(have_winner=='X'){
        alert(this.props.location.state.player1 + " won!");
      }
      else{
        alert(this.props.location.state.player2 + " won!");
      }
    }
    return (

      <div className="master">

        <div className="logo1">
          <img className="logo" src={require('../../images/logo.png')} />

          <form action="" className="form">

            <label htmlFor="player1" className="p1">Player 1 </label>
            <input type="text" id="player1" name="player1" value={this.props.location.state.player1} /><br /><br />

            <label htmlFor="player2" className="p1">Player 2 </label>
            <input type="text" id="player2" name="player2" value={this.props.location.state.player2} /><br /><br />
          </form>
        </div>
        <div className="game">
          <div className="board">
            {this.state.board.map((cell, index) => {

              return <div className="square" key={index} onClick={() => this.handleCellClick(index, keep_playing)}> {this.showimage(cell)}

              </div>
            })}

          </div>

        </div>

        <div className="btns">
          <button id="btn" className="btn2" onClick={this.handleResetButton}><b> Reset </b></button>
       
          <button id="btn" className="btn2" onClick={() => history.push('/')}>
            <b>Back</b>
          </button>
        </div>

      </div>
    );
  }
}

function winner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];
    if (squares[a] !== "" && squares[a] === squares[b] && squares[a] === squares[c] && squares[b] === squares[c])
      return squares[a];
  }

  return null;
}

function arrayToMat(squares) {
  let mat = []
  let k = 0;

  for (let i = 0; i < 3; i++) {
    mat[i] = [];
    for (let j = 0; j < 3; j++) mat[i][j] = squares[k++];
  }

  return mat;
}

function hasMovesLeft(mat) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (mat[i][j] === "") return true;
    }
  }

  return false;
}

function evaluate(mat, depth) {

  for (let i = 0; i < 3; i++) {
    if (mat[i][0] === mat[i][1] && mat[i][0] === mat[i][2] && mat[i][1] === mat[i][2]) {
      if (mat[i][0] === 'O') return 100 - depth;
      if (mat[i][0] === 'X') return depth - 100;
    }
  }

  for (let j = 0; j < 3; j++) {
    if (mat[0][j] === mat[1][j] && mat[0][j] === mat[2][j] && mat[1][j] === mat[2][j]) {
      if (mat[0][j] === 'O') return 100 - depth;
      if (mat[0][j] === 'X') return depth - 100;
    }
  }

  if (mat[0][0] === mat[1][1] && mat[0][0] === mat[2][2] && mat[1][1] === mat[2][2]) {
    if (mat[0][0] === 'O') return 100 - depth;
    if (mat[0][0] === 'X') return depth - 100;
  }

  if (mat[0][2] === mat[1][1] && mat[0][2] === mat[2][0] && mat[1][1] === mat[2][0]) {
    if (mat[0][2] === 'O') return 100 - depth;
    if (mat[0][2] === 'X') return depth - 100;
  }

  return 0;
}

function minmax(mat, depth, get_max) {
  if (hasMovesLeft(mat) === false) {
    return evaluate(mat, depth);
  }

  let val = evaluate(mat, depth);

  if (val !== 0) return val;

  if (get_max) {
    let best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === "") {
          mat[i][j] = 'O';
          best = Math.max(best, minmax(mat, depth + 1, !get_max));
          mat[i][j] = "";
        }
      }
    }

    return best;
  }

  else {
    let best = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (mat[i][j] === "") {
          mat[i][j] = 'X';
          best = Math.min(best, minmax(mat, depth + 1, !get_max));
          mat[i][j] = "";
        }
      }
    }

    return best;
  }

}

function find_best_move(squares) {
  let mat = arrayToMat(squares);
  let val, row = -1, col = -1, best = -Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (mat[i][j] === "") {
        mat[i][j] = 'O';
        val = minmax(mat, 0, false);
        mat[i][j] = "";

        if (val > best) {
          best = val;
          row = i;
          col = j;
        }
      }
    }
  }

  return (3 * row) + col;
}

export default Game;
