import { Task } from "fp-ts/Task";
export declare const toFile: (b64data: string) => Promise<File>;
export declare const convertB64toFileTask: (b64data: string) => Task<File>;
