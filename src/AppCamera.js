import React, { Component } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

class AppCamera extends Component {
  render() {
    const { firstPhoto } = this.props;

    return (
      <div style={{ visibility: firstPhoto ? "hidden" : "visible" }}>
        <Camera onTakePhoto={this.props.onTakePhoto} isFullscreen />
      </div>
    );
  }
}

export default AppCamera;
