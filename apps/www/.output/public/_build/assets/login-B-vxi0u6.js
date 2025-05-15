import {
  r as a,
  j as s,
  w as lt,
  d as D,
  e as it,
  a as st,
  M as ot,
  b as ut,
  L as ct,
  t as Ee,
} from "./client-DJZyYeHn.js";
import { b as dt, c as A, a as ft, s as pt } from "./auth-DzL7yw3J.js";
import { I as mt } from "./input-BLXIWNlW.js";
import { L as ht } from "./loading-BAzzZg5_.js";
function Pe(e, t) {
  if (typeof e == "function") return e(t);
  e != null && (e.current = t);
}
function Be(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((l) => {
      const i = Pe(l, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let l = 0; l < r.length; l++) {
          const i = r[l];
          typeof i == "function" ? i() : Pe(e[l], null);
        }
      };
  };
}
function gt(...e) {
  return a.useCallback(Be(...e), e);
}
function vt(e) {
  const t = bt(e),
    n = a.forwardRef((r, l) => {
      const { children: i, ...d } = r,
        o = a.Children.toArray(i),
        p = o.find(yt);
      if (p) {
        const f = p.props.children,
          v = o.map((m) =>
            m === p
              ? a.Children.count(f) > 1
                ? a.Children.only(null)
                : a.isValidElement(f)
                  ? f.props.children
                  : null
              : m
          );
        return s.jsx(t, {
          ...d,
          ref: l,
          children: a.isValidElement(f) ? a.cloneElement(f, void 0, v) : null,
        });
      }
      return s.jsx(t, { ...d, ref: l, children: i });
    });
  return (n.displayName = `${e}.Slot`), n;
}
var xt = vt("Slot");
function bt(e) {
  const t = a.forwardRef((n, r) => {
    const { children: l, ...i } = n,
      d = a.isValidElement(l) ? jt(l) : void 0,
      o = gt(d, r);
    if (a.isValidElement(l)) {
      const p = St(i, l.props);
      return l.type !== a.Fragment && (p.ref = o), a.cloneElement(l, p);
    }
    return a.Children.count(l) > 1 ? a.Children.only(null) : null;
  });
  return (t.displayName = `${e}.SlotClone`), t;
}
var wt = Symbol("radix.slottable");
function yt(e) {
  return (
    a.isValidElement(e) &&
    typeof e.type == "function" &&
    "__radixId" in e.type &&
    e.type.__radixId === wt
  );
}
function St(e, t) {
  const n = { ...t };
  for (const r in t) {
    const l = e[r],
      i = t[r];
    /^on[A-Z]/.test(r)
      ? l && i
        ? (n[r] = (...o) => {
            const p = i(...o);
            return l(...o), p;
          })
        : l && (n[r] = l)
      : r === "style"
        ? (n[r] = { ...l, ...i })
        : r === "className" && (n[r] = [l, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function jt(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, "ref")?.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
const Me = (e) => (typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e),
  Oe = dt,
  Ct = (e, t) => (n) => {
    var r;
    if (t?.variants == null) return Oe(e, n?.class, n?.className);
    const { variants: l, defaultVariants: i } = t,
      d = Object.keys(l).map((f) => {
        const v = n?.[f],
          m = i?.[f];
        if (v === null) return null;
        const h = Me(v) || Me(m);
        return l[f][h];
      }),
      o =
        n &&
        Object.entries(n).reduce((f, v) => {
          let [m, h] = v;
          return h === void 0 || (f[m] = h), f;
        }, {}),
      p =
        t == null || (r = t.compoundVariants) === null || r === void 0
          ? void 0
          : r.reduce((f, v) => {
              let { class: m, className: h, ...E } = v;
              return Object.entries(E).every((g) => {
                let [w, N] = g;
                return Array.isArray(N)
                  ? N.includes({ ...i, ...o }[w])
                  : { ...i, ...o }[w] === N;
              })
                ? [...f, m, h]
                : f;
            }, []);
    return Oe(e, d, p, n?.class, n?.className);
  },
  Nt = Ct(
    "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
      variants: {
        variant: {
          default:
            "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          destructive:
            "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline:
            "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          secondary:
            "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
          ghost:
            "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-9 px-4 py-2 has-[>svg]:px-3",
          sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
          lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
          icon: "size-9",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    }
  );
function ie({ className: e, variant: t, size: n, asChild: r = !1, ...l }) {
  const i = r ? xt : "button";
  return s.jsx(i, {
    "data-slot": "button",
    className: A(Nt({ variant: t, size: n, className: e })),
    ...l,
  });
}
function Re({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "card",
    className: A(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      e
    ),
    ...t,
  });
}
function Te({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "card-header",
    className: A(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      e
    ),
    ...t,
  });
}
function Ae({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "card-title",
    className: A("leading-none font-semibold", e),
    ...t,
  });
}
function ke({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "card-description",
    className: A("text-muted-foreground text-sm", e),
    ...t,
  });
}
function Ie({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "card-content",
    className: A("px-6", e),
    ...t,
  });
}
function Et(e) {
  const t = Pt(e),
    n = a.forwardRef((r, l) => {
      const { children: i, ...d } = r,
        o = a.Children.toArray(i),
        p = o.find(Ot);
      if (p) {
        const f = p.props.children,
          v = o.map((m) =>
            m === p
              ? a.Children.count(f) > 1
                ? a.Children.only(null)
                : a.isValidElement(f)
                  ? f.props.children
                  : null
              : m
          );
        return s.jsx(t, {
          ...d,
          ref: l,
          children: a.isValidElement(f) ? a.cloneElement(f, void 0, v) : null,
        });
      }
      return s.jsx(t, { ...d, ref: l, children: i });
    });
  return (n.displayName = `${e}.Slot`), n;
}
function Pt(e) {
  const t = a.forwardRef((n, r) => {
    const { children: l, ...i } = n;
    if (a.isValidElement(l)) {
      const d = Tt(l),
        o = Rt(i, l.props);
      return (
        l.type !== a.Fragment && (o.ref = r ? Be(r, d) : d),
        a.cloneElement(l, o)
      );
    }
    return a.Children.count(l) > 1 ? a.Children.only(null) : null;
  });
  return (t.displayName = `${e}.SlotClone`), t;
}
var Mt = Symbol("radix.slottable");
function Ot(e) {
  return (
    a.isValidElement(e) &&
    typeof e.type == "function" &&
    "__radixId" in e.type &&
    e.type.__radixId === Mt
  );
}
function Rt(e, t) {
  const n = { ...t };
  for (const r in t) {
    const l = e[r],
      i = t[r];
    /^on[A-Z]/.test(r)
      ? l && i
        ? (n[r] = (...o) => {
            i(...o), l(...o);
          })
        : l && (n[r] = l)
      : r === "style"
        ? (n[r] = { ...l, ...i })
        : r === "className" && (n[r] = [l, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Tt(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, "ref")?.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
var At = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  kt = At.reduce((e, t) => {
    const n = Et(`Primitive.${t}`),
      r = a.forwardRef((l, i) => {
        const { asChild: d, ...o } = l,
          p = d ? n : t;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          s.jsx(p, { ...o, ref: i })
        );
      });
    return (r.displayName = `Primitive.${t}`), { ...e, [t]: r };
  }, {}),
  It = "Label",
  qe = a.forwardRef((e, t) =>
    s.jsx(kt.label, {
      ...e,
      ref: t,
      onMouseDown: (n) => {
        n.target.closest("button, input, select, textarea") ||
          (e.onMouseDown?.(n),
          !n.defaultPrevented && n.detail > 1 && n.preventDefault());
      },
    })
  );
qe.displayName = It;
var Lt = qe;
function _t({ className: e, ...t }) {
  return s.jsx(Lt, {
    "data-slot": "label",
    className: A(
      "flex relative z-0 items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      e
    ),
    ...t,
  });
}
function me(e, t, n) {
  try {
    return e(t);
  } catch (r) {
    return (
      lt(
        "[nuqs] Error while parsing value `%s`: %O" +
          (n ? " (for key `%s`)" : ""),
        t,
        r,
        n
      ),
      null
    );
  }
}
function Dt() {
  if (typeof window > "u" || !!!window.GestureEvent) return 50;
  try {
    const t = navigator.userAgent?.match(/version\/([\d\.]+) safari/i);
    return parseFloat(t[1]) >= 17 ? 120 : 320;
  } catch {
    return 320;
  }
}
var te = Dt(),
  ne = new Map(),
  O = { history: "replace", scroll: !1, shallow: !0, throttleMs: te },
  he = new Set(),
  Le = 0,
  X = null;
function Ft(e) {
  return ne.get(e);
}
function Wt() {
  ne.clear(),
    he.clear(),
    (O.history = "replace"),
    (O.scroll = !1),
    (O.shallow = !0),
    (O.throttleMs = te);
}
function zt(e, t, n, r) {
  const l = t === null ? null : n(t);
  return (
    D("[nuqs queue] Enqueueing %s=%s %O", e, l, r),
    ne.set(e, l),
    r.history === "push" && (O.history = "push"),
    r.scroll && (O.scroll = !0),
    r.shallow === !1 && (O.shallow = !1),
    r.startTransition && he.add(r.startTransition),
    (O.throttleMs = Math.max(
      r.throttleMs ?? te,
      Number.isFinite(O.throttleMs) ? O.throttleMs : 0
    )),
    l
  );
}
function Bt() {
  return new URLSearchParams(location.search);
}
function qt({
  getSearchParamsSnapshot: e = Bt,
  updateUrl: t,
  rateLimitFactor: n = 1,
}) {
  return (
    X === null &&
      (X = new Promise((r, l) => {
        if (!Number.isFinite(O.throttleMs)) {
          D("[nuqs queue] Skipping flush due to throttleMs=Infinity"),
            r(e()),
            setTimeout(() => {
              X = null;
            }, 0);
          return;
        }
        function i() {
          Le = performance.now();
          const [o, p] = $t({ updateUrl: t, getSearchParamsSnapshot: e });
          p === null ? r(o) : l(o), (X = null);
        }
        function d() {
          const p = performance.now() - Le,
            f = O.throttleMs,
            v = n * Math.max(0, Math.min(f, f - p));
          D("[nuqs queue] Scheduling flush in %f ms. Throttled at %f ms", v, f),
            v === 0 ? i() : setTimeout(i, v);
        }
        setTimeout(d, 0);
      })),
    X
  );
}
function $t({ updateUrl: e, getSearchParamsSnapshot: t }) {
  const n = t();
  if (ne.size === 0) return [n, null];
  const r = Array.from(ne.entries()),
    l = { ...O },
    i = Array.from(he);
  Wt(), D("[nuqs queue] Flushing queue %O with options %O", r, l);
  for (const [d, o] of r) o === null ? n.delete(d) : n.set(d, o);
  try {
    return (
      Vt(i, () => {
        e(n, { history: l.history, scroll: l.scroll, shallow: l.shallow });
      }),
      [n, null]
    );
  } catch (d) {
    return console.error(it(429), r.map(([o]) => o).join(), d), [n, d];
  }
}
function Vt(e, t) {
  const n = (r) => {
    if (r === e.length) return t();
    const l = e[r];
    if (!l) throw new Error("Invalid transition function");
    l(() => n(r + 1));
  };
  n(0);
}
function F(e) {
  function t(n) {
    if (typeof n > "u") return null;
    let r = "";
    if (Array.isArray(n)) {
      if (n[0] === void 0) return null;
      r = n[0];
    }
    return typeof n == "string" && (r = n), me(e.parse, r);
  }
  return {
    eq: (n, r) => n === r,
    ...e,
    parseServerSide: t,
    withDefault(n) {
      return {
        ...this,
        defaultValue: n,
        parseServerSide(r) {
          return t(r) ?? n;
        },
      };
    },
    withOptions(n) {
      return { ...this, ...n };
    },
  };
}
var _e = F({ parse: (e) => e, serialize: (e) => `${e}` }),
  De = F({
    parse: (e) => {
      const t = parseInt(e);
      return Number.isNaN(t) ? null : t;
    },
    serialize: (e) => Math.round(e).toFixed(),
  });
F({
  parse: (e) => {
    const t = De.parse(e);
    return t === null ? null : t - 1;
  },
  serialize: (e) => De.serialize(e + 1),
});
F({
  parse: (e) => {
    const t = parseInt(e, 16);
    return Number.isNaN(t) ? null : t;
  },
  serialize: (e) => {
    const t = Math.round(e).toString(16);
    return t.padStart(t.length + (t.length % 2), "0");
  },
});
F({
  parse: (e) => {
    const t = parseFloat(e);
    return Number.isNaN(t) ? null : t;
  },
  serialize: (e) => e.toString(),
});
F({ parse: (e) => e === "true", serialize: (e) => (e ? "true" : "false") });
function ge(e, t) {
  return e.valueOf() === t.valueOf();
}
F({
  parse: (e) => {
    const t = parseInt(e);
    return Number.isNaN(t) ? null : new Date(t);
  },
  serialize: (e) => e.valueOf().toString(),
  eq: ge,
});
F({
  parse: (e) => {
    const t = new Date(e);
    return Number.isNaN(t.valueOf()) ? null : t;
  },
  serialize: (e) => e.toISOString(),
  eq: ge,
});
F({
  parse: (e) => {
    const t = new Date(e.slice(0, 10));
    return Number.isNaN(t.valueOf()) ? null : t;
  },
  serialize: (e) => e.toISOString().slice(0, 10),
  eq: ge,
});
var pe = ot();
function Fe(
  e,
  {
    history: t = "replace",
    shallow: n = !0,
    scroll: r = !1,
    throttleMs: l = te,
    parse: i = (m) => m,
    serialize: d = String,
    eq: o = (m, h) => m === h,
    defaultValue: p = void 0,
    clearOnDefault: f = !0,
    startTransition: v,
  } = {
    history: "replace",
    scroll: !1,
    shallow: !0,
    throttleMs: te,
    parse: (m) => m,
    serialize: String,
    eq: (m, h) => m === h,
    clearOnDefault: !0,
    defaultValue: void 0,
  }
) {
  const m = st(),
    h = m.searchParams,
    E = a.useRef(h?.get(e) ?? null),
    [g, w] = a.useState(() => {
      const y = Ft(e),
        S = y === void 0 ? (h?.get(e) ?? null) : y;
      return S === null ? null : me(i, S, e);
    }),
    N = a.useRef(g);
  D("[nuqs `%s`] render - state: %O, iSP: %s", e, g, h?.get(e) ?? null),
    a.useEffect(() => {
      const y = h?.get(e) ?? null;
      if (y === E.current) return;
      const S = y === null ? null : me(i, y, e);
      D("[nuqs `%s`] syncFromUseSearchParams %O", e, S),
        (N.current = S),
        (E.current = y),
        w(S);
    }, [h?.get(e), e]),
    a.useEffect(() => {
      function y({ state: S, query: I }) {
        D("[nuqs `%s`] updateInternalState %O", e, S),
          (N.current = S),
          (E.current = I),
          w(S);
      }
      return (
        D("[nuqs `%s`] subscribing to sync", e),
        pe.on(e, y),
        () => {
          D("[nuqs `%s`] unsubscribing from sync", e), pe.off(e, y);
        }
      );
    }, [e]);
  const x = a.useCallback(
    (y, S = {}) => {
      let I = Ht(y) ? y(N.current ?? p ?? null) : y;
      (S.clearOnDefault ?? f) &&
        I !== null &&
        p !== void 0 &&
        o(I, p) &&
        (I = null);
      const re = zt(e, I, d, {
        history: S.history ?? t,
        shallow: S.shallow ?? n,
        scroll: S.scroll ?? r,
        throttleMs: S.throttleMs ?? l,
        startTransition: S.startTransition ?? v,
      });
      return pe.emit(e, { state: I, query: re }), qt(m);
    },
    [
      e,
      t,
      n,
      r,
      l,
      v,
      m.updateUrl,
      m.getSearchParamsSnapshot,
      m.rateLimitFactor,
    ]
  );
  return [g ?? p ?? null, x];
}
function Ht(e) {
  return typeof e == "function";
}
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ut = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Gt = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, n, r) =>
      r ? r.toUpperCase() : n.toLowerCase()
    ),
  We = (e) => {
    const t = Gt(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  $e = (...e) =>
    e
      .filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n)
      .join(" ")
      .trim(),
  Qt = (e) => {
    for (const t in e)
      if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
  };
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Zt = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Kt = a.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: l = "",
      children: i,
      iconNode: d,
      ...o
    },
    p
  ) =>
    a.createElement(
      "svg",
      {
        ref: p,
        ...Zt,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: $e("lucide", l),
        ...(!i && !Qt(o) && { "aria-hidden": "true" }),
        ...o,
      },
      [
        ...d.map(([f, v]) => a.createElement(f, v)),
        ...(Array.isArray(i) ? i : [i]),
      ]
    )
);
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ve = (e, t) => {
  const n = a.forwardRef(({ className: r, ...l }, i) =>
    a.createElement(Kt, {
      ref: i,
      iconNode: t,
      className: $e(`lucide-${Ut(We(e))}`, `lucide-${e}`, r),
      ...l,
    })
  );
  return (n.displayName = We(e)), n;
};
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Yt = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }],
  ],
  Jt = Ve("arrow-left", Yt);
