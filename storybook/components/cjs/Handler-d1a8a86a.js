'use strict';

// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
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
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
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
var some = function (a) { return ({ _tag: 'Some', value: a }); };
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft = function (ma) { return ma._tag === 'Left'; };
/** @internal */
var left = function (e) { return ({ _tag: 'Left', left: e }); };
/** @internal */
var right = function (a) { return ({ _tag: 'Right', right: a }); };
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
var has = Object.prototype.hasOwnProperty;

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
var last = function () { return ({ concat: function (_, y) { return y; } }); };
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

const semigroupDiff = {
  concat: (x, y) => x - y,
};

const fromRectangle$1 = ({ x, y }) => {
  return {
    x,
    y,
  };
};
const fromMouseEvent = ({ clientX, clientY }) => {
  return {
    x: clientX,
    y: clientY,
  };
};
const pointDiffSemigroup = struct({
  x: semigroupDiff,
  y: semigroupDiff,
});
const pointSumSemigroup = struct({
  x: semigroupSum,
  y: semigroupSum,
});

exports.HandlerDirection = void 0;
(function (HandlerDirection) {
  HandlerDirection[HandlerDirection["East"] = 0] = "East";
  HandlerDirection[HandlerDirection["North"] = 1] = "North";
  HandlerDirection[HandlerDirection["NorthEast"] = 2] = "NorthEast";
  HandlerDirection[HandlerDirection["NorthWest"] = 3] = "NorthWest";
  HandlerDirection[HandlerDirection["South"] = 4] = "South";
  HandlerDirection[HandlerDirection["SouthEast"] = 5] = "SouthEast";
  HandlerDirection[HandlerDirection["SouthWest"] = 6] = "SouthWest";
  HandlerDirection[HandlerDirection["West"] = 7] = "West";
})(exports.HandlerDirection || (exports.HandlerDirection = {}));
const getCursorValue = (direction) => {
  switch (direction) {
    case exports.HandlerDirection.East:
      return "e-resize";
    case exports.HandlerDirection.North:
      return "n-resize";
    case exports.HandlerDirection.NorthEast:
      return "ne-resize";
    case exports.HandlerDirection.NorthWest:
      return "nw-resize";
    case exports.HandlerDirection.South:
      return "s-resize";
    case exports.HandlerDirection.SouthEast:
      return "se-resize";
    case exports.HandlerDirection.SouthWest:
      return "sw-resize";
    case exports.HandlerDirection.West:
      return "w-resize";
    default:
      return "pointer";
  }
};
const fromRectangle = (r) => [
  {
    position: fromRectangle$1(r),
    direction: exports.HandlerDirection.NorthWest,
  },
  {
    position: pointSumSemigroup.concat(fromRectangle$1(r), {
      x: r.width,
      y: 0,
    }),
    direction: exports.HandlerDirection.NorthEast,
  },
  {
    position: pointSumSemigroup.concat(fromRectangle$1(r), {
      x: 0,
      y: r.height,
    }),
    direction: exports.HandlerDirection.SouthWest,
  },
  {
    position: pointSumSemigroup.concat(fromRectangle$1(r), {
      x: r.width,
      y: r.height,
    }),
    direction: exports.HandlerDirection.SouthEast,
  },
];

exports.first = first;
exports.flow = flow;
exports.fromMouseEvent = fromMouseEvent;
exports.fromRectangle = fromRectangle$1;
exports.fromRectangle$1 = fromRectangle;
exports.getCursorValue = getCursorValue;
exports.identity = identity;
exports.isLeft = isLeft;
exports.isNone = isNone;
exports.isSome = isSome;
exports.last = last;
exports.left = left;
exports.none = none;
exports.pipe = pipe;
exports.pointDiffSemigroup = pointDiffSemigroup;
exports.pointSumSemigroup = pointSumSemigroup;
exports.right = right;
exports.some = some;
exports.struct = struct;
exports.tuple = tuple;
