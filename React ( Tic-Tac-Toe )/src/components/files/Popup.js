import React from "react";
import "../styles/popup.css";
import history from "../../../src/history";


class Popup extends React.Component {

  textInput = "";
  constructor(props
  ) {
    super(props)
    this.publish = this.publish.bind(this);
    this.state = {

    }
  }
  publish() {
    if (this.refs.topic.value != "" && this.refs.payload.value != "") {
      history.push('/game', { player1: this.refs.topic.value, player2: this.refs.payload.value })
    }
    else {
      // alert("please fill all fields")
    }
  }
  render() {
    return (
      <div className="popup">
        <div className="popup1">
          <h1>{this.props.text}</h1>


          <form action="">
            <label htmlFor="player1" className="p1">Player 1 </label>
            <input type="text" id="player1" ref="topic" name="player1" required value={this.state.player1} /><br /><br />
            <label htmlFor="player2" className="p1">Player 2 </label>
            <input type="text" id="player2" ref="payload" name="player2" required value={this.state.player2} /><br /><br />
            <input type="submit" value="Start!" onClick={this.publish} className="start" />
          </form>

        </div>
      </div>
    );
  }
}

export default Popup;
