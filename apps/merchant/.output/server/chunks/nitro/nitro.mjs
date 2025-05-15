import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { isRedirect, isNotFound, isPlainObject as isPlainObject$1, encode as encode$1 } from '@tanstack/router-core';
import N from 'tiny-invariant';
import { eventHandler as eventHandler$1, toWebRequest, getResponseStatus, getEvent, createStartHandler, defineHandlerCallback, transformReadableStreamWithRouter, transformPipeableStreamWithRouter, getHeaders } from '@tanstack/start-server-core';
import { startSerializer, createServerFn, mergeHeaders as mergeHeaders$2 } from '@tanstack/start-client-core';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createRouter as createRouter$2, createRootRoute, useRouter, useMatch, rootRouteId, ErrorComponent, Link, createFileRoute, RouterProvider, lazyRouteComponent, Outlet, HeadContent, Scripts, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as d$1 from 'react';
import { useRef, useEffect, useMemo, useState, useLayoutEffect, createContext as createContext$1, useContext } from 'react';
import { useTheme } from 'next-themes';
import { toast, Toaster } from 'sonner';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { CircleUser, LogOut, LayoutDashboard, Shirt, ShoppingBag, Users, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { FormProvider, Controller, useFormContext, useFormState } from 'react-hook-form';
import * as ft from '@radix-ui/react-label';
import * as W from '@radix-ui/react-toggle-group';
import { hc } from 'hono/client';
import { create } from 'zustand';
import { PassThrough } from 'node:stream';
import { isbot } from 'isbot';
import P from 'react-dom/server';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function g(...n){return function(...e){for(const t of n)t(...e);}}const m=_$1();let A$2 = class A extends m{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p$1(this.headers)}get trailersDistinct(){return p$1(this.trailers)}}function p$1(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function S$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O$2(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/api/**": {
        "proxy": {
          "to": "http://localhost:8080/api/**",
          "_proxyStripBase": "/api"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","dir":"./public","base":"/","root":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant","order":0,"outDir":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant/.vinxi/build/public"},{"name":"client","type":"client","target":"browser","handler":"src/client.tsx","base":"/_build","build":{"sourcemap":true},"root":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant","outDir":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant/.vinxi/build/client","order":1},{"name":"ssr","type":"http","target":"server","handler":"src/ssr.tsx","link":{"client":"client"},"root":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant","base":"/","outDir":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant/.vinxi/build/ssr","order":2},{"name":"server","type":"http","target":"server","base":"/_server","handler":"../../node_modules/@tanstack/start-server-functions-handler/dist/esm/index.js","root":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant","outDir":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant/.vinxi/build/server","order":3}],"server":{"routeRules":{"/api/**":{"proxy":{"to":"http://localhost:8080/api/**"}}},"preset":"node-server","experimental":{"asyncContext":true}},"root":"/Users/kundanbhosale/Workspace/lipy-commerce/apps/merchant"};
				const buildManifest = {"client":{"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css":{"file":"assets/styles-DBWdZKP1.css","src":"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css"},"__vite-browser-external":{"file":"assets/__vite-browser-external-BIHI7g3E.js","name":"__vite-browser-external","src":"__vite-browser-external","isDynamicEntry":true},"_auth-C8Ws00oz.js":{"file":"assets/auth-C8Ws00oz.js","name":"auth","imports":["_client-CS--nF_Z.js"]},"_button-BVkoCpbb.js":{"file":"assets/button-BVkoCpbb.js","name":"button","imports":["_client-CS--nF_Z.js"]},"_chevron-left-BI6ZavCx.js":{"file":"assets/chevron-left-BI6ZavCx.js","name":"chevron-left","imports":["_client-CS--nF_Z.js"]},"_circle-check-big-D7mxZH7h.js":{"file":"assets/circle-check-big-D7mxZH7h.js","name":"circle-check-big","imports":["_client-CS--nF_Z.js"]},"_client-CS--nF_Z.js":{"file":"assets/client-CS--nF_Z.js","name":"client","dynamicImports":["__vite-browser-external","__vite-browser-external","__vite-browser-external","__vite-browser-external","src/routes/demo/route.tsx?tsr-split=component","src/routes/(loggedIn)/route.tsx?tsr-split=component","src/routes/demo/index.tsx?tsr-split=component","src/routes/(loggedIn)/index.tsx?tsr-split=component","src/routes/demo/tanstackMutation.tsx?tsr-split=component","src/routes/demo/ssr.tsx?tsr-split=component","src/routes/demo/directMutation.tsx?tsr-split=component","src/routes/demo/client.tsx?tsr-split=component","src/routes/(loggedIn)/account/route.tsx?tsr-split=component","src/routes/(loggedIn)/product/index.tsx?tsr-split=component","src/routes/(loggedIn)/order/index.tsx?tsr-split=component","src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","src/routes/(loggedIn)/account/index.tsx?tsr-split=component","src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","src/routes/(loggedIn)/account/security.tsx?tsr-split=component","src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component"],"assets":["assets/styles-DBWdZKP1.css"]},"_elements-Df_upPXC.js":{"file":"assets/elements-Df_upPXC.js","name":"elements","imports":["_client-CS--nF_Z.js"]},"_header-HcI9Ugvr.js":{"file":"assets/header-HcI9Ugvr.js","name":"header","imports":["_client-CS--nF_Z.js","_chevron-left-BI6ZavCx.js"]},"_index-Borkfeb6.js":{"file":"assets/index-Borkfeb6.js","name":"index","imports":["_client-CS--nF_Z.js"]},"_toolbar-DqH-16y4.js":{"file":"assets/toolbar-DqH-16y4.js","name":"toolbar","imports":["_client-CS--nF_Z.js","_index-Borkfeb6.js","_button-BVkoCpbb.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/account/index.tsx?tsr-split=component":{"file":"assets/index-BTNmwIJP.js","name":"index","src":"src/routes/(loggedIn)/account/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_button-BVkoCpbb.js","_index-Borkfeb6.js","_elements-Df_upPXC.js","_auth-C8Ws00oz.js"]},"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component":{"file":"assets/preferences-B2M3yLR5.js","name":"preferences","src":"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/(loggedIn)/account/route.tsx?tsr-split=component":{"file":"assets/route-BP7ek6nE.js","name":"route","src":"src/routes/(loggedIn)/account/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_header-HcI9Ugvr.js","_auth-C8Ws00oz.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/account/security.tsx?tsr-split=component":{"file":"assets/security-B5FXw9rq.js","name":"security","src":"src/routes/(loggedIn)/account/security.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component":{"file":"assets/index-CtbK7L02.js","name":"index","src":"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_toolbar-DqH-16y4.js","_index-Borkfeb6.js","_button-BVkoCpbb.js","_circle-check-big-D7mxZH7h.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/index.tsx?tsr-split=component":{"file":"assets/index-B7OVLpKA.js","name":"index","src":"src/routes/(loggedIn)/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_auth-C8Ws00oz.js"]},"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component":{"file":"assets/_id-DChas2f8.js","name":"_id","src":"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/(loggedIn)/order/index.tsx?tsr-split=component":{"file":"assets/index-CadGx1Yq.js","name":"index","src":"src/routes/(loggedIn)/order/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_toolbar-DqH-16y4.js","_index-Borkfeb6.js","_button-BVkoCpbb.js","_circle-check-big-D7mxZH7h.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component":{"file":"assets/_id-C4QNMmPc.js","name":"_id","src":"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_header-HcI9Ugvr.js","_button-BVkoCpbb.js","_elements-Df_upPXC.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/product/index.tsx?tsr-split=component":{"file":"assets/index-Ce_zJPsh.js","name":"index","src":"src/routes/(loggedIn)/product/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_toolbar-DqH-16y4.js","_index-Borkfeb6.js","_button-BVkoCpbb.js","_header-HcI9Ugvr.js","_chevron-left-BI6ZavCx.js"]},"src/routes/(loggedIn)/route.tsx?tsr-split=component":{"file":"assets/route-BeHSOtVV.js","name":"route","src":"src/routes/(loggedIn)/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/demo/client.tsx?tsr-split=component":{"file":"assets/client-Ad3Bl-aV.js","name":"client","src":"src/routes/demo/client.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/demo/directMutation.tsx?tsr-split=component":{"file":"assets/directMutation-Dwqn60TZ.js","name":"directMutation","src":"src/routes/demo/directMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_button-BVkoCpbb.js"]},"src/routes/demo/index.tsx?tsr-split=component":{"file":"assets/index-Cv_n5Ytr.js","name":"index","src":"src/routes/demo/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/demo/route.tsx?tsr-split=component":{"file":"assets/route-ZmJkRZRC.js","name":"route","src":"src/routes/demo/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_button-BVkoCpbb.js"]},"src/routes/demo/ssr.tsx?tsr-split=component":{"file":"assets/ssr-B_6RlNG_.js","name":"ssr","src":"src/routes/demo/ssr.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js"]},"src/routes/demo/tanstackMutation.tsx?tsr-split=component":{"file":"assets/tanstackMutation-BECU_cWd.js","name":"tanstackMutation","src":"src/routes/demo/tanstackMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-CS--nF_Z.js","_button-BVkoCpbb.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-BrSiXerf.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_client-CS--nF_Z.js"]}},"ssr":{"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css":{"file":"assets/styles-CVTqeXl-.css","src":"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css"},"_auth-B6jfDWT3.js":{"file":"assets/auth-B6jfDWT3.js","name":"auth"},"_command-CQ02zgPh.js":{"file":"assets/command-CQ02zgPh.js","name":"command","imports":["_ssr-BqmlZC_n.js"]},"_elements-zbwpK4yr.js":{"file":"assets/elements-zbwpK4yr.js","name":"elements","imports":["_ssr-BqmlZC_n.js"]},"_header-BLO0shji.js":{"file":"assets/header-BLO0shji.js","name":"header"},"_ssr-BqmlZC_n.js":{"file":"assets/ssr-BqmlZC_n.js","name":"ssr","dynamicImports":["src/routes/demo/route.tsx?tsr-split=component","src/routes/(loggedIn)/route.tsx?tsr-split=component","src/routes/demo/index.tsx?tsr-split=component","src/routes/(loggedIn)/index.tsx?tsr-split=component","src/routes/demo/tanstackMutation.tsx?tsr-split=component","src/routes/demo/ssr.tsx?tsr-split=component","src/routes/demo/directMutation.tsx?tsr-split=component","src/routes/demo/client.tsx?tsr-split=component","src/routes/(loggedIn)/account/route.tsx?tsr-split=component","src/routes/(loggedIn)/product/index.tsx?tsr-split=component","src/routes/(loggedIn)/order/index.tsx?tsr-split=component","src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","src/routes/(loggedIn)/account/index.tsx?tsr-split=component","src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","src/routes/(loggedIn)/account/security.tsx?tsr-split=component","src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component"],"assets":["assets/styles-CVTqeXl-.css"]},"_toolbar-LI1VD9lb.js":{"file":"assets/toolbar-LI1VD9lb.js","name":"toolbar","imports":["_ssr-BqmlZC_n.js","_command-CQ02zgPh.js"]},"src/routes/(loggedIn)/account/index.tsx?tsr-split=component":{"file":"assets/index-Dtjm6aUO.js","name":"index","src":"src/routes/(loggedIn)/account/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js","_command-CQ02zgPh.js","_elements-zbwpK4yr.js","_auth-B6jfDWT3.js"]},"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component":{"file":"assets/preferences-Bhbb1RkI.js","name":"preferences","src":"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/account/route.tsx?tsr-split=component":{"file":"assets/route-CvA7j1li.js","name":"route","src":"src/routes/(loggedIn)/account/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js","_header-BLO0shji.js","_auth-B6jfDWT3.js"]},"src/routes/(loggedIn)/account/security.tsx?tsr-split=component":{"file":"assets/security-C88tcS1A.js","name":"security","src":"src/routes/(loggedIn)/account/security.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component":{"file":"assets/index-Csy94vHr.js","name":"index","src":"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-LI1VD9lb.js","_command-CQ02zgPh.js","_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/index.tsx?tsr-split=component":{"file":"assets/index-Djmzg6D0.js","name":"index","src":"src/routes/(loggedIn)/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_auth-B6jfDWT3.js","_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component":{"file":"assets/_id-Cp4YCZMB.js","name":"_id","src":"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/order/index.tsx?tsr-split=component":{"file":"assets/index-n0vjYd9Z.js","name":"index","src":"src/routes/(loggedIn)/order/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-LI1VD9lb.js","_command-CQ02zgPh.js","_ssr-BqmlZC_n.js"]},"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component":{"file":"assets/_id-BaI84S1X.js","name":"_id","src":"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_header-BLO0shji.js","_ssr-BqmlZC_n.js","_elements-zbwpK4yr.js"]},"src/routes/(loggedIn)/product/index.tsx?tsr-split=component":{"file":"assets/index-BpQWohYJ.js","name":"index","src":"src/routes/(loggedIn)/product/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-LI1VD9lb.js","_command-CQ02zgPh.js","_ssr-BqmlZC_n.js","_header-BLO0shji.js"]},"src/routes/(loggedIn)/route.tsx?tsr-split=component":{"file":"assets/route-MyxkcAl5.js","name":"route","src":"src/routes/(loggedIn)/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/client.tsx?tsr-split=component":{"file":"assets/client-CcY3BGAv.js","name":"client","src":"src/routes/demo/client.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/directMutation.tsx?tsr-split=component":{"file":"assets/directMutation-glW5MKvl.js","name":"directMutation","src":"src/routes/demo/directMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/index.tsx?tsr-split=component":{"file":"assets/index-CG-3uRCd.js","name":"index","src":"src/routes/demo/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/route.tsx?tsr-split=component":{"file":"assets/route-D60eqUvZ.js","name":"route","src":"src/routes/demo/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/ssr.tsx?tsr-split=component":{"file":"assets/ssr-DYvoj1I0.js","name":"ssr","src":"src/routes/demo/ssr.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"src/routes/demo/tanstackMutation.tsx?tsr-split=component":{"file":"assets/tanstackMutation-DBj1oGBS.js","name":"tanstackMutation","src":"src/routes/demo/tanstackMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BqmlZC_n.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_ssr-BqmlZC_n.js"]}},"server":{"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css":{"file":"assets/styles-CVTqeXl-.css","src":"/Users/kundanbhosale/Workspace/lipy-commerce/packages/web-ui/src/styles.css"},"___root-c1z-tJeJ.js":{"file":"assets/__root-c1z-tJeJ.js","name":"__root","isDynamicEntry":true,"imports":["_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"],"dynamicImports":["src/routes/demo/route.tsx?tsr-split=component","src/routes/demo/index.tsx?tsr-split=component","src/routes/(loggedIn)/index.tsx?tsr-split=component","src/routes/demo/tanstackMutation.tsx?tsr-split=component","src/routes/demo/directMutation.tsx?tsr-split=component","src/routes/demo/client.tsx?tsr-split=component","src/routes/(loggedIn)/account/route.tsx?tsr-split=component","src/routes/(loggedIn)/product/index.tsx?tsr-split=component","src/routes/(loggedIn)/order/index.tsx?tsr-split=component","src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","src/routes/(loggedIn)/account/index.tsx?tsr-split=component","src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","src/routes/(loggedIn)/account/security.tsx?tsr-split=component","src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component"],"assets":["assets/styles-CVTqeXl-.css"]},"_auth-B6jfDWT3.js":{"file":"assets/auth-B6jfDWT3.js","name":"auth"},"_command-ZM_C4Mte.js":{"file":"assets/command-ZM_C4Mte.js","name":"command","imports":["_utils-AmjEIG6k.js"]},"_elements-rb420Da1.js":{"file":"assets/elements-rb420Da1.js","name":"elements","imports":["_utils-AmjEIG6k.js","___root-c1z-tJeJ.js"]},"_env.client-C8a22DZi.js":{"file":"assets/env.client-C8a22DZi.js","name":"env.client"},"_header-BLO0shji.js":{"file":"assets/header-BLO0shji.js","name":"header"},"_index-B59P37Kz.js":{"file":"assets/index-B59P37Kz.js","name":"index","imports":["_env.client-C8a22DZi.js"]},"_ssr-D__m4IYf.js":{"file":"assets/ssr-D__m4IYf.js","name":"ssr","imports":["_index-B59P37Kz.js","_env.client-C8a22DZi.js"],"dynamicImports":["src/routes/demo/ssr.tsx?tsr-split=component"]},"_toolbar-Ba_C33pH.js":{"file":"assets/toolbar-Ba_C33pH.js","name":"toolbar","imports":["_utils-AmjEIG6k.js","___root-c1z-tJeJ.js","_command-ZM_C4Mte.js"]},"_utils-AmjEIG6k.js":{"file":"assets/utils-AmjEIG6k.js","name":"utils","imports":["_env.client-C8a22DZi.js","_auth-B6jfDWT3.js"],"dynamicImports":["src/routes/(loggedIn)/route.tsx?tsr-split=component"]},"src/routes/(loggedIn)/account/index.tsx?tsr-split=component":{"file":"assets/index-CDi11KiC.js","name":"index","src":"src/routes/(loggedIn)/account/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_command-ZM_C4Mte.js","_elements-rb420Da1.js","_auth-B6jfDWT3.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component":{"file":"assets/preferences-DJzhBtgJ.js","name":"preferences","src":"src/routes/(loggedIn)/account/preferences.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/account/route.tsx?tsr-split=component":{"file":"assets/route-JSW8dtpQ.js","name":"route","src":"src/routes/(loggedIn)/account/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_header-BLO0shji.js","_utils-AmjEIG6k.js","_auth-B6jfDWT3.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/account/security.tsx?tsr-split=component":{"file":"assets/security-CQwzNMA2.js","name":"security","src":"src/routes/(loggedIn)/account/security.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component":{"file":"assets/index-DLsj-PwV.js","name":"index","src":"src/routes/(loggedIn)/customer/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-Ba_C33pH.js","_command-ZM_C4Mte.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/index.tsx?tsr-split=component":{"file":"assets/index-DxM6uBWT.js","name":"index","src":"src/routes/(loggedIn)/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_auth-B6jfDWT3.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component":{"file":"assets/_id-BbLjbhiN.js","name":"_id","src":"src/routes/(loggedIn)/order/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_index-B59P37Kz.js","___root-c1z-tJeJ.js","_env.client-C8a22DZi.js","_utils-AmjEIG6k.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js"]},"src/routes/(loggedIn)/order/index.tsx?tsr-split=component":{"file":"assets/index-zCcLm7u1.js","name":"index","src":"src/routes/(loggedIn)/order/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-Ba_C33pH.js","_command-ZM_C4Mte.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component":{"file":"assets/_id-DKQ_sZBJ.js","name":"_id","src":"src/routes/(loggedIn)/product/$id.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_header-BLO0shji.js","_utils-AmjEIG6k.js","___root-c1z-tJeJ.js","_elements-rb420Da1.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/(loggedIn)/product/index.tsx?tsr-split=component":{"file":"assets/index-3CB32_Bc.js","name":"index","src":"src/routes/(loggedIn)/product/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_toolbar-Ba_C33pH.js","_command-ZM_C4Mte.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_header-BLO0shji.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js","_auth-B6jfDWT3.js"]},"src/routes/(loggedIn)/route.tsx?tsr-directive-use-server=":{"file":"assets/route-CphqYTwG.js","name":"route","src":"src/routes/(loggedIn)/route.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_env.client-C8a22DZi.js","_auth-B6jfDWT3.js"],"dynamicImports":["src/routes/(loggedIn)/route.tsx?tsr-split=component"]},"src/routes/(loggedIn)/route.tsx?tsr-split=component":{"file":"assets/route-CDnCkcpW.js","name":"route","src":"src/routes/(loggedIn)/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js"]},"src/routes/demo/client.tsx?tsr-split=component":{"file":"assets/client-CR7jToz7.js","name":"client","src":"src/routes/demo/client.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_index-B59P37Kz.js","___root-c1z-tJeJ.js","_env.client-C8a22DZi.js","_utils-AmjEIG6k.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js"]},"src/routes/demo/directMutation.tsx?tsr-split=component":{"file":"assets/directMutation-CvUtRMbn.js","name":"directMutation","src":"src/routes/demo/directMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_index-B59P37Kz.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_auth-B6jfDWT3.js"]},"src/routes/demo/index.tsx?tsr-split=component":{"file":"assets/index-CTDj_ZVa.js","name":"index","src":"src/routes/demo/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/demo/route.tsx?tsr-split=component":{"file":"assets/route-BvNefoVd.js","name":"route","src":"src/routes/demo/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_auth-B6jfDWT3.js","_ssr-D__m4IYf.js","_index-B59P37Kz.js"]},"src/routes/demo/ssr.tsx?tsr-directive-use-server=":{"file":"assets/ssr-COMkKvGN.js","name":"ssr","src":"src/routes/demo/ssr.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-B59P37Kz.js","_env.client-C8a22DZi.js"],"dynamicImports":["src/routes/demo/ssr.tsx?tsr-split=component"]},"src/routes/demo/ssr.tsx?tsr-split=component":{"file":"assets/ssr-BPo15qi4.js","name":"ssr","src":"src/routes/demo/ssr.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-D__m4IYf.js","_index-B59P37Kz.js","_env.client-C8a22DZi.js"]},"src/routes/demo/tanstackMutation.tsx?tsr-split=component":{"file":"assets/tanstackMutation-Y6lcYuaZ.js","name":"tanstackMutation","src":"src/routes/demo/tanstackMutation.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_index-B59P37Kz.js","___root-c1z-tJeJ.js","_utils-AmjEIG6k.js","_env.client-C8a22DZi.js","_ssr-D__m4IYf.js","_auth-B6jfDWT3.js"]},"virtual:$vinxi/handler/server":{"file":"server.js","name":"server","src":"virtual:$vinxi/handler/server","isEntry":true,"dynamicImports":["___root-c1z-tJeJ.js","src/routes/(loggedIn)/route.tsx?tsr-directive-use-server=","src/routes/demo/ssr.tsx?tsr-directive-use-server="]}}};

				const routeManifest = {};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"43-BEzmj4PuhUNHX+oW9uOnPSihxtU\"",
    "mtime": "2025-05-15T12:16:48.308Z",
    "size": 67,
    "path": "../public/robots.txt"
  },
  "/favicon/apple-touch-icon.png": {
    "type": "image/png",
    "etag": "\"62f-5ZinJZRMQuFcuf+mFGXuSEbYldU\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 1583,
    "path": "../public/favicon/apple-touch-icon.png"
  },
  "/favicon/favicon-16x16.png": {
    "type": "image/png",
    "etag": "\"71-9fISiJ66a/u+KG0NbGCoO4TSacI\"",
    "mtime": "2025-05-15T12:16:48.306Z",
    "size": 113,
    "path": "../public/favicon/favicon-16x16.png"
  },
  "/favicon/favicon-32x32.png": {
    "type": "image/png",
    "etag": "\"ab-eUZYSlMxQFj2PlueMhECPvgOh6w\"",
    "mtime": "2025-05-15T12:16:48.306Z",
    "size": 171,
    "path": "../public/favicon/favicon-32x32.png"
  },
  "/favicon/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"374-boheuYRmIpwnIcaTVhPCHxefFkQ\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 884,
    "path": "../public/favicon/favicon.ico"
  },
  "/favicon/pwa-192x192.png": {
    "type": "image/png",
    "etag": "\"656-6hO6vOf+/oMXrI/O7rysizsoMiA\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 1622,
    "path": "../public/favicon/pwa-192x192.png"
  },
  "/favicon/pwa-512x512.png": {
    "type": "image/png",
    "etag": "\"1b47-Zb12Mhi9A9qzh5/BwnPZX+mFnSg\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 6983,
    "path": "../public/favicon/pwa-512x512.png"
  },
  "/favicon/pwa-maskable-192x192.png": {
    "type": "image/png",
    "etag": "\"4a3-xi0067Sekt6lSAu00hRaVLmrUNw\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 1187,
    "path": "../public/favicon/pwa-maskable-192x192.png"
  },
  "/favicon/pwa-maskable-512x512.png": {
    "type": "image/png",
    "etag": "\"1596-elKa66nyxM+EC9VcsHODGM5iI+w\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 5526,
    "path": "../public/favicon/pwa-maskable-512x512.png"
  },
  "/favicon/site.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"2ab-/PaSfYPisCleVkIV07AyzafAvfA\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 683,
    "path": "../public/favicon/site.webmanifest"
  },
  "/assets/paper-bag-items.webp": {
    "type": "image/webp",
    "etag": "\"39d74-5UIRG0moMMMQWSESiMMgwjHo85s\"",
    "mtime": "2025-05-15T12:16:48.306Z",
    "size": 236916,
    "path": "../public/assets/paper-bag-items.webp"
  },
  "/assets/styles-CVTqeXl-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12b2e-P+epk3zc34XSsSJiXgt3G3VbHGA\"",
    "mtime": "2025-05-15T12:16:48.325Z",
    "size": 76590,
    "path": "../public/assets/styles-CVTqeXl-.css"
  },
  "/logo/ico-white.png": {
    "type": "image/png",
    "etag": "\"872-bh1wtYIULmIpybASeCVd0L1iP4g\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 2162,
    "path": "../public/logo/ico-white.png"
  },
  "/logo/ico-white.svg": {
    "type": "image/svg+xml",
    "etag": "\"816-5feM1c4sUfrbkB8+YCOppq9A28E\"",
    "mtime": "2025-05-15T12:16:48.306Z",
    "size": 2070,
    "path": "../public/logo/ico-white.svg"
  },
  "/logo/ico.png": {
    "type": "image/png",
    "etag": "\"872-GbL+btbqzhkou2taNk0KrCXmix8\"",
    "mtime": "2025-05-15T12:16:48.307Z",
    "size": 2162,
    "path": "../public/logo/ico.png"
  },
  "/logo/ico.svg": {
    "type": "image/svg+xml",
    "etag": "\"816-6OyJN3LpTgVgCqf6EHrZncGmoZk\"",
    "mtime": "2025-05-15T12:16:48.308Z",
    "size": 2070,
    "path": "../public/logo/ico.svg"
  },
  "/logo/logo-white.png": {
    "type": "image/png",
    "etag": "\"100e-hbDHEU4igK/lPyW3ugZgdN4Hie4\"",
    "mtime": "2025-05-15T12:16:48.308Z",
    "size": 4110,
    "path": "../public/logo/logo-white.png"
  },
  "/logo/logo.png": {
    "type": "image/png",
    "etag": "\"102f-CCx3zGknx5WpsRjAcjGwNPZQ4v8\"",
    "mtime": "2025-05-15T12:16:48.308Z",
    "size": 4143,
    "path": "../public/logo/logo.png"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "etag": "\"2364-m6bftnO7yIPigWqrfAtMo5o5iRE\"",
    "mtime": "2025-05-15T12:16:48.314Z",
    "size": 9060,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/_server/assets/styles-CVTqeXl-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12b2e-P+epk3zc34XSsSJiXgt3G3VbHGA\"",
    "mtime": "2025-05-15T12:16:48.331Z",
    "size": 76590,
    "path": "../public/_server/assets/styles-CVTqeXl-.css"
  },
  "/_build/assets/__vite-browser-external-BIHI7g3E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"21-TnSDqNzuAbz1l2Zfx/fW4jY7tlk\"",
    "mtime": "2025-05-15T12:16:48.314Z",
    "size": 33,
    "path": "../public/_build/assets/__vite-browser-external-BIHI7g3E.js"
  },
  "/_build/assets/_id-C4QNMmPc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e48-s4qUe64a8tNelKPJd/12NyRqu80\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 3656,
    "path": "../public/_build/assets/_id-C4QNMmPc.js"
  },
  "/_build/assets/_id-DChas2f8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cb-iw2wP9Csfufq08hN7wUtUBXqV/g\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 203,
    "path": "../public/_build/assets/_id-DChas2f8.js"
  },
  "/_build/assets/auth-C8Ws00oz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4c30-rSng4qixxwH0BNX5nGH0vaJItUs\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 19504,
    "path": "../public/_build/assets/auth-C8Ws00oz.js"
  },
  "/_build/assets/button-BVkoCpbb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"61a-e3a7xv8mmf1P8929tL9UnMaEz/o\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 1562,
    "path": "../public/_build/assets/button-BVkoCpbb.js"
  },
  "/_build/assets/chevron-left-BI6ZavCx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"130-wRwlH/kmmLIiy/UgvqylOdCXCVo\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 304,
    "path": "../public/_build/assets/chevron-left-BI6ZavCx.js"
  },
  "/_build/assets/circle-check-big-D7mxZH7h.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16b-DZwzknHvy7tIzHWGj4acaJlPpTg\"",
    "mtime": "2025-05-15T12:16:48.314Z",
    "size": 363,
    "path": "../public/_build/assets/circle-check-big-D7mxZH7h.js"
  },
  "/_build/assets/client-Ad3Bl-aV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"dd-W9HhDPtUyJgZirnCvc/2J8rEO1U\"",
    "mtime": "2025-05-15T12:16:48.314Z",
    "size": 221,
    "path": "../public/_build/assets/client-Ad3Bl-aV.js"
  },
  "/_build/assets/client-BrSiXerf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"40-Sc35I+lCDJDp/MzeiD2I9dOcT/Q\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 64,
    "path": "../public/_build/assets/client-BrSiXerf.js"
  },
  "/_build/assets/client-CS--nF_Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6e6b9-hiA/zTv+Lg1WSMC8VTh1vNw3oww\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 452281,
    "path": "../public/_build/assets/client-CS--nF_Z.js"
  },
  "/_build/assets/directMutation-Dwqn60TZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"217-6BgcsRwaeAH4LMer3Xv2uYpS32s\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 535,
    "path": "../public/_build/assets/directMutation-Dwqn60TZ.js"
  },
  "/_build/assets/elements-Df_upPXC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5bb-rOOiEh4WoUq3DPfWPps/1WQX+HE\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 1467,
    "path": "../public/_build/assets/elements-Df_upPXC.js"
  },
  "/_build/assets/header-HcI9Ugvr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2dd-6Hrs3whBZTNiAfOVZDEOZ2fF8q8\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 733,
    "path": "../public/_build/assets/header-HcI9Ugvr.js"
  },
  "/_build/assets/index-B7OVLpKA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12b-cOkh70fV7zsEwY3zb7Wlhc62/2A\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 299,
    "path": "../public/_build/assets/index-B7OVLpKA.js"
  },
  "/_build/assets/index-BTNmwIJP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42d96-EXoofxp57Mb4mfVlj6Rk1ymJ+OQ\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 273814,
    "path": "../public/_build/assets/index-BTNmwIJP.js"
  },
  "/_build/assets/index-Borkfeb6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28898-w166C5GTrfX4UGmLdVE7xmyNcDQ\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 166040,
    "path": "../public/_build/assets/index-Borkfeb6.js"
  },
  "/_build/assets/index-CadGx1Yq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c26-4B5DZ16+PcMtdDDllxCejHLool0\"",
    "mtime": "2025-05-15T12:16:48.315Z",
    "size": 3110,
    "path": "../public/_build/assets/index-CadGx1Yq.js"
  },
  "/_build/assets/index-Ce_zJPsh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c44-0ep2iFyKn5juXIj9G8Mr+mp7ZOc\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 3140,
    "path": "../public/_build/assets/index-Ce_zJPsh.js"
  },
  "/_build/assets/index-CtbK7L02.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c26-4B5DZ16+PcMtdDDllxCejHLool0\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 3110,
    "path": "../public/_build/assets/index-CtbK7L02.js"
  },
  "/_build/assets/index-Cv_n5Ytr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"55-/NXXJxtEikyld89waz8+WSyG3tc\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 85,
    "path": "../public/_build/assets/index-Cv_n5Ytr.js"
  },
  "/_build/assets/preferences-B2M3yLR5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"82-x9TtzzYbriBmrQ2M030znUcVZWE\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 130,
    "path": "../public/_build/assets/preferences-B2M3yLR5.js"
  },
  "/_build/assets/route-BP7ek6nE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16f-O3kkri2AoFfKkXwL39ibsKR/wJo\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 367,
    "path": "../public/_build/assets/route-BP7ek6nE.js"
  },
  "/_build/assets/route-BeHSOtVV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1bc6d-JxqckQvurt5pwGIKdxwG04SHXeI\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 113773,
    "path": "../public/_build/assets/route-BeHSOtVV.js"
  },
  "/_build/assets/route-ZmJkRZRC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33f-a4uCIIFgMRQeYwqgvi/wtrd0GIM\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 831,
    "path": "../public/_build/assets/route-ZmJkRZRC.js"
  },
  "/_build/assets/security-B5FXw9rq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7f-TxB407mtpvngfvLUx3HnIUK5Yxw\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 127,
    "path": "../public/_build/assets/security-B5FXw9rq.js"
  },
  "/_build/assets/ssr-B_6RlNG_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"105-bjAh5kJ0rtsM5rBi/+YHLg73DJ4\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 261,
    "path": "../public/_build/assets/ssr-B_6RlNG_.js"
  },
  "/_build/assets/styles-DBWdZKP1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"104e1-JX71YZ8A9Qz/xeCXTXVpkxIovkk\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 66785,
    "path": "../public/_build/assets/styles-DBWdZKP1.css"
  },
  "/_build/assets/tanstackMutation-BECU_cWd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"233-uoGYVCzcGw2d80UCo0Fc52sYkA4\"",
    "mtime": "2025-05-15T12:16:48.316Z",
    "size": 563,
    "path": "../public/_build/assets/tanstackMutation-BECU_cWd.js"
  },
  "/_build/assets/toolbar-DqH-16y4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a2eb-sMJQ1dCaaqggdFBMENOHqpo6Ifw\"",
    "mtime": "2025-05-15T12:16:48.317Z",
    "size": 172779,
    "path": "../public/_build/assets/toolbar-DqH-16y4.js"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _mq1PUh = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const O$1 = { "src_routes_root_tsx--isMobile_createServerFn_handler": { functionName: "isMobile_createServerFn_handler", importer: () => import('../build/__root-c1z-tJeJ.mjs').then((r) => r._) }, "src_routes_loggedIn_route_tsx--authFn_createServerFn_handler": { functionName: "authFn_createServerFn_handler", importer: () => import('../build/route-CphqYTwG.mjs') }, "src_routes_demo_ssr_tsx--authFn_createServerFn_handler": { functionName: "authFn_createServerFn_handler", importer: () => import('../build/ssr-COMkKvGN.mjs') } }, q$1 = eventHandler$1(D$1), d = O$1;
async function D$1(r) {
  const t = toWebRequest(r);
  return await A$1({ request: t, event: r });
}
function L(r) {
  return r.replace(/^\/|\/$/g, "");
}
async function A$1({ request: r, event: t }) {
  const s = new AbortController(), i = s.signal, v = () => s.abort();
  t.node.req.on("close", v);
  const w = r.method, _ = new URL(r.url, "http://localhost:3000"), C = new RegExp(`${L("/_server")}/([^/?#]+)`), F = _.pathname.match(C), o = F ? F[1] : null, c = Object.fromEntries(_.searchParams.entries()), m = "createServerFn" in c, E = "raw" in c;
  if (typeof o != "string") throw new Error("Invalid server action param for serverFnId: " + o);
  const h = d[o];
  if (!h) throw console.log("serverFnManifest", d), new Error("Server function info not found for " + o);
  let l;
  if (l = await h.importer(), !l) throw console.log("serverFnManifest", d), new Error("Server function module not resolved for " + o);
  const a = l[h.functionName];
  if (!a) throw console.log("serverFnManifest", d), console.log("fnModule", l), new Error(`Server function module export not resolved for serverFn ID: ${o}`);
  const M = ["multipart/form-data", "application/x-www-form-urlencoded"], f = await (async () => {
    try {
      let e = await (async () => {
        if (r.headers.get("Content-Type") && M.some((n) => {
          var y;
          return (y = r.headers.get("Content-Type")) == null ? void 0 : y.includes(n);
        })) return N(w.toLowerCase() !== "get", "GET requests with FormData payloads are not supported"), await a(await r.formData(), i);
        if (w.toLowerCase() === "get") {
          let n = c;
          return m && (n = c.payload), n = n && startSerializer.parse(n), await a(n, i);
        }
        const u = await r.text(), g = startSerializer.parse(u);
        return m ? await a(g, i) : await a(...g, i);
      })();
      return e.result instanceof Response ? e.result : !m && (e = e.result, e instanceof Response) ? e : isRedirect(e) || isNotFound(e) ? x(e) : new Response(e !== void 0 ? startSerializer.stringify(e) : void 0, { status: getResponseStatus(getEvent()), headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return e instanceof Response ? e : isRedirect(e) || isNotFound(e) ? x(e) : (console.info(), console.info("Server Fn Error!"), console.info(), console.error(e), console.info(), new Response(startSerializer.stringify(e), { status: 500, headers: { "Content-Type": "application/json" } }));
    }
  })();
  if (t.node.req.removeListener("close", v), E) return f;
  if (f.headers.get("Content-Type") === "application/json") {
    const u = await f.clone().text();
    u && JSON.stringify(JSON.parse(u));
  }
  return f;
}
function x(r) {
  const { headers: t, ...s } = r;
  return new Response(JSON.stringify(s), { status: 200, headers: { "Content-Type": "application/json", ...t || {} } });
}

function c(e,u,c){var i=this,a=useRef(null),o=useRef(0),f=useRef(null),l=useRef([]),v=useRef(),m=useRef(),d=useRef(e),g=useRef(true);d.current=e;var p="undefined"!="undefined",w=!u&&0!==u&&p;if("function"!=typeof e)throw new TypeError("Expected a function");u=+u||0;var s=!!(c=c||{}).leading,x=!("trailing"in c)||!!c.trailing,h="maxWait"in c,y="debounceOnServer"in c&&!!c.debounceOnServer,F=h?Math.max(+c.maxWait||0,u):null;useEffect(function(){return g.current=true,function(){g.current=false;}},[]);var A=useMemo(function(){var r=function(r){var n=l.current,t=v.current;return l.current=v.current=null,o.current=r,m.current=d.current.apply(t,n)},n=function(r,n){w&&cancelAnimationFrame(f.current),f.current=w?requestAnimationFrame(r):setTimeout(r,n);},t=function(r){if(!g.current)return  false;var n=r-a.current;return !a.current||n>=u||n<0||h&&r-o.current>=F},e=function(n){return f.current=null,x&&l.current?r(n):(l.current=v.current=null,m.current)},c=function r(){var c=Date.now();if(t(c))return e(c);if(g.current){var i=u-(c-a.current),f=h?Math.min(i,F-(c-o.current)):i;n(r,f);}},A=function(){if(y){var e=Date.now(),d=t(e);if(l.current=[].slice.call(arguments),v.current=i,a.current=e,d){if(!f.current&&g.current)return o.current=a.current,n(c,u),s?r(a.current):m.current;if(h)return n(c,u),r(a.current)}return f.current||n(c,u),m.current}};return A.cancel=function(){f.current&&(w?cancelAnimationFrame(f.current):clearTimeout(f.current)),o.current=0,l.current=a.current=v.current=f.current=null;},A.isPending=function(){return !!f.current},A.flush=function(){return f.current?e(Date.now()):m.current},A},[s,h,u,F,x,w,p,y]);return A}

function A(e) {
  return jsx(RouterProvider, { router: e.router });
}
const vt = defineHandlerCallback(async ({ request: e, router: o, responseHeaders: t }) => {
  if (typeof P.renderToReadableStream == "function") {
    const n = await P.renderToReadableStream(jsx(A, { router: o }), { signal: e.signal });
    isbot(e.headers.get("User-Agent")) && await n.allReady;
    const a = transformReadableStreamWithRouter(o, n);
    return new Response(a, { status: o.state.statusCode, headers: t });
  }
  if (typeof P.renderToPipeableStream == "function") {
    const n = new PassThrough();
    try {
      const r = P.renderToPipeableStream(jsx(A, { router: o }), { ...isbot(e.headers.get("User-Agent")) ? { onAllReady() {
        r.pipe(n);
      } } : { onShellReady() {
        r.pipe(n);
      } }, onError: (c, i) => {
        console.error("Error in renderToPipeableStream:", c, i);
      } });
    } catch (r) {
      console.error("Error in renderToPipeableStream:", r);
    }
    const a = transformPipeableStreamWithRouter(o, n);
    return new Response(a, { status: o.state.statusCode, headers: t });
  }
  throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
}), wt = () => ({ routes: { __root__: { filePath: "__root.tsx", children: ["/(loggedIn)", "/demo"], preloads: ["/_build/assets/client-BrSiXerf.js", "/_build/assets/client-CS--nF_Z.js"] }, "/(loggedIn)": { filePath: "(loggedIn)/route.tsx", children: ["/(loggedIn)/account", "/(loggedIn)/", "/(loggedIn)/order/$id", "/(loggedIn)/product/$id", "/(loggedIn)/customer/", "/(loggedIn)/order/", "/(loggedIn)/product/"] }, "/demo": { filePath: "demo/route.tsx", children: ["/demo/client", "/demo/directMutation", "/demo/ssr", "/demo/tanstackMutation", "/demo/"] }, "/(loggedIn)/account": { filePath: "(loggedIn)/account/route.tsx", parent: "/(loggedIn)", children: ["/(loggedIn)/account/preferences", "/(loggedIn)/account/security", "/(loggedIn)/account/"] }, "/demo/client": { filePath: "demo/client.tsx", parent: "/demo" }, "/demo/directMutation": { filePath: "demo/directMutation.tsx", parent: "/demo" }, "/demo/ssr": { filePath: "demo/ssr.tsx", parent: "/demo" }, "/demo/tanstackMutation": { filePath: "demo/tanstackMutation.tsx", parent: "/demo" }, "/(loggedIn)/": { filePath: "(loggedIn)/index.tsx", parent: "/(loggedIn)" }, "/demo/": { filePath: "demo/index.tsx", parent: "/demo" }, "/(loggedIn)/account/preferences": { filePath: "(loggedIn)/account/preferences.tsx", parent: "/(loggedIn)/account" }, "/(loggedIn)/account/security": { filePath: "(loggedIn)/account/security.tsx", parent: "/(loggedIn)/account" }, "/(loggedIn)/order/$id": { filePath: "(loggedIn)/order/$id.tsx", parent: "/(loggedIn)" }, "/(loggedIn)/product/$id": { filePath: "(loggedIn)/product/$id.tsx", parent: "/(loggedIn)" }, "/(loggedIn)/account/": { filePath: "(loggedIn)/account/index.tsx", parent: "/(loggedIn)/account" }, "/(loggedIn)/customer/": { filePath: "(loggedIn)/customer/index.tsx", parent: "/(loggedIn)" }, "/(loggedIn)/order/": { filePath: "(loggedIn)/order/index.tsx", parent: "/(loggedIn)" }, "/(loggedIn)/product/": { filePath: "(loggedIn)/product/index.tsx", parent: "/(loggedIn)" } } });
function Rt(e) {
  return globalThis.MANIFEST[e];
}
function It() {
  var _a;
  const e = wt(), o = e.routes.__root__ = e.routes.__root__ || {};
  o.assets = o.assets || [];
  let t = "";
  const n = Rt("client"), a = (_a = n.inputs[n.handler]) == null ? void 0 : _a.output.path;
  return a || N(a, "Could not find client entry in vinxi manifest"), o.assets.push({ tag: "script", attrs: { type: "module", suppressHydrationWarning: true, async: true }, children: `${t}import("${a}")` }), e;
}
function $t() {
  const e = It();
  return { ...e, routes: Object.fromEntries(Object.entries(e.routes).map(([o, t]) => {
    const { preloads: n, assets: a } = t;
    return [o, { preloads: n, assets: a }];
  })) };
}
async function Ct(e, o, t) {
  var n;
  const a = o[0];
  if (isPlainObject$1(a) && a.method) {
    const i = a, d = i.data instanceof FormData ? "formData" : "payload", b = new Headers({ ...d === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...i.headers instanceof Headers ? Object.fromEntries(i.headers.entries()) : i.headers });
    if (i.method === "GET") {
      const l = encode$1({ payload: startSerializer.stringify({ data: i.data, context: i.context }) });
      l && (e.includes("?") ? e += `&${l}` : e += `?${l}`);
    }
    e.includes("?") ? e += "&createServerFn" : e += "?createServerFn", i.response === "raw" && (e += "&raw");
    const C = await t(e, { method: i.method, headers: b, signal: i.signal, ...Pt(i) }), x = await z(C);
    if ((n = x.headers.get("content-type")) != null && n.includes("application/json")) {
      const l = startSerializer.decode(await x.json());
      if (isRedirect(l) || isNotFound(l) || l instanceof Error) throw l;
      return l;
    }
    return x;
  }
  const r = await z(await t(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(o) })), c = r.headers.get("content-type");
  return c && c.includes("application/json") ? startSerializer.decode(await r.json()) : r.text();
}
function Pt(e) {
  var _a;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", startSerializer.stringify(e.context)), { body: e.data }) : { body: startSerializer.stringify({ data: (_a = e.data) != null ? _a : null, context: e.context }) } : {};
}
async function z(e) {
  if (!e.ok) {
    const o = e.headers.get("content-type");
    throw o && o.includes("application/json") ? startSerializer.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
function _t(e) {
  return e.replace(/^\/|\/$/g, "");
}
const D = (e, o) => {
  const t = `/${_t(o)}/${e}`;
  return Object.assign((...a) => Ct(t, a, async (r, c) => {
    c.headers = mergeHeaders$2(getHeaders(), c.headers);
    const i = await $fetch.native(r, c), d = getEvent(), b = mergeHeaders$2(i.headers, d.___ssrRpcResponseHeaders);
    return d.___ssrRpcResponseHeaders = b, i;
  }), { url: t, functionId: e });
}, Ft = "/_build/assets/styles-CVTqeXl-.css", q = createContext$1({ width: 0, height: 0, screenWidth: 0, screenHeight: 0, isMobile: false }), St = ({ children: e, isMobile: o }) => {
  const t = o ? 768 : 1250, [n, a] = useState(0), [r, c$1] = useState(0), [i, d] = useState(0), [b, C] = useState(0); c(() => {
  }, 500);
  return useLayoutEffect(() => {
  }, [n, r]), jsx(q.Provider, { value: { width: n || t, height: r || t, screenWidth: i || t, screenHeight: b || t, isMobile: n === 0 && r === 0 ? !!o : !(n > 800) }, children: e });
}, kt = () => useContext(q), Mt = ({ position: e, ...o }) => {
  const { theme: t = "system" } = useTheme(), { isMobile: n } = kt();
  return jsx(Toaster, { theme: t, className: "toaster group", closeButton: true, richColors: true, style: { "--normal-bg": "var(--popover)", "--normal-text": "var(--popover-foreground)", "--normal-border": "var(--border)" }, position: n ? "top-right" : e, ...o });
};
function Nt({ children: e, handleThrowOnError: o }) {
  const [t] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 6e4, retry: 3 }, mutations: { onError: o } } }));
  return jsxs(QueryClientProvider, { client: t, children: [e, jsx(ReactQueryDevtools, { initialIsOpen: false })] });
}
const Tt = ({ title: e, description: o, keywords: t, image: n }) => [{ title: e }, { name: "description", content: o }, { name: "keywords", content: t }, { name: "twitter:title", content: e }, { name: "twitter:description", content: o }, { name: "twitter:creator", content: "@tannerlinsley" }, { name: "twitter:site", content: "@tannerlinsley" }, { name: "og:type", content: "website" }, { name: "og:title", content: e }, { name: "og:description", content: o }, ...n ? [{ name: "twitter:image", content: n }, { name: "twitter:card", content: "summary_large_image" }, { name: "og:image", content: n }] : []], Dt = D("src_routes_root_tsx--isMobile_createServerFn_handler", "/_server"), Et = createServerFn({ method: "GET" }).handler(Dt), _ = createRootRoute({ head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, ...Tt({ title: "Lipy Commerce", description: "Lipy Commerce is a quick commerce platform designed to empower local businesses by connecting them directly with nearby customers. Sell faster, grow smarter, and stay local." })], links: [{ rel: "stylesheet", href: Ft }, { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" }, { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" }, { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" }, { rel: "manifest", href: "/favicon/site.webmanifest", color: "#fffff" }, { rel: "icon", href: "/favicon/favicon.ico" }] }), errorComponent: (e) => jsx(G, { children: jsx(ge, { ...e }) }), notFoundComponent: () => jsx(fe, {}), loader: async () => await Et(), component: jt });
function jt() {
  return jsx(G, { children: jsx(Outlet, {}) });
}
function G({ children: e }) {
  const o = d$1.useCallback((n) => (toast.error((n == null ? void 0 : n.message) || "Something went wrong!"), false), []), { isSsrMobile: t } = _.useLoaderData();
  return jsxs("html", { className: "bg-muted/30", children: [jsx("head", { children: jsx(HeadContent, {}) }), jsx("body", { suppressHydrationWarning: true, className: "m-auto outline-1 outline-border shadow min-h-screen flex flex-col ", style: { maxWidth: "1920px" }, children: jsxs(St, { isMobile: t, children: [jsxs(Nt, { handleThrowOnError: o, children: [jsx(NuqsAdapter, { children: e }), jsx(Mt, {})] }), jsx(TanStackRouterDevtools, { position: "bottom-right" }), jsx(Scripts, {})] }) })] });
}
const At = () => import('../build/route-D60eqUvZ.mjs'), B = createFileRoute("/demo")({ component: lazyRouteComponent(At, "component", () => B.ssr) }), zt = () => import('../build/route-MyxkcAl5.mjs'), Ot = D("src_routes_loggedIn_route_tsx--authFn_createServerFn_handler", "/_server"), Lt = createServerFn({ method: "GET" }).handler(Ot), Q = createFileRoute("/(loggedIn)")({ component: lazyRouteComponent(zt, "component", () => Q.ssr), loader: async () => await Lt() }), gn = { primary: [{ label: "My Dashboard", url: "/", icon: LayoutDashboard }, { label: "Products", url: "/product", icon: Shirt, mobile: true }, { label: "Orders", url: "/order", icon: ShoppingBag }, { label: "Customers", url: "/customer", icon: Users }], secondary: [{ label: "Account", url: "/account", icon: CircleUser }, { label: "Sign out", url: "/logout", icon: LogOut }] }, Ht = () => import('../build/index-CG-3uRCd.mjs'), V = createFileRoute("/demo/")({ component: lazyRouteComponent(Ht, "component", () => V.ssr), loader: () => redirect({ to: "/demo/client", throw: true }) }), Ut = () => import('../build/index-Djmzg6D0.mjs'), X = createFileRoute("/(loggedIn)/")({ component: lazyRouteComponent(Ut, "component", () => X.ssr) }), Wt = () => import('../build/tanstackMutation-DBj1oGBS.mjs'), J = createFileRoute("/demo/tanstackMutation")({ component: lazyRouteComponent(Wt, "component", () => J.ssr) }), qt = () => import('../build/ssr-DYvoj1I0.mjs'), Gt = D("src_routes_demo_ssr_tsx--authFn_createServerFn_handler", "/_server"), Bt = createServerFn({ method: "GET" }).handler(Gt), K = createFileRoute("/demo/ssr")({ component: lazyRouteComponent(qt, "component", () => K.ssr), loader: async () => await Bt() }), Qt = () => import('../build/directMutation-glW5MKvl.mjs'), Z = createFileRoute("/demo/directMutation")({ component: lazyRouteComponent(Qt, "component", () => Z.ssr) }), Vt = () => import('../build/client-CcY3BGAv.mjs'), Y = createFileRoute("/demo/client")({ component: lazyRouteComponent(Vt, "component", () => Y.ssr) });
function p(...e) {
  return twMerge(clsx(e));
}
const Xt = cva("inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", { variants: { variant: { default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90", destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60", outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50", secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80", ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-9 px-4 py-2 has-[>svg]:px-3", sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", lg: "h-12 rounded-md px-6 has-[>svg]:px-4", icon: "size-9" } }, defaultVariants: { variant: "default", size: "default" } });
function fn({ className: e, variant: o, size: t, asChild: n = false, ...a }) {
  return jsx(n ? Slot : "button", { "data-slot": "button", className: p(Xt({ variant: o, size: t, className: e })), ...a });
}
const Jt = () => import('../build/route-CvA7j1li.mjs'), ee = createFileRoute("/(loggedIn)/account")({ component: lazyRouteComponent(Jt, "component", () => ee.ssr) }), Kt = d$1.forwardRef(({ className: e, type: o, suffixEl: t, prefixEl: n, size: a, noStyle: r, ...c }, i) => jsxs("div", { className: p("border-input bg-background focus-within:border-ring focus-within:ring-ring flex items-center overflow-hidden rounded-md border focus-within:outline-none focus-within:ring-1", r && "border-none bg-transparent rounded-none", e), children: [n && jsx("span", { className: p("text-muted-foreground flex h-9 items-center px-4 [&>svg]:w-4", a === "lg" && "h-12"), children: n }), jsx("input", { type: o, className: p("placeholder:text-muted-foreground flex-1 flex h-9 shadow-none w-full bg-transparent py-1 text-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50", !t && "pr-3", !n && "pl-3", a === "lg" && "h-12", r && "h-fit w-fit"), ref: i, ...c }), jsx("span", { className: "text-sm", children: t && jsx("span", { className: p("text-muted-foreground flex h-9 items-center px-2 [&>svg]:w-4", a === "lg" && "h-12"), children: t }) })] }));
Kt.displayName = "Input";
const Zt = () => import('../build/index-BpQWohYJ.mjs'), te = createFileRoute("/(loggedIn)/product/")({ component: lazyRouteComponent(Zt, "component", () => te.ssr) }), Yt = () => import('../build/index-n0vjYd9Z.mjs'), oe = createFileRoute("/(loggedIn)/order/")({ component: lazyRouteComponent(Yt, "component", () => oe.ssr) }), eo = () => import('../build/index-Csy94vHr.mjs'), ne = createFileRoute("/(loggedIn)/customer/")({ component: lazyRouteComponent(eo, "component", () => ne.ssr) });
function to({ className: e, ...o }) {
  return jsx(ft.Root, { "data-slot": "label", className: p("flex relative z-0 items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e), ...o });
}
const hn = FormProvider, re = d$1.createContext({}), bn = ({ ...e }) => jsx(re.Provider, { value: { name: e.name }, children: jsx(Controller, { ...e }) }), F = () => {
  const e = d$1.useContext(re), o = d$1.useContext(se), { getFieldState: t } = useFormContext(), n = useFormState({ name: e.name }), a = t(e.name, n);
  if (!e) throw new Error("useFormField should be used within <FormField>");
  const { id: r } = o;
  return { id: r, name: e.name, formItemId: `${r}-form-item`, formDescriptionId: `${r}-form-item-description`, formMessageId: `${r}-form-item-message`, ...a };
}, se = d$1.createContext({});
function xn({ className: e, ...o }) {
  const t = d$1.useId();
  return jsx(se.Provider, { value: { id: t }, children: jsx("div", { "data-slot": "form-item", className: p("grid gap-2", e), ...o }) });
}
function yn({ className: e, ...o }) {
  const { error: t, formItemId: n } = F();
  return jsx(to, { "data-slot": "form-label", "data-error": !!t, className: p("data-[error=true]:text-destructive ", e), htmlFor: n, ...o });
}
function vn({ ...e }) {
  const { error: o, formItemId: t, formDescriptionId: n, formMessageId: a } = F();
  return jsx(Slot, { "data-slot": "form-control", id: t, "aria-describedby": o ? `${n} ${a}` : `${n}`, "aria-invalid": !!o, ...e });
}
function wn({ className: e, ...o }) {
  const { formDescriptionId: t } = F();
  return jsx("p", { "data-slot": "form-description", id: t, className: p("text-muted-foreground text-sm", e), ...o });
}
function Rn({ className: e, ...o }) {
  var _a;
  const { error: t, formMessageId: n } = F(), a = t ? String((_a = t == null ? void 0 : t.message) != null ? _a : "") : o.children;
  return a ? jsx("p", { "data-slot": "form-message", id: n, className: p("text-destructive text-sm", e), ...o, children: a }) : null;
}
const oo = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap", { variants: { variant: { default: "bg-transparent", outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground" }, size: { default: "h-9 px-2 min-w-9", sm: "h-8 px-1.5 min-w-8", lg: "h-10 px-2.5 min-w-10" } }, defaultVariants: { variant: "default", size: "default" } }), ae = d$1.createContext({ size: "default", variant: "default" });
function In({ className: e, variant: o, size: t, children: n, ...a }) {
  return jsx(W.Root, { "data-slot": "toggle-group", "data-variant": o, "data-size": t, className: p("group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs", e), ...a, children: jsx(ae.Provider, { value: { variant: o, size: t }, children: n }) });
}
function $n({ className: e, children: o, variant: t, size: n, ...a }) {
  const r = d$1.useContext(ae);
  return jsx(W.Item, { "data-slot": "toggle-group-item", "data-variant": r.variant || t, "data-size": r.size || n, className: p(oo({ variant: r.variant || t, size: r.size || n }), "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l", e), ...a, children: o });
}
function no(e) {
  try {
    return e.startsWith("http") ? new URL(e).pathname : e;
  } catch {
    return e;
  }
}
const ie = (e, o, t) => {
  const n = e.$url().toString(), a = no(n), r = {};
  return t && typeof t == "object" && ("param" in t && (r.param = t.param), "query" in t && (r.query = t.query)), [o, a, r];
}, ro = (e, o, t, n) => {
  const a = e[o];
  return console.log(e, o, t), { queryKey: ie(e, o, t), queryFn: async () => {
    const c = await a(t);
    if (c.status >= 200 && c.status < 300) return await c.json();
    const i = await c.json(), d = new Error(`Request failed with status ${c.status}`);
    throw d.status = c.status, d.data = i, d;
  }, ...n };
}, so = (e, o, t) => {
  const n = e[o];
  return { mutationKey: ie(e, o, {}), mutationFn: async (a) => {
    const r = await n(a);
    if (r.status >= 200 && r.status < 300) return await r.json();
    const c = await r.json().then((d) => d.error).catch(async (d) => await r.text().catch((b) => ({ message: "Failed to decode response..." })));
    console.log({ errorData: c });
    const i = new Error(c.message || `Request failed with status ${r.status}`);
    throw i.status = r.status, i.data = c, i;
  }, ...t };
}, Cn = (e, o, t, n) => useQuery(ro(e, o, t, n)), ao = (e, o, t) => useMutation(so(e, o, t)), ce = { API_URL: "http://localhost:8080", CDN_URL: "https://cdn.lipy.ai" }, io = hc(ce.API_URL, { init: { credentials: "include" } });
function co({ file: e, type: o }, t = {}) {
  var _a, _b;
  const [n, a] = useState(0), r = useRef(new AbortController()), { onRemove: c, onSuccess: i, onError: d } = t, b = ao(io.v1.upload.presigned, "$post"), C = async (g) => await b.mutateAsync({ json: { type: o, contentLength: g.size, contentType: g.type, filename: g.name } }), x = (g, w) => new Promise((xe, k) => {
    const y = new XMLHttpRequest();
    y.open("PUT", g), y.upload.onprogress = (M) => {
      if (M.lengthComputable) {
        const ye = Math.ceil(M.loaded / M.total * 100);
        a(ye);
      }
    }, y.onload = () => {
      y.status === 200 ? xe() : k(new Error(`Upload failed with status ${y.status}`));
    }, y.onerror = () => {
      k(new Error("Network error occurred"));
    }, y.onabort = () => {
      k(new Error("Upload aborted"));
    }, r.current.signal.addEventListener("abort", () => {
      y.abort();
    }), y.send(w);
  }), l = useMutation({ mutationFn: async (g) => {
    const w = await C(g);
    return await x(w.presigned_url, g), i == null ? void 0 : i(w.id), w;
  }, onError: (g) => {
    g.name === "AbortError" ? console.log("Upload cancelled") : console.error("Upload failed:", g), d == null ? void 0 : d();
  } }), he = () => {
    var _a2;
    r.current.abort(), r.current = new AbortController(), c == null ? void 0 : c((_a2 = b.data) == null ? void 0 : _a2.id);
  }, be = () => {
    l.reset(), a(0), r.current = new AbortController();
  };
  return useEffect(() => {
    const g = setTimeout(() => {
      e && n !== 100 && !l.isPending && l.mutate(e);
    }, 500);
    return () => clearTimeout(g);
  }, [e]), { cancelUpload: he, resetUpload: be, progress: n, data: { ...l.data, url: ((_a = l.data) == null ? void 0 : _a.path) && ce.CDN_URL + "/" + ((_b = b.data) == null ? void 0 : _b.path) }, status: l.status, error: l.error };
}
const lo = (e) => {
  const { strokeWidth: o = 8, sqSize: t = 160, percentage: n } = e, a = (t - o) / 3, r = `0 0 ${t} ${t}`, c = a * Math.PI * 2, i = c - c * (n || 0) / 100, d = `${n}%`;
  return jsxs("svg", { width: t, height: t, viewBox: r, children: [jsx("circle", { className: "fill-none stroke-gray-200", cx: t / 2, cy: t / 2, r: a, strokeWidth: `${o}px` }), jsx("circle", { className: "fill-none stroke-primary transition-all delay-200 ease-in", cx: t / 2, cy: t / 2, r: a, strokeLinecap: "round", strokeWidth: `${o}px`, transform: `rotate(-90 ${t / 2} ${t / 2})`, style: { strokeDasharray: c, strokeDashoffset: i } }), jsx("text", { x: "50%", y: "50%", dy: ".3em", textAnchor: "middle", className: "text-3xl text-muted-foreground", children: d })] });
}, uo = ({ className: e, fileType: o, onSuccess: t }) => {
  const [n, a] = d$1.useState(null), { status: r, progress: c, data: i } = co({ file: n, type: o });
  return d$1.useEffect(() => {
    r === "success" && i.url && (t && t(i), a(null));
  }, [r, i]), jsx("div", { className: p("rounded-md relative bg-muted/40 border flex justify-center items-center cursor-pointer pointer-events-auto hover:bg-muted aspect-square", e), children: jsxs("div", { children: [jsx("input", { type: "file", className: p("opacity-0 absolute size-full"), onChange: (d) => d.target.files && a(d.target.files[0]) }), r === "pending" ? jsx(lo, { percentage: c }) : jsx(Plus, {}), jsx("label", { className: "sr-only", children: "Upload Image" })] }) });
};
uo.displayName = "SingleImage";
const O = { activeFormIdx: 0, data: {} }, Pn = create()((e) => ({ ...O, actions: { setActiveFormIdx: (o) => e({ activeFormIdx: o }), setFormData: (o) => e((t) => ({ data: { ...t.data, ...o } })), reset: () => e(O) } })), mo = () => import('../build/index-Dtjm6aUO.mjs'), de = createFileRoute("/(loggedIn)/account/")({ component: lazyRouteComponent(mo, "component", () => de.ssr) }), po = () => import('../build/_id-BaI84S1X.mjs'), le = createFileRoute("/(loggedIn)/product/$id")({ component: lazyRouteComponent(po, "component", () => le.ssr) }), go = () => import('../build/_id-Cp4YCZMB.mjs'), ue = createFileRoute("/(loggedIn)/order/$id")({ component: lazyRouteComponent(go, "component", () => ue.ssr) }), fo = () => import('../build/security-C88tcS1A.mjs'), me = createFileRoute("/(loggedIn)/account/security")({ component: lazyRouteComponent(fo, "component", () => me.ssr) }), ho = () => import('../build/preferences-Bhbb1RkI.mjs'), pe = createFileRoute("/(loggedIn)/account/preferences")({ component: lazyRouteComponent(ho, "component", () => pe.ssr) }), $ = B.update({ id: "/demo", path: "/demo", getParentRoute: () => _ }), v = Q.update({ id: "/(loggedIn)", getParentRoute: () => _ }), bo = V.update({ id: "/", path: "/", getParentRoute: () => $ }), xo = X.update({ id: "/", path: "/", getParentRoute: () => v }), yo = J.update({ id: "/tanstackMutation", path: "/tanstackMutation", getParentRoute: () => $ }), vo = K.update({ id: "/ssr", path: "/ssr", getParentRoute: () => $ }), wo = Z.update({ id: "/directMutation", path: "/directMutation", getParentRoute: () => $ }), Ro = Y.update({ id: "/client", path: "/client", getParentRoute: () => $ }), S = ee.update({ id: "/account", path: "/account", getParentRoute: () => v }), Io = te.update({ id: "/product/", path: "/product/", getParentRoute: () => v }), $o = oe.update({ id: "/order/", path: "/order/", getParentRoute: () => v }), Co = ne.update({ id: "/customer/", path: "/customer/", getParentRoute: () => v }), Po = de.update({ id: "/", path: "/", getParentRoute: () => S }), _o = le.update({ id: "/product/$id", path: "/product/$id", getParentRoute: () => v }), Fo = ue.update({ id: "/order/$id", path: "/order/$id", getParentRoute: () => v }), So = me.update({ id: "/security", path: "/security", getParentRoute: () => S }), ko = pe.update({ id: "/preferences", path: "/preferences", getParentRoute: () => S }), Mo = { loggedInAccountPreferencesRoute: ko, loggedInAccountSecurityRoute: So, loggedInAccountIndexRoute: Po }, No = S._addFileChildren(Mo), To = { loggedInAccountRouteRoute: No, loggedInIndexRoute: xo, loggedInOrderIdRoute: Fo, loggedInProductIdRoute: _o, loggedInCustomerIndexRoute: Co, loggedInOrderIndexRoute: $o, loggedInProductIndexRoute: Io }, Do = v._addFileChildren(To), Eo = { DemoClientRoute: Ro, DemoDirectMutationRoute: wo, DemoSsrRoute: vo, DemoTanstackMutationRoute: yo, DemoIndexRoute: bo }, jo = $._addFileChildren(Eo), Ao = { loggedInRouteRoute: Do, DemoRouteRoute: jo }, zo = _._addFileChildren(Ao)._addFileTypes();
function Oo() {
  return createRouter$2({ routeTree: zo, defaultPreload: "intent", defaultErrorComponent: ge, defaultNotFoundComponent: () => jsx(fe, {}), scrollRestoration: true, defaultViewTransition: true });
}
function ge({ error: e }) {
  const o = useRouter(), t = useMatch({ strict: false, select: (n) => n.id === rootRouteId });
  return console.error("DefaultCatchBoundary Error:", e), jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [jsx(ErrorComponent, { error: e instanceof Error ? e : new Error((e == null ? void 0 : e.message) || "Something went wrong", { cause: (e == null ? void 0 : e.data) || null }) }), jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [jsx("button", { onClick: () => {
    o.invalidate();
  }, className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Try Again" }), t ? jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Home" }) : jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", onClick: (n) => {
    n.preventDefault(), window.history.back();
  }, children: "Go Back" })] })] });
}
function fe({ children: e }) {
  return jsxs("div", { className: "space-y-2 p-2", children: [jsx("div", { className: "text-gray-600 dark:text-gray-400", children: e || jsx("p", { children: "The page you are looking for does not exist." }) }), jsxs("p", { className: "flex items-center gap-2 flex-wrap", children: [jsx("button", { onClick: () => window.history.back(), className: "bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm", children: "Go back" }), jsx(Link, { to: "/", className: "bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm", children: "Start Over" })] })] });
}
const _n = createStartHandler({ createRouter: Oo, getRouterManifest: $t })(vt);

const handlers = [
  { route: '', handler: _mq1PUh, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: q$1, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: _n, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O$2(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $n as $, Cn as C, In as I, K, Pn as P, Rn as R, Xt as X, ao as a, Kt as b, bn as c, c as d, fn as f, gn as g, hn as h, io as i, kt as k, nodeServer as n, p, to as t, uo as u, vn as v, wn as w, xn as x, yn as y };
//# sourceMappingURL=nitro.mjs.map