/**
 * @license lucide-react v0.492.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xt = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  en = Ve("circle-check", Xt);
var tn = Object.defineProperty,
  nn = Object.defineProperties,
  rn = Object.getOwnPropertyDescriptors,
  se = Object.getOwnPropertySymbols,
  He = Object.prototype.hasOwnProperty,
  Ue = Object.prototype.propertyIsEnumerable,
  ze = (e, t, n) =>
    t in e
      ? tn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  an = (e, t) => {
    for (var n in t || (t = {})) He.call(t, n) && ze(e, n, t[n]);
    if (se) for (var n of se(t)) Ue.call(t, n) && ze(e, n, t[n]);
    return e;
  },
  ln = (e, t) => nn(e, rn(t)),
  sn = (e, t) => {
    var n = {};
    for (var r in e) He.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && se)
      for (var r of se(e)) t.indexOf(r) < 0 && Ue.call(e, r) && (n[r] = e[r]);
    return n;
  };
function on(e) {
  let t = setTimeout(e, 0),
    n = setTimeout(e, 10),
    r = setTimeout(e, 50);
  return [t, n, r];
}
function un(e) {
  let t = a.useRef();
  return (
    a.useEffect(() => {
      t.current = e;
    }),
    t.current
  );
}
var cn = 18,
  Ge = 40,
  dn = `${Ge}px`,
  fn = [
    "[data-lastpass-icon-root]",
    "com-1password-button",
    "[data-dashlanecreated]",
    '[style$="2147483647 !important;"]',
  ].join(",");
function pn({
  containerRef: e,
  inputRef: t,
  pushPasswordManagerStrategy: n,
  isFocused: r,
}) {
  let [l, i] = a.useState(!1),
    [d, o] = a.useState(!1),
    [p, f] = a.useState(!1),
    v = a.useMemo(
      () =>
        n === "none"
          ? !1
          : (n === "increase-width" || n === "experimental-no-flickering") &&
            l &&
            d,
      [l, d, n]
    ),
    m = a.useCallback(() => {
      let h = e.current,
        E = t.current;
      if (!h || !E || p || n === "none") return;
      let g = h,
        w = g.getBoundingClientRect().left + g.offsetWidth,
        N = g.getBoundingClientRect().top + g.offsetHeight / 2,
        x = w - cn,
        y = N;
      (document.querySelectorAll(fn).length === 0 &&
        document.elementFromPoint(x, y) === h) ||
        (i(!0), f(!0));
    }, [e, t, p, n]);
  return (
    a.useEffect(() => {
      let h = e.current;
      if (!h || n === "none") return;
      function E() {
        let w = window.innerWidth - h.getBoundingClientRect().right;
        o(w >= Ge);
      }
      E();
      let g = setInterval(E, 1e3);
      return () => {
        clearInterval(g);
      };
    }, [e, n]),
    a.useEffect(() => {
      let h = r || document.activeElement === t.current;
      if (n === "none" || !h) return;
      let E = setTimeout(m, 0),
        g = setTimeout(m, 2e3),
        w = setTimeout(m, 5e3),
        N = setTimeout(() => {
          f(!0);
        }, 6e3);
      return () => {
        clearTimeout(E), clearTimeout(g), clearTimeout(w), clearTimeout(N);
      };
    }, [t, r, n, m]),
    { hasPWMBadge: l, willPushPWMBadge: v, PWM_BADGE_SPACE_WIDTH: dn }
  );
}
var Qe = a.createContext({}),
  Ze = a.forwardRef((e, t) => {
    var n = e,
      {
        value: r,
        onChange: l,
        maxLength: i,
        textAlign: d = "left",
        pattern: o,
        placeholder: p,
        inputMode: f = "numeric",
        onComplete: v,
        pushPasswordManagerStrategy: m = "increase-width",
        pasteTransformer: h,
        containerClassName: E,
        noScriptCSSFallback: g = mn,
        render: w,
        children: N,
      } = n,
      x = sn(n, [
        "value",
        "onChange",
        "maxLength",
        "textAlign",
        "pattern",
        "placeholder",
        "inputMode",
        "onComplete",
        "pushPasswordManagerStrategy",
        "pasteTransformer",
        "containerClassName",
        "noScriptCSSFallback",
        "render",
        "children",
      ]),
      y,
      S,
      I,
      re,
      ve;
    let [Ke, Ye] = a.useState(
        typeof x.defaultValue == "string" ? x.defaultValue : ""
      ),
      j = r ?? Ke,
      B = un(j),
      Z = a.useCallback(
        (u) => {
          l?.(u), Ye(u);
        },
        [l]
      ),
      L = a.useMemo(
        () => (o ? (typeof o == "string" ? new RegExp(o) : o) : null),
        [o]
      ),
      C = a.useRef(null),
      oe = a.useRef(null),
      ue = a.useRef({
        value: j,
        onChange: Z,
        isIOS:
          typeof window < "u" &&
          ((S = (y = window?.CSS) == null ? void 0 : y.supports) == null
            ? void 0
            : S.call(y, "-webkit-touch-callout", "none")),
      }),
      ae = a.useRef({
        prev: [
          (I = C.current) == null ? void 0 : I.selectionStart,
          (re = C.current) == null ? void 0 : re.selectionEnd,
          (ve = C.current) == null ? void 0 : ve.selectionDirection,
        ],
      });
    a.useImperativeHandle(t, () => C.current, []),
      a.useEffect(() => {
        let u = C.current,
          c = oe.current;
        if (!u || !c) return;
        ue.current.value !== u.value && ue.current.onChange(u.value),
          (ae.current.prev = [
            u.selectionStart,
            u.selectionEnd,
            u.selectionDirection,
          ]);
        function P() {
          if (document.activeElement !== u) {
            Y(null), J(null);
            return;
          }
          let b = u.selectionStart,
            M = u.selectionEnd,
            le = u.selectionDirection,
            k = u.maxLength,
            $ = u.value,
            _ = ae.current.prev,
            W = -1,
            z = -1,
            V;
          if ($.length !== 0 && b !== null && M !== null) {
            let nt = b === M,
              rt = b === $.length && $.length < k;
            if (nt && !rt) {
              let H = b;
              if (H === 0) (W = 0), (z = 1), (V = "forward");
              else if (H === k) (W = H - 1), (z = H), (V = "backward");
              else if (k > 1 && $.length > 1) {
                let fe = 0;
                if (_[0] !== null && _[1] !== null) {
                  V = H < _[1] ? "backward" : "forward";
                  let at = _[0] === _[1] && _[0] < k;
                  V === "backward" && !at && (fe = -1);
                }
                (W = fe + H), (z = fe + H + 1);
              }
            }
            W !== -1 &&
              z !== -1 &&
              W !== z &&
              C.current.setSelectionRange(W, z, V);
          }
          let Ce = W !== -1 ? W : b,
            Ne = z !== -1 ? z : M,
            tt = V ?? le;
          Y(Ce), J(Ne), (ae.current.prev = [Ce, Ne, tt]);
        }
        if (
          (document.addEventListener("selectionchange", P, { capture: !0 }),
          P(),
          document.activeElement === u && ce(!0),
          !document.getElementById("input-otp-style"))
        ) {
          let b = document.createElement("style");
          if (
            ((b.id = "input-otp-style"), document.head.appendChild(b), b.sheet)
          ) {
            let M =
              "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";
            ee(
              b.sheet,
              "[data-input-otp]::selection { background: transparent !important; color: transparent !important; }"
            ),
              ee(b.sheet, `[data-input-otp]:autofill { ${M} }`),
              ee(b.sheet, `[data-input-otp]:-webkit-autofill { ${M} }`),
              ee(
                b.sheet,
                "@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }"
              ),
              ee(
                b.sheet,
                "[data-input-otp] + * { pointer-events: all !important; }"
              );
          }
        }
        let R = () => {
          c && c.style.setProperty("--root-height", `${u.clientHeight}px`);
        };
        R();
        let T = new ResizeObserver(R);
        return (
          T.observe(u),
          () => {
            document.removeEventListener("selectionchange", P, { capture: !0 }),
              T.disconnect();
          }
        );
      }, []);
    let [xe, be] = a.useState(!1),
      [K, ce] = a.useState(!1),
      [q, Y] = a.useState(null),
      [U, J] = a.useState(null);
    a.useEffect(() => {
      on(() => {
        var u, c, P, R;
        (u = C.current) == null || u.dispatchEvent(new Event("input"));
        let T = (c = C.current) == null ? void 0 : c.selectionStart,
          b = (P = C.current) == null ? void 0 : P.selectionEnd,
          M = (R = C.current) == null ? void 0 : R.selectionDirection;
        T !== null && b !== null && (Y(T), J(b), (ae.current.prev = [T, b, M]));
      });
    }, [j, K]),
      a.useEffect(() => {
        B !== void 0 && j !== B && B.length < i && j.length === i && v?.(j);
      }, [i, v, B, j]);
    let G = pn({
        containerRef: oe,
        inputRef: C,
        pushPasswordManagerStrategy: m,
        isFocused: K,
      }),
      we = a.useCallback(
        (u) => {
          let c = u.currentTarget.value.slice(0, i);
          if (c.length > 0 && L && !L.test(c)) {
            u.preventDefault();
            return;
          }
          typeof B == "string" &&
            c.length < B.length &&
            document.dispatchEvent(new Event("selectionchange")),
            Z(c);
        },
        [i, Z, B, L]
      ),
      ye = a.useCallback(() => {
        var u;
        if (C.current) {
          let c = Math.min(C.current.value.length, i - 1),
            P = C.current.value.length;
          (u = C.current) == null || u.setSelectionRange(c, P), Y(c), J(P);
        }
        ce(!0);
      }, [i]),
      Se = a.useCallback(
        (u) => {
          var c, P;
          let R = C.current;
          if (!h && (!ue.current.isIOS || !u.clipboardData || !R)) return;
          let T = u.clipboardData.getData("text/plain"),
            b = h ? h(T) : T;
          u.preventDefault();
          let M = (c = C.current) == null ? void 0 : c.selectionStart,
            le = (P = C.current) == null ? void 0 : P.selectionEnd,
            k = (
              M !== le
                ? j.slice(0, M) + b + j.slice(le)
                : j.slice(0, M) + b + j.slice(M)
            ).slice(0, i);
          if (k.length > 0 && L && !L.test(k)) return;
          (R.value = k), Z(k);
          let $ = Math.min(k.length, i - 1),
            _ = k.length;
          R.setSelectionRange($, _), Y($), J(_);
        },
        [i, Z, L, j]
      ),
      Je = a.useMemo(
        () => ({
          position: "relative",
          cursor: x.disabled ? "default" : "text",
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: "none",
        }),
        [x.disabled]
      ),
      je = a.useMemo(
        () => ({
          position: "absolute",
          inset: 0,
          width: G.willPushPWMBadge
            ? `calc(100% + ${G.PWM_BADGE_SPACE_WIDTH})`
            : "100%",
          clipPath: G.willPushPWMBadge
            ? `inset(0 ${G.PWM_BADGE_SPACE_WIDTH} 0 0)`
            : void 0,
          height: "100%",
          display: "flex",
          textAlign: d,
          opacity: "1",
          color: "transparent",
          pointerEvents: "all",
          background: "transparent",
          caretColor: "transparent",
          border: "0 solid transparent",
          outline: "0 solid transparent",
          boxShadow: "none",
          lineHeight: "1",
          letterSpacing: "-.5em",
          fontSize: "var(--root-height)",
          fontFamily: "monospace",
          fontVariantNumeric: "tabular-nums",
        }),
        [G.PWM_BADGE_SPACE_WIDTH, G.willPushPWMBadge, d]
      ),
      Xe = a.useMemo(
        () =>
          a.createElement(
            "input",
            ln(an({ autoComplete: x.autoComplete || "one-time-code" }, x), {
              "data-input-otp": !0,
              "data-input-otp-placeholder-shown": j.length === 0 || void 0,
              "data-input-otp-mss": q,
              "data-input-otp-mse": U,
              inputMode: f,
              pattern: L?.source,
              "aria-placeholder": p,
              style: je,
              maxLength: i,
              value: j,
              ref: C,
              onPaste: (u) => {
                var c;
                Se(u), (c = x.onPaste) == null || c.call(x, u);
              },
              onChange: we,
              onMouseOver: (u) => {
                var c;
                be(!0), (c = x.onMouseOver) == null || c.call(x, u);
              },
              onMouseLeave: (u) => {
                var c;
                be(!1), (c = x.onMouseLeave) == null || c.call(x, u);
              },
              onFocus: (u) => {
                var c;
                ye(), (c = x.onFocus) == null || c.call(x, u);
              },
              onBlur: (u) => {
                var c;
                ce(!1), (c = x.onBlur) == null || c.call(x, u);
              },
            })
          ),
        [we, ye, Se, f, je, i, U, q, x, L?.source, j]
      ),
      de = a.useMemo(
        () => ({
          slots: Array.from({ length: i }).map((u, c) => {
            var P;
            let R =
                K &&
                q !== null &&
                U !== null &&
                ((q === U && c === q) || (c >= q && c < U)),
              T = j[c] !== void 0 ? j[c] : null,
              b = j[0] !== void 0 ? null : (P = p?.[c]) != null ? P : null;
            return {
              char: T,
              placeholderChar: b,
              isActive: R,
              hasFakeCaret: R && T === null,
            };
          }),
          isFocused: K,
          isHovering: !x.disabled && xe,
        }),
        [K, xe, i, U, q, x.disabled, j]
      ),
      et = a.useMemo(
        () => (w ? w(de) : a.createElement(Qe.Provider, { value: de }, N)),
        [N, de, w]
      );
    return a.createElement(
      a.Fragment,
      null,
      g !== null &&
        a.createElement("noscript", null, a.createElement("style", null, g)),
      a.createElement(
        "div",
        { ref: oe, "data-input-otp-container": !0, style: Je, className: E },
        et,
        a.createElement(
          "div",
          { style: { position: "absolute", inset: 0, pointerEvents: "none" } },
          Xe
        )
      )
    );
  });
Ze.displayName = "Input";
function ee(e, t) {
  try {
    e.insertRule(t);
  } catch {
    console.error("input-otp could not insert CSS rule:", t);
  }
}
var mn = `
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`;
function hn({ className: e, containerClassName: t, ...n }) {
  return s.jsx(Ze, {
    "data-slot": "input-otp",
    containerClassName: A("flex items-center gap-2 has-disabled:opacity-50", t),
    className: A("disabled:cursor-not-allowed", e),
    ...n,
  });
}
function gn({ className: e, ...t }) {
  return s.jsx("div", {
    "data-slot": "input-otp-group",
    className: A("flex items-center", e),
    ...t,
  });
}
function Q({ index: e, className: t, ...n }) {
  const r = a.useContext(Qe),
    { char: l, hasFakeCaret: i, isActive: d } = r?.slots[e] ?? {};
  return s.jsxs("div", {
    "data-slot": "input-otp-slot",
    "data-active": d,
    className: A(
      "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
      t
    ),
    ...n,
    children: [
      l,
      i &&
        s.jsx("div", {
          className:
            "pointer-events-none absolute inset-0 flex items-center justify-center",
          children: s.jsx("div", {
            className:
              "animate-caret-blink bg-foreground h-4 w-px duration-1000",
          }),
        }),
    ],
  });
}
const vn = { WEB_URL: "http://localhost:3002" };
function xn({ className: e, ...t }) {
  const { data: n, isPending: r } = ft.useSession(),
    l = ut(),
    [i, d] = a.useTransition(),
    [o, p] = Fe("verify-email", _e),
    [f, v] = a.useState(""),
    [m] = Fe("cb", _e.withDefault(vn.WEB_URL));
  a.useEffect(() => {
    n?.user?.id && l({ to: m, replace: !0 });
  }, [n, r]);
  const h = (g) => {
      d(async () => {
        await pt(g[0], { ...g[1], callbackURL: m }, (w) =>
          l({ to: w, replace: !0 })
        )
          .then(() => {
            if ((v(""), g[0] === "otp" && g[1]?.email)) return p(g[1]?.email);
          })
          .catch((w) => {
            Ee.error(w.message || "Something went wrong.");
          });
      });
    },
    E = (g) => {
      g.preventDefault();
      const N = new FormData(g.currentTarget).get("email")?.toString();
      if (!N) return Ee.error("Invalid email: " + N);
      h(["otp", { email: N }]);
    };
  return o
    ? s.jsxs(Re, {
        className: "py-10 relative shadow-none border-0",
        children: [
          i &&
            s.jsx("div", {
              className:
                "absolute h-full w-full m-auto bg-background z-50 flex justify-center items-center",
              children: s.jsx(ht, {}),
            }),
          s.jsxs(Te, {
            className: "text-center",
            children: [
              s.jsx(Ae, {
                className: "text-xl flex items-center justify-center flex-col",
                children: s.jsxs(s.Fragment, {
                  children: [
                    s.jsx(en, { className: "size-16 mb-6" }),
                    s.jsx("span", { children: "Sign-in OTP Sent" }),
                  ],
                }),
              }),
              s.jsxs(ke, {
                className: "max-w-sm px-5",
                children: ["We've sent you an OTP on ", o, "."],
              }),
            ],
          }),
          s.jsxs(Ie, {
            className:
              "flex flex-col items-center justify-center gap-4 space-y-8",
            children: [
              s.jsx(hn, {
                maxLength: 6,
                onComplete: (g) => h(["signin-otp", { email: o, otp: g }]),
                onChange: (g) => v(g),
                value: f,
                children: s.jsxs(gn, {
                  children: [
                    s.jsx(Q, { index: 0 }),
                    s.jsx(Q, { index: 1 }),
                    s.jsx(Q, { index: 2 }),
                    s.jsx(Q, { index: 3 }),
                    s.jsx(Q, { index: 4 }),
                    s.jsx(Q, { index: 5 }),
                  ],
                }),
              }),
              s.jsxs("div", {
                className: "flex gap-4",
                children: [
                  s.jsx(ie, {
                    variant: "outline",
                    size: "lg",
                    onClick: () => p(""),
                    children: s.jsx(Jt, {}),
                  }),
                  s.jsx(ie, {
                    variant: "secondary",
                    size: "lg",
                    onClick: () => h(["otp", { email: o }]),
                    children: "Resend OTP",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    : s.jsxs("div", {
        className:
          "h-svh overflow-hidden flex justify-center items-center xl:grid grid-cols-2",
        children: [
          s.jsx("div", {
            className: "bg-amber-300/50 flex-1 h-full fixed xl:w-2/5 w-full",
          }),
          s.jsx("div", {
            className:
              "fixed xl:left-30 top-14 xl:relative xl:-top-14 xl:flex xl:items-end xl:flex-1 xl:h-full",
            children: s.jsx("img", {
              src: "/assets/paper-bag-items.webp",
              className: "rotate-180 scale-150 xl:scale-140 xl:rotate-0",
              width: 800,
            }),
          }),
          s.jsxs(Re, {
            className:
              "flex w-full max-w-sm flex-col gap-6 mx-auto mt-auto md:m-auto py-8 shadow-none border-0 bg-transparent relative z-10",
            children: [
              s.jsx("div", {
                className: "flex items-center gap-2 self-center font-medium",
              }),
              s.jsxs("div", {
                className: A("flex flex-col gap-6", e),
                ...t,
                children: [
                  s.jsxs("div", {
                    className: "space-y-4",
                    children: [
                      s.jsx("div", {
                        className: "flex justify-center items-center",
                        children: s.jsx(ct, {
                          to: "/",
                          children: s.jsx("img", {
                            src: "/logo/ico.png",
                            alt: "Lipy",
                            width: 75,
                            height: 75,
                            className: "rounded-md",
                          }),
                        }),
                      }),
                      s.jsxs(Te, {
                        className: "text-center",
                        children: [
                          s.jsx(ke, { children: "Log in or Sign up" }),
                          s.jsx(Ae, {
                            className: "text-xl",
                            children: "India's Local Commerce App",
                          }),
                        ],
                      }),
                      s.jsx(Ie, {
                        children: s.jsx("form", {
                          onSubmit: E,
                          children: s.jsxs("div", {
                            className: "grid gap-6",
                            children: [
                              s.jsxs("div", {
                                className: "grid gap-6",
                                children: [
                                  s.jsxs("div", {
                                    className: "grid gap-2",
                                    children: [
                                      s.jsx(_t, {
                                        htmlFor: "email",
                                        className: "sr-only",
                                        children: "Email",
                                      }),
                                      s.jsx(mt, {
                                        id: "email",
                                        name: "email",
                                        type: "email",
                                        placeholder: "Enter your email",
                                        required: !0,
                                        size: "lg",
                                      }),
                                    ],
                                  }),
                                  s.jsx(ie, {
                                    type: "submit",
                                    className: "w-full",
                                    size: "lg",
                                    disabled: i,
                                    children: "Login with Email",
                                  }),
                                ],
                              }),
                              s.jsxs(ie, {
                                variant: "outline",
                                className: "w-full",
                                disabled: i,
                                onClick: () => h(["google"]),
                                size: "lg",
                                children: [
                                  s.jsxs("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    width: "2443",
                                    height: "2500",
                                    preserveAspectRatio: "xMidYMid",
                                    viewBox: "0 0 256 262",
                                    id: "google",
                                    children: [
                                      s.jsx("path", {
                                        fill: "#4285F4",
                                        d: "M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027",
                                      }),
                                      s.jsx("path", {
                                        fill: "#34A853",
                                        d: "M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1",
                                      }),
                                      s.jsx("path", {
                                        fill: "#FBBC05",
                                        d: "M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782",
                                      }),
                                      s.jsx("path", {
                                        fill: "#EB4335",
                                        d: "M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251",
                                      }),
                                    ],
                                  }),
                                  "Login with Google",
                                ],
                              }),
                            ],
                          }),
                        }),
                      }),
                    ],
                  }),
                  s.jsxs("div", {
                    className:
                      "text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ",
                    children: [
                      "By clicking continue, you agree to our",
                      " ",
                      s.jsx("a", { href: "#", children: "Terms of Service" }),
                      " and ",
                      s.jsx("a", { href: "#", children: "Privacy Policy" }),
                      ".",
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
}
const jn = function () {
  return s.jsx(xn, {});
};
export { jn as component };
