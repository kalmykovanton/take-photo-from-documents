import React from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

const AppCamera = ({ onTakePhoto, onCameraStart }) => (
  <div>
    <canvas className="canvas-overlay" id="canvas-overlay" />
    <Camera onTakePhoto={onTakePhoto} onCameraStart={onCameraStart} />
  </div>
);

export default AppCamera;
