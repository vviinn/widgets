import { Option } from "fp-ts/lib/Option";
export declare const sequenceToOption: <T extends Option<any>[]>(...t: T & {
  readonly 0: Option<any>;
}) => Option<{ [K in keyof T]: [T[K]] extends [Option<infer A>] ? A : never; }>;
export declare const checkEmpryString: (x: string) => Option<string>;
