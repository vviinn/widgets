
(()=>{

'use strict';



const isInstanceOf = (value, className) => {
  const C = globalThis[className];
  return C != null && value instanceof C;
}
const getTransferables = (value) => {
  if (value != null) {
  if (
    isInstanceOf(value, "ArrayBuffer") ||
    isInstanceOf(value, "MessagePort") ||
    isInstanceOf(value, "ImageBitmap") ||
    isInstanceOf(value, "OffscreenCanvas")
  ) {
    return [value];
  }
  if (typeof value === "object") {
    if (value.constructor === Object) {
    value = Object.values(value);
    }
    if (Array.isArray(value)) {
    return value.flatMap(getTransferables);
    }
    return getTransferables(value.buffer);
  }
  }
  return [];
};
const exports = {};
const workerMsgId = 'stencil.products.worker';
const workerMsgCallbackId = workerMsgId + '.cb';
addEventListener('message', async ({data}) => {
  if (data && data[0] === workerMsgId) {
  let id = data[1];
  let method = data[2];
  let args = data[3];
  let i = 0;
  let argsLen = args.length;
  let value;
  let err;

  try {
    for (; i < argsLen; i++) {
    if (Array.isArray(args[i]) && args[i][0] === workerMsgCallbackId) {
      const callbackId = args[i][1];
      args[i] = (...cbArgs) => {
      postMessage(
        [workerMsgCallbackId, callbackId, cbArgs]
      );
      };
    }
    }
    
    value = exports[method](...args);
    if (!value || !value.then) {
    throw new Error('The exported method "' + method + '" does not return a Promise, make sure it is an "async" function');
    }
    value = await value;
    

  } catch (e) {
    value = null;
    if (e instanceof Error) {
    err = {
      isError: true,
      value: {
      message: e.message,
      name: e.name,
      stack: e.stack,
      }
    };
    } else {
    err = {
      isError: false,
      value: e
    };
    }
    value = undefined;
  }

  const transferables = getTransferables(value);
  if (transferables.length > 0) console.debug('Transfering', transferables);

  postMessage(
    [workerMsgId, id, value, err],
    transferables
  );
  }
});


// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var getBooleanAlgebra = function (B) { return function () { return ({
    meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
    join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
    zero: function () { return B.zero; },
    one: function () { return B.one; },
    implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
    not: function (x) { return function (a) { return B.not(x(a)); }; }
}); }; };
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate, getSemigroup } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = getSemigroup(B.SemigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = getSemigroup(B.SemigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getSemigroup$6 = function (S) { return function () { return ({
    concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
}); }; };
/**
 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/Predicate'
 * import { getMonoid } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const M1 = getMonoid(B.MonoidAll)<number>()
 *
 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
 *
 * const M2 = getMonoid(B.MonoidAny)<number>()
 *
 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getMonoid$4 = function (M) {
    var getSemigroupM = getSemigroup$6(M);
    return function () { return ({
        concat: getSemigroupM().concat,
        empty: function () { return M.empty; }
    }); };
};
/**
 * @category instances
 * @since 2.10.0
 */
var getSemiring = function (S) { return ({
    add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
    zero: function () { return S.zero; },
    mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
    one: function () { return S.one; }
}); };
/**
 * @category instances
 * @since 2.10.0
 */
var getRing = function (R) {
    var S = getSemiring(R);
    return {
        add: S.add,
        mul: S.mul,
        one: S.one,
        zero: S.zero,
        sub: function (f, g) { return function (x) { return R.sub(f(x), g(x)); }; }
    };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var apply = function (a) { return function (f) { return f(a); }; };
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
/**
 * @since 2.0.0
 */
var unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function constant$1(a) {
    return function () { return a; };
}
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
var constTrue = 
/*#__PURE__*/
constant$1(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
var constFalse = 
/*#__PURE__*/
constant$1(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
var constNull = 
/*#__PURE__*/
constant$1(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
var constUndefined = 
/*#__PURE__*/
constant$1(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
var constVoid = constUndefined;
/**
 * Flips the order of the arguments of a function of two arguments.
 *
 * @since 2.0.0
 */
function flip(f) {
    return function (b, a) { return f(a, b); };
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
/**
 * @since 2.0.0
 */
function tuple$3() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
    return function (a) { return f.apply(void 0, a); };
}
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return f(a);
    };
}
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        default:
            var ret = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret);
            }
            return ret;
    }
}
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
var hole = absurd;
/**
 * @since 2.11.0
 */
var SK = function (_, b) { return b; };
/**
 * Use `Predicate` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
/**
 * Use `Endomorphism` module instead.
 *
 * @category instances
 * @since 2.10.0
 * @deprecated
 */
var getEndomorphismMonoid = function () { return ({
    concat: function (first, second) { return flow(first, second); },
    empty: identity
}); };

function ap$4(F, G) {
    return function (fa) { return function (fab) {
        return F.ap(F.map(fab, function (gab) { return function (ga) { return G.ap(gab, ga); }; }), fa);
    }; };
}
function apFirst$4(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function (a) { return function () { return a; }; }), second);
    }; };
}
function apSecond$4(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function () { return function (b) { return b; }; }), second);
    }; };
}
function apS$4(F) {
    return function (name, fb) { return function (fa) {
        return F.ap(F.map(fa, function (a) { return function (b) {
            var _a;
            return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
        }; }), fb);
    }; };
}
function getApplySemigroup(F) {
    return function (S) { return ({
        concat: function (first, second) {
            return F.ap(F.map(first, function (x) { return function (y) { return S.concat(x, y); }; }), second);
        }
    }); };
}
function curried(f, n, acc) {
    return function (x) {
        var combined = Array(acc.length + 1);
        for (var i = 0; i < acc.length; i++) {
            combined[i] = acc[i];
        }
        combined[acc.length] = x;
        return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
    };
}
var tupleConstructors = {
    1: function (a) { return [a]; },
    2: function (a) { return function (b) { return [a, b]; }; },
    3: function (a) { return function (b) { return function (c) { return [a, b, c]; }; }; },
    4: function (a) { return function (b) { return function (c) { return function (d) { return [a, b, c, d]; }; }; }; },
    5: function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return [a, b, c, d, e]; }; }; }; }; }
};
function getTupleConstructor(len) {
    if (!tupleConstructors.hasOwnProperty(len)) {
        tupleConstructors[len] = curried(tuple$3, len - 1, []);
    }
    return tupleConstructors[len];
}
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = getTupleConstructor(len);
        var fas = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
        }
        return fas;
    };
}
function getRecordConstructor(keys) {
    var len = keys.length;
    switch (len) {
        case 1:
            return function (a) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a);
            };
        case 2:
            return function (a) { return function (b) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a);
            }; };
        case 3:
            return function (a) { return function (b) { return function (c) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a);
            }; }; };
        case 4:
            return function (a) { return function (b) { return function (c) { return function (d) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a);
            }; }; }; };
        case 5:
            return function (a) { return function (b) { return function (c) { return function (d) { return function (e) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a[keys[4]] = e,
                    _a);
            }; }; }; }; };
        default:
            return curried(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var r = {};
                for (var i = 0; i < len; i++) {
                    r[keys[i]] = args[i];
                }
                return r;
            }, len - 1, []);
    }
}
function sequenceS(F) {
    return function (r) {
        var keys = Object.keys(r);
        var len = keys.length;
        var f = getRecordConstructor(keys);
        var fr = F.map(r[keys[0]], f);
        for (var i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
        }
        return fr;
    };
}

function chainFirst$4(M) {
    return function (f) { return function (first) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); }; };
}
function bind$4(M) {
    return function (name, f) { return function (ma) { return M.chain(ma, function (a) { return M.map(f(a), function (b) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
    }); }); }; };
}

var __spreadArray$3 = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
var isNone = function (fa) { return fa._tag === 'None'; };
/** @internal */
var isSome = function (fa) { return fa._tag === 'Some'; };
/** @internal */
var none = { _tag: 'None' };
/** @internal */
var some$2 = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft = function (ma) { return ma._tag === 'Left'; };
/** @internal */
var isRight = function (ma) { return ma._tag === 'Right'; };
/** @internal */
var left$1 = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
var right$1 = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var singleton = function (a) { return [a]; };
/** @internal */
var isNonEmpty$4 = function (as) { return as.length > 0; };
/** @internal */
var head$4 = function (as) { return as[0]; };
/** @internal */
var tail$4 = function (as) { return as.slice(1); };
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
var emptyReadonlyArray = [];
/** @internal */
var emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
var has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var fromReadonlyNonEmptyArray$1 = function (as) { return __spreadArray$3([as[0]], as.slice(1)); };

/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */
function fromOption$2(F) {
    return function (onNone) { return function (ma) { return F.fromEither(isNone(ma) ? left$1(onNone()) : right$1(ma.value)); }; };
}
function fromPredicate$2(F) {
    return function (predicate, onFalse) { return function (a) {
        return F.fromEither(predicate(a) ? right$1(a) : left$1(onFalse(a)));
    }; };
}
function fromOptionK$2(F) {
    var fromOptionF = fromOption$2(F);
    return function (onNone) {
        var from = fromOptionF(onNone);
        return function (f) { return flow(f, from); };
    };
}
function chainOptionK(F, M) {
    var fromOptionKF = fromOptionK$2(F);
    return function (onNone) {
        var from = fromOptionKF(onNone);
        return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
    };
}
function fromEitherK$2(F) {
    return function (f) { return flow(f, F.fromEither); };
}
function chainEitherK(F, M) {
    var fromEitherKF = fromEitherK$2(F);
    return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
}
function filterOrElse(F, M) {
    return function (predicate, onFalse) { return function (ma) {
        return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? right$1(a) : left$1(onFalse(a))); });
    }; };
}

