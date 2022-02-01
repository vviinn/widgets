import { i as getRenderingRef, j as forceUpdate } from './index-42e4cfd6.js';
import { O as Option, A as Applicative$6, P as Predicate, a as Ord$1, s as sequenceToOption } from './number-98d54dd6.js';
import { t as tuple, p as pipe, i as isNone$1, l as left$4, r as right$4, f as flow, s as some$3, n as none$1, a as identity, b as isLeft$1, c as isRight$1, e as emptyRecord, d as emptyReadonlyArray, h as head$4, g as isNonEmpty$4, j as constFalse, k as constTrue, m as isSome$1, o as constNull, q as constUndefined, u as first, v as last$4, w as tail$4, x as singleton, S as SK, y as fromReadonlyNonEmptyArray$1, z as getMonoid$4, A as fromEquals, B as min$2, C as max$2, D as struct, E as getStructSemigroup, F as semigroupDiv, G as contramap$1, H as ordNumber, I as fromRectangle, J as pointSumSemigroup, K as HandlerDirection, L as pointProductSemigroup, M as fromCompare, N as fromRectangle$1 } from './Handler-47db9890.js';
import { c as createCommonjsModule, a as commonjsGlobal, S as Separated, F as Functor$9, _ as _function, g as getDefaultExportFromCjs, i as internal, W as Witherable$3, b as FromEither$5, A as Apply$6, C as Chain$8, O as Ord$2 } from './NonEmptyArray-6ef0d207.js';
import { n as number, _ as _Array } from './Array-4b9f84cf.js';

var Compactable$3 = createCommonjsModule(function (module, exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompactableComposition = exports.separate = exports.compact = void 0;



var S = __importStar(Separated);
function compact(F, G) {
    return function (fga) { return F.map(fga, G.compact); };
}
exports.compact = compact;
function separate(F, C, G) {
    var _compact = compact(F, C);
    var _map = Functor$9.map(F, G);
    return function (fge) { return S.separated(_compact(_function.pipe(fge, _map(Option.getLeft))), _compact(_function.pipe(fge, _map(Option.getRight)))); };
}
exports.separate = separate;
/** @deprecated */
function getCompactableComposition(F, G) {
    var map = Functor$9.getFunctorComposition(F, G).map;
    return {
        map: map,
        compact: compact(F, G),
        separate: separate(F, G, G)
    };
}
exports.getCompactableComposition = getCompactableComposition;
});

const Compactable$4 = /*@__PURE__*/getDefaultExportFromCjs(Compactable$3);

var ChainRec$1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailRec = void 0;
/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
    var ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};
exports.tailRec = tailRec;
});

const ChainRec$2 = /*@__PURE__*/getDefaultExportFromCjs(ChainRec$1);

var Either = createCommonjsModule(function (module, exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fold = exports.match = exports.foldW = exports.matchW = exports.isRight = exports.isLeft = exports.fromOption = exports.fromPredicate = exports.FromEither = exports.MonadThrow = exports.throwError = exports.ChainRec = exports.Extend = exports.extend = exports.Alt = exports.alt = exports.altW = exports.Bifunctor = exports.mapLeft = exports.bimap = exports.Traversable = exports.sequence = exports.traverse = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.chain = exports.chainW = exports.Applicative = exports.Apply = exports.ap = exports.apW = exports.Pointed = exports.of = exports.Functor = exports.map = exports.getAltValidation = exports.getApplicativeValidation = exports.getWitherable = exports.getFilterable = exports.getCompactable = exports.getSemigroup = exports.getEq = exports.getShow = exports.URI = exports.right = exports.left = void 0;
exports.getValidation = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.either = exports.stringifyJSON = exports.parseJSON = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toError = exports.toUnion = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.orElse = exports.orElseW = exports.swap = exports.filterOrElseW = exports.filterOrElse = exports.chainOptionK = exports.fromOptionK = exports.duplicate = exports.flatten = exports.flattenW = exports.chainFirstW = exports.chainFirst = exports.apSecond = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = void 0;







var _ = __importStar(internal);


// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.left = _.left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.right = _.right;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return _function.pipe(fa, exports.map(f)); };
var _ap = function (fab, fa) { return _function.pipe(fab, exports.ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return _function.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return _function.pipe(fa, exports.reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) { return function (fa, f) {
    var foldMapM = exports.foldMap(M);
    return _function.pipe(fa, foldMapM(f));
}; };
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return _function.pipe(fa, exports.reduceRight(b, f)); };
var _traverse = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return _function.pipe(ta, traverseF(f)); };
};
var _bimap = function (fa, f, g) { return _function.pipe(fa, exports.bimap(f, g)); };
var _mapLeft = function (fa, f) { return _function.pipe(fa, exports.mapLeft(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return _function.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return _function.pipe(wa, exports.extend(f)); };
var _chainRec = function (a, f) {
    return ChainRec$1.tailRec(f(a), function (e) {
        return exports.isLeft(e) ? exports.right(exports.left(e.left)) : exports.isLeft(e.right) ? exports.left(f(e.right.left)) : exports.right(exports.right(e.right.right));
    });
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = function (SE, SA) { return ({
    show: function (ma) { return (exports.isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
}); };
exports.getShow = getShow;
/**
 * @category instances
 * @since 2.0.0
 */
var getEq = function (EL, EA) { return ({
    equals: function (x, y) {
        return x === y || (exports.isLeft(x) ? exports.isLeft(y) && EL.equals(x.left, y.left) : exports.isRight(y) && EA.equals(x.right, y.right));
    }
}); };
exports.getEq = getEq;
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function (S) { return ({
    concat: function (x, y) { return (exports.isLeft(y) ? x : exports.isLeft(x) ? y : exports.right(S.concat(x.right, y.right))); }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var empty = exports.left(M.empty);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: function (ma) { return (exports.isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : exports.right(ma.right.value)); },
        separate: function (ma) {
            return exports.isLeft(ma)
                ? Separated.separated(ma, ma)
                : exports.isLeft(ma.right)
                    ? Separated.separated(exports.right(ma.right.left), empty)
                    : Separated.separated(empty, exports.right(ma.right.right));
        }
    };
};
exports.getCompactable = getCompactable;
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.10.0
 */
var getFilterable = function (M) {
    var empty = exports.left(M.empty);
    var _a = exports.getCompactable(M), compact = _a.compact, separate = _a.separate;
    var filter = function (ma, predicate) {
        return exports.isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    var partition = function (ma, p) {
        return exports.isLeft(ma)
            ? Separated.separated(ma, ma)
            : p(ma.right)
                ? Separated.separated(empty, exports.right(ma.right))
                : Separated.separated(exports.right(ma.right), empty);
    };
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: function (ma, f) {
            if (exports.isLeft(ma)) {
                return ma;
            }
            var ob = f(ma.right);
            return ob._tag === 'None' ? empty : exports.right(ob.value);
        },
        partition: partition,
        partitionMap: function (ma, f) {
            if (exports.isLeft(ma)) {
                return Separated.separated(ma, ma);
            }
            var e = f(ma.right);
            return exports.isLeft(e) ? Separated.separated(exports.right(e.left), empty) : Separated.separated(empty, exports.right(e.right));
        }
    };
};
exports.getFilterable = getFilterable;
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.0.0
 */
var getWitherable = function (M) {
    var F_ = exports.getFilterable(M);
    var C = exports.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: F_.compact,
        separate: F_.separate,
        filter: F_.filter,
        filterMap: F_.filterMap,
        partition: F_.partition,
        partitionMap: F_.partitionMap,
        traverse: _traverse,
        sequence: exports.sequence,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        wither: Witherable$3.witherDefault(exports.Traversable, C),
        wilt: Witherable$3.wiltDefault(exports.Traversable, C)
    };
};
exports.getWitherable = getWitherable;
/**
 * @category instances
 * @since 2.7.0
 */
var getApplicativeValidation = function (SE) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
        return exports.isLeft(fab)
            ? exports.isLeft(fa)
                ? exports.left(SE.concat(fab.left, fa.left))
                : fab
            : exports.isLeft(fa)
                ? fa
                : exports.right(fab.right(fa.right));
    },
    of: exports.of
}); };
exports.getApplicativeValidation = getApplicativeValidation;
/**
 * @category instances
 * @since 2.7.0
 */
var getAltValidation = function (SE) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    alt: function (me, that) {
        if (exports.isRight(me)) {
            return me;
        }
        var ea = that();
        return exports.isLeft(ea) ? exports.left(SE.concat(me.left, ea.left)) : ea;
    }
}); };
exports.getAltValidation = getAltValidation;
/**
 * @category instance operations
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return exports.isLeft(fa) ? fa : exports.right(f(fa.right));
}; };
exports.map = map;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * @category instance operations
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category instance operations
 * @since 2.8.0
 */
var apW = function (fa) { return function (fab) { return (exports.isLeft(fab) ? fab : exports.isLeft(fa) ? fa : exports.right(fab.right(fa.right))); }; };
exports.apW = apW;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category instance operations
 * @since 2.0.0
 */
exports.ap = exports.apW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category instance operations
 * @since 2.6.0
 */
var chainW = function (f) { return function (ma) {
    return exports.isLeft(ma) ? ma : f(ma.right);
}; };
exports.chainW = chainW;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
exports.chain = exports.chainW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
};
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return exports.isLeft(fa) ? b : f(b, fa.right);
}; };
exports.reduce = reduce;
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return exports.isLeft(fa) ? M.empty : f(fa.right);
}; }; };
exports.foldMap = foldMap;
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return exports.isLeft(fa) ? b : f(fa.right, b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category instance operations
 * @since 2.6.3
 */
var traverse = function (F) { return function (f) { return function (ta) { return (exports.isLeft(ta) ? F.of(exports.left(ta.left)) : F.map(f(ta.right), exports.right)); }; }; };
exports.traverse = traverse;
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category instance operations
 * @since 2.6.3
 */
var sequence = function (F) { return function (ma) {
    return exports.isLeft(ma) ? F.of(exports.left(ma.left)) : F.map(ma.right, exports.right);
}; };
exports.sequence = sequence;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) { return (exports.isLeft(fa) ? exports.left(f(fa.left)) : exports.right(g(fa.right))); }; };
exports.bimap = bimap;
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return exports.isLeft(fa) ? exports.left(f(fa.left)) : fa;
}; };
exports.mapLeft = mapLeft;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category instance operations
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) { return (exports.isLeft(fa) ? that() : fa); }; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category instance operations
 * @since 2.0.0
 */
exports.alt = exports.altW;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return exports.isLeft(wa) ? wa : exports.right(f(wa));
}; };
exports.extend = extend;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: _map,
    extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ChainRec = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain,
    chainRec: _chainRec
};
/**
 * @category instance operations
 * @since 2.6.3
 */
exports.throwError = exports.left;
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    throwError: exports.throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: _function.identity
};
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = 
/*#__PURE__*/
FromEither$5.fromPredicate(exports.FromEither);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/
FromEither$5.fromOption(exports.FromEither);
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isLeft = _.isLeft;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isRight = _.isRight;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW = function (onLeft, onRight) { return function (ma) {
    return exports.isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
}; };
exports.matchW = matchW;
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchW;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
exports.match = exports.matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
exports.fold = exports.match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = function (onLeft) { return function (ma) {
    return exports.isLeft(ma) ? onLeft(ma.left) : ma.right;
}; };
exports.getOrElseW = getOrElseW;
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#__PURE__*/
Functor$9.flap(exports.Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply$6.apFirst(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply$6.apSecond(exports.Apply);
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.chainFirst = 
/*#__PURE__*/
Chain$8.chainFirst(exports.Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
exports.chainFirstW = exports.chainFirst;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/
exports.chainW(_function.identity);
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * Derivable from `Chain`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(_function.identity);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/
FromEither$5.fromOptionK(exports.FromEither);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.chainOptionK = 
/*#__PURE__*/
FromEither$5.chainOptionK(exports.FromEither, exports.Chain);
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = 
/*#__PURE__*/
FromEither$5.filterOrElse(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @category combinators
 * @since 2.0.0
 */
var swap = function (ma) { return (exports.isLeft(ma) ? exports.right(ma.left) : exports.left(ma.right)); };
exports.swap = swap;
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
var orElseW = function (onLeft) { return function (ma) {
    return exports.isLeft(ma) ? onLeft(ma.left) : ma;
}; };
exports.orElseW = orElseW;
/**
 * Useful for recovering from errors.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.orElse = exports.orElseW;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (e) { return function (a) {
    return a == null ? exports.left(e) : exports.right(a);
}; };
exports.fromNullable = fromNullable;
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) {
    try {
        return exports.right(f());
    }
    catch (e) {
        return exports.left(onThrow(e));
    }
};
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); }, onThrow);
}; };
exports.tryCatchK = tryCatchK;
/**
 * @category interop
 * @since 2.9.0
 */
var fromNullableK = function (e) {
    var from = exports.fromNullable(e);
    return function (f) { return _function.flow(f, from); };
};
exports.fromNullableK = fromNullableK;
/**
 * @category interop
 * @since 2.9.0
 */
var chainNullableK = function (e) {
    var from = exports.fromNullableK(e);
    return function (f) { return exports.chain(from(f)); };
};
exports.chainNullableK = chainNullableK;
/**
 * @category interop
 * @since 2.10.0
 */
exports.toUnion = 
/*#__PURE__*/
exports.foldW(_function.identity, _function.identity);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
exports.toError = toError;
function elem(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return exports.isLeft(ma) ? false : E.equals(a, ma.right);
    };
}
exports.elem = elem;
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
var exists = function (predicate) { return function (ma) {
    return exports.isLeft(ma) ? false : predicate(ma.right);
}; };
exports.exists = exists;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor$9.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain$8.bind(exports.Chain);
/**
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply$6.apS(exports.Apply);
/**
 * @since 2.8.0
 */
exports.apSW = exports.apS;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) {
    var e = f(0, _.head(as));
    if (exports.isLeft(e)) {
        return e;
    }
    var out = [e.right];
    for (var i = 1; i < as.length; i++) {
        var e_1 = f(i, as[i]);
        if (exports.isLeft(e_1)) {
            return e_1;
        }
        out.push(e_1.right);
    }
    return exports.right(out);
}; };
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
var traverseArray = function (f) { return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(_function.identity);
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
function parseJSON(s, onError) {
    return exports.tryCatch(function () { return JSON.parse(s); }, onError);
}
exports.parseJSON = parseJSON;
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
    return exports.tryCatch(function () {
        var s = JSON.stringify(u);
        if (typeof s !== 'string') {
            throw new Error('Converting unsupported structure to JSON');
        }
        return s;
    }, onError);
};
exports.stringifyJSON = stringifyJSON;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.either = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    extend: _extend,
    chainRec: _chainRec,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/
Apply$6.getApplySemigroup(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative$6.getApplicativeMonoid(exports.Applicative);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationSemigroup = function (SE, SA) {
    return Apply$6.getApplySemigroup(exports.getApplicativeValidation(SE))(SA);
};
exports.getValidationSemigroup = getValidationSemigroup;
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationMonoid = function (SE, MA) {
    return Applicative$6.getApplicativeMonoid(exports.getApplicativeValidation(SE))(MA);
};
exports.getValidationMonoid = getValidationMonoid;
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getValidation(SE) {
    var ap = exports.getApplicativeValidation(SE).ap;
    var alt = exports.getAltValidation(SE).alt;
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        of: exports.of,
        chain: _chain,
        bimap: _bimap,
        mapLeft: _mapLeft,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        extend: _extend,
        traverse: _traverse,
        sequence: exports.sequence,
        chainRec: _chainRec,
        throwError: exports.throwError,
        ap: ap,
        alt: alt
    };
}
exports.getValidation = getValidation;
});

const Either$1 = /*@__PURE__*/getDefaultExportFromCjs(Either);

