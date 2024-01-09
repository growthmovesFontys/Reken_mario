import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "@mediapipe/tasks-vision";


export class PoseCameraProcessor implements IMarkable {

    //variables
    private poseLandmarker: PoseLandmarker | undefined;
   
    constructor() {
        
        this.setMarker();

    }

    // loading in all the data for the poseLandmarker
    setMarker = async () => {

        try {
            // makes shure all the file paths and dependencies for vision related tasks get resolved
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");

            // create the poseLandmarker with the set options
            this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1,
                minPoseDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

        } catch (error) {

            console.error("Error initializing PoseLandmarker:", error);

        }
    }

    // return the PoseLandmarker so other functions can use it
    public getMarker = () => {

        return this.poseLandmarker;
    }
   
    //end
}


