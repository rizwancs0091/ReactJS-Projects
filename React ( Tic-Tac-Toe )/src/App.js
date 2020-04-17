import React, { Component } from "react";
import Popup from "./components/files/Popup";
import "./App.css";
import history from "./history";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }
  redirect() {
    window.open("https://austeresystems.com/");
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }
 
  render() {
    return (
      <div className="home">
        <div className="header"></div>
        <button id="btn" className="btn1" onClick={this.togglePopup.bind(this)}>
          <b>New Game</b>
        </button>

        {this.state.showPopup ? (
          <Popup
            text="Start a New Game"
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}

        <button
          id="btn"
          className="btn2"
          onClick={() => history.push("/credits")}
        >
          <b>Credit</b>
        </button>
        <button id="btn" className="btn3" onClick={() => this.redirect()}>
          <b>Exit</b>
        </button>
      </div>
    );
  }
}

export default App;









