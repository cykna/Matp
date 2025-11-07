import { world, system, InputButton, ButtonState } from "@minecraft/server";

var cb, mod, __create = Object.create, __getProtoOf = Object.getPrototypeOf, __defProp = Object.defineProperty, __getOwnPropNames = Object.getOwnPropertyNames, __hasOwnProp = Object.prototype.hasOwnProperty, __legacyDecorateClassTS = function(decorators, target, key, desc) {
    var d, c = arguments.length, r = c < 3 ? target : desc;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}, require_eventemitter3 = (cb = (exports, module) => {
    var has = Object.prototype.hasOwnProperty, prefix = "~";
    function Events() {}
    function EE(fn, context, once) {
        this.fn = fn, this.context = context, this.once = once || !1;
    }
    function addListener(emitter, event, fn, context, once) {
        if ("function" != typeof fn) throw new TypeError("The listener must be a function");
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        return emitter._events[evt] ? emitter._events[evt].fn ? emitter._events[evt] = [ emitter._events[evt], listener ] : emitter._events[evt].push(listener) : (emitter._events[evt] = listener, 
        emitter._eventsCount++), emitter;
    }
    function clearEvent(emitter, evt) {
        0 === --emitter._eventsCount ? emitter._events = new Events : delete emitter._events[evt];
    }
    function EventEmitter() {
        this._events = new Events, this._eventsCount = 0;
    }
    Object.create && (Events.prototype = Object.create(null), (new Events).__proto__ || (prefix = !1)), 
    EventEmitter.prototype.eventNames = function eventNames() {
        var events, name, names = [];
        if (0 === this._eventsCount) return names;
        for (name in events = this._events) has.call(events, name) && names.push(prefix ? name.slice(1) : name);
        return Object.getOwnPropertySymbols ? names.concat(Object.getOwnPropertySymbols(events)) : names;
    }, EventEmitter.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [ handlers.fn ];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
        return ee;
    }, EventEmitter.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        return listeners ? listeners.fn ? 1 : listeners.length : 0;
    }, EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return !1;
        var args, i, listeners = this._events[evt], len = arguments.length;
        if (listeners.fn) {
            switch (listeners.once && this.removeListener(event, listeners.fn, void 0, !0), 
            len) {
              case 1:
                return listeners.fn.call(listeners.context), !0;

              case 2:
                return listeners.fn.call(listeners.context, a1), !0;

              case 3:
                return listeners.fn.call(listeners.context, a1, a2), !0;

              case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), !0;

              case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), !0;

              case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), !0;
            }
            for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
            listeners.fn.apply(listeners.context, args);
        } else {
            var j, length = listeners.length;
            for (i = 0; i < length; i++) switch (listeners[i].once && this.removeListener(event, listeners[i].fn, void 0, !0), 
            len) {
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
                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
                listeners[i].fn.apply(listeners[i].context, args);
            }
        }
        return !0;
    }, EventEmitter.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, !1);
    }, EventEmitter.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, !0);
    }, EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) return clearEvent(this, evt), this;
        var listeners = this._events[evt];
        if (listeners.fn) listeners.fn !== fn || once && !listeners.once || context && listeners.context !== context || clearEvent(this, evt); else {
            for (var i = 0, events = [], length = listeners.length; i < length; i++) (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) && events.push(listeners[i]);
            events.length ? this._events[evt] = 1 === events.length ? events[0] : events : clearEvent(this, evt);
        }
        return this;
    }, EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        return event ? (evt = prefix ? prefix + event : event, this._events[evt] && clearEvent(this, evt)) : (this._events = new Events, 
        this._eventsCount = 0), this;
    }, EventEmitter.prototype.off = EventEmitter.prototype.removeListener, EventEmitter.prototype.addListener = EventEmitter.prototype.on, 
    EventEmitter.prefixed = prefix, EventEmitter.EventEmitter = EventEmitter, void 0 !== module && (module.exports = EventEmitter);
}, () => (mod || cb(mod = {
    exports: {}
}, mod), mod.exports));

class Bytes {
    buffer;
    len;
    offset;
    static new(len) {
        return new Bytes(new ArrayBuffer(len));
    }
    static from_string(str) {
        const out = Bytes.new(str.length << 1);
        return out.write_string(str), out.slice_to_written();
    }
    view;
    cursor=0;
    constructor(buffer, len = buffer.byteLength, offset = 0) {
        this.buffer = buffer, this.len = len, this.offset = offset, this.view = new DataView(buffer);
    }
    current_position() {
        return this.cursor;
    }
    advance_cursor(amount) {
        return this.cursor += amount, this.cursor - amount;
    }
    slice_to_written() {
        return new Bytes(this.buffer, this.cursor, this.offset);
    }
    slice_to(amount) {
        return new Bytes(this.buffer, amount, this.offset);
    }
    slice(start, end) {
        return new Bytes(this.buffer, end - start, this.offset + start);
    }
    slice_from_current_with_length(len) {
        const out = new Bytes(this.buffer, len, this.offset + this.cursor);
        return this.cursor += len, out;
    }
    reset_cursor() {
        return this.cursor = 0, this;
    }
    length() {
        return this.len ?? this.buffer.byteLength;
    }
    raw() {
        return new Uint8Array(this.buffer, this.offset, this.length());
    }
    * iter() {
        yield* this.raw();
    }
    read_i8() {
        const out = this.view.getInt8(this.offset + this.cursor);
        return this.cursor++, out;
    }
    read_i16() {
        const out = this.view.getInt16(this.offset + this.cursor, !1);
        return this.cursor += 2, out;
    }
    read_i32() {
        const out = this.view.getInt32(this.offset + this.cursor, !1);
        return this.cursor += 4, out;
    }
    read_u8() {
        const out = this.view.getUint8(this.offset + this.cursor);
        return this.cursor++, out;
    }
    read_u16() {
        const out = this.view.getUint16(this.offset + this.cursor, !1);
        return this.cursor += 2, out;
    }
    read_u32() {
        const out = this.view.getUint32(this.offset + this.cursor, !1);
        return this.cursor += 4, out;
    }
    read_f32() {
        const out = this.view.getFloat32(this.offset + this.cursor, !1);
        return this.cursor += 4, out;
    }
    read_f64() {
        const out = this.view.getFloat64(this.offset + this.cursor, !1);
        return this.cursor += 8, out;
    }
    write_u8(num) {
        return this.view.setUint8(this.offset + this.cursor, num), this.cursor++, this;
    }
    write_u8_at(num, cursor) {
        return this.view.setUint8(cursor, num), this.cursor++, this;
    }
    write_u16_at(num, index) {
        return this.view.setUint16(this.offset + index, num, !1), this;
    }
    write_u16(num) {
        return this.view.setUint16(this.offset + this.cursor, num, !1), this.cursor += 2, 
        this;
    }
    write_u32(num) {
        return this.view.setUint32(this.offset + this.cursor, num, !1), this.cursor += 4, 
        this;
    }
    write_i8(num) {
        return this.view.setInt8(this.offset + this.cursor, num), this.cursor++, this;
    }
    write_i16(num) {
        return this.view.setInt16(this.offset + this.cursor, num, !1), this.cursor += 2, 
        this;
    }
    write_i32(num) {
        return this.view.setInt32(this.offset + this.cursor, num, !1), this.cursor += 4, 
        this;
    }
    write_f32(num) {
        return this.view.setFloat32(this.offset + this.cursor, num, !1), this.cursor += 4, 
        this;
    }
    write_f64(num) {
        return this.view.setFloat64(this.offset + this.cursor, num, !1), this.cursor += 8, 
        this;
    }
    remaining() {
        return this.length() - this.cursor;
    }
    write_slice(buf) {
        this.raw().set(buf, this.cursor), this.cursor += buf.length;
    }
    write_string(str) {
        let code = 0;
        for (let i = 0; i < str.length; i++) code = str.charCodeAt(i), code > 255 ? this.write_u16(code) : this.write_u8(code);
    }
}

var secp256k1_CURVE = {
    p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
    n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    h: 1n,
    a: 0n,
    b: 7n,
    Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
    Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
}, {p: P, n: N, Gx: Gx, Gy: Gy, b: _b} = secp256k1_CURVE, lengths = {
    publicKey: 33,
    publicKeyUncompressed: 65,
    seed: 48
}, err = (message = "") => {
    const e = new Error(message);
    throw ((...args) => {
        "captureStackTrace" in Error && "function" == typeof Error.captureStackTrace && Error.captureStackTrace(...args);
    })(e, err), e;
}, abytes = (value, length, title = "") => {
    const bytes = (a = value) instanceof Uint8Array || ArrayBuffer.isView(a) && "Uint8Array" === a.constructor.name;
    var a;
    const len = value?.length, needsLen = void 0 !== length;
    return (!bytes || needsLen && len !== length) && err((title && `"${title}" `) + "expected Uint8Array" + (needsLen ? ` of length ${length}` : "") + ", got " + (bytes ? `length=${len}` : "type=" + typeof value)), 
    value;
}, u8n = len => new Uint8Array(len), padh = (n, pad) => n.toString(16).padStart(pad, "0"), bytesToHex = b => Array.from(abytes(b)).map(e => padh(e, 2)).join(""), _ch = ch => ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - 55 : ch >= 97 && ch <= 102 ? ch - 87 : void 0, hexToBytes = hex => {
    const e = "hex invalid";
    if ("string" != typeof hex) return err(e);
    const hl = hex.length, al = hl / 2;
    if (hl % 2) return err(e);
    const array = u8n(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = _ch(hex.charCodeAt(hi)), n2 = _ch(hex.charCodeAt(hi + 1));
        if (void 0 === n1 || void 0 === n2) return err(e);
        array[ai] = 16 * n1 + n2;
    }
    return array;
}, concatBytes = (...arrs) => {
    const r = u8n(arrs.reduce((sum, a) => sum + abytes(a).length, 0));
    let pad = 0;
    return arrs.forEach(a => {
        r.set(a, pad), pad += a.length;
    }), r;
}, big = BigInt, arange = (n, min, max, msg = "bad number: out of range") => (n => "bigint" == typeof n)(n) && min <= n && n < max ? n : err(msg), M = (a, b = P) => {
    const r = a % b;
    return r >= 0n ? r : b + r;
}, apoint = p => p instanceof Point ? p : err("Point expected"), koblitz = x => M(M(x * x) * x + _b), FpIsValid = n => arange(n, 0n, P), FpIsValidNot0 = n => arange(n, 1n, P), isEven = y => 0n == (1n & y), u8of = n => Uint8Array.of(n);

