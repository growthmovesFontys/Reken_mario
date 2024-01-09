export class CanvasRenderer {
  private videoElement: HTMLVideoElement;
  private stream: MediaStream;

  constructor(inputVideoElement: HTMLVideoElement, stream?: MediaStream);
  constructor(inputVideoElement: HTMLVideoElement, stream: MediaStream) {
    this.videoElement = inputVideoElement;
    this.stream = stream;
  }

  // flip the incoming webcam video in a way that can still be processed
  public createMirroredStream = () => {
    // Assign webcam stream to video element
    this.videoElement.srcObject = this.stream;

    // Create a canvas element
    const canvas = document.getElementById("output_video") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    // Set the canvas size to match the video frame size
    canvas.width = 640;
    canvas.height = 480;

    if (ctx) {
      // Mirror the video frame horizontally and draw it onto the canvas
      this.videoElement.addEventListener("play", () => {
        const drawFrame = () => {
          // Flip the video frame horizontally before drawing it
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(
            this.videoElement,
            -canvas.width,
            0,
            canvas.width,
            canvas.height
          );
          ctx.restore();

          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      });
    }
  };

  public getVideoElement = () => {
    return this.videoElement;
  };

  public setStream = (stream: MediaStream) => {
    this.stream = stream;
  };

  //end
}
