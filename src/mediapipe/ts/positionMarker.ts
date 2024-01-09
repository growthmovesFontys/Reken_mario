import { PoseCameraProcessor } from "./poseCameraProcessor";
import { Landmark, PoseLandmarker } from "@mediapipe/tasks-vision";

export class PositionMarker {
  constructor(
    private canvasVideo: HTMLCanvasElement,
    private iMarkable: IMarkable
  ) {}

  // creating positions for the first time to skip the delay when u actually need it
  public initPrinting = async () => {
    return new Promise<void>(async (resolve) => {
      // getting a timestamp
      let startTimeMs = performance.now();

      // a empty video frame so the detector can do its thing before a actual frame is loaded in
      let videoElement: HTMLVideoElement = document.createElement("video");
      videoElement.width = this.canvasVideo.width;
      videoElement.height = this.canvasVideo.height;

      // get the marker
      const marker = await this.iMarkable.getMarker();

      // running the detector
      marker.detectForVideo(videoElement, startTimeMs, () => {});

      resolve();
    });
  };

  // returns array of Datapoints that belong to the given bodyPart

  public readPosition = (bodyLandmarks: number[]): Landmark[] => {
    var foundDatapoints: Landmark[] = [];

    // getting a timestamp
    let startTimeMs = performance.now();

    // get the poseLandmarker
    const poseLandmarker = this.iMarkable.getMarker();

    // getting the positions from the canvas snapshot
    poseLandmarker.detectForVideo(
      this.canvasVideo,
      startTimeMs,
      (result: { landmarks: any }) => {
        const landmarks = result.landmarks;

        // go trough all bodyLandmarkers of given bodypart
        for (const bodyLandmark of bodyLandmarks) {
          if (landmarks[0] != undefined) {
            // add a new dataPoint to the Array
            var foundMark = landmarks[0][bodyLandmark];
            foundDatapoints.push(foundMark);
          }
        }
      }
    );

    return foundDatapoints;
  };

  //end
}

export { Landmark };