class Point {
    static BASE;
    static ZERO;
    X;
    Y;
    Z;
    constructor(X, Y, Z) {
        this.X = FpIsValid(X), this.Y = FpIsValidNot0(Y), this.Z = FpIsValid(Z), Object.freeze(this);
    }
    static CURVE() {
        return secp256k1_CURVE;
    }
    static fromAffine(ap) {
        const {x: x, y: y} = ap;
        return 0n === x && 0n === y ? I : new Point(x, y, 1n);
    }
    static fromBytes(bytes) {
        abytes(bytes);
        const {publicKey: comp, publicKeyUncompressed: uncomp} = lengths;
        let p;
        const length = bytes.length, head = bytes[0], tail = bytes.subarray(1), x = sliceBytesNumBE(tail, 0, 32);
        if (length === comp && (2 === head || 3 === head)) {
            let y = (x => {
                const c = koblitz(FpIsValidNot0(x));
                let r = 1n;
                for (let num = c, e = (P + 1n) / 4n; e > 0n; e >>= 1n) 1n & e && (r = r * num % P), 
                num = num * num % P;
                return M(r * r) === c ? r : err("sqrt invalid");
            })(x);
            const evenY = isEven(y);
            isEven(big(head)) !== evenY && (y = M(-y)), p = new Point(x, y, 1n);
        }
        return length === uncomp && 4 === head && (p = new Point(x, sliceBytesNumBE(tail, 32, 64), 1n)), 
        p ? p.assertValidity() : err("bad point: not on curve");
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
        const {X: X1, Y: Y1, Z: Z1} = this, {X: X2, Y: Y2, Z: Z2} = apoint(other), X1Z2 = M(X1 * Z2), X2Z1 = M(X2 * Z1), Y1Z2 = M(Y1 * Z2), Y2Z1 = M(Y2 * Z1);
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
        const {X: X1, Y: Y1, Z: Z1} = this, {X: X2, Y: Y2, Z: Z2} = apoint(other);
        let X3 = 0n, Y3 = 0n, Z3 = 0n;
        const b3 = M(3n * _b);
        let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1), t4 = M(X2 + Y2);
        t3 = M(t3 * t4), t4 = M(t0 + t1), t3 = M(t3 - t4), t4 = M(X1 + Z1);
        let t5 = M(X2 + Z2);
        return t4 = M(t4 * t5), t5 = M(t0 + t2), t4 = M(t4 - t5), t5 = M(Y1 + Z1), X3 = M(Y2 + Z2), 
        t5 = M(t5 * X3), X3 = M(t1 + t2), t5 = M(t5 - X3), Z3 = M(0n * t4), X3 = M(b3 * t2), 
        Z3 = M(X3 + Z3), X3 = M(t1 - Z3), Z3 = M(t1 + Z3), Y3 = M(X3 * Z3), t1 = M(t0 + t0), 
        t1 = M(t1 + t0), t2 = M(0n * t2), t4 = M(b3 * t4), t1 = M(t1 + t2), t2 = M(t0 - t2), 
        t2 = M(0n * t2), t4 = M(t4 + t2), t0 = M(t1 * t4), Y3 = M(Y3 + t0), t0 = M(t5 * t4), 
        X3 = M(t3 * X3), X3 = M(X3 - t0), t0 = M(t3 * t1), Z3 = M(t5 * Z3), Z3 = M(Z3 + t0), 
        new Point(X3, Y3, Z3);
    }
    subtract(other) {
        return this.add(apoint(other).negate());
    }
    multiply(n, safe = !0) {
        if (!safe && 0n === n) return I;
        if ((n => {
            arange(n, 1n, N);
        })(n), 1n === n) return this;
        if (this.equals(G)) return wNAF(n).p;
        let p = I, f = G;
        for (let d = this; n > 0n; d = d.double(), n >>= 1n) 1n & n ? p = p.add(d) : safe && (f = f.add(d));
        return p;
    }
    multiplyUnsafe(scalar) {
        return this.multiply(scalar, !1);
    }
    toAffine() {
        const {X: x, Y: y, Z: z} = this;
        if (this.equals(I)) return {
            x: 0n,
            y: 0n
        };
        if (1n === z) return {
            x: x,
            y: y
        };
        const iz = ((num, md) => {
            (0n === num || md <= 0n) && err("no inverse n=" + num + " mod=" + md);
            let a = M(num, md), b = md, x = 0n, u = 1n;
            for (;0n !== a; ) {
                const r = b % a, m = x - u * (b / a);
                b = a, a = r, x = u, u = m;
            }
            return 1n === b ? M(x, md) : err("no inverse");
        })(z, P);
        return 1n !== M(z * iz) && err("inverse invalid"), {
            x: M(x * iz),
            y: M(y * iz)
        };
    }
    assertValidity() {
        const {x: x, y: y} = this.toAffine();
        return FpIsValidNot0(x), FpIsValidNot0(y), M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
    }
    toBytes(isCompressed = !0) {
        const {x: x, y: y} = this.assertValidity().toAffine(), x32b = numTo32b(x);
        return isCompressed ? concatBytes((y => u8of(isEven(y) ? 2 : 3))(y), x32b) : concatBytes(u8of(4), x32b, numTo32b(y));
    }
    toHex(isCompressed) {
        return bytesToHex(this.toBytes(isCompressed));
    }
}

var G = new Point(Gx, Gy, 1n), I = new Point(0n, 1n, 0n);

Point.BASE = G, Point.ZERO = I;

var getPublicKey2, bytesToNumBE = b => big("0x" + (bytesToHex(b) || "0")), sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to)), B256 = 2n ** 256n, numTo32b = num => hexToBytes(padh(arange(num, 0n, B256), 64)), secretKeyToScalar = secretKey => {
    const num = bytesToNumBE(abytes(secretKey, 32, "secret key"));
    return arange(num, 1n, N, "invalid secret key: outside of range");
}, getSharedSecret = (secretKeyA, publicKeyB, isCompressed = !0) => Point.fromBytes(publicKeyB).multiply(secretKeyToScalar(secretKeyA)).toBytes(isCompressed), keygen = (getPublicKey2 = (privKey, isCompressed = !0) => G.multiply(secretKeyToScalar(privKey)).toBytes(isCompressed), 
seed => {
    const secretKey = ((seed = ((len = 32) => {
        const c = globalThis?.crypto;
        return c.getRandomValues(u8n(len));
    })(lengths.seed)) => {
        abytes(seed), (seed.length < lengths.seed || seed.length > 1024) && err("expected 40-1024b");
        const num = M(bytesToNumBE(seed), N - 1n);
        return numTo32b(num + 1n);
    })(seed);
    return {
        secretKey: secretKey,
        publicKey: getPublicKey2(secretKey)
    };
}), pwindows = Math.ceil(32) + 1, Gpows = void 0, ctneg = (cnd, p) => {
    const n = p.negate();
    return cnd ? n : p;
}, wNAF = n => {
    const comp = Gpows || (Gpows = (() => {
        const points = [];
        let p = G, b = p;
        for (let w = 0; w < pwindows; w++) {
            b = p, points.push(b);
            for (let i = 1; i < 128; i++) b = b.add(p), points.push(b);
            p = b.double();
        }
        return points;
    })());
    let p = I, f = G;
    const mask = big(255), shiftBy = big(8);
    for (let w = 0; w < pwindows; w++) {
        let wbits = Number(n & mask);
        n >>= shiftBy, wbits > 128 && (wbits -= 256, n += 1n);
        const off = 128 * w, offF = off, offP = off + Math.abs(wbits) - 1, isEven2 = w % 2 != 0, isNeg = wbits < 0;
        0 === wbits ? f = f.add(ctneg(isEven2, comp[offF])) : p = p.add(ctneg(isNeg, comp[offP]));
    }
    return 0n !== n && err("invalid wnaf"), {
        p: p,
        f: f
    };
};

function number(n) {
    if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}

