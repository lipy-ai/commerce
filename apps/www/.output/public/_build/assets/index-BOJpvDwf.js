import{r as i,j as e,u as N,L as n}from"./client-DJZyYeHn.js";import{I as w}from"./input-BLXIWNlW.js";import{c as d,a as C}from"./auth-DzL7yw3J.js";const x={default:"/logo/ico.svg"};/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),k=s=>s.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,c)=>c?c.toUpperCase():r.toLowerCase()),m=s=>{const t=k(s);return t.charAt(0).toUpperCase()+t.slice(1)},u=(...s)=>s.filter((t,r,c)=>!!t&&t.trim()!==""&&c.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=i.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:c,className:l="",children:a,iconNode:j,...f},g)=>i.createElement("svg",{ref:g,...A,width:t,height:t,stroke:s,strokeWidth:c?Number(r)*24/Number(t):r,className:u("lucide",l),...f},[...j.map(([y,v])=>i.createElement(y,v)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=(s,t)=>{const r=i.forwardRef(({className:c,...l},a)=>i.createElement(L,{ref:a,iconNode:t,className:u(`lucide-${b(m(s))}`,`lucide-${s}`,c),...l}));return r.displayName=m(s),r};/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]],h=o("circle-user",S);/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],E=o("search",_);/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]],$=o("shopping-bag",M);function p(){return e.jsx("div",{children:e.jsx(w,{placeholder:"Search over 5000 products...",size:"lg",prefixEl:e.jsx(E,{}),className:"bg-background"})})}function B(){const{isMobile:s}=N();return s?e.jsxs("nav",{className:"p-4 w-screen overflow-hidden space-y-6 bg-primary/70 min-h-52",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(n,{to:"/",children:e.jsx("div",{className:"flex justify-between items-center flex-col",children:e.jsx("div",{className:"size-10 flex justify-center items-start",children:e.jsx("img",{src:x.default,className:d("size-10 rounded-full overflow-hidden")})})})}),e.jsxs("div",{className:"flex justify-end items-center space-x-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold leading-tighter text-xs",children:"Delivery in 20 mins"}),e.jsx("p",{className:"text-xs leading-tighter",children:"Andheri West, Mumbai"})]}),e.jsx(n,{to:"/account",className:"text-center flex flex-col justify-center items-center",children:e.jsx(h,{className:"size-8"})})]})]}),e.jsx("div",{children:e.jsx(p,{})})]}):e.jsxs("nav",{className:"p-4 md:px-8 flex justify-between gap-8 items-center",children:[e.jsx("div",{children:e.jsx(n,{to:"/",className:"block",children:e.jsx("img",{src:x.default,className:d("size-10"),width:50,height:50})})}),e.jsx("div",{className:"flex-1",children:e.jsx(p,{})}),e.jsxs("div",{className:"flex gap-8 items-center text-xs justify-center",children:[e.jsxs(n,{to:"/account",className:"text-center flex flex-col justify-center items-center space-y-1",children:[e.jsx(h,{}),e.jsx("span",{children:"Account"})]}),e.jsxs(n,{to:"/cart",className:"text-center flex flex-col justify-center items-center space-y-1",children:[e.jsx($,{}),e.jsx("span",{children:"Cart"})]})]})]})}const R=function(){const t=C.useSession();return e.jsxs(e.Fragment,{children:[e.jsx(B,{}),e.jsxs("div",{className:"p-2",children:[e.jsx("h3",{children:"Welcome Home!!!"}),e.jsx("pre",{className:"whitespace-pre-wrap max-w-md p-8",children:JSON.stringify(t,null,2)})]})]})};export{R as component};
