import React, { Component } from "react";

import AppCamera from "./AppCamera";

class App extends Component {
  state = {
    firstPhoto: "",
    secondPhoto: "",
    thirdPhoto: ""
  };

  onTakePhoto = dataUri => {
    const { firstPhoto, secondPhoto } = this.state;
    const photoButton = document.getElementById("outer-circle");
    const takeAPhoto = () => {
      photoButton && photoButton.click();
    };

    if (!firstPhoto) {
      this.setState({ firstPhoto: dataUri });
      setTimeout(takeAPhoto, 1000);
    } else if (!secondPhoto) {
      this.setState({ secondPhoto: dataUri });
      setTimeout(takeAPhoto, 1000);
    } else {
      this.setState({ thirdPhoto: dataUri });
    }
  };

  openInNewTab = data => () => {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${data}" width="100%">`);
  };

  render() {
    const { firstPhoto, secondPhoto, thirdPhoto } = this.state;

    return (
      <div
        className="app"
        style={{ backgroundColor: secondPhoto ? "#000" : "#fff" }}
      >
        <h1 className="app-title">Next Photo</h1>
        {!thirdPhoto && (
          <AppCamera onTakePhoto={this.onTakePhoto} firstPhoto={firstPhoto} />
        )}
        {firstPhoto && !secondPhoto && (
          <p className="announcement">Taking photo...</p>
        )}
        {firstPhoto && secondPhoto && (
          <div className="images-wrapper">
            <div
              className="images-wrapper__item"
              style={{ marginRight: "15px" }}
            >
              <img src={firstPhoto} width="250px" alt="" />
              <button onClick={this.openInNewTab(firstPhoto)}>
                Open in new tab
              </button>
            </div>
            <div
              className="images-wrapper__item"
              style={{ marginRight: "15px" }}
            >
              <img src={secondPhoto} width="250px" alt="" />
              <button onClick={this.openInNewTab(secondPhoto)}>
                Open in new tab
              </button>
            </div>
            <div className="images-wrapper__item">
              <img src={thirdPhoto} width="250px" alt="" />
              <button onClick={this.openInNewTab(thirdPhoto)}>
                Open in new tab
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