function bytes(b, ...lengths2) {
    if (!function isBytes2(a) {
        return a instanceof Uint8Array || null != a && "object" == typeof a && "Uint8Array" === a.constructor.name;
    }(b)) throw new Error("Uint8Array expected");
    if (lengths2.length > 0 && !lengths2.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths2}, not of length=${b.length}`);
}

function hash(h) {
    if ("function" != typeof h || "function" != typeof h.create) throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(h.outputLen), number(h.blockLen);
}

function exists(instance, checkFinished = !0) {
    if (instance.destroyed) throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}

var createView = arr => new DataView(arr.buffer, arr.byteOffset, arr.byteLength), rotr = (word, shift) => word << 32 - shift | word >>> shift;

function toBytes(data) {
    return "string" == typeof data && (data = function utf8ToBytes(str) {
        if ("string" != typeof str) throw new Error("utf8ToBytes expected string, got " + typeof str);
        return new Uint8Array((new TextEncoder).encode(str));
    }(data)), bytes(data), data;
}

new Uint8Array(new Uint32Array([ 287454020 ]).buffer)[0];

class Hash {
    clone() {
        return this._cloneInto();
    }
}

function wrapConstructor(hashCons) {
    const hashC = msg => hashCons().update(toBytes(msg)).digest(), tmp = hashCons();
    return hashC.outputLen = tmp.outputLen, hashC.blockLen = tmp.blockLen, hashC.create = () => hashCons(), 
    hashC;
}

class HMAC extends Hash {
    constructor(hash2, _key) {
        super(), this.finished = !1, this.destroyed = !1, hash(hash2);
        const key = toBytes(_key);
        if (this.iHash = hash2.create(), "function" != typeof this.iHash.update) throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen, pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
        this.iHash.update(pad), this.oHash = hash2.create();
        for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
        this.oHash.update(pad), pad.fill(0);
    }
    update(buf) {
        return exists(this), this.iHash.update(buf), this;
    }
    digestInto(out) {
        exists(this), bytes(out, this.outputLen), this.finished = !0, this.iHash.digestInto(out), 
        this.oHash.update(out), this.oHash.digestInto(out), this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        return this.digestInto(out), out;
    }
    _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const {oHash: oHash, iHash: iHash, finished: finished, destroyed: destroyed, blockLen: blockLen, outputLen: outputLen} = this;
        return to.finished = finished, to.destroyed = destroyed, to.blockLen = blockLen, 
        to.outputLen = outputLen, to.oHash = oHash._cloneInto(to.oHash), to.iHash = iHash._cloneInto(to.iHash), 
        to;
    }
    destroy() {
        this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
}

var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();

hmac.create = (hash2, key) => new HMAC(hash2, key);

var HKDF_COUNTER = new Uint8Array([ 0 ]), EMPTY_BUFFER = new Uint8Array, hkdf = (hash2, ikm, salt, info, length) => function expand(hash2, prk, info, length = 32) {
    if (hash(hash2), number(length), length > 255 * hash2.outputLen) throw new Error("Length should be <= 255*HashLen");
    const blocks = Math.ceil(length / hash2.outputLen);
    void 0 === info && (info = EMPTY_BUFFER);
    const okm = new Uint8Array(blocks * hash2.outputLen), HMAC2 = hmac.create(hash2, prk), HMACTmp = HMAC2._cloneInto(), T = new Uint8Array(HMAC2.outputLen);
    for (let counter = 0; counter < blocks; counter++) HKDF_COUNTER[0] = counter + 1, 
    HMACTmp.update(0 === counter ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T), 
    okm.set(T, hash2.outputLen * counter), HMAC2._cloneInto(HMACTmp);
    return HMAC2.destroy(), HMACTmp.destroy(), T.fill(0), HKDF_COUNTER.fill(0), okm.slice(0, length);
}(hash2, function extract(hash2, ikm, salt) {
    return hash(hash2), void 0 === salt && (salt = new Uint8Array(hash2.outputLen)), 
    hmac(hash2, toBytes(salt), toBytes(ikm));
}(hash2, ikm, salt), info, length), Chi = (a, b, c) => a & b ^ ~a & c, Maj = (a, b, c) => a & b ^ a & c ^ b & c;

class HashMD extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
        super(), this.blockLen = blockLen, this.outputLen = outputLen, this.padOffset = padOffset, 
        this.isLE = isLE2, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, 
        this.buffer = new Uint8Array(blockLen), this.view = createView(this.buffer);
    }
    update(data) {
        exists(this);
        const {view: view, buffer: buffer, blockLen: blockLen} = this, len = (data = toBytes(data)).length;
        for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
                const dataView = createView(data);
                for (;blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos), this.pos += take, pos += take, 
            this.pos === blockLen && (this.process(view, 0), this.pos = 0);
        }
        return this.length += data.length, this.roundClean(), this;
    }
    digestInto(out) {
        exists(this), function output(out, instance) {
            bytes(out);
            const min = instance.outputLen;
            if (out.length < min) throw new Error(`digestInto() expects output buffer of length at least ${min}`);
        }(out, this), this.finished = !0;
        const {buffer: buffer, view: view, blockLen: blockLen, isLE: isLE2} = this;
        let {pos: pos} = this;
        buffer[pos++] = 128, this.buffer.subarray(pos).fill(0), this.padOffset > blockLen - pos && (this.process(view, 0), 
        pos = 0);
        for (let i = pos; i < blockLen; i++) buffer[i] = 0;
        !function setBigUint64(view, byteOffset, value, isLE2) {
            if ("function" == typeof view.setBigUint64) return view.setBigUint64(byteOffset, value, isLE2);
            const _32n = BigInt(32), _u32_max = BigInt(4294967295), wh = Number(value >> _32n & _u32_max), wl = Number(value & _u32_max), h = isLE2 ? 4 : 0, l = isLE2 ? 0 : 4;
            view.setUint32(byteOffset + h, wh, isLE2), view.setUint32(byteOffset + l, wl, isLE2);
        }(view, blockLen - 8, BigInt(8 * this.length), isLE2), this.process(view, 0);
        const oview = createView(out), len = this.outputLen;
        if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4, state = this.get();
        if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
        const {buffer: buffer, outputLen: outputLen} = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        return this.destroy(), res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor), to.set(...this.get());
        const {blockLen: blockLen, buffer: buffer, length: length, finished: finished, destroyed: destroyed, pos: pos} = this;
        return to.length = length, to.pos = pos, to.finished = finished, to.destroyed = destroyed, 
        length % blockLen && to.buffer.set(buffer), to;
    }
}

var SHA256_K = new Uint32Array([ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ]), SHA256_IV = new Uint32Array([ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ]), SHA256_W = new Uint32Array(64);

class SHA256 extends HashMD {
    constructor() {
        super(64, 32, 8, !1), this.A = 0 | SHA256_IV[0], this.B = 0 | SHA256_IV[1], this.C = 0 | SHA256_IV[2], 
        this.D = 0 | SHA256_IV[3], this.E = 0 | SHA256_IV[4], this.F = 0 | SHA256_IV[5], 
        this.G = 0 | SHA256_IV[6], this.H = 0 | SHA256_IV[7];
    }
    get() {
        const {A: A, B: B, C: C2, D: D, E: E, F: F, G: G2, H: H} = this;
        return [ A, B, C2, D, E, F, G2, H ];
    }
    set(A, B, C2, D, E, F, G2, H) {
        this.A = 0 | A, this.B = 0 | B, this.C = 0 | C2, this.D = 0 | D, this.E = 0 | E, 
        this.F = 0 | F, this.G = 0 | G2, this.H = 0 | H;
    }
    process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, !1);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15], W2 = SHA256_W[i - 2], s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3, s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let {A: A, B: B, C: C2, D: D, E: E, F: F, G: G2, H: H} = this;
        for (let i = 0; i < 64; i++) {
            const T1 = H + (rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25)) + Chi(E, F, G2) + SHA256_K[i] + SHA256_W[i] | 0, T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C2) | 0;
            H = G2, G2 = F, F = E, E = D + T1 | 0, D = C2, C2 = B, B = A, A = T1 + T2 | 0;
        }
        A = A + this.A | 0, B = B + this.B | 0, C2 = C2 + this.C | 0, D = D + this.D | 0, 
        E = E + this.E | 0, F = F + this.F | 0, G2 = G2 + this.G | 0, H = H + this.H | 0, 
        this.set(A, B, C2, D, E, F, G2, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
    }
}

var sha256 = wrapConstructor(() => new SHA256), salt = Bytes.from_string("encrypt-data").raw(), info = Bytes.from_string("matp").raw();

globalThis.crypto = new class {
    getRandomValues=function(arr) {
        let seed = Date.now() / 7 | 0, j = arr.length, now = seed - j ^ 7 * seed;
        for (let i = 0; i < j; i++) arr[i] = seed ^ i | j << i & seed, seed ^= i, seed <<= i, 
        seed ^= j - i, seed += now, now = now << 1 ^ seed;
        return arr;
    };
    generate_encrypting_key(secret, publik, len = 32) {
        const shared = getSharedSecret(secret, publik);
        return hkdf(sha256, shared, salt, info, len);
    }
};

var ToParseStruct = Symbol("struct"), FieldReadMap = {
    0: bytes2 => bytes2.read_u8(),
    1: bytes2 => bytes2.read_u16(),
    2: bytes2 => bytes2.read_u32(),
    3: bytes2 => bytes2.read_i8(),
    4: bytes2 => bytes2.read_i16(),
    5: bytes2 => bytes2.read_i32(),
    7: bytes2 => bytes2.read_f32(),
    8: bytes2 => bytes2.read_f64()
}, PrimitiveTypeSize = {
    3: 1,
    4: 2,
    5: 4,
    0: 1,
    1: 2,
    2: 4,
    7: 4,
    8: 8
};

function Field(type) {
    return function(target, prop) {
        const construct = target.constructor;
        (construct.field_names ??= []).push(prop), (construct.fields ??= {})[prop] = type;
    };
}

function retrieve_value_from(ty, bytes2) {
    if (16 & ty) {
        const byte_opt = 16 & bytes2.read_u8();
        return 32 & ty && byte_opt ? ToParseStruct : byte_opt ? FieldReadMap[-17 & ty](bytes2) : void 0;
    }
    return FieldReadMap[ty](bytes2);
}

function size_of(ty) {
    return ty instanceof Struct ? ty.byte_size() : 16 & ty ? PrimitiveTypeSize[-17 & ty] + 1 : PrimitiveTypeSize[ty];
}

function write_field(field_type, value, bytes2) {
    switch (16 & field_type && bytes2.write_u8(16), 15 & field_type) {
      case 3:
        return bytes2.write_i8(value);

      case 4:
        return bytes2.write_i16(value);

      case 5:
        return bytes2.write_i32(value);

      case 6:
        return bytes2.write_f16(value);

      case 7:
        return bytes2.write_f32(value);

      case 8:
        return bytes2.write_f64(value);

      case 0:
        return bytes2.write_u8(value);

      case 1:
        return bytes2.write_u16(value);

      case 2:
        return bytes2.write_u32(value);
    }
}

class Struct {
    static deserialize(bytes2) {
        const out = new this, fields = this.fields;
        console.warn("desserializando ", bytes2.raw());
        for (const field of this.field_names) {
            const field_type = fields[field];
            try {
                out[field] = "number" == typeof field_type ? retrieve_value_from(field_type, bytes2) : field_type.deserialize(bytes2);
            } catch (e) {
                console.error(e, "falhou no field", field);
            }
        }
        return out;
    }
    byte_size() {
        let byte_size = 0;
        const fields = this.constructor.fields;
        for (const field of this.constructor.field_names) {
            const field_type = fields[field];
            byte_size += "number" == typeof field_type ? size_of(field_type) : this[field].byte_size();
        }
        return byte_size;
    }
    serialize(bytes2) {
        const fields = this.constructor.fields;
        for (const field of this.constructor.field_names) {
            const field_type = fields[field];
            "number" == typeof field_type ? write_field(field_type, this[field], bytes2) : this[field].serialize(bytes2);
        }
    }
}

class VarId extends Struct {
    raw;
    static deserialize(bytes2) {
        const first = bytes2.read_u16();
        return new VarId(first <= 32767 ? first : first << 16 | bytes2.read_u16());
    }
    constructor(raw) {
        super(), this.raw = raw;
    }
    set_raw(raw) {
        this.raw = raw;
    }
    serialize(bytes2) {
        this.raw < 32767 ? bytes2.write_u16(this.raw) : bytes2.write_u32(this.raw | 1 << 31);
    }
    valueOf() {
        return (65535 & this.raw) <= 32767 ? this.raw : 2147483647 & this.raw;
    }
    byte_size() {
        return this.raw > 32767 ? 4 : 2;
    }
}

function DeserializeArr(c, bytes2) {
    const slice = bytes2.slice_from_current_with_length(+VarId.deserialize(bytes2));
    let idx = 0;
    const out = [];
    for (;slice.remaining() > 0; ) out[idx++] = c.deserialize(slice);
    return out;
}

function StructArray(ty) {
    return class StructArray2 extends Array {
        static deserialize(bytes2) {
            const arr = DeserializeArr(ty, bytes2);
            return Object.setPrototypeOf(arr, this.prototype), arr;
        }
        constructor(...args) {
            super(), this.push(...args);
        }
        byte_size() {
            let out = 0;
            for (const data of this) out += data.byte_size();
            return out;
        }
        serialize(bytes2) {
            const offset = bytes2.advance_cursor(2), cursor = bytes2.cursor;
            for (const content of this) content.serialize(bytes2);
            bytes2.write_u16_at(bytes2.cursor - cursor, offset);
        }
    };
}

String.prototype.byte_size = function() {
    return 2 * this.length;
}, String.prototype.serialize = function(bytes2) {
    const cursor = bytes2.advance_cursor(2), curr = bytes2.cursor;
    for (let i = 0, j = this.length; i < j; i++) bytes2.write_u16(this.charCodeAt(i));
    bytes2.write_u16_at(bytes2.cursor - curr, cursor);
}, String.deserialize = function(bytes2) {
    let len = bytes2.read_u16(), out = "", toremove = Math.min(len, 32767);
    for (;len > 0; ) out += String.fromCharCode.apply(null, bytes2.slice_from_current_with_length(toremove).raw()), 
    toremove = Math.min(len -= toremove, 32767);
    return out;
}, Uint8Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(this);
}, Uint8Array.prototype.byte_size = function() {
    return this.byteLength;
}, Uint8Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return bytes2.slice_from_current_with_length(len).raw();
}, Uint16Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Uint16Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Uint16Array(bytes2.slice_from_current_with_length(len).raw());
}, Uint32Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Uint32Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Uint32Array(bytes2.slice_from_current_with_length(len).raw());
}, Int8Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Int8Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Int8Array(bytes2.slice_from_current_with_length(len).raw());
}, Int16Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Int16Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Int16Array(bytes2.slice_from_current_with_length(len).raw());
}, Int32Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Int32Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Int32Array(bytes2.slice_from_current_with_length(len).raw());
}, Float32Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Float32Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Float32Array(bytes2.slice_from_current_with_length(len).raw());
}, Float64Array.prototype.serialize = function(bytes2) {
    const len = this.byteLength;
    bytes2.write_u16(len), bytes2.write_slice(new Uint8Array(this));
}, Float64Array.deserialize = function(bytes2) {
    const len = bytes2.read_u16();
    return new Float64Array(bytes2.slice_from_current_with_length(len).raw());
};

class Frame extends Struct {
    id;
    static Array=StructArray(this);
    static deserialize(_) {
        return null;
    }
    constructor(id) {
        super(), this.id = id;
    }
    len() {
        return 0;
    }
    serialize(bytes2) {
        bytes2.write_u8(+this.id);
    }
}

var FrameArray = StructArray(Frame);

class MatpDatagramTarget extends Struct {
    constructor(target, position) {
        super(), this.target = target, this.position = position;
    }
    byte_size() {
        return 4 + this.position.byte_size();
    }
}

__legacyDecorateClassTS([ Field(2) ], MatpDatagramTarget.prototype, "target", void 0), 
__legacyDecorateClassTS([ Field(VarId) ], MatpDatagramTarget.prototype, "position", void 0);

class MatpDatagramId extends(StructArray(MatpDatagramTarget)){
    static deserialize(bytes2) {
        return new this(+VarId.deserialize(bytes2), bytes2.read_u32(), ...DeserializeArr(MatpDatagramTarget, bytes2));
    }
    constructor(datagram_size, sender, ...targets) {
        super(...targets), this.sender = sender, this.len = new VarId(datagram_size);
    }
    serialize(bytes2) {
        this.len.serialize(bytes2), bytes2.write_u32(this.sender), super.serialize(bytes2);
    }
    byte_size() {
        return this.len.byte_size() + super.byte_size();
    }
    offset_of(target) {
        for (const end_target of this) if (end_target.target == target) return end_target.position;
    }
}

__legacyDecorateClassTS([ Field(VarId) ], MatpDatagramId.prototype, "len", void 0), 
__legacyDecorateClassTS([ Field(2) ], MatpDatagramId.prototype, "sender", void 0);

class MatpContent extends Struct {
    constructor(flags) {
        super(), this.frames = new FrameArray, this.flags = flags;
    }
    serialize(bytes2) {
        bytes2.write_u8(this.flags);
        const cursor = bytes2.advance_cursor(2), curr = bytes2.cursor;
        for (const frame of this.frames) {
            if (bytes2.remaining() <= 0) break;
            switch (frame.id.ty) {
              case 1:
                frame.serialize(bytes2);
                break;

              case 2:
              case 3:
                const typed_frame = frame;
                typed_frame.sliced(Math.min(typed_frame.payload_len(), bytes2.remaining()));
                break;

              case 4:
                throw new Error("Not implemented");
            }
        }
        bytes2.write_u16_at(bytes2.cursor - curr, cursor);
    }
    is_handshake() {
        return !!(128 & this.flags);
    }
    serialize_checking(bytes2) {
        const old_cursor = bytes2.cursor;
        bytes2.write_u8(this.flags);
        const cursor = bytes2.advance_cursor(2), curr = bytes2.cursor;
        let frame;
        for (;bytes2.remaining() > 0 && (frame = this.frames.pop()); ) switch (frame.id.ty) {
          case 1:
            frame.serialize(bytes2);
            break;

          case 2:
          case 3:
            const remaining = bytes2.remaining(), typed_frame = frame, sliced = typed_frame.sliced(Math.min(typed_frame.payload_len(), remaining - (typed_frame.len() - typed_frame.payload_len())));
            sliced.len() === typed_frame.len() ? sliced.mark_fin() : this.frames.push(sliced), 
            sliced.serialize(bytes2);
            break;

          case 4:
            throw new Error("Not implemented");
        }
        return bytes2.write_u16_at(bytes2.cursor - curr, cursor), [ 0 === this.frames.length, old_cursor ];
    }
}

__legacyDecorateClassTS([ Field(0) ], MatpContent.prototype, "flags", void 0), __legacyDecorateClassTS([ Field(FrameArray) ], MatpContent.prototype, "frames", void 0);

var MatpContents = StructArray(MatpContent);

class MatpDatagram extends MatpContents {
    id;
    constructor(target) {
        super(), this.id = new MatpDatagramId(0, target);
    }
    create_content(target, frames, for_handshake) {
        const content = new MatpContent(for_handshake ? 128 : 0);
        return this.push(content), content.frames.push(...frames), this.id.push(new MatpDatagramTarget(target, new VarId(0))), 
        content;
    }
    serialize(bytes2) {
        const cursor = bytes2.advance_cursor(2), curr = bytes2.cursor;
        for (const content of this) content.serialize(bytes2);
        bytes2.write_u16_at(bytes2.cursor - curr, cursor);
    }
    serialize_deleting(bytes2) {
        const cursor = bytes2.advance_cursor(2), curr = bytes2.cursor;
        let current;
        {
            let idx = this.length;
            for (;bytes2.remaining() > 0 && (current = this.pop()); ) {
                const [written, index] = current.serialize_checking(bytes2);
                if (this.id[--idx]?.position.set_raw(index), !written) {
                    this.push(current);
                    break;
                }
            }
        }
        bytes2.write_u16_at(bytes2.cursor - curr, cursor), this.id.len.set_raw(bytes2.slice_to_written().length());
        const out = [ 0 === this.length, this.id ];
        return this.id = new MatpDatagramId(0, this.id.sender), out;
    }
    reset() {
        this.length = 0, this.id.length = 0;
    }
}

var import__ = ((mod, isNodeMode, target) => {
    target = null != mod ? __create(__getProtoOf(mod)) : {};
    const to = __defProp(target, "default", {
        value: mod,
        enumerable: !0
    });
    for (let key of __getOwnPropNames(mod)) __hasOwnProp.call(to, key) || __defProp(to, key, {
        get: () => mod[key],
        enumerable: !0
    });
    return to;
})(require_eventemitter3()), eventemitter3_default = import__.default;

function decode(str) {
    const bytes2 = Bytes.new(str.length);
    for (let i = 0, j = str.length; i < j; i++) bytes2.write_u8(str.charCodeAt(i) - 14);
    return bytes2;
}

function encode(bytes2) {
    return String.fromCharCode.apply(null, Array.from({
        length: bytes2.length
    }, (_, idx) => bytes2[idx] + 14));
}

class FrameId {
    ty;
    flags;
    static from(byte) {
        return new this((240 & byte) >> 4, 15 & byte);
    }
    constructor(ty, flags) {
        this.ty = ty, this.flags = flags;
    }
    valueOf() {
        return this.ty << 4 | this.flags;
    }
}

class CryptoId extends FrameId {
    constructor(flags) {
        super(2, flags);
    }
    is_fin() {
        return !!(8 & this.flags);
    }
    data_type() {
        return !!(3 & this.flags);
    }
    is_encrypted() {
        return !!(4 & this.flags);
    }
}

class DataId extends FrameId {
    constructor(flags) {
        super(3, flags);
    }
    is_fin() {
        return !!(8 & this.flags);
    }
    compression_type() {
        return !!(3 & this.flags);
    }
    is_encrypted() {
        return !!(4 & this.flags);
    }
}

class Data extends Frame {
    data;
    identifier;
    static index=0;
    constructor(flags, data, identifier = new VarId(Data.index++)) {
        super(new DataId(flags)), this.data = data, this.identifier = identifier, this.id = new DataId(flags);
    }
    len() {
        return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
    }
    payload_len() {
        return this.data.length();
    }
    serialize(bytes2) {
        bytes2.write_u8(+this.id), this.identifier.serialize(bytes2), new VarId(this.data.length()).serialize(bytes2), 
        bytes2.write_slice(this.data.raw());
    }
    sliced(amount) {
        return new Data(this.id.flags, this.data.slice_to(amount), this.identifier);
    }
    mark_fin() {
        this.id.flags |= 8;
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
        let key, max_content;
        128 & flags && (key = bytes2.slice_from_current_with_length(33).raw()), 64 & flags && (max_content = bytes2.read_u16());
        let max_datagram_size = 2048;
        32 & flags && (max_datagram_size = bytes2.read_u32());
        let wait_base = 2;
        return 16 & flags && (wait_base = bytes2.read_u8()), new this(key, max_content, max_datagram_size, wait_base);
    }
    constructor(key, max_content, max_datagram_size = 2048, wait_base = 2) {
        super(), this.key = key, this.max_content = max_content, this.max_datagram_size = max_datagram_size, 
        this.wait_base = wait_base;
    }
    serialize(bytes2) {
        const cursor = bytes2.advance_cursor(1);
        let flags = 0;
        this.key && (flags |= 128, bytes2.write_slice(this.key)), void 0 !== this.max_content && (flags |= 64, 
        bytes2.write_u16(this.max_content)), 2048 !== this.max_datagram_size && (flags |= 32, 
        bytes2.write_u32(this.max_datagram_size)), 2 !== this.wait_base && (flags |= 16, 
        bytes2.write_u8(this.wait_base)), bytes2.write_u8_at(flags, cursor);
    }
    len() {
        return (this.key?.byteLength ?? 0) + (void 0 !== this.max_content ? 2 : 0) + (2048 !== this.max_datagram_size ? 4 : 0) + (2 != this.wait_base ? 1 : 0) + 1;
    }
}

class Crypto extends Frame {
    data;
    identifier;
    static index=0;
    static transport(parameters) {
        const data = Bytes.new(parameters.len());
        return parameters.serialize(data), data.reset_cursor(), new Crypto(10, data);
    }
    constructor(flags, data, identifier = new VarId(Crypto.index++)) {
        super(new CryptoId(flags)), this.data = data, this.identifier = identifier;
    }
    len() {
        return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
    }
    serialize(bytes2) {
        bytes2.write_u8(+this.id), this.identifier.serialize(bytes2), new VarId(this.data.length()).serialize(bytes2), 
        bytes2.write_slice(this.data.raw());
    }
    payload_len() {
        return this.data.length();
    }
    sliced(amount) {
        return new Crypto(this.id.flags, this.data.slice_to(amount), this.identifier);
    }
    mark_fin() {
        this.id.flags |= 8;
    }
    retrieve_transport() {
        return TransferParameter.deserialize(this.data);
    }
}

class Ping extends Frame {
    constructor() {
        super(new FrameId(1, 0));
    }
}

Frame.deserialize = function(bytes2) {
    const id = FrameId.from(bytes2.read_u8());
    switch (id.ty) {
      case 1:
        return new Ping;

      case 2:
        {
            const identifier = VarId.deserialize(bytes2), len = VarId.deserialize(bytes2), slice = bytes2.slice_from_current_with_length(+len);
            return new Crypto(id.flags, slice, identifier);
        }

      case 3:
        {
            const identifier = VarId.deserialize(bytes2), len = VarId.deserialize(bytes2), slice = bytes2.slice_from_current_with_length(+len);
            return new Data(id.flags, slice, identifier);
        }

      default:
        return;
    }
};

class EndPoint extends eventemitter3_default {
    id;
    id_bytes=Bytes.new(256);
    buffer=Bytes.new(2048);
    datagram;
    constructor(id) {
        super(), this.datagram = new MatpDatagram(this.id = gen_id(id));
    }
    * flush_multiple() {
        let written, id;
        for (;[written, id] = this.datagram.serialize_deleting(this.buffer); ) {
            const buffer = this.buffer.slice_to_written().raw();
            if (id.serialize(this.id_bytes), yield [ buffer, this.id_bytes.slice_to_written().raw() ], 
            this.buffer.reset_cursor(), this.id_bytes.reset_cursor(), written) break;
        }
    }
    * flush() {
        if (this.datagram.length > 0) for (const [datagram, id] of this.flush_multiple()) yield system.sendScriptEvent("matp:" + encode(id), encode(datagram));
        this.buffer.reset_cursor();
    }
    write() {
        system.runJob(this.flush());
    }
    write_blocking() {
        for (const _ of this.flush()) ;
    }
}

function abool(b) {
    if ("boolean" != typeof b) throw new Error(`boolean expected, not ${b}`);
}

function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}

function abytes2(value, length, title = "") {
    const bytes2 = function isBytes3(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && "Uint8Array" === a.constructor.name;
    }(value), len = value?.length, needsLen = void 0 !== length;
    if (!bytes2 || needsLen && len !== length) throw new Error((title && `"${title}" `) + "expected Uint8Array" + (needsLen ? ` of length ${length}` : "") + ", got " + (bytes2 ? `length=${len}` : "type=" + typeof value));
    return value;
}

function aexists(instance, checkFinished = !0) {
    if (instance.destroyed) throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}

function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}

function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}

var isLE2 = (() => 68 === new Uint8Array(new Uint32Array([ 287454020 ]).buffer)[0])(), wrapCipher = (params, constructor) => {
    function wrappedCipher(key, ...args) {
        if (abytes2(key, void 0, "key"), !isLE2) throw new Error("Non little-endian hardware is not yet supported");
        void 0 !== params.nonceLength && abytes2(args[0], params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
        const tagl = params.tagLength;
        tagl && void 0 !== args[1] && abytes2(args[1], void 0, "AAD");
        const cipher = constructor(key, ...args), checkOutput = (fnLength, output2) => {
            if (void 0 !== output2) {
                if (2 !== fnLength) throw new Error("cipher output not supported");
                abytes2(output2, void 0, "output");
            }
        };
        let called = !1;
        const wrCipher = {
            encrypt(data, output2) {
                if (called) throw new Error("cannot encrypt() twice with same key + nonce");
                return called = !0, abytes2(data), checkOutput(cipher.encrypt.length, output2), 
                cipher.encrypt(data, output2);
            },
            decrypt(data, output2) {
                if (abytes2(data), tagl && data.length < tagl) throw new Error('"ciphertext" expected length bigger than tagLength=' + tagl);
                return checkOutput(cipher.decrypt.length, output2), cipher.decrypt(data, output2);
            }
        };
        return wrCipher;
    }
    return Object.assign(wrappedCipher, params), wrappedCipher;
};

function getOutput(expectedLength, out, onlyAligned = !0) {
    if (void 0 === out) return new Uint8Array(expectedLength);
    if (out.length !== expectedLength) throw new Error('"output" expected Uint8Array of length ' + expectedLength + ", got: " + out.length);
    if (onlyAligned && !function isAligned32(bytes2) {
        return bytes2.byteOffset % 4 == 0;
    }(out)) throw new Error("invalid output, must be aligned");
    return out;
}

function copyBytes(bytes2) {
    return Uint8Array.from(bytes2);
}

var encodeStr = str => Uint8Array.from(str.split(""), c => c.charCodeAt(0)), sigma16 = encodeStr("expand 16-byte k"), sigma32 = encodeStr("expand 32-byte k"), sigma16_32 = u32(sigma16), sigma32_32 = u32(sigma32);

function rotl(a, b) {
    return a << b | a >>> 32 - b;
}

function isAligned322(b) {
    return b.byteOffset % 4 == 0;
}

var U32_EMPTY = Uint32Array.of();

function createCipher(core, opts) {
    const {allowShortKeys: allowShortKeys, extendNonceFn: extendNonceFn, counterLength: counterLength, counterRight: counterRight, rounds: rounds} = function checkOpts(defaults, opts) {
        if (null == opts || "object" != typeof opts) throw new Error("options must be defined");
        return Object.assign(defaults, opts);
    }({
        allowShortKeys: !1,
        counterLength: 8,
        counterRight: !1,
        rounds: 20
    }, opts);
    if ("function" != typeof core) throw new Error("core must be a function");
    return anumber(counterLength), anumber(rounds), abool(counterRight), abool(allowShortKeys), 
    (key, nonce, data, output2, counter = 0) => {
        abytes2(key, void 0, "key"), abytes2(nonce, void 0, "nonce"), abytes2(data, void 0, "data");
        const len = data.length;
        if (void 0 === output2 && (output2 = new Uint8Array(len)), abytes2(output2, void 0, "output"), 
        anumber(counter), counter < 0 || counter >= 4294967295) throw new Error("arx: counter overflow");
        if (output2.length < len) throw new Error(`arx: output (${output2.length}) is shorter than data (${len})`);
        const toClean = [];
        let k, sigma, l = key.length;
        if (32 === l) toClean.push(k = copyBytes(key)), sigma = sigma32_32; else {
            if (16 !== l || !allowShortKeys) throw abytes2(key, 32, "arx key"), new Error("invalid key size");
            k = new Uint8Array(32), k.set(key), k.set(key, 16), sigma = sigma16_32, toClean.push(k);
        }
        isAligned322(nonce) || toClean.push(nonce = copyBytes(nonce));
        const k32 = u32(k);
        if (extendNonceFn) {
            if (24 !== nonce.length) throw new Error("arx: extended nonce must be 24 bytes");
            extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32), nonce = nonce.subarray(16);
        }
        const nonceNcLen = 16 - counterLength;
        if (nonceNcLen !== nonce.length) throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
        if (12 !== nonceNcLen) {
            const nc = new Uint8Array(12);
            nc.set(nonce, counterRight ? 0 : 12 - nonce.length), nonce = nc, toClean.push(nonce);
        }
        const n32 = u32(nonce);
        return function runCipher(core, sigma, key, nonce, data, output2, counter, rounds) {
            const len = data.length, block = new Uint8Array(64), b32 = u32(block), isAligned = isAligned322(data) && isAligned322(output2), d32 = isAligned ? u32(data) : U32_EMPTY, o32 = isAligned ? u32(output2) : U32_EMPTY;
            for (let pos = 0; pos < len; counter++) {
                if (core(sigma, key, nonce, b32, counter, rounds), counter >= 4294967295) throw new Error("arx: counter overflow");
                const take = Math.min(64, len - pos);
                if (isAligned && 64 === take) {
                    const pos32 = pos / 4;
                    if (pos % 4 != 0) throw new Error("arx: invalid block position");
                    for (let posj, j = 0; j < 16; j++) posj = pos32 + j, o32[posj] = d32[posj] ^ b32[j];
                    pos += 64;
                    continue;
                }
                for (let posj, j = 0; j < take; j++) posj = pos + j, output2[posj] = data[posj] ^ block[j];
                pos += take;
            }
        }(core, sigma, k32, n32, data, output2, counter, rounds), clean(...toClean), output2;
    };
}

function u8to16(a, i) {
    return 255 & a[i++] | (255 & a[i++]) << 8;
}

class Poly1305 {
    blockLen=16;
    outputLen=16;
    buffer=new Uint8Array(16);
    r=new Uint16Array(10);
    h=new Uint16Array(10);
    pad=new Uint16Array(8);
    pos=0;
    finished=!1;
    constructor(key) {
        const t0 = u8to16(key = copyBytes(abytes2(key, 32, "key")), 0), t1 = u8to16(key, 2), t2 = u8to16(key, 4), t3 = u8to16(key, 6), t4 = u8to16(key, 8), t5 = u8to16(key, 10), t6 = u8to16(key, 12), t7 = u8to16(key, 14);
        this.r[0] = 8191 & t0, this.r[1] = 8191 & (t0 >>> 13 | t1 << 3), this.r[2] = 7939 & (t1 >>> 10 | t2 << 6), 
        this.r[3] = 8191 & (t2 >>> 7 | t3 << 9), this.r[4] = 255 & (t3 >>> 4 | t4 << 12), 
        this.r[5] = t4 >>> 1 & 8190, this.r[6] = 8191 & (t4 >>> 14 | t5 << 2), this.r[7] = 8065 & (t5 >>> 11 | t6 << 5), 
        this.r[8] = 8191 & (t6 >>> 8 | t7 << 8), this.r[9] = t7 >>> 5 & 127;
        for (let i = 0; i < 8; i++) this.pad[i] = u8to16(key, 16 + 2 * i);
    }
    process(data, offset, isLast = !1) {
        const hibit = isLast ? 0 : 2048, {h: h, r: r} = this, r0 = r[0], r1 = r[1], r2 = r[2], r3 = r[3], r4 = r[4], r5 = r[5], r6 = r[6], r7 = r[7], r8 = r[8], r9 = r[9], t0 = u8to16(data, offset + 0), t1 = u8to16(data, offset + 2), t2 = u8to16(data, offset + 4), t3 = u8to16(data, offset + 6), t4 = u8to16(data, offset + 8), t5 = u8to16(data, offset + 10), t6 = u8to16(data, offset + 12), t7 = u8to16(data, offset + 14);
        let h0 = h[0] + (8191 & t0), h1 = h[1] + (8191 & (t0 >>> 13 | t1 << 3)), h2 = h[2] + (8191 & (t1 >>> 10 | t2 << 6)), h3 = h[3] + (8191 & (t2 >>> 7 | t3 << 9)), h4 = h[4] + (8191 & (t3 >>> 4 | t4 << 12)), h5 = h[5] + (t4 >>> 1 & 8191), h6 = h[6] + (8191 & (t4 >>> 14 | t5 << 2)), h7 = h[7] + (8191 & (t5 >>> 11 | t6 << 5)), h8 = h[8] + (8191 & (t6 >>> 8 | t7 << 8)), h9 = h[9] + (t7 >>> 5 | hibit), c = 0, d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
        c = d0 >>> 13, d0 &= 8191, d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1), 
        c += d0 >>> 13, d0 &= 8191;
        let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
        c = d1 >>> 13, d1 &= 8191, d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2), 
        c += d1 >>> 13, d1 &= 8191;
        let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
        c = d2 >>> 13, d2 &= 8191, d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3), 
        c += d2 >>> 13, d2 &= 8191;
        let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
        c = d3 >>> 13, d3 &= 8191, d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4), 
        c += d3 >>> 13, d3 &= 8191;
        let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
        c = d4 >>> 13, d4 &= 8191, d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5), 
        c += d4 >>> 13, d4 &= 8191;
        let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
        c = d5 >>> 13, d5 &= 8191, d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6), 
        c += d5 >>> 13, d5 &= 8191;
        let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
        c = d6 >>> 13, d6 &= 8191, d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7), 
        c += d6 >>> 13, d6 &= 8191;
        let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
        c = d7 >>> 13, d7 &= 8191, d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8), 
        c += d7 >>> 13, d7 &= 8191;
        let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
        c = d8 >>> 13, d8 &= 8191, d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9), 
        c += d8 >>> 13, d8 &= 8191;
        let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
        c = d9 >>> 13, d9 &= 8191, d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0, 
        c += d9 >>> 13, d9 &= 8191, c = (c << 2) + c | 0, c = c + d0 | 0, d0 = 8191 & c, 
        c >>>= 13, d1 += c, h[0] = d0, h[1] = d1, h[2] = d2, h[3] = d3, h[4] = d4, h[5] = d5, 
        h[6] = d6, h[7] = d7, h[8] = d8, h[9] = d9;
    }
    finalize() {
        const {h: h, pad: pad} = this, g = new Uint16Array(10);
        let c = h[1] >>> 13;
        h[1] &= 8191;
        for (let i = 2; i < 10; i++) h[i] += c, c = h[i] >>> 13, h[i] &= 8191;
        h[0] += 5 * c, c = h[0] >>> 13, h[0] &= 8191, h[1] += c, c = h[1] >>> 13, h[1] &= 8191, 
        h[2] += c, g[0] = h[0] + 5, c = g[0] >>> 13, g[0] &= 8191;
        for (let i = 1; i < 10; i++) g[i] = h[i] + c, c = g[i] >>> 13, g[i] &= 8191;
        g[9] -= 8192;
        let mask = (1 ^ c) - 1;
        for (let i = 0; i < 10; i++) g[i] &= mask;
        mask = ~mask;
        for (let i = 0; i < 10; i++) h[i] = h[i] & mask | g[i];
        h[0] = 65535 & (h[0] | h[1] << 13), h[1] = 65535 & (h[1] >>> 3 | h[2] << 10), h[2] = 65535 & (h[2] >>> 6 | h[3] << 7), 
        h[3] = 65535 & (h[3] >>> 9 | h[4] << 4), h[4] = 65535 & (h[4] >>> 12 | h[5] << 1 | h[6] << 14), 
        h[5] = 65535 & (h[6] >>> 2 | h[7] << 11), h[6] = 65535 & (h[7] >>> 5 | h[8] << 8), 
        h[7] = 65535 & (h[8] >>> 8 | h[9] << 5);
        let f = h[0] + pad[0];
        h[0] = 65535 & f;
        for (let i = 1; i < 8; i++) f = (h[i] + pad[i] | 0) + (f >>> 16) | 0, h[i] = 65535 & f;
        clean(g);
    }
    update(data) {
        aexists(this), abytes2(data), data = copyBytes(data);
        const {buffer: buffer, blockLen: blockLen} = this, len = data.length;
        for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take !== blockLen) buffer.set(data.subarray(pos, pos + take), this.pos), this.pos += take, 
            pos += take, this.pos === blockLen && (this.process(buffer, 0, !1), this.pos = 0); else for (;blockLen <= len - pos; pos += blockLen) this.process(data, pos);
        }
        return this;
    }
    destroy() {
        clean(this.h, this.r, this.buffer, this.pad);
    }
    digestInto(out) {
        aexists(this), function aoutput(out, instance) {
            abytes2(out, void 0, "output");
            const min = instance.outputLen;
            if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
        }(out, this), this.finished = !0;
        const {buffer: buffer, h: h} = this;
        let {pos: pos} = this;
        if (pos) {
            for (buffer[pos++] = 1; pos < 16; pos++) buffer[pos] = 0;
            this.process(buffer, 0, !0);
        }
        this.finalize();
        let opos = 0;
        for (let i = 0; i < 8; i++) out[opos++] = h[i] >>> 0, out[opos++] = h[i] >>> 8;
        return out;
    }
    digest() {
        const {buffer: buffer, outputLen: outputLen} = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        return this.destroy(), res;
    }
}

var poly1305 = (() => function wrapConstructorWithKey(hashCons) {
    const hashC = (msg, key) => hashCons(key).update(msg).digest(), tmp = hashCons(new Uint8Array(32));
    return hashC.outputLen = tmp.outputLen, hashC.blockLen = tmp.blockLen, hashC.create = key => hashCons(key), 
    hashC;
}(key => new Poly1305(key)))();

function chachaCore(s, k, n, out, cnt, rounds = 20) {
    let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2], x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
    for (let r = 0; r < rounds; r += 2) x00 = x00 + x04 | 0, x12 = rotl(x12 ^ x00, 16), 
    x08 = x08 + x12 | 0, x04 = rotl(x04 ^ x08, 12), x00 = x00 + x04 | 0, x12 = rotl(x12 ^ x00, 8), 
    x08 = x08 + x12 | 0, x04 = rotl(x04 ^ x08, 7), x01 = x01 + x05 | 0, x13 = rotl(x13 ^ x01, 16), 
    x09 = x09 + x13 | 0, x05 = rotl(x05 ^ x09, 12), x01 = x01 + x05 | 0, x13 = rotl(x13 ^ x01, 8), 
    x09 = x09 + x13 | 0, x05 = rotl(x05 ^ x09, 7), x02 = x02 + x06 | 0, x14 = rotl(x14 ^ x02, 16), 
    x10 = x10 + x14 | 0, x06 = rotl(x06 ^ x10, 12), x02 = x02 + x06 | 0, x14 = rotl(x14 ^ x02, 8), 
    x10 = x10 + x14 | 0, x06 = rotl(x06 ^ x10, 7), x03 = x03 + x07 | 0, x15 = rotl(x15 ^ x03, 16), 
    x11 = x11 + x15 | 0, x07 = rotl(x07 ^ x11, 12), x03 = x03 + x07 | 0, x15 = rotl(x15 ^ x03, 8), 
    x11 = x11 + x15 | 0, x07 = rotl(x07 ^ x11, 7), x00 = x00 + x05 | 0, x15 = rotl(x15 ^ x00, 16), 
    x10 = x10 + x15 | 0, x05 = rotl(x05 ^ x10, 12), x00 = x00 + x05 | 0, x15 = rotl(x15 ^ x00, 8), 
    x10 = x10 + x15 | 0, x05 = rotl(x05 ^ x10, 7), x01 = x01 + x06 | 0, x12 = rotl(x12 ^ x01, 16), 
    x11 = x11 + x12 | 0, x06 = rotl(x06 ^ x11, 12), x01 = x01 + x06 | 0, x12 = rotl(x12 ^ x01, 8), 
    x11 = x11 + x12 | 0, x06 = rotl(x06 ^ x11, 7), x02 = x02 + x07 | 0, x13 = rotl(x13 ^ x02, 16), 
    x08 = x08 + x13 | 0, x07 = rotl(x07 ^ x08, 12), x02 = x02 + x07 | 0, x13 = rotl(x13 ^ x02, 8), 
    x08 = x08 + x13 | 0, x07 = rotl(x07 ^ x08, 7), x03 = x03 + x04 | 0, x14 = rotl(x14 ^ x03, 16), 
    x09 = x09 + x14 | 0, x04 = rotl(x04 ^ x09, 12), x03 = x03 + x04 | 0, x14 = rotl(x14 ^ x03, 8), 
    x09 = x09 + x14 | 0, x04 = rotl(x04 ^ x09, 7);
    let oi = 0;
    out[oi++] = y00 + x00 | 0, out[oi++] = y01 + x01 | 0, out[oi++] = y02 + x02 | 0, 
    out[oi++] = y03 + x03 | 0, out[oi++] = y04 + x04 | 0, out[oi++] = y05 + x05 | 0, 
    out[oi++] = y06 + x06 | 0, out[oi++] = y07 + x07 | 0, out[oi++] = y08 + x08 | 0, 
    out[oi++] = y09 + x09 | 0, out[oi++] = y10 + x10 | 0, out[oi++] = y11 + x11 | 0, 
    out[oi++] = y12 + x12 | 0, out[oi++] = y13 + x13 | 0, out[oi++] = y14 + x14 | 0, 
    out[oi++] = y15 + x15 | 0;
}

var xchacha20 = createCipher(chachaCore, {
    counterRight: !1,
    counterLength: 8,
    extendNonceFn: function hchacha(s, k, i, out) {
        let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
        for (let r = 0; r < 20; r += 2) x00 = x00 + x04 | 0, x12 = rotl(x12 ^ x00, 16), 
        x08 = x08 + x12 | 0, x04 = rotl(x04 ^ x08, 12), x00 = x00 + x04 | 0, x12 = rotl(x12 ^ x00, 8), 
        x08 = x08 + x12 | 0, x04 = rotl(x04 ^ x08, 7), x01 = x01 + x05 | 0, x13 = rotl(x13 ^ x01, 16), 
        x09 = x09 + x13 | 0, x05 = rotl(x05 ^ x09, 12), x01 = x01 + x05 | 0, x13 = rotl(x13 ^ x01, 8), 
        x09 = x09 + x13 | 0, x05 = rotl(x05 ^ x09, 7), x02 = x02 + x06 | 0, x14 = rotl(x14 ^ x02, 16), 
        x10 = x10 + x14 | 0, x06 = rotl(x06 ^ x10, 12), x02 = x02 + x06 | 0, x14 = rotl(x14 ^ x02, 8), 
        x10 = x10 + x14 | 0, x06 = rotl(x06 ^ x10, 7), x03 = x03 + x07 | 0, x15 = rotl(x15 ^ x03, 16), 
        x11 = x11 + x15 | 0, x07 = rotl(x07 ^ x11, 12), x03 = x03 + x07 | 0, x15 = rotl(x15 ^ x03, 8), 
        x11 = x11 + x15 | 0, x07 = rotl(x07 ^ x11, 7), x00 = x00 + x05 | 0, x15 = rotl(x15 ^ x00, 16), 
        x10 = x10 + x15 | 0, x05 = rotl(x05 ^ x10, 12), x00 = x00 + x05 | 0, x15 = rotl(x15 ^ x00, 8), 
        x10 = x10 + x15 | 0, x05 = rotl(x05 ^ x10, 7), x01 = x01 + x06 | 0, x12 = rotl(x12 ^ x01, 16), 
        x11 = x11 + x12 | 0, x06 = rotl(x06 ^ x11, 12), x01 = x01 + x06 | 0, x12 = rotl(x12 ^ x01, 8), 
        x11 = x11 + x12 | 0, x06 = rotl(x06 ^ x11, 7), x02 = x02 + x07 | 0, x13 = rotl(x13 ^ x02, 16), 
        x08 = x08 + x13 | 0, x07 = rotl(x07 ^ x08, 12), x02 = x02 + x07 | 0, x13 = rotl(x13 ^ x02, 8), 
        x08 = x08 + x13 | 0, x07 = rotl(x07 ^ x08, 7), x03 = x03 + x04 | 0, x14 = rotl(x14 ^ x03, 16), 
        x09 = x09 + x14 | 0, x04 = rotl(x04 ^ x09, 12), x03 = x03 + x04 | 0, x14 = rotl(x14 ^ x03, 8), 
        x09 = x09 + x14 | 0, x04 = rotl(x04 ^ x09, 7);
        let oi = 0;
        out[oi++] = x00, out[oi++] = x01, out[oi++] = x02, out[oi++] = x03, out[oi++] = x12, 
        out[oi++] = x13, out[oi++] = x14, out[oi++] = x15;
    },
    allowShortKeys: !1
}), ZEROS16 = new Uint8Array(16), updatePadded = (h, msg) => {
    h.update(msg);
    const leftover = msg.length % 16;
    leftover && h.update(ZEROS16.subarray(leftover));
}, ZEROS32 = new Uint8Array(32);

function computeTag(fn, key, nonce, ciphertext, AAD) {
    void 0 !== AAD && abytes2(AAD, void 0, "AAD");
    const authKey = fn(key, nonce, ZEROS32), lengths2 = function u64Lengths(dataLength, aadLength, isLE3) {
        abool(isLE3);
        const num = new Uint8Array(16), view = function createView2(arr) {
            return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
        }(num);
        return view.setBigUint64(0, BigInt(aadLength), isLE3), view.setBigUint64(8, BigInt(dataLength), isLE3), 
        num;
    }(ciphertext.length, AAD ? AAD.length : 0, !0), h = poly1305.create(authKey);
    AAD && updatePadded(h, AAD), updatePadded(h, ciphertext), h.update(lengths2);
    const res = h.digest();
    return clean(authKey, lengths2), res;
}

var xorStream, xchacha20poly1305 = wrapCipher({
    blockSize: 64,
    nonceLength: 24,
    tagLength: 16
}, (xorStream = xchacha20, (key, nonce, AAD) => ({
    encrypt(plaintext, output2) {
        const plength = plaintext.length;
        (output2 = getOutput(plength + 16, output2, !1)).set(plaintext);
        const oPlain = output2.subarray(0, -16);
        xorStream(key, nonce, oPlain, oPlain, 1);
        const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
        return output2.set(tag, plength), clean(tag), output2;
    },
    decrypt(ciphertext, output2) {
        output2 = getOutput(ciphertext.length - 16, output2, !1);
        const data = ciphertext.subarray(0, -16), passedTag = ciphertext.subarray(-16), tag = computeTag(xorStream, key, nonce, data, AAD);
        if (!function equalBytes(a, b) {
            if (a.length !== b.length) return !1;
            let diff = 0;
            for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
            return 0 === diff;
        }(passedTag, tag)) throw new Error("invalid tag");
        return output2.set(ciphertext.subarray(0, -16)), xorStream(key, nonce, output2, output2, 1), 
        clean(tag), output2;
    }
})));

class ConnectionConfig {
    static MATP_BYTES=Bytes.from_string("matp").raw();
    static MATP_PROTO=Bytes.from_string("matp-protocol").raw();
    static new_with_random_key() {
        return new this(crypto.getRandomValues(new Uint8Array(64)));
    }
    public_key;
    private_key;
    max_datagram_size=2048;
    wait_base=2;
    constructor(key) {
        if (key.length < 64) throw new Error("Key must have at least 64 bytes");
        ({publicKey: this.public_key, secretKey: this.private_key} = keygen(key));
    }
    retrieve_shared(public_key) {
        const shared = getSharedSecret(this.private_key, public_key);
        return hkdf(sha256, shared, ConnectionConfig.MATP_PROTO, ConnectionConfig.MATP_BYTES, 32);
    }
    with_max_datagram_size(size) {
        return this.max_datagram_size = size, this;
    }
    with_base(base) {
        return this.wait_base = base, this;
    }
    generate_transfer_parameters() {
        return new TransferParameter(this.public_key, 65535, this.max_datagram_size, this.wait_base);
    }
}

var HANDSHAKE_BYTES = Bytes.from_string("HANDSHAKE_WITH_SOME_SHIT").raw();

class ListenerConnection2 {
    end;
    config;
    shared_key=new Uint8Array(32);
    contents=[];
    handshake=[];
    encrypt;
    constructor(end, config) {
        this.end = end, this.config = config;
    }
    has_pending() {
        return this.contents.length > 0;
    }
    has_pending_handshake() {
        return this.handshake.length > 0;
    }
    retrieve_handshake_frames() {
        return [ Crypto.transport(this.config.generate_transfer_parameters()) ];
    }
    recv_normal(content) {}
    recv_handshake(content) {
        for (const frame of content.frames) if (2 === frame.id.ty) {
            const transfer = frame.retrieve_transport();
            this.shared_key.set(this.config.retrieve_shared(transfer.key)), this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES);
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
        const out = new StreamConnection2(end, config), promise = new Promise(ok => out.promise = ok);
        return [ out, promise ];
    }
    shared_key=new Uint8Array(32);
    contents=[];
    encrypt;
    promise;
    constructor(end, config) {
        this.end = end, this.config = config;
    }
    has_pending() {
        return this.contents.length > 0;
    }
    retrieve_handshake_frames() {
        return [ Crypto.transport(this.config.generate_transfer_parameters()) ];
    }
    recv_normal(content) {}
    recv_handshake(content) {
        for (const frame of content.frames) if (2 === frame.id.ty) {
            const transfer = frame.retrieve_transport();
            this.shared_key.set(this.config.retrieve_shared(transfer.key)), this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES);
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

function gen_id(name) {
    let hash2 = 2166136261;
    for (const c of name) hash2 ^= c.charCodeAt(0), hash2 = 16777619 * hash2 >>> 0;
    return hash2 >>> 0;
}

class MatpStream extends EndPoint {
    static new(id, options) {
        const stream = new MatpStream(id), promises = options.targets.map(t => new Promise(async (ok, err2) => {
            const handshake = stream.start_handshake(gen_id(t));
            return Promise.race([ system.waitTicks(options.max_wait_limit).then(err2), handshake.then(ok) ]);
        }));
        return [ stream, Promise.allSettled(promises).then(results => {
            let i = 0;
            for (const result of results) "rejected" === result.status && (stream.emit("on_fail_handshake", options.targets[i]), 
            stream.connections.delete(gen_id(options.targets[i]))), i++;
        }).then(() => stream) ];
    }
    static new_listening(id, options) {
        const stream = new MatpStream(id), promises = options.targets.map(t => new Promise((ok, err2) => {
            const handshake = stream.start_handshake(gen_id(t));
            return Promise.race([ system.waitTicks(options.max_wait_limit).then(err2), handshake.then(ok) ]);
        }));
        return stream.listen(), [ stream, Promise.allSettled(promises).then(results => {
            let i = 0;
            for (const result of results) "rejected" === result.status && (stream.emit("on_fail_handshake", options.targets[i]), 
            stream.connections.delete(gen_id(options.targets[i]))), i++;
        }).then(() => stream) ];
    }
    connections=new Map;
    constructor(id) {
        super(id), this.addListener("on_recv", this.recv.bind(this));
    }
    async send(target, data, handshake = !1) {
        return await this.retrieve_connection_with(target), this.datagram.create_content(target, data, handshake);
    }
    async retrieve_connection_with(sender) {
        return this.connections.get(sender) || (await this.start_handshake(sender), this.connections.get(sender));
    }
    async start_handshake(target) {
        if (this.connections.has(target)) throw new Error(`A connection with the provided target of id ${target} already exists`);
        const [conn, out] = StreamConnection2.new(target, ConnectionConfig.new_with_random_key());
        this.connections.set(target, conn), this.datagram.create_content(target, conn.retrieve_handshake_frames(), !0);
        for (const _ of this.flush()) ;
        return await out;
    }
    async recv(event) {
        try {
            const id_content = decode(event.id.slice(5)), id = MatpDatagramId.deserialize(new Bytes(id_content.buffer));
            for (const target of id) if (target.target === this.id) {
                const connection = this.connections.get(id.sender);
                if (!connection) return;
                const bytes2 = new Bytes(decode(event.message).buffer, +target.position);
                {
                    const content = MatpContent.deserialize(bytes2);
                    content.is_handshake() ? connection.recv_handshake(content) : connection.recv_normal(content), 
                    this.emit("on_server_content", connection), connection.has_pending() && (this.send(id.sender, connection.frames(), !1), 
                    connection.reset_frames());
                }
            }
        } catch {}
    }
    listen() {
        system.afterEvents.scriptEventReceive.subscribe(ev => {
            this.emit("on_recv", ev), this.recv(ev);
        });
    }
}

var clien, server = new class MatpListener extends EndPoint {
    connections=new Map;
    constructor(id) {
        super(id);
    }
    send(target, data, handshake = !1) {
        if (!this.connections.has(target)) throw new Error("Must stablish a connection with the provided target before sending data");
        return this.datagram.create_content(target, data, handshake);
    }
    retrieve_connection_with(sender) {
        const data = this.connections.get(sender);
        if (data) return data;
        {
            const conn = new ListenerConnection2(sender, ConnectionConfig.new_with_random_key());
            return this.connections.set(sender, conn), conn;
        }
    }
    recv(event) {
        try {
            const id_content = decode(event.id.slice(5)), id = MatpDatagramId.deserialize(new Bytes(id_content.buffer));
            for (const target of id) if (target.target === this.id) {
                const connection = this.retrieve_connection_with(id.sender);
                let bytes2 = decode(event.message);
                bytes2.advance_cursor(+target.position), bytes2 = bytes2.slice_from_current_with_length(bytes2.length() - bytes2.cursor);
                {
                    let content;
                    try {
                        content = MatpContent.deserialize(bytes2);
                    } catch (e) {
                        throw console.error(e), e;
                    }
                    content.is_handshake() ? connection.recv_handshake(content) : connection.recv_normal(content), 
                    connection.has_pending_handshake() && (this.send(id.sender, connection.handshake_frames(), !0), 
                    connection.reset_handshake_frames()), this.emit("on_client_content", connection), 
                    connection.has_pending() && (this.send(id.sender, connection.frames(), !1), connection.reset_frames());
                    break;
                }
            }
        } catch {}
    }
    listen() {
        const self = this;
        system.afterEvents.scriptEventReceive.subscribe(function(ev) {
            self.emit("on_recv", ev), self.recv(ev);
        });
    }
}("jorge");

server.addListener("on_client_content", () => {
    for (const _ of server.flush()) console.warn("Eu escrevi");
}), server.listen(), world.afterEvents.worldLoad.subscribe(async () => {
    await system.waitTicks(5);
    const [client, handshake] = MatpStream.new_listening("pedro", {
        max_wait_limit: 5,
        targets: [ "jorge", "henrique" ]
    });
    client.on("on_fail_handshake", console.warn), await handshake;
    try {
        console.warn(client.connections.get(gen_id("jorge")), "oiaki"), console.warn(server.connections.get(gen_id("pedro")), "oiakio pedro");
    } catch {}
    clien = client;
});

var data = [ new Data(0, Bytes.new(2048)) ];

world.afterEvents.playerButtonInput.subscribe(async ev => {
    if (ev.button === InputButton.Jump && ev.newButtonState === ButtonState.Pressed) {
        const now = Date.now();
        for (let i = 0; i < 3; i++) {
            await clien.send(gen_id("jorge"), data);
            for (const _ of clien.flush()) ;
        }
        console.warn("Made", 3, "sends in", Date.now() - now, "ms");
    }
});
