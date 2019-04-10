import React, { Component } from "react";

import AppCamera from "./AppCamera";
import AppButton from "./AppButton";
import AppImage from "./AppImage";

class App extends Component {
  state = {
    firstPhoto: "",
    secondPhoto: "",
    thirdPhoto: "",
    croppedPhoto: "",
    timestamp: "",
    videoRef: null,
    takePhotoBtnRef: null,
    rectWidth: 0,
    rectHeight: 0,
    rectX: 0,
    rectY: 0
  };

  onCameraStart = setTimeout(() => {
    const takePhotoBtn = document.getElementById("outer-circle");
    const video = document.querySelector("video");
    const videoOffsetWidth = video.offsetWidth;
    const videoOffsetHeight = video.offsetHeight;

    const rectWidth = Math.round(videoOffsetWidth / 3);
    const rectHeight = Math.round((videoOffsetHeight / 3) * 2);
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
      takePhotoBtnRef: takePhotoBtn,
      rectWidth,
      rectHeight,
      rectX,
      rectY
    });
  }, 1500);

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
    const {
      firstPhoto,
      secondPhoto,
      videoRef,
      takePhotoBtnRef,
      rectWidth,
      rectHeight,
      rectX,
      rectY
    } = this.state;

    const takePhoto = () =>
      setTimeout(() => takePhotoBtnRef && takePhotoBtnRef.click(), 300);

    if (!firstPhoto) {
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
        this.setState({ croppedPhoto });
      };
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
    const {
      firstPhoto,
      secondPhoto,
      thirdPhoto,
      croppedPhoto,
      timestamp
    } = this.state;

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
        {!thirdPhoto && (
          <AppCamera
            onTakePhoto={this.onTakePhoto}
            onCameraStart={this.onCameraStart}
          />
        )}
        {firstPhoto && !thirdPhoto && (
          <p className="announcement">Taking photo...</p>
        )}
        {thirdPhoto && (
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
