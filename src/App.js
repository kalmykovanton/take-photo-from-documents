import React, { Component } from "react";

import AppCamera from "./AppCamera";
import AppButton from "./AppButton";
import AppImage from "./AppImage";

class App extends Component {
  state = {
    croppedPhoto: "",
    timestamp: "",
    videoRef: null,
    rectWidth: 0,
    rectHeight: 0,
    rectX: 0,
    rectY: 0
  };

  onCameraStart = setTimeout(() => {
    const video = document.querySelector("video");
    const videoOffsetWidth = video.offsetWidth;
    const videoOffsetHeight = video.offsetHeight;

    // const rate = 2.5 / 3;
    const rectHeight = videoOffsetHeight * 0.35;
    const rectWidth = rectHeight * 0.8;
    const rectX = (videoOffsetWidth - rectWidth) / 2;
    const rectY = (videoOffsetHeight - rectHeight) / 2;

    const canvasOverlay = document.getElementById("canvas-overlay");
    canvasOverlay.width = videoOffsetWidth;
    canvasOverlay.height = videoOffsetHeight;
    const ctx = canvasOverlay.getContext("2d");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    this.setState({
      videoRef: video,
      rectWidth,
      rectHeight,
      rectX,
      rectY
    });
  }, 3000);

  cropImage = (img, newWidth, newHeight, startX, startY) => {
    var tnCanvas = document.createElement("canvas");
    var tnCanvasContext = tnCanvas.getContext("2d");
    tnCanvas.width = newWidth;
    tnCanvas.height = newHeight;

    var bufferCanvas = document.createElement("canvas");
    var bufferContext = bufferCanvas.getContext("2d");
    bufferCanvas.width = img.width;
    bufferCanvas.height = img.height;
    bufferContext.drawImage(img, 0, 0, img.width, img.height);

    tnCanvasContext.drawImage(
      bufferCanvas,
      startX,
      startY,
      newWidth,
      newHeight,
      0,
      0,
      newWidth,
      newHeight
    );

    return tnCanvas.toDataURL();
  };

  onTakePhoto = dataUri => {
    const { videoRef, rectWidth, rectHeight, rectX, rectY } = this.state;

    const img = new Image();
    img.src = dataUri;
    img.width = videoRef.offsetWidth;
    img.height = videoRef.offsetHeight;
    img.onload = () => {
      const croppedPhoto = this.cropImage(
        img,
        rectWidth,
        rectHeight,
        rectX,
        rectY
      );
      this.setState({ croppedPhoto: croppedPhoto, timestamp: Date.now() });
    };
  };

  openInNewTab = data => () => {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${data}">`);
  };

  render() {
    const { croppedPhoto, timestamp } = this.state;

    return (
      <div className="app">
        <h1 className="app-title">Take Photo From Document</h1>
        {!croppedPhoto && (
          <AppCamera
            onTakePhoto={this.onTakePhoto}
            onCameraStart={this.onCameraStart}
          />
        )}
        {croppedPhoto && (
          <React.Fragment>
            <div className="images-wrapper">
              <div
                className="images-wrapper__item"
                style={{ marginRight: "15px" }}
              >
                <AppImage src={croppedPhoto} />
                <AppButton
                  title={`cropped_${timestamp}`}
                  onClick={this.openInNewTab(croppedPhoto)}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
