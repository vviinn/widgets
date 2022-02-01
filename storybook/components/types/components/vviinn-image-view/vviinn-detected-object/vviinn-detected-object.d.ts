import { ValueObject } from "../../../network/ion/ValueObject";
import { DetectedObject } from "../../../searchSession/searchSession";
export declare class VviinnDetectedObject {
  detectedObject: ValueObject<DetectedObject>;
  private getObjectPosition;
  private selectDetectedObject;
  private isActive;
  position: [string, string];
  render(): any;
}
