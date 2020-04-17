
import React, { Component } from "react";
import "../styles/credit.css";
import history from "../../../src/history";


const mapStateToProps = function (state, props) {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

class credits extends Component {
  dt = []
  constructor() {

    super()
    this.state = {
      newdata: [],
      newdata1: []
    }
  }

  fetchUsers() {
    // Where we're fetching data from
    fetch(`http://api.tvmaze.com/people/1/castcredits`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      // ...then we update the users state
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i]._links.show.href)
          fetch(data[i]._links.show.href)
            // We get the API response and receive data in JSON format...
            .then(response => response.json())
            // ...then we update the users state
            .then(data1 => {
              // this.setState({newdata:data1.name})
              this.dt.push(data1.name);
            }

            )
            // Catch any errors we hit and update the app
            .catch(error => this.setState({ error, isLoading: false }));
        }
        this.setState({
          newdata: this.dt
        })
      }
      )
      // Catch any errors we hit and update the app
      .catch(error => this.setState({ error, isLoading: false }));
    // this.setState({newdata:this.dt})

  }




  render() {
    if (this.state.newdata.length == 0) {
      this.fetchUsers();
    }




    return (
      <div>
        <img className="header" src={require('../../images/logo.png')} />
        <h1>Credit</h1>

        <div className="div1">
          {this.state.newdata.map((cell, index) => {
            console.log(cell);
            console.log(index);

            return <h3> {cell} </h3>

          })}


        </div>
        <button onClick={() => history.push("/")}>
          <b>Back</b>
        </button>
      </div>
    );
  }
}

export default credits;