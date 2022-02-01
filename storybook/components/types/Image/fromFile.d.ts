import { Task } from "fp-ts/Task";
export declare const fromFile: (f: File) => Promise<HTMLImageElement>;
export declare const imageFromFileTask: (f: File) => Task<HTMLImageElement>;
