import React, { Component } from "react";

import AppCamera from "./AppCamera";
import AppButton from "./AppButton";
import AppImage from "./AppImage";

const SMALL_RECT_STATUS_NAME = "small";
const WIDE_RECT_STATUS_NAME = "wide";
const SMALL_HEIGHT_MULTER = 0.3;
const WIDE_HEIGHT_MULTER = 0.5;
const WEIGHT_MULTER = 0.8;
const RESIZE_BUTTON_SIZE = 32;

class App extends Component {
  state = {
    croppedPhoto: "",
    timestamp: "",
    videoRef: null,
    rectWidth: 0,
    rectHeight: 0,
    rectX: 0,
    rectY: 0,
    rectHeightMulter: WIDE_HEIGHT_MULTER,
    rectWidthMulter: WEIGHT_MULTER,
    rectStatus: WIDE_RECT_STATUS_NAME
  };

  initCamera = () => {
    const { rectHeightMulter, rectWidthMulter, rectStatus } = this.state;
    const resizeButton = document.getElementById("resize-button");
    const video = document.querySelector("video");
    video.setAttribute("width", 768); //todo: REMOVE!!!
    video.setAttribute("height", 576); //todo: REMOVE!!!
    const videoOffsetWidth = video.offsetWidth;
    const videoOffsetHeight = video.offsetHeight;

    // const rate = 2.5 / 3;
    const rectHeight = videoOffsetHeight * rectHeightMulter;
    const rectWidth = rectHeight * rectWidthMulter;
    const rectX = (videoOffsetWidth - rectWidth) / 2;
    const rectY = (videoOffsetHeight - rectHeight) / 2;
    const smallResizeButtonTop =
      window.innerHeight / 2 - rectHeight / 2 - RESIZE_BUTTON_SIZE / 2;
    const smallResizeButtonLeft =
      window.innerWidth / 2 + rectWidth / 2 - RESIZE_BUTTON_SIZE / 2;
    const largeResizeButtonTop =
      window.innerHeight / 2 - rectHeight / 2 - RESIZE_BUTTON_SIZE;
    const largeResizeButtonLeft = window.innerWidth / 2 + rectWidth / 2;

    resizeButton.setAttribute(
      "style",
      `top: ${
        rectStatus === SMALL_RECT_STATUS_NAME
          ? smallResizeButtonTop
          : largeResizeButtonTop
      }px;
      left: ${
        rectStatus === SMALL_RECT_STATUS_NAME
          ? smallResizeButtonLeft
          : largeResizeButtonLeft
      }px;
      visibility: visible`
    );

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
  };

  onCameraStart = setTimeout(this.initCamera, 3000);

  cropImage = (img, newWidth, newHeight, startX, startY) => {
    const tnCanvas = document.createElement("canvas");
    const tnCanvasContext = tnCanvas.getContext("2d");
    tnCanvas.width = newWidth;
    tnCanvas.height = newHeight;

    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d");
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

  resizeFrame = () => {
    this.setState(
      ({ rectStatus }) => ({
        rectHeightMulter:
          rectStatus === SMALL_RECT_STATUS_NAME
            ? WIDE_HEIGHT_MULTER
            : SMALL_HEIGHT_MULTER,
        rectStatus:
          rectStatus === SMALL_RECT_STATUS_NAME
            ? WIDE_RECT_STATUS_NAME
            : SMALL_RECT_STATUS_NAME
      }),
      this.initCamera
    );
  };

  render() {
    const { croppedPhoto, timestamp, rectStatus } = this.state;

    return (
      <div className="app">
        <h1 className="app-title">Take Photo From Document</h1>
        <button
          id="resize-button"
          className={`resize-button ${
            rectStatus === SMALL_RECT_STATUS_NAME
              ? "resize-button--wide"
              : "resize-button--small"
          }`}
          onClick={this.resizeFrame}
        />
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
