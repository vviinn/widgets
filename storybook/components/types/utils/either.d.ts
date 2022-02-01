export declare const sequenceToEither: <E, T extends import("fp-ts/lib/Either").Either<E, any>[]>(...t: T & {
  readonly 0: import("fp-ts/lib/Either").Either<E, any>;
}) => import("fp-ts/lib/Either").Either<E, { [K in keyof T]: [T[K]] extends [import("fp-ts/lib/Either").Either<E, infer A>] ? A : never; }>;