/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */
function map$5(F, G) {
    return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
}
function flap$5(F) {
    return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
}
function bindTo$4(F) {
    return function (name) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return (_a = {}, _a[name] = a, _a);
    }); }; };
}
/** @deprecated */
function getFunctorComposition(F, G) {
    var _map = map$5(F, G);
    return {
        map: function (fga, f) { return pipe(fga, _map(f)); }
    };
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromEquals = function (equals) { return ({
    equals: function (x, y) { return x === y || equals(x, y); }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.10.0
 */
var struct$1 = function (eqs) {
    return fromEquals(function (first, second) {
        for (var key in eqs) {
            if (!eqs[key].equals(first[key], second[key])) {
                return false;
            }
        }
        return true;
    });
};
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple$2 = function () {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return fromEquals(function (first, second) { return eqs.every(function (E, i) { return E.equals(first[i], second[i]); }); });
};
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_$1 = function (fa, f) { return pipe(fa, contramap$1(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
var contramap$1 = function (f) { return function (fa) {
    return fromEquals(function (x, y) { return fa.equals(f(x), f(y)); });
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$6 = 'Eq';
/**
 * @category instances
 * @since 2.5.0
 */
var eqStrict = {
    equals: function (a, b) { return a === b; }
};
var empty$3 = {
    equals: function () { return true; }
};
/**
 * @category instances
 * @since 2.10.0
 */
var getSemigroup$5 = function () { return ({
    concat: function (x, y) { return fromEquals(function (a, b) { return x.equals(a, b) && y.equals(a, b); }); }
}); };
/**
 * @category instances
 * @since 2.6.0
 */
var getMonoid$3 = function () { return ({
    concat: getSemigroup$5().concat,
    empty: empty$3
}); };
/**
 * @category instances
 * @since 2.7.0
 */
var Contravariant$1 = {
    URI: URI$6,
    contramap: contramap_$1
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleEq = tuple$2;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getStructEq = struct$1;
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @since 2.0.0
 * @deprecated
 */
var strictEqual = eqStrict.equals;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eq = Contravariant$1;
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqBoolean = eqStrict;
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqString = eqStrict;
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqNumber = eqStrict;
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqDate = {
    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
};

// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
var equalsDefault = function (compare) { return function (first, second) {
    return first === second || compare(first, second) === 0;
}; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromCompare = function (compare) { return ({
    equals: equalsDefault(compare),
    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Ord'
 * import * as B from 'fp-ts/boolean'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 *
 * const O = tuple(S.Ord, N.Ord, B.Ord)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple$1 = function () {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    return fromCompare(function (first, second) {
        var i = 0;
        for (; i < ords.length - 1; i++) {
            var r = ords[i].compare(first[i], second[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(first[i], second[i]);
    });
};
/**
 * @category combinators
 * @since 2.10.0
 */
var reverse$6 = function (O) { return fromCompare(function (first, second) { return O.compare(second, first); }); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_ = function (fa, f) { return pipe(fa, contramap(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return fromCompare(function (first, second) { return fa.compare(f(first), f(second)); });
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$5 = 'Ord';
/**
 * @category instances
 * @since 2.0.0
 */
var getSemigroup$4 = function () { return ({
    concat: function (first, second) {
        return fromCompare(function (a, b) {
            var ox = first.compare(a, b);
            return ox !== 0 ? ox : second.compare(a, b);
        });
    }
}); };
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as B from 'fp-ts/boolean'
 * import { pipe } from 'fp-ts/function'
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface User {
 *   readonly id: number
 *   readonly name: string
 *   readonly age: number
 *   readonly rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   S.Ord,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   N.Ord,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   B.Ord,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
var getMonoid$2 = function () { return ({
    concat: getSemigroup$4().concat,
    empty: fromCompare(function () { return 0; })
}); };
/**
 * @category instances
 * @since 2.7.0
 */
var Contravariant = {
    URI: URI$5,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var trivial = {
    equals: constTrue,
    compare: 
    /*#__PURE__*/
    constant$1(0)
};
/**
 * @since 2.11.0
 */
var equals = function (O) { return function (second) { return function (first) {
    return first === second || O.compare(first, second) === 0;
}; }; };
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
var lt = function (O) { return function (first, second) { return O.compare(first, second) === -1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
var gt = function (O) { return function (first, second) { return O.compare(first, second) === 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
var leq = function (O) { return function (first, second) { return O.compare(first, second) !== 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
var geq = function (O) { return function (first, second) { return O.compare(first, second) !== -1; }; };
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var min$3 = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) < 1 ? first : second;
}; };
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var max$3 = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) > -1 ? first : second;
}; };
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
var clamp = function (O) {
    var minO = min$3(O);
    var maxO = max$3(O);
    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
var between = function (O) {
    var ltO = lt(O);
    var gtO = gt(O);
    return function (low, hi) { return function (a) { return (ltO(a, low) || gtO(a, hi) ? false : true); }; };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleOrd = tuple$1;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getDualOrd = reverse$6;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ord = Contravariant;
// default compare for primitive types
function compare(first, second) {
    return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
    equals: eqStrict.equals,
    compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordDate = 
/*#__PURE__*/
pipe(ordNumber, 
/*#__PURE__*/
contramap(function (date) { return date.valueOf(); }));

/**
 * A `Magma` is a pair `(A, concat)` in which `A` is a non-empty set and `concat` is a binary operation on `A`
 *
 * See [Semigroup](https://gcanti.github.io/fp-ts/modules/Semigroup.ts.html) for some instances.
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Magma`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse, concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(reverse(N.MagmaSub))(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), 2)
 *
 * @category combinators
 * @since 2.11.0
 */
var reverse$5 = function (M) { return ({
    concat: function (first, second) { return M.concat(second, first); }
}); };
/**
 * @category combinators
 * @since 2.11.0
 */
var filterFirst = function (predicate) { return function (M) { return ({
    concat: function (first, second) { return (predicate(first) ? M.concat(first, second) : second); }
}); }; };
/**
 * @category combinators
 * @since 2.11.0
 */
var filterSecond = function (predicate) { return function (M) { return ({
    concat: function (first, second) { return (predicate(second) ? M.concat(first, second) : first); }
}); }; };
/**
 * @category combinators
 * @since 2.11.0
 */
var endo = function (f) { return function (M) { return ({
    concat: function (first, second) { return M.concat(f(first), f(second)); }
}); }; };
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(N.MagmaSub)(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), -6)
 *
 * @since 2.11.0
 */
var concatAll$3 = function (M) { return function (startWith) { return function (as) {
    return as.reduce(function (a, acc) { return M.concat(a, acc); }, startWith);
}; }; };

/**
 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
 *
 * ```ts
 * interface Semigroup<A> {
 *   readonly concat: (x: A, y: A) => A
 * }
 * ```
 *
 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
 *
 * ```ts
 * concat(x, concat(y, z)) = concat(concat(x, y), z)
 * ```
 *
 * A common example of a semigroup is the type `string` with the operation `+`.
 *
 * ```ts
 * import { Semigroup } from 'fp-ts/Semigroup'
 *
 * const semigroupString: Semigroup<string> = {
 *   concat: (x, y) => x + y
 * }
 *
 * const x = 'x'
 * const y = 'y'
 * const z = 'z'
 *
 * semigroupString.concat(x, y) // 'xy'
 *
 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
 *
 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
 * ```
 *
 * *Adapted from https://typelevel.org/cats*
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a semigroup where `concat` will return the minimum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.min(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min$2 = function (O) { return ({
    concat: min$3(O)
}); };
/**
 * Get a semigroup where `concat` will return the maximum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.max(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
var max$2 = function (O) { return ({
    concat: max$3(O)
}); };
/**
 * @category constructors
 * @since 2.10.0
 */
var constant = function (a) { return ({
    concat: function () { return a; }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Semigroup).concat('a', 'b'), 'ba')
 *
 * @category combinators
 * @since 2.10.0
 */
var reverse$4 = reverse$5;
/**
 * Given a struct of semigroups returns a semigroup for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const S = struct<Point>({
 *   x: N.SemigroupSum,
 *   y: N.SemigroupSum
 * })
 *
 * assert.deepStrictEqual(S.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @category combinators
 * @since 2.10.0
 */
var struct = function (semigroups) { return ({
    concat: function (first, second) {
        var r = {};
        for (var k in semigroups) {
            if (has.call(semigroups, k)) {
                r[k] = semigroups[k].concat(first[k], second[k]);
            }
        }
        return r;
    }
}); };
/**
 * Given a tuple of semigroups returns a semigroup for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Semigroup'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const S1 = tuple(S.Semigroup, N.SemigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = tuple(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple = function () {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return ({
        concat: function (first, second) { return semigroups.map(function (s, i) { return s.concat(first[i], second[i]); }); }
    });
};
/**
 * Between each pair of elements insert `middle`.
 *
 * @example
 * import { intercalate } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * const S1 = pipe(S.Semigroup, intercalate(' + '))
 *
 * assert.strictEqual(S1.concat('a', 'b'), 'a + b')
 *
 * @category combinators
 * @since 2.10.0
 */
var intercalate = function (middle) { return function (S) { return ({
    concat: function (x, y) { return S.concat(x, S.concat(middle, y)); }
}); }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * Always return the first argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.first<number>().concat(1, 2), 1)
 *
 * @category instances
 * @since 2.10.0
 */
var first = function () { return ({ concat: identity }); };
/**
 * Always return the last argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.last<number>().concat(1, 2), 2)
 *
 * @category instances
 * @since 2.10.0
 */
var last$4 = function () { return ({ concat: function (_, y) { return y; } }); };
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * const sum = concatAll(N.SemigroupSum)(0)
 *
 * assert.deepStrictEqual(sum([1, 2, 3]), 6)
 * assert.deepStrictEqual(sum([]), 0)
 *
 * @since 2.10.0
 */
var concatAll$2 = concatAll$3;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `void` module instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupVoid = constant(undefined);
/**
 * Use [`getAssignSemigroup`](./struct.ts.html#getAssignSemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getObjectSemigroup = function () { return ({
    concat: function (first, second) { return Object.assign({}, first, second); }
}); };
/**
 * Use [`last`](#last) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getLastSemigroup = last$4;
/**
 * Use [`first`](#first) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFirstSemigroup = first;
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleSemigroup = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getStructSemigroup = struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getDualSemigroup = reverse$4;
/**
 * Use [`max`](#max) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getJoinSemigroup = max$2;
/**
 * Use [`min`](#min) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getMeetSemigroup = min$2;
/**
 * Use [`intercalate`](#intercalate) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var getIntercalateSemigroup = intercalate;
function fold$2(S) {
    var concatAllS = concatAll$2(S);
    return function (startWith, as) { return (as === undefined ? concatAllS(startWith) : concatAllS(startWith)(as)); };
}
/**
 * Use [`SemigroupAll`](./boolean.ts.html#SemigroupAll) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Use [`SemigroupAny`](./boolean.ts.html#SemigroupAny) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Use [`getSemigroup`](./function.ts.html#getSemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFunctionSemigroup = getSemigroup$6;
/**
 * Use [`Semigroup`](./string.ts.html#Semigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupSum`](./number.ts.html#SemigroupSum) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupProduct`](./number.ts.html#SemigroupProduct) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupProduct = {
    concat: function (x, y) { return x * y; }
};

var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var empty$2 = emptyReadonlyArray;
/**
 * @internal
 */
var isNonEmpty$3 = isNonEmpty$4;
/**
 * @internal
 */
var isOutOfBound$3 = function (i, as) { return i < 0 || i >= as.length; };
/**
 * @internal
 */
var prependW$3 = function (head) { return function (tail) { return __spreadArray$2([head], tail); }; };
/**
 * @internal
 */
var prepend$3 = prependW$3;
/**
 * @internal
 */
var appendW$3 = function (end) { return function (init) { return __spreadArray$2(__spreadArray$2([], init), [end]); }; };
/**
 * @internal
 */
var append$3 = appendW$3;
/**
 * @internal
 */
var unsafeInsertAt$3 = function (i, a, as) {
    if (isNonEmpty$3(as)) {
        var xs = fromReadonlyNonEmptyArray$1(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
var unsafeUpdateAt$3 = function (i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = fromReadonlyNonEmptyArray$1(as);
        xs[i] = a;
        return xs;
    }
};
/**
 * Remove duplicates from a `ReadonlyNonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var uniq$3 = function (E) { return function (as) {
    if (as.length === 1) {
        return as;
    }
    var out = [head$3(as)];
    var rest = tail$3(as);
    var _loop_1 = function (a) {
        if (out.every(function (o) { return !E.equals(o, a); })) {
            out.push(a);
        }
    };
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var a = rest_1[_i];
        _loop_1(a);
    }
    return out;
}; };
/**
 * Sort the elements of a `ReadonlyNonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = RNEA.sortBy([byName, byAge])
 *
 * const persons: RNEA.ReadonlyNonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.11.0
 */
var sortBy$3 = function (ords) {
    if (isNonEmpty$3(ords)) {
        var M = getMonoid$2();
        return sort$3(ords.reduce(M.concat, M.empty));
    }
    return identity;
};
/**
 * @category combinators
 * @since 2.11.0
 */
var union$3 = function (E) {
    var uniqE = uniq$3(E);
    return function (second) { return function (first) { return uniqE(pipe(first, concat$3(second))); }; };
};
/**
 * Rotate a `ReadonlyNonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var rotate$3 = function (n) { return function (as) {
    var len = as.length;
    var m = Math.round(n) % len;
    if (isOutOfBound$3(Math.abs(m), as) || m === 0) {
        return as;
    }
    if (m < 0) {
        var _a = splitAt$3(-m)(as), f = _a[0], s = _a[1];
        return pipe(s, concat$3(f));
    }
    else {
        return rotate$3(m - len)(as);
    }
}; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Return a `ReadonlyNonEmptyArray` from a `ReadonlyArray` returning `none` if the input is empty.
 *
 * @category constructors
 * @since 2.5.0
 */
var fromReadonlyArray = function (as) {
    return isNonEmpty$3(as) ? some$2(as) : none;
};
/**
 * Return a `ReadonlyNonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
var makeBy$3 = function (f) { return function (n) {
    var j = Math.max(0, Math.floor(n));
    var out = [f(0)];
    for (var i = 1; i < j; i++) {
        out.push(f(i));
    }
    return out;
}; };
/**
 * Create a `ReadonlyNonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
var replicate$3 = function (a) { return makeBy$3(function () { return a; }); };
/**
 * Create a `ReadonlyNonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
var range$3 = function (start, end) {
    return start <= end ? makeBy$3(function (i) { return start + i; })(end - start + 1) : [start];
};
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
 *
 * @category destructors
 * @since 2.9.0
 */
var unprepend$1 = function (as) { return [head$3(as), tail$3(as)]; };
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @category destructors
 * @since 2.9.0
 */
var unappend$1 = function (as) { return [init$3(as), last$3(as)]; };
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.5.0
 */
var fromArray$2 = function (as) { return fromReadonlyArray(as.slice()); };
function concatW$3(second) {
    return function (first) { return first.concat(second); };
}
function concat$3(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
/**
 * @category combinators
 * @since 2.5.0
 */
var reverse$3 = function (as) {
    return as.length === 1 ? as : __spreadArray$2([last$3(as)], as.slice(0, -1).reverse());
};
function group$1(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return empty$2;
        }
        var out = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @category combinators
 * @since 2.5.0
 */
var groupBy$1 = function (f) { return function (as) {
    var out = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (out.hasOwnProperty(k)) {
            out[k].push(a);
        }
        else {
            out[k] = [a];
        }
    }
    return out;
}; };
/**
 * @category combinators
 * @since 2.5.0
 */
var sort$3 = function (O) { return function (as) {
    return as.length === 1 ? as : as.slice().sort(O.compare);
}; };
/**
 * @category combinators
 * @since 2.5.0
 */
var updateAt$3 = function (i, a) {
    return modifyAt$3(i, function () { return a; });
};
/**
 * @category combinators
 * @since 2.5.0
 */
var modifyAt$3 = function (i, f) { return function (as) { return (isOutOfBound$3(i, as) ? none : some$2(unsafeUpdateAt$3(i, f(as[i]), as))); }; };
/**
 * @category combinators
 * @since 2.5.1
 */
var zipWith$3 = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
function zip$3(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip$3(bs, as); };
    }
    return zipWith$3(as, bs, function (a, b) { return [a, b]; });
}
/**
 * @category combinators
 * @since 2.5.1
 */
var unzip$3 = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll$3 = function (middle) { return function (as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
        out.push(middle, as[i]);
    }
    return out;
}; };
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse$3 = function (middle) { return function (as) {
    var rest = tail$3(as);
    return isNonEmpty$3(rest) ? pipe(rest, prependAll$3(middle), prepend$3(head$3(as))) : as;
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var chainWithIndex$3 = function (f) { return function (as) {
    var out = fromReadonlyNonEmptyArray$1(f(0, head$3(as)));
    for (var i = 1; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * A useful recursion pattern for processing a `ReadonlyNonEmptyArray` to produce a new `ReadonlyNonEmptyArray`, often used for "chopping" up the input
 * `ReadonlyNonEmptyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyNonEmptyArray` and produce a
 * value and the tail of the `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.10.0
 */
var chop$3 = function (f) { return function (as) {
    var _a = f(as), b = _a[0], rest = _a[1];
    var out = [b];
    var next = rest;
    while (isNonEmpty$3(next)) {
        var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
        out.push(b_1);
        next = rest_2;
    }
    return out;
}; };
/**
 * Splits a `ReadonlyNonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category combinators
 * @since 2.10.0
 */
var splitAt$3 = function (n) { return function (as) {
    var m = Math.max(1, n);
    return m >= as.length ? [as, empty$2] : [pipe(as.slice(1, m), prepend$3(head$3(as))), as.slice(m)];
}; };
/**
 * Splits a `ReadonlyNonEmptyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.10.0
 */
var chunksOf$3 = function (n) { return chop$3(splitAt$3(n)); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$4 = function (fa, f) { return pipe(fa, map$4(f)); };
/* istanbul ignore next */
var _mapWithIndex$3 = function (fa, f) { return pipe(fa, mapWithIndex$3(f)); };
var _ap$3 = function (fab, fa) { return pipe(fab, ap$3(fa)); };
var _chain$3 = function (ma, f) { return pipe(ma, chain$3(f)); };
/* istanbul ignore next */
var _extend$3 = function (wa, f) { return pipe(wa, extend$3(f)); };
/* istanbul ignore next */
var _reduce$3 = function (fa, b, f) { return pipe(fa, reduce$3(b, f)); };
/* istanbul ignore next */
var _foldMap$3 = function (M) {
    var foldMapM = foldMap$3(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight$3 = function (fa, b, f) { return pipe(fa, reduceRight$3(b, f)); };
/* istanbul ignore next */
var _traverse$3 = function (F) {
    var traverseF = traverse$3(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt$3 = function (fa, that) { return pipe(fa, alt$3(that)); };
/* istanbul ignore next */
var _reduceWithIndex$3 = function (fa, b, f) {
    return pipe(fa, reduceWithIndex$3(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex$3 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$3(M);
    return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex$3 = function (fa, b, f) {
    return pipe(fa, reduceRightWithIndex$3(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex$3 = function (F) {
    var traverseWithIndexF = traverseWithIndex$3(F);
    return function (ta, f) { return pipe(ta, traverseWithIndexF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Pointed
 * @since 2.5.0
 */
var of$3 = singleton;
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$3 = function (that) { return function (as) { return pipe(as, concatW$3(that())); }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
var alt$3 = altW$3;
/**
 * @category Apply
 * @since 2.5.0
 */
var ap$3 = function (as) { return chain$3(function (f) { return pipe(as, map$4(f)); }); };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.5.0
 */
var chain$3 = function (f) { return chainWithIndex$3(function (_, a) { return f(a); }); };
/**
 * @category Extend
 * @since 2.5.0
 */
var extend$3 = function (f) { return function (as) {
    var next = tail$3(as);
    var out = [f(as)];
    while (isNonEmpty$3(next)) {
        out.push(f(next));
        next = tail$3(next);
    }
    return out;
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
var duplicate$3 = 
/*#__PURE__*/
extend$3(identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten$3 = 
/*#__PURE__*/
chain$3(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.5.0
 */
var map$4 = function (f) {
    return mapWithIndex$3(function (_, a) { return f(a); });
};
/**
 * @category FunctorWithIndex
 * @since 2.5.0
 */
var mapWithIndex$3 = function (f) { return function (as) {
    var out = [f(0, head$3(as))];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i]));
    }
    return out;
}; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce$3 = function (b, f) {
    return reduceWithIndex$3(b, function (_, b, a) { return f(b, a); });
};
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category Foldable
 * @since 2.5.0
 */
var foldMap$3 = function (S) { return function (f) { return function (as) {
    return as.slice(1).reduce(function (s, a) { return S.concat(s, f(a)); }, f(as[0]));
}; }; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight$3 = function (b, f) {
    return reduceRightWithIndex$3(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceWithIndex$3 = function (b, f) { return function (as) {
    return as.reduce(function (b, a, i) { return f(i, b, a); }, b);
}; };
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var foldMapWithIndex$3 = function (S) { return function (f) { return function (as) { return as.slice(1).reduce(function (s, a, i) { return S.concat(s, f(i + 1, a)); }, f(0, as[0])); }; }; };
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceRightWithIndex$3 = function (b, f) { return function (as) { return as.reduceRight(function (b, a, i) { return f(i, a, b); }, b); }; };
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse$3 = function (F) {
    var traverseWithIndexF = traverseWithIndex$3(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence$3 = function (F) { return traverseWithIndex$3(F)(SK); };
/**
 * @category TraversableWithIndex
 * @since 2.6.3
 */
var traverseWithIndex$3 = function (F) { return function (f) { return function (as) {
    var out = F.map(f(0, head$3(as)), of$3);
    for (var i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, function (bs) { return function (b) { return pipe(bs, append$3(b)); }; }), f(i, as[i]));
    }
    return out;
}; }; };
/**
 * @category Comonad
 * @since 2.6.3
 */
var extract$1 = head$4;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.5.0
 */
var URI$4 = 'ReadonlyNonEmptyArray';
/**
 * @category instances
 * @since 2.5.0
 */
var getShow$3 = function (S) { return ({
    show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
}); };
/**
 * Builds a `Semigroup` instance for `ReadonlyNonEmptyArray`
 *
 * @category instances
 * @since 2.5.0
 */
var getSemigroup$3 = function () { return ({
    concat: concat$3
}); };
/**
 * @example
 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq$3 = function (E) {
    return fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
/**
 * @category combinators
 * @since 2.11.0
 */
var getUnionSemigroup$3 = function (E) {
    var unionE = union$3(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$4 = {
    URI: URI$4,
    map: _map$4
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$4 = 
/*#__PURE__*/
flap$5(Functor$4);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$3 = {
    URI: URI$4,
    of: of$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$3 = {
    URI: URI$4,
    map: _map$4,
    mapWithIndex: _mapWithIndex$3
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$3 = {
    URI: URI$4,
    map: _map$4,
    ap: _ap$3
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst$3 = 
/*#__PURE__*/
apFirst$4(Apply$3);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond$3 = 
/*#__PURE__*/
apSecond$4(Apply$3);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$3 = {
    URI: URI$4,
    map: _map$4,
    ap: _ap$3,
    of: of$3
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$3 = {
    URI: URI$4,
    map: _map$4,
    ap: _ap$3,
    chain: _chain$3
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var chainFirst$3 = 
/*#__PURE__*/
chainFirst$4(Chain$3);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$3 = {
    URI: URI$4,
    map: _map$4,
    ap: _ap$3,
    of: of$3,
    chain: _chain$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$3 = {
    URI: URI$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$3 = {
    URI: URI$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    reduceWithIndex: _reduceWithIndex$3,
    foldMapWithIndex: _foldMapWithIndex$3,
    reduceRightWithIndex: _reduceRightWithIndex$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$3 = {
    URI: URI$4,
    map: _map$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex$3 = {
    URI: URI$4,
    map: _map$4,
    mapWithIndex: _mapWithIndex$3,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$3,
    reduceWithIndex: _reduceWithIndex$3,
    foldMapWithIndex: _foldMapWithIndex$3,
    reduceRightWithIndex: _reduceRightWithIndex$3,
    traverseWithIndex: _traverseWithIndex$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$3 = {
    URI: URI$4,
    map: _map$4,
    alt: _alt$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Comonad$1 = {
    URI: URI$4,
    map: _map$4,
    extend: _extend$3,
    extract: extract$1
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$3 = 
/*#__PURE__*/
of$3(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$3 = 
/*#__PURE__*/
bindTo$4(Functor$4);
/**
 * @since 2.8.0
 */
var bind$3 = 
/*#__PURE__*/
bind$4(Chain$3);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$3 = 
/*#__PURE__*/
apS$4(Apply$3);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
var head$3 = extract$1;
/**
 * @since 2.5.0
 */
var tail$3 = tail$4;
/**
 * @since 2.5.0
 */
var last$3 = function (as) { return as[as.length - 1]; };
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.5.0
 */
var init$3 = function (as) { return as.slice(0, -1); };
/**
 * @since 2.5.0
 */
var min$1 = function (O) {
    var S = min$2(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.5.0
 */
var max$1 = function (O) {
    var S = max$2(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.10.0
 */
var concatAll$1 = function (S) { return function (as) { return as.reduce(S.concat); }; };
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchLeft$3 = function (f) { return function (as) {
    return f(head$3(as), tail$3(as));
}; };
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchRight$3 = function (f) { return function (as) {
    return f(init$3(as), last$3(as));
}; };
/**
 * Apply a function to the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyHead$1 = function (f) { return function (as) { return __spreadArray$2([
    f(head$3(as))
], tail$3(as)); }; };
/**
 * Change the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateHead$1 = function (a) { return modifyHead$1(function () { return a; }); };
/**
 * Apply a function to the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyLast$1 = function (f) { return function (as) {
    return pipe(init$3(as), append$3(f(last$3(as))));
}; };
/**
 * Change the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateLast$1 = function (a) { return modifyLast$1(function () { return a; }); };
function groupSort$1(O) {
    var sortO = sort$3(O);
    var groupO = group$1(O);
    return function (as) { return (isNonEmpty$3(as) ? groupO(sortO(as)) : empty$2); };
}
function filter$3(predicate) {
    return filterWithIndex$3(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./ReadonlyArray.ts.html#filterwithindex) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var filterWithIndex$3 = function (predicate) { return function (as) { return fromReadonlyArray(as.filter(function (a, i) { return predicate(i, a); })); }; };
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category destructors
 * @since 2.10.0
 * @deprecated
 */
var uncons$1 = unprepend$1;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category destructors
 * @since 2.10.0
 * @deprecated
 */
var unsnoc$1 = unappend$1;
function cons$3(head, tail) {
    return tail === undefined ? prepend$3(head) : pipe(tail, prepend$3(head));
}
/**
 * Use [`append`](./ReadonlyArray.ts.html#append) instead.
 *
 * @category constructors
 * @since 2.5.0
 * @deprecated
 */
var snoc$3 = function (init, end) { return pipe(init, concat$3([end])); };
/**
 * Use [`insertAt`](./ReadonlyArray.ts.html#insertat) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var insertAt$3 = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$2(unsafeInsertAt$3(i, a, as));
}; };
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll$3 = prependAll$3;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
var fold$1 = concatAll$1;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.5.0
 * @deprecated
 */
var readonlyNonEmptyArray = {
    URI: URI$4,
    of: of$3,
    map: _map$4,
    mapWithIndex: _mapWithIndex$3,
    ap: _ap$3,
    chain: _chain$3,
    extend: _extend$3,
    extract: extract$1,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$3,
    reduceWithIndex: _reduceWithIndex$3,
    foldMapWithIndex: _foldMapWithIndex$3,
    reduceRightWithIndex: _reduceRightWithIndex$3,
    traverseWithIndex: _traverseWithIndex$3,
    alt: _alt$3
};

var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var isNonEmpty$2 = function (as) { return as.length > 0; };
/**
 * @internal
 */
var isOutOfBound$2 = function (i, as) { return i < 0 || i >= as.length; };
/**
 * @internal
 */
var prependW$2 = function (head) { return function (tail) { return __spreadArray$1([head], tail); }; };
/**
 * @internal
 */
var prepend$2 = prependW$2;
/**
 * @internal
 */
var appendW$2 = function (end) { return function (init) { return __spreadArray$1(__spreadArray$1([], init), [end]); }; };
/**
 * @internal
 */
var append$2 = appendW$2;
/**
 * @internal
 */
var unsafeInsertAt$2 = function (i, a, as) {
    if (isNonEmpty$2(as)) {
        var xs = fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
var unsafeUpdateAt$2 = function (i, a, as) {
    var xs = fromReadonlyNonEmptyArray(as);
    xs[i] = a;
    return xs;
};
/**
 * Remove duplicates from a `NonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var uniq$2 = function (E) { return function (as) {
    if (as.length === 1) {
        return copy$1(as);
    }
    var out = [head$2(as)];
    var rest = tail$2(as);
    var _loop_1 = function (a) {
        if (out.every(function (o) { return !E.equals(o, a); })) {
            out.push(a);
        }
    };
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var a = rest_1[_i];
        _loop_1(a);
    }
    return out;
}; };
/**
 * Sort the elements of a `NonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = NEA.sortBy([byName, byAge])
 *
 * const persons: NEA.NonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.11.0
 */
var sortBy$2 = function (ords) {
    if (isNonEmpty$2(ords)) {
        var M = getMonoid$2();
        return sort$2(ords.reduce(M.concat, M.empty));
    }
    return copy$1;
};
/**
 * @category combinators
 * @since 2.11.0
 */
var union$2 = function (E) {
    var uniqE = uniq$2(E);
    return function (second) { return function (first) { return uniqE(pipe(first, concat$2(second))); }; };
};
/**
 * Rotate a `NonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @category combinators
 * @since 2.11.0
 */
var rotate$2 = function (n) { return function (as) {
    var len = as.length;
    var m = Math.round(n) % len;
    if (isOutOfBound$2(Math.abs(m), as) || m === 0) {
        return copy$1(as);
    }
    if (m < 0) {
        var _a = splitAt$2(-m)(as), f = _a[0], s = _a[1];
        return pipe(s, concat$2(f));
    }
    else {
        return rotate$2(m - len)(as);
    }
}; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray$1;
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @category constructors
 * @since 2.0.0
 */
var fromArray$1 = function (as) { return (isNonEmpty$2(as) ? some$2(as) : none); };
/**
 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
var makeBy$2 = function (f) { return function (n) {
    var j = Math.max(0, Math.floor(n));
    var out = [f(0)];
    for (var i = 1; i < j; i++) {
        out.push(f(i));
    }
    return out;
}; };
/**
 * Create a `NonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/NonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
var replicate$2 = function (a) { return makeBy$2(function () { return a; }); };
/**
 * Create a `NonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
var range$2 = function (start, end) {
    return start <= end ? makeBy$2(function (i) { return start + i; })(end - start + 1) : [start];
};
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3]), [1, [2, 3]])
 *
 * @category destructors
 * @since 2.9.0
 */
var unprepend = function (as) { return [head$2(as), tail$2(as)]; };
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @category destructors
 * @since 2.9.0
 */
var unappend = function (as) { return [init$2(as), last$2(as)]; };
function concatW$2(second) {
    return function (first) { return first.concat(second); };
}
function concat$2(x, y) {
    return y ? x.concat(y) : function (y) { return y.concat(x); };
}
/**
 * @category combinators
 * @since 2.0.0
 */
var reverse$2 = function (as) { return __spreadArray$1([last$2(as)], as.slice(0, -1).reverse()); };
function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return [];
        }
        var out = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @category combinators
 * @since 2.0.0
 */
var groupBy = function (f) { return function (as) {
    var out = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (out.hasOwnProperty(k)) {
            out[k].push(a);
        }
        else {
            out[k] = [a];
        }
    }
    return out;
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var sort$2 = function (O) { return function (as) {
    return as.slice().sort(O.compare);
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var insertAt$2 = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$2(unsafeInsertAt$2(i, a, as));
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var updateAt$2 = function (i, a) {
    return modifyAt$2(i, function () { return a; });
};
/**
 * @category combinators
 * @since 2.0.0
 */
var modifyAt$2 = function (i, f) { return function (as) {
    return isOutOfBound$2(i, as) ? none : some$2(unsafeUpdateAt$2(i, f(as[i]), as));
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var copy$1 = fromReadonlyNonEmptyArray;
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$2 = function (a) { return [a]; };
/**
 * @category combinators
 * @since 2.5.1
 */
var zipWith$2 = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
function zip$2(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip$2(bs, as); };
    }
    return zipWith$2(as, bs, function (a, b) { return [a, b]; });
}
/**
 * @category combinators
 * @since 2.5.1
 */
var unzip$2 = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll$2 = function (middle) { return function (as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
        out.push(middle, as[i]);
    }
    return out;
}; };
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse$2 = function (middle) { return function (as) {
    var rest = tail$2(as);
    return isNonEmpty$2(rest) ? pipe(rest, prependAll$2(middle), prepend$2(head$2(as))) : copy$1(as);
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var foldMapWithIndex$2 = foldMapWithIndex$3;
/**
 * @category combinators
 * @since 2.0.0
 */
var foldMap$2 = foldMap$3;
/**
 * @category combinators
 * @since 2.10.0
 */
var chainWithIndex$2 = function (f) { return function (as) {
    var out = fromReadonlyNonEmptyArray(f(0, head$2(as)));
    for (var i = 1; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var chop$2 = function (f) { return function (as) {
    var _a = f(as), b = _a[0], rest = _a[1];
    var out = [b];
    var next = rest;
    while (isNonEmpty$2(next)) {
        var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
        out.push(b_1);
        next = rest_2;
    }
    return out;
}; };
/**
 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category combinators
 * @since 2.10.0
 */
var splitAt$2 = function (n) { return function (as) {
    var m = Math.max(1, n);
    return m >= as.length ? [copy$1(as), []] : [pipe(as.slice(1, m), prepend$2(head$2(as))), as.slice(m)];
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var chunksOf$2 = function (n) { return chop$2(splitAt$2(n)); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map$3 = function (fa, f) { return pipe(fa, map$3(f)); };
/* istanbul ignore next */
var _mapWithIndex$2 = function (fa, f) { return pipe(fa, mapWithIndex$2(f)); };
/* istanbul ignore next */
var _ap$2 = function (fab, fa) { return pipe(fab, ap$2(fa)); };
/* istanbul ignore next */
var _chain$2 = function (ma, f) { return pipe(ma, chain$2(f)); };
/* istanbul ignore next */
var _extend$2 = function (wa, f) { return pipe(wa, extend$2(f)); };
/* istanbul ignore next */
var _reduce$2 = function (fa, b, f) { return pipe(fa, reduce$2(b, f)); };
/* istanbul ignore next */
var _foldMap$2 = function (M) {
    var foldMapM = foldMap$2(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight$2 = function (fa, b, f) { return pipe(fa, reduceRight$2(b, f)); };
/* istanbul ignore next */
var _traverse$2 = function (F) {
    var traverseF = traverse$2(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt$2 = function (fa, that) { return pipe(fa, alt$2(that)); };
/* istanbul ignore next */
var _reduceWithIndex$2 = function (fa, b, f) {
    return pipe(fa, reduceWithIndex$2(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex$2 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$2(M);
    return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex$2 = function (fa, b, f) {
    return pipe(fa, reduceRightWithIndex$2(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex$2 = function (F) {
    var traverseWithIndexF = traverseWithIndex$2(F);
    return function (ta, f) { return pipe(ta, traverseWithIndexF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$2 = function (that) { return function (as) {
    return pipe(as, concatW$2(that()));
}; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
var alt$2 = altW$2;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap$2 = function (as) {
    return chain$2(function (f) { return pipe(as, map$3(f)); });
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain$2 = function (f) {
    return chainWithIndex$2(function (_, a) { return f(a); });
};
/**
 * @category Extend
 * @since 2.0.0
 */
var extend$2 = function (f) { return function (as) {
    var next = tail$2(as);
    var out = [f(as)];
    while (isNonEmpty$2(next)) {
        out.push(f(next));
        next = tail$2(next);
    }
    return out;
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
var duplicate$2 = 
/*#__PURE__*/
extend$2(identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten$2 = 
/*#__PURE__*/
chain$2(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$3 = function (f) { return mapWithIndex$2(function (_, a) { return f(a); }); };
/**
 * @category FunctorWithIndex
 * @since 2.0.0
 */
var mapWithIndex$2 = function (f) { return function (as) {
    var out = [f(0, head$2(as))];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i]));
    }
    return out;
}; };
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce$2 = reduce$3;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceWithIndex$2 = reduceWithIndex$3;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight$2 = reduceRight$3;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceRightWithIndex$2 = reduceRightWithIndex$3;
/**
 * @since 2.6.3
 */
var traverse$2 = function (F) {
    var traverseWithIndexF = traverseWithIndex$2(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @since 2.6.3
 */
var sequence$2 = function (F) { return traverseWithIndex$2(F)(function (_, a) { return a; }); };
/**
 * @since 2.6.3
 */
var traverseWithIndex$2 = function (F) { return function (f) { return function (as) {
    var out = F.map(f(0, head$2(as)), of$2);
    for (var i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, function (bs) { return function (b) { return pipe(bs, append$2(b)); }; }), f(i, as[i]));
    }
    return out;
}; }; };
/**
 * @since 2.7.0
 */
var extract = head$3;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$3 = 'NonEmptyArray';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$2 = getShow$3;
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup$2 = function () { return ({
    concat: concat$2
}); };
/**
 * @example
 * import { getEq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq$2 = getEq$3;
/**
 * @category combinators
 * @since 2.11.0
 */
var getUnionSemigroup$2 = function (E) {
    var unionE = union$2(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$3 = {
    URI: URI$3,
    map: _map$3
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$3 = 
/*#__PURE__*/
flap$5(Functor$3);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$2 = {
    URI: URI$3,
    of: of$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$2 = {
    URI: URI$3,
    map: _map$3,
    mapWithIndex: _mapWithIndex$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$2 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$2
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst$2 = 
/*#__PURE__*/
apFirst$4(Apply$2);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond$2 = 
/*#__PURE__*/
apSecond$4(Apply$2);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$2 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$2,
    of: of$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$2 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$2,
    chain: _chain$2
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var chainFirst$2 = 
/*#__PURE__*/
chainFirst$4(Chain$2);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$2 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$2,
    of: of$2,
    chain: _chain$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$2 = {
    URI: URI$3,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$2 = {
    URI: URI$3,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$2 = {
    URI: URI$3,
    map: _map$3,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    traverse: _traverse$2,
    sequence: sequence$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex$2 = {
    URI: URI$3,
    map: _map$3,
    mapWithIndex: _mapWithIndex$2,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    traverse: _traverse$2,
    sequence: sequence$2,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2,
    traverseWithIndex: _traverseWithIndex$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$2 = {
    URI: URI$3,
    map: _map$3,
    alt: _alt$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Comonad = {
    URI: URI$3,
    map: _map$3,
    extend: _extend$2,
    extract: extract
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$2 = 
/*#__PURE__*/
of$2(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$2 = 
/*#__PURE__*/
bindTo$4(Functor$3);
/**
 * @since 2.8.0
 */
var bind$2 = 
/*#__PURE__*/
bind$4(Chain$2);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$2 = 
/*#__PURE__*/
apS$4(Apply$2);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
var head$2 = head$3;
/**
 * @since 2.0.0
 */
var tail$2 = function (as) { return as.slice(1); };
/**
 * @since 2.0.0
 */
var last$2 = last$3;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.2.0
 */
var init$2 = function (as) { return as.slice(0, -1); };
/**
 * @since 2.0.0
 */
var min = min$1;
/**
 * @since 2.0.0
 */
var max = max$1;
/**
 * @since 2.10.0
 */
var concatAll = function (S) { return function (as) { return as.reduce(S.concat); }; };
/**
 * Break an `Array` into its first element and remaining elements.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchLeft$2 = function (f) { return function (as) { return f(head$2(as), tail$2(as)); }; };
/**
 * Break an `Array` into its initial elements and the last element.
 *
 * @category destructors
 * @since 2.11.0
 */
var matchRight$2 = function (f) { return function (as) {
    return f(init$2(as), last$2(as));
}; };
/**
 * Apply a function to the head, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyHead = function (f) { return function (as) { return __spreadArray$1([
    f(head$2(as))
], tail$2(as)); }; };
/**
 * Change the head, creating a new `NonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateHead = function (a) { return modifyHead(function () { return a; }); };
/**
 * Apply a function to the last element, creating a new `NonEmptyArray`.
 *
 * @since 2.11.0
 */
var modifyLast = function (f) { return function (as) {
    return pipe(init$2(as), append$2(f(last$2(as))));
}; };
/**
 * Change the last element, creating a new `NonEmptyArray`.
 *
 * @category combinators
 * @since 2.11.0
 */
var updateLast = function (a) { return modifyLast(function () { return a; }); };
function groupSort(O) {
    var sortO = sort$2(O);
    var groupO = group(O);
    return function (as) { return (isNonEmpty$2(as) ? groupO(sortO(as)) : []); };
}
function filter$2(predicate) {
    return filterWithIndex$2(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./Array.ts.html#filterwithindex) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var filterWithIndex$2 = function (predicate) { return function (as) { return fromArray$1(as.filter(function (a, i) { return predicate(i, a); })); }; };
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category destructors
 * @since 2.9.0
 * @deprecated
 */
var uncons = unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category destructors
 * @since 2.9.0
 * @deprecated
 */
var unsnoc = unappend;
function cons$2(head, tail) {
    return tail === undefined ? prepend$2(head) : pipe(tail, prepend$2(head));
}
/**
 * Use [`append`](./Array.ts.html#append) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var snoc$2 = function (init, end) { return pipe(init, append$2(end)); };
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll$2 = prependAll$2;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
var fold = concatAll$1;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var nonEmptyArray = {
    URI: URI$3,
    of: of$2,
    map: _map$3,
    mapWithIndex: _mapWithIndex$2,
    ap: _ap$2,
    chain: _chain$2,
    extend: _extend$2,
    extract: extract,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    traverse: _traverse$2,
    sequence: sequence$2,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2,
    traverseWithIndex: _traverseWithIndex$2,
    alt: _alt$2
};

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * @category refinements
 * @since 2.11.0
 */
var isNumber = function (u) { return typeof u === 'number'; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var Eq = {
    equals: function (first, second) { return first === second; }
};
/**
 * @category instances
 * @since 2.10.0
 */
var Ord = {
    equals: Eq.equals,
    compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
};
/**
 * @category instances
 * @since 2.10.0
 */
var Bounded = {
    equals: Eq.equals,
    compare: Ord.compare,
    top: Infinity,
    bottom: -Infinity
};
/**
 * @category instances
 * @since 2.10.0
 */
var Show = {
    show: function (n) { return JSON.stringify(n); }
};
/**
 * @category instances
 * @since 2.11.0
 */
var MagmaSub = {
    concat: function (first, second) { return first - second; }
};
/**
 * `number` semigroup under addition.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupSum.concat(2, 3), 5)
 *
 * @category instances
 * @since 2.10.0
 */
var SemigroupSum = {
    concat: function (first, second) { return first + second; }
};
/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import { SemigroupProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupProduct.concat(2, 3), 6)
 *
 * @category instances
 * @since 2.10.0
 */
var SemigroupProduct = {
    concat: function (first, second) { return first * second; }
};
/**
 * `number` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @example
 * import { MonoidSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidSum.concat(2, MonoidSum.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
var MonoidSum = {
    concat: SemigroupSum.concat,
    empty: 0
};
/**
 * `number` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @example
 * import { MonoidProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidProduct.concat(2, MonoidProduct.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
var MonoidProduct = {
    concat: SemigroupProduct.concat,
    empty: 1
};
/**
 * @category instances
 * @since 2.10.0
 */
var Field = {
    add: SemigroupSum.concat,
    zero: 0,
    mul: SemigroupProduct.concat,
    one: 1,
    sub: MagmaSub.concat,
    degree: function (_) { return 1; },
    div: function (first, second) { return first / second; },
    mod: function (first, second) { return first % second; }
};

/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var separated = function (left, right) { return ({ left: left, right: right }); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$2 = function (fa, f) { return pipe(fa, map$2(f)); };
var _mapLeft = function (fa, f) { return pipe(fa, mapLeft(f)); };
var _bimap = function (fa, g, f) { return pipe(fa, bimap(g, f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.10.0
 */
var map$2 = function (f) { return function (fa) {
    return separated(left(fa), f(right(fa)));
}; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
var mapLeft = function (f) { return function (fa) {
    return separated(f(left(fa)), right(fa));
}; };
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
var bimap = function (f, g) { return function (fa) {
    return separated(f(left(fa)), g(right(fa)));
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var URI$2 = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
var Bifunctor = {
    URI: URI$2,
    mapLeft: _mapLeft,
    bimap: _bimap
};
/**
 * @category instances
 * @since 2.10.0
 */
var Functor$2 = {
    URI: URI$2,
    map: _map$2
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$2 = 
/*#__PURE__*/
flap$5(Functor$2);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var left = function (s) { return s.left; };
/**
 * @since 2.10.0
 */
var right = function (s) { return s.right; };

function wiltDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.separate); };
    };
}
function witherDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.compact); };
    };
}
function filterE$2(W) {
    return function (F) {
        var witherF = W.wither(F);
        return function (predicate) { return function (ga) { return witherF(ga, function (a) { return F.map(predicate(a), function (b) { return (b ? some$2(a) : none); }); }); }; };
    };
}

function guard$2(F, P) {
    return function (b) { return (b ? P.of(undefined) : F.zero()); };
}

var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @example
 * import { isEmpty } from 'fp-ts/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @category refinements
 * @since 2.5.0
 */
var isEmpty$1 = function (as) { return as.length === 0; };
/**
 * Test whether a `ReadonlyArray` is non empty.
 *
 * @category refinements
 * @since 2.5.0
 */
var isNonEmpty$1 = isNonEmpty$3;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var prepend$1 = prepend$3;
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @category constructors
 * @since 2.11.0
 */
var prependW$1 = prependW$3;
/**
 * Append an element to the end of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var append$1 = append$3;
/**
 * Less strict version of [`append`](#append).
 *
 * @category constructors
 * @since 2.11.0
 */
var appendW$1 = appendW$3;
/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyArray'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.5.0
 */
var makeBy$1 = function (n, f) { return (n <= 0 ? empty$1 : makeBy$3(f)(n)); };
/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.5.0
 */
var replicate$1 = function (n, a) { return makeBy$1(n, function () { return a; }); };
function fromPredicate$1(predicate) {
    return function (a) { return (predicate(a) ? [a] : empty$1); };
}
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromOption$1 = function (ma) { return (isNone(ma) ? empty$1 : [ma.value]); };
/**
 * Transforms an `Either` to a `ReadonlyArray`.
 *
 * @category natural transformations
 * @since 2.11.0
 */
var fromEither$1 = function (e) { return (isLeft(e) ? empty$1 : [e.right]); };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchW$1 = function (onEmpty, onNonEmpty) { return function (as) { return (isNonEmpty$1(as) ? onNonEmpty(as) : onEmpty()); }; };
/**
 * @category destructors
 * @since 2.11.0
 */
var match$1 = matchW$1;
/**
 * Less strict version of [`matchLeft`](#matchleft).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchLeftW$1 = function (onEmpty, onNonEmpty) { return function (as) { return (isNonEmpty$1(as) ? onNonEmpty(head$3(as), tail$3(as)) : onEmpty()); }; };
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/ReadonlyArray'
 *
 * const len: <A>(as: ReadonlyArray<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category destructors
 * @since 2.10.0
 */
var matchLeft$1 = matchLeftW$1;
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category destructors
 * @since 2.5.0
 */
var foldLeft$1 = matchLeft$1;
/**
 * Less strict version of [`matchRight`](#matchright).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchRightW$1 = function (onEmpty, onNonEmpty) { return function (as) { return (isNonEmpty$1(as) ? onNonEmpty(init$3(as), last$3(as)) : onEmpty()); }; };
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category destructors
 * @since 2.10.0
 */
var matchRight$1 = matchRightW$1;
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category destructors
 * @since 2.5.0
 */
var foldRight$1 = matchRight$1;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.7.0
 */
var chainWithIndex$1 = function (f) { return function (as) {
    if (isEmpty$1(as)) {
        return empty$1;
    }
    var out = [];
    for (var i = 0; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * Same as `reduce` but it carries over the intermediate steps.
 *
 * @example
 * import { scanLeft } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @category combinators
 * @since 2.5.0
 */
var scanLeft$1 = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[0] = b;
    for (var i = 0; i < len; i++) {
        out[i + 1] = f(out[i], as[i]);
    }
    return out;
}; };
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @category combinators
 * @since 2.5.0
 */
var scanRight$1 = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[len] = b;
    for (var i = len - 1; i >= 0; i--) {
        out[i] = f(as[i], out[i + 1]);
    }
    return out;
}; };
/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @since 2.10.0
 */
var size$1 = function (as) { return as.length; };
/**
 * Test whether an array contains a particular index
 *
 * @since 2.5.0
 */
var isOutOfBound$1 = isOutOfBound$3;
function lookup$1(i, as) {
    return as === undefined ? function (as) { return lookup$1(i, as); } : isOutOfBound$1(i, as) ? none : some$2(as[i]);
}
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.5.0
 */
var head$1 = function (as) { return (isNonEmpty$1(as) ? some$2(head$3(as)) : none); };
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.5.0
 */
var last$1 = function (as) { return (isNonEmpty$1(as) ? some$2(last$3(as)) : none); };
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.5.0
 */
var tail$1 = function (as) {
    return isNonEmpty$1(as) ? some$2(tail$3(as)) : none;
};
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.5.0
 */
var init$1 = function (as) {
    return isNonEmpty$1(as) ? some$2(init$3(as)) : none;
};
/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeLeft(2)), [1, 2])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeLeft(4)), input)
 * assert.strictEqual(pipe(input, RA.takeLeft(-1)), input)
 *
 * @category combinators
 * @since 2.5.0
 */
var takeLeft$1 = function (n) { return function (as) {
    return isOutOfBound$1(n, as) ? as : n === 0 ? empty$1 : as.slice(0, n);
}; };
/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
 *
 * @category combinators
 * @since 2.5.0
 */
var takeRight$1 = function (n) { return function (as) {
    return isOutOfBound$1(n, as) ? as : n === 0 ? empty$1 : as.slice(-n);
}; };
function takeLeftWhile$1(predicate) {
    return function (as) {
        var out = [];
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        var len = out.length;
        return len === as.length ? as : len === 0 ? empty$1 : out;
    };
}
var spanLeftIndex$1 = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function spanLeft$1(predicate) {
    return function (as) {
        var _a = splitAt$1(spanLeftIndex$1(as, predicate))(as), init = _a[0], rest = _a[1];
        return { init: init, rest: rest };
    };
}
/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropLeft(2)), [3])
 * assert.strictEqual(pipe(input, RA.dropLeft(0)), input)
 * assert.strictEqual(pipe(input, RA.dropLeft(-1)), input)
 *
 * @category combinators
 * @since 2.5.0
 */
var dropLeft$1 = function (n) { return function (as) {
    return n <= 0 || isEmpty$1(as) ? as : n >= as.length ? empty$1 : as.slice(n, as.length);
}; };
/**
 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
 *
 * @category combinators
 * @since 2.5.0
 */
var dropRight$1 = function (n) { return function (as) {
    return n <= 0 || isEmpty$1(as) ? as : n >= as.length ? empty$1 : as.slice(0, as.length - n);
}; };
function dropLeftWhile$1(predicate) {
    return function (as) {
        var i = spanLeftIndex$1(as, predicate);
        return i === 0 ? as : i === as.length ? empty$1 : as.slice(i);
    };
}
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.5.0
 */
var findIndex$1 = function (predicate) { return function (as) {
    for (var i = 0; i < as.length; i++) {
        if (predicate(as[i])) {
            return some$2(i);
        }
    }
    return none;
}; };
function findFirst$1(predicate) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return some$2(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.5.0
 */
var findFirstMap$1 = function (f) { return function (as) {
    for (var i = 0; i < as.length; i++) {
        var out = f(as[i]);
        if (isSome(out)) {
            return out;
        }
    }
    return none;
}; };
function findLast$1(predicate) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return some$2(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.5.0
 */
var findLastMap$1 = function (f) { return function (as) {
    for (var i = as.length - 1; i >= 0; i--) {
        var out = f(as[i]);
        if (isSome(out)) {
            return out;
        }
    }
    return none;
}; };
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.5.0
 */
var findLastIndex$1 = function (predicate) { return function (as) {
    for (var i = as.length - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return some$2(i);
        }
    }
    return none;
}; };
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.5.0
 */
var insertAt$1 = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$2(unsafeInsertAt$3(i, a, as));
}; };
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.5.0
 */
var updateAt$1 = function (i, a) {
    return modifyAt$1(i, function () { return a; });
};
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.5.0
 */
var deleteAt$1 = function (i) { return function (as) {
    return isOutOfBound$1(i, as) ? none : some$2(unsafeDeleteAt$1(i, as));
}; };
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.5.0
 */
var modifyAt$1 = function (i, f) { return function (as) {
    return isOutOfBound$1(i, as) ? none : some$2(unsafeUpdateAt$1(i, f(as[i]), as));
}; };
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @category combinators
 * @since 2.5.0
 */
var reverse$1 = function (as) { return (as.length <= 1 ? as : as.slice().reverse()); };
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/ReadonlyArray'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @category combinators
 * @since 2.5.0
 */
var rights$1 = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/ReadonlyArray'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @category combinators
 * @since 2.5.0
 */
var lefts$1 = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @category combinators
 * @since 2.5.0
 */
var sort$1 = function (O) { return function (as) {
    return as.length <= 1 ? as : as.slice().sort(O.compare);
}; };
// TODO: curry and make data-last in v3
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @category combinators
 * @since 2.5.0
 */
var zipWith$1 = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
function zip$1(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip$1(bs, as); };
    }
    return zipWith$1(as, bs, function (a, b) { return [a, b]; });
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @category combinators
 * @since 2.5.0
 */
var unzip$1 = function (as) {
    var fa = [];
    var fb = [];
    for (var i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll$1 = function (middle) {
    var f = prependAll$3(middle);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : as); };
};
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse$1 = function (middle) {
    var f = intersperse$3(middle);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : as); };
};
/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @category combinators
 * @since 2.5.0
 */
var rotate$1 = function (n) {
    var f = rotate$3(n);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : as); };
};
function elem$1(E) {
    return function (a, as) {
        if (as === undefined) {
            var elemE_1 = elem$1(E);
            return function (as) { return elemE_1(a, as); };
        }
        var predicate = function (element) { return E.equals(element, a); };
        var i = 0;
        for (; i < as.length; i++) {
            if (predicate(as[i])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.5.0
 */
var uniq$1 = function (E) {
    var f = uniq$3(E);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : as); };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/ReadonlyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.5.0
 */
var sortBy$1 = function (ords) {
    var f = sortBy$3(ords);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : as); };
};
/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the tail of the `ReadonlyArray`.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
 *   return RA.chop(as => {
 *     const { init, rest } = pipe(as, RA.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @category combinators
 * @since 2.5.0
 */
var chop$1 = function (f) {
    var g = chop$3(f);
    return function (as) { return (isNonEmpty$1(as) ? g(as) : empty$1); };
};
/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @category combinators
 * @since 2.5.0
 */
var splitAt$1 = function (n) { return function (as) {
    return n >= 1 && isNonEmpty$1(as) ? splitAt$3(n)(as) : isEmpty$1(as) ? [as, empty$1] : [empty$1, as];
}; };
/**
 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that:
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `as`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @category combinators
 * @since 2.5.0
 */
var chunksOf$1 = function (n) {
    var f = chunksOf$3(n);
    return function (as) { return (isNonEmpty$1(as) ? f(as) : empty$1); };
};
/**
 * @category combinators
 * @since 2.11.0
 */
var fromOptionK$1 = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return fromOption$1(f.apply(void 0, a));
}; };
function comprehension$1(input, f, g) {
    if (g === void 0) { g = function () { return true; }; }
    var go = function (scope, input) {
        return isNonEmpty$1(input)
            ? pipe(head$3(input), chain$1(function (x) { return go(pipe(scope, append$1(x)), tail$3(input)); }))
            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
                : empty$1;
    };
    return go(empty$1, input);
}
/**
 * @category combinators
 * @since 2.11.0
 */
var concatW$1 = function (second) { return function (first) {
    return isEmpty$1(first) ? second : isEmpty$1(second) ? first : first.concat(second);
}; };
/**
 * @category combinators
 * @since 2.11.0
 */
var concat$1 = concatW$1;
function union$1(E) {
    var unionE = union$3(E);
    return function (first, second) {
        if (second === undefined) {
            var unionE_1 = union$1(E);
            return function (second) { return unionE_1(second, first); };
        }
        return isNonEmpty$1(first) && isNonEmpty$1(second) ? unionE(second)(first) : isNonEmpty$1(first) ? first : second;
    };
}
function intersection$1(E) {
    var elemE = elem$1(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var intersectionE_1 = intersection$1(E);
            return function (ys) { return intersectionE_1(ys, xs); };
        }
        return xs.filter(function (a) { return elemE(a, ys); });
    };
}
function difference$1(E) {
    var elemE = elem$1(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var differenceE_1 = difference$1(E);
            return function (ys) { return differenceE_1(ys, xs); };
        }
        return xs.filter(function (a) { return !elemE(a, ys); });
    };
}
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$1 = function (fa, f) { return pipe(fa, map$1(f)); };
var _mapWithIndex$1 = function (fa, f) { return pipe(fa, mapWithIndex$1(f)); };
var _ap$1 = function (fab, fa) { return pipe(fab, ap$1(fa)); };
var _chain$1 = function (ma, f) { return pipe(ma, chain$1(f)); };
var _filter$1 = function (fa, predicate) {
    return pipe(fa, filter$1(predicate));
};
var _filterMap$1 = function (fa, f) { return pipe(fa, filterMap$1(f)); };
var _partition$1 = function (fa, predicate) {
    return pipe(fa, partition$1(predicate));
};
var _partitionMap$1 = function (fa, f) { return pipe(fa, partitionMap$1(f)); };
var _partitionWithIndex$1 = function (fa, predicateWithIndex) { return pipe(fa, partitionWithIndex$1(predicateWithIndex)); };
var _partitionMapWithIndex$1 = function (fa, f) { return pipe(fa, partitionMapWithIndex$1(f)); };
var _alt$1 = function (fa, that) { return pipe(fa, alt$1(that)); };
var _reduce$1 = function (fa, b, f) { return pipe(fa, reduce$1(b, f)); };
var _foldMap$1 = function (M) {
    var foldMapM = foldMap$1(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
var _reduceRight$1 = function (fa, b, f) { return pipe(fa, reduceRight$1(b, f)); };
var _reduceWithIndex$1 = function (fa, b, f) {
    return pipe(fa, reduceWithIndex$1(b, f));
};
var _foldMapWithIndex$1 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$1(M);
    return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
};
var _reduceRightWithIndex$1 = function (fa, b, f) {
    return pipe(fa, reduceRightWithIndex$1(b, f));
};
var _filterMapWithIndex$1 = function (fa, f) { return pipe(fa, filterMapWithIndex$1(f)); };
var _filterWithIndex$1 = function (fa, predicateWithIndex) { return pipe(fa, filterWithIndex$1(predicateWithIndex)); };
var _extend$1 = function (fa, f) { return pipe(fa, extend$1(f)); };
var _traverse$1 = function (F) {
    var traverseF = traverse$1(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _traverseWithIndex$1 = function (F) {
    var traverseWithIndexF = traverseWithIndex$1(F);
    return function (ta, f) { return pipe(ta, traverseWithIndexF(f)); };
};
/** @internal */
var _chainRecDepthFirst$1 = function (a, f) { return pipe(a, chainRecDepthFirst$1(f)); };
/** @internal */
var _chainRecBreadthFirst$1 = function (a, f) { return pipe(a, chainRecBreadthFirst$1(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Pointed
 * @since 2.5.0
 */
var of$1 = of$3;
/**
 * @category Zero
 * @since 2.7.0
 */
var zero$1 = function () { return empty$1; };
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$1 = function (that) { return function (fa) {
    return fa.concat(that());
}; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.5.0
 */
var alt$1 = altW$1;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.5.0
 */
var ap$1 = function (fa) {
    return chain$1(function (f) { return pipe(fa, map$1(f)); });
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.5.0
 */
var chain$1 = function (f) { return function (ma) {
    return pipe(ma, chainWithIndex$1(function (_, a) { return f(a); }));
}; };
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten$1 = 
/*#__PURE__*/
chain$1(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.5.0
 */
var map$1 = function (f) { return function (fa) {
    return fa.map(function (a) { return f(a); });
}; };
/**
 * @category FunctorWithIndex
 * @since 2.5.0
 */
var mapWithIndex$1 = function (f) { return function (fa) { return fa.map(function (a, i) { return f(i, a); }); }; };
/**
 * @category Compactable
 * @since 2.5.0
 */
var separate$1 = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
};
/**
 * @category Filterable
 * @since 2.5.0
 */
var filter$1 = function (predicate) { return function (as) { return as.filter(predicate); }; };
/**
 * @category FilterableWithIndex
 * @since 2.5.0
 */
var filterMapWithIndex$1 = function (f) { return function (fa) {
    var out = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (isSome(optionB)) {
            out.push(optionB.value);
        }
    }
    return out;
}; };
/**
 * @category Filterable
 * @since 2.5.0
 */
var filterMap$1 = function (f) {
    return filterMapWithIndex$1(function (_, a) { return f(a); });
};
/**
 * @category Compactable
 * @since 2.5.0
 */
var compact$1 = 
/*#__PURE__*/
filterMap$1(identity);
/**
 * @category Filterable
 * @since 2.5.0
 */
var partition$1 = function (predicate) {
    return partitionWithIndex$1(function (_, a) { return predicate(a); });
};
/**
 * @category FilterableWithIndex
 * @since 2.5.0
 */
var partitionWithIndex$1 = function (predicateWithIndex) { return function (as) {
    var left = [];
    var right = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (predicateWithIndex(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return separated(left, right);
}; };
/**
 * @category Filterable
 * @since 2.5.0
 */
var partitionMap$1 = function (f) {
    return partitionMapWithIndex$1(function (_, a) { return f(a); });
};
/**
 * @category FilterableWithIndex
 * @since 2.5.0
 */
var partitionMapWithIndex$1 = function (f) { return function (fa) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
}; };
/**
 * @category FilterableWithIndex
 * @since 2.5.0
 */
var filterWithIndex$1 = function (predicateWithIndex) { return function (as) {
    return as.filter(function (a, i) { return predicateWithIndex(i, a); });
}; };
/**
 * @category Extend
 * @since 2.5.0
 */
var extend$1 = function (f) { return function (wa) { return wa.map(function (_, i) { return f(wa.slice(i)); }); }; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
var duplicate$1 = 
/*#__PURE__*/
extend$1(identity);
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var foldMapWithIndex$1 = function (M) { return function (f) { return function (fa) {
    return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
}; }; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce$1 = function (b, f) {
    return reduceWithIndex$1(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var foldMap$1 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$1(M);
    return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceWithIndex$1 = function (b, f) { return function (fa) {
    var len = fa.length;
    var out = b;
    for (var i = 0; i < len; i++) {
        out = f(i, out, fa[i]);
    }
    return out;
}; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight$1 = function (b, f) {
    return reduceRightWithIndex$1(b, function (_, a, b) { return f(a, b); });
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceRightWithIndex$1 = function (b, f) { return function (fa) { return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b); }; };
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse$1 = function (F) {
    var traverseWithIndexF = traverseWithIndex$1(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence$1 = function (F) { return function (ta) {
    return _reduce$1(ta, F.of(zero$1()), function (fas, fa) {
        return F.ap(F.map(fas, function (as) { return function (a) { return pipe(as, append$1(a)); }; }), fa);
    });
}; };
/**
 * @category TraversableWithIndex
 * @since 2.6.3
 */
var traverseWithIndex$1 = function (F) { return function (f) {
    return reduceWithIndex$1(F.of(zero$1()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return pipe(bs, append$1(b)); }; }), f(i, a));
    });
}; };
/**
 * @category Witherable
 * @since 2.6.5
 */
var wither$1 = function (F) {
    var _witherF = _wither$1(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
/**
 * @category Witherable
 * @since 2.6.5
 */
var wilt$1 = function (F) {
    var _wiltF = _wilt$1(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
/**
 * @category Unfoldable
 * @since 2.6.6
 */
var unfold$1 = function (b, f) {
    var out = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (isSome(mt)) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            out.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return out;
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.5.0
 */
var URI$1 = 'ReadonlyArray';
/**
 * @category instances
 * @since 2.5.0
 */
var getShow$1 = function (S) { return ({
    show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
}); };
/**
 * @category instances
 * @since 2.5.0
 */
var getSemigroup$1 = function () { return ({
    concat: function (first, second) { return (isEmpty$1(first) ? second : isEmpty$1(second) ? first : first.concat(second)); }
}); };
/**
 * Returns a `Monoid` for `ReadonlyArray<A>`.
 *
 * @example
 * import { getMonoid } from 'fp-ts/ReadonlyArray'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.5.0
 */
var getMonoid$1 = function () { return ({
    concat: getSemigroup$1().concat,
    empty: empty$1
}); };
/**
 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/ReadonlyArray'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq$1 = function (E) {
    return fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
/**
 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @category instances
 * @since 2.5.0
 */
var getOrd$1 = function (O) {
    return fromCompare(function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        var len = Math.min(aLen, bLen);
        for (var i = 0; i < len; i++) {
            var ordering = O.compare(a[i], b[i]);
            if (ordering !== 0) {
                return ordering;
            }
        }
        return Ord.compare(aLen, bLen);
    });
};
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionSemigroup$1 = function (E) {
    var unionE = union$1(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionMonoid$1 = function (E) { return ({
    concat: getUnionSemigroup$1(E).concat,
    empty: empty$1
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var getIntersectionSemigroup$1 = function (E) {
    var intersectionE = intersection$1(E);
    return {
        concat: function (first, second) { return intersectionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
var getDifferenceMagma$1 = function (E) {
    var differenceE = difference$1(E);
    return {
        concat: function (first, second) { return differenceE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$1 = {
    URI: URI$1,
    map: _map$1
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$1 = 
/*#__PURE__*/
flap$5(Functor$1);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$1 = {
    URI: URI$1,
    of: of$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$1 = {
    URI: URI$1,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst$1 = 
/*#__PURE__*/
apFirst$4(Apply$1);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond$1 = 
/*#__PURE__*/
apSecond$4(Apply$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    of: of$1
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    chain: _chain$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    chain: _chain$1
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var chainFirst$1 = 
/*#__PURE__*/
chainFirst$4(Chain$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Unfoldable$1 = {
    URI: URI$1,
    unfold: unfold$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$1 = {
    URI: URI$1,
    map: _map$1,
    alt: _alt$1
};
/**
 * @category instances
 * @since 2.11.0
 */
var Zero$1 = {
    URI: URI$1,
    zero: zero$1
};
/**
 * @category constructors
 * @since 2.11.0
 */
var guard$1 = 
/*#__PURE__*/
guard$2(Zero$1, Pointed$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Alternative$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    alt: _alt$1,
    zero: zero$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Extend$1 = {
    URI: URI$1,
    map: _map$1,
    extend: _extend$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable$1 = {
    URI: URI$1,
    compact: compact$1,
    separate: separate$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable$1 = {
    URI: URI$1,
    map: _map$1,
    compact: compact$1,
    separate: separate$1,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FilterableWithIndex$1 = {
    URI: URI$1,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1,
    compact: compact$1,
    separate: separate$1,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    partitionMapWithIndex: _partitionMapWithIndex$1,
    partitionWithIndex: _partitionWithIndex$1,
    filterMapWithIndex: _filterMapWithIndex$1,
    filterWithIndex: _filterWithIndex$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$1 = {
    URI: URI$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$1 = {
    URI: URI$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$1 = {
    URI: URI$1,
    map: _map$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex$1 = {
    URI: URI$1,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    traverseWithIndex: _traverseWithIndex$1
};
/**
 * @category ChainRec
 * @since 2.11.0
 */
var chainRecDepthFirst$1 = function (f) { return function (a) {
    var todo = __spreadArray([], f(a));
    var out = [];
    while (todo.length > 0) {
        var e = todo.shift();
        if (isLeft(e)) {
            todo.unshift.apply(todo, f(e.left));
        }
        else {
            out.push(e.right);
        }
    }
    return out;
}; };
/**
 * @category instances
 * @since 2.11.0
 */
var ChainRecDepthFirst$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    chain: _chain$1,
    chainRec: _chainRecDepthFirst$1
};
/**
 * @category ChainRec
 * @since 2.11.0
 */
var chainRecBreadthFirst$1 = function (f) { return function (a) {
    var initial = f(a);
    var todo = [];
    var out = [];
    function go(e) {
        if (isLeft(e)) {
            f(e.left).forEach(function (v) { return todo.push(v); });
        }
        else {
            out.push(e.right);
        }
    }
    for (var _i = 0, initial_1 = initial; _i < initial_1.length; _i++) {
        var e = initial_1[_i];
        go(e);
    }
    while (todo.length > 0) {
        go(todo.shift());
    }
    return out;
}; };
/**
 * @category instances
 * @since 2.11.0
 */
var ChainRecBreadthFirst$1 = {
    URI: URI$1,
    map: _map$1,
    ap: _ap$1,
    chain: _chain$1,
    chainRec: _chainRecBreadthFirst$1
};
var _wither$1 = witherDefault(Traversable$1, Compactable$1);
var _wilt$1 = wiltDefault(Traversable$1, Compactable$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Witherable$1 = {
    URI: URI$1,
    map: _map$1,
    compact: compact$1,
    separate: separate$1,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    wither: _wither$1,
    wilt: _wilt$1
};
/**
 * Filter values inside a context.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as T from 'fp-ts/Task'
 *
 * const filterE = RA.filterE(T.ApplicativePar)
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       [-1, 2, 3],
 *       filterE((n) => T.of(n > 0))
 *     )(),
 *     [2, 3]
 *   )
 * }
 * test()
 *
 * @since 2.11.0
 */
var filterE$1 = 
/*#__PURE__*/
filterE$2(Witherable$1);
/**
 * @category instances
 * @since 2.11.0
 */
var FromEither$1 = {
    URI: URI$1,
    fromEither: fromEither$1
};
/**
 * @category combinators
 * @since 2.11.0
 */
var fromEitherK$1 = 
/*#__PURE__*/
fromEitherK$2(FromEither$1);
// -------------------------------------------------------------------------------------
// unsafe
// -------------------------------------------------------------------------------------
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeInsertAt$1 = unsafeInsertAt$3;
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeUpdateAt$1 = function (i, a, as) {
    return isNonEmpty$1(as) ? unsafeUpdateAt$3(i, a, as) : as;
};
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeDeleteAt$1 = function (i, as) {
    var xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.5.0
 */
var toArray = function (as) { return as.slice(); };
/**
 * @category interop
 * @since 2.5.0
 */
var fromArray = function (as) { return (isEmpty$1(as) ? empty$1 : as.slice()); };
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * An empty array
 *
 * @since 2.5.0
 */
var empty$1 = empty$2;
/**
 * Check if a predicate holds true for every array member.
 *
 * @example
 * import { every } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], every(isPositive)), true)
 * assert.deepStrictEqual(pipe([1, 2, -3], every(isPositive)), false)
 *
 * @since 2.9.0
 */
var every$1 = function (predicate) { return function (as) { return as.every(predicate); }; };
/**
 * Check if a predicate holds true for any array member.
 *
 * @example
 * import { some } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
 *
 * @since 2.9.0
 */
var some$1 = function (predicate) { return function (as) {
    return as.some(predicate);
}; };
/**
 * Alias of [`some`](#some)
 *
 * @since 2.11.0
 */
var exists$1 = some$1;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$1 = 
/*#__PURE__*/
of$1(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$1 = 
/*#__PURE__*/
bindTo$4(Functor$1);
/**
 * @since 2.8.0
 */
var bind$1 = 
/*#__PURE__*/
bind$4(Chain$1);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$1 = 
/*#__PURE__*/
apS$4(Apply$1);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use `ReadonlyNonEmptyArray` module instead.
 *
 * @category constructors
 * @since 2.5.0
 * @deprecated
 */
var range$1 = range$3;
/**
 * Use [`prepend`](#prepend) instead.
 *
 * @category constructors
 * @since 2.5.0
 * @deprecated
 */
var cons$1 = cons$3;
/**
 * Use [`append`](#append) instead.
 *
 * @category constructors
 * @since 2.5.0
 * @deprecated
 */
var snoc$1 = snoc$3;
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll$1 = prependAll$1;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.5.0
 * @deprecated
 */
var readonlyArray = {
    URI: URI$1,
    compact: compact$1,
    separate: separate$1,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    chain: _chain$1,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    mapWithIndex: _mapWithIndex$1,
    partitionMapWithIndex: _partitionMapWithIndex$1,
    partitionWithIndex: _partitionWithIndex$1,
    filterMapWithIndex: _filterMapWithIndex$1,
    filterWithIndex: _filterWithIndex$1,
    alt: _alt$1,
    zero: zero$1,
    unfold: unfold$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1,
    traverseWithIndex: _traverseWithIndex$1,
    extend: _extend$1,
    wither: _wither$1,
    wilt: _wilt$1
};

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isEmpty = function (as) { return as.length === 0; };
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
 *
 * @category refinements
 * @since 2.0.0
 */
var isNonEmpty = isNonEmpty$2;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var prepend = prepend$2;
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @category constructors
 * @since 2.11.0
 */
var prependW = prependW$2;
/**
 * Append an element to the end of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var append = append$2;
/**
 * Less strict version of [`append`](#append).
 *
 * @category constructors
 * @since 2.11.0
 */
var appendW = appendW$2;
/**
 * Return a `Array` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.0.0
 */
var makeBy = function (n, f) { return (n <= 0 ? [] : makeBy$2(f)(n)); };
/**
 * Create a `Array` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.0.0
 */
var replicate = function (n, a) { return makeBy(n, function () { return a; }); };
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? [a] : []); };
}
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromOption = function (ma) { return (isNone(ma) ? [] : [ma.value]); };
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromEither = function (e) { return (isLeft(e) ? [] : [e.right]); };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchW = function (onEmpty, onNonEmpty) { return function (as) {
    return isNonEmpty(as) ? onNonEmpty(as) : onEmpty();
}; };
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.11.0
 */
var match = matchW;
/**
 * Less strict version of [`matchLeft`](#matchleft).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchLeftW = function (onEmpty, onNonEmpty) { return function (as) { return (isNonEmpty(as) ? onNonEmpty(head$2(as), tail$2(as)) : onEmpty()); }; };
/**
 * Break an `Array` into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/Array'
 *
 * const len: <A>(as: Array<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category destructors
 * @since 2.10.0
 */
var matchLeft = matchLeftW;
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category destructors
 * @since 2.0.0
 */
var foldLeft = matchLeft;
/**
 * Less strict version of [`matchRight`](#matchright).
 *
 * @category destructors
 * @since 2.11.0
 */
var matchRightW = function (onEmpty, onNonEmpty) { return function (as) { return (isNonEmpty(as) ? onNonEmpty(init$2(as), last$2(as)) : onEmpty()); }; };
/**
 * Break an `Array` into its initial elements and the last element.
 *
 * @category destructors
 * @since 2.10.0
 */
var matchRight = matchRightW;
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category destructors
 * @since 2.0.0
 */
var foldRight = matchRight;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.7.0
 */
var chainWithIndex = function (f) { return function (as) {
    var out = [];
    for (var i = 0; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * @example
 * import { scanLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @category combinators
 * @since 2.0.0
 */
var scanLeft = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[0] = b;
    for (var i = 0; i < len; i++) {
        out[i + 1] = f(out[i], as[i]);
    }
    return out;
}; };
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @category combinators
 * @since 2.0.0
 */
var scanRight = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[len] = b;
    for (var i = len - 1; i >= 0; i--) {
        out[i] = f(as[i], out[i + 1]);
    }
    return out;
}; };
/**
 * Calculate the number of elements in a `Array`.
 *
 * @since 2.10.0
 */
var size = function (as) { return as.length; };
/**
 * Test whether an array contains a particular index
 *
 * @since 2.0.0
 */
var isOutOfBound = isOutOfBound$2;
// TODO: remove non-curried overloading in v3
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { lookup } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
 *
 * @since 2.0.0
 */
var lookup = lookup$1;
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var head = head$1;
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var last = last$1;
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var tail = function (as) { return (isNonEmpty(as) ? some$2(tail$2(as)) : none); };
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var init = function (as) { return (isNonEmpty(as) ? some$2(init$2(as)) : none); };
/**
 * Keep only a max number of elements from the start of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeLeft(2)([1, 2, 3]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var takeLeft = function (n) { return function (as) { return (isOutOfBound(n, as) ? copy(as) : as.slice(0, n)); }; };
/**
 * Keep only a max number of elements from the end of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeRight(2)([1, 2, 3, 4, 5]), [4, 5])
 *
 * @category combinators
 * @since 2.0.0
 */
var takeRight = function (n) { return function (as) {
    return isOutOfBound(n, as) ? copy(as) : n === 0 ? [] : as.slice(-n);
}; };
function takeLeftWhile(predicate) {
    return function (as) {
        var out = [];
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        return out;
    };
}
var spanLeftIndex = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function spanLeft(predicate) {
    return function (as) {
        var _a = splitAt(spanLeftIndex(as, predicate))(as), init = _a[0], rest = _a[1];
        return { init: init, rest: rest };
    };
}
/**
 * Drop a max number of elements from the start of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropLeft(2)([1, 2, 3]), [3])
 *
 * @category combinators
 * @since 2.0.0
 */
var dropLeft = function (n) { return function (as) {
    return n <= 0 || isEmpty(as) ? copy(as) : n >= as.length ? [] : as.slice(n, as.length);
}; };
/**
 * Drop a max number of elements from the end of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropRight(2)([1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var dropRight = function (n) { return function (as) {
    return n <= 0 || isEmpty(as) ? copy(as) : n >= as.length ? [] : as.slice(0, as.length - n);
}; };
function dropLeftWhile(predicate) {
    return function (as) { return as.slice(spanLeftIndex(as, predicate)); };
}
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.0.0
 */
var findIndex = findIndex$1;
function findFirst(predicate) {
    return findFirst$1(predicate);
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @category destructors
 * @since 2.0.0
 */
var findFirstMap = findFirstMap$1;
function findLast(predicate) {
    return findLast$1(predicate);
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @category destructors
 * @since 2.0.0
 */
var findLastMap = findLastMap$1;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.0.0
 */
var findLastIndex = findLastIndex$1;
/**
 * @category combinators
 * @since 2.0.0
 */
var copy = function (as) { return as.slice(); };
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/Array'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.0.0
 */
var insertAt = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$2(unsafeInsertAt(i, a, as));
}; };
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.0.0
 */
var updateAt = function (i, a) { return modifyAt(i, function () { return a; }); };
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.0.0
 */
var deleteAt = function (i) { return function (as) {
    return isOutOfBound(i, as) ? none : some$2(unsafeDeleteAt(i, as));
}; };
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.0.0
 */
var modifyAt = function (i, f) { return function (as) {
    return isOutOfBound(i, as) ? none : some$2(unsafeUpdateAt(i, f(as[i]), as));
}; };
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @category combinators
 * @since 2.0.0
 */
var reverse = function (as) { return (isEmpty(as) ? [] : as.slice().reverse()); };
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/Array'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var rights = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/Array'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @category combinators
 * @since 2.0.0
 */
var lefts = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var sort = function (O) { return function (as) {
    return as.length <= 1 ? copy(as) : as.slice().sort(O.compare);
}; };
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @category combinators
 * @since 2.0.0
 */
var zipWith = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return zipWith(as, bs, function (a, b) { return [a, b]; });
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.0.0
 */
var unzip = function (as) {
    var fa = [];
    var fb = [];
    for (var i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll = function (middle) {
    var f = prependAll$2(middle);
    return function (as) { return (isNonEmpty(as) ? f(as) : []); };
};
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse = function (middle) {
    var f = intersperse$2(middle);
    return function (as) { return (isNonEmpty(as) ? f(as) : copy(as)); };
};
/**
 * Rotate a `Array` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var rotate = function (n) {
    var f = rotate$2(n);
    return function (as) { return (isNonEmpty(as) ? f(as) : copy(as)); };
};
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of an array. Takes a `Eq<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { elem } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
 *
 * @since 2.0.0
 */
var elem = elem$1;
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var uniq = function (E) {
    var f = uniq$2(E);
    return function (as) { return (isNonEmpty(as) ? f(as) : copy(as)); };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/Array'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.0.0
 */
var sortBy = function (ords) {
    var f = sortBy$2(ords);
    return function (as) { return (isNonEmpty(as) ? f(as) : copy(as)); };
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as A from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
 *   return A.chop(as => {
 *     const { init, rest } = pipe(as, A.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @category combinators
 * @since 2.0.0
 */
var chop = function (f) {
    var g = chop$2(f);
    return function (as) { return (isNonEmpty(as) ? g(as) : []); };
};
/**
 * Splits an `Array` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @category combinators
 * @since 2.0.0
 */
var splitAt = function (n) { return function (as) {
    return n >= 1 && isNonEmpty(as) ? splitAt$2(n)(as) : isEmpty(as) ? [copy(as), []] : [[], copy(as)];
}; };
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @category combinators
 * @since 2.0.0
 */
var chunksOf = function (n) {
    var f = chunksOf$2(n);
    return function (as) { return (isNonEmpty(as) ? f(as) : []); };
};
/**
 * @category combinators
 * @since 2.11.0
 */
var fromOptionK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return fromOption(f.apply(void 0, a));
}; };
function comprehension(input, f, g) {
    if (g === void 0) { g = function () { return true; }; }
    var go = function (scope, input) {
        return isNonEmpty(input)
            ? pipe(head$2(input), chain(function (x) { return go(pipe(scope, append(x)), tail$2(input)); }))
            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
                : [];
    };
    return go([], input);
}
/**
 * @category combinators
 * @since 2.11.0
 */
var concatW = function (second) { return function (first) {
    return isEmpty(first) ? copy(second) : isEmpty(second) ? copy(first) : first.concat(second);
}; };
/**
 * @category combinators
 * @since 2.11.0
 */
var concat = concatW;
function union(E) {
    var unionE = union$2(E);
    return function (first, second) {
        if (second === undefined) {
            var unionE_1 = union(E);
            return function (second) { return unionE_1(second, first); };
        }
        return isNonEmpty(first) && isNonEmpty(second)
            ? unionE(second)(first)
            : isNonEmpty(first)
                ? copy(first)
                : copy(second);
    };
}
function intersection(E) {
    var elemE = elem(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var intersectionE_1 = intersection(E);
            return function (ys) { return intersectionE_1(ys, xs); };
        }
        return xs.filter(function (a) { return elemE(a, ys); });
    };
}
function difference(E) {
    var elemE = elem(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var differenceE_1 = difference(E);
            return function (ys) { return differenceE_1(ys, xs); };
        }
        return xs.filter(function (a) { return !elemE(a, ys); });
    };
}
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return pipe(fa, mapWithIndex(f)); };
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
var _chain = function (ma, f) { return pipe(ma, chain(f)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) { return pipe(fa, filter(predicate)); };
/* istanbul ignore next */
var _filterMap = function (fa, f) { return pipe(fa, filterMap(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return pipe(fa, partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return pipe(fa, partitionMap(f)); };
/* istanbul ignore next */
var _partitionWithIndex = function (fa, predicateWithIndex) { return pipe(fa, partitionWithIndex(predicateWithIndex)); };
/* istanbul ignore next */
var _partitionMapWithIndex = function (fa, f) { return pipe(fa, partitionMapWithIndex(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return pipe(fa, alt(that)); };
var _reduce = function (fa, b, f) { return pipe(fa, reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = foldMap(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return pipe(fa, reduceRight(b, f)); };
/* istanbul ignore next */
var _reduceWithIndex = function (fa, b, f) {
    return pipe(fa, reduceWithIndex(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = foldMapWithIndex(M);
    return function (fa, f) { return pipe(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex = function (fa, b, f) {
    return pipe(fa, reduceRightWithIndex(b, f));
};
/* istanbul ignore next */
var _filterMapWithIndex = function (fa, f) { return pipe(fa, filterMapWithIndex(f)); };
/* istanbul ignore next */
var _filterWithIndex = function (fa, predicateWithIndex) { return pipe(fa, filterWithIndex(predicateWithIndex)); };
/* istanbul ignore next */
var _extend = function (fa, f) { return pipe(fa, extend(f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return pipe(ta, traverseWithIndexF(f)); };
};
var _chainRecDepthFirst = _chainRecDepthFirst$1;
var _chainRecBreadthFirst = _chainRecBreadthFirst$1;
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Pointed
 * @since 2.0.0
 */
var of = of$2;
/**
 * @category Zero
 * @since 2.7.0
 */
var zero = function () { return []; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return fa.map(function (a) { return f(a); }); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return chain(function (f) { return pipe(fa, map(f)); }); };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) {
    return pipe(ma, chainWithIndex(function (_, a) { return f(a); }));
}; };
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten = 
/*#__PURE__*/
chain(identity);
/**
 * @category FunctorWithIndex
 * @since 2.0.0
 */
var mapWithIndex = function (f) { return function (fa) {
    return fa.map(function (a, i) { return f(i, a); });
}; };
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var filterMapWithIndex = function (f) { return function (fa) {
    var out = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (isSome(optionB)) {
            out.push(optionB.value);
        }
    }
    return out;
}; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var filterMap = function (f) {
    return filterMapWithIndex(function (_, a) { return f(a); });
};
/**
 * @category Compactable
 * @since 2.0.0
 */
var compact = 
/*#__PURE__*/
filterMap(identity);
/**
 * @category Compactable
 * @since 2.0.0
 */
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
};
/**
 * @category Filterable
 * @since 2.0.0
 */
var filter = function (predicate) { return function (as) { return as.filter(predicate); }; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partition = function (predicate) {
    return partitionWithIndex(function (_, a) { return predicate(a); });
};
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var partitionWithIndex = function (predicateWithIndex) { return function (as) {
    var left = [];
    var right = [];
    for (var i = 0; i < as.length; i++) {
        var b = as[i];
        if (predicateWithIndex(i, b)) {
            right.push(b);
        }
        else {
            left.push(b);
        }
    }
    return separated(left, right);
}; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partitionMap = function (f) { return partitionMapWithIndex(function (_, a) { return f(a); }); };
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var partitionMapWithIndex = function (f) { return function (fa) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
}; };
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) { return fa.concat(that()); }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
var alt = altW;
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var filterWithIndex = function (predicateWithIndex) { return function (as) {
    return as.filter(function (b, i) { return predicateWithIndex(i, b); });
}; };
/**
 * @category Extend
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return wa.map(function (_, i) { return f(wa.slice(i)); });
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
var duplicate = 
/*#__PURE__*/
extend(identity);
/**
 * @category Foldable
 * @since 2.0.0
 */
var foldMap = foldMap$1;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var foldMapWithIndex = foldMapWithIndex$1;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce = reduce$1;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceWithIndex = reduceWithIndex$1;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight = reduceRight$1;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceRightWithIndex = reduceRightWithIndex$1;
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence = function (F) { return function (ta) {
    return _reduce(ta, F.of(zero()), function (fas, fa) {
        return F.ap(F.map(fas, function (as) { return function (a) { return pipe(as, append(a)); }; }), fa);
    });
}; };
/**
 * @category TraversableWithIndex
 * @since 2.6.3
 */
var traverseWithIndex = function (F) { return function (f) {
    return reduceWithIndex(F.of(zero()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return pipe(bs, append(b)); }; }), f(i, a));
    });
}; };
/**
 * @category Witherable
 * @since 2.6.5
 */
var wither = function (F) {
    var _witherF = _wither(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
/**
 * @category Witherable
 * @since 2.6.5
 */
var wilt = function (F) {
    var _wiltF = _wilt(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
/**
 * Creates an `Array` from the results of `f(b)`, where `b` is an initial value.
 * `unfold` stops when `f` returns `Option.none`.
 * @example
 * import { unfold } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   unfold(5, (n) => (n > 0 ? some([n, n - 1]) : none)),
 *   [5, 4, 3, 2, 1]
 * )
 *
 * @category Unfoldable
 * @since 2.6.6
 */
var unfold = function (b, f) {
    var out = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (isSome(mt)) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            out.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return out;
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI = 'Array';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = getShow$1;
/**
 * @category instances
 * @since 2.10.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) { return first.concat(second); }
}); };
/**
 * Returns a `Monoid` for `Array<A>`
 *
 * @example
 * import { getMonoid } from 'fp-ts/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid = function () { return ({
    concat: getSemigroup().concat,
    empty: []
}); };
/**
 * Derives an `Eq` over the `Array` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/Array'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq = getEq$1;
/**
 * Derives an `Ord` over the `Array` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/Array'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @category instances
 * @since 2.0.0
 */
var getOrd = getOrd$1;
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionSemigroup = function (E) {
    var unionE = union(E);
    return {
        concat: function (first, second) { return unionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
var getUnionMonoid = function (E) { return ({
    concat: getUnionSemigroup(E).concat,
    empty: []
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var getIntersectionSemigroup = function (E) {
    var intersectionE = intersection(E);
    return {
        concat: function (first, second) { return intersectionE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
var getDifferenceMagma = function (E) {
    var differenceE = difference(E);
    return {
        concat: function (first, second) { return differenceE(second)(first); }
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Functor = {
    URI: URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap = 
/*#__PURE__*/
flap$5(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed = {
    URI: URI,
    of: of
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst = 
/*#__PURE__*/
apFirst$4(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond = 
/*#__PURE__*/
apSecond$4(Apply);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst = 
/*#__PURE__*/
chainFirst$4(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
var Unfoldable = {
    URI: URI,
    unfold: unfold
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.11.0
 */
var Zero = {
    URI: URI,
    zero: zero
};
/**
 * @category constructors
 * @since 2.11.0
 */
var guard = 
/*#__PURE__*/
guard$2(Zero, Pointed);
/**
 * @category instances
 * @since 2.7.0
 */
var Alternative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    alt: _alt,
    zero: zero
};
/**
 * @category instances
 * @since 2.7.0
 */
var Extend = {
    URI: URI,
    map: _map,
    extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable = {
    URI: URI,
    compact: compact,
    separate: separate
};
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable = {
    URI: URI,
    map: _map,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.7.0
 */
var FilterableWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex = {
    URI: URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable = {
    URI: URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex = {
    URI: URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverse: _traverse,
    sequence: sequence,
    traverseWithIndex: _traverseWithIndex
};
var _wither = witherDefault(Traversable, Compactable);
var _wilt = wiltDefault(Traversable, Compactable);
/**
 * @category instances
 * @since 2.7.0
 */
var Witherable = {
    URI: URI,
    map: _map,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    wither: _wither,
    wilt: _wilt
};
/**
 * @category ChainRec
 * @since 2.11.0
 */
var chainRecDepthFirst = chainRecDepthFirst$1;
/**
 * @category instances
 * @since 2.11.0
 */
var ChainRecDepthFirst = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain,
    chainRec: _chainRecDepthFirst
};
/**
 * @category ChainRec
 * @since 2.11.0
 */
var chainRecBreadthFirst = chainRecBreadthFirst$1;
/**
 * @category instances
 * @since 2.11.0
 */
var ChainRecBreadthFirst = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain,
    chainRec: _chainRecBreadthFirst
};
/**
 * Filter values inside a context.
 *
 * @since 2.11.0
 */
var filterE = 
/*#__PURE__*/
filterE$2(Witherable);
/**
 * @category instances
 * @since 2.11.0
 */
var FromEither = {
    URI: URI,
    fromEither: fromEither
};
/**
 * @category combinators
 * @since 2.11.0
 */
var fromEitherK = 
/*#__PURE__*/
fromEitherK$2(FromEither);
// -------------------------------------------------------------------------------------
// unsafe
// -------------------------------------------------------------------------------------
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeInsertAt = unsafeInsertAt$2;
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeUpdateAt = function (i, a, as) {
    return isNonEmpty(as) ? unsafeUpdateAt$2(i, a, as) : [];
};
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeDeleteAt = function (i, as) {
    var xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var every = every$1;
/**
 * @since 2.9.0
 */
var some = function (predicate) { return function (as) { return as.some(predicate); }; };
/**
 * Alias of [`some`](#some)
 *
 * @since 2.11.0
 */
var exists = some;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do = 
/*#__PURE__*/
of(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo = 
/*#__PURE__*/
bindTo$4(Functor);
/**
 * @since 2.8.0
 */
var bind = 
/*#__PURE__*/
bind$4(Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS = 
/*#__PURE__*/
apS$4(Apply);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use `NonEmptyArray` module instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var range = range$2;
/**
 * Use a new `[]` instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var empty = [];
/**
 * Use `prepend` instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var cons = cons$2;
/**
 * Use `append` instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var snoc = snoc$2;
/**
 * Use `prependAll` instead
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll = prependAll;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var array = {
    URI: URI,
    compact: compact,
    separate: separate,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    alt: _alt,
    zero: zero,
    unfold: unfold,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    extend: _extend,
    wither: _wither,
    wilt: _wilt
};

const rebuildProducts = async (products, slideSize, margin, itemWidth) => {
  const avaibleColumns = Math.floor(slideSize / (itemWidth + margin));
  return chunksOf(avaibleColumns > 1 ? avaibleColumns : 1)(products);
};
const rewrapProducts = async (products, columns) => chunksOf(columns)(products);

exports.rebuildProducts = rebuildProducts;
exports.rewrapProducts = rewrapProducts;
})();