var EitherT = createCommonjsModule(function (module, exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEitherM = exports.toUnion = exports.swap = exports.orLeft = exports.orElseFirst = exports.orElse = exports.getOrElse = exports.matchE = exports.match = exports.altValidation = exports.mapLeft = exports.bimap = exports.alt = exports.chain = exports.ap = exports.map = exports.leftF = exports.rightF = exports.left = exports.right = void 0;

var E = __importStar(Either);


function right(F) {
    return _function.flow(E.right, F.of);
}
exports.right = right;
function left(F) {
    return _function.flow(E.left, F.of);
}
exports.left = left;
function rightF(F) {
    return function (fa) { return F.map(fa, E.right); };
}
exports.rightF = rightF;
function leftF(F) {
    return function (fe) { return F.map(fe, E.left); };
}
exports.leftF = leftF;
function map(F) {
    return Functor$9.map(F, E.Functor);
}
exports.map = map;
function ap(F) {
    return Apply$6.ap(F, E.Apply);
}
exports.ap = ap;
function chain(M) {
    return function (f) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? M.of(e) : f(e.right)); }); }; };
}
exports.chain = chain;
function alt(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (E.isLeft(e) ? second() : M.of(e)); }); }; };
}
exports.alt = alt;
function bimap(F) {
    return function (f, g) { return function (fea) { return F.map(fea, E.bimap(f, g)); }; };
}
exports.bimap = bimap;
function mapLeft(F) {
    return function (f) { return function (fea) { return F.map(fea, E.mapLeft(f)); }; };
}
exports.mapLeft = mapLeft;
function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, E.match(function (e1) {
            return M.map(second(), E.mapLeft(function (e2) { return S.concat(e1, e2); }));
        }, right(M)));
    }; };
}
exports.altValidation = altValidation;
function match(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, E.match(onLeft, onRight)); }; };
}
exports.match = match;
function matchE(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, E.match(onLeft, onRight)); }; };
}
exports.matchE = matchE;
function getOrElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, E.match(onLeft, M.of)); }; };
}
exports.getOrElse = getOrElse;
function orElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
exports.orElse = orElse;
function orElseFirst(M) {
    var orElseM = orElse(M);
    return function (onLeft) { return orElseM(function (e) { return M.map(onLeft(e), function (eb) { return (E.isLeft(eb) ? eb : E.left(e)); }); }); };
}
exports.orElseFirst = orElseFirst;
function orLeft(M) {
    return function (onLeft) { return function (ma) {
        return M.chain(ma, E.match(function (e) { return M.map(onLeft(e), E.left); }, function (a) { return M.of(E.right(a)); }));
    }; };
}
exports.orLeft = orLeft;
function swap(F) {
    return function (ma) { return F.map(ma, E.swap); };
}
exports.swap = swap;
function toUnion(F) {
    return function (fa) { return F.map(fa, E.toUnion); };
}
exports.toUnion = toUnion;
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _alt = alt(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _getOrElse = getOrElse(M);
    var _orElse = orElse(M);
    return {
        map: function (fa, f) { return _function.pipe(fa, _map(f)); },
        ap: function (fab, fa) { return _function.pipe(fab, _ap(fa)); },
        of: right(M),
        chain: function (ma, f) { return _function.pipe(ma, _chain(f)); },
        alt: function (fa, that) { return _function.pipe(fa, _alt(that)); },
        bimap: function (fea, f, g) { return _function.pipe(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return _function.pipe(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return _function.pipe(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return _function.pipe(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return _function.pipe(fa, _orElse(f)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
exports.getEitherM = getEitherM;
});

const EitherT$1 = /*@__PURE__*/getDefaultExportFromCjs(EitherT);

var Filterable$3 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterableComposition = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = void 0;
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */






function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
exports.filter = filter;
function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
exports.filterMap = filterMap;
function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) {
        var left = _filter(Predicate.not(predicate));
        var right = _filter(predicate);
        return function (fgb) { return Separated.separated(left(fgb), right(fgb)); };
    };
}
exports.partition = partition;
function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return Separated.separated(_function.pipe(fga, _filterMap(function (a) { return Option.getLeft(f(a)); })), _function.pipe(fga, _filterMap(function (a) { return Option.getRight(f(a)); })));
    }; };
}
exports.partitionMap = partitionMap;
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = Functor$9.getFunctorComposition(F, G).map;
    var _compact = Compactable$3.compact(F, G);
    var _separate = Compactable$3.separate(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return _function.pipe(fga, _filter(f)); },
        filterMap: function (fga, f) { return _function.pipe(fga, _filterMap(f)); },
        partition: function (fga, p) { return _function.pipe(fga, _partition(p)); },
        partitionMap: function (fga, f) { return _function.pipe(fga, _partitionMap(f)); }
    };
}
exports.getFilterableComposition = getFilterableComposition;
});

const Filterable$4 = /*@__PURE__*/getDefaultExportFromCjs(Filterable$3);

var FromIO$2 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = void 0;
/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */


function fromIOK(F) {
    return function (f) { return _function.flow(f, F.fromIO); };
}
exports.fromIOK = fromIOK;
function chainIOK(F, M) {
    return function (f) {
        var g = _function.flow(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
exports.chainIOK = chainIOK;
function chainFirstIOK(F, M) {
    var chainFirstM = Chain$8.chainFirst(M);
    return function (f) { return chainFirstM(_function.flow(f, F.fromIO)); };
}
exports.chainFirstIOK = chainFirstIOK;
});

const FromIO$3 = /*@__PURE__*/getDefaultExportFromCjs(FromIO$2);

var FromTask$2 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = void 0;
/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */


function fromTaskK(F) {
    return function (f) { return _function.flow(f, F.fromTask); };
}
exports.fromTaskK = fromTaskK;
function chainTaskK(F, M) {
    return function (f) {
        var g = _function.flow(f, F.fromTask);
        return function (first) { return M.chain(first, g); };
    };
}
exports.chainTaskK = chainTaskK;
function chainFirstTaskK(F, M) {
    var chainFirstM = Chain$8.chainFirst(M);
    return function (f) { return chainFirstM(_function.flow(f, F.fromTask)); };
}
exports.chainFirstTaskK = chainFirstTaskK;
});

const FromTask$3 = /*@__PURE__*/getDefaultExportFromCjs(FromTask$2);

var Task = createCommonjsModule(function (module, exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonoid = exports.getSemigroup = exports.taskSeq = exports.task = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.never = exports.FromTask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.chainFirst = exports.MonadTask = exports.fromTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.Functor = exports.getRaceMonoid = exports.URI = exports.flatten = exports.chain = exports.of = exports.ap = exports.map = exports.delay = exports.fromIO = void 0;
/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */






var _ = __importStar(internal);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromIO = function (ma) { return function () { return Promise.resolve().then(ma); }; };
exports.fromIO = fromIO;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = append('b')
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(log, ['a', 'b', 'd', 'c'])
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.0.0
 */
function delay(millis) {
    return function (ma) { return function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                // tslint:disable-next-line: no-floating-promises
                Promise.resolve().then(ma).then(resolve);
            }, millis);
        });
    }; };
}
exports.delay = delay;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return _function.pipe(fa, exports.map(f)); };
var _apPar = function (fab, fa) { return _function.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return _function.pipe(fab, exports.chain(function (f) { return _function.pipe(fa, exports.map(f)); }));
};
var _chain = function (ma, f) { return _function.pipe(ma, exports.chain(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return function () {
    return Promise.resolve().then(fa).then(f);
}; }; };
exports.map = map;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return function () {
    return Promise.all([Promise.resolve().then(fab), Promise.resolve().then(fa)]).then(function (_a) {
        var f = _a[0], a = _a[1];
        return f(a);
    });
}; }; };
exports.ap = ap;
/**
 * @category Pointed
 * @since 2.0.0
 */
var of = function (a) { return function () { return Promise.resolve(a); }; };
exports.of = of;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return function () {
    return Promise.resolve()
        .then(ma)
        .then(function (a) { return f(a)(); });
}; }; };
exports.chain = chain;
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(_function.identity);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'Task';
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
function getRaceMonoid() {
    return {
        concat: function (x, y) { return function () { return Promise.race([Promise.resolve().then(x), Promise.resolve().then(y)]); }; },
        empty: exports.never
    };
}
exports.getRaceMonoid = getRaceMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#__PURE__*/
Functor$9.flap(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply$6.apFirst(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply$6.apSecond(exports.ApplyPar);
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category FromTask
 * @since 2.7.0
 * @deprecated
 */
exports.fromTask = _function.identity;
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
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
exports.chainFirst = 
/*#__PURE__*/
Chain$8.chainFirst(exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO$2.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO$2.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO$2.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
var never = function () { return new Promise(function (_) { return undefined; }); };
exports.never = never;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor$9.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain$8.bind(exports.Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply$6.apS(exports.ApplyPar);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function () { return Promise.all(as.map(function (a, i) { return Promise.resolve().then(function () { return f(i, a)(); }); })); }; }; };
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (bs) {
            return Promise.resolve()
                .then(f(i + 1, a))
                .then(function (b) {
                bs.push(b);
                return bs;
            });
        });
    }, Promise.resolve()
        .then(f(0, _.head(as)))
        .then(_.singleton));
}; }; };
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(_function.identity);
/**
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) {
    return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); });
};
exports.traverseSeqArray = traverseSeqArray;
/**
 * @since 2.9.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/
exports.traverseSeqArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.task = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.taskSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = 
/*#__PURE__*/
Apply$6.getApplySemigroup(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getMonoid = 
/*#__PURE__*/
Applicative$6.getApplicativeMonoid(exports.ApplicativeSeq);
});

const Task$1 = /*@__PURE__*/getDefaultExportFromCjs(Task);

var TaskEither = createCommonjsModule(function (module, exports) {
"use strict";
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompactable = exports.getAltTaskValidation = exports.getApplicativeTaskValidation = exports.URI = exports.throwError = exports.of = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.chainW = exports.chain = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.chainIOEitherK = exports.chainIOEitherKW = exports.fromIOEitherK = exports.chainTaskOptionK = exports.fromTaskOptionK = exports.swap = exports.orLeft = exports.orElseFirstW = exports.orElseFirst = exports.orElseW = exports.orElse = exports.toUnion = exports.tryCatchK = exports.tryCatch = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTaskOption = exports.fromIOEither = exports.fromEither = exports.fromTask = exports.fromIO = exports.leftIO = exports.rightIO = exports.leftTask = exports.rightTask = exports.right = exports.left = void 0;
exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.bracket = exports.taskify = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.FromTask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.Alt = exports.Bifunctor = exports.chainFirstW = exports.chainFirst = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.Functor = exports.getFilterable = void 0;
exports.getTaskValidation = exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.taskEitherSeq = exports.taskEither = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = void 0;




var E = __importStar(Either);
var ET = __importStar(EitherT);






var _ = __importStar(internal);
var T = __importStar(Task);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = 
/*#__PURE__*/
ET.left(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = 
/*#__PURE__*/
ET.right(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = 
/*#__PURE__*/
ET.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = 
/*#__PURE__*/
ET.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = 
/*#__PURE__*/
_function.flow(T.fromIO, exports.rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = 
/*#__PURE__*/
_function.flow(T.fromIO, exports.leftTask);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category natural transformations
 * @since 2.7.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromEither = T.of;
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromIOEither = T.fromIO;
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromTaskOption = function (onNone) {
    return T.map(E.fromOption(onNone));
};
exports.fromTaskOption = fromTaskOption;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/
ET.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * @category destructors
 * @since 2.10.0
 */
exports.matchE = 
/*#__PURE__*/
ET.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = 
/*#__PURE__*/
ET.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
exports.getOrElseW = exports.getOrElse;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * Note: `f` should never `throw` errors, they are not caught.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onRejected) { return function () {
    return f().then(_.right, function (reason) { return _.left(onRejected(reason)); });
}; };
exports.tryCatch = tryCatch;
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
var tryCatchK = function (f, onRejected) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); }, onRejected);
}; };
exports.tryCatchK = tryCatchK;
/**
 * @category interop
 * @since 2.10.0
 */
exports.toUnion = 
/*#__PURE__*/
ET.toUnion(T.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/
ET.orElse(T.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
exports.orElseW = exports.orElse;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orElseFirst = 
/*#__PURE__*/
ET.orElseFirst(T.Monad);
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orElseFirstW = exports.orElseFirst;
/**
 * @category combinators
 * @since 2.11.0
 */
exports.orLeft = 
/*#__PURE__*/
ET.orLeft(T.Monad);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.swap = 
/*#__PURE__*/
ET.swap(T.Functor);
/**
 * @category combinators
 * @since 2.11.0
 */
var fromTaskOptionK = function (onNone) {
    var from = exports.fromTaskOption(onNone);
    return function (f) { return _function.flow(f, from); };
};
exports.fromTaskOptionK = fromTaskOptionK;
/**
 * @category combinators
 * @since 2.11.0
 */
var chainTaskOptionK = function (onNone) {
    return _function.flow(exports.fromTaskOptionK(onNone), exports.chain);
};
exports.chainTaskOptionK = chainTaskOptionK;
/**
 * @category combinators
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return _function.flow(f, exports.fromIOEither); };
exports.fromIOEitherK = fromIOEitherK;
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainIOEitherKW = function (f) { return exports.chainW(exports.fromIOEitherK(f)); };
exports.chainIOEitherKW = chainIOEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainIOEitherK = exports.chainIOEitherKW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return _function.pipe(fa, exports.map(f)); };
var _apPar = function (fab, fa) { return _function.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return _function.pipe(fab, exports.chain(function (f) { return _function.pipe(fa, exports.map(f)); }));
};
/* istanbul ignore next */
var _chain = function (ma, f) { return _function.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return _function.pipe(fa, exports.bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return _function.pipe(fa, exports.mapLeft(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return _function.pipe(fa, exports.alt(that)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
exports.map = 
/*#__PURE__*/
ET.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.bimap = 
/*#__PURE__*/
ET.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.mapLeft = 
/*#__PURE__*/
ET.mapLeft(T.Functor);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/
ET.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chain = 
/*#__PURE__*/
ET.chain(T.Monad);
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
exports.chainW = exports.chain;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/
exports.chainW(_function.identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = 
/*#__PURE__*/
ET.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @category Pointed
 * @since 2.0.0
 */
exports.of = exports.right;
/**
 * @category MonadTask
 * @since 2.7.0
 */
exports.throwError = exports.left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'TaskEither';
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeTaskValidation(A, S) {
    var ap = Apply$6.ap(A, E.getApplicativeValidation(S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return _function.pipe(fab, ap(fa)); },
        of: exports.of
    };
}
exports.getApplicativeTaskValidation = getApplicativeTaskValidation;
/**
 * @category instances
 * @since 2.7.0
 */
function getAltTaskValidation(S) {
    var alt = ET.altValidation(T.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return _function.pipe(fa, alt(that)); }
    };
}
exports.getAltTaskValidation = getAltTaskValidation;
/**
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: Compactable$3.compact(T.Functor, C),
        separate: Compactable$3.separate(T.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category instances
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = exports.getCompactable(M);
    var filter = Filterable$3.filter(T.Functor, F);
    var filterMap = Filterable$3.filterMap(T.Functor, F);
    var partition = Filterable$3.partition(T.Functor, F);
    var partitionMap = Filterable$3.partitionMap(T.Functor, F);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return _function.pipe(fa, filter(predicate)); },
        filterMap: function (fa, f) { return _function.pipe(fa, filterMap(f)); },
        partition: function (fa, predicate) { return _function.pipe(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return _function.pipe(fa, partitionMap(f)); }
    };
}
exports.getFilterable = getFilterable;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#__PURE__*/
Functor$9.flap(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply$6.apFirst(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply$6.apSecond(exports.ApplyPar);
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: _chain,
    of: exports.of,
    throwError: exports.throwError
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
exports.chainFirst = 
/*#__PURE__*/
Chain$8.chainFirst(exports.Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
exports.chainFirstW = exports.chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category natural transformations
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/
FromEither$5.fromOption(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/
FromEither$5.fromOptionK(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/
FromEither$5.chainOptionK(exports.FromEither, exports.Chain);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainEitherK = 
/*#__PURE__*/
FromEither$5.chainEitherK(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
exports.chainEitherKW = exports.chainEitherK;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = 
/*#__PURE__*/
FromEither$5.fromPredicate(exports.FromEither);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = 
/*#__PURE__*/
FromEither$5.filterOrElse(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither$5.fromEitherK(exports.FromEither);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO$2.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO$2.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO$2.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromTaskK = 
/*#__PURE__*/
FromTask$2.fromTaskK(exports.FromTask);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainTaskK = 
/*#__PURE__*/
FromTask$2.chainTaskK(exports.FromTask, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstTaskK = 
/*#__PURE__*/
FromTask$2.chainFirstTaskK(exports.FromTask, exports.Chain);
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) { return (e != null ? resolve(_.left(e)) : resolve(_.right(r))); };
                f.apply(null, args.concat(cbResolver));
            });
        };
    };
}
exports.taskify = taskify;
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) {
    return _function.pipe(acquire, exports.chain(function (a) {
        return _function.pipe(use(a), T.chain(function (e) {
            return _function.pipe(release(a, e), exports.chain(function () { return T.of(e); }));
        }));
    }));
};
exports.bracket = bracket;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor$9.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain$8.bind(exports.Chain);
/**
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply$6.apS(exports.ApplyPar);
/**
 * @since 2.8.0
 */
exports.apSW = exports.apS;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return _function.flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(_function.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
            return _.isLeft(ebs)
                ? acc
                : f(i + 1, a)().then(function (eb) {
                    if (_.isLeft(eb)) {
                        return eb;
                    }
                    ebs.right.push(eb.right);
                    return ebs;
                });
        });
    }, f(0, _.head(as))().then(E.map(_.singleton)));
}; }; };
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
var traverseArray = function (f) { return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(_function.identity);
/**
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * @since 2.9.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/
exports.traverseSeqArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.taskEither = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: _chain,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.taskEitherSeq = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: _chain,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/
Apply$6.getApplySemigroup(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative$6.getApplicativeMonoid(exports.ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return Apply$6.getApplySemigroup(T.ApplySeq)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getTaskValidation(SE) {
    var applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE);
    var altTaskValidation = getAltTaskValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: applicativeTaskValidation.ap,
        of: exports.of,
        chain: _chain,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altTaskValidation.alt,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask,
        throwError: exports.throwError
    };
}
exports.getTaskValidation = getTaskValidation;
});

const TaskEither$1 = /*@__PURE__*/getDefaultExportFromCjs(TaskEither);

const appendToMap = (map, propName, value) => {
    const items = map.get(propName);
    if (!items) {
        map.set(propName, [value]);
    }
    else if (!items.includes(value)) {
        items.push(value);
    }
};
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce((map) => {
    for (let key of map.keys()) {
        map.set(key, map.get(key).filter(isConnected));
    }
}, 2000);
const stencilSubscription = () => {
    if (typeof getRenderingRef !== 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        return {};
    }
    const elmsToUpdate = new Map();
    return {
        dispose: () => elmsToUpdate.clear(),
        get: (propName) => {
            const elm = getRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        },
        set: (propName) => {
            const elements = elmsToUpdate.get(propName);
            if (elements) {
                elmsToUpdate.set(propName, elements.filter(forceUpdate));
            }
            cleanupElements(elmsToUpdate);
        },
        reset: () => {
            elmsToUpdate.forEach((elms) => elms.forEach(forceUpdate));
            cleanupElements(elmsToUpdate);
        },
    };
};

const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    let states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    const reset = () => {
        states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (typeof Proxy === 'undefined'
        ? {}
        : new Proxy(defaultState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        }));
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const unSet = on('set', (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        });
        const unReset = on('reset', () => cb(defaultState[propName]));
        return () => {
            unSet();
            unReset();
        };
    };
    const use = (...subscriptions) => {
        const unsubs = subscriptions.reduce((unsubs, subscription) => {
            if (subscription.set) {
                unsubs.push(on('set', subscription.set));
            }
            if (subscription.get) {
                unsubs.push(on('get', subscription.get));
            }
            if (subscription.reset) {
                unsubs.push(on('reset', subscription.reset));
            }
            if (subscription.dispose) {
                unsubs.push(on('dispose', subscription.dispose));
            }
            return unsubs;
        }, []);
        return () => unsubs.forEach((unsub) => unsub());
    };
    const forceUpdate = (key) => {
        const oldValue = states.get(key);
        handlers.set.forEach((cb) => cb(key, oldValue, oldValue));
    };
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
        forceUpdate,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    map.use(stencilSubscription());
    return map;
};

const store = createStore({
  fallbackStyles: "",
  pricePrefix: null,
  currencySign: null,
  apiPath: undefined,
  locale: "de-DE",
});
const state$1 = store.state;
const dispose = store.dispose;
const state$2 = store.state;

function ap$9(F, G) {
    return function (fa) { return function (fab) {
        return F.ap(F.map(fab, function (gab) { return function (ga) { return G.ap(gab, ga); }; }), fa);
    }; };
}
function apFirst$8(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function (a) { return function () { return a; }; }), second);
    }; };
}
function apSecond$8(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function () { return function (b) { return b; }; }), second);
    }; };
}
function apS$8(F) {
    return function (name, fb) { return function (fa) {
        return F.ap(F.map(fa, function (a) { return function (b) {
            var _a;
            return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
        }; }), fb);
    }; };
}
function getApplySemigroup$3(F) {
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
        tupleConstructors[len] = curried(tuple, len - 1, []);
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
function map$a(F, G) {
    return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
}
function flap$9(F) {
    return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
}
function bindTo$8(F) {
    return function (name) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return (_a = {}, _a[name] = a, _a);
    }); }; };
}
/** @deprecated */
function getFunctorComposition(F, G) {
    var _map = map$a(F, G);
    return {
        map: function (fga, f) { return pipe(fga, _map(f)); }
    };
}

