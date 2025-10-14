var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS((exports, module) => {
  var has = Object.prototype.hasOwnProperty;
  var prefix = "~";
  function Events() {}
  if (Object.create) {
    Events.prototype = Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events;
    else
      delete emitter._events[evt];
  }
  function EventEmitter() {
    this._events = new Events;
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l);i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, undefined, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1);i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0;i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, undefined, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1);j < len; j++) {
                args[j - 1] = arguments[j];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length;i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events;
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  if (typeof module !== "undefined") {
    module.exports = EventEmitter;
  }
});

// node_modules/@noble/secp256k1/index.js
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
var secp256k1_CURVE = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  h: 1n,
  a: 0n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P, n: N, Gx, Gy, b: _b } = secp256k1_CURVE;
var L = 32;
var L2 = 64;
var lengths = {
  publicKey: L + 1,
  publicKeyUncompressed: L2 + 1,
  signature: L2,
  seed: L + L / 2
};
var captureTrace = (...args) => {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
};
var err = (message = "") => {
  const e = new Error(message);
  captureTrace(e, err);
  throw e;
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes = (value, length, title = "") => {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== undefined;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    err(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
};
var u8n = (len) => new Uint8Array(len);
var padh = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex = (b) => Array.from(abytes(b)).map((e) => padh(e, 2)).join("");
var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9)
    return ch - C._0;
  if (ch >= C.A && ch <= C.F)
    return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f)
    return ch - (C.a - 10);
  return;
};
var hexToBytes = (hex) => {
  const e = "hex invalid";
  if (!isStr(hex))
    return err(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0;ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined)
      return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var cr = () => globalThis?.crypto;
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + abytes(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes = (len = L) => {
  const c = cr();
  return c.getRandomValues(u8n(len));
};
var big = BigInt;
var arange = (n, min, max, msg = "bad number: out of range") => isBig(n) && min <= n && n < max ? n : err(msg);
var M = (a, b = P) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
var modN = (a) => M(a, N);
var invert = (num, md) => {
  if (num === 0n || md <= 0n)
    err("no inverse n=" + num + " mod=" + md);
  let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q = b / a, r = b % a;
    const m = x - u * q, n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var koblitz = (x) => M(M(x * x) * x + _b);
var FpIsValid = (n) => arange(n, 0n, P);
var FpIsValidNot0 = (n) => arange(n, 1n, P);
var FnIsValidNot0 = (n) => arange(n, 1n, N);
var isEven = (y) => (y & 1n) === 0n;
var u8of = (n) => Uint8Array.of(n);
var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
var lift_x = (x) => {
  const c = koblitz(FpIsValidNot0(x));
  let r = 1n;
  for (let num = c, e = (P + 1n) / 4n;e > 0n; e >>= 1n) {
    if (e & 1n)
      r = r * num % P;
    num = num * num % P;
  }
  return M(r * r) === c ? r : err("sqrt invalid");
};

class Point {
  static BASE;
  static ZERO;
  X;
  Y;
  Z;
  constructor(X, Y, Z) {
    this.X = FpIsValid(X);
    this.Y = FpIsValidNot0(Y);
    this.Z = FpIsValid(Z);
    Object.freeze(this);
  }
  static CURVE() {
    return secp256k1_CURVE;
  }
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I : new Point(x, y, 1n);
  }
  static fromBytes(bytes) {
    abytes(bytes);
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    let p = undefined;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    const x = sliceBytesNumBE(tail, 0, L);
    if (length === comp && (head === 2 || head === 3)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big(head));
      if (evenH !== evenY)
        y = M(-y);
      p = new Point(x, y, 1n);
    }
    if (length === uncomp && head === 4)
      p = new Point(x, sliceBytesNumBE(tail, L, L2), 1n);
    return p ? p.assertValidity() : err("bad point: not on curve");
  }
  static fromHex(hex) {
    return Point.fromBytes(hexToBytes(hex));
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  equals(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2);
    const X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2);
    const Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  negate() {
    return new Point(this.X, M(-this.Y), this.Z);
  }
  double() {
    return this.add(this);
  }
  add(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
    const a = 0n;
    const b = _b;
    let X3 = 0n, Y3 = 0n, Z3 = 0n;
    const b3 = M(b * 3n);
    let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1);
    let t4 = M(X2 + Y2);
    t3 = M(t3 * t4);
    t4 = M(t0 + t1);
    t3 = M(t3 - t4);
    t4 = M(X1 + Z1);
    let t5 = M(X2 + Z2);
    t4 = M(t4 * t5);
    t5 = M(t0 + t2);
    t4 = M(t4 - t5);
    t5 = M(Y1 + Z1);
    X3 = M(Y2 + Z2);
    t5 = M(t5 * X3);
    X3 = M(t1 + t2);
    t5 = M(t5 - X3);
    Z3 = M(a * t4);
    X3 = M(b3 * t2);
    Z3 = M(X3 + Z3);
    X3 = M(t1 - Z3);
    Z3 = M(t1 + Z3);
    Y3 = M(X3 * Z3);
    t1 = M(t0 + t0);
    t1 = M(t1 + t0);
    t2 = M(a * t2);
    t4 = M(b3 * t4);
    t1 = M(t1 + t2);
    t2 = M(t0 - t2);
    t2 = M(a * t2);
    t4 = M(t4 + t2);
    t0 = M(t1 * t4);
    Y3 = M(Y3 + t0);
    t0 = M(t5 * t4);
    X3 = M(t3 * X3);
    X3 = M(X3 - t0);
    t0 = M(t3 * t1);
    Z3 = M(t5 * Z3);
    Z3 = M(Z3 + t0);
    return new Point(X3, Y3, Z3);
  }
  subtract(other) {
    return this.add(apoint(other).negate());
  }
  multiply(n, safe = true) {
    if (!safe && n === 0n)
      return I;
    FnIsValidNot0(n);
    if (n === 1n)
      return this;
    if (this.equals(G))
      return wNAF(n).p;
    let p = I;
    let f = G;
    for (let d = this;n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n)
        p = p.add(d);
      else if (safe)
        f = f.add(d);
    }
    return p;
  }
  multiplyUnsafe(scalar) {
    return this.multiply(scalar, false);
  }
  toAffine() {
    const { X: x, Y: y, Z: z } = this;
    if (this.equals(I))
      return { x: 0n, y: 0n };
    if (z === 1n)
      return { x, y };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n)
      err("inverse invalid");
    return { x: M(x * iz), y: M(y * iz) };
  }
  assertValidity() {
    const { x, y } = this.toAffine();
    FpIsValidNot0(x);
    FpIsValidNot0(y);
    return M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
  }
  toBytes(isCompressed = true) {
    const { x, y } = this.assertValidity().toAffine();
    const x32b = numTo32b(x);
    if (isCompressed)
      return concatBytes(getPrefix(y), x32b);
    return concatBytes(u8of(4), x32b, numTo32b(y));
  }
  toHex(isCompressed) {
    return bytesToHex(this.toBytes(isCompressed));
  }
}
var G = new Point(Gx, Gy, 1n);
var I = new Point(0n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var bytesToNumBE = (b) => big("0x" + (bytesToHex(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B256 = 2n ** 256n;
var numTo32b = (num) => hexToBytes(padh(arange(num, 0n, B256), L2));
var secretKeyToScalar = (secretKey) => {
  const num = bytesToNumBE(abytes(secretKey, L, "secret key"));
  return arange(num, 1n, N, "invalid secret key: outside of range");
};
var getPublicKey = (privKey, isCompressed = true) => {
  return G.multiply(secretKeyToScalar(privKey)).toBytes(isCompressed);
};
var NULL = u8n(0);
var byte0 = u8of(0);
var byte1 = u8of(1);
var getSharedSecret = (secretKeyA, publicKeyB, isCompressed = true) => {
  return Point.fromBytes(publicKeyB).multiply(secretKeyToScalar(secretKeyA)).toBytes(isCompressed);
};
var randomSecretKey = (seed = randomBytes(lengths.seed)) => {
  abytes(seed);
  if (seed.length < lengths.seed || seed.length > 1024)
    err("expected 40-1024b");
  const num = M(bytesToNumBE(seed), N - 1n);
  return numTo32b(num + 1n);
};
var createKeygen = (getPublicKey2) => (seed) => {
  const secretKey = randomSecretKey(seed);
  return { secretKey, publicKey: getPublicKey2(secretKey) };
};
var keygen = createKeygen(getPublicKey);
var extpubSchnorr = (priv) => {
  const d_ = secretKeyToScalar(priv);
  const p = G.multiply(d_);
  const { x, y } = p.assertValidity().toAffine();
  const d = isEven(y) ? d_ : modN(-d_);
  const px = numTo32b(x);
  return { d, px };
};
var pubSchnorr = (secretKey) => {
  return extpubSchnorr(secretKey).px;
};
var keygenSchnorr = createKeygen(pubSchnorr);
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p = G;
  let b = p;
  for (let w = 0;w < pwindows; w++) {
    b = p;
    points.push(b);
    for (let i = 1;i < pwindowSize; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows = undefined;
var ctneg = (cnd, p) => {
  const n = p.negate();
  return cnd ? n : p;
};
var wNAF = (n) => {
  const comp = Gpows || (Gpows = precompute());
  let p = I;
  let f = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w = 0;w < pwindows; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven2 = w % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg(isEven2, comp[offF]));
    } else {
      p = p.add(ctneg(isNeg, comp[offP]));
    }
  }
  if (n !== 0n)
    err("invalid wnaf");
  return { p, f };
};

// node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`positive integer expected, not ${n}`);
}
function isBytes2(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths2) {
  if (!isBytes2(b))
    throw new Error("Uint8Array expected");
  if (lengths2.length > 0 && !lengths2.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths2}, not of length=${b.length}`);
}
function hash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(h.outputLen);
  number(h.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

// node_modules/@noble/hashes/esm/utils.js
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  bytes(data);
  return data;
}
class Hash {
  clone() {
    return this._cloneInto();
  }
}
var toStr = {}.toString;
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}

// node_modules/@noble/hashes/esm/hmac.js
class HMAC extends Hash {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0;i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0;i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
hmac.create = (hash2, key) => new HMAC(hash2, key);

// node_modules/@noble/hashes/esm/hkdf.js
function extract(hash2, ikm, salt) {
  hash(hash2);
  if (salt === undefined)
    salt = new Uint8Array(hash2.outputLen);
  return hmac(hash2, toBytes(salt), toBytes(ikm));
}
var HKDF_COUNTER = /* @__PURE__ */ new Uint8Array([0]);
var EMPTY_BUFFER = /* @__PURE__ */ new Uint8Array;
function expand(hash2, prk, info, length = 32) {
  hash(hash2);
  number(length);
  if (length > 255 * hash2.outputLen)
    throw new Error("Length should be <= 255*HashLen");
  const blocks = Math.ceil(length / hash2.outputLen);
  if (info === undefined)
    info = EMPTY_BUFFER;
  const okm = new Uint8Array(blocks * hash2.outputLen);
  const HMAC2 = hmac.create(hash2, prk);
  const HMACTmp = HMAC2._cloneInto();
  const T = new Uint8Array(HMAC2.outputLen);
  for (let counter = 0;counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
    okm.set(T, hash2.outputLen * counter);
    HMAC2._cloneInto(HMACTmp);
  }
  HMAC2.destroy();
  HMACTmp.destroy();
  T.fill(0);
  HKDF_COUNTER.fill(0);
  return okm.slice(0, length);
}
var hkdf = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;

class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (;blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos;i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0;i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor);
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
}

// node_modules/@noble/hashes/esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);

class SHA256 extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C: C2, D, E, F, G: G2, H } = this;
    return [A, B, C2, D, E, F, G2, H];
  }
  set(A, B, C2, D, E, F, G2, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G2 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0;i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16;i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C: C2, D, E, F, G: G2, H } = this;
    for (let i = 0;i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G2) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C2) | 0;
      H = G2;
      G2 = F;
      F = E;
      E = D + T1 | 0;
      D = C2;
      C2 = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G2 = G2 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C2, D, E, F, G2, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
}
var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256);

// src/dependencies/bytes.ts
class Bytes {
  buffer;
  offset;
  len;
  static new(len) {
    return new Bytes(new ArrayBuffer(len));
  }
  static from_string(str) {
    const out = Bytes.new(str.length * 2);
    out.write_string(str);
    return out.slice_to_written();
  }
  view;
  cursor = 0;
  constructor(buffer, offset = 0, len) {
    this.buffer = buffer;
    this.offset = offset;
    this.len = len;
    this.view = new DataView(buffer);
  }
  current_position() {
    return this.cursor;
  }
  advance_cursor(amount) {
    this.cursor += amount;
    return this.cursor - amount;
  }
  slice_to_written() {
    return new Bytes(this.buffer, this.offset, this.cursor);
  }
  slice_to(amount) {
    return new Bytes(this.buffer, this.offset, amount);
  }
  slice(start, end) {
    return new Bytes(this.buffer, this.offset + start, end - start);
  }
  slice_from_current_with_length(len) {
    const out = new Bytes(this.buffer, this.offset + this.cursor, len);
    this.cursor += len;
    return out;
  }
  reset_cursor() {
    this.cursor = 0;
    return this;
  }
  length() {
    return this.len ?? this.buffer.byteLength;
  }
  raw() {
    return new Uint8Array(this.buffer, this.offset, this.length());
  }
  *iter() {
    yield* this.raw();
  }
  read_i8() {
    const out = this.view.getInt8(this.offset + this.cursor);
    this.cursor++;
    return out;
  }
  read_i16() {
    const out = this.view.getInt16(this.offset + this.cursor, false);
    this.cursor += 2;
    return out;
  }
  read_i32() {
    const out = this.view.getInt32(this.offset + this.cursor, false);
    this.cursor += 4;
    return out;
  }
  read_u8() {
    const out = this.view.getUint8(this.offset + this.cursor);
    this.cursor++;
    return out;
  }
  read_u16() {
    const out = this.view.getUint16(this.offset + this.cursor, false);
    this.cursor += 2;
    return out;
  }
  read_u32() {
    const out = this.view.getUint32(this.offset + this.cursor, false);
    this.cursor += 4;
    return out;
  }
  read_f16() {
    const out = this.view.getFloat16(this.offset + this.cursor);
    this.cursor += 2;
    return out;
  }
  read_f32() {
    const out = this.view.getFloat32(this.offset + this.cursor, false);
    this.cursor += 4;
    return out;
  }
  read_f64() {
    const out = this.view.getFloat64(this.offset + this.cursor, false);
    this.cursor += 8;
    return out;
  }
  write_u8(num) {
    this.view.setUint8(this.offset + this.cursor, num);
    this.cursor++;
    return this;
  }
  write_u8_at(num, cursor) {
    this.view.setUint8(cursor, num);
    this.cursor++;
    return this;
  }
  write_u16_at(num, index) {
    this.view.setUint16(this.offset + index, num, false);
    return this;
  }
  write_u16(num) {
    this.view.setUint16(this.offset + this.cursor, num, false);
    this.cursor += 2;
    return this;
  }
  write_u32(num) {
    this.view.setUint32(this.offset + this.cursor, num, false);
    this.cursor += 4;
    return this;
  }
  write_i8(num) {
    this.view.setInt8(this.offset + this.cursor, num);
    this.cursor++;
    return this;
  }
  write_i16(num) {
    this.view.setInt16(this.offset + this.cursor, num, false);
    this.cursor += 2;
    return this;
  }
  write_i32(num) {
    this.view.setInt32(this.offset + this.cursor, num, false);
    this.cursor += 4;
    return this;
  }
  write_f16(num) {
    this.view.setFloat16(this.offset + this.cursor, num);
    this.cursor += 2;
    return this;
  }
  write_f32(num) {
    this.view.setFloat32(this.offset + this.cursor, num, false);
    this.cursor += 4;
    return this;
  }
  write_f64(num) {
    this.view.setFloat64(this.offset + this.cursor, num, false);
    this.cursor += 8;
    return this;
  }
  remaining() {
    return this.length() - this.cursor;
  }
  write_slice(buf) {
    this.raw().set(buf, this.cursor);
    this.cursor += buf.length;
  }
  write_string(str) {
    let code = 0;
    for (let i = 0, len = str.length;i < len; i++) {
      code = str.charCodeAt(i);
      if (code > 255)
        this.write_u16(code);
      else
        this.write_u8(code);
    }
  }
}

// src/dependencies/struct.ts
var ToParseStruct = Symbol("struct");
var FieldReadMap = {
  [0 /* u8 */]: (bytes2) => bytes2.read_u8(),
  [1 /* u16 */]: (bytes2) => bytes2.read_u16(),
  [2 /* u32 */]: (bytes2) => bytes2.read_u32(),
  [3 /* i8 */]: (bytes2) => bytes2.read_i8(),
  [4 /* i16 */]: (bytes2) => bytes2.read_i16(),
  [5 /* i32 */]: (bytes2) => bytes2.read_i32(),
  [7 /* f32 */]: (bytes2) => bytes2.read_f32(),
  [8 /* f64 */]: (bytes2) => bytes2.read_f64()
};
var PrimitiveTypeSize = {
  [3 /* i8 */]: 1,
  [4 /* i16 */]: 2,
  [5 /* i32 */]: 4,
  [0 /* u8 */]: 1,
  [1 /* u16 */]: 2,
  [2 /* u32 */]: 4,
  [7 /* f32 */]: 4,
  [8 /* f64 */]: 8
};
function Field(type) {
  return function(target, prop) {
    const construct = target.constructor;
    (construct.field_names ??= []).push(prop);
    (construct.fields ??= {})[prop] = type;
  };
}
function retrieve_value_from(ty, bytes2) {
  if (ty & 16 /* Optional */) {
    const byte = bytes2.read_u8();
    const byte_opt = byte & 16 /* Optional */;
    if (ty & 32 /* Struct */ && byte_opt)
      return ToParseStruct;
    return byte_opt ? FieldReadMap[ty & ~16 /* Optional */](bytes2) : undefined;
  }
  return FieldReadMap[ty](bytes2);
}
function size_of(ty) {
  if (ty instanceof Struct)
    return ty.byte_size();
  else {
    if (ty & 16 /* Optional */)
      return PrimitiveTypeSize[ty & ~16 /* Optional */] + 1;
    else
      return PrimitiveTypeSize[ty];
  }
}
function write_field(field_type, value, bytes2) {
  if ((field_type & 16 /* Optional */) !== 0)
    bytes2.write_u8(16 /* Optional */);
  switch (field_type & 15) {
    case 3 /* i8 */:
      return bytes2.write_i8(value);
    case 4 /* i16 */:
      return bytes2.write_i16(value);
    case 5 /* i32 */:
      return bytes2.write_i32(value);
    case 6 /* f16 */:
      return bytes2.write_f16(value);
    case 7 /* f32 */:
      return bytes2.write_f32(value);
    case 8 /* f64 */:
      return bytes2.write_f64(value);
    case 0 /* u8 */:
      return bytes2.write_u8(value);
    case 1 /* u16 */:
      return bytes2.write_u16(value);
    case 2 /* u32 */:
      return bytes2.write_u32(value);
  }
}

class Struct {
  static deserialize(bytes2) {
    const out = new this;
    const fields = this.fields;
    for (const field of this.field_names) {
      const field_type = fields[field];
      out[field] = typeof field_type === "number" ? retrieve_value_from(field_type, bytes2) : field_type.deserialize(bytes2);
    }
    return out;
  }
  byte_size() {
    let byte_size = 0;
    const fields = this.constructor.fields;
    for (const field of this.constructor.field_names) {
      const field_type = fields[field];
      byte_size += typeof field_type === "number" ? size_of(field_type) : this[field].byte_size();
    }
    return byte_size;
  }
  serialize(bytes2) {
    const fields = this.constructor.fields;
    for (const field of this.constructor.field_names) {
      const field_type = fields[field];
      typeof field_type === "number" ? write_field(field_type, this[field], bytes2) : this[field].serialize(bytes2);
    }
  }
}

// src/content/varid.ts
class VarId extends Struct {
  raw;
  static deserialize(bytes2) {
    const first = bytes2.read_u16();
    if (first <= 32767)
      return new VarId(first);
    else
      return new VarId(first << 16 | bytes2.read_u16());
  }
  constructor(raw) {
    super();
    this.raw = raw;
  }
  set_raw(raw) {
    this.raw = raw;
  }
  serialize(bytes2) {
    if (this.raw < 32767)
      bytes2.write_u16(this.raw);
    else
      bytes2.write_u32(this.raw | 1 << 31);
  }
  valueOf() {
    if ((this.raw & 65535) <= 32767)
      return this.raw;
    else
      return this.raw & ~(1 << 31);
  }
  byte_size() {
    return this.raw > 32767 ? 4 : 2;
  }
}

// src/dependencies/struct_arr.ts
function DeserializeArr(c, bytes2) {
  const slice = bytes2.slice_from_current_with_length(+VarId.deserialize(bytes2));
  let idx = 0;
  const out = [];
  while (slice.remaining() > 0)
    out[idx++] = c.deserialize(slice);
  return out;
}
function StructArray(ty) {
  return class StructArray2 extends Array {
    static deserialize(bytes2) {
      const arr = DeserializeArr(ty, bytes2);
      Object.setPrototypeOf(arr, this.prototype);
      return arr;
    }
    constructor(...args) {
      super();
      this.push(...args);
    }
    byte_size() {
      let out = 0;
      for (const data of this)
        out += data.byte_size();
      return out;
    }
    serialize(bytes2) {
      const offset = bytes2.advance_cursor(2);
      const cursor = bytes2.cursor;
      for (const content of this)
        content.serialize(bytes2);
      bytes2.write_u16_at(bytes2.cursor - cursor, offset);
    }
  };
}
String.prototype.byte_size = function() {
  return this.length * 2;
};
String.prototype.serialize = function(bytes2) {
  const cursor = bytes2.advance_cursor(2);
  const curr = bytes2.cursor;
  for (let i = 0, j = this.length;i < j; i++)
    bytes2.write_u16(this.charCodeAt(i));
  bytes2.write_u16_at(bytes2.cursor - curr, cursor);
};
String.deserialize = function(bytes2) {
  let len = bytes2.read_u16();
  let out = "";
  let toremove = Math.min(len, 32767);
  while (len > 0) {
    out += String.fromCharCode.apply(null, bytes2.slice_from_current_with_length(toremove).raw());
    toremove = Math.min(len -= toremove, 32767);
  }
  return out;
};
Uint8Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(this);
};
Uint8Array.prototype.byte_size = function() {
  return this.byteLength;
};
Uint8Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return bytes2.slice_from_current_with_length(len).raw();
};
Uint16Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Uint16Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Uint16Array(bytes2.slice_from_current_with_length(len).raw());
};
Uint32Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Uint32Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Uint32Array(bytes2.slice_from_current_with_length(len).raw());
};
Int8Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Int8Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Int8Array(bytes2.slice_from_current_with_length(len).raw());
};
Int16Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Int16Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Int16Array(bytes2.slice_from_current_with_length(len).raw());
};
Int32Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Int32Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Int32Array(bytes2.slice_from_current_with_length(len).raw());
};
Float32Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Float32Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Float32Array(bytes2.slice_from_current_with_length(len).raw());
};
Float64Array.prototype.serialize = function(bytes2) {
  const len = this.byteLength;
  bytes2.write_u16(len);
  bytes2.write_slice(new Uint8Array(this));
};
Float64Array.deserialize = function(bytes2) {
  const len = bytes2.read_u16();
  return new Float64Array(bytes2.slice_from_current_with_length(len).raw());
};

// src/content/ids.ts
class FrameId {
  ty;
  flags;
  static from(byte) {
    return new this((byte & 240) >> 4, byte & 15);
  }
  constructor(ty, flags) {
    this.ty = ty;
    this.flags = flags;
  }
  valueOf() {
    return this.ty << 4 | this.flags;
  }
}
class CryptoId extends FrameId {
  constructor(flags) {
    super(2 /* Crypto */, flags);
  }
  is_fin() {
    return (this.flags & 8 /* Fin */) != 0;
  }
  data_type() {
    return (this.flags & 3) != 0;
  }
  is_encrypted() {
    return (this.flags & 4 /* Encrypted */) != 0;
  }
}
class DataId extends FrameId {
  constructor(flags) {
    super(3 /* Content */, flags);
  }
  is_fin() {
    return (this.flags & 8 /* Fin */) != 0;
  }
  compression_type() {
    return (this.flags & 3) != 0;
  }
  is_encrypted() {
    return (this.flags & 4 /* Encrypted */) != 0;
  }
}

// src/content/frame.ts
class Frame extends Struct {
  id;
  static Array = StructArray(this);
  static deserialize(bytes2) {
    const id = FrameId.from(bytes2.read_u8());
    switch (id.ty) {
      case 1 /* Ping */:
        return new Ping;
      case 2 /* Crypto */:
        {
          const identifier = VarId.deserialize(bytes2);
          const len = VarId.deserialize(bytes2);
          const slice = bytes2.slice_from_current_with_length(+len);
          return new Crypto(id.flags, slice, identifier);
        }
        ;
      case 3 /* Content */: {
        const identifier = VarId.deserialize(bytes2);
        const len = VarId.deserialize(bytes2);
        const slice = bytes2.slice_from_current_with_length(+len);
        return new Data(id.flags, slice, identifier);
      }
      default:
        return;
    }
  }
  constructor(id) {
    super();
    this.id = id;
  }
  len() {
    return 0;
  }
  serialize(bytes2) {
    bytes2.write_u8(+this.id);
  }
}
var FrameArray = StructArray(Frame);

class Data extends Frame {
  data;
  identifier;
  static index = 0;
  constructor(flags, data, identifier = new VarId(Data.index++)) {
    super(new DataId(flags));
    this.data = data;
    this.identifier = identifier;
    this.id = new DataId(flags);
  }
  len() {
    return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
  }
  payload_len() {
    return this.data.length();
  }
  serialize(bytes2) {
    bytes2.write_u8(+this.id);
    this.identifier.serialize(bytes2);
    new VarId(this.data.length()).serialize(bytes2);
    bytes2.write_slice(this.data.raw());
  }
  sliced(amount) {
    return new Data(this.id.flags, this.data.slice_to(amount), this.identifier);
  }
  mark_fin() {
    this.id.flags |= 8 /* Fin */;
  }
  content() {
    return this.data.slice_to(this.data.length()).raw();
  }
}
class TransferParameter extends Struct {
  key;
  max_content;
  max_datagram_size;
  wait_base;
  static deserialize(bytes2) {
    const flags = bytes2.read_u8();
    let key;
    if (flags & 128 /* HasKey */)
      key = bytes2.slice_from_current_with_length(33).raw();
    let max_content;
    if (flags & 64 /* MaxContentLength */)
      max_content = bytes2.read_u16();
    let max_datagram_size = 8192;
    if (flags & 32 /* MaxDatagramLength */)
      max_datagram_size = bytes2.read_u32();
    let wait_base = 2;
    if (flags & 16 /* WaitBase */)
      wait_base = bytes2.read_u8();
    return new this(key, max_content, max_datagram_size, wait_base);
  }
  constructor(key, max_content, max_datagram_size = 8192, wait_base = 2) {
    super();
    this.key = key;
    this.max_content = max_content;
    this.max_datagram_size = max_datagram_size;
    this.wait_base = wait_base;
  }
  serialize(bytes2) {
    const cursor = bytes2.advance_cursor(1);
    let flags = 0;
    if (this.key) {
      flags |= 128 /* HasKey */;
      bytes2.write_slice(this.key);
    }
    if (this.max_content !== undefined) {
      flags |= 64 /* MaxContentLength */;
      bytes2.write_u16(this.max_content);
    }
    if (this.max_datagram_size !== 8192) {
      flags |= 32 /* MaxDatagramLength */;
      bytes2.write_u32(this.max_datagram_size);
    }
    if (this.wait_base !== 2) {
      flags |= 16 /* WaitBase */;
      bytes2.write_u8(this.wait_base);
    }
    bytes2.write_u8_at(flags, cursor);
  }
  len() {
    return (this.key?.byteLength ?? 0) + (this.max_content !== undefined ? 2 : 0) + (this.max_datagram_size !== 8192 ? 4 : 0) + (this.wait_base != 2 ? 1 : 0) + 1;
  }
}

class Crypto extends Frame {
  data;
  identifier;
  static index = 0;
  static transport(parameters) {
    const data = Bytes.new(parameters.len());
    parameters.serialize(data);
    data.reset_cursor();
    return new Crypto(2 /* TransferParameters */ | 8 /* Fin */, data);
  }
  constructor(flags, data, identifier = new VarId(Crypto.index++)) {
    super(new CryptoId(flags));
    this.data = data;
    this.identifier = identifier;
  }
  len() {
    return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
  }
  serialize(bytes2) {
    bytes2.write_u8(+this.id);
    this.identifier.serialize(bytes2);
    new VarId(this.data.length()).serialize(bytes2);
    console.log(this.data.raw());
    bytes2.write_slice(this.data.raw());
  }
  payload_len() {
    return this.data.length();
  }
  sliced(amount) {
    console.log(amount, this.data.length());
    return new Crypto(this.id.flags, this.data.slice_to(amount), this.identifier);
  }
  mark_fin() {
    this.id.flags |= 8 /* Fin */;
  }
  retrieve_transport() {
    return TransferParameter.deserialize(this.data);
  }
}

// src/content/headers.ts
class MatpDatagramTarget extends Struct {
  constructor(target, position) {
    super();
    this.target = target;
    this.position = position;
  }
  byte_size() {
    return 4 + this.position.byte_size();
  }
}
__legacyDecorateClassTS([
  Field(2 /* u32 */)
], MatpDatagramTarget.prototype, "target", undefined);
__legacyDecorateClassTS([
  Field(VarId)
], MatpDatagramTarget.prototype, "position", undefined);

class MatpDatagramId extends StructArray(MatpDatagramTarget) {
  static deserialize(bytes2) {
    const len = VarId.deserialize(bytes2);
    const sender = bytes2.read_u32();
    const arr = DeserializeArr(MatpDatagramTarget, bytes2);
    return new this(+len, sender, ...arr);
  }
  constructor(datagram_size, sender, ...targets) {
    super(...targets);
    this.sender = sender;
    this.len = new VarId(datagram_size);
  }
  serialize(bytes2) {
    this.len.serialize(bytes2);
    bytes2.write_u32(this.sender);
    super.serialize(bytes2);
  }
  byte_size() {
    return this.len.byte_size() + super.byte_size();
  }
  offset_of(target) {
    for (const end_target of this)
      if (end_target.target == target)
        return end_target.position;
  }
}
__legacyDecorateClassTS([
  Field(VarId)
], MatpDatagramId.prototype, "len", undefined);
__legacyDecorateClassTS([
  Field(2 /* u32 */)
], MatpDatagramId.prototype, "sender", undefined);

class MatpContent extends Struct {
  constructor(flags) {
    super();
    this.frames = new FrameArray;
    this.flags = flags;
  }
  serialize(bytes2) {
    bytes2.write_u8(this.flags);
    const cursor = bytes2.advance_cursor(2);
    const curr = bytes2.cursor;
    for (const frame of this.frames) {
      if (bytes2.remaining() <= 0)
        break;
      switch (frame.id.ty) {
        case 1 /* Ping */:
          frame.serialize(bytes2);
          break;
        case 2 /* Crypto */:
        case 3 /* Content */:
          const typed_frame = frame;
          typed_frame.sliced(Math.min(typed_frame.payload_len(), bytes2.remaining()));
          break;
        case 4 /* CloseConnection */:
          throw new Error("Not implemented");
      }
    }
    bytes2.write_u16_at(bytes2.cursor - curr, cursor);
  }
  is_handshake() {
    return (this.flags & 128 /* IsHandshake */) !== 0;
  }
  serialize_checking(bytes2) {
    const old_cursor = bytes2.cursor;
    bytes2.write_u8(this.flags);
    const cursor = bytes2.advance_cursor(2);
    const curr = bytes2.cursor;
    let frame;
    while (bytes2.remaining() > 0 && (frame = this.frames.pop())) {
      switch (frame.id.ty) {
        case 1 /* Ping */:
          frame.serialize(bytes2);
          break;
        case 2 /* Crypto */:
        case 3 /* Content */:
          const remaining = bytes2.remaining();
          const typed_frame = frame;
          const sliced = typed_frame.sliced(Math.min(typed_frame.payload_len(), remaining - (typed_frame.len() - typed_frame.payload_len())));
          const flag = sliced.len() === typed_frame.len();
          if (flag)
            sliced.mark_fin();
          else
            this.frames.push(sliced);
          sliced.serialize(bytes2);
          break;
        case 4 /* CloseConnection */:
          throw new Error("Not implemented");
      }
    }
    bytes2.write_u16_at(bytes2.cursor - curr, cursor);
    return [this.frames.length === 0, old_cursor];
  }
}
__legacyDecorateClassTS([
  Field(0 /* u8 */)
], MatpContent.prototype, "flags", undefined);
__legacyDecorateClassTS([
  Field(FrameArray)
], MatpContent.prototype, "frames", undefined);
var MatpContents = StructArray(MatpContent);

class MatpDatagram extends MatpContents {
  id;
  constructor(target) {
    super();
    this.id = new MatpDatagramId(0, target);
  }
  create_content(target, frames, for_handshake) {
    const content = new MatpContent(for_handshake ? 128 /* IsHandshake */ : 0 /* None */);
    this.push(content);
    content.frames.push(...frames);
    this.id.push(new MatpDatagramTarget(target, new VarId(0)));
    return content;
  }
  serialize(bytes2) {
    const cursor = bytes2.advance_cursor(2);
    const curr = bytes2.cursor;
    for (const content of this)
      content.serialize(bytes2);
    bytes2.write_u16_at(bytes2.cursor - curr, cursor);
  }
  serialize_deleting(bytes2) {
    const cursor = bytes2.advance_cursor(2);
    const curr = bytes2.cursor;
    let current;
    {
      let idx = this.length;
      while (bytes2.remaining() > 0 && (current = this.pop())) {
        const [written, index] = current.serialize_checking(bytes2);
        this.id[--idx]?.position.set_raw(index);
        if (!written) {
          this.push(current);
          break;
        }
      }
    }
    bytes2.write_u16_at(bytes2.cursor - curr, cursor);
    this.id.len.set_raw(bytes2.slice_to_written().length());
    const out = [this.length === 0, this.id];
    this.id = new MatpDatagramId(0, this.id.sender);
    return out;
  }
  reset() {
    this.length = 0;
    this.id.length = 0;
  }
}

// node_modules/eventemitter3/index.mjs
var import__ = __toESM(require_eventemitter3(), 1);
var eventemitter3_default = import__.default;

// src/end/endpoint.ts
import { system } from "@minecraft/server";

// node_modules/base32768/src/index.js
var BITS_PER_CHAR = 15;
var BITS_PER_BYTE = 8;
var pairStrings = [
  "ҠҿԀԟڀڿݠޟ߀ߟကဟႠႿᄀᅟᆀᆟᇠሿበቿዠዿጠጿᎠᏟᐠᙟᚠᛟកសᠠᡟᣀᣟᦀᦟ᧠᧿ᨠᨿᯀᯟᰀᰟᴀᴟ⇠⇿⋀⋟⍀⏟␀␟─❟➀➿⠀⥿⦠⦿⨠⩟⪀⪿⫠⭟ⰀⰟⲀⳟⴀⴟⵀⵟ⺠⻟㇀㇟㐀䶟䷀龿ꀀꑿ꒠꒿ꔀꗿꙀꙟꚠꛟ꜀ꝟꞀꞟꡀꡟ",
  "ƀƟɀʟ"
];
var lookupE = {};
var lookupD = {};
pairStrings.forEach((pairString, r) => {
  const encodeRepertoire = [];
  pairString.match(/../gu).forEach((pair) => {
    const first = pair.codePointAt(0);
    const last = pair.codePointAt(1);
    for (let codePoint = first;codePoint <= last; codePoint++) {
      encodeRepertoire.push(String.fromCodePoint(codePoint));
    }
  });
  const numZBits = BITS_PER_CHAR - BITS_PER_BYTE * r;
  lookupE[numZBits] = encodeRepertoire;
  encodeRepertoire.forEach((chr, z) => {
    lookupD[chr] = [numZBits, z];
  });
});
var encode = (uint8Array) => {
  const length = uint8Array.length;
  let str = "";
  let z = 0;
  let numZBits = 0;
  for (let i = 0;i < length; i++) {
    const uint8 = uint8Array[i];
    for (let j = BITS_PER_BYTE - 1;j >= 0; j--) {
      const bit = uint8 >> j & 1;
      z = (z << 1) + bit;
      numZBits++;
      if (numZBits === BITS_PER_CHAR) {
        str += lookupE[numZBits][z];
        z = 0;
        numZBits = 0;
      }
    }
  }
  if (numZBits !== 0) {
    while (!(numZBits in lookupE)) {
      z = (z << 1) + 1;
      numZBits++;
    }
    str += lookupE[numZBits][z];
  }
  return str;
};
var decode = (str) => {
  const length = str.length;
  const uint8Array = new Uint8Array(Math.floor(length * BITS_PER_CHAR / BITS_PER_BYTE));
  let numUint8s = 0;
  let uint8 = 0;
  let numUint8Bits = 0;
  for (let i = 0;i < length; i++) {
    const chr = str.charAt(i);
    if (!(chr in lookupD)) {
      throw new Error(`Unrecognised Base32768 character: ${chr}`);
    }
    const [numZBits, z] = lookupD[chr];
    if (numZBits !== BITS_PER_CHAR && i !== length - 1) {
      throw new Error("Secondary character found before end of input at position " + String(i));
    }
    for (let j = numZBits - 1;j >= 0; j--) {
      const bit = z >> j & 1;
      uint8 = (uint8 << 1) + bit;
      numUint8Bits++;
      if (numUint8Bits === BITS_PER_BYTE) {
        uint8Array[numUint8s] = uint8;
        numUint8s++;
        uint8 = 0;
        numUint8Bits = 0;
      }
    }
  }
  if (uint8 !== (1 << numUint8Bits) - 1) {
    throw new Error("Padding mismatch");
  }
  return new Uint8Array(uint8Array.buffer, 0, numUint8s);
};

// src/end/endpoint.ts
class EndPoint extends eventemitter3_default {
  id;
  id_bytes = Bytes.new(256);
  buffer = Bytes.new(8192);
  datagram;
  constructor(id) {
    super();
    this.datagram = new MatpDatagram(this.id = gen_id(id));
  }
  *flush_multiple() {
    let written;
    let id;
    while ([written, id] = this.datagram.serialize_deleting(this.buffer)) {
      const buffer = this.buffer.slice_to_written().raw();
      id.serialize(this.id_bytes);
      yield [buffer, this.id_bytes.slice_to_written().raw()];
      this.buffer.reset_cursor();
      this.id_bytes.reset_cursor();
      if (written)
        break;
    }
  }
  *flush() {
    if (this.datagram.length > 0)
      for (const [datagram, id] of this.flush_multiple())
        yield system.sendScriptEvent("matp:" + encode(id), encode(datagram));
    this.buffer.reset_cursor();
  }
  write() {
    system.runJob(this.flush());
  }
  write_blocking() {
    for (const _ of this.flush())
      ;
  }
}
// node_modules/@noble/ciphers/utils.js
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abool(b) {
  if (typeof b !== "boolean")
    throw new Error(`boolean expected, not ${b}`);
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes2(value, length, title = "") {
  const bytes2 = isBytes3(value);
  const len = value?.length;
  const needsLen = length !== undefined;
  if (!bytes2 || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes2 ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes2(out, undefined, "output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0;i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
var isLE2 = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function checkOpts(defaults, opts) {
  if (opts == null || typeof opts !== "object")
    throw new Error("options must be defined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0;i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
var wrapCipher = (params, constructor) => {
  function wrappedCipher(key, ...args) {
    abytes2(key, undefined, "key");
    if (!isLE2)
      throw new Error("Non little-endian hardware is not yet supported");
    if (params.nonceLength !== undefined) {
      const nonce = args[0];
      abytes2(nonce, params.varSizeNonce ? undefined : params.nonceLength, "nonce");
    }
    const tagl = params.tagLength;
    if (tagl && args[1] !== undefined)
      abytes2(args[1], undefined, "AAD");
    const cipher = constructor(key, ...args);
    const checkOutput = (fnLength, output2) => {
      if (output2 !== undefined) {
        if (fnLength !== 2)
          throw new Error("cipher output not supported");
        abytes2(output2, undefined, "output");
      }
    };
    let called = false;
    const wrCipher = {
      encrypt(data, output2) {
        if (called)
          throw new Error("cannot encrypt() twice with same key + nonce");
        called = true;
        abytes2(data);
        checkOutput(cipher.encrypt.length, output2);
        return cipher.encrypt(data, output2);
      },
      decrypt(data, output2) {
        abytes2(data);
        if (tagl && data.length < tagl)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + tagl);
        checkOutput(cipher.decrypt.length, output2);
        return cipher.decrypt(data, output2);
      }
    };
    return wrCipher;
  }
  Object.assign(wrappedCipher, params);
  return wrappedCipher;
};
function getOutput(expectedLength, out, onlyAligned = true) {
  if (out === undefined)
    return new Uint8Array(expectedLength);
  if (out.length !== expectedLength)
    throw new Error('"output" expected Uint8Array of length ' + expectedLength + ", got: " + out.length);
  if (onlyAligned && !isAligned32(out))
    throw new Error("invalid output, must be aligned");
  return out;
}
function u64Lengths(dataLength, aadLength, isLE3) {
  abool(isLE3);
  const num = new Uint8Array(16);
  const view = createView2(num);
  view.setBigUint64(0, BigInt(aadLength), isLE3);
  view.setBigUint64(8, BigInt(dataLength), isLE3);
  return num;
}
function isAligned32(bytes2) {
  return bytes2.byteOffset % 4 === 0;
}
function copyBytes(bytes2) {
  return Uint8Array.from(bytes2);
}

// node_modules/@noble/ciphers/_arx.js
var encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
var sigma16 = encodeStr("expand 16-byte k");
var sigma32 = encodeStr("expand 32-byte k");
var sigma16_32 = u32(sigma16);
var sigma32_32 = u32(sigma32);
function rotl(a, b) {
  return a << b | a >>> 32 - b;
}
function isAligned322(b) {
  return b.byteOffset % 4 === 0;
}
var BLOCK_LEN = 64;
var BLOCK_LEN32 = 16;
var MAX_COUNTER = 2 ** 32 - 1;
var U32_EMPTY = Uint32Array.of();
function runCipher(core, sigma, key, nonce, data, output2, counter, rounds) {
  const len = data.length;
  const block = new Uint8Array(BLOCK_LEN);
  const b32 = u32(block);
  const isAligned = isAligned322(data) && isAligned322(output2);
  const d32 = isAligned ? u32(data) : U32_EMPTY;
  const o32 = isAligned ? u32(output2) : U32_EMPTY;
  for (let pos = 0;pos < len; counter++) {
    core(sigma, key, nonce, b32, counter, rounds);
    if (counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    const take = Math.min(BLOCK_LEN, len - pos);
    if (isAligned && take === BLOCK_LEN) {
      const pos32 = pos / 4;
      if (pos % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let j = 0, posj;j < BLOCK_LEN32; j++) {
        posj = pos32 + j;
        o32[posj] = d32[posj] ^ b32[j];
      }
      pos += BLOCK_LEN;
      continue;
    }
    for (let j = 0, posj;j < take; j++) {
      posj = pos + j;
      output2[posj] = data[posj] ^ block[j];
    }
    pos += take;
  }
}
function createCipher(core, opts) {
  const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
  if (typeof core !== "function")
    throw new Error("core must be a function");
  anumber(counterLength);
  anumber(rounds);
  abool(counterRight);
  abool(allowShortKeys);
  return (key, nonce, data, output2, counter = 0) => {
    abytes2(key, undefined, "key");
    abytes2(nonce, undefined, "nonce");
    abytes2(data, undefined, "data");
    const len = data.length;
    if (output2 === undefined)
      output2 = new Uint8Array(len);
    abytes2(output2, undefined, "output");
    anumber(counter);
    if (counter < 0 || counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    if (output2.length < len)
      throw new Error(`arx: output (${output2.length}) is shorter than data (${len})`);
    const toClean = [];
    let l = key.length;
    let k;
    let sigma;
    if (l === 32) {
      toClean.push(k = copyBytes(key));
      sigma = sigma32_32;
    } else if (l === 16 && allowShortKeys) {
      k = new Uint8Array(32);
      k.set(key);
      k.set(key, 16);
      sigma = sigma16_32;
      toClean.push(k);
    } else {
      abytes2(key, 32, "arx key");
      throw new Error("invalid key size");
    }
    if (!isAligned322(nonce))
      toClean.push(nonce = copyBytes(nonce));
    const k32 = u32(k);
    if (extendNonceFn) {
      if (nonce.length !== 24)
        throw new Error(`arx: extended nonce must be 24 bytes`);
      extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32);
      nonce = nonce.subarray(16);
    }
    const nonceNcLen = 16 - counterLength;
    if (nonceNcLen !== nonce.length)
      throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
    if (nonceNcLen !== 12) {
      const nc = new Uint8Array(12);
      nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
      nonce = nc;
      toClean.push(nonce);
    }
    const n32 = u32(nonce);
    runCipher(core, sigma, k32, n32, data, output2, counter, rounds);
    clean(...toClean);
    return output2;
  };
}

// node_modules/@noble/ciphers/_poly1305.js
function u8to16(a, i) {
  return a[i++] & 255 | (a[i++] & 255) << 8;
}
class Poly1305 {
  blockLen = 16;
  outputLen = 16;
  buffer = new Uint8Array(16);
  r = new Uint16Array(10);
  h = new Uint16Array(10);
  pad = new Uint16Array(8);
  pos = 0;
  finished = false;
  constructor(key) {
    key = copyBytes(abytes2(key, 32, "key"));
    const t0 = u8to16(key, 0);
    const t1 = u8to16(key, 2);
    const t2 = u8to16(key, 4);
    const t3 = u8to16(key, 6);
    const t4 = u8to16(key, 8);
    const t5 = u8to16(key, 10);
    const t6 = u8to16(key, 12);
    const t7 = u8to16(key, 14);
    this.r[0] = t0 & 8191;
    this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
    this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
    this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
    this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
    this.r[5] = t4 >>> 1 & 8190;
    this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
    this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
    this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
    this.r[9] = t7 >>> 5 & 127;
    for (let i = 0;i < 8; i++)
      this.pad[i] = u8to16(key, 16 + 2 * i);
  }
  process(data, offset, isLast = false) {
    const hibit = isLast ? 0 : 1 << 11;
    const { h, r } = this;
    const r0 = r[0];
    const r1 = r[1];
    const r2 = r[2];
    const r3 = r[3];
    const r4 = r[4];
    const r5 = r[5];
    const r6 = r[6];
    const r7 = r[7];
    const r8 = r[8];
    const r9 = r[9];
    const t0 = u8to16(data, offset + 0);
    const t1 = u8to16(data, offset + 2);
    const t2 = u8to16(data, offset + 4);
    const t3 = u8to16(data, offset + 6);
    const t4 = u8to16(data, offset + 8);
    const t5 = u8to16(data, offset + 10);
    const t6 = u8to16(data, offset + 12);
    const t7 = u8to16(data, offset + 14);
    let h0 = h[0] + (t0 & 8191);
    let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
    let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
    let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
    let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
    let h5 = h[5] + (t4 >>> 1 & 8191);
    let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
    let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
    let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
    let h9 = h[9] + (t7 >>> 5 | hibit);
    let c = 0;
    let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
    c = d0 >>> 13;
    d0 &= 8191;
    d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
    c += d0 >>> 13;
    d0 &= 8191;
    let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
    c = d1 >>> 13;
    d1 &= 8191;
    d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
    c += d1 >>> 13;
    d1 &= 8191;
    let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
    c = d2 >>> 13;
    d2 &= 8191;
    d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
    c += d2 >>> 13;
    d2 &= 8191;
    let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
    c = d3 >>> 13;
    d3 &= 8191;
    d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
    c += d3 >>> 13;
    d3 &= 8191;
    let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
    c = d4 >>> 13;
    d4 &= 8191;
    d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
    c += d4 >>> 13;
    d4 &= 8191;
    let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
    c = d5 >>> 13;
    d5 &= 8191;
    d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
    c += d5 >>> 13;
    d5 &= 8191;
    let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
    c = d6 >>> 13;
    d6 &= 8191;
    d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
    c += d6 >>> 13;
    d6 &= 8191;
    let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
    c = d7 >>> 13;
    d7 &= 8191;
    d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
    c += d7 >>> 13;
    d7 &= 8191;
    let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
    c = d8 >>> 13;
    d8 &= 8191;
    d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
    c += d8 >>> 13;
    d8 &= 8191;
    let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
    c = d9 >>> 13;
    d9 &= 8191;
    d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
    c += d9 >>> 13;
    d9 &= 8191;
    c = (c << 2) + c | 0;
    c = c + d0 | 0;
    d0 = c & 8191;
    c = c >>> 13;
    d1 += c;
    h[0] = d0;
    h[1] = d1;
    h[2] = d2;
    h[3] = d3;
    h[4] = d4;
    h[5] = d5;
    h[6] = d6;
    h[7] = d7;
    h[8] = d8;
    h[9] = d9;
  }
  finalize() {
    const { h, pad } = this;
    const g = new Uint16Array(10);
    let c = h[1] >>> 13;
    h[1] &= 8191;
    for (let i = 2;i < 10; i++) {
      h[i] += c;
      c = h[i] >>> 13;
      h[i] &= 8191;
    }
    h[0] += c * 5;
    c = h[0] >>> 13;
    h[0] &= 8191;
    h[1] += c;
    c = h[1] >>> 13;
    h[1] &= 8191;
    h[2] += c;
    g[0] = h[0] + 5;
    c = g[0] >>> 13;
    g[0] &= 8191;
    for (let i = 1;i < 10; i++) {
      g[i] = h[i] + c;
      c = g[i] >>> 13;
      g[i] &= 8191;
    }
    g[9] -= 1 << 13;
    let mask = (c ^ 1) - 1;
    for (let i = 0;i < 10; i++)
      g[i] &= mask;
    mask = ~mask;
    for (let i = 0;i < 10; i++)
      h[i] = h[i] & mask | g[i];
    h[0] = (h[0] | h[1] << 13) & 65535;
    h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
    h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
    h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
    h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
    h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
    h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
    h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
    let f = h[0] + pad[0];
    h[0] = f & 65535;
    for (let i = 1;i < 8; i++) {
      f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
      h[i] = f & 65535;
    }
    clean(g);
  }
  update(data) {
    aexists(this);
    abytes2(data);
    data = copyBytes(data);
    const { buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        for (;blockLen <= len - pos; pos += blockLen)
          this.process(data, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(buffer, 0, false);
        this.pos = 0;
      }
    }
    return this;
  }
  destroy() {
    clean(this.h, this.r, this.buffer, this.pad);
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, h } = this;
    let { pos } = this;
    if (pos) {
      buffer[pos++] = 1;
      for (;pos < 16; pos++)
        buffer[pos] = 0;
      this.process(buffer, 0, true);
    }
    this.finalize();
    let opos = 0;
    for (let i = 0;i < 8; i++) {
      out[opos++] = h[i] >>> 0;
      out[opos++] = h[i] >>> 8;
    }
    return out;
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
}
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key).update(msg).digest();
  const tmp = hashCons(new Uint8Array(32));
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key) => hashCons(key);
  return hashC;
}
var poly1305 = /* @__PURE__ */ (() => wrapConstructorWithKey((key) => new Poly1305(key)))();

// node_modules/@noble/ciphers/chacha.js
function chachaCore(s, k, n, out, cnt, rounds = 20) {
  let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let r = 0;r < rounds; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = y00 + x00 | 0;
  out[oi++] = y01 + x01 | 0;
  out[oi++] = y02 + x02 | 0;
  out[oi++] = y03 + x03 | 0;
  out[oi++] = y04 + x04 | 0;
  out[oi++] = y05 + x05 | 0;
  out[oi++] = y06 + x06 | 0;
  out[oi++] = y07 + x07 | 0;
  out[oi++] = y08 + x08 | 0;
  out[oi++] = y09 + x09 | 0;
  out[oi++] = y10 + x10 | 0;
  out[oi++] = y11 + x11 | 0;
  out[oi++] = y12 + x12 | 0;
  out[oi++] = y13 + x13 | 0;
  out[oi++] = y14 + x14 | 0;
  out[oi++] = y15 + x15 | 0;
}
function hchacha(s, k, i, out) {
  let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
  for (let r = 0;r < 20; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = x00;
  out[oi++] = x01;
  out[oi++] = x02;
  out[oi++] = x03;
  out[oi++] = x12;
  out[oi++] = x13;
  out[oi++] = x14;
  out[oi++] = x15;
}
var chacha20 = /* @__PURE__ */ createCipher(chachaCore, {
  counterRight: false,
  counterLength: 4,
  allowShortKeys: false
});
var xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
  counterRight: false,
  counterLength: 8,
  extendNonceFn: hchacha,
  allowShortKeys: false
});
var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
var updatePadded = (h, msg) => {
  h.update(msg);
  const leftover = msg.length % 16;
  if (leftover)
    h.update(ZEROS16.subarray(leftover));
};
var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
function computeTag(fn, key, nonce, ciphertext, AAD) {
  if (AAD !== undefined)
    abytes2(AAD, undefined, "AAD");
  const authKey = fn(key, nonce, ZEROS32);
  const lengths2 = u64Lengths(ciphertext.length, AAD ? AAD.length : 0, true);
  const h = poly1305.create(authKey);
  if (AAD)
    updatePadded(h, AAD);
  updatePadded(h, ciphertext);
  h.update(lengths2);
  const res = h.digest();
  clean(authKey, lengths2);
  return res;
}
var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
  const tagLength = 16;
  return {
    encrypt(plaintext, output2) {
      const plength = plaintext.length;
      output2 = getOutput(plength + tagLength, output2, false);
      output2.set(plaintext);
      const oPlain = output2.subarray(0, -tagLength);
      xorStream(key, nonce, oPlain, oPlain, 1);
      const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
      output2.set(tag, plength);
      clean(tag);
      return output2;
    },
    decrypt(ciphertext, output2) {
      output2 = getOutput(ciphertext.length - tagLength, output2, false);
      const data = ciphertext.subarray(0, -tagLength);
      const passedTag = ciphertext.subarray(-tagLength);
      const tag = computeTag(xorStream, key, nonce, data, AAD);
      if (!equalBytes(passedTag, tag))
        throw new Error("invalid tag");
      output2.set(ciphertext.subarray(0, -tagLength));
      xorStream(key, nonce, output2, output2, 1);
      clean(tag);
      return output2;
    }
  };
};
var chacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 12, tagLength: 16 }, _poly1305_aead(chacha20));
var xchacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 24, tagLength: 16 }, _poly1305_aead(xchacha20));

// src/end/connection.ts
class ConnectionConfig {
  static MATP_BYTES = Bytes.from_string("matp").raw();
  static MATP_PROTO = Bytes.from_string("matp-protocol").raw();
  static new_with_random_key() {
    return new this(crypto.getRandomValues(new Uint8Array(64)));
  }
  public_key;
  private_key;
  max_datagram_size = 8192;
  wait_base = 2;
  constructor(key) {
    if (key.length < 64)
      throw new Error("Key must have at least 64 bytes");
    ({ publicKey: this.public_key, secretKey: this.private_key } = keygen(key));
  }
  retrieve_shared(public_key) {
    const shared = getSharedSecret(this.private_key, public_key);
    return hkdf(sha256, shared, ConnectionConfig.MATP_PROTO, ConnectionConfig.MATP_BYTES, 32);
  }
  with_max_datagram_size(size) {
    this.max_datagram_size = size;
    return this;
  }
  with_base(base) {
    this.wait_base = base;
    return this;
  }
  generate_transfer_parameters() {
    return new TransferParameter(this.public_key, 65535, this.max_datagram_size, this.wait_base);
  }
}
var HANDSHAKE_BYTES = Bytes.from_string("HANDSHAKE_WITH_SOME_SHIT").raw();

class ListenerConnection2 {
  end;
  config;
  shared_key = new Uint8Array(32);
  contents = [];
  handshake = [];
  encrypt;
  constructor(end, config) {
    this.end = end;
    this.config = config;
  }
  has_pending() {
    return this.contents.length > 0;
  }
  has_pending_handshake() {
    return this.handshake.length > 0;
  }
  retrieve_handshake_frames() {
    return [Crypto.transport(this.config.generate_transfer_parameters())];
  }
  recv_normal(content) {}
  recv_handshake(content) {
    for (const frame of content.frames) {
      if (frame.id.ty === 2 /* Crypto */) {
        const transfer = frame.retrieve_transport();
        this.shared_key.set(this.config.retrieve_shared(transfer.key));
        this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES);
      }
    }
    this.write_handshake();
  }
  write_handshake() {
    this.handshake.push(...this.retrieve_handshake_frames());
  }
  handshake_frames() {
    return this.handshake;
  }
  reset_handshake_frames() {
    return this.handshake.length = 0;
  }
  frames() {
    return this.contents;
  }
  reset_frames() {
    this.contents.length = 0;
  }
}

class StreamConnection2 {
  end;
  config;
  static new(end, config) {
    const out = new StreamConnection2(end, config);
    const promise = new Promise((ok) => {
      out.promise = ok;
    });
    return [out, promise];
  }
  shared_key = new Uint8Array(32);
  contents = [];
  encrypt;
  promise;
  constructor(end, config) {
    this.end = end;
    this.config = config;
  }
  has_pending() {
    return this.contents.length > 0;
  }
  retrieve_handshake_frames() {
    return [Crypto.transport(this.config.generate_transfer_parameters())];
  }
  recv_normal(content) {}
  recv_handshake(content) {
    for (const frame of content.frames) {
      if (frame.id.ty === 2 /* Crypto */) {
        const transfer = frame.retrieve_transport();
        this.shared_key.set(this.config.retrieve_shared(transfer.key));
        this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES);
      }
    }
    this.promise?.();
  }
  write_handshake() {
    this.contents.push(...this.retrieve_handshake_frames());
  }
  frames() {
    return this.contents;
  }
  reset_frames() {
    this.contents.length = 0;
  }
}

// src/end/index.ts
function gen_id(name) {
  let hash2 = 2166136261;
  for (const c of name) {
    hash2 ^= c.charCodeAt(0);
    hash2 = hash2 * 16777619 >>> 0;
  }
  return hash2 >>> 0;
}

// src/end/stream.ts
import { system as system2 } from "@minecraft/server";
class MatpStream extends EndPoint {
  static new(id, options) {
    const stream = new MatpStream(id);
    const promises = options.targets.map((t) => new Promise(async (ok, err2) => {
      const handshake = stream.start_handshake(gen_id(t));
      return Promise.race([system2.waitTicks(options.max_wait_limit).then(err2), handshake.then(ok)]);
    }));
    system2.runJob(stream.flush());
    return [
      stream,
      Promise.allSettled(promises).then((results) => {
        let i = 0;
        for (const result of results) {
          if (result.status === "rejected") {
            stream.emit("on_fail_handshake", options.targets[i]);
            stream.connections.delete(gen_id(options.targets[i]));
          }
          i++;
        }
      }).then((_) => stream)
    ];
  }
  static new_listening(id, options) {
    const stream = new MatpStream(id);
    stream.listen();
    const promises = options.targets.map((t) => new Promise((ok, err2) => {
      const handshake = stream.start_handshake(gen_id(t));
      return Promise.race([system2.waitTicks(options.max_wait_limit).then(err2), handshake.then(ok)]);
    }));
    if (options.blocking_thread)
      for (const _ of stream.flush())
        ;
    else
      system2.runJob(stream.flush());
    return [
      stream,
      Promise.allSettled(promises).then((results) => {
        let i = 0;
        for (const result of results) {
          if (result.status === "rejected") {
            stream.emit("on_fail_handshake", options.targets[i]);
            stream.connections.delete(gen_id(options.targets[i]));
          }
          i++;
        }
      }).then((_) => stream)
    ];
  }
  connections = new Map;
  constructor(id) {
    super(id);
    this.addListener("on_recv", this.recv.bind(this));
  }
  async send(target, data, handshake = false) {
    await this.retrieve_connection_with(target);
    const content = this.datagram.create_content(target, data, handshake);
    return content;
  }
  async retrieve_connection_with(sender) {
    const data = this.connections.get(sender);
    if (!data) {
      await this.start_handshake(sender);
      return this.connections.get(sender);
    } else
      return data;
  }
  async start_handshake(target) {
    if (this.connections.has(target))
      throw new Error(`A connection with the provided target of id ${target} already exists`);
    const [conn, out] = StreamConnection2.new(target, ConnectionConfig.new_with_random_key());
    this.connections.set(target, conn);
    this.send(target, conn.retrieve_handshake_frames(), true);
    return await out;
  }
  async recv(event) {
    try {
      const id_content = decode(event.id.slice(5));
      const id = MatpDatagramId.deserialize(new Bytes(id_content.buffer));
      for (const target of id) {
        if (target.target === this.id) {
          const connection = this.connections.get(id.sender);
          if (!connection)
            return;
          const bytes2 = new Bytes(decode(event.message).buffer, +target.position);
          {
            const content = MatpContent.deserialize(bytes2);
            if (content.is_handshake())
              connection.recv_handshake(content);
            else
              connection.recv_normal(content);
            this.emit("on_server_content", connection);
            if (connection.has_pending()) {
              this.send(id.sender, connection.frames(), false);
              connection.reset_frames();
            }
          }
        }
      }
    } catch {}
  }
  listen() {
    system2.afterEvents.scriptEventReceive.subscribe((ev) => {
      this.emit("on_recv", ev);
      this.recv(ev);
    });
  }
}

// src/end/listener.ts
import { system as system3 } from "@minecraft/server";
class MatpListener extends EndPoint {
  connections = new Map;
  constructor(id) {
    super(id);
  }
  send(target, data, handshake = false) {
    const flag = this.connections.has(target);
    if (!flag)
      throw new Error(`Must stablish a connection with the provided target before sending data`);
    const content = this.datagram.create_content(target, data, handshake);
    return content;
  }
  retrieve_connection_with(sender) {
    const data = this.connections.get(sender);
    if (!data) {
      const conn = new ListenerConnection2(sender, ConnectionConfig.new_with_random_key());
      this.connections.set(sender, conn);
      return conn;
    } else
      return data;
  }
  recv(event) {
    try {
      const id_content = decode(event.id.slice(5));
      const id = MatpDatagramId.deserialize(new Bytes(id_content.buffer));
      for (const target of id) {
        if (target.target === this.id) {
          const connection = this.retrieve_connection_with(id.sender);
          const bytes2 = new Bytes(decode(event.message).buffer, +target.position);
          {
            const content = MatpContent.deserialize(bytes2);
            if (content.is_handshake())
              connection.recv_handshake(content);
            else
              connection.recv_normal(content);
            if (connection.has_pending_handshake()) {
              this.send(id.sender, connection.handshake_frames(), true);
              connection.reset_handshake_frames();
            }
            this.emit("on_client_content", connection);
            if (connection.has_pending()) {
              this.send(id.sender, connection.frames(), false);
              connection.reset_frames();
            }
          }
        }
      }
    } catch {}
  }
  listen() {
    const self = this;
    system3.afterEvents.scriptEventReceive.subscribe(function(ev) {
      self.emit("on_recv", ev);
      self.recv(ev);
    });
  }
}

// src/main.ts
var salt = Bytes.from_string("encrypt-data").raw();
var info = Bytes.from_string("matp").raw();
globalThis.crypto = new class {
  getRandomValues = function(arr) {
    let i = arr.length;
    while (i--)
      arr[i] = Math.random() * 255 | 0;
    return arr;
  };
  generate_encrypting_key(secret, publik, len = 32) {
    const shared = getSharedSecret(secret, publik);
    return hkdf(sha256, shared, salt, info, len);
  }
};
async function main() {
  const server = new MatpListener("jorge");
  server.addListener("on_client_content", (conn) => {
    console.warn(conn.end);
    server.write_blocking();
  });
  server.listen();
  const [client, handshake] = MatpStream.new_listening("pedro", {
    max_wait_limit: 1,
    targets: ["jorge", "henrique"],
    blocking_thread: false
  });
  client.on("on_fail_handshake", console.warn);
  await handshake;
  console.warn(client.connections.get(gen_id("jorge")).shared_key);
  console.warn(server.connections.get(gen_id("pedro")).shared_key);
}
main();
