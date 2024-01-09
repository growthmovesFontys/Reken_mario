import { PoseCameraProcessor } from "./poseCameraProcessor";
import { PoseActivator } from "./poseActivator";
import { PositionMarker, Landmark } from "./positionMarker";

const poseActivator = new PoseActivator();
(window as any).poseActivator = poseActivator;

const poseCameraProcessor = new PoseCameraProcessor();
(window as any).poseCameraProcessor = poseCameraProcessor;

export { PoseActivator, PoseCameraProcessor, PositionMarker, Landmark };