/**
 * The `Applicative` type class extends the `Apply` type class with a `of` function, which can be used to create values
 * of type `f a` from values of type `a`.
 *
 * Where `Apply` provides the ability to lift functions of two or more arguments to functions whose arguments are
 * wrapped using `f`, and `Functor` provides the ability to lift functions of one argument, `pure` can be seen as the
 * function which lifts functions of _zero_ arguments. That is, `Applicative` functors support a lifting operation for
 * any number of function arguments.
 *
 * Instances must satisfy the following laws in addition to the `Apply` laws:
 *
 * 1. Identity: `A.ap(A.of(a => a), fa) <-> fa`
 * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) <-> A.of(ab(a))`
 * 3. Interchange: `A.ap(fab, A.of(a)) <-> A.ap(A.of(ab => ab(a)), fab)`
 *
 * Note. `Functor`'s `map` can be derived: `A.map(x, f) = A.ap(A.of(f), x)`
 *
 * @since 2.0.0
 */
function getApplicativeMonoid(F) {
    var f = getApplySemigroup$3(F);
    return function (M) { return ({
        concat: f(M).concat,
        empty: F.of(M.empty)
    }); };
}
/** @deprecated */
function getApplicativeComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    var _ap = ap$9(F, G);
    return {
        map: map,
        of: function (a) { return F.of(G.of(a)); },
        ap: function (fgab, fga) { return pipe(fgab, _ap(fga)); }
    };
}

function chainFirst$8(M) {
    return function (f) { return function (first) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); }; };
}
function bind$8(M) {
    return function (name, f) { return function (ma) { return M.chain(ma, function (a) { return M.map(f(a), function (b) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
    }); }); }; };
}

/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
    var ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};

