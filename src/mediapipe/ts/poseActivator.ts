import { CanvasRenderer } from "./canvasRenderer";
import { PositionMarker } from "./positionMarker";
import { WebcamActivator } from "./webcamActivator";
import { ElementInitializer } from "./elementInitializer";

export class PoseActivator {
  private positionMarker!: PositionMarker;
  private webcamButton!: HTMLButtonElement;
  private videoElement!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;

  public setOutputDiv = (outputDiv: HTMLDivElement) => {
    this.initializeHTMLElements(outputDiv);
  };

  // add click function to webcam button
  // async function to make the program wait untill its ready
  public initWebcamButton = async (iMarkable: IMarkable) => {
    console.log("initializing webcambutton");

    return new Promise<void>(async (resolve) => {
      // click function to turn on the webcam
      this.webcamButton.addEventListener("click", async () => {
        await WebcamActivator.enableCam(
          iMarkable,
          new CanvasRenderer(this.videoElement)
        );
        this.positionMarker = new PositionMarker(this.canvas, iMarkable);
        await this.positionMarker.initPrinting();

        // disable the webcam button
        this.webcamButton.disabled = true;

        // event to signal button has been pressed
        const event = new Event("webcamButtonClickCompleted");
        document.body.dispatchEvent(event);
      });

      console.log("click function added.");
      resolve();
    });
  };

  public getPositionMarker = (): PositionMarker => {
    return this.positionMarker;
  };

  private initializeHTMLElements = (outputDiv: HTMLDivElement) => {
    // creates the HTML elements
    this.videoElement = ElementInitializer.createVideoElement(
      outputDiv,
      "webcam"
    );
    this.canvas = ElementInitializer.createCanvasElement(
      outputDiv,
      "output_video"
    );
    this.webcamButton = ElementInitializer.createButtonElement(
      outputDiv,
      "enableWebcamButton"
    );
  };
}
