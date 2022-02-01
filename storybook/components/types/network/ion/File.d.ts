import { Valueable } from "./ValueObject";
declare type IonFileData = {
  name: string;
  mediaType: string;
};
export declare type IonFile = Valueable<string> & IonFileData;
export declare const fileToB64: (f: File) => Promise<string>;
export declare const fromFile: (f: File) => Promise<IonFile>;
export {};
