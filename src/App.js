import React, { Component } from "react";

import AppCamera from "./AppCamera";
import AppButton from "./AppButton";
import AppImage from "./AppImage";

class App extends Component {
  state = {
    firstPhoto: "",
    secondPhoto: "",
    thirdPhoto: "",
    timestamp: ""
  };

  onTakePhoto = dataUri => {
    const { firstPhoto, secondPhoto } = this.state;
    const takePhotoBtn = document.getElementById("outer-circle");
    const takePhoto = () =>
      setTimeout(() => takePhotoBtn && takePhotoBtn.click(), 300);

    if (!firstPhoto) {
      this.setState({ firstPhoto: dataUri, timestamp: Date.now() });
      takePhoto();
    } else if (!secondPhoto) {
      this.setState({ secondPhoto: dataUri });
      takePhoto();
    } else {
      this.setState({ thirdPhoto: dataUri });
    }
  };

  openInNewTab = data => () => {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${data}" width="100%">`);
  };

  render() {
    const { firstPhoto, secondPhoto, thirdPhoto, timestamp } = this.state;

    return (
      <div
        className="app"
        style={{ backgroundColor: secondPhoto ? "#000" : "#fff" }}
      >
        {firstPhoto && !thirdPhoto && (
          <div
            className="overlay"
            style={{ backgroundColor: secondPhoto ? "#000" : "#fff" }}
          />
        )}
        <h1 className="app-title">Next Photo</h1>
        {!thirdPhoto && <AppCamera onTakePhoto={this.onTakePhoto} />}
        {firstPhoto && !thirdPhoto && (
          <p className="announcement">Taking photo...</p>
        )}
        {thirdPhoto && (
          <div className="images-wrapper">
            <div
              className="images-wrapper__item"
              style={{ marginRight: "15px" }}
            >
              <AppImage src={firstPhoto} />
              <AppButton
                title={`normal_${timestamp}`}
                onClick={this.openInNewTab(firstPhoto)}
              />
            </div>
            <div
              className="images-wrapper__item"
              style={{ marginRight: "15px" }}
            >
              <AppImage src={secondPhoto} />
              <AppButton
                title={`white_${timestamp}`}
                onClick={this.openInNewTab(secondPhoto)}
              />
            </div>
            <div className="images-wrapper__item">
              <AppImage src={thirdPhoto} />
              <AppButton
                title={`black_${timestamp}`}
                onClick={this.openInNewTab(thirdPhoto)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
