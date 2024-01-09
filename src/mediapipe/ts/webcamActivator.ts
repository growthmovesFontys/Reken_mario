import { CanvasRenderer } from "./canvasRenderer";

export class WebcamActivator {


    // function to enable webcam
    public static enableCam = async (iMarkable : IMarkable, canvasRender : CanvasRenderer) => {

        return new Promise<void>( async (resolve) => {

         // extract HTMLVideoElement
        const videoElement = canvasRender.getVideoElement();
        
        //extract Landmarker
        const marker = iMarkable.getMarker();

        // check if the poseLandmarker has finished loading in  
        if (!marker) {
            console.log("Wait! Landmaker not loaded yet.");
            return;
        }
        
        // getUsermedia parameters.
        const constraints = {
            video: true
        };
 
        // Activate the webcam stream.
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

            // assign webcam stream to canvas element
            canvasRender.setStream(stream);

            // mirror the image
            canvasRender.createMirroredStream();
           
        
        }).catch((error) => {
            console.error('Error accessing webcam:', error);
        });

        resolve();

    });

    //end
}

}