/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */
function fromOption$4(F) {
    return function (onNone) { return function (ma) { return F.fromEither(isNone$1(ma) ? left$4(onNone()) : right$4(ma.value)); }; };
}
function fromPredicate$5(F) {
    return function (predicate, onFalse) { return function (a) {
        return F.fromEither(predicate(a) ? right$4(a) : left$4(onFalse(a)));
    }; };
}
function fromOptionK$4(F) {
    var fromOptionF = fromOption$4(F);
    return function (onNone) {
        var from = fromOptionF(onNone);
        return function (f) { return flow(f, from); };
    };
}
function chainOptionK$2(F, M) {
    var fromOptionKF = fromOptionK$4(F);
    return function (onNone) {
        var from = fromOptionKF(onNone);
        return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
    };
}
function fromEitherK$4(F) {
    return function (f) { return flow(f, F.fromEither); };
}
function chainEitherK$2(F, M) {
    var fromEitherKF = fromEitherK$4(F);
    return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
}
function filterOrElse$2(F, M) {
    return function (predicate, onFalse) { return function (ma) {
        return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? right$4(a) : left$4(onFalse(a))); });
    }; };
}

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
var _map$8 = function (fa, f) { return pipe(fa, map$9(f)); };
var _mapLeft$2 = function (fa, f) { return pipe(fa, mapLeft$3(f)); };
var _bimap$2 = function (fa, g, f) { return pipe(fa, bimap$3(g, f)); };
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
var map$9 = function (f) { return function (fa) {
    return separated(left$3(fa), f(right$3(fa)));
}; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
var mapLeft$3 = function (f) { return function (fa) {
    return separated(f(left$3(fa)), right$3(fa));
}; };
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
var bimap$3 = function (f, g) { return function (fa) {
    return separated(f(left$3(fa)), g(right$3(fa)));
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var URI$9 = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
var Bifunctor$2 = {
    URI: URI$9,
    mapLeft: _mapLeft$2,
    bimap: _bimap$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Functor$8 = {
    URI: URI$9,
    map: _map$8
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$8 = 
/*#__PURE__*/
flap$9(Functor$8);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var left$3 = function (s) { return s.left; };
/**
 * @since 2.10.0
 */
var right$3 = function (s) { return s.right; };

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
        return function (predicate) { return function (ga) { return witherF(ga, function (a) { return F.map(predicate(a), function (b) { return (b ? some$3(a) : none$1); }); }); }; };
    };
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var left$2 = left$4;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var right$2 = right$4;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$7 = function (fa, f) { return pipe(fa, map$8(f)); };
var _ap$5 = function (fab, fa) { return pipe(fab, ap$8(fa)); };
/* istanbul ignore next */
var _chain$7 = function (ma, f) { return pipe(ma, chain$8(f)); };
/* istanbul ignore next */
var _reduce$5 = function (fa, b, f) { return pipe(fa, reduce$5(b, f)); };
/* istanbul ignore next */
var _foldMap$5 = function (M) { return function (fa, f) {
    var foldMapM = foldMap$5(M);
    return pipe(fa, foldMapM(f));
}; };
/* istanbul ignore next */
var _reduceRight$5 = function (fa, b, f) { return pipe(fa, reduceRight$5(b, f)); };
var _traverse$5 = function (F) {
    var traverseF = traverse$5(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
var _bimap$1 = function (fa, f, g) { return pipe(fa, bimap$2(f, g)); };
var _mapLeft$1 = function (fa, f) { return pipe(fa, mapLeft$2(f)); };
/* istanbul ignore next */
var _alt$6 = function (fa, that) { return pipe(fa, alt$7(that)); };
/* istanbul ignore next */
var _extend$5 = function (wa, f) { return pipe(wa, extend$5(f)); };
var _chainRec = function (a, f) {
    return tailRec(f(a), function (e) {
        return isLeft(e) ? right$2(left$2(e.left)) : isLeft(e.right) ? left$2(f(e.right.left)) : right$2(right$2(e.right.right));
    });
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$8 = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$5 = function (SE, SA) { return ({
    show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
}); };
/**
 * @category instances
 * @since 2.0.0
 */
var getEq$5 = function (EL, EA) { return ({
    equals: function (x, y) {
        return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
    }
}); };
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup$6 = function (S) { return ({
    concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right$2(S.concat(x.right, y.right))); }
}); };
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category instances
 * @since 2.10.0
 */
var getCompactable$1 = function (M) {
    var empty = left$2(M.empty);
    return {
        URI: URI$8,
        _E: undefined,
        compact: function (ma) { return (isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : right$2(ma.right.value)); },
        separate: function (ma) {
            return isLeft(ma)
                ? separated(ma, ma)
                : isLeft(ma.right)
                    ? separated(right$2(ma.right.left), empty)
                    : separated(empty, right$2(ma.right.right));
        }
    };
};
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.10.0
 */
var getFilterable$1 = function (M) {
    var empty = left$2(M.empty);
    var _a = getCompactable$1(M), compact = _a.compact, separate = _a.separate;
    var filter = function (ma, predicate) {
        return isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    var partition = function (ma, p) {
        return isLeft(ma)
            ? separated(ma, ma)
            : p(ma.right)
                ? separated(empty, right$2(ma.right))
                : separated(right$2(ma.right), empty);
    };
    return {
        URI: URI$8,
        _E: undefined,
        map: _map$7,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: function (ma, f) {
            if (isLeft(ma)) {
                return ma;
            }
            var ob = f(ma.right);
            return ob._tag === 'None' ? empty : right$2(ob.value);
        },
        partition: partition,
        partitionMap: function (ma, f) {
            if (isLeft(ma)) {
                return separated(ma, ma);
            }
            var e = f(ma.right);
            return isLeft(e) ? separated(right$2(e.left), empty) : separated(empty, right$2(e.right));
        }
    };
};
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.0.0
 */
var getWitherable = function (M) {
    var F_ = getFilterable$1(M);
    var C = getCompactable$1(M);
    return {
        URI: URI$8,
        _E: undefined,
        map: _map$7,
        compact: F_.compact,
        separate: F_.separate,
        filter: F_.filter,
        filterMap: F_.filterMap,
        partition: F_.partition,
        partitionMap: F_.partitionMap,
        traverse: _traverse$5,
        sequence: sequence$5,
        reduce: _reduce$5,
        foldMap: _foldMap$5,
        reduceRight: _reduceRight$5,
        wither: witherDefault(Traversable$5, C),
        wilt: wiltDefault(Traversable$5, C)
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var getApplicativeValidation = function (SE) { return ({
    URI: URI$8,
    _E: undefined,
    map: _map$7,
    ap: function (fab, fa) {
        return isLeft(fab)
            ? isLeft(fa)
                ? left$2(SE.concat(fab.left, fa.left))
                : fab
            : isLeft(fa)
                ? fa
                : right$2(fab.right(fa.right));
    },
    of: of$7
}); };
/**
 * @category instances
 * @since 2.7.0
 */
var getAltValidation = function (SE) { return ({
    URI: URI$8,
    _E: undefined,
    map: _map$7,
    alt: function (me, that) {
        if (isRight(me)) {
            return me;
        }
        var ea = that();
        return isLeft(ea) ? left$2(SE.concat(me.left, ea.left)) : ea;
    }
}); };
/**
 * @category instance operations
 * @since 2.0.0
 */
var map$8 = function (f) { return function (fa) {
    return isLeft(fa) ? fa : right$2(f(fa.right));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$7 = {
    URI: URI$8,
    map: _map$7
};
/**
 * @category instance operations
 * @since 2.7.0
 */
var of$7 = right$2;
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$7 = {
    URI: URI$8,
    of: of$7
};
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category instance operations
 * @since 2.8.0
 */
var apW$1 = function (fa) { return function (fab) { return (isLeft(fab) ? fab : isLeft(fa) ? fa : right$2(fab.right(fa.right))); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var ap$8 = apW$1;
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$5 = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5
};
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$5 = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5,
    of: of$7
};
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category instance operations
 * @since 2.6.0
 */
var chainW$1 = function (f) { return function (ma) {
    return isLeft(ma) ? ma : f(ma.right);
}; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain$8 = chainW$1;
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$7 = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5,
    chain: _chain$7
};
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$7 = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5,
    of: of$7,
    chain: _chain$7
};
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var reduce$5 = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(b, fa.right);
}; };
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var foldMap$5 = function (M) { return function (f) { return function (fa) {
    return isLeft(fa) ? M.empty : f(fa.right);
}; }; };
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var reduceRight$5 = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(fa.right, b);
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$5 = {
    URI: URI$8,
    reduce: _reduce$5,
    foldMap: _foldMap$5,
    reduceRight: _reduceRight$5
};
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category instance operations
 * @since 2.6.3
 */
var traverse$5 = function (F) { return function (f) { return function (ta) { return (isLeft(ta) ? F.of(left$2(ta.left)) : F.map(f(ta.right), right$2)); }; }; };
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category instance operations
 * @since 2.6.3
 */
var sequence$5 = function (F) { return function (ma) {
    return isLeft(ma) ? F.of(left$2(ma.left)) : F.map(ma.right, right$2);
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$5 = {
    URI: URI$8,
    map: _map$7,
    reduce: _reduce$5,
    foldMap: _foldMap$5,
    reduceRight: _reduceRight$5,
    traverse: _traverse$5,
    sequence: sequence$5
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var bimap$2 = function (f, g) { return function (fa) { return (isLeft(fa) ? left$2(f(fa.left)) : right$2(g(fa.right))); }; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category instance operations
 * @since 2.0.0
 */
var mapLeft$2 = function (f) { return function (fa) {
    return isLeft(fa) ? left$2(f(fa.left)) : fa;
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Bifunctor$1 = {
    URI: URI$8,
    bimap: _bimap$1,
    mapLeft: _mapLeft$1
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category instance operations
 * @since 2.9.0
 */
var altW$6 = function (that) { return function (fa) { return (isLeft(fa) ? that() : fa); }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category instance operations
 * @since 2.0.0
 */
var alt$7 = altW$6;
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$6 = {
    URI: URI$8,
    map: _map$7,
    alt: _alt$6
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var extend$5 = function (f) { return function (wa) {
    return isLeft(wa) ? wa : right$2(f(wa));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Extend$3 = {
    URI: URI$8,
    map: _map$7,
    extend: _extend$5
};
/**
 * @category instances
 * @since 2.7.0
 */
var ChainRec = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5,
    chain: _chain$7,
    chainRec: _chainRec
};
/**
 * @category instance operations
 * @since 2.6.3
 */
var throwError$2 = left$2;
/**
 * @category instances
 * @since 2.7.0
 */
var MonadThrow$2 = {
    URI: URI$8,
    map: _map$7,
    ap: _ap$5,
    of: of$7,
    chain: _chain$7,
    throwError: throwError$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var FromEither$4 = {
    URI: URI$8,
    fromEither: identity
};
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
var fromPredicate$4 = 
/*#__PURE__*/
fromPredicate$5(FromEither$4);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category natural transformations
 * @since 2.0.0
 */
var fromOption$3 = 
/*#__PURE__*/
fromOption$4(FromEither$4);
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isLeft = isLeft$1;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
var isRight = isRight$1;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW$4 = function (onLeft, onRight) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
}; };
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category destructors
 * @since 2.10.0
 */
var foldW$2 = matchW$4;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match$5 = matchW$4;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold$4 = match$5;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW$2 = function (onLeft) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma.right;
}; };
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
var getOrElse$3 = getOrElseW$2;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$7 = 
/*#__PURE__*/
flap$9(Functor$7);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst$7 = 
/*#__PURE__*/
apFirst$8(Apply$5);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond$7 = 
/*#__PURE__*/
apSecond$8(Apply$5);
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst$7 = 
/*#__PURE__*/
chainFirst$8(Chain$7);
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
var chainFirstW$1 = chainFirst$7;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
var flattenW$1 = 
/*#__PURE__*/
chainW$1(identity);
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * Derivable from `Chain`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category combinators
 * @since 2.0.0
 */
var flatten$7 = flattenW$1;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
var duplicate$5 = 
/*#__PURE__*/
extend$5(identity);
/**
 * @category combinators
 * @since 2.10.0
 */
var fromOptionK$3 = 
/*#__PURE__*/
fromOptionK$4(FromEither$4);
/**
 * @category combinators
 * @since 2.11.0
 */
var chainOptionK$1 = 
/*#__PURE__*/
chainOptionK$2(FromEither$4, Chain$7);
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category combinators
 * @since 2.0.0
 */
var filterOrElse$1 = 
/*#__PURE__*/
filterOrElse$2(FromEither$4, Chain$7);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
var filterOrElseW$1 = filterOrElse$1;
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @category combinators
 * @since 2.0.0
 */
var swap$2 = function (ma) { return (isLeft(ma) ? right$2(ma.left) : left$2(ma.right)); };
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
var orElseW$1 = function (onLeft) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma;
}; };
/**
 * Useful for recovering from errors.
 *
 * @category combinators
 * @since 2.0.0
 */
var orElse$2 = orElseW$1;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable$1 = function (e) { return function (a) {
    return a == null ? left$2(e) : right$2(a);
}; };
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch$2 = function (f, onThrow) {
    try {
        return right$2(f());
    }
    catch (e) {
        return left$2(onThrow(e));
    }
};
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK$2 = function (f, onThrow) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return tryCatch$2(function () { return f.apply(void 0, a); }, onThrow);
}; };
/**
 * @category interop
 * @since 2.9.0
 */
var fromNullableK$1 = function (e) {
    var from = fromNullable$1(e);
    return function (f) { return flow(f, from); };
};
/**
 * @category interop
 * @since 2.9.0
 */
var chainNullableK$1 = function (e) {
    var from = fromNullableK$1(e);
    return function (f) { return chain$8(from(f)); };
};
/**
 * @category interop
 * @since 2.10.0
 */
var toUnion$2 = 
/*#__PURE__*/
foldW$2(identity, identity);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
function elem$3(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem$3(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return isLeft(ma) ? false : E.equals(a, ma.right);
    };
}
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
var exists$3 = function (predicate) { return function (ma) {
    return isLeft(ma) ? false : predicate(ma.right);
}; };
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$7 = 
/*#__PURE__*/
of$7(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$7 = 
/*#__PURE__*/
bindTo$8(Functor$7);
/**
 * @since 2.8.0
 */
var bind$7 = 
/*#__PURE__*/
bind$8(Chain$7);
/**
 * @since 2.8.0
 */
var bindW$1 = bind$7;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$7 = 
/*#__PURE__*/
apS$8(Apply$5);
/**
 * @since 2.8.0
 */
var apSW$1 = apS$7;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var ApT$3 = 
/*#__PURE__*/
of$7(emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex$3 = function (f) { return function (as) {
    var e = f(0, head$4(as));
    if (isLeft(e)) {
        return e;
    }
    var out = [e.right];
    for (var i = 1; i < as.length; i++) {
        var e_1 = f(i, as[i]);
        if (isLeft(e_1)) {
            return e_1;
        }
        out.push(e_1.right);
    }
    return right$2(out);
}; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex$3 = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex$3(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT$3); };
};
/**
 * @since 2.9.0
 */
var traverseArrayWithIndex$3 = traverseReadonlyArrayWithIndex$3;
/**
 * @since 2.9.0
 */
var traverseArray$3 = function (f) { return traverseReadonlyArrayWithIndex$3(function (_, a) { return f(a); }); };
/**
 * @since 2.9.0
 */
var sequenceArray$3 = 
/*#__PURE__*/
traverseArray$3(identity);
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
function parseJSON(s, onError) {
    return tryCatch$2(function () { return JSON.parse(s); }, onError);
}
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
    return tryCatch$2(function () {
        var s = JSON.stringify(u);
        if (typeof s !== 'string') {
            throw new Error('Converting unsupported structure to JSON');
        }
        return s;
    }, onError);
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var either = {
    URI: URI$8,
    map: _map$7,
    of: of$7,
    ap: _ap$5,
    chain: _chain$7,
    reduce: _reduce$5,
    foldMap: _foldMap$5,
    reduceRight: _reduceRight$5,
    traverse: _traverse$5,
    sequence: sequence$5,
    bimap: _bimap$1,
    mapLeft: _mapLeft$1,
    alt: _alt$6,
    extend: _extend$5,
    chainRec: _chainRec,
    throwError: throwError$2
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplySemigroup$2 = 
/*#__PURE__*/
getApplySemigroup$3(Apply$5);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplyMonoid$2 = 
/*#__PURE__*/
getApplicativeMonoid(Applicative$5);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationSemigroup = function (SE, SA) {
    return getApplySemigroup$3(getApplicativeValidation(SE))(SA);
};
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationMonoid = function (SE, MA) {
    return getApplicativeMonoid(getApplicativeValidation(SE))(MA);
};
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getValidation(SE) {
    var ap = getApplicativeValidation(SE).ap;
    var alt = getAltValidation(SE).alt;
    return {
        URI: URI$8,
        _E: undefined,
        map: _map$7,
        of: of$7,
        chain: _chain$7,
        bimap: _bimap$1,
        mapLeft: _mapLeft$1,
        reduce: _reduce$5,
        foldMap: _foldMap$5,
        reduceRight: _reduceRight$5,
        extend: _extend$5,
        traverse: _traverse$5,
        sequence: sequence$5,
        chainRec: _chainRec,
        throwError: throwError$2,
        ap: ap,
        alt: alt
    };
}

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
var contramap_ = function (predicate, f) { return pipe(predicate, contramap(f)); };
/**
 * @category Contravariant
 * @since 2.11.0
 */
var contramap = function (f) { return function (predicate) { return flow(f, predicate); }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.11.0
 */
var URI$7 = 'Predicate';
/**
 * @category instances
 * @since 2.11.0
 */
var getSemigroupAny = function () { return ({
    concat: function (first, second) { return pipe(first, or(second)); }
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var getMonoidAny = function () { return ({
    concat: getSemigroupAny().concat,
    empty: constFalse
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var getSemigroupAll = function () { return ({
    concat: function (first, second) { return pipe(first, and(second)); }
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var getMonoidAll = function () { return ({
    concat: getSemigroupAll().concat,
    empty: constTrue
}); };
/**
 * @category instances
 * @since 2.11.0
 */
var Contravariant = {
    URI: URI$7,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var not = function (predicate) { return function (a) { return !predicate(a); }; };
/**
 * @since 2.11.0
 */
var or = function (second) { return function (first) { return function (a) { return first(a) || second(a); }; }; };
/**
 * @since 2.11.0
 */
var and = function (second) { return function (first) { return function (a) { return first(a) && second(a); }; }; };

function guard$3(F, P) {
    return function (b) { return (b ? P.of(undefined) : F.zero()); };
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
var none = none$1;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
var some$2 = some$3;
function fromPredicate$3(predicate) {
    return function (a) { return (predicate(a) ? some$2(a) : none); };
}
/**
 * Returns the `Left` value of an `Either` if possible.
 *
 * @example
 * import { getLeft, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 *
 * @category constructors
 * @since 2.0.0
 */
var getLeft = function (ma) { return (ma._tag === 'Right' ? none : some$2(ma.left)); };
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
var getRight = function (ma) { return (ma._tag === 'Left' ? none : some$2(ma.right)); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$6 = function (fa, f) { return pipe(fa, map$7(f)); };
var _ap$4 = function (fab, fa) { return pipe(fab, ap$7(fa)); };
var _chain$6 = function (ma, f) { return pipe(ma, chain$7(f)); };
var _reduce$4 = function (fa, b, f) { return pipe(fa, reduce$4(b, f)); };
var _foldMap$4 = function (M) {
    var foldMapM = foldMap$4(M);
    return function (fa, f) { return pipe(fa, foldMapM(f)); };
};
var _reduceRight$4 = function (fa, b, f) { return pipe(fa, reduceRight$4(b, f)); };
var _traverse$4 = function (F) {
    var traverseF = traverse$4(F);
    return function (ta, f) { return pipe(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt$5 = function (fa, that) { return pipe(fa, alt$6(that)); };
var _filter$2 = function (fa, predicate) { return pipe(fa, filter$5(predicate)); };
/* istanbul ignore next */
var _filterMap$2 = function (fa, f) { return pipe(fa, filterMap$3(f)); };
/* istanbul ignore next */
var _extend$4 = function (wa, f) { return pipe(wa, extend$4(f)); };
/* istanbul ignore next */
var _partition$2 = function (fa, predicate) {
    return pipe(fa, partition$3(predicate));
};
/* istanbul ignore next */
var _partitionMap$2 = function (fa, f) { return pipe(fa, partitionMap$3(f)); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$6 = 'Option';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$4 = function (S) { return ({
    show: function (ma) { return (isNone(ma) ? 'none' : "some(" + S.show(ma.value) + ")"); }
}); };
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq$4 = function (E) { return ({
    equals: function (x, y) { return x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x.value, y.value)); }
}); };
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const O = getOrd(N.Ord)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @category instances
 * @since 2.0.0
 */
var getOrd$2 = function (O) { return ({
    equals: getEq$4(O).equals,
    compare: function (x, y) { return (x === y ? 0 : isSome(x) ? (isSome(y) ? O.compare(x.value, y.value) : 1) : -1); }
}); };
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(b) | some(b)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/Option'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const M = getMonoid(SemigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid$3 = function (S) { return ({
    concat: function (x, y) { return (isNone(x) ? y : isNone(y) ? x : some$2(S.concat(x.value, y.value))); },
    empty: none
}); };
/**
 * @category instance operations
 * @since 2.0.0
 */
var map$7 = function (f) { return function (fa) {
    return isNone(fa) ? none : some$2(f(fa.value));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$6 = {
    URI: URI$6,
    map: _map$6
};
/**
 * @category instance operations
 * @since 2.7.0
 */
var of$6 = some$2;
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$6 = {
    URI: URI$6,
    of: of$6
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var ap$7 = function (fa) { return function (fab) {
    return isNone(fab) ? none : isNone(fa) ? none : some$2(fab.value(fa.value));
}; };
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$4 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4
};
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$4 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4,
    of: of$6
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category instance operations
 * @since 2.0.0
 */
var chain$7 = function (f) { return function (ma) {
    return isNone(ma) ? none : f(ma.value);
}; };
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$6 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4,
    chain: _chain$6
};
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$6 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4,
    of: of$6,
    chain: _chain$6
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var reduce$4 = function (b, f) { return function (fa) {
    return isNone(fa) ? b : f(b, fa.value);
}; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var foldMap$4 = function (M) { return function (f) { return function (fa) {
    return isNone(fa) ? M.empty : f(fa.value);
}; }; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var reduceRight$4 = function (b, f) { return function (fa) {
    return isNone(fa) ? b : f(fa.value, b);
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$4 = {
    URI: URI$6,
    reduce: _reduce$4,
    foldMap: _foldMap$4,
    reduceRight: _reduceRight$4
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category instance operations
 * @since 2.9.0
 */
var altW$5 = function (that) { return function (fa) {
    return isNone(fa) ? that() : fa;
}; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Option` returns the left-most non-`None` value.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.alt(() => O.some('b'))
 *   ),
 *   O.some('b')
 * )
 *
 * @category instance operations
 * @since 2.0.0
 */
var alt$6 = altW$5;
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$5 = {
    URI: URI$6,
    map: _map$6,
    alt: _alt$5
};
/**
 * @category instance operations
 * @since 2.7.0
 */
var zero$2 = function () { return none; };
/**
 * @category instances
 * @since 2.11.0
 */
var Zero$2 = {
    URI: URI$6,
    zero: zero$2
};
/**
 * @category constructors
 * @since 2.11.0
 */
var guard$2 = 
/*#__PURE__*/
guard$3(Zero$2, Pointed$6);
/**
 * @category instances
 * @since 2.7.0
 */
var Alternative$2 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4,
    of: of$6,
    alt: _alt$5,
    zero: zero$2
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var extend$4 = function (f) { return function (wa) {
    return isNone(wa) ? none : some$2(f(wa));
}; };
/**
 * @category instances
 * @since 2.7.0
 */
var Extend$2 = {
    URI: URI$6,
    map: _map$6,
    extend: _extend$4
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var compact$3 = 
/*#__PURE__*/
chain$7(identity);
var defaultSeparated = 
/*#__PURE__*/
separated(none, none);
/**
 * @category instance operations
 * @since 2.0.0
 */
var separate$3 = function (ma) {
    return isNone(ma) ? defaultSeparated : separated(getLeft(ma.value), getRight(ma.value));
};
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable$2 = {
    URI: URI$6,
    compact: compact$3,
    separate: separate$3
};
/**
 * @category instance operations
 * @since 2.0.0
 */
var filter$5 = function (predicate) { return function (fa) { return (isNone(fa) ? none : predicate(fa.value) ? fa : none); }; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var filterMap$3 = function (f) { return function (fa) {
    return isNone(fa) ? none : f(fa.value);
}; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var partition$3 = function (predicate) { return function (fa) { return separated(_filter$2(fa, not(predicate)), _filter$2(fa, predicate)); }; };
/**
 * @category instance operations
 * @since 2.0.0
 */
var partitionMap$3 = function (f) { return flow(map$7(f), separate$3); };
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable$2 = {
    URI: URI$6,
    map: _map$6,
    compact: compact$3,
    separate: separate$3,
    filter: _filter$2,
    filterMap: _filterMap$2,
    partition: _partition$2,
    partitionMap: _partitionMap$2
};
/**
 * @category instance operations
 * @since 2.6.3
 */
var traverse$4 = function (F) { return function (f) { return function (ta) { return (isNone(ta) ? F.of(none) : F.map(f(ta.value), some$2)); }; }; };
/**
 * @category instance operations
 * @since 2.6.3
 */
var sequence$4 = function (F) { return function (ta) { return (isNone(ta) ? F.of(none) : F.map(ta.value, some$2)); }; };
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$4 = {
    URI: URI$6,
    map: _map$6,
    reduce: _reduce$4,
    foldMap: _foldMap$4,
    reduceRight: _reduceRight$4,
    traverse: _traverse$4,
    sequence: sequence$4
};
var _wither$2 = 
/*#__PURE__*/
witherDefault(Traversable$4, Compactable$2);
var _wilt$2 = 
/*#__PURE__*/
wiltDefault(Traversable$4, Compactable$2);
/**
 * @category instance operations
 * @since 2.6.5
 */
var wither$2 = function (F) {
    var _witherF = _wither$2(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
/**
 * @category instance operations
 * @since 2.6.5
 */
var wilt$2 = function (F) {
    var _wiltF = _wilt$2(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Witherable$2 = {
    URI: URI$6,
    map: _map$6,
    reduce: _reduce$4,
    foldMap: _foldMap$4,
    reduceRight: _reduceRight$4,
    traverse: _traverse$4,
    sequence: sequence$4,
    compact: compact$3,
    separate: separate$3,
    filter: _filter$2,
    filterMap: _filterMap$2,
    partition: _partition$2,
    partitionMap: _partitionMap$2,
    wither: _wither$2,
    wilt: _wilt$2
};
/**
 * @category instance operations
 * @since 2.7.0
 */
var throwError$1 = function () { return none; };
/**
 * @category instances
 * @since 2.7.0
 */
var MonadThrow$1 = {
    URI: URI$6,
    map: _map$6,
    ap: _ap$4,
    of: of$6,
    chain: _chain$6,
    throwError: throwError$1
};
/**
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getright)
 *
 * @category natural transformations
 * @since 2.0.0
 */
var fromEither$3 = getRight;
/**
 * @category instances
 * @since 2.11.0
 */
var FromEither$3 = {
    URI: URI$6,
    fromEither: fromEither$3
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category refinements
 * @since 2.0.0
 */
var isSome = isSome$1;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW$3 = function (onNone, onSome) { return function (ma) {
    return isNone(ma) ? onNone() : onSome(ma.value);
}; };
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category destructors
 * @since 2.10.0
 */
var foldW$1 = matchW$3;
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match$4 = matchW$3;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold$3 = match$4;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW$1 = function (onNone) { return function (ma) { return (isNone(ma) ? onNone() : ma.value); }; };
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
var getOrElse$2 = getOrElseW$1;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$6 = 
/*#__PURE__*/
flap$9(Functor$6);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst$6 = 
/*#__PURE__*/
apFirst$8(Apply$4);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond$6 = 
/*#__PURE__*/
apSecond$8(Apply$4);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var flatten$6 = compact$3;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst$6 = 
/*#__PURE__*/
chainFirst$8(Chain$6);
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
var duplicate$4 = 
/*#__PURE__*/
extend$4(identity);
/**
 * @category combinators
 * @since 2.11.0
 */
var fromEitherK$3 = 
/*#__PURE__*/
fromEitherK$4(FromEither$3);
/**
 * @category combinators
 * @since 2.11.0
 */
var chainEitherK$1 = 
/*#__PURE__*/
chainEitherK$2(FromEither$3, Chain$6);
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (a) { return (a == null ? none : some$2(a)); };
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch$1 = function (f) {
    try {
        return some$2(f());
    }
    catch (e) {
        return none;
    }
};
/**
 * Converts a function that may throw to one returning a `Option`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK$1 = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return tryCatch$1(function () { return f.apply(void 0, a); });
}; };
/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { fromNullableK, none, some } from 'fp-ts/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = fromNullableK(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category interop
 * @since 2.9.0
 */
var fromNullableK = function (f) { return flow(f, fromNullable); };
/**
 * This is `chain` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, chainNullableK } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Employee {
 *   readonly company?: {
 *     readonly address?: {
 *       readonly street?: {
 *         readonly name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category interop
 * @since 2.9.0
 */
var chainNullableK = function (f) { return function (ma) {
    return isNone(ma) ? none : fromNullable(f(ma.value));
}; };
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @category interop
 * @since 2.0.0
 */
var toNullable = 
/*#__PURE__*/
match$4(constNull, identity);
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category interop
 * @since 2.0.0
 */
var toUndefined = 
/*#__PURE__*/
match$4(constUndefined, identity);
function elem$2(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem$2(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return isNone(ma) ? false : E.equals(a, ma.value);
    };
}
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
var exists$2 = function (predicate) { return function (ma) {
    return isNone(ma) ? false : predicate(ma.value);
}; };
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$6 = 
/*#__PURE__*/
of$6(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$6 = 
/*#__PURE__*/
bindTo$8(Functor$6);
/**
 * @since 2.8.0
 */
var bind$6 = 
/*#__PURE__*/
bind$8(Chain$6);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$6 = 
/*#__PURE__*/
apS$8(Apply$4);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var ApT$2 = 
/*#__PURE__*/
of$6(emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex$2 = function (f) { return function (as) {
    var o = f(0, head$4(as));
    if (isNone(o)) {
        return none;
    }
    var out = [o.value];
    for (var i = 1; i < as.length; i++) {
        var o_1 = f(i, as[i]);
        if (isNone(o_1)) {
            return none;
        }
        out.push(o_1.value);
    }
    return some$2(out);
}; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex$2 = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex$2(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT$2); };
};
/**
 * @since 2.9.0
 */
var traverseArrayWithIndex$2 = traverseReadonlyArrayWithIndex$2;
/**
 * @since 2.9.0
 */
var traverseArray$2 = function (f) {
    return traverseReadonlyArrayWithIndex$2(function (_, a) { return f(a); });
};
/**
 * @since 2.9.0
 */
var sequenceArray$2 = 
/*#__PURE__*/
traverseArray$2(identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use `Refinement` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
function getRefinement(getOption) {
    return function (a) { return isSome(getOption(a)); };
}
/**
 * Use [`chainNullableK`](#chainnullablek) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var mapNullable = chainNullableK;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var option = {
    URI: URI$6,
    map: _map$6,
    of: of$6,
    ap: _ap$4,
    chain: _chain$6,
    reduce: _reduce$4,
    foldMap: _foldMap$4,
    reduceRight: _reduceRight$4,
    traverse: _traverse$4,
    sequence: sequence$4,
    zero: zero$2,
    alt: _alt$5,
    extend: _extend$4,
    compact: compact$3,
    separate: separate$3,
    filter: _filter$2,
    filterMap: _filterMap$2,
    partition: _partition$2,
    partitionMap: _partitionMap$2,
    wither: _wither$2,
    wilt: _wilt$2,
    throwError: throwError$1
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplySemigroup$1 = 
/*#__PURE__*/
getApplySemigroup$3(Apply$4);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplyMonoid$1 = 
/*#__PURE__*/
getApplicativeMonoid(Applicative$4);
/**
 * Use
 *
 * ```ts
 * import { first } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(first())
 * ```
 *
 * instead.
 *
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFirstMonoid = function () { return getMonoid$3(first()); };
/**
 * Use
 *
 * ```ts
 * import { last } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(last())
 * ```
 *
 * instead.
 *
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getLastMonoid = function () { return getMonoid$3(last$4()); };

function compact$2(F, G) {
    return function (fga) { return F.map(fga, G.compact); };
}
function separate$2(F, C, G) {
    var _compact = compact$2(F, C);
    var _map = map$a(F, G);
    return function (fge) { return separated(_compact(pipe(fge, _map(getLeft))), _compact(pipe(fge, _map(getRight)))); };
}
/** @deprecated */
function getCompactableComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    return {
        map: map,
        compact: compact$2(F, G),
        separate: separate$2(F, G, G)
    };
}

function right$1(F) {
    return flow(right$2, F.of);
}
function left$1(F) {
    return flow(left$2, F.of);
}
function rightF(F) {
    return function (fa) { return F.map(fa, right$2); };
}
function leftF(F) {
    return function (fe) { return F.map(fe, left$2); };
}
function map$6(F) {
    return map$a(F, Functor$7);
}
function ap$6(F) {
    return ap$9(F, Apply$5);
}
function chain$6(M) {
    return function (f) { return function (ma) { return M.chain(ma, function (e) { return (isLeft(e) ? M.of(e) : f(e.right)); }); }; };
}
function alt$5(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (isLeft(e) ? second() : M.of(e)); }); }; };
}
function bimap$1(F) {
    return function (f, g) { return function (fea) { return F.map(fea, bimap$2(f, g)); }; };
}
function mapLeft$1(F) {
    return function (f) { return function (fea) { return F.map(fea, mapLeft$2(f)); }; };
}
function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, match$5(function (e1) {
            return M.map(second(), mapLeft$2(function (e2) { return S.concat(e1, e2); }));
        }, right$1(M)));
    }; };
}
function match$3(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, match$5(onLeft, onRight)); }; };
}
function matchE$1(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, match$5(onLeft, onRight)); }; };
}
function getOrElse$1(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, match$5(onLeft, M.of)); }; };
}
function orElse$1(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
function orElseFirst$1(M) {
    var orElseM = orElse$1(M);
    return function (onLeft) { return orElseM(function (e) { return M.map(onLeft(e), function (eb) { return (isLeft(eb) ? eb : left$2(e)); }); }); };
}
function orLeft$1(M) {
    return function (onLeft) { return function (ma) {
        return M.chain(ma, match$5(function (e) { return M.map(onLeft(e), left$2); }, function (a) { return M.of(right$2(a)); }));
    }; };
}
function swap$1(F) {
    return function (ma) { return F.map(ma, swap$2); };
}
function toUnion$1(F) {
    return function (fa) { return F.map(fa, toUnion$2); };
}
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
    var _ap = ap$6(M);
    var _map = map$6(M);
    var _chain = chain$6(M);
    var _alt = alt$5(M);
    var _bimap = bimap$1(M);
    var _mapLeft = mapLeft$1(M);
    var _fold = matchE$1(M);
    var _getOrElse = getOrElse$1(M);
    var _orElse = orElse$1(M);
    return {
        map: function (fa, f) { return pipe(fa, _map(f)); },
        ap: function (fab, fa) { return pipe(fab, _ap(fa)); },
        of: right$1(M),
        chain: function (ma, f) { return pipe(ma, _chain(f)); },
        alt: function (fa, that) { return pipe(fa, _alt(that)); },
        bimap: function (fea, f, g) { return pipe(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return pipe(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return pipe(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return pipe(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return pipe(fa, _orElse(f)); },
        swap: swap$1(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left$1(M)
    };
}

/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
function filter$4(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
function filterMap$2(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
function partition$2(F, G) {
    var _filter = filter$4(F, G);
    return function (predicate) {
        var left = _filter(not(predicate));
        var right = _filter(predicate);
        return function (fgb) { return separated(left(fgb), right(fgb)); };
    };
}
function partitionMap$2(F, G) {
    var _filterMap = filterMap$2(F, G);
    return function (f) { return function (fga) {
        return separated(pipe(fga, _filterMap(function (a) { return getLeft(f(a)); })), pipe(fga, _filterMap(function (a) { return getRight(f(a)); })));
    }; };
}
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = getFunctorComposition(F, G).map;
    var _compact = compact$2(F, G);
    var _separate = separate$2(F, G, G);
    var _filter = filter$4(F, G);
    var _filterMap = filterMap$2(F, G);
    var _partition = partition$2(F, G);
    var _partitionMap = partitionMap$2(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return pipe(fga, _filter(f)); },
        filterMap: function (fga, f) { return pipe(fga, _filterMap(f)); },
        partition: function (fga, p) { return pipe(fga, _partition(p)); },
        partitionMap: function (fga, f) { return pipe(fga, _partitionMap(f)); }
    };
}

/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */
function fromIOK$2(F) {
    return function (f) { return flow(f, F.fromIO); };
}
function chainIOK$2(F, M) {
    return function (f) {
        var g = flow(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
function chainFirstIOK$2(F, M) {
    var chainFirstM = chainFirst$8(M);
    return function (f) { return chainFirstM(flow(f, F.fromIO)); };
}

/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */
function fromTaskK$1(F) {
    return function (f) { return flow(f, F.fromTask); };
}
function chainTaskK$1(F, M) {
    return function (f) {
        var g = flow(f, F.fromTask);
        return function (first) { return M.chain(first, g); };
    };
}
function chainFirstTaskK$1(F, M) {
    var chainFirstM = chainFirst$8(M);
    return function (f) { return chainFirstM(flow(f, F.fromTask)); };
}

/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromIO$1 = function (ma) { return function () { return Promise.resolve().then(ma); }; };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = append('b')
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(log, ['a', 'b', 'd', 'c'])
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.0.0
 */
function delay(millis) {
    return function (ma) { return function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                // tslint:disable-next-line: no-floating-promises
                Promise.resolve().then(ma).then(resolve);
            }, millis);
        });
    }; };
}
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$5 = function (fa, f) { return pipe(fa, map$5(f)); };
var _apPar$1 = function (fab, fa) { return pipe(fab, ap$5(fa)); };
var _apSeq$1 = function (fab, fa) {
    return pipe(fab, chain$5(function (f) { return pipe(fa, map$5(f)); }));
};
var _chain$5 = function (ma, f) { return pipe(ma, chain$5(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$5 = function (f) { return function (fa) { return function () {
    return Promise.resolve().then(fa).then(f);
}; }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap$5 = function (fa) { return function (fab) { return function () {
    return Promise.all([Promise.resolve().then(fab), Promise.resolve().then(fa)]).then(function (_a) {
        var f = _a[0], a = _a[1];
        return f(a);
    });
}; }; };
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$5 = function (a) { return function () { return Promise.resolve(a); }; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain$5 = function (f) { return function (ma) { return function () {
    return Promise.resolve()
        .then(ma)
        .then(function (a) { return f(a)(); });
}; }; };
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var flatten$5 = 
/*#__PURE__*/
chain$5(identity);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$5 = 'Task';
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
function getRaceMonoid() {
    return {
        concat: function (x, y) { return function () { return Promise.race([Promise.resolve().then(x), Promise.resolve().then(y)]); }; },
        empty: never
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$5 = {
    URI: URI$5,
    map: _map$5
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$5 = 
/*#__PURE__*/
flap$9(Functor$5);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$5 = {
    URI: URI$5,
    of: of$5
};
/**
 * @category instances
 * @since 2.10.0
 */
var ApplyPar$1 = {
    URI: URI$5,
    map: _map$5,
    ap: _apPar$1
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst$5 = 
/*#__PURE__*/
apFirst$8(ApplyPar$1);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond$5 = 
/*#__PURE__*/
apSecond$8(ApplyPar$1);
/**
 * @category instances
 * @since 2.7.0
 */
var ApplicativePar$1 = {
    URI: URI$5,
    map: _map$5,
    ap: _apPar$1,
    of: of$5
};
/**
 * @category instances
 * @since 2.10.0
 */
var ApplySeq$1 = {
    URI: URI$5,
    map: _map$5,
    ap: _apSeq$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var ApplicativeSeq$1 = {
    URI: URI$5,
    map: _map$5,
    ap: _apSeq$1,
    of: of$5
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$5 = {
    URI: URI$5,
    map: _map$5,
    ap: _apPar$1,
    chain: _chain$5
};
/**
 * @category instances
 * @since 2.10.0
 */
var Monad$5 = {
    URI: URI$5,
    map: _map$5,
    of: of$5,
    ap: _apPar$1,
    chain: _chain$5
};
/**
 * @category instances
 * @since 2.10.0
 */
var MonadIO$1 = {
    URI: URI$5,
    map: _map$5,
    of: of$5,
    ap: _apPar$1,
    chain: _chain$5,
    fromIO: fromIO$1
};
/**
 * @category FromTask
 * @since 2.7.0
 * @deprecated
 */
var fromTask$1 = identity;
/**
 * @category instances
 * @since 2.10.0
 */
var MonadTask$1 = {
    URI: URI$5,
    map: _map$5,
    of: of$5,
    ap: _apPar$1,
    chain: _chain$5,
    fromIO: fromIO$1,
    fromTask: fromTask$1
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
var chainFirst$5 = 
/*#__PURE__*/
chainFirst$8(Chain$5);
/**
 * @category instances
 * @since 2.10.0
 */
var FromIO$1 = {
    URI: URI$5,
    fromIO: fromIO$1
};
/**
 * @category combinators
 * @since 2.4.0
 */
var fromIOK$1 = 
/*#__PURE__*/
fromIOK$2(FromIO$1);
/**
 * @category combinators
 * @since 2.4.0
 */
var chainIOK$1 = 
/*#__PURE__*/
chainIOK$2(FromIO$1, Chain$5);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainFirstIOK$1 = 
/*#__PURE__*/
chainFirstIOK$2(FromIO$1, Chain$5);
/**
 * @category instances
 * @since 2.10.0
 */
var FromTask$1 = {
    URI: URI$5,
    fromIO: fromIO$1,
    fromTask: fromTask$1
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
var never = function () { return new Promise(function (_) { return undefined; }); };
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$5 = 
/*#__PURE__*/
of$5(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$5 = 
/*#__PURE__*/
bindTo$8(Functor$5);
/**
 * @since 2.8.0
 */
var bind$5 = 
/*#__PURE__*/
bind$8(Chain$5);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$5 = 
/*#__PURE__*/
apS$8(ApplyPar$1);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var ApT$1 = 
/*#__PURE__*/
of$5(emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex$1 = function (f) { return function (as) { return function () { return Promise.all(as.map(function (a, i) { return Promise.resolve().then(function () { return f(i, a)(); }); })); }; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex$1 = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex$1(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT$1); };
};
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq$1 = function (f) { return function (as) { return function () {
    return tail$4(as).reduce(function (acc, a, i) {
        return acc.then(function (bs) {
            return Promise.resolve()
                .then(f(i + 1, a))
                .then(function (b) {
                bs.push(b);
                return bs;
            });
        });
    }, Promise.resolve()
        .then(f(0, head$4(as)))
        .then(singleton));
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq$1 = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndexSeq$1(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT$1); };
};
/**
 * @since 2.9.0
 */
var traverseArrayWithIndex$1 = traverseReadonlyArrayWithIndex$1;
/**
 * @since 2.9.0
 */
var traverseArray$1 = function (f) {
    return traverseReadonlyArrayWithIndex$1(function (_, a) { return f(a); });
};
/**
 * @since 2.9.0
 */
var sequenceArray$1 = 
/*#__PURE__*/
traverseArray$1(identity);
/**
 * @since 2.9.0
 */
var traverseSeqArrayWithIndex$1 = traverseReadonlyArrayWithIndexSeq$1;
/**
 * @since 2.9.0
 */
var traverseSeqArray$1 = function (f) {
    return traverseReadonlyArrayWithIndexSeq$1(function (_, a) { return f(a); });
};
/**
 * @since 2.9.0
 */
var sequenceSeqArray$1 = 
/*#__PURE__*/
traverseSeqArray$1(identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var task = {
    URI: URI$5,
    map: _map$5,
    of: of$5,
    ap: _apPar$1,
    chain: _chain$5,
    fromIO: fromIO$1,
    fromTask: fromTask$1
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var taskSeq = {
    URI: URI$5,
    map: _map$5,
    of: of$5,
    ap: _apSeq$1,
    chain: _chain$5,
    fromIO: fromIO$1,
    fromTask: fromTask$1
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup$5 = 
/*#__PURE__*/
getApplySemigroup$3(ApplySeq$1);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getMonoid$2 = 
/*#__PURE__*/
getApplicativeMonoid(ApplicativeSeq$1);

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var left = 
/*#__PURE__*/
left$1(Pointed$5);
/**
 * @category constructors
 * @since 2.0.0
 */
var right = 
/*#__PURE__*/
right$1(Pointed$5);
/**
 * @category constructors
 * @since 2.0.0
 */
var rightTask = 
/*#__PURE__*/
rightF(Functor$5);
/**
 * @category constructors
 * @since 2.0.0
 */
var leftTask = 
/*#__PURE__*/
leftF(Functor$5);
/**
 * @category constructors
 * @since 2.0.0
 */
var rightIO = 
/*#__PURE__*/
flow(fromIO$1, rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
var leftIO = 
/*#__PURE__*/
flow(fromIO$1, leftTask);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.7.0
 */
var fromIO = rightIO;
/**
 * @category natural transformations
 * @since 2.7.0
 */
var fromTask = rightTask;
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromEither$2 = of$5;
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromIOEither = fromIO$1;
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromTaskOption = function (onNone) {
    return map$5(fromOption$3(onNone));
};
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
var match$2 = 
/*#__PURE__*/
match$3(Functor$5);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW$2 = match$2;
/**
 * @category destructors
 * @since 2.10.0
 */
var matchE = 
/*#__PURE__*/
matchE$1(Monad$5);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold$2 = matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchEW = matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
var foldW = matchEW;
/**
 * @category destructors
 * @since 2.0.0
 */
var getOrElse = 
/*#__PURE__*/
getOrElse$1(Monad$5);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = getOrElse;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * Note: `f` should never `throw` errors, they are not caught.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onRejected) { return function () {
    return f().then(right$4, function (reason) { return left$4(onRejected(reason)); });
}; };
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
var tryCatchK = function (f, onRejected) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return tryCatch(function () { return f.apply(void 0, a); }, onRejected);
}; };
/**
 * @category interop
 * @since 2.10.0
 */
var toUnion = 
/*#__PURE__*/
toUnion$1(Functor$5);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.0.0
 */
var orElse = 
/*#__PURE__*/
orElse$1(Monad$5);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
var orElseW = orElse;
/**
 * @category combinators
 * @since 2.11.0
 */
var orElseFirst = 
/*#__PURE__*/
orElseFirst$1(Monad$5);
/**
 * @category combinators
 * @since 2.11.0
 */
var orElseFirstW = orElseFirst;
/**
 * @category combinators
 * @since 2.11.0
 */
var orLeft = 
/*#__PURE__*/
orLeft$1(Monad$5);
/**
 * @category combinators
 * @since 2.0.0
 */
var swap = 
/*#__PURE__*/
swap$1(Functor$5);
/**
 * @category combinators
 * @since 2.11.0
 */
var fromTaskOptionK = function (onNone) {
    var from = fromTaskOption(onNone);
    return function (f) { return flow(f, from); };
};
/**
 * @category combinators
 * @since 2.11.0
 */
var chainTaskOptionK = function (onNone) {
    return flow(fromTaskOptionK(onNone), chain$4);
};
/**
 * @category combinators
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return flow(f, fromIOEither); };
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainIOEitherKW = function (f) { return chainW(fromIOEitherK(f)); };
/**
 * @category combinators
 * @since 2.4.0
 */
var chainIOEitherK = chainIOEitherKW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$4 = function (fa, f) { return pipe(fa, map$4(f)); };
var _apPar = function (fab, fa) { return pipe(fab, ap$4(fa)); };
var _apSeq = function (fab, fa) {
    return pipe(fab, chain$4(function (f) { return pipe(fa, map$4(f)); }));
};
/* istanbul ignore next */
var _chain$4 = function (ma, f) { return pipe(ma, chain$4(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return pipe(fa, bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return pipe(fa, mapLeft(f)); };
/* istanbul ignore next */
var _alt$4 = function (fa, that) { return pipe(fa, alt$4(that)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$4 = 
/*#__PURE__*/
map$6(Functor$5);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
var bimap = 
/*#__PURE__*/
bimap$1(Functor$5);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
var mapLeft = 
/*#__PURE__*/
mapLeft$1(Functor$5);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap$4 = 
/*#__PURE__*/
ap$6(ApplyPar$1);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
var apW = ap$4;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain$4 = 
/*#__PURE__*/
chain$6(Monad$5);
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
var chainW = chain$4;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
var flattenW = 
/*#__PURE__*/
chainW(identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var flatten$4 = flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category Alt
 * @since 2.0.0
 */
var alt$4 = 
/*#__PURE__*/
alt$5(Monad$5);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$4 = alt$4;
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$4 = right;
/**
 * @category MonadTask
 * @since 2.7.0
 */
var throwError = left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$4 = 'TaskEither';
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeTaskValidation(A, S) {
    var ap = ap$9(A, getApplicativeValidation(S));
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$4,
        ap: function (fab, fa) { return pipe(fab, ap(fa)); },
        of: of$4
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
function getAltTaskValidation(S) {
    var alt = altValidation(Monad$5, S);
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$4,
        alt: function (fa, that) { return pipe(fa, alt(that)); }
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = getCompactable$1(M);
    return {
        URI: URI$4,
        _E: undefined,
        compact: compact$2(Functor$5, C),
        separate: separate$2(Functor$5, C, Functor$7)
    };
};
/**
 * @category instances
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = getFilterable$1(M);
    var C = getCompactable(M);
    var filter = filter$4(Functor$5, F);
    var filterMap = filterMap$2(Functor$5, F);
    var partition = partition$2(Functor$5, F);
    var partitionMap = partitionMap$2(Functor$5, F);
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$4,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return pipe(fa, filter(predicate)); },
        filterMap: function (fa, f) { return pipe(fa, filterMap(f)); },
        partition: function (fa, predicate) { return pipe(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return pipe(fa, partitionMap(f)); }
    };
}
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
flap$9(Functor$4);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$4 = {
    URI: URI$4,
    of: of$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var ApplyPar = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst$4 = 
/*#__PURE__*/
apFirst$8(ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond$4 = 
/*#__PURE__*/
apSecond$8(ApplyPar);
/**
 * @category instances
 * @since 2.7.0
 */
var ApplicativePar = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    of: of$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var ApplySeq = {
    URI: URI$4,
    map: _map$4,
    ap: _apSeq
};
/**
 * @category instances
 * @since 2.7.0
 */
var ApplicativeSeq = {
    URI: URI$4,
    map: _map$4,
    ap: _apSeq,
    of: of$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$4 = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    chain: _chain$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var Monad$4 = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    chain: _chain$4,
    of: of$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var MonadIO = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    chain: _chain$4,
    of: of$4,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
var MonadTask = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    chain: _chain$4,
    of: of$4,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
var MonadThrow = {
    URI: URI$4,
    map: _map$4,
    ap: _apPar,
    chain: _chain$4,
    of: of$4,
    throwError: throwError
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
var chainFirst$4 = 
/*#__PURE__*/
chainFirst$8(Chain$4);
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
var chainFirstW = chainFirst$4;
/**
 * @category instances
 * @since 2.7.0
 */
var Bifunctor = {
    URI: URI$4,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$4 = {
    URI: URI$4,
    map: _map$4,
    alt: _alt$4
};
/**
 * @category instances
 * @since 2.10.0
 */
var FromEither$2 = {
    URI: URI$4,
    fromEither: fromEither$2
};
/**
 * @category natural transformations
 * @since 2.0.0
 */
var fromOption$2 = 
/*#__PURE__*/
fromOption$4(FromEither$2);
/**
 * @category combinators
 * @since 2.10.0
 */
var fromOptionK$2 = 
/*#__PURE__*/
fromOptionK$4(FromEither$2);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainOptionK = 
/*#__PURE__*/
chainOptionK$2(FromEither$2, Chain$4);
/**
 * @category combinators
 * @since 2.4.0
 */
var chainEitherK = 
/*#__PURE__*/
chainEitherK$2(FromEither$2, Chain$4);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
var chainEitherKW = chainEitherK;
/**
 * @category constructors
 * @since 2.0.0
 */
var fromPredicate$2 = 
/*#__PURE__*/
fromPredicate$5(FromEither$2);
/**
 * @category combinators
 * @since 2.0.0
 */
var filterOrElse = 
/*#__PURE__*/
filterOrElse$2(FromEither$2, Chain$4);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
var filterOrElseW = filterOrElse;
/**
 * @category combinators
 * @since 2.4.0
 */
var fromEitherK$2 = 
/*#__PURE__*/
fromEitherK$4(FromEither$2);
/**
 * @category instances
 * @since 2.10.0
 */
var FromIO = {
    URI: URI$4,
    fromIO: fromIO
};
/**
 * @category combinators
 * @since 2.10.0
 */
var fromIOK = 
/*#__PURE__*/
fromIOK$2(FromIO);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainIOK = 
/*#__PURE__*/
chainIOK$2(FromIO, Chain$4);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainFirstIOK = 
/*#__PURE__*/
chainFirstIOK$2(FromIO, Chain$4);
/**
 * @category instances
 * @since 2.10.0
 */
var FromTask = {
    URI: URI$4,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category combinators
 * @since 2.10.0
 */
var fromTaskK = 
/*#__PURE__*/
fromTaskK$1(FromTask);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainTaskK = 
/*#__PURE__*/
chainTaskK$1(FromTask, Chain$4);
/**
 * @category combinators
 * @since 2.10.0
 */
var chainFirstTaskK = 
/*#__PURE__*/
chainFirstTaskK$1(FromTask, Chain$4);
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) { return (e != null ? resolve(left$4(e)) : resolve(right$4(r))); };
                f.apply(null, args.concat(cbResolver));
            });
        };
    };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) {
    return pipe(acquire, chain$4(function (a) {
        return pipe(use(a), chain$5(function (e) {
            return pipe(release(a, e), chain$4(function () { return of$5(e); }));
        }));
    }));
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$4 = 
/*#__PURE__*/
of$4(emptyRecord);
/**
 * @since 2.8.0
 */
var bindTo$4 = 
/*#__PURE__*/
bindTo$8(Functor$4);
/**
 * @since 2.8.0
 */
var bind$4 = 
/*#__PURE__*/
bind$8(Chain$4);
/**
 * @since 2.8.0
 */
var bindW = bind$4;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$4 = 
/*#__PURE__*/
apS$8(ApplyPar);
/**
 * @since 2.8.0
 */
var apSW = apS$4;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var ApT = 
/*#__PURE__*/
of$4(emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return flow(traverseReadonlyNonEmptyArrayWithIndex$1(f), map$5(traverseReadonlyNonEmptyArrayWithIndex$3(SK)));
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT); };
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    return tail$4(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
            return isLeft$1(ebs)
                ? acc
                : f(i + 1, a)().then(function (eb) {
                    if (isLeft$1(eb)) {
                        return eb;
                    }
                    ebs.right.push(eb.right);
                    return ebs;
                });
        });
    }, f(0, head$4(as))().then(map$8(singleton)));
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (isNonEmpty$4(as) ? g(as) : ApT); };
};
/**
 * @since 2.9.0
 */
var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * @since 2.9.0
 */
var sequenceArray = 
/*#__PURE__*/
traverseArray(identity);
/**
 * @since 2.9.0
 */
var traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
/**
 * @since 2.9.0
 */
var sequenceSeqArray = 
/*#__PURE__*/
traverseSeqArray(identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var taskEither = {
    URI: URI$4,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map$4,
    of: of$4,
    ap: _apPar,
    chain: _chain$4,
    alt: _alt$4,
    fromIO: fromIO,
    fromTask: fromTask,
    throwError: throwError
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var taskEitherSeq = {
    URI: URI$4,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map$4,
    of: of$4,
    ap: _apSeq,
    chain: _chain$4,
    alt: _alt$4,
    fromIO: fromIO,
    fromTask: fromTask,
    throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplySemigroup = 
/*#__PURE__*/
getApplySemigroup$3(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplyMonoid = 
/*#__PURE__*/
getApplicativeMonoid(ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup$4 = function (S) {
    return getApplySemigroup$3(ApplySeq$1)(getSemigroup$6(S));
};
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getTaskValidation(SE) {
    var applicativeTaskValidation = getApplicativeTaskValidation(ApplicativePar$1, SE);
    var altTaskValidation = getAltTaskValidation(SE);
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$4,
        ap: applicativeTaskValidation.ap,
        of: of$4,
        chain: _chain$4,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altTaskValidation.alt,
        fromIO: fromIO,
        fromTask: fromTask,
        throwError: throwError
    };
}

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
var empty$3 = emptyReadonlyArray;
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
        var M = getMonoid$4();
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
    return isNonEmpty$3(as) ? some$3(as) : none$1;
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
            return empty$3;
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
var modifyAt$3 = function (i, f) { return function (as) { return (isOutOfBound$3(i, as) ? none$1 : some$3(unsafeUpdateAt$3(i, f(as[i]), as))); }; };
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
    return m >= as.length ? [as, empty$3] : [pipe(as.slice(1, m), prepend$3(head$3(as))), as.slice(m)];
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
var _map$3 = function (fa, f) { return pipe(fa, map$3(f)); };
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
var ap$3 = function (as) { return chain$3(function (f) { return pipe(as, map$3(f)); }); };
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
var map$3 = function (f) {
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
var URI$3 = 'ReadonlyNonEmptyArray';
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
flap$9(Functor$3);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$3 = {
    URI: URI$3,
    of: of$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$3 = {
    URI: URI$3,
    map: _map$3,
    mapWithIndex: _mapWithIndex$3
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$3 = {
    URI: URI$3,
    map: _map$3,
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
apFirst$8(Apply$3);
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
apSecond$8(Apply$3);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$3 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$3,
    of: of$3
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$3 = {
    URI: URI$3,
    map: _map$3,
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
chainFirst$8(Chain$3);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$3 = {
    URI: URI$3,
    map: _map$3,
    ap: _ap$3,
    of: of$3,
    chain: _chain$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$3 = {
    URI: URI$3,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$3 = {
    URI: URI$3,
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
    URI: URI$3,
    map: _map$3,
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
    URI: URI$3,
    map: _map$3,
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
    URI: URI$3,
    map: _map$3,
    alt: _alt$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Comonad$1 = {
    URI: URI$3,
    map: _map$3,
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
bindTo$8(Functor$3);
/**
 * @since 2.8.0
 */
var bind$3 = 
/*#__PURE__*/
bind$8(Chain$3);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$3 = 
/*#__PURE__*/
apS$8(Apply$3);
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
    return function (as) { return (isNonEmpty$3(as) ? groupO(sortO(as)) : empty$3); };
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
    return i < 0 || i > as.length ? none$1 : some$3(unsafeInsertAt$3(i, a, as));
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
    URI: URI$3,
    of: of$3,
    map: _map$3,
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

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Eq.equals('a', 'a'), true)
 * assert.deepStrictEqual(S.Eq.equals('a', 'b'), false)
 *
 * @category instances
 * @since 2.10.0
 */
var Eq = {
    equals: function (first, second) { return first === second; }
};
/**
 * `string` semigroup under concatenation.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Semigroup.concat('a', 'b'), 'ab')
 *
 * @category instances
 * @since 2.10.0
 */
var Semigroup = {
    concat: function (first, second) { return first + second; }
};
/**
 * `string` monoid under concatenation.
 *
 * The `empty` value is `''`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Monoid.concat('a', 'b'), 'ab')
 * assert.deepStrictEqual(S.Monoid.concat('a', S.Monoid.empty), 'a')
 *
 * @category instances
 * @since 2.10.0
 */
var Monoid = {
    concat: Semigroup.concat,
    empty: ''
};
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Ord.compare('a', 'a'), 0)
 * assert.deepStrictEqual(S.Ord.compare('a', 'b'), -1)
 * assert.deepStrictEqual(S.Ord.compare('b', 'a'), 1)
 *
 * @category instances
 * @since 2.10.0
 */
var Ord = {
    equals: Eq.equals,
    compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
};
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Show.show('a'), '"a"')
 *
 * @category instances
 * @since 2.10.0
 */
var Show = {
    show: function (s) { return JSON.stringify(s); }
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.isString('a'), true)
 * assert.deepStrictEqual(S.isString(1), false)
 *
 * @category refinements
 * @since 2.11.0
 */
var isString = function (u) { return typeof u === 'string'; };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
 *
 * @category combinators
 * @since 2.11.0
 */
var toUpperCase = function (s) { return s.toUpperCase(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
 *
 * @category combinators
 * @since 2.11.0
 */
var toLowerCase = function (s) { return s.toLowerCase(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
 *
 * @category combinators
 * @since 2.11.0
 */
var replace = function (searchValue, replaceValue) { return function (s) {
    return s.replace(searchValue, replaceValue);
}; };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trim), 'a')
 *
 * @category combinators
 * @since 2.11.0
 */
var trim = function (s) { return s.trim(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimLeft), 'a ')
 *
 * @category combinators
 * @since 2.11.0
 */
var trimLeft = function (s) { return s.trimLeft(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(' a ', S.trimRight), ' a')
 *
 * @category combinators
 * @since 2.11.0
 */
var trimRight = function (s) { return s.trimRight(); };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
 *
 * @category combinators
 * @since 2.11.0
 */
var slice = function (start, end) { return function (s) { return s.slice(start, end); }; };
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * An empty `string`.
 *
 * @since 2.10.0
 */
var empty$2 = '';
/**
 * Test whether a `string` is empty.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('', S.isEmpty), true)
 * assert.deepStrictEqual(pipe('a', S.isEmpty), false)
 *
 * @since 2.10.0
 */
var isEmpty$3 = function (s) { return s.length === 0; };
/**
 * Calculate the number of characters in a `string`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.size), 3)
 *
 * @since 2.10.0
 */
var size$2 = function (s) { return s.length; };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
 * assert.deepStrictEqual(pipe('', S.split('')), [''])
 *
 * @since 2.11.0
 */
var split = function (separator) { return function (s) {
    var out = s.split(separator);
    return isNonEmpty$3(out) ? out : [s];
}; };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.includes('b')), true)
 * assert.deepStrictEqual(pipe('abc', S.includes('d')), false)
 *
 * @since 2.11.0
 */
var includes = function (searchString, position) { return function (s) {
    return s.includes(searchString, position);
}; };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.startsWith('a')), true)
 * assert.deepStrictEqual(pipe('bc', S.startsWith('a')), false)
 *
 * @since 2.11.0
 */
var startsWith = function (searchString, position) { return function (s) {
    return s.startsWith(searchString, position);
}; };
/**
 * @example
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('abc', S.endsWith('c')), true)
 * assert.deepStrictEqual(pipe('ab', S.endsWith('c')), false)
 *
 * @since 2.11.0
 */
var endsWith = function (searchString, position) { return function (s) {
    return s.endsWith(searchString, position);
}; };

const basicErrorFromResponse = (error) => {
  return {
    kind: "server",
    inner: error,
  };
};
const invalidTokenError = {
  kind: "client",
  inner: "Token not exist or empty",
};
const emptyApiPathError = {
  kind: "client",
  inner: "Api path empty or missing",
};

const stringMonoid = getMonoid$3(Monoid);
const getApiPath = () => pipe(getFirstMonoid().concat(fromNullable(state$1.apiPath), fromNullable(`${"https://api.vviinn.com"}`)), fromOption$3(() => emptyApiPathError));
const headersSemigroupSum = {
  concat: (x, y) => {
    const result = new Headers();
    if (x !== undefined)
      x.forEach((val, key) => result.append(key, val));
    if (y !== undefined)
      y.forEach((val, key) => result.append(key, val));
    return result;
  },
};
const mergeInitRequests = struct({
  method: {
    concat: (a, b) => {
      const method = stringMonoid.concat(fromNullable(a), fromNullable(b));
      return pipe(method, getOrElse$2(() => "GET"));
    },
  },
  body: last$4(),
  headers: headersSemigroupSum,
});
const createBasicRequest = (method) => {
  return {
    method,
  };
};
const createRequestFromMethod = (method) => right$2(createBasicRequest(method));
const createInitGetRequest = right$2(createBasicRequest("GET"));
const createInitPostRequest = right$2(createBasicRequest("POST"));

const safeRequest = (url, request = { method: "GET" }) => TaskEither.tryCatch(() => fetch(url, request), (failedResponse) => failedResponse);
const processResponce = (response) => response.status >= 200 && response.status < 300
  ? TaskEither.right(response)
  : TaskEither.left(response);
function getJson(x) {
  const task = () => x.json();
  return TaskEither.fromTask(task);
}
const request = (url, request = {}) => _function.pipe(safeRequest(url, request), TaskEither.chain(processResponce), TaskEither.chain((x) => getJson(x)));
const initRequestSemigroup = mergeInitRequests;
const makeRequest = (path, init) => ([apiPath, options,]) => {
  const url = new URL(path, apiPath);
  const fullOptions = initRequestSemigroup.concat(options, init);
  return _function.pipe(request(url.toString(), fullOptions), TaskEither.mapLeft(basicErrorFromResponse));
};

const isEmpty$2 = (x) => x.length === 0;
const checkEmpty = (x) => isEmpty$2(x) ? left$2("entity is empty") : right$2(x);
const existAndNotEmpty = (x) => pipe(x, fromNullable$1("entity not exist"), chain$8(checkEmpty));

const createBearerHeaders = (token) => new Headers({
  Authorization: `Bearer ${token}`,
});
const checkToken = (token) => pipe(token, existAndNotEmpty, Either.mapLeft(() => invalidTokenError));
const processBearerToken = (token) => pipe(token, checkToken, Either.map(createBearerHeaders));

const sequenceToEither = Apply$6.sequenceT(Either.Apply);

const imageFormFromFile = (file) => {
  const body = new FormData();
  body.append("image", file);
  return body;
};

const readFilters = (filters) => Object.entries(filters).map(([name, filters]) => {
  return { name, filters };
});
const detectedObjectEq = {
  equals: (x, y) => x.class === y.class &&
    x.score === y.score &&
    x.rectangle.left === y.rectangle.left &&
    x.rectangle.top === y.rectangle.top &&
    x.rectangle.height === y.rectangle.height &&
    x.rectangle.width === y.rectangle.width,
};
const searchSessionClient = (initialData) => _function.pipe(sequenceToEither(getApiPath(), createInitPostRequest), fromEither$2, chainW(makeRequest("search/session", initialData)));
const makeRequestFromFile = (token, file) => _function.pipe(sequenceToEither(processBearerToken(token), right$2(imageFormFromFile(file))), map$8(([headers, body]) => {
  return {
    headers,
    body,
  };
}));

var ObjectMemberName;
(function (ObjectMemberName) {
  ObjectMemberName["eform"] = "eform";
  ObjectMemberName["etype"] = "etype";
  ObjectMemberName["form"] = "form";
  ObjectMemberName["href"] = "href";
  ObjectMemberName["method"] = "method";
  ObjectMemberName["accepts"] = "accepts";
  ObjectMemberName["produces"] = "produces";
  ObjectMemberName["rel"] = "rel";
  ObjectMemberName["type"] = "type";
  ObjectMemberName["value"] = "value";
})(ObjectMemberName || (ObjectMemberName = {}));
const foldValueObject = (i) => {
  switch (i.type) {
    case "array": {
      return i.value.map(foldValueObject);
    }
    default: {
      return i.value;
    }
  }
};

const getLink = (item, path) => pipe(item.links, fromNullable, chain$7((linksObject) => fromNullable(linksObject[path])));
const linkRequest = (link) => (data) => pipe(sequenceToEither(getApiPath(), createRequestFromMethod(link.method)), fromEither$2, chainW(makeRequest(link.href, data)));

const sizedDivSemigroup = getStructSemigroup({
  width: semigroupDiv,
  height: semigroupDiv,
});
const ordSized = contramap$1((s) => s.width * s.height)(ordNumber);

const move = (origin, position) => {
  const originPosition = fromRectangle(origin);
  const newPosition = pointSumSemigroup.concat(originPosition, position);
  return Object.assign(Object.assign({}, newPosition), { width: origin.width, height: origin.height });
};
const transformNorthEast = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: 0,
    y: handler.position.y,
  });
  return Object.assign(Object.assign({}, newPosition), { width: origin.width + handler.position.x, height: origin.height - handler.position.y });
};
const transformNorthWest = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), handler.position);
  return Object.assign(Object.assign({}, newPosition), { width: origin.width - handler.position.x, height: origin.height - handler.position.y });
};
const transformSouthEast = (origin, handler) => {
  return Object.assign(Object.assign({}, origin), { width: origin.width + handler.position.x, height: origin.height + handler.position.y });
};
const transformSouthWest = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: handler.position.x,
    y: 0,
  });
  return Object.assign(Object.assign({}, newPosition), { width: origin.width - handler.position.x, height: origin.height + handler.position.y });
};
const transform = (origin, handler) => {
  switch (handler.direction) {
    case HandlerDirection.NorthEast:
      return transformNorthEast(origin, handler);
    case HandlerDirection.NorthWest:
      return transformNorthWest(origin, handler);
    case HandlerDirection.SouthEast:
      return transformSouthEast(origin, handler);
    case HandlerDirection.SouthWest:
      return transformSouthWest(origin, handler);
  }
};
const fromImage = (image) => {
  return {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  };
};
const fromNaturalImage = (image) => {
  return {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};
const getScaleRange = (source, target) => {
  const difference = sizedDivSemigroup.concat(target, source);
  return {
    x: difference.width,
    y: difference.height,
  };
};
const scaleSelection = (source, sourceSelection, target) => {
  const sourcePosition = fromRectangle(source);
  const scale = getScaleRange(source, target);
  const newPosition = pointProductSemigroup.concat(sourcePosition, scale);
  return Object.assign(Object.assign({}, newPosition), { width: sourceSelection.width * scale.x, height: sourceSelection.height * scale.y });
};
const fromAlt = (r) => {
  return Object.assign({ x: r.left, y: r.top }, r);
};
const scaleWithSized = (s) => (r) => {
  return {
    x: r.x * s.width,
    y: r.y * s.height,
    width: r.width * s.width,
    height: r.height * s.height,
  };
};
const divideOnSized = (s) => (r) => {
  return {
    x: r.x / s.width,
    y: r.y / s.height,
    width: r.width / s.width,
    height: r.height / s.height,
  };
};
const center = (r) => {
  return {
    x: r.x + r.width * 0.5,
    y: r.y + r.height * 0.5,
  };
};

var FormMemberName;
(function (FormMemberName) {
  FormMemberName["desc"] = "desc";
  FormMemberName["eform"] = "eform";
  FormMemberName["enabled"] = "enabled";
  FormMemberName["etype"] = "etype";
  FormMemberName["form"] = "form";
  FormMemberName["label"] = "label";
  FormMemberName["max"] = "max";
  FormMemberName["maxlength"] = "maxlength";
  FormMemberName["maxsize"] = "maxsize";
  FormMemberName["min"] = "min";
  FormMemberName["minlength"] = "minlength";
  FormMemberName["minsize"] = "minsize";
  FormMemberName["mutable"] = "mutable";
  FormMemberName["name"] = "name";
  FormMemberName["options"] = "options";
  FormMemberName["pattern"] = "pattern";
  FormMemberName["placeholder"] = "placeholder";
  FormMemberName["required"] = "required";
  FormMemberName["secret"] = "secret";
  FormMemberName["type"] = "type";
  FormMemberName["value"] = "value";
  FormMemberName["visible"] = "visible";
})(FormMemberName || (FormMemberName = {}));
const checkFormFields = (f, data) => {
  const fields = f.map((x) => x.name);
  const keys = Object.keys(data);
  const diff = fields.filter((x) => !keys.includes(x));
  return diff.length === 0
    ? right$2(data)
    : left$2(`Data should contains fields: ${diff.join(", ")}`);
};
const requestFromForm = (form, data) => _function.pipe(checkFormFields(form.value, data), map$8((checkedData) => form.rel.includes("query-form")
  ? transformGetForm(form, checkedData)
  : transformSendForm(form, checkedData)));
const transformGetForm = (form, data) => {
  const params = new URLSearchParams(Object.entries(data));
  const url = `${form.href}?${params.toString()}`;
  return [url, { method: "GET" }];
};
const transformSendForm = (form, data) => [
  form.href,
  {
    body: JSON.stringify(data),
    method: form.method,
    headers: new Headers({
      "Content-Type": "application/ion+json",
    }),
  },
];
const formRequest = (form, data = {}) => (payload) => _function.pipe(sequenceToEither(getApiPath(), _function.pipe(requestFromForm(form, data), mapLeft$2((error) => {
  return { kind: "app", inner: error };
}))), fromEither$2, chainW((initialData) => {
  const apiPath = initialData[0];
  const [formUrl, initObject] = initialData[1];
  return makeRequest(formUrl, initObject)([apiPath, payload]);
}));

const fileToB64 = async (f) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resolve(reader.result);
  });
  reader.readAsDataURL(f);
});
const fromFile$1 = async (f) => {
  return {
    name: f.name,
    mediaType: f.type,
    value: await fileToB64(f),
  };
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
        var M = getMonoid$4();
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
var fromArray$1 = function (as) { return (isNonEmpty$2(as) ? some$3(as) : none$1); };
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
    return i < 0 || i > as.length ? none$1 : some$3(unsafeInsertAt$2(i, a, as));
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
    return isOutOfBound$2(i, as) ? none$1 : some$3(unsafeUpdateAt$2(i, f(as[i]), as));
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
var _map$2 = function (fa, f) { return pipe(fa, map$2(f)); };
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
    return chain$2(function (f) { return pipe(as, map$2(f)); });
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
var map$2 = function (f) { return mapWithIndex$2(function (_, a) { return f(a); }); };
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
var URI$2 = 'NonEmptyArray';
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
flap$9(Functor$2);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$2 = {
    URI: URI$2,
    of: of$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$2 = {
    URI: URI$2,
    map: _map$2,
    mapWithIndex: _mapWithIndex$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$2 = {
    URI: URI$2,
    map: _map$2,
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
apFirst$8(Apply$2);
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
apSecond$8(Apply$2);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$2 = {
    URI: URI$2,
    map: _map$2,
    ap: _ap$2,
    of: of$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$2 = {
    URI: URI$2,
    map: _map$2,
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
chainFirst$8(Chain$2);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$2 = {
    URI: URI$2,
    map: _map$2,
    ap: _ap$2,
    of: of$2,
    chain: _chain$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$2 = {
    URI: URI$2,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$2 = {
    URI: URI$2,
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
    URI: URI$2,
    map: _map$2,
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
    URI: URI$2,
    map: _map$2,
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
    URI: URI$2,
    map: _map$2,
    alt: _alt$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Comonad = {
    URI: URI$2,
    map: _map$2,
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
bindTo$8(Functor$2);
/**
 * @since 2.8.0
 */
var bind$2 = 
/*#__PURE__*/
bind$8(Chain$2);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$2 = 
/*#__PURE__*/
apS$8(Apply$2);
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
    URI: URI$2,
    of: of$2,
    map: _map$2,
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
var fromOption$1 = function (ma) { return (isNone$1(ma) ? empty$1 : [ma.value]); };
/**
 * Transforms an `Either` to a `ReadonlyArray`.
 *
 * @category natural transformations
 * @since 2.11.0
 */
var fromEither$1 = function (e) { return (isLeft$1(e) ? empty$1 : [e.right]); };
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
    return as === undefined ? function (as) { return lookup$1(i, as); } : isOutOfBound$1(i, as) ? none$1 : some$3(as[i]);
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
var head$1 = function (as) { return (isNonEmpty$1(as) ? some$3(head$3(as)) : none$1); };
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
var last$1 = function (as) { return (isNonEmpty$1(as) ? some$3(last$3(as)) : none$1); };
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
    return isNonEmpty$1(as) ? some$3(tail$3(as)) : none$1;
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
    return isNonEmpty$1(as) ? some$3(init$3(as)) : none$1;
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
            return some$3(i);
        }
    }
    return none$1;
}; };
function findFirst$1(predicate) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return some$3(as[i]);
            }
        }
        return none$1;
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
        if (isSome$1(out)) {
            return out;
        }
    }
    return none$1;
}; };
function findLast$1(predicate) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return some$3(as[i]);
            }
        }
        return none$1;
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
        if (isSome$1(out)) {
            return out;
        }
    }
    return none$1;
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
            return some$3(i);
        }
    }
    return none$1;
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
    return i < 0 || i > as.length ? none$1 : some$3(unsafeInsertAt$3(i, a, as));
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
    return isOutOfBound$1(i, as) ? none$1 : some$3(unsafeDeleteAt$1(i, as));
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
    return isOutOfBound$1(i, as) ? none$1 : some$3(unsafeUpdateAt$1(i, f(as[i]), as));
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
        if (isSome$1(optionB)) {
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
        if (isSome$1(mt)) {
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
        return Ord$1.compare(aLen, bLen);
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
flap$9(Functor$1);
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
apFirst$8(Apply$1);
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
apSecond$8(Apply$1);
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
chainFirst$8(Chain$1);
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
guard$3(Zero$1, Pointed$1);
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
        if (isLeft$1(e)) {
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
        if (isLeft$1(e)) {
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
fromEitherK$4(FromEither$1);
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
var empty$1 = empty$3;
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
bindTo$8(Functor$1);
/**
 * @since 2.8.0
 */
var bind$1 = 
/*#__PURE__*/
bind$8(Chain$1);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$1 = 
/*#__PURE__*/
apS$8(Apply$1);
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
var fromOption = function (ma) { return (isNone$1(ma) ? [] : [ma.value]); };
/**
 * @category natural transformations
 * @since 2.11.0
 */
var fromEither = function (e) { return (isLeft$1(e) ? [] : [e.right]); };
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
var tail = function (as) { return (isNonEmpty(as) ? some$3(tail$2(as)) : none$1); };
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
var init = function (as) { return (isNonEmpty(as) ? some$3(init$2(as)) : none$1); };
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
    return i < 0 || i > as.length ? none$1 : some$3(unsafeInsertAt(i, a, as));
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
    return isOutOfBound(i, as) ? none$1 : some$3(unsafeDeleteAt(i, as));
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
    return isOutOfBound(i, as) ? none$1 : some$3(unsafeUpdateAt(i, f(as[i]), as));
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
        if (isSome$1(optionB)) {
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
        if (isSome$1(mt)) {
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
flap$9(Functor);
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
apFirst$8(Apply);
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
apSecond$8(Apply);
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
chainFirst$8(Chain);
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
guard$3(Zero, Pointed);
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
fromEitherK$4(FromEither);
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
bindTo$8(Functor);
/**
 * @since 2.8.0
 */
var bind = 
/*#__PURE__*/
bind$8(Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS = 
/*#__PURE__*/
apS$8(Apply);
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

const SUPPORTED_FILE_TYPES = ["jpg", "jpeg", "png", "webp"];
const unsupportedFileTypeError = {
  kind: "client",
  inner: "File format not supported",
};
const checkImageType = (file) => {
  const fileType = file.type.split("/")[1];
  const supportedFileType = findFirstMap((supportedType) => supportedType === fileType ? Option.some(file) : Option.none)(SUPPORTED_FILE_TYPES);
  return _function.pipe(supportedFileType, Either.fromOption(() => unsupportedFileTypeError));
};

const fileDoesntExistError = {
  kind: "app",
  inner: "File doesnt exist",
};

const fromFile = (f) => new Promise((resolve, _) => {
  const reader = new FileReader();
  const image = new Image();
  reader.onload = (e) => {
    image.src = e.target.result;
    resolve(image);
  };
  reader.readAsDataURL(f);
});
const imageFromFileTask = (f) => () => new Promise((resolve, _) => {
  const reader = new FileReader();
  const image = new Image();
  reader.onload = (e) => {
    image.src = e.target.result;
  };
  image.onload = () => resolve(image);
  reader.readAsDataURL(f);
});

var dist$2 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const copy = (source, dest, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, dx = 0, dy = 0) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    dx = dx | 0;
    dy = dy | 0;
    if (sw <= 0 || sh <= 0)
        return;
    const sourceData = new Uint32Array(source.data.buffer);
    const destData = new Uint32Array(dest.data.buffer);
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        const destY = dy + y;
        if (destY < 0 || destY >= dest.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const destX = dx + x;
            if (destX < 0 || destX >= dest.width)
                continue;
            const sourceIndex = sourceY * source.width + sourceX;
            const destIndex = destY * dest.width + destX;
            destData[destIndex] = sourceData[sourceIndex];
        }
    }
};
exports.copy = copy;
//# sourceMappingURL=index.js.map
});

const index$2 = /*@__PURE__*/getDefaultExportFromCjs(dist$2);

var dist$1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateImageFactory = (fill = [0, 0, 0, 0], channels = 4) => {
    channels = Math.floor(channels);
    if (isNaN(channels) || channels < 1) {
        throw TypeError('channels should be a positive non-zero number');
    }
    if (!('length' in fill) || fill.length < channels) {
        throw TypeError(`fill should be iterable with at least ${channels} members`);
    }
    fill = (new Uint8ClampedArray(fill)).slice(0, channels);
    const allZero = fill.every(v => v === 0);
    const createImage = (width, height, data) => {
        if (width === undefined || height === undefined) {
            throw TypeError('Not enough arguments');
        }
        width = Math.floor(width);
        height = Math.floor(height);
        if (isNaN(width) || width < 1 || isNaN(height) || height < 1) {
            throw TypeError('Index or size is negative or greater than the allowed amount');
        }
        const length = width * height * channels;
        if (data === undefined) {
            data = new Uint8ClampedArray(length);
        }
        if (data instanceof Uint8ClampedArray) {
            if (data.length !== length) {
                throw TypeError('Index or size is negative or greater than the allowed amount');
            }
            if (!allZero) {
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const index = (y * width + x) * channels;
                        for (let c = 0; c < channels; c++) {
                            data[index + c] = fill[c];
                        }
                    }
                }
            }
            return {
                get width() { return width; },
                get height() { return height; },
                get data() { return data; }
            };
        }
        throw TypeError('Expected data to be Uint8ClampedArray or undefined');
    };
    return createImage;
};
exports.createImage = exports.CreateImageFactory();
//# sourceMappingURL=index.js.map
});

const index$1 = /*@__PURE__*/getDefaultExportFromCjs(dist$1);

var filters_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filters = void 0;
const fixedFracBits = 14;
const filterValue = (x, a) => {
    if (x <= -a || x >= a)
        return 0;
    if (x == 0)
        return 0;
    // appears to do nothing?
    // if ( x > -1.19209290e-07 && x < 1.19209290e-07 ) return 1
    const xPi = x * Math.PI;
    return (Math.sin(xPi) / xPi) * Math.sin(xPi / a) / (xPi / a);
};
const toFixedPoint = (value) => Math.round(value * ((1 << fixedFracBits) - 1));
const filters = (srcSize, destSize, scale, offset, use2) => {
    const a = use2 ? 2 : 3;
    const scaleInverted = 1 / scale;
    const scaleClamped = Math.min(1, scale); // For upscale
    // Filter window (averaging interval), scaled to src image
    const srcWindow = a / scaleClamped;
    const maxFilterElementSize = Math.floor((srcWindow + 1) * 2);
    const packedFilter = new Int16Array((maxFilterElementSize + 2) * destSize);
    let packedFilterPtr = 0;
    // For each destination pixel calculate source range and built filter values
    for (let destPixel = 0; destPixel < destSize; destPixel++) {
        // Scaling should be done relative to central pixel point
        const sourcePixel = (destPixel + 0.5) * scaleInverted + offset;
        const sourceFirst = Math.max(0, Math.floor(sourcePixel - srcWindow));
        const sourceLast = Math.min(srcSize - 1, Math.ceil(sourcePixel + srcWindow));
        const filterElementSize = sourceLast - sourceFirst + 1;
        const floatFilter = new Float32Array(filterElementSize);
        const fxpFilter = new Int16Array(filterElementSize);
        let total = 0;
        // Fill filter values for calculated range
        let index = 0;
        for (let pixel = sourceFirst; pixel <= sourceLast; pixel++) {
            const floatValue = filterValue(((pixel + 0.5) - sourcePixel) * scaleClamped, a);
            total += floatValue;
            floatFilter[index] = floatValue;
            index++;
        }
        // Normalize filter, convert to fixed point and accumulate conversion error
        let filterTotal = 0;
        for (let index = 0; index < floatFilter.length; index++) {
            const filterValue = floatFilter[index] / total;
            filterTotal += filterValue;
            fxpFilter[index] = toFixedPoint(filterValue);
        }
        // Compensate normalization error, to minimize brightness drift
        fxpFilter[destSize >> 1] += toFixedPoint(1 - filterTotal);
        //
        // Now pack filter to useable form
        //
        // 1. Trim heading and tailing zero values, and compensate shitf/length
        // 2. Put all to single array in this format:
        //
        //    [ pos shift, data length, value1, value2, value3, ... ]
        //
        let leftNotEmpty = 0;
        while (leftNotEmpty < fxpFilter.length && fxpFilter[leftNotEmpty] === 0) {
            leftNotEmpty++;
        }
        let rightNotEmpty = fxpFilter.length - 1;
        while (rightNotEmpty > 0 && fxpFilter[rightNotEmpty] === 0) {
            rightNotEmpty--;
        }
        const filterShift = sourceFirst + leftNotEmpty;
        const filterSize = rightNotEmpty - leftNotEmpty + 1;
        packedFilter[packedFilterPtr++] = filterShift; // shift
        packedFilter[packedFilterPtr++] = filterSize; // size
        packedFilter.set(fxpFilter.subarray(leftNotEmpty, rightNotEmpty + 1), packedFilterPtr);
        packedFilterPtr += filterSize;
    }
    return packedFilter;
};
exports.filters = filters;
/*
  Adapted to typescript from pica: https://github.com/nodeca/pica

  (The MIT License)

  Copyright (C) 2014-2017 by Vitaly Puzrin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
//# sourceMappingURL=filters.js.map
});

const filters = /*@__PURE__*/getDefaultExportFromCjs(filters_1);

var convolve_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convolve = void 0;
const fixedFracBits = 14;
const convolve = (source, dest, sw, sh, dw, filters) => {
    let srcOffset = 0;
    let destOffset = 0;
    // For each row
    for (let sourceY = 0; sourceY < sh; sourceY++) {
        let filterPtr = 0;
        // Apply precomputed filters to each destination row point
        for (let destX = 0; destX < dw; destX++) {
            // Get the filter that determines the current output pixel.
            const filterShift = filters[filterPtr++];
            let srcPtr = (srcOffset + (filterShift * 4)) | 0;
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;
            // Apply the filter to the row to get the destination pixel r, g, b, a
            for (let filterSize = filters[filterPtr++]; filterSize > 0; filterSize--) {
                const filterValue = filters[filterPtr++];
                r = (r + filterValue * source[srcPtr]) | 0;
                g = (g + filterValue * source[srcPtr + 1]) | 0;
                b = (b + filterValue * source[srcPtr + 2]) | 0;
                a = (a + filterValue * source[srcPtr + 3]) | 0;
                srcPtr = (srcPtr + 4) | 0;
            }
            // Bring this value back in range. All of the filter scaling factors
            // are in fixed point with fixedFracBits bits of fractional part.
            //
            // (!) Add 1/2 of value before clamping to get proper rounding. In other
            // case brightness loss will be noticeable if you resize image with white
            // border and place it on white background.
            //
            dest[destOffset] = (r + (1 << 13)) >> fixedFracBits;
            dest[destOffset + 1] = (g + (1 << 13)) >> fixedFracBits;
            dest[destOffset + 2] = (b + (1 << 13)) >> fixedFracBits;
            dest[destOffset + 3] = (a + (1 << 13)) >> fixedFracBits;
            destOffset = (destOffset + sh * 4) | 0;
        }
        destOffset = ((sourceY + 1) * 4) | 0;
        srcOffset = ((sourceY + 1) * sw * 4) | 0;
    }
};
exports.convolve = convolve;
/*
  Adapted to typescript from pica: https://github.com/nodeca/pica

  (The MIT License)

  Copyright (C) 2014-2017 by Vitaly Puzrin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
//# sourceMappingURL=convolve.js.map
});

const convolve = /*@__PURE__*/getDefaultExportFromCjs(convolve_1);

var dist = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lanczos2 = exports.lanczos = void 0;




const resize = (source, dest, use2 = false) => {
    const xRatio = dest.width / source.width;
    const yRatio = dest.height / source.height;
    const filtersX = filters_1.filters(source.width, dest.width, xRatio, 0, use2);
    const filtersY = filters_1.filters(source.height, dest.height, yRatio, 0, use2);
    const tmp = new Uint8ClampedArray(dest.width * source.height * 4);
    convolve_1.convolve(source.data, tmp, source.width, source.height, dest.width, filtersX);
    convolve_1.convolve(tmp, dest.data, source.height, dest.width, dest.height, filtersY);
};
const lanczos = (source, dest, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, dx = 0, dy = 0, dw = dest.width - dx, dh = dest.height - dy) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    dx = dx | 0;
    dy = dy | 0;
    dw = dw | 0;
    dh = dh | 0;
    if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0)
        return;
    if (sx === 0 && sy === 0 && sw === source.width && sh === source.height && dx === 0 && dy === 0 && dw === dest.width && dh === dest.height) {
        resize(source, dest);
        return;
    }
    /*
      this is more expensive than the way we do in other rgba-lib functions, but
      I don't understand the pica code that I based this on well enough to work
      out how to use regions without doing crops first
  
      however copy is pretty fast compared to lanczos, so the difference is slight
    */
    const croppedSource = dist$1.createImage(sw, sh);
    const croppedDest = dist$1.createImage(dw, dh);
    dist$2.copy(source, croppedSource, sx, sy);
    resize(croppedSource, croppedDest);
    dist$2.copy(croppedDest, dest, 0, 0, croppedDest.width, croppedDest.height, dx, dy);
};
exports.lanczos = lanczos;
const lanczos2 = (source, dest, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, dx = 0, dy = 0, dw = dest.width - dx, dh = dest.height - dy) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    dx = dx | 0;
    dy = dy | 0;
    dw = dw | 0;
    dh = dh | 0;
    if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0)
        return;
    if (sx === 0 && sy === 0 && sw === source.width && sh === source.height && dx === 0 && dy === 0 && dw === dest.width && dh === dest.height) {
        resize(source, dest, true);
        return;
    }
    /*
      this is more expensive than the way we do in other rgba-lib functions, but
      I don't understand the pica code that I based this on well enough to work
      out how to use regions without doing crops first
  
      however copy is pretty fast compared to lanczos, so the difference is slight
    */
    const croppedSource = dist$1.createImage(sw, sh);
    const croppedDest = dist$1.createImage(dw, dh);
    dist$2.copy(source, croppedSource, sx, sy);
    resize(croppedSource, croppedDest, true);
    dist$2.copy(croppedDest, dest, 0, 0, croppedDest.width, croppedDest.height, dx, dy);
};
exports.lanczos2 = lanczos2;
//# sourceMappingURL=index.js.map
});

const index = /*@__PURE__*/getDefaultExportFromCjs(dist);

const makeWidth = (size) => {
  return {
    kind: "width",
    size,
  };
};
const makeHeight = (size) => {
  return {
    kind: "height",
    size,
  };
};
const ordBySize = Ord$2.contramap((s) => s.size)(number.Ord);
const ordByKind = {
  equals: (x, y) => x.kind === y.kind,
  compare: (x, y) => {
    return x.kind === y.kind ? 0 : x.kind === "width" ? -1 : 1;
  },
};
const sortDimentionsBySize = _Array.sort(ordBySize);
const sortDimentionsByKind = _Array.sort(ordByKind);
const getDimentionsRatio = (sortedDimensions) => {
  const [smallest, largest] = sortedDimensions;
  return smallest.size / largest.size;
};
const scaleByLargestSide = (toSize) => (dimensions) => {
  const sortedDimensions = sortDimentionsBySize(dimensions);
  const ratio = getDimentionsRatio(sortedDimensions);
  const newSmallestSide = Object.assign(Object.assign({}, sortedDimensions[0]), { size: toSize * ratio });
  const newLargestSide = Object.assign(Object.assign({}, sortedDimensions[1]), { size: toSize });
  return sortDimentionsByKind([newLargestSide, newSmallestSide]);
};
const dimensionsFromImage = (image) => {
  const { naturalWidth, naturalHeight } = image;
  return [makeWidth(naturalWidth), makeHeight(naturalHeight)];
};

const createCanvasWithContext = () => {
  const canvas = document.createElement("canvas");
  const contenx = canvas.getContext("2d");
  return [canvas, contenx];
};
const imageDataFromImage = (image) => {
  const { naturalWidth, naturalHeight } = image;
  const [canvas, context] = createCanvasWithContext();
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, naturalWidth, naturalHeight);
};
const resizeImage = (width, i) => {
  const scale = scaleByLargestSide(width);
  const [destinationCanvas, destinationContext] = createCanvasWithContext();
  const imageDimensions = dimensionsFromImage(i);
  const [destinationWidth, destinationHeight] = scale(imageDimensions).map((d) => d.size);
  const destinationImageData = new ImageData(destinationWidth, destinationHeight);
  const originImageData = imageDataFromImage(i);
  destinationCanvas.width = destinationWidth;
  destinationCanvas.height = destinationHeight;
  dist.lanczos(originImageData, destinationImageData);
  destinationContext.putImageData(destinationImageData, 0, 0);
  return destinationCanvas.toDataURL();
};

const toFile = async (b64data) => {
  const request = await fetch(b64data);
  const blob = await request.blob();
  return new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
};
const convertB64toFileTask = (b64data) => () => new Promise(async (resolve, _) => {
  const request = await fetch(b64data);
  const blob = await request.blob();
  const file = new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
  resolve(file);
});

const imageToB64 = (i) => {
  const canvas = document.createElement("canvas");
  const { naturalWidth, naturalHeight } = i;
  const ctx = canvas.getContext("2d");
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  ctx.drawImage(i, 0, 0, naturalWidth, naturalHeight);
  return canvas.toDataURL();
};

const checkFileWithExtention = (file) => _function.pipe(file, Option.fromNullable, Either.fromOption(() => fileDoesntExistError), Either.chain(checkImageType));
const optionalResize = (image, size) => image.naturalWidth > size ? resizeImage(size, image) : imageToB64(image);
const resizeFileTo = (size) => (file) => _function.pipe(file, imageFromFileTask, Task.map((image) => optionalResize(image, size)), Task.chain(convertB64toFileTask));

const RESIZED_IMAGE_WIDTH = 500;
const makeAuthorizedRequest = (token) => pipe(token, processBearerToken, map$8((headers) => {
  return {
    headers,
  };
}));
const { state, onChange } = createStore({
  token: undefined,
  results: [],
  filters: [],
  resetCategoryLink: undefined,
  activeIonLink: undefined,
  cropperHandlers: [],
  selectedCropper: undefined,
  rectangleSearchForm: undefined,
  detectedObjects: [],
  detectedObject: undefined,
  objectDetectionInProgress: false,
  imageWidth: RESIZED_IMAGE_WIDTH,
  image: Option.none,
  imageUrl: Option.none,
  imageBounds: Option.none,
  searchArea: Option.none,
  resultsComponents: [],
  serverError: false,
  loading: false,
});
const updateState = async (response) => {
  var _a;
  state.results = response.value;
  state.filters = readFilters(foldValueObject(response.filters));
  state.rectangleSearchForm = response.searchArea;
  state.resetCategoryLink = (_a = response.links) === null || _a === void 0 ? void 0 : _a.clearFilters;
  state.loading = false;
};
const makeLinkRequest = (link) => {
  return pipe(makeAuthorizedRequest(state.token), fromEither$2, chainW(linkRequest(link)));
};
const detectObjects = async (data) => {
  state.objectDetectionInProgress = true;
  const error = {
    kind: "server",
    inner: "Can not get a link for objects detection",
  };
  await pipe(getLink(data, "detectedObjects"), fromOption$2(() => error), chain$4(makeLinkRequest), map$4((objects) => (state.detectedObjects = foldValueObject(objects))))();
  state.objectDetectionInProgress = false;
};
const uploadHiresFile = async (sessionResponse, file) => {
  const ionFile = await fromFile$1(file);
  const formPayload = {
    image: ionFile,
  };
  const form = sessionResponse.uploadHighResolutionImage;
  await pipe(makeAuthorizedRequest(state.token), fromEither$2, chainW(formRequest(form, formPayload)))();
};
const makeRectangularSearchRequest = async () => {
  state.loading = true;
  pipe(sequenceToOption(state.imageBounds, state.searchArea), Option.map(async ([bounds, searchArea]) => {
    const scaled = divideOnSized(bounds)(searchArea);
    const searchRectangle = {
      width: scaled.width,
      height: scaled.height,
      left: scaled.x,
      top: scaled.y,
    };
    return await pipe(makeAuthorizedRequest(state.token), fromEither$2, chainW(formRequest(state.rectangleSearchForm, searchRectangle)), map$4(updateState))();
  }));
};
const uploadFile = (file) => {
  state.loading = true;
  const fileForm = imageFormFromFile(file);
  const tokenWithFile = sequenceToEither(processBearerToken(state.token), right$2(fileForm));
  return pipe(tokenWithFile, map$8(([headers, body]) => {
    return {
      headers,
      body,
    };
  }), fromEither$2, chain$4(searchSessionClient), map$4((sessionResponse) => {
    updateState(sessionResponse);
    detectObjects(sessionResponse);
    state.loading = false;
    return sessionResponse;
  }), mapLeft((error) => {
    state.serverError = true;
    state.loading = false;
    return error;
  }));
};
const imageSearchState = state;
onChange("activeIonLink", async (newLink) => {
  state.loading = true;
  const link = newLink ? newLink : state.resetCategoryLink;
  await pipe(makeAuthorizedRequest(state.token), fromEither$2, chainW(linkRequest(link)), map$4(updateState), mapLeft((error) => {
    return {
      kind: "network error",
      inner: error,
    };
  }))();
});
onChange("searchArea", (newSearchArea) => {
  pipe(newSearchArea, Option.map((area) => {
    state.cropperHandlers = fromRectangle$1(area);
  }));
});
onChange("serverError", () => {
  state.loading = false;
});
const setSelectedImage = (image) => {
  imageSearchState.image = Option.some(image);
  imageSearchState.imageUrl = Option.some(image.src);
};
const processSelectedFile = async (file) => {
  const originFile = checkFileWithExtention(file);
  const fileResizer = resizeFileTo(RESIZED_IMAGE_WIDTH);
  const resizeFileTask = pipe(originFile, fromEither$2, chainTaskK(fileResizer));
  const session = await pipe(resizeFileTask, chain$4(uploadFile))();
  pipe(sequenceToEither(session, originFile), map$8(([sessionObject, file]) => uploadHiresFile(sessionObject, file)));
  await pipe(resizeFileTask, chainTaskK(imageFromFileTask), map$4(setSelectedImage))();
  return session;
};

export { Apply$5 as A, Either as E, TaskEither as T, chainW as a, createInitPostRequest as b, createInitGetRequest as c, state$1 as d, match$5 as e, fromEither$2 as f, getApiPath as g, dimensionsFromImage as h, imageSearchState as i, scaleByLargestSide as j, fromImage as k, move as l, makeRequest as m, makeRectangularSearchRequest as n, fromAlt as o, processSelectedFile as p, foldValueObject as q, scaleWithSized as r, sequenceT as s, transform as t, center as u, detectedObjectEq as v, toFile as w, state$2 as x };
