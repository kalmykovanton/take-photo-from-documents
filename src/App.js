import React, { Component } from "react";

import AppCamera from "./AppCamera";

class App extends Component {
  state = {
    firstPhoto: "",
    secondPhoto: ""
  };

  onTakePhoto = dataUri => {
    const { firstPhoto } = this.state;
    if (!firstPhoto) {
      this.setState({ firstPhoto: dataUri });
      setTimeout(() => {
        const photoButton = document.getElementById("outer-circle");
        photoButton && photoButton.click();
      }, 1000);
    } else {
      this.setState({ secondPhoto: dataUri });
    }
  };

  render() {
    const { firstPhoto, secondPhoto } = this.state;

    return (
      <div className="app">
        <h1 className="app-title">Next Photo</h1>
        {!secondPhoto && (
          <AppCamera onTakePhoto={this.onTakePhoto} firstPhoto={firstPhoto} />
        )}
        {firstPhoto && !secondPhoto && (
          <p className="announcement">Taking photo...</p>
        )}
        {firstPhoto && secondPhoto && (
          <div>
            <img
              style={{ marginRight: "15px" }}
              src={firstPhoto}
              width="250px"
              alt=""
            />
            <img src={secondPhoto} width="250px" alt="" />
          </div>
        )}
      </div>
    );
  }
}

export default App;
