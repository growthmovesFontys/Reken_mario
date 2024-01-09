import Phaser from "phaser";
import { StartScene } from "../scenes/StartScene";
import { RekenMario } from "../scenes/RekenMario";
import { GameOverScene } from "../scenes/GameOverScene";

import * as MediaPipe from "../mediapipe/ts/index";
//mediapipe
// check if there is a webcam present
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// if a webcam is found
if (hasGetUserMedia()) {
  // select the element where the mediapipe layer can create the elements
  const mediaDiv = document.getElementById("mediaBox") as HTMLDivElement;

  // activating the PositionMarker and passing on the HTMLDivElement
  const poseActivator = new MediaPipe.PoseActivator();
  var positionMarker: MediaPipe.PositionMarker;
  poseActivator.setOutputDiv(mediaDiv);
  poseActivator.initWebcamButton(new MediaPipe.PoseCameraProcessor());

  // The Mediapipe Layer creates a event to signal the initializing is complete
  // Here u can retrieve the positionMarker and allow the user to enable the motiontracking
  document.body.addEventListener("webcamButtonClickCompleted", (event) => {
    // fetch the initialized positionMarker
    positionMarker = poseActivator.getPositionMarker();
    (window as any).poseMarker = positionMarker;
  });

  // if no webcam is found
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1306, // border canvas: 1920 + 108 + 108 = 2136
  height: 720, // border canvas: 1080 +108 + 108 = 1296
  backgroundColor: "#0080c0",
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [StartScene, RekenMario, GameOverScene],
};

const game = new Phaser.Game(config);

export default game;
