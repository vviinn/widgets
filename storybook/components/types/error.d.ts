export declare type BasicError<T> = {
  kind: "client" | "server" | "app";
  inner: T;
};
export declare const basicErrorFromResponse: (error: Response) => BasicError<Response>;
export declare const invalidTokenError: BasicError<string>;
export declare const emptyApiPathError: BasicError<string>;
