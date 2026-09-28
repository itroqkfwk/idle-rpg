var ld=Object.defineProperty;var od=(e,t,n)=>t in e?ld(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var gn=(e,t,n)=>od(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(l){if(l.ep)return;l.ep=!0;const o=n(l);fetch(l.href,o)}})();function ad(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ai={exports:{}},Vl={},Di={exports:{}},Q={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rr=Symbol.for("react.element"),sd=Symbol.for("react.portal"),id=Symbol.for("react.fragment"),ud=Symbol.for("react.strict_mode"),cd=Symbol.for("react.profiler"),dd=Symbol.for("react.provider"),fd=Symbol.for("react.context"),pd=Symbol.for("react.forward_ref"),md=Symbol.for("react.suspense"),hd=Symbol.for("react.memo"),gd=Symbol.for("react.lazy"),bs=Symbol.iterator;function xd(e){return e===null||typeof e!="object"?null:(e=bs&&e[bs]||e["@@iterator"],typeof e=="function"?e:null)}var Bi={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$i=Object.assign,Hi={};function Vn(e,t,n){this.props=e,this.context=t,this.refs=Hi,this.updater=n||Bi}Vn.prototype.isReactComponent={};Vn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Vn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ui(){}Ui.prototype=Vn.prototype;function _a(e,t,n){this.props=e,this.context=t,this.refs=Hi,this.updater=n||Bi}var Ta=_a.prototype=new Ui;Ta.constructor=_a;$i(Ta,Vn.prototype);Ta.isPureReactComponent=!0;var Es=Array.isArray,Vi=Object.prototype.hasOwnProperty,La={current:null},Wi={key:!0,ref:!0,__self:!0,__source:!0};function Gi(e,t,n){var r,l={},o=null,s=null;if(t!=null)for(r in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(o=""+t.key),t)Vi.call(t,r)&&!Wi.hasOwnProperty(r)&&(l[r]=t[r]);var i=arguments.length-2;if(i===1)l.children=n;else if(1<i){for(var u=Array(i),d=0;d<i;d++)u[d]=arguments[d+2];l.children=u}if(e&&e.defaultProps)for(r in i=e.defaultProps,i)l[r]===void 0&&(l[r]=i[r]);return{$$typeof:Rr,type:e,key:o,ref:s,props:l,_owner:La.current}}function vd(e,t){return{$$typeof:Rr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Pa(e){return typeof e=="object"&&e!==null&&e.$$typeof===Rr}function yd(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Ms=/\/+/g;function uo(e,t){return typeof e=="object"&&e!==null&&e.key!=null?yd(""+e.key):t.toString(36)}function al(e,t,n,r,l){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case Rr:case sd:s=!0}}if(s)return s=e,l=l(s),e=r===""?"."+uo(s,0):r,Es(l)?(n="",e!=null&&(n=e.replace(Ms,"$&/")+"/"),al(l,t,n,"",function(d){return d})):l!=null&&(Pa(l)&&(l=vd(l,n+(!l.key||s&&s.key===l.key?"":(""+l.key).replace(Ms,"$&/")+"/")+e)),t.push(l)),1;if(s=0,r=r===""?".":r+":",Es(e))for(var i=0;i<e.length;i++){o=e[i];var u=r+uo(o,i);s+=al(o,t,n,u,l)}else if(u=xd(e),typeof u=="function")for(e=u.call(e),i=0;!(o=e.next()).done;)o=o.value,u=r+uo(o,i++),s+=al(o,t,n,u,l);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Hr(e,t,n){if(e==null)return e;var r=[],l=0;return al(e,r,"","",function(o){return t.call(n,o,l++)}),r}function wd(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ie={current:null},sl={transition:null},kd={ReactCurrentDispatcher:Ie,ReactCurrentBatchConfig:sl,ReactCurrentOwner:La};function Qi(){throw Error("act(...) is not supported in production builds of React.")}Q.Children={map:Hr,forEach:function(e,t,n){Hr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Hr(e,function(){t++}),t},toArray:function(e){return Hr(e,function(t){return t})||[]},only:function(e){if(!Pa(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Q.Component=Vn;Q.Fragment=id;Q.Profiler=cd;Q.PureComponent=_a;Q.StrictMode=ud;Q.Suspense=md;Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=kd;Q.act=Qi;Q.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=$i({},e.props),l=e.key,o=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,s=La.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(u in t)Vi.call(t,u)&&!Wi.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&i!==void 0?i[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){i=Array(u);for(var d=0;d<u;d++)i[d]=arguments[d+2];r.children=i}return{$$typeof:Rr,type:e.type,key:l,ref:o,props:r,_owner:s}};Q.createContext=function(e){return e={$$typeof:fd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:dd,_context:e},e.Consumer=e};Q.createElement=Gi;Q.createFactory=function(e){var t=Gi.bind(null,e);return t.type=e,t};Q.createRef=function(){return{current:null}};Q.forwardRef=function(e){return{$$typeof:pd,render:e}};Q.isValidElement=Pa;Q.lazy=function(e){return{$$typeof:gd,_payload:{_status:-1,_result:e},_init:wd}};Q.memo=function(e,t){return{$$typeof:hd,type:e,compare:t===void 0?null:t}};Q.startTransition=function(e){var t=sl.transition;sl.transition={};try{e()}finally{sl.transition=t}};Q.unstable_act=Qi;Q.useCallback=function(e,t){return Ie.current.useCallback(e,t)};Q.useContext=function(e){return Ie.current.useContext(e)};Q.useDebugValue=function(){};Q.useDeferredValue=function(e){return Ie.current.useDeferredValue(e)};Q.useEffect=function(e,t){return Ie.current.useEffect(e,t)};Q.useId=function(){return Ie.current.useId()};Q.useImperativeHandle=function(e,t,n){return Ie.current.useImperativeHandle(e,t,n)};Q.useInsertionEffect=function(e,t){return Ie.current.useInsertionEffect(e,t)};Q.useLayoutEffect=function(e,t){return Ie.current.useLayoutEffect(e,t)};Q.useMemo=function(e,t){return Ie.current.useMemo(e,t)};Q.useReducer=function(e,t,n){return Ie.current.useReducer(e,t,n)};Q.useRef=function(e){return Ie.current.useRef(e)};Q.useState=function(e){return Ie.current.useState(e)};Q.useSyncExternalStore=function(e,t,n){return Ie.current.useSyncExternalStore(e,t,n)};Q.useTransition=function(){return Ie.current.useTransition()};Q.version="18.3.1";Di.exports=Q;var U=Di.exports;const jd=ad(U);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sd=U,Nd=Symbol.for("react.element"),Cd=Symbol.for("react.fragment"),bd=Object.prototype.hasOwnProperty,Ed=Sd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Md={key:!0,ref:!0,__self:!0,__source:!0};function qi(e,t,n){var r,l={},o=null,s=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(r in t)bd.call(t,r)&&!Md.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:Nd,type:e,key:o,ref:s,props:l,_owner:Ed.current}}Vl.Fragment=Cd;Vl.jsx=qi;Vl.jsxs=qi;Ai.exports=Vl;var a=Ai.exports,Oo={},Yi={exports:{}},Ke={},Ki={exports:{}},Xi={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,B){var p=T.length;T.push(B);e:for(;0<p;){var f=p-1>>>1,z=T[f];if(0<l(z,B))T[f]=B,T[p]=z,p=f;else break e}}function n(T){return T.length===0?null:T[0]}function r(T){if(T.length===0)return null;var B=T[0],p=T.pop();if(p!==B){T[0]=p;e:for(var f=0,z=T.length,I=z>>>1;f<I;){var F=2*(f+1)-1,$=T[F],H=F+1,O=T[H];if(0>l($,p))H<z&&0>l(O,$)?(T[f]=O,T[H]=p,f=H):(T[f]=$,T[F]=p,f=F);else if(H<z&&0>l(O,p))T[f]=O,T[H]=p,f=H;else break e}}return B}function l(T,B){var p=T.sortIndex-B.sortIndex;return p!==0?p:T.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var s=Date,i=s.now();e.unstable_now=function(){return s.now()-i}}var u=[],d=[],v=1,x=null,m=3,y=!1,S=!1,b=!1,R=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function h(T){for(var B=n(d);B!==null;){if(B.callback===null)r(d);else if(B.startTime<=T)r(d),B.sortIndex=B.expirationTime,t(u,B);else break;B=n(d)}}function w(T){if(b=!1,h(T),!S)if(n(u)!==null)S=!0,Fe(j);else{var B=n(d);B!==null&&Pt(w,B.startTime-T)}}function j(T,B){S=!1,b&&(b=!1,g(P),P=-1),y=!0;var p=m;try{for(h(B),x=n(u);x!==null&&(!(x.expirationTime>B)||T&&!Ee());){var f=x.callback;if(typeof f=="function"){x.callback=null,m=x.priorityLevel;var z=f(x.expirationTime<=B);B=e.unstable_now(),typeof z=="function"?x.callback=z:x===n(u)&&r(u),h(B)}else r(u);x=n(u)}if(x!==null)var I=!0;else{var F=n(d);F!==null&&Pt(w,F.startTime-B),I=!1}return I}finally{x=null,m=p,y=!1}}var C=!1,_=null,P=-1,te=5,W=-1;function Ee(){return!(e.unstable_now()-W<te)}function wt(){if(_!==null){var T=e.unstable_now();W=T;var B=!0;try{B=_(!0,T)}finally{B?mt():(C=!1,_=null)}}else C=!1}var mt;if(typeof c=="function")mt=function(){c(wt)};else if(typeof MessageChannel<"u"){var en=new MessageChannel,Lt=en.port2;en.port1.onmessage=wt,mt=function(){Lt.postMessage(null)}}else mt=function(){R(wt,0)};function Fe(T){_=T,C||(C=!0,mt())}function Pt(T,B){P=R(function(){T(e.unstable_now())},B)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){S||y||(S=!0,Fe(j))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):te=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(T){switch(m){case 1:case 2:case 3:var B=3;break;default:B=m}var p=m;m=B;try{return T()}finally{m=p}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,B){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var p=m;m=T;try{return B()}finally{m=p}},e.unstable_scheduleCallback=function(T,B,p){var f=e.unstable_now();switch(typeof p=="object"&&p!==null?(p=p.delay,p=typeof p=="number"&&0<p?f+p:f):p=f,T){case 1:var z=-1;break;case 2:z=250;break;case 5:z=1073741823;break;case 4:z=1e4;break;default:z=5e3}return z=p+z,T={id:v++,callback:B,priorityLevel:T,startTime:p,expirationTime:z,sortIndex:-1},p>f?(T.sortIndex=p,t(d,T),n(u)===null&&T===n(d)&&(b?(g(P),P=-1):b=!0,Pt(w,p-f))):(T.sortIndex=z,t(u,T),S||y||(S=!0,Fe(j))),T},e.unstable_shouldYield=Ee,e.unstable_wrapCallback=function(T){var B=m;return function(){var p=m;m=B;try{return T.apply(this,arguments)}finally{m=p}}}})(Xi);Ki.exports=Xi;var zd=Ki.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _d=U,Ye=zd;function N(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Zi=new Set,xr={};function mn(e,t){On(e,t),On(e+"Capture",t)}function On(e,t){for(xr[e]=t,e=0;e<t.length;e++)Zi.add(t[e])}var Et=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Fo=Object.prototype.hasOwnProperty,Td=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,zs={},_s={};function Ld(e){return Fo.call(_s,e)?!0:Fo.call(zs,e)?!1:Td.test(e)?_s[e]=!0:(zs[e]=!0,!1)}function Pd(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Rd(e,t,n,r){if(t===null||typeof t>"u"||Pd(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Oe(e,t,n,r,l,o,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=s}var be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){be[e]=new Oe(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];be[t]=new Oe(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){be[e]=new Oe(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){be[e]=new Oe(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){be[e]=new Oe(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){be[e]=new Oe(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){be[e]=new Oe(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){be[e]=new Oe(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){be[e]=new Oe(e,5,!1,e.toLowerCase(),null,!1,!1)});var Ra=/[\-:]([a-z])/g;function Ia(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Ra,Ia);be[t]=new Oe(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Ra,Ia);be[t]=new Oe(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Ra,Ia);be[t]=new Oe(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){be[e]=new Oe(e,1,!1,e.toLowerCase(),null,!1,!1)});be.xlinkHref=new Oe("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){be[e]=new Oe(e,1,!1,e.toLowerCase(),null,!0,!0)});function Oa(e,t,n,r){var l=be.hasOwnProperty(t)?be[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Rd(t,n,l,r)&&(n=null),r||l===null?Ld(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var Tt=_d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ur=Symbol.for("react.element"),vn=Symbol.for("react.portal"),yn=Symbol.for("react.fragment"),Fa=Symbol.for("react.strict_mode"),Ao=Symbol.for("react.profiler"),Ji=Symbol.for("react.provider"),eu=Symbol.for("react.context"),Aa=Symbol.for("react.forward_ref"),Do=Symbol.for("react.suspense"),Bo=Symbol.for("react.suspense_list"),Da=Symbol.for("react.memo"),It=Symbol.for("react.lazy"),tu=Symbol.for("react.offscreen"),Ts=Symbol.iterator;function qn(e){return e===null||typeof e!="object"?null:(e=Ts&&e[Ts]||e["@@iterator"],typeof e=="function"?e:null)}var de=Object.assign,co;function rr(e){if(co===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);co=t&&t[1]||""}return`
`+co+e}var fo=!1;function po(e,t){if(!e||fo)return"";fo=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var l=d.stack.split(`
`),o=r.stack.split(`
`),s=l.length-1,i=o.length-1;1<=s&&0<=i&&l[s]!==o[i];)i--;for(;1<=s&&0<=i;s--,i--)if(l[s]!==o[i]){if(s!==1||i!==1)do if(s--,i--,0>i||l[s]!==o[i]){var u=`
`+l[s].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=s&&0<=i);break}}}finally{fo=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?rr(e):""}function Id(e){switch(e.tag){case 5:return rr(e.type);case 16:return rr("Lazy");case 13:return rr("Suspense");case 19:return rr("SuspenseList");case 0:case 2:case 15:return e=po(e.type,!1),e;case 11:return e=po(e.type.render,!1),e;case 1:return e=po(e.type,!0),e;default:return""}}function $o(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case yn:return"Fragment";case vn:return"Portal";case Ao:return"Profiler";case Fa:return"StrictMode";case Do:return"Suspense";case Bo:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case eu:return(e.displayName||"Context")+".Consumer";case Ji:return(e._context.displayName||"Context")+".Provider";case Aa:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Da:return t=e.displayName||null,t!==null?t:$o(e.type)||"Memo";case It:t=e._payload,e=e._init;try{return $o(e(t))}catch{}}return null}function Od(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return $o(t);case 8:return t===Fa?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Yt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function nu(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Fd(e){var t=nu(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(s){r=""+s,o.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Vr(e){e._valueTracker||(e._valueTracker=Fd(e))}function ru(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=nu(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function yl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ho(e,t){var n=t.checked;return de({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ls(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Yt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function lu(e,t){t=t.checked,t!=null&&Oa(e,"checked",t,!1)}function Uo(e,t){lu(e,t);var n=Yt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Vo(e,t.type,n):t.hasOwnProperty("defaultValue")&&Vo(e,t.type,Yt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ps(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Vo(e,t,n){(t!=="number"||yl(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var lr=Array.isArray;function _n(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Yt(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Wo(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(N(91));return de({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Rs(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(N(92));if(lr(n)){if(1<n.length)throw Error(N(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Yt(n)}}function ou(e,t){var n=Yt(t.value),r=Yt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Is(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function au(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Go(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?au(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Wr,su=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Wr=Wr||document.createElement("div"),Wr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Wr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function vr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var ir={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ad=["Webkit","ms","Moz","O"];Object.keys(ir).forEach(function(e){Ad.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ir[t]=ir[e]})});function iu(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||ir.hasOwnProperty(e)&&ir[e]?(""+t).trim():t+"px"}function uu(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=iu(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Dd=de({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Qo(e,t){if(t){if(Dd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(N(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(N(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(N(61))}if(t.style!=null&&typeof t.style!="object")throw Error(N(62))}}function qo(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yo=null;function Ba(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ko=null,Tn=null,Ln=null;function Os(e){if(e=Fr(e)){if(typeof Ko!="function")throw Error(N(280));var t=e.stateNode;t&&(t=Yl(t),Ko(e.stateNode,e.type,t))}}function cu(e){Tn?Ln?Ln.push(e):Ln=[e]:Tn=e}function du(){if(Tn){var e=Tn,t=Ln;if(Ln=Tn=null,Os(e),t)for(e=0;e<t.length;e++)Os(t[e])}}function fu(e,t){return e(t)}function pu(){}var mo=!1;function mu(e,t,n){if(mo)return e(t,n);mo=!0;try{return fu(e,t,n)}finally{mo=!1,(Tn!==null||Ln!==null)&&(pu(),du())}}function yr(e,t){var n=e.stateNode;if(n===null)return null;var r=Yl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(N(231,t,typeof n));return n}var Xo=!1;if(Et)try{var Yn={};Object.defineProperty(Yn,"passive",{get:function(){Xo=!0}}),window.addEventListener("test",Yn,Yn),window.removeEventListener("test",Yn,Yn)}catch{Xo=!1}function Bd(e,t,n,r,l,o,s,i,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(v){this.onError(v)}}var ur=!1,wl=null,kl=!1,Zo=null,$d={onError:function(e){ur=!0,wl=e}};function Hd(e,t,n,r,l,o,s,i,u){ur=!1,wl=null,Bd.apply($d,arguments)}function Ud(e,t,n,r,l,o,s,i,u){if(Hd.apply(this,arguments),ur){if(ur){var d=wl;ur=!1,wl=null}else throw Error(N(198));kl||(kl=!0,Zo=d)}}function hn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function hu(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Fs(e){if(hn(e)!==e)throw Error(N(188))}function Vd(e){var t=e.alternate;if(!t){if(t=hn(e),t===null)throw Error(N(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var o=l.alternate;if(o===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===o.child){for(o=l.child;o;){if(o===n)return Fs(l),e;if(o===r)return Fs(l),t;o=o.sibling}throw Error(N(188))}if(n.return!==r.return)n=l,r=o;else{for(var s=!1,i=l.child;i;){if(i===n){s=!0,n=l,r=o;break}if(i===r){s=!0,r=l,n=o;break}i=i.sibling}if(!s){for(i=o.child;i;){if(i===n){s=!0,n=o,r=l;break}if(i===r){s=!0,r=o,n=l;break}i=i.sibling}if(!s)throw Error(N(189))}}if(n.alternate!==r)throw Error(N(190))}if(n.tag!==3)throw Error(N(188));return n.stateNode.current===n?e:t}function gu(e){return e=Vd(e),e!==null?xu(e):null}function xu(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=xu(e);if(t!==null)return t;e=e.sibling}return null}var vu=Ye.unstable_scheduleCallback,As=Ye.unstable_cancelCallback,Wd=Ye.unstable_shouldYield,Gd=Ye.unstable_requestPaint,me=Ye.unstable_now,Qd=Ye.unstable_getCurrentPriorityLevel,$a=Ye.unstable_ImmediatePriority,yu=Ye.unstable_UserBlockingPriority,jl=Ye.unstable_NormalPriority,qd=Ye.unstable_LowPriority,wu=Ye.unstable_IdlePriority,Wl=null,vt=null;function Yd(e){if(vt&&typeof vt.onCommitFiberRoot=="function")try{vt.onCommitFiberRoot(Wl,e,void 0,(e.current.flags&128)===128)}catch{}}var dt=Math.clz32?Math.clz32:Zd,Kd=Math.log,Xd=Math.LN2;function Zd(e){return e>>>=0,e===0?32:31-(Kd(e)/Xd|0)|0}var Gr=64,Qr=4194304;function or(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Sl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,o=e.pingedLanes,s=n&268435455;if(s!==0){var i=s&~l;i!==0?r=or(i):(o&=s,o!==0&&(r=or(o)))}else s=n&~l,s!==0?r=or(s):o!==0&&(r=or(o));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,o=t&-t,l>=o||l===16&&(o&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-dt(t),l=1<<n,r|=e[n],t&=~l;return r}function Jd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ef(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,o=e.pendingLanes;0<o;){var s=31-dt(o),i=1<<s,u=l[s];u===-1?(!(i&n)||i&r)&&(l[s]=Jd(i,t)):u<=t&&(e.expiredLanes|=i),o&=~i}}function Jo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ku(){var e=Gr;return Gr<<=1,!(Gr&4194240)&&(Gr=64),e}function ho(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ir(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-dt(t),e[t]=n}function tf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-dt(n),o=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~o}}function Ha(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-dt(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var Z=0;function ju(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Su,Ua,Nu,Cu,bu,ea=!1,qr=[],$t=null,Ht=null,Ut=null,wr=new Map,kr=new Map,Ft=[],nf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ds(e,t){switch(e){case"focusin":case"focusout":$t=null;break;case"dragenter":case"dragleave":Ht=null;break;case"mouseover":case"mouseout":Ut=null;break;case"pointerover":case"pointerout":wr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":kr.delete(t.pointerId)}}function Kn(e,t,n,r,l,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:o,targetContainers:[l]},t!==null&&(t=Fr(t),t!==null&&Ua(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function rf(e,t,n,r,l){switch(t){case"focusin":return $t=Kn($t,e,t,n,r,l),!0;case"dragenter":return Ht=Kn(Ht,e,t,n,r,l),!0;case"mouseover":return Ut=Kn(Ut,e,t,n,r,l),!0;case"pointerover":var o=l.pointerId;return wr.set(o,Kn(wr.get(o)||null,e,t,n,r,l)),!0;case"gotpointercapture":return o=l.pointerId,kr.set(o,Kn(kr.get(o)||null,e,t,n,r,l)),!0}return!1}function Eu(e){var t=rn(e.target);if(t!==null){var n=hn(t);if(n!==null){if(t=n.tag,t===13){if(t=hu(n),t!==null){e.blockedOn=t,bu(e.priority,function(){Nu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function il(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ta(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Yo=r,n.target.dispatchEvent(r),Yo=null}else return t=Fr(n),t!==null&&Ua(t),e.blockedOn=n,!1;t.shift()}return!0}function Bs(e,t,n){il(e)&&n.delete(t)}function lf(){ea=!1,$t!==null&&il($t)&&($t=null),Ht!==null&&il(Ht)&&(Ht=null),Ut!==null&&il(Ut)&&(Ut=null),wr.forEach(Bs),kr.forEach(Bs)}function Xn(e,t){e.blockedOn===t&&(e.blockedOn=null,ea||(ea=!0,Ye.unstable_scheduleCallback(Ye.unstable_NormalPriority,lf)))}function jr(e){function t(l){return Xn(l,e)}if(0<qr.length){Xn(qr[0],e);for(var n=1;n<qr.length;n++){var r=qr[n];r.blockedOn===e&&(r.blockedOn=null)}}for($t!==null&&Xn($t,e),Ht!==null&&Xn(Ht,e),Ut!==null&&Xn(Ut,e),wr.forEach(t),kr.forEach(t),n=0;n<Ft.length;n++)r=Ft[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<Ft.length&&(n=Ft[0],n.blockedOn===null);)Eu(n),n.blockedOn===null&&Ft.shift()}var Pn=Tt.ReactCurrentBatchConfig,Nl=!0;function of(e,t,n,r){var l=Z,o=Pn.transition;Pn.transition=null;try{Z=1,Va(e,t,n,r)}finally{Z=l,Pn.transition=o}}function af(e,t,n,r){var l=Z,o=Pn.transition;Pn.transition=null;try{Z=4,Va(e,t,n,r)}finally{Z=l,Pn.transition=o}}function Va(e,t,n,r){if(Nl){var l=ta(e,t,n,r);if(l===null)Co(e,t,r,Cl,n),Ds(e,r);else if(rf(l,e,t,n,r))r.stopPropagation();else if(Ds(e,r),t&4&&-1<nf.indexOf(e)){for(;l!==null;){var o=Fr(l);if(o!==null&&Su(o),o=ta(e,t,n,r),o===null&&Co(e,t,r,Cl,n),o===l)break;l=o}l!==null&&r.stopPropagation()}else Co(e,t,r,null,n)}}var Cl=null;function ta(e,t,n,r){if(Cl=null,e=Ba(r),e=rn(e),e!==null)if(t=hn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=hu(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Cl=e,null}function Mu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Qd()){case $a:return 1;case yu:return 4;case jl:case qd:return 16;case wu:return 536870912;default:return 16}default:return 16}}var Dt=null,Wa=null,ul=null;function zu(){if(ul)return ul;var e,t=Wa,n=t.length,r,l="value"in Dt?Dt.value:Dt.textContent,o=l.length;for(e=0;e<n&&t[e]===l[e];e++);var s=n-e;for(r=1;r<=s&&t[n-r]===l[o-r];r++);return ul=l.slice(e,1<r?1-r:void 0)}function cl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Yr(){return!0}function $s(){return!1}function Xe(e){function t(n,r,l,o,s){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(o):o[i]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Yr:$s,this.isPropagationStopped=$s,this}return de(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Yr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Yr)},persist:function(){},isPersistent:Yr}),t}var Wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ga=Xe(Wn),Or=de({},Wn,{view:0,detail:0}),sf=Xe(Or),go,xo,Zn,Gl=de({},Or,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Qa,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Zn&&(Zn&&e.type==="mousemove"?(go=e.screenX-Zn.screenX,xo=e.screenY-Zn.screenY):xo=go=0,Zn=e),go)},movementY:function(e){return"movementY"in e?e.movementY:xo}}),Hs=Xe(Gl),uf=de({},Gl,{dataTransfer:0}),cf=Xe(uf),df=de({},Or,{relatedTarget:0}),vo=Xe(df),ff=de({},Wn,{animationName:0,elapsedTime:0,pseudoElement:0}),pf=Xe(ff),mf=de({},Wn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),hf=Xe(mf),gf=de({},Wn,{data:0}),Us=Xe(gf),xf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},vf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},yf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function wf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=yf[e])?!!t[e]:!1}function Qa(){return wf}var kf=de({},Or,{key:function(e){if(e.key){var t=xf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=cl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?vf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Qa,charCode:function(e){return e.type==="keypress"?cl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?cl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),jf=Xe(kf),Sf=de({},Gl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vs=Xe(Sf),Nf=de({},Or,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Qa}),Cf=Xe(Nf),bf=de({},Wn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ef=Xe(bf),Mf=de({},Gl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),zf=Xe(Mf),_f=[9,13,27,32],qa=Et&&"CompositionEvent"in window,cr=null;Et&&"documentMode"in document&&(cr=document.documentMode);var Tf=Et&&"TextEvent"in window&&!cr,_u=Et&&(!qa||cr&&8<cr&&11>=cr),Ws=" ",Gs=!1;function Tu(e,t){switch(e){case"keyup":return _f.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Lu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var wn=!1;function Lf(e,t){switch(e){case"compositionend":return Lu(t);case"keypress":return t.which!==32?null:(Gs=!0,Ws);case"textInput":return e=t.data,e===Ws&&Gs?null:e;default:return null}}function Pf(e,t){if(wn)return e==="compositionend"||!qa&&Tu(e,t)?(e=zu(),ul=Wa=Dt=null,wn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return _u&&t.locale!=="ko"?null:t.data;default:return null}}var Rf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Qs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Rf[e.type]:t==="textarea"}function Pu(e,t,n,r){cu(r),t=bl(t,"onChange"),0<t.length&&(n=new Ga("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var dr=null,Sr=null;function If(e){Vu(e,0)}function Ql(e){var t=Sn(e);if(ru(t))return e}function Of(e,t){if(e==="change")return t}var Ru=!1;if(Et){var yo;if(Et){var wo="oninput"in document;if(!wo){var qs=document.createElement("div");qs.setAttribute("oninput","return;"),wo=typeof qs.oninput=="function"}yo=wo}else yo=!1;Ru=yo&&(!document.documentMode||9<document.documentMode)}function Ys(){dr&&(dr.detachEvent("onpropertychange",Iu),Sr=dr=null)}function Iu(e){if(e.propertyName==="value"&&Ql(Sr)){var t=[];Pu(t,Sr,e,Ba(e)),mu(If,t)}}function Ff(e,t,n){e==="focusin"?(Ys(),dr=t,Sr=n,dr.attachEvent("onpropertychange",Iu)):e==="focusout"&&Ys()}function Af(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ql(Sr)}function Df(e,t){if(e==="click")return Ql(t)}function Bf(e,t){if(e==="input"||e==="change")return Ql(t)}function $f(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var pt=typeof Object.is=="function"?Object.is:$f;function Nr(e,t){if(pt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Fo.call(t,l)||!pt(e[l],t[l]))return!1}return!0}function Ks(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Xs(e,t){var n=Ks(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ks(n)}}function Ou(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ou(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fu(){for(var e=window,t=yl();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=yl(e.document)}return t}function Ya(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Hf(e){var t=Fu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ou(n.ownerDocument.documentElement,n)){if(r!==null&&Ya(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,o=Math.min(r.start,l);r=r.end===void 0?o:Math.min(r.end,l),!e.extend&&o>r&&(l=r,r=o,o=l),l=Xs(n,o);var s=Xs(n,r);l&&s&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),o>r?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Uf=Et&&"documentMode"in document&&11>=document.documentMode,kn=null,na=null,fr=null,ra=!1;function Zs(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ra||kn==null||kn!==yl(r)||(r=kn,"selectionStart"in r&&Ya(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),fr&&Nr(fr,r)||(fr=r,r=bl(na,"onSelect"),0<r.length&&(t=new Ga("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=kn)))}function Kr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var jn={animationend:Kr("Animation","AnimationEnd"),animationiteration:Kr("Animation","AnimationIteration"),animationstart:Kr("Animation","AnimationStart"),transitionend:Kr("Transition","TransitionEnd")},ko={},Au={};Et&&(Au=document.createElement("div").style,"AnimationEvent"in window||(delete jn.animationend.animation,delete jn.animationiteration.animation,delete jn.animationstart.animation),"TransitionEvent"in window||delete jn.transitionend.transition);function ql(e){if(ko[e])return ko[e];if(!jn[e])return e;var t=jn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Au)return ko[e]=t[n];return e}var Du=ql("animationend"),Bu=ql("animationiteration"),$u=ql("animationstart"),Hu=ql("transitionend"),Uu=new Map,Js="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xt(e,t){Uu.set(e,t),mn(t,[e])}for(var jo=0;jo<Js.length;jo++){var So=Js[jo],Vf=So.toLowerCase(),Wf=So[0].toUpperCase()+So.slice(1);Xt(Vf,"on"+Wf)}Xt(Du,"onAnimationEnd");Xt(Bu,"onAnimationIteration");Xt($u,"onAnimationStart");Xt("dblclick","onDoubleClick");Xt("focusin","onFocus");Xt("focusout","onBlur");Xt(Hu,"onTransitionEnd");On("onMouseEnter",["mouseout","mouseover"]);On("onMouseLeave",["mouseout","mouseover"]);On("onPointerEnter",["pointerout","pointerover"]);On("onPointerLeave",["pointerout","pointerover"]);mn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));mn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));mn("onBeforeInput",["compositionend","keypress","textInput","paste"]);mn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));mn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));mn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ar="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Gf=new Set("cancel close invalid load scroll toggle".split(" ").concat(ar));function ei(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Ud(r,t,void 0,e),e.currentTarget=null}function Vu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var o=void 0;if(t)for(var s=r.length-1;0<=s;s--){var i=r[s],u=i.instance,d=i.currentTarget;if(i=i.listener,u!==o&&l.isPropagationStopped())break e;ei(l,i,d),o=u}else for(s=0;s<r.length;s++){if(i=r[s],u=i.instance,d=i.currentTarget,i=i.listener,u!==o&&l.isPropagationStopped())break e;ei(l,i,d),o=u}}}if(kl)throw e=Zo,kl=!1,Zo=null,e}function le(e,t){var n=t[ia];n===void 0&&(n=t[ia]=new Set);var r=e+"__bubble";n.has(r)||(Wu(t,e,2,!1),n.add(r))}function No(e,t,n){var r=0;t&&(r|=4),Wu(n,e,r,t)}var Xr="_reactListening"+Math.random().toString(36).slice(2);function Cr(e){if(!e[Xr]){e[Xr]=!0,Zi.forEach(function(n){n!=="selectionchange"&&(Gf.has(n)||No(n,!1,e),No(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xr]||(t[Xr]=!0,No("selectionchange",!1,t))}}function Wu(e,t,n,r){switch(Mu(t)){case 1:var l=of;break;case 4:l=af;break;default:l=Va}n=l.bind(null,t,n,e),l=void 0,!Xo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Co(e,t,n,r,l){var o=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var i=r.stateNode.containerInfo;if(i===l||i.nodeType===8&&i.parentNode===l)break;if(s===4)for(s=r.return;s!==null;){var u=s.tag;if((u===3||u===4)&&(u=s.stateNode.containerInfo,u===l||u.nodeType===8&&u.parentNode===l))return;s=s.return}for(;i!==null;){if(s=rn(i),s===null)return;if(u=s.tag,u===5||u===6){r=o=s;continue e}i=i.parentNode}}r=r.return}mu(function(){var d=o,v=Ba(n),x=[];e:{var m=Uu.get(e);if(m!==void 0){var y=Ga,S=e;switch(e){case"keypress":if(cl(n)===0)break e;case"keydown":case"keyup":y=jf;break;case"focusin":S="focus",y=vo;break;case"focusout":S="blur",y=vo;break;case"beforeblur":case"afterblur":y=vo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=Hs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=cf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Cf;break;case Du:case Bu:case $u:y=pf;break;case Hu:y=Ef;break;case"scroll":y=sf;break;case"wheel":y=zf;break;case"copy":case"cut":case"paste":y=hf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=Vs}var b=(t&4)!==0,R=!b&&e==="scroll",g=b?m!==null?m+"Capture":null:m;b=[];for(var c=d,h;c!==null;){h=c;var w=h.stateNode;if(h.tag===5&&w!==null&&(h=w,g!==null&&(w=yr(c,g),w!=null&&b.push(br(c,w,h)))),R)break;c=c.return}0<b.length&&(m=new y(m,S,null,n,v),x.push({event:m,listeners:b}))}}if(!(t&7)){e:{if(m=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",m&&n!==Yo&&(S=n.relatedTarget||n.fromElement)&&(rn(S)||S[Mt]))break e;if((y||m)&&(m=v.window===v?v:(m=v.ownerDocument)?m.defaultView||m.parentWindow:window,y?(S=n.relatedTarget||n.toElement,y=d,S=S?rn(S):null,S!==null&&(R=hn(S),S!==R||S.tag!==5&&S.tag!==6)&&(S=null)):(y=null,S=d),y!==S)){if(b=Hs,w="onMouseLeave",g="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(b=Vs,w="onPointerLeave",g="onPointerEnter",c="pointer"),R=y==null?m:Sn(y),h=S==null?m:Sn(S),m=new b(w,c+"leave",y,n,v),m.target=R,m.relatedTarget=h,w=null,rn(v)===d&&(b=new b(g,c+"enter",S,n,v),b.target=h,b.relatedTarget=R,w=b),R=w,y&&S)t:{for(b=y,g=S,c=0,h=b;h;h=xn(h))c++;for(h=0,w=g;w;w=xn(w))h++;for(;0<c-h;)b=xn(b),c--;for(;0<h-c;)g=xn(g),h--;for(;c--;){if(b===g||g!==null&&b===g.alternate)break t;b=xn(b),g=xn(g)}b=null}else b=null;y!==null&&ti(x,m,y,b,!1),S!==null&&R!==null&&ti(x,R,S,b,!0)}}e:{if(m=d?Sn(d):window,y=m.nodeName&&m.nodeName.toLowerCase(),y==="select"||y==="input"&&m.type==="file")var j=Of;else if(Qs(m))if(Ru)j=Bf;else{j=Af;var C=Ff}else(y=m.nodeName)&&y.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(j=Df);if(j&&(j=j(e,d))){Pu(x,j,n,v);break e}C&&C(e,m,d),e==="focusout"&&(C=m._wrapperState)&&C.controlled&&m.type==="number"&&Vo(m,"number",m.value)}switch(C=d?Sn(d):window,e){case"focusin":(Qs(C)||C.contentEditable==="true")&&(kn=C,na=d,fr=null);break;case"focusout":fr=na=kn=null;break;case"mousedown":ra=!0;break;case"contextmenu":case"mouseup":case"dragend":ra=!1,Zs(x,n,v);break;case"selectionchange":if(Uf)break;case"keydown":case"keyup":Zs(x,n,v)}var _;if(qa)e:{switch(e){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else wn?Tu(e,n)&&(P="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(_u&&n.locale!=="ko"&&(wn||P!=="onCompositionStart"?P==="onCompositionEnd"&&wn&&(_=zu()):(Dt=v,Wa="value"in Dt?Dt.value:Dt.textContent,wn=!0)),C=bl(d,P),0<C.length&&(P=new Us(P,e,null,n,v),x.push({event:P,listeners:C}),_?P.data=_:(_=Lu(n),_!==null&&(P.data=_)))),(_=Tf?Lf(e,n):Pf(e,n))&&(d=bl(d,"onBeforeInput"),0<d.length&&(v=new Us("onBeforeInput","beforeinput",null,n,v),x.push({event:v,listeners:d}),v.data=_))}Vu(x,t)})}function br(e,t,n){return{instance:e,listener:t,currentTarget:n}}function bl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,o=l.stateNode;l.tag===5&&o!==null&&(l=o,o=yr(e,n),o!=null&&r.unshift(br(e,o,l)),o=yr(e,t),o!=null&&r.push(br(e,o,l))),e=e.return}return r}function xn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ti(e,t,n,r,l){for(var o=t._reactName,s=[];n!==null&&n!==r;){var i=n,u=i.alternate,d=i.stateNode;if(u!==null&&u===r)break;i.tag===5&&d!==null&&(i=d,l?(u=yr(n,o),u!=null&&s.unshift(br(n,u,i))):l||(u=yr(n,o),u!=null&&s.push(br(n,u,i)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var Qf=/\r\n?/g,qf=/\u0000|\uFFFD/g;function ni(e){return(typeof e=="string"?e:""+e).replace(Qf,`
`).replace(qf,"")}function Zr(e,t,n){if(t=ni(t),ni(e)!==t&&n)throw Error(N(425))}function El(){}var la=null,oa=null;function aa(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var sa=typeof setTimeout=="function"?setTimeout:void 0,Yf=typeof clearTimeout=="function"?clearTimeout:void 0,ri=typeof Promise=="function"?Promise:void 0,Kf=typeof queueMicrotask=="function"?queueMicrotask:typeof ri<"u"?function(e){return ri.resolve(null).then(e).catch(Xf)}:sa;function Xf(e){setTimeout(function(){throw e})}function bo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),jr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);jr(t)}function Vt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function li(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Gn=Math.random().toString(36).slice(2),xt="__reactFiber$"+Gn,Er="__reactProps$"+Gn,Mt="__reactContainer$"+Gn,ia="__reactEvents$"+Gn,Zf="__reactListeners$"+Gn,Jf="__reactHandles$"+Gn;function rn(e){var t=e[xt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Mt]||n[xt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=li(e);e!==null;){if(n=e[xt])return n;e=li(e)}return t}e=n,n=e.parentNode}return null}function Fr(e){return e=e[xt]||e[Mt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Sn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(N(33))}function Yl(e){return e[Er]||null}var ua=[],Nn=-1;function Zt(e){return{current:e}}function oe(e){0>Nn||(e.current=ua[Nn],ua[Nn]=null,Nn--)}function re(e,t){Nn++,ua[Nn]=e.current,e.current=t}var Kt={},Le=Zt(Kt),Be=Zt(!1),un=Kt;function Fn(e,t){var n=e.type.contextTypes;if(!n)return Kt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},o;for(o in n)l[o]=t[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function $e(e){return e=e.childContextTypes,e!=null}function Ml(){oe(Be),oe(Le)}function oi(e,t,n){if(Le.current!==Kt)throw Error(N(168));re(Le,t),re(Be,n)}function Gu(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(N(108,Od(e)||"Unknown",l));return de({},n,r)}function zl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Kt,un=Le.current,re(Le,e),re(Be,Be.current),!0}function ai(e,t,n){var r=e.stateNode;if(!r)throw Error(N(169));n?(e=Gu(e,t,un),r.__reactInternalMemoizedMergedChildContext=e,oe(Be),oe(Le),re(Le,e)):oe(Be),re(Be,n)}var St=null,Kl=!1,Eo=!1;function Qu(e){St===null?St=[e]:St.push(e)}function ep(e){Kl=!0,Qu(e)}function Jt(){if(!Eo&&St!==null){Eo=!0;var e=0,t=Z;try{var n=St;for(Z=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}St=null,Kl=!1}catch(l){throw St!==null&&(St=St.slice(e+1)),vu($a,Jt),l}finally{Z=t,Eo=!1}}return null}var Cn=[],bn=0,_l=null,Tl=0,Je=[],et=0,cn=null,Nt=1,Ct="";function tn(e,t){Cn[bn++]=Tl,Cn[bn++]=_l,_l=e,Tl=t}function qu(e,t,n){Je[et++]=Nt,Je[et++]=Ct,Je[et++]=cn,cn=e;var r=Nt;e=Ct;var l=32-dt(r)-1;r&=~(1<<l),n+=1;var o=32-dt(t)+l;if(30<o){var s=l-l%5;o=(r&(1<<s)-1).toString(32),r>>=s,l-=s,Nt=1<<32-dt(t)+l|n<<l|r,Ct=o+e}else Nt=1<<o|n<<l|r,Ct=e}function Ka(e){e.return!==null&&(tn(e,1),qu(e,1,0))}function Xa(e){for(;e===_l;)_l=Cn[--bn],Cn[bn]=null,Tl=Cn[--bn],Cn[bn]=null;for(;e===cn;)cn=Je[--et],Je[et]=null,Ct=Je[--et],Je[et]=null,Nt=Je[--et],Je[et]=null}var qe=null,Qe=null,ie=!1,ct=null;function Yu(e,t){var n=tt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function si(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,qe=e,Qe=Vt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,qe=e,Qe=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=cn!==null?{id:Nt,overflow:Ct}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=tt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,qe=e,Qe=null,!0):!1;default:return!1}}function ca(e){return(e.mode&1)!==0&&(e.flags&128)===0}function da(e){if(ie){var t=Qe;if(t){var n=t;if(!si(e,t)){if(ca(e))throw Error(N(418));t=Vt(n.nextSibling);var r=qe;t&&si(e,t)?Yu(r,n):(e.flags=e.flags&-4097|2,ie=!1,qe=e)}}else{if(ca(e))throw Error(N(418));e.flags=e.flags&-4097|2,ie=!1,qe=e}}}function ii(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;qe=e}function Jr(e){if(e!==qe)return!1;if(!ie)return ii(e),ie=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!aa(e.type,e.memoizedProps)),t&&(t=Qe)){if(ca(e))throw Ku(),Error(N(418));for(;t;)Yu(e,t),t=Vt(t.nextSibling)}if(ii(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(N(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Qe=Vt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Qe=null}}else Qe=qe?Vt(e.stateNode.nextSibling):null;return!0}function Ku(){for(var e=Qe;e;)e=Vt(e.nextSibling)}function An(){Qe=qe=null,ie=!1}function Za(e){ct===null?ct=[e]:ct.push(e)}var tp=Tt.ReactCurrentBatchConfig;function Jn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(N(309));var r=n.stateNode}if(!r)throw Error(N(147,e));var l=r,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(s){var i=l.refs;s===null?delete i[o]:i[o]=s},t._stringRef=o,t)}if(typeof e!="string")throw Error(N(284));if(!n._owner)throw Error(N(290,e))}return e}function el(e,t){throw e=Object.prototype.toString.call(t),Error(N(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ui(e){var t=e._init;return t(e._payload)}function Xu(e){function t(g,c){if(e){var h=g.deletions;h===null?(g.deletions=[c],g.flags|=16):h.push(c)}}function n(g,c){if(!e)return null;for(;c!==null;)t(g,c),c=c.sibling;return null}function r(g,c){for(g=new Map;c!==null;)c.key!==null?g.set(c.key,c):g.set(c.index,c),c=c.sibling;return g}function l(g,c){return g=qt(g,c),g.index=0,g.sibling=null,g}function o(g,c,h){return g.index=h,e?(h=g.alternate,h!==null?(h=h.index,h<c?(g.flags|=2,c):h):(g.flags|=2,c)):(g.flags|=1048576,c)}function s(g){return e&&g.alternate===null&&(g.flags|=2),g}function i(g,c,h,w){return c===null||c.tag!==6?(c=Ro(h,g.mode,w),c.return=g,c):(c=l(c,h),c.return=g,c)}function u(g,c,h,w){var j=h.type;return j===yn?v(g,c,h.props.children,w,h.key):c!==null&&(c.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===It&&ui(j)===c.type)?(w=l(c,h.props),w.ref=Jn(g,c,h),w.return=g,w):(w=xl(h.type,h.key,h.props,null,g.mode,w),w.ref=Jn(g,c,h),w.return=g,w)}function d(g,c,h,w){return c===null||c.tag!==4||c.stateNode.containerInfo!==h.containerInfo||c.stateNode.implementation!==h.implementation?(c=Io(h,g.mode,w),c.return=g,c):(c=l(c,h.children||[]),c.return=g,c)}function v(g,c,h,w,j){return c===null||c.tag!==7?(c=sn(h,g.mode,w,j),c.return=g,c):(c=l(c,h),c.return=g,c)}function x(g,c,h){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Ro(""+c,g.mode,h),c.return=g,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Ur:return h=xl(c.type,c.key,c.props,null,g.mode,h),h.ref=Jn(g,null,c),h.return=g,h;case vn:return c=Io(c,g.mode,h),c.return=g,c;case It:var w=c._init;return x(g,w(c._payload),h)}if(lr(c)||qn(c))return c=sn(c,g.mode,h,null),c.return=g,c;el(g,c)}return null}function m(g,c,h,w){var j=c!==null?c.key:null;if(typeof h=="string"&&h!==""||typeof h=="number")return j!==null?null:i(g,c,""+h,w);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Ur:return h.key===j?u(g,c,h,w):null;case vn:return h.key===j?d(g,c,h,w):null;case It:return j=h._init,m(g,c,j(h._payload),w)}if(lr(h)||qn(h))return j!==null?null:v(g,c,h,w,null);el(g,h)}return null}function y(g,c,h,w,j){if(typeof w=="string"&&w!==""||typeof w=="number")return g=g.get(h)||null,i(c,g,""+w,j);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Ur:return g=g.get(w.key===null?h:w.key)||null,u(c,g,w,j);case vn:return g=g.get(w.key===null?h:w.key)||null,d(c,g,w,j);case It:var C=w._init;return y(g,c,h,C(w._payload),j)}if(lr(w)||qn(w))return g=g.get(h)||null,v(c,g,w,j,null);el(c,w)}return null}function S(g,c,h,w){for(var j=null,C=null,_=c,P=c=0,te=null;_!==null&&P<h.length;P++){_.index>P?(te=_,_=null):te=_.sibling;var W=m(g,_,h[P],w);if(W===null){_===null&&(_=te);break}e&&_&&W.alternate===null&&t(g,_),c=o(W,c,P),C===null?j=W:C.sibling=W,C=W,_=te}if(P===h.length)return n(g,_),ie&&tn(g,P),j;if(_===null){for(;P<h.length;P++)_=x(g,h[P],w),_!==null&&(c=o(_,c,P),C===null?j=_:C.sibling=_,C=_);return ie&&tn(g,P),j}for(_=r(g,_);P<h.length;P++)te=y(_,g,P,h[P],w),te!==null&&(e&&te.alternate!==null&&_.delete(te.key===null?P:te.key),c=o(te,c,P),C===null?j=te:C.sibling=te,C=te);return e&&_.forEach(function(Ee){return t(g,Ee)}),ie&&tn(g,P),j}function b(g,c,h,w){var j=qn(h);if(typeof j!="function")throw Error(N(150));if(h=j.call(h),h==null)throw Error(N(151));for(var C=j=null,_=c,P=c=0,te=null,W=h.next();_!==null&&!W.done;P++,W=h.next()){_.index>P?(te=_,_=null):te=_.sibling;var Ee=m(g,_,W.value,w);if(Ee===null){_===null&&(_=te);break}e&&_&&Ee.alternate===null&&t(g,_),c=o(Ee,c,P),C===null?j=Ee:C.sibling=Ee,C=Ee,_=te}if(W.done)return n(g,_),ie&&tn(g,P),j;if(_===null){for(;!W.done;P++,W=h.next())W=x(g,W.value,w),W!==null&&(c=o(W,c,P),C===null?j=W:C.sibling=W,C=W);return ie&&tn(g,P),j}for(_=r(g,_);!W.done;P++,W=h.next())W=y(_,g,P,W.value,w),W!==null&&(e&&W.alternate!==null&&_.delete(W.key===null?P:W.key),c=o(W,c,P),C===null?j=W:C.sibling=W,C=W);return e&&_.forEach(function(wt){return t(g,wt)}),ie&&tn(g,P),j}function R(g,c,h,w){if(typeof h=="object"&&h!==null&&h.type===yn&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case Ur:e:{for(var j=h.key,C=c;C!==null;){if(C.key===j){if(j=h.type,j===yn){if(C.tag===7){n(g,C.sibling),c=l(C,h.props.children),c.return=g,g=c;break e}}else if(C.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===It&&ui(j)===C.type){n(g,C.sibling),c=l(C,h.props),c.ref=Jn(g,C,h),c.return=g,g=c;break e}n(g,C);break}else t(g,C);C=C.sibling}h.type===yn?(c=sn(h.props.children,g.mode,w,h.key),c.return=g,g=c):(w=xl(h.type,h.key,h.props,null,g.mode,w),w.ref=Jn(g,c,h),w.return=g,g=w)}return s(g);case vn:e:{for(C=h.key;c!==null;){if(c.key===C)if(c.tag===4&&c.stateNode.containerInfo===h.containerInfo&&c.stateNode.implementation===h.implementation){n(g,c.sibling),c=l(c,h.children||[]),c.return=g,g=c;break e}else{n(g,c);break}else t(g,c);c=c.sibling}c=Io(h,g.mode,w),c.return=g,g=c}return s(g);case It:return C=h._init,R(g,c,C(h._payload),w)}if(lr(h))return S(g,c,h,w);if(qn(h))return b(g,c,h,w);el(g,h)}return typeof h=="string"&&h!==""||typeof h=="number"?(h=""+h,c!==null&&c.tag===6?(n(g,c.sibling),c=l(c,h),c.return=g,g=c):(n(g,c),c=Ro(h,g.mode,w),c.return=g,g=c),s(g)):n(g,c)}return R}var Dn=Xu(!0),Zu=Xu(!1),Ll=Zt(null),Pl=null,En=null,Ja=null;function es(){Ja=En=Pl=null}function ts(e){var t=Ll.current;oe(Ll),e._currentValue=t}function fa(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Rn(e,t){Pl=e,Ja=En=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(De=!0),e.firstContext=null)}function rt(e){var t=e._currentValue;if(Ja!==e)if(e={context:e,memoizedValue:t,next:null},En===null){if(Pl===null)throw Error(N(308));En=e,Pl.dependencies={lanes:0,firstContext:e}}else En=En.next=e;return t}var ln=null;function ns(e){ln===null?ln=[e]:ln.push(e)}function Ju(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,ns(t)):(n.next=l.next,l.next=n),t.interleaved=n,zt(e,r)}function zt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Ot=!1;function rs(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ec(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function bt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Wt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,Y&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,zt(e,n)}return l=r.interleaved,l===null?(t.next=t,ns(r)):(t.next=l.next,l.next=t),r.interleaved=t,zt(e,n)}function dl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ha(e,n)}}function ci(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?l=o=s:o=o.next=s,n=n.next}while(n!==null);o===null?l=o=t:o=o.next=t}else l=o=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Rl(e,t,n,r){var l=e.updateQueue;Ot=!1;var o=l.firstBaseUpdate,s=l.lastBaseUpdate,i=l.shared.pending;if(i!==null){l.shared.pending=null;var u=i,d=u.next;u.next=null,s===null?o=d:s.next=d,s=u;var v=e.alternate;v!==null&&(v=v.updateQueue,i=v.lastBaseUpdate,i!==s&&(i===null?v.firstBaseUpdate=d:i.next=d,v.lastBaseUpdate=u))}if(o!==null){var x=l.baseState;s=0,v=d=u=null,i=o;do{var m=i.lane,y=i.eventTime;if((r&m)===m){v!==null&&(v=v.next={eventTime:y,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var S=e,b=i;switch(m=t,y=n,b.tag){case 1:if(S=b.payload,typeof S=="function"){x=S.call(y,x,m);break e}x=S;break e;case 3:S.flags=S.flags&-65537|128;case 0:if(S=b.payload,m=typeof S=="function"?S.call(y,x,m):S,m==null)break e;x=de({},x,m);break e;case 2:Ot=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,m=l.effects,m===null?l.effects=[i]:m.push(i))}else y={eventTime:y,lane:m,tag:i.tag,payload:i.payload,callback:i.callback,next:null},v===null?(d=v=y,u=x):v=v.next=y,s|=m;if(i=i.next,i===null){if(i=l.shared.pending,i===null)break;m=i,i=m.next,m.next=null,l.lastBaseUpdate=m,l.shared.pending=null}}while(!0);if(v===null&&(u=x),l.baseState=u,l.firstBaseUpdate=d,l.lastBaseUpdate=v,t=l.shared.interleaved,t!==null){l=t;do s|=l.lane,l=l.next;while(l!==t)}else o===null&&(l.shared.lanes=0);fn|=s,e.lanes=s,e.memoizedState=x}}function di(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(N(191,l));l.call(r)}}}var Ar={},yt=Zt(Ar),Mr=Zt(Ar),zr=Zt(Ar);function on(e){if(e===Ar)throw Error(N(174));return e}function ls(e,t){switch(re(zr,t),re(Mr,e),re(yt,Ar),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Go(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Go(t,e)}oe(yt),re(yt,t)}function Bn(){oe(yt),oe(Mr),oe(zr)}function tc(e){on(zr.current);var t=on(yt.current),n=Go(t,e.type);t!==n&&(re(Mr,e),re(yt,n))}function os(e){Mr.current===e&&(oe(yt),oe(Mr))}var ue=Zt(0);function Il(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Mo=[];function as(){for(var e=0;e<Mo.length;e++)Mo[e]._workInProgressVersionPrimary=null;Mo.length=0}var fl=Tt.ReactCurrentDispatcher,zo=Tt.ReactCurrentBatchConfig,dn=0,ce=null,ye=null,ke=null,Ol=!1,pr=!1,_r=0,np=0;function ze(){throw Error(N(321))}function ss(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!pt(e[n],t[n]))return!1;return!0}function is(e,t,n,r,l,o){if(dn=o,ce=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,fl.current=e===null||e.memoizedState===null?ap:sp,e=n(r,l),pr){o=0;do{if(pr=!1,_r=0,25<=o)throw Error(N(301));o+=1,ke=ye=null,t.updateQueue=null,fl.current=ip,e=n(r,l)}while(pr)}if(fl.current=Fl,t=ye!==null&&ye.next!==null,dn=0,ke=ye=ce=null,Ol=!1,t)throw Error(N(300));return e}function us(){var e=_r!==0;return _r=0,e}function gt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ke===null?ce.memoizedState=ke=e:ke=ke.next=e,ke}function lt(){if(ye===null){var e=ce.alternate;e=e!==null?e.memoizedState:null}else e=ye.next;var t=ke===null?ce.memoizedState:ke.next;if(t!==null)ke=t,ye=e;else{if(e===null)throw Error(N(310));ye=e,e={memoizedState:ye.memoizedState,baseState:ye.baseState,baseQueue:ye.baseQueue,queue:ye.queue,next:null},ke===null?ce.memoizedState=ke=e:ke=ke.next=e}return ke}function Tr(e,t){return typeof t=="function"?t(e):t}function _o(e){var t=lt(),n=t.queue;if(n===null)throw Error(N(311));n.lastRenderedReducer=e;var r=ye,l=r.baseQueue,o=n.pending;if(o!==null){if(l!==null){var s=l.next;l.next=o.next,o.next=s}r.baseQueue=l=o,n.pending=null}if(l!==null){o=l.next,r=r.baseState;var i=s=null,u=null,d=o;do{var v=d.lane;if((dn&v)===v)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var x={lane:v,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(i=u=x,s=r):u=u.next=x,ce.lanes|=v,fn|=v}d=d.next}while(d!==null&&d!==o);u===null?s=r:u.next=i,pt(r,t.memoizedState)||(De=!0),t.memoizedState=r,t.baseState=s,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do o=l.lane,ce.lanes|=o,fn|=o,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function To(e){var t=lt(),n=t.queue;if(n===null)throw Error(N(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,o=t.memoizedState;if(l!==null){n.pending=null;var s=l=l.next;do o=e(o,s.action),s=s.next;while(s!==l);pt(o,t.memoizedState)||(De=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function nc(){}function rc(e,t){var n=ce,r=lt(),l=t(),o=!pt(r.memoizedState,l);if(o&&(r.memoizedState=l,De=!0),r=r.queue,cs(ac.bind(null,n,r,e),[e]),r.getSnapshot!==t||o||ke!==null&&ke.memoizedState.tag&1){if(n.flags|=2048,Lr(9,oc.bind(null,n,r,l,t),void 0,null),je===null)throw Error(N(349));dn&30||lc(n,t,l)}return l}function lc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ce.updateQueue,t===null?(t={lastEffect:null,stores:null},ce.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function oc(e,t,n,r){t.value=n,t.getSnapshot=r,sc(t)&&ic(e)}function ac(e,t,n){return n(function(){sc(t)&&ic(e)})}function sc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!pt(e,n)}catch{return!0}}function ic(e){var t=zt(e,1);t!==null&&ft(t,e,1,-1)}function fi(e){var t=gt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Tr,lastRenderedState:e},t.queue=e,e=e.dispatch=op.bind(null,ce,e),[t.memoizedState,e]}function Lr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=ce.updateQueue,t===null?(t={lastEffect:null,stores:null},ce.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function uc(){return lt().memoizedState}function pl(e,t,n,r){var l=gt();ce.flags|=e,l.memoizedState=Lr(1|t,n,void 0,r===void 0?null:r)}function Xl(e,t,n,r){var l=lt();r=r===void 0?null:r;var o=void 0;if(ye!==null){var s=ye.memoizedState;if(o=s.destroy,r!==null&&ss(r,s.deps)){l.memoizedState=Lr(t,n,o,r);return}}ce.flags|=e,l.memoizedState=Lr(1|t,n,o,r)}function pi(e,t){return pl(8390656,8,e,t)}function cs(e,t){return Xl(2048,8,e,t)}function cc(e,t){return Xl(4,2,e,t)}function dc(e,t){return Xl(4,4,e,t)}function fc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function pc(e,t,n){return n=n!=null?n.concat([e]):null,Xl(4,4,fc.bind(null,t,e),n)}function ds(){}function mc(e,t){var n=lt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ss(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function hc(e,t){var n=lt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ss(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function gc(e,t,n){return dn&21?(pt(n,t)||(n=ku(),ce.lanes|=n,fn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,De=!0),e.memoizedState=n)}function rp(e,t){var n=Z;Z=n!==0&&4>n?n:4,e(!0);var r=zo.transition;zo.transition={};try{e(!1),t()}finally{Z=n,zo.transition=r}}function xc(){return lt().memoizedState}function lp(e,t,n){var r=Qt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},vc(e))yc(t,n);else if(n=Ju(e,t,n,r),n!==null){var l=Re();ft(n,e,r,l),wc(n,t,r)}}function op(e,t,n){var r=Qt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(vc(e))yc(t,l);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var s=t.lastRenderedState,i=o(s,n);if(l.hasEagerState=!0,l.eagerState=i,pt(i,s)){var u=t.interleaved;u===null?(l.next=l,ns(t)):(l.next=u.next,u.next=l),t.interleaved=l;return}}catch{}finally{}n=Ju(e,t,l,r),n!==null&&(l=Re(),ft(n,e,r,l),wc(n,t,r))}}function vc(e){var t=e.alternate;return e===ce||t!==null&&t===ce}function yc(e,t){pr=Ol=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function wc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ha(e,n)}}var Fl={readContext:rt,useCallback:ze,useContext:ze,useEffect:ze,useImperativeHandle:ze,useInsertionEffect:ze,useLayoutEffect:ze,useMemo:ze,useReducer:ze,useRef:ze,useState:ze,useDebugValue:ze,useDeferredValue:ze,useTransition:ze,useMutableSource:ze,useSyncExternalStore:ze,useId:ze,unstable_isNewReconciler:!1},ap={readContext:rt,useCallback:function(e,t){return gt().memoizedState=[e,t===void 0?null:t],e},useContext:rt,useEffect:pi,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,pl(4194308,4,fc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return pl(4194308,4,e,t)},useInsertionEffect:function(e,t){return pl(4,2,e,t)},useMemo:function(e,t){var n=gt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=gt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=lp.bind(null,ce,e),[r.memoizedState,e]},useRef:function(e){var t=gt();return e={current:e},t.memoizedState=e},useState:fi,useDebugValue:ds,useDeferredValue:function(e){return gt().memoizedState=e},useTransition:function(){var e=fi(!1),t=e[0];return e=rp.bind(null,e[1]),gt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=ce,l=gt();if(ie){if(n===void 0)throw Error(N(407));n=n()}else{if(n=t(),je===null)throw Error(N(349));dn&30||lc(r,t,n)}l.memoizedState=n;var o={value:n,getSnapshot:t};return l.queue=o,pi(ac.bind(null,r,o,e),[e]),r.flags|=2048,Lr(9,oc.bind(null,r,o,n,t),void 0,null),n},useId:function(){var e=gt(),t=je.identifierPrefix;if(ie){var n=Ct,r=Nt;n=(r&~(1<<32-dt(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=_r++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=np++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},sp={readContext:rt,useCallback:mc,useContext:rt,useEffect:cs,useImperativeHandle:pc,useInsertionEffect:cc,useLayoutEffect:dc,useMemo:hc,useReducer:_o,useRef:uc,useState:function(){return _o(Tr)},useDebugValue:ds,useDeferredValue:function(e){var t=lt();return gc(t,ye.memoizedState,e)},useTransition:function(){var e=_o(Tr)[0],t=lt().memoizedState;return[e,t]},useMutableSource:nc,useSyncExternalStore:rc,useId:xc,unstable_isNewReconciler:!1},ip={readContext:rt,useCallback:mc,useContext:rt,useEffect:cs,useImperativeHandle:pc,useInsertionEffect:cc,useLayoutEffect:dc,useMemo:hc,useReducer:To,useRef:uc,useState:function(){return To(Tr)},useDebugValue:ds,useDeferredValue:function(e){var t=lt();return ye===null?t.memoizedState=e:gc(t,ye.memoizedState,e)},useTransition:function(){var e=To(Tr)[0],t=lt().memoizedState;return[e,t]},useMutableSource:nc,useSyncExternalStore:rc,useId:xc,unstable_isNewReconciler:!1};function it(e,t){if(e&&e.defaultProps){t=de({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function pa(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:de({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Zl={isMounted:function(e){return(e=e._reactInternals)?hn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Re(),l=Qt(e),o=bt(r,l);o.payload=t,n!=null&&(o.callback=n),t=Wt(e,o,l),t!==null&&(ft(t,e,l,r),dl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Re(),l=Qt(e),o=bt(r,l);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=Wt(e,o,l),t!==null&&(ft(t,e,l,r),dl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Re(),r=Qt(e),l=bt(n,r);l.tag=2,t!=null&&(l.callback=t),t=Wt(e,l,r),t!==null&&(ft(t,e,r,n),dl(t,e,r))}};function mi(e,t,n,r,l,o,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,s):t.prototype&&t.prototype.isPureReactComponent?!Nr(n,r)||!Nr(l,o):!0}function kc(e,t,n){var r=!1,l=Kt,o=t.contextType;return typeof o=="object"&&o!==null?o=rt(o):(l=$e(t)?un:Le.current,r=t.contextTypes,o=(r=r!=null)?Fn(e,l):Kt),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Zl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=o),t}function hi(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Zl.enqueueReplaceState(t,t.state,null)}function ma(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},rs(e);var o=t.contextType;typeof o=="object"&&o!==null?l.context=rt(o):(o=$e(t)?un:Le.current,l.context=Fn(e,o)),l.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(pa(e,t,o,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Zl.enqueueReplaceState(l,l.state,null),Rl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function $n(e,t){try{var n="",r=t;do n+=Id(r),r=r.return;while(r);var l=n}catch(o){l=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:l,digest:null}}function Lo(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ha(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var up=typeof WeakMap=="function"?WeakMap:Map;function jc(e,t,n){n=bt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Dl||(Dl=!0,Ca=r),ha(e,t)},n}function Sc(e,t,n){n=bt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){ha(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){ha(e,t),typeof r!="function"&&(Gt===null?Gt=new Set([this]):Gt.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function gi(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new up;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Sp.bind(null,e,t,n),t.then(e,e))}function xi(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function vi(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=bt(-1,1),t.tag=2,Wt(n,t,1))),n.lanes|=1),e)}var cp=Tt.ReactCurrentOwner,De=!1;function Pe(e,t,n,r){t.child=e===null?Zu(t,null,n,r):Dn(t,e.child,n,r)}function yi(e,t,n,r,l){n=n.render;var o=t.ref;return Rn(t,l),r=is(e,t,n,r,o,l),n=us(),e!==null&&!De?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,_t(e,t,l)):(ie&&n&&Ka(t),t.flags|=1,Pe(e,t,r,l),t.child)}function wi(e,t,n,r,l){if(e===null){var o=n.type;return typeof o=="function"&&!ys(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,Nc(e,t,o,r,l)):(e=xl(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&l)){var s=o.memoizedProps;if(n=n.compare,n=n!==null?n:Nr,n(s,r)&&e.ref===t.ref)return _t(e,t,l)}return t.flags|=1,e=qt(o,r),e.ref=t.ref,e.return=t,t.child=e}function Nc(e,t,n,r,l){if(e!==null){var o=e.memoizedProps;if(Nr(o,r)&&e.ref===t.ref)if(De=!1,t.pendingProps=r=o,(e.lanes&l)!==0)e.flags&131072&&(De=!0);else return t.lanes=e.lanes,_t(e,t,l)}return ga(e,t,n,r,l)}function Cc(e,t,n){var r=t.pendingProps,l=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},re(zn,We),We|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,re(zn,We),We|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:n,re(zn,We),We|=r}else o!==null?(r=o.baseLanes|n,t.memoizedState=null):r=n,re(zn,We),We|=r;return Pe(e,t,l,n),t.child}function bc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ga(e,t,n,r,l){var o=$e(n)?un:Le.current;return o=Fn(t,o),Rn(t,l),n=is(e,t,n,r,o,l),r=us(),e!==null&&!De?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,_t(e,t,l)):(ie&&r&&Ka(t),t.flags|=1,Pe(e,t,n,l),t.child)}function ki(e,t,n,r,l){if($e(n)){var o=!0;zl(t)}else o=!1;if(Rn(t,l),t.stateNode===null)ml(e,t),kc(t,n,r),ma(t,n,r,l),r=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var u=s.context,d=n.contextType;typeof d=="object"&&d!==null?d=rt(d):(d=$e(n)?un:Le.current,d=Fn(t,d));var v=n.getDerivedStateFromProps,x=typeof v=="function"||typeof s.getSnapshotBeforeUpdate=="function";x||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==r||u!==d)&&hi(t,s,r,d),Ot=!1;var m=t.memoizedState;s.state=m,Rl(t,r,s,l),u=t.memoizedState,i!==r||m!==u||Be.current||Ot?(typeof v=="function"&&(pa(t,n,v,r),u=t.memoizedState),(i=Ot||mi(t,n,i,r,m,u,d))?(x||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),s.props=r,s.state=u,s.context=d,r=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,ec(e,t),i=t.memoizedProps,d=t.type===t.elementType?i:it(t.type,i),s.props=d,x=t.pendingProps,m=s.context,u=n.contextType,typeof u=="object"&&u!==null?u=rt(u):(u=$e(n)?un:Le.current,u=Fn(t,u));var y=n.getDerivedStateFromProps;(v=typeof y=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==x||m!==u)&&hi(t,s,r,u),Ot=!1,m=t.memoizedState,s.state=m,Rl(t,r,s,l);var S=t.memoizedState;i!==x||m!==S||Be.current||Ot?(typeof y=="function"&&(pa(t,n,y,r),S=t.memoizedState),(d=Ot||mi(t,n,d,r,m,S,u)||!1)?(v||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,S,u),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,S,u)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=S),s.props=r,s.state=S,s.context=u,r=d):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),r=!1)}return xa(e,t,n,r,o,l)}function xa(e,t,n,r,l,o){bc(e,t);var s=(t.flags&128)!==0;if(!r&&!s)return l&&ai(t,n,!1),_t(e,t,o);r=t.stateNode,cp.current=t;var i=s&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&s?(t.child=Dn(t,e.child,null,o),t.child=Dn(t,null,i,o)):Pe(e,t,i,o),t.memoizedState=r.state,l&&ai(t,n,!0),t.child}function Ec(e){var t=e.stateNode;t.pendingContext?oi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&oi(e,t.context,!1),ls(e,t.containerInfo)}function ji(e,t,n,r,l){return An(),Za(l),t.flags|=256,Pe(e,t,n,r),t.child}var va={dehydrated:null,treeContext:null,retryLane:0};function ya(e){return{baseLanes:e,cachePool:null,transitions:null}}function Mc(e,t,n){var r=t.pendingProps,l=ue.current,o=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(l&2)!==0),i?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),re(ue,l&1),e===null)return da(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=r.children,e=r.fallback,o?(r=t.mode,o=t.child,s={mode:"hidden",children:s},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=to(s,r,0,null),e=sn(e,r,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=ya(n),t.memoizedState=va,e):fs(t,s));if(l=e.memoizedState,l!==null&&(i=l.dehydrated,i!==null))return dp(e,t,s,r,i,l,n);if(o){o=r.fallback,s=t.mode,l=e.child,i=l.sibling;var u={mode:"hidden",children:r.children};return!(s&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=qt(l,u),r.subtreeFlags=l.subtreeFlags&14680064),i!==null?o=qt(i,o):(o=sn(o,s,n,null),o.flags|=2),o.return=t,r.return=t,r.sibling=o,t.child=r,r=o,o=t.child,s=e.child.memoizedState,s=s===null?ya(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=e.childLanes&~n,t.memoizedState=va,r}return o=e.child,e=o.sibling,r=qt(o,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function fs(e,t){return t=to({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function tl(e,t,n,r){return r!==null&&Za(r),Dn(t,e.child,null,n),e=fs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function dp(e,t,n,r,l,o,s){if(n)return t.flags&256?(t.flags&=-257,r=Lo(Error(N(422))),tl(e,t,s,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=r.fallback,l=t.mode,r=to({mode:"visible",children:r.children},l,0,null),o=sn(o,l,s,null),o.flags|=2,r.return=t,o.return=t,r.sibling=o,t.child=r,t.mode&1&&Dn(t,e.child,null,s),t.child.memoizedState=ya(s),t.memoizedState=va,o);if(!(t.mode&1))return tl(e,t,s,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var i=r.dgst;return r=i,o=Error(N(419)),r=Lo(o,r,void 0),tl(e,t,s,r)}if(i=(s&e.childLanes)!==0,De||i){if(r=je,r!==null){switch(s&-s){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|s)?0:l,l!==0&&l!==o.retryLane&&(o.retryLane=l,zt(e,l),ft(r,e,l,-1))}return vs(),r=Lo(Error(N(421))),tl(e,t,s,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Np.bind(null,e),l._reactRetry=t,null):(e=o.treeContext,Qe=Vt(l.nextSibling),qe=t,ie=!0,ct=null,e!==null&&(Je[et++]=Nt,Je[et++]=Ct,Je[et++]=cn,Nt=e.id,Ct=e.overflow,cn=t),t=fs(t,r.children),t.flags|=4096,t)}function Si(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),fa(e.return,t,n)}function Po(e,t,n,r,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=l)}function zc(e,t,n){var r=t.pendingProps,l=r.revealOrder,o=r.tail;if(Pe(e,t,r.children,n),r=ue.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Si(e,n,t);else if(e.tag===19)Si(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(re(ue,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Il(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Po(t,!1,l,n,o);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Il(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Po(t,!0,n,null,o);break;case"together":Po(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ml(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function _t(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),fn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(N(153));if(t.child!==null){for(e=t.child,n=qt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=qt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function fp(e,t,n){switch(t.tag){case 3:Ec(t),An();break;case 5:tc(t);break;case 1:$e(t.type)&&zl(t);break;case 4:ls(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;re(Ll,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(re(ue,ue.current&1),t.flags|=128,null):n&t.child.childLanes?Mc(e,t,n):(re(ue,ue.current&1),e=_t(e,t,n),e!==null?e.sibling:null);re(ue,ue.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return zc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),re(ue,ue.current),r)break;return null;case 22:case 23:return t.lanes=0,Cc(e,t,n)}return _t(e,t,n)}var _c,wa,Tc,Lc;_c=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};wa=function(){};Tc=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,on(yt.current);var o=null;switch(n){case"input":l=Ho(e,l),r=Ho(e,r),o=[];break;case"select":l=de({},l,{value:void 0}),r=de({},r,{value:void 0}),o=[];break;case"textarea":l=Wo(e,l),r=Wo(e,r),o=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=El)}Qo(n,r);var s;n=null;for(d in l)if(!r.hasOwnProperty(d)&&l.hasOwnProperty(d)&&l[d]!=null)if(d==="style"){var i=l[d];for(s in i)i.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(xr.hasOwnProperty(d)?o||(o=[]):(o=o||[]).push(d,null));for(d in r){var u=r[d];if(i=l!=null?l[d]:void 0,r.hasOwnProperty(d)&&u!==i&&(u!=null||i!=null))if(d==="style")if(i){for(s in i)!i.hasOwnProperty(s)||u&&u.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in u)u.hasOwnProperty(s)&&i[s]!==u[s]&&(n||(n={}),n[s]=u[s])}else n||(o||(o=[]),o.push(d,n)),n=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,i=i?i.__html:void 0,u!=null&&i!==u&&(o=o||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(o=o||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(xr.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&le("scroll",e),o||i===u||(o=[])):(o=o||[]).push(d,u))}n&&(o=o||[]).push("style",n);var d=o;(t.updateQueue=d)&&(t.flags|=4)}};Lc=function(e,t,n,r){n!==r&&(t.flags|=4)};function er(e,t){if(!ie)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function _e(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function pp(e,t,n){var r=t.pendingProps;switch(Xa(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _e(t),null;case 1:return $e(t.type)&&Ml(),_e(t),null;case 3:return r=t.stateNode,Bn(),oe(Be),oe(Le),as(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Jr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,ct!==null&&(Ma(ct),ct=null))),wa(e,t),_e(t),null;case 5:os(t);var l=on(zr.current);if(n=t.type,e!==null&&t.stateNode!=null)Tc(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(N(166));return _e(t),null}if(e=on(yt.current),Jr(t)){r=t.stateNode,n=t.type;var o=t.memoizedProps;switch(r[xt]=t,r[Er]=o,e=(t.mode&1)!==0,n){case"dialog":le("cancel",r),le("close",r);break;case"iframe":case"object":case"embed":le("load",r);break;case"video":case"audio":for(l=0;l<ar.length;l++)le(ar[l],r);break;case"source":le("error",r);break;case"img":case"image":case"link":le("error",r),le("load",r);break;case"details":le("toggle",r);break;case"input":Ls(r,o),le("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},le("invalid",r);break;case"textarea":Rs(r,o),le("invalid",r)}Qo(n,o),l=null;for(var s in o)if(o.hasOwnProperty(s)){var i=o[s];s==="children"?typeof i=="string"?r.textContent!==i&&(o.suppressHydrationWarning!==!0&&Zr(r.textContent,i,e),l=["children",i]):typeof i=="number"&&r.textContent!==""+i&&(o.suppressHydrationWarning!==!0&&Zr(r.textContent,i,e),l=["children",""+i]):xr.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&le("scroll",r)}switch(n){case"input":Vr(r),Ps(r,o,!0);break;case"textarea":Vr(r),Is(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=El)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{s=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=au(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(n,{is:r.is}):(e=s.createElement(n),n==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,n),e[xt]=t,e[Er]=r,_c(e,t,!1,!1),t.stateNode=e;e:{switch(s=qo(n,r),n){case"dialog":le("cancel",e),le("close",e),l=r;break;case"iframe":case"object":case"embed":le("load",e),l=r;break;case"video":case"audio":for(l=0;l<ar.length;l++)le(ar[l],e);l=r;break;case"source":le("error",e),l=r;break;case"img":case"image":case"link":le("error",e),le("load",e),l=r;break;case"details":le("toggle",e),l=r;break;case"input":Ls(e,r),l=Ho(e,r),le("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=de({},r,{value:void 0}),le("invalid",e);break;case"textarea":Rs(e,r),l=Wo(e,r),le("invalid",e);break;default:l=r}Qo(n,l),i=l;for(o in i)if(i.hasOwnProperty(o)){var u=i[o];o==="style"?uu(e,u):o==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&su(e,u)):o==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&vr(e,u):typeof u=="number"&&vr(e,""+u):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(xr.hasOwnProperty(o)?u!=null&&o==="onScroll"&&le("scroll",e):u!=null&&Oa(e,o,u,s))}switch(n){case"input":Vr(e),Ps(e,r,!1);break;case"textarea":Vr(e),Is(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Yt(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?_n(e,!!r.multiple,o,!1):r.defaultValue!=null&&_n(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=El)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return _e(t),null;case 6:if(e&&t.stateNode!=null)Lc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(N(166));if(n=on(zr.current),on(yt.current),Jr(t)){if(r=t.stateNode,n=t.memoizedProps,r[xt]=t,(o=r.nodeValue!==n)&&(e=qe,e!==null))switch(e.tag){case 3:Zr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Zr(r.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[xt]=t,t.stateNode=r}return _e(t),null;case 13:if(oe(ue),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ie&&Qe!==null&&t.mode&1&&!(t.flags&128))Ku(),An(),t.flags|=98560,o=!1;else if(o=Jr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(N(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(N(317));o[xt]=t}else An(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;_e(t),o=!1}else ct!==null&&(Ma(ct),ct=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||ue.current&1?we===0&&(we=3):vs())),t.updateQueue!==null&&(t.flags|=4),_e(t),null);case 4:return Bn(),wa(e,t),e===null&&Cr(t.stateNode.containerInfo),_e(t),null;case 10:return ts(t.type._context),_e(t),null;case 17:return $e(t.type)&&Ml(),_e(t),null;case 19:if(oe(ue),o=t.memoizedState,o===null)return _e(t),null;if(r=(t.flags&128)!==0,s=o.rendering,s===null)if(r)er(o,!1);else{if(we!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=Il(e),s!==null){for(t.flags|=128,er(o,!1),r=s.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)o=n,e=r,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,e=s.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return re(ue,ue.current&1|2),t.child}e=e.sibling}o.tail!==null&&me()>Hn&&(t.flags|=128,r=!0,er(o,!1),t.lanes=4194304)}else{if(!r)if(e=Il(s),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),er(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!ie)return _e(t),null}else 2*me()-o.renderingStartTime>Hn&&n!==1073741824&&(t.flags|=128,r=!0,er(o,!1),t.lanes=4194304);o.isBackwards?(s.sibling=t.child,t.child=s):(n=o.last,n!==null?n.sibling=s:t.child=s,o.last=s)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=me(),t.sibling=null,n=ue.current,re(ue,r?n&1|2:n&1),t):(_e(t),null);case 22:case 23:return xs(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?We&1073741824&&(_e(t),t.subtreeFlags&6&&(t.flags|=8192)):_e(t),null;case 24:return null;case 25:return null}throw Error(N(156,t.tag))}function mp(e,t){switch(Xa(t),t.tag){case 1:return $e(t.type)&&Ml(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Bn(),oe(Be),oe(Le),as(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return os(t),null;case 13:if(oe(ue),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(N(340));An()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return oe(ue),null;case 4:return Bn(),null;case 10:return ts(t.type._context),null;case 22:case 23:return xs(),null;case 24:return null;default:return null}}var nl=!1,Te=!1,hp=typeof WeakSet=="function"?WeakSet:Set,L=null;function Mn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){fe(e,t,r)}else n.current=null}function ka(e,t,n){try{n()}catch(r){fe(e,t,r)}}var Ni=!1;function gp(e,t){if(la=Nl,e=Fu(),Ya(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var s=0,i=-1,u=-1,d=0,v=0,x=e,m=null;t:for(;;){for(var y;x!==n||l!==0&&x.nodeType!==3||(i=s+l),x!==o||r!==0&&x.nodeType!==3||(u=s+r),x.nodeType===3&&(s+=x.nodeValue.length),(y=x.firstChild)!==null;)m=x,x=y;for(;;){if(x===e)break t;if(m===n&&++d===l&&(i=s),m===o&&++v===r&&(u=s),(y=x.nextSibling)!==null)break;x=m,m=x.parentNode}x=y}n=i===-1||u===-1?null:{start:i,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(oa={focusedElem:e,selectionRange:n},Nl=!1,L=t;L!==null;)if(t=L,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,L=e;else for(;L!==null;){t=L;try{var S=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(S!==null){var b=S.memoizedProps,R=S.memoizedState,g=t.stateNode,c=g.getSnapshotBeforeUpdate(t.elementType===t.type?b:it(t.type,b),R);g.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var h=t.stateNode.containerInfo;h.nodeType===1?h.textContent="":h.nodeType===9&&h.documentElement&&h.removeChild(h.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(N(163))}}catch(w){fe(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,L=e;break}L=t.return}return S=Ni,Ni=!1,S}function mr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var o=l.destroy;l.destroy=void 0,o!==void 0&&ka(t,n,o)}l=l.next}while(l!==r)}}function Jl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function ja(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Pc(e){var t=e.alternate;t!==null&&(e.alternate=null,Pc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[xt],delete t[Er],delete t[ia],delete t[Zf],delete t[Jf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Rc(e){return e.tag===5||e.tag===3||e.tag===4}function Ci(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Sa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=El));else if(r!==4&&(e=e.child,e!==null))for(Sa(e,t,n),e=e.sibling;e!==null;)Sa(e,t,n),e=e.sibling}function Na(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Na(e,t,n),e=e.sibling;e!==null;)Na(e,t,n),e=e.sibling}var Ne=null,ut=!1;function Rt(e,t,n){for(n=n.child;n!==null;)Ic(e,t,n),n=n.sibling}function Ic(e,t,n){if(vt&&typeof vt.onCommitFiberUnmount=="function")try{vt.onCommitFiberUnmount(Wl,n)}catch{}switch(n.tag){case 5:Te||Mn(n,t);case 6:var r=Ne,l=ut;Ne=null,Rt(e,t,n),Ne=r,ut=l,Ne!==null&&(ut?(e=Ne,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ne.removeChild(n.stateNode));break;case 18:Ne!==null&&(ut?(e=Ne,n=n.stateNode,e.nodeType===8?bo(e.parentNode,n):e.nodeType===1&&bo(e,n),jr(e)):bo(Ne,n.stateNode));break;case 4:r=Ne,l=ut,Ne=n.stateNode.containerInfo,ut=!0,Rt(e,t,n),Ne=r,ut=l;break;case 0:case 11:case 14:case 15:if(!Te&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var o=l,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&ka(n,t,s),l=l.next}while(l!==r)}Rt(e,t,n);break;case 1:if(!Te&&(Mn(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(i){fe(n,t,i)}Rt(e,t,n);break;case 21:Rt(e,t,n);break;case 22:n.mode&1?(Te=(r=Te)||n.memoizedState!==null,Rt(e,t,n),Te=r):Rt(e,t,n);break;default:Rt(e,t,n)}}function bi(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new hp),t.forEach(function(r){var l=Cp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function st(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var o=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:Ne=i.stateNode,ut=!1;break e;case 3:Ne=i.stateNode.containerInfo,ut=!0;break e;case 4:Ne=i.stateNode.containerInfo,ut=!0;break e}i=i.return}if(Ne===null)throw Error(N(160));Ic(o,s,l),Ne=null,ut=!1;var u=l.alternate;u!==null&&(u.return=null),l.return=null}catch(d){fe(l,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Oc(t,e),t=t.sibling}function Oc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(st(t,e),ht(e),r&4){try{mr(3,e,e.return),Jl(3,e)}catch(b){fe(e,e.return,b)}try{mr(5,e,e.return)}catch(b){fe(e,e.return,b)}}break;case 1:st(t,e),ht(e),r&512&&n!==null&&Mn(n,n.return);break;case 5:if(st(t,e),ht(e),r&512&&n!==null&&Mn(n,n.return),e.flags&32){var l=e.stateNode;try{vr(l,"")}catch(b){fe(e,e.return,b)}}if(r&4&&(l=e.stateNode,l!=null)){var o=e.memoizedProps,s=n!==null?n.memoizedProps:o,i=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{i==="input"&&o.type==="radio"&&o.name!=null&&lu(l,o),qo(i,s);var d=qo(i,o);for(s=0;s<u.length;s+=2){var v=u[s],x=u[s+1];v==="style"?uu(l,x):v==="dangerouslySetInnerHTML"?su(l,x):v==="children"?vr(l,x):Oa(l,v,x,d)}switch(i){case"input":Uo(l,o);break;case"textarea":ou(l,o);break;case"select":var m=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!o.multiple;var y=o.value;y!=null?_n(l,!!o.multiple,y,!1):m!==!!o.multiple&&(o.defaultValue!=null?_n(l,!!o.multiple,o.defaultValue,!0):_n(l,!!o.multiple,o.multiple?[]:"",!1))}l[Er]=o}catch(b){fe(e,e.return,b)}}break;case 6:if(st(t,e),ht(e),r&4){if(e.stateNode===null)throw Error(N(162));l=e.stateNode,o=e.memoizedProps;try{l.nodeValue=o}catch(b){fe(e,e.return,b)}}break;case 3:if(st(t,e),ht(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{jr(t.containerInfo)}catch(b){fe(e,e.return,b)}break;case 4:st(t,e),ht(e);break;case 13:st(t,e),ht(e),l=e.child,l.flags&8192&&(o=l.memoizedState!==null,l.stateNode.isHidden=o,!o||l.alternate!==null&&l.alternate.memoizedState!==null||(hs=me())),r&4&&bi(e);break;case 22:if(v=n!==null&&n.memoizedState!==null,e.mode&1?(Te=(d=Te)||v,st(t,e),Te=d):st(t,e),ht(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!v&&e.mode&1)for(L=e,v=e.child;v!==null;){for(x=L=v;L!==null;){switch(m=L,y=m.child,m.tag){case 0:case 11:case 14:case 15:mr(4,m,m.return);break;case 1:Mn(m,m.return);var S=m.stateNode;if(typeof S.componentWillUnmount=="function"){r=m,n=m.return;try{t=r,S.props=t.memoizedProps,S.state=t.memoizedState,S.componentWillUnmount()}catch(b){fe(r,n,b)}}break;case 5:Mn(m,m.return);break;case 22:if(m.memoizedState!==null){Mi(x);continue}}y!==null?(y.return=m,L=y):Mi(x)}v=v.sibling}e:for(v=null,x=e;;){if(x.tag===5){if(v===null){v=x;try{l=x.stateNode,d?(o=l.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(i=x.stateNode,u=x.memoizedProps.style,s=u!=null&&u.hasOwnProperty("display")?u.display:null,i.style.display=iu("display",s))}catch(b){fe(e,e.return,b)}}}else if(x.tag===6){if(v===null)try{x.stateNode.nodeValue=d?"":x.memoizedProps}catch(b){fe(e,e.return,b)}}else if((x.tag!==22&&x.tag!==23||x.memoizedState===null||x===e)&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===e)break e;for(;x.sibling===null;){if(x.return===null||x.return===e)break e;v===x&&(v=null),x=x.return}v===x&&(v=null),x.sibling.return=x.return,x=x.sibling}}break;case 19:st(t,e),ht(e),r&4&&bi(e);break;case 21:break;default:st(t,e),ht(e)}}function ht(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Rc(n)){var r=n;break e}n=n.return}throw Error(N(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(vr(l,""),r.flags&=-33);var o=Ci(e);Na(e,o,l);break;case 3:case 4:var s=r.stateNode.containerInfo,i=Ci(e);Sa(e,i,s);break;default:throw Error(N(161))}}catch(u){fe(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function xp(e,t,n){L=e,Fc(e)}function Fc(e,t,n){for(var r=(e.mode&1)!==0;L!==null;){var l=L,o=l.child;if(l.tag===22&&r){var s=l.memoizedState!==null||nl;if(!s){var i=l.alternate,u=i!==null&&i.memoizedState!==null||Te;i=nl;var d=Te;if(nl=s,(Te=u)&&!d)for(L=l;L!==null;)s=L,u=s.child,s.tag===22&&s.memoizedState!==null?zi(l):u!==null?(u.return=s,L=u):zi(l);for(;o!==null;)L=o,Fc(o),o=o.sibling;L=l,nl=i,Te=d}Ei(e)}else l.subtreeFlags&8772&&o!==null?(o.return=l,L=o):Ei(e)}}function Ei(e){for(;L!==null;){var t=L;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Te||Jl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Te)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:it(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&di(t,o,r);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}di(t,s,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var v=d.memoizedState;if(v!==null){var x=v.dehydrated;x!==null&&jr(x)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(N(163))}Te||t.flags&512&&ja(t)}catch(m){fe(t,t.return,m)}}if(t===e){L=null;break}if(n=t.sibling,n!==null){n.return=t.return,L=n;break}L=t.return}}function Mi(e){for(;L!==null;){var t=L;if(t===e){L=null;break}var n=t.sibling;if(n!==null){n.return=t.return,L=n;break}L=t.return}}function zi(e){for(;L!==null;){var t=L;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Jl(4,t)}catch(u){fe(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(u){fe(t,l,u)}}var o=t.return;try{ja(t)}catch(u){fe(t,o,u)}break;case 5:var s=t.return;try{ja(t)}catch(u){fe(t,s,u)}}}catch(u){fe(t,t.return,u)}if(t===e){L=null;break}var i=t.sibling;if(i!==null){i.return=t.return,L=i;break}L=t.return}}var vp=Math.ceil,Al=Tt.ReactCurrentDispatcher,ps=Tt.ReactCurrentOwner,nt=Tt.ReactCurrentBatchConfig,Y=0,je=null,ge=null,Ce=0,We=0,zn=Zt(0),we=0,Pr=null,fn=0,eo=0,ms=0,hr=null,Ae=null,hs=0,Hn=1/0,jt=null,Dl=!1,Ca=null,Gt=null,rl=!1,Bt=null,Bl=0,gr=0,ba=null,hl=-1,gl=0;function Re(){return Y&6?me():hl!==-1?hl:hl=me()}function Qt(e){return e.mode&1?Y&2&&Ce!==0?Ce&-Ce:tp.transition!==null?(gl===0&&(gl=ku()),gl):(e=Z,e!==0||(e=window.event,e=e===void 0?16:Mu(e.type)),e):1}function ft(e,t,n,r){if(50<gr)throw gr=0,ba=null,Error(N(185));Ir(e,n,r),(!(Y&2)||e!==je)&&(e===je&&(!(Y&2)&&(eo|=n),we===4&&At(e,Ce)),He(e,r),n===1&&Y===0&&!(t.mode&1)&&(Hn=me()+500,Kl&&Jt()))}function He(e,t){var n=e.callbackNode;ef(e,t);var r=Sl(e,e===je?Ce:0);if(r===0)n!==null&&As(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&As(n),t===1)e.tag===0?ep(_i.bind(null,e)):Qu(_i.bind(null,e)),Kf(function(){!(Y&6)&&Jt()}),n=null;else{switch(ju(r)){case 1:n=$a;break;case 4:n=yu;break;case 16:n=jl;break;case 536870912:n=wu;break;default:n=jl}n=Wc(n,Ac.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Ac(e,t){if(hl=-1,gl=0,Y&6)throw Error(N(327));var n=e.callbackNode;if(In()&&e.callbackNode!==n)return null;var r=Sl(e,e===je?Ce:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=$l(e,r);else{t=r;var l=Y;Y|=2;var o=Bc();(je!==e||Ce!==t)&&(jt=null,Hn=me()+500,an(e,t));do try{kp();break}catch(i){Dc(e,i)}while(!0);es(),Al.current=o,Y=l,ge!==null?t=0:(je=null,Ce=0,t=we)}if(t!==0){if(t===2&&(l=Jo(e),l!==0&&(r=l,t=Ea(e,l))),t===1)throw n=Pr,an(e,0),At(e,r),He(e,me()),n;if(t===6)At(e,r);else{if(l=e.current.alternate,!(r&30)&&!yp(l)&&(t=$l(e,r),t===2&&(o=Jo(e),o!==0&&(r=o,t=Ea(e,o))),t===1))throw n=Pr,an(e,0),At(e,r),He(e,me()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(N(345));case 2:nn(e,Ae,jt);break;case 3:if(At(e,r),(r&130023424)===r&&(t=hs+500-me(),10<t)){if(Sl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Re(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=sa(nn.bind(null,e,Ae,jt),t);break}nn(e,Ae,jt);break;case 4:if(At(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var s=31-dt(r);o=1<<s,s=t[s],s>l&&(l=s),r&=~o}if(r=l,r=me()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*vp(r/1960))-r,10<r){e.timeoutHandle=sa(nn.bind(null,e,Ae,jt),r);break}nn(e,Ae,jt);break;case 5:nn(e,Ae,jt);break;default:throw Error(N(329))}}}return He(e,me()),e.callbackNode===n?Ac.bind(null,e):null}function Ea(e,t){var n=hr;return e.current.memoizedState.isDehydrated&&(an(e,t).flags|=256),e=$l(e,t),e!==2&&(t=Ae,Ae=n,t!==null&&Ma(t)),e}function Ma(e){Ae===null?Ae=e:Ae.push.apply(Ae,e)}function yp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],o=l.getSnapshot;l=l.value;try{if(!pt(o(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function At(e,t){for(t&=~ms,t&=~eo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-dt(t),r=1<<n;e[n]=-1,t&=~r}}function _i(e){if(Y&6)throw Error(N(327));In();var t=Sl(e,0);if(!(t&1))return He(e,me()),null;var n=$l(e,t);if(e.tag!==0&&n===2){var r=Jo(e);r!==0&&(t=r,n=Ea(e,r))}if(n===1)throw n=Pr,an(e,0),At(e,t),He(e,me()),n;if(n===6)throw Error(N(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,nn(e,Ae,jt),He(e,me()),null}function gs(e,t){var n=Y;Y|=1;try{return e(t)}finally{Y=n,Y===0&&(Hn=me()+500,Kl&&Jt())}}function pn(e){Bt!==null&&Bt.tag===0&&!(Y&6)&&In();var t=Y;Y|=1;var n=nt.transition,r=Z;try{if(nt.transition=null,Z=1,e)return e()}finally{Z=r,nt.transition=n,Y=t,!(Y&6)&&Jt()}}function xs(){We=zn.current,oe(zn)}function an(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Yf(n)),ge!==null)for(n=ge.return;n!==null;){var r=n;switch(Xa(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ml();break;case 3:Bn(),oe(Be),oe(Le),as();break;case 5:os(r);break;case 4:Bn();break;case 13:oe(ue);break;case 19:oe(ue);break;case 10:ts(r.type._context);break;case 22:case 23:xs()}n=n.return}if(je=e,ge=e=qt(e.current,null),Ce=We=t,we=0,Pr=null,ms=eo=fn=0,Ae=hr=null,ln!==null){for(t=0;t<ln.length;t++)if(n=ln[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,o=n.pending;if(o!==null){var s=o.next;o.next=l,r.next=s}n.pending=r}ln=null}return e}function Dc(e,t){do{var n=ge;try{if(es(),fl.current=Fl,Ol){for(var r=ce.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Ol=!1}if(dn=0,ke=ye=ce=null,pr=!1,_r=0,ps.current=null,n===null||n.return===null){we=1,Pr=t,ge=null;break}e:{var o=e,s=n.return,i=n,u=t;if(t=Ce,i.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,v=i,x=v.tag;if(!(v.mode&1)&&(x===0||x===11||x===15)){var m=v.alternate;m?(v.updateQueue=m.updateQueue,v.memoizedState=m.memoizedState,v.lanes=m.lanes):(v.updateQueue=null,v.memoizedState=null)}var y=xi(s);if(y!==null){y.flags&=-257,vi(y,s,i,o,t),y.mode&1&&gi(o,d,t),t=y,u=d;var S=t.updateQueue;if(S===null){var b=new Set;b.add(u),t.updateQueue=b}else S.add(u);break e}else{if(!(t&1)){gi(o,d,t),vs();break e}u=Error(N(426))}}else if(ie&&i.mode&1){var R=xi(s);if(R!==null){!(R.flags&65536)&&(R.flags|=256),vi(R,s,i,o,t),Za($n(u,i));break e}}o=u=$n(u,i),we!==4&&(we=2),hr===null?hr=[o]:hr.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var g=jc(o,u,t);ci(o,g);break e;case 1:i=u;var c=o.type,h=o.stateNode;if(!(o.flags&128)&&(typeof c.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(Gt===null||!Gt.has(h)))){o.flags|=65536,t&=-t,o.lanes|=t;var w=Sc(o,i,t);ci(o,w);break e}}o=o.return}while(o!==null)}Hc(n)}catch(j){t=j,ge===n&&n!==null&&(ge=n=n.return);continue}break}while(!0)}function Bc(){var e=Al.current;return Al.current=Fl,e===null?Fl:e}function vs(){(we===0||we===3||we===2)&&(we=4),je===null||!(fn&268435455)&&!(eo&268435455)||At(je,Ce)}function $l(e,t){var n=Y;Y|=2;var r=Bc();(je!==e||Ce!==t)&&(jt=null,an(e,t));do try{wp();break}catch(l){Dc(e,l)}while(!0);if(es(),Y=n,Al.current=r,ge!==null)throw Error(N(261));return je=null,Ce=0,we}function wp(){for(;ge!==null;)$c(ge)}function kp(){for(;ge!==null&&!Wd();)$c(ge)}function $c(e){var t=Vc(e.alternate,e,We);e.memoizedProps=e.pendingProps,t===null?Hc(e):ge=t,ps.current=null}function Hc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=mp(n,t),n!==null){n.flags&=32767,ge=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{we=6,ge=null;return}}else if(n=pp(n,t,We),n!==null){ge=n;return}if(t=t.sibling,t!==null){ge=t;return}ge=t=e}while(t!==null);we===0&&(we=5)}function nn(e,t,n){var r=Z,l=nt.transition;try{nt.transition=null,Z=1,jp(e,t,n,r)}finally{nt.transition=l,Z=r}return null}function jp(e,t,n,r){do In();while(Bt!==null);if(Y&6)throw Error(N(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(N(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(tf(e,o),e===je&&(ge=je=null,Ce=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||rl||(rl=!0,Wc(jl,function(){return In(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=nt.transition,nt.transition=null;var s=Z;Z=1;var i=Y;Y|=4,ps.current=null,gp(e,n),Oc(n,e),Hf(oa),Nl=!!la,oa=la=null,e.current=n,xp(n),Gd(),Y=i,Z=s,nt.transition=o}else e.current=n;if(rl&&(rl=!1,Bt=e,Bl=l),o=e.pendingLanes,o===0&&(Gt=null),Yd(n.stateNode),He(e,me()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Dl)throw Dl=!1,e=Ca,Ca=null,e;return Bl&1&&e.tag!==0&&In(),o=e.pendingLanes,o&1?e===ba?gr++:(gr=0,ba=e):gr=0,Jt(),null}function In(){if(Bt!==null){var e=ju(Bl),t=nt.transition,n=Z;try{if(nt.transition=null,Z=16>e?16:e,Bt===null)var r=!1;else{if(e=Bt,Bt=null,Bl=0,Y&6)throw Error(N(331));var l=Y;for(Y|=4,L=e.current;L!==null;){var o=L,s=o.child;if(L.flags&16){var i=o.deletions;if(i!==null){for(var u=0;u<i.length;u++){var d=i[u];for(L=d;L!==null;){var v=L;switch(v.tag){case 0:case 11:case 15:mr(8,v,o)}var x=v.child;if(x!==null)x.return=v,L=x;else for(;L!==null;){v=L;var m=v.sibling,y=v.return;if(Pc(v),v===d){L=null;break}if(m!==null){m.return=y,L=m;break}L=y}}}var S=o.alternate;if(S!==null){var b=S.child;if(b!==null){S.child=null;do{var R=b.sibling;b.sibling=null,b=R}while(b!==null)}}L=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,L=s;else e:for(;L!==null;){if(o=L,o.flags&2048)switch(o.tag){case 0:case 11:case 15:mr(9,o,o.return)}var g=o.sibling;if(g!==null){g.return=o.return,L=g;break e}L=o.return}}var c=e.current;for(L=c;L!==null;){s=L;var h=s.child;if(s.subtreeFlags&2064&&h!==null)h.return=s,L=h;else e:for(s=c;L!==null;){if(i=L,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:Jl(9,i)}}catch(j){fe(i,i.return,j)}if(i===s){L=null;break e}var w=i.sibling;if(w!==null){w.return=i.return,L=w;break e}L=i.return}}if(Y=l,Jt(),vt&&typeof vt.onPostCommitFiberRoot=="function")try{vt.onPostCommitFiberRoot(Wl,e)}catch{}r=!0}return r}finally{Z=n,nt.transition=t}}return!1}function Ti(e,t,n){t=$n(n,t),t=jc(e,t,1),e=Wt(e,t,1),t=Re(),e!==null&&(Ir(e,1,t),He(e,t))}function fe(e,t,n){if(e.tag===3)Ti(e,e,n);else for(;t!==null;){if(t.tag===3){Ti(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Gt===null||!Gt.has(r))){e=$n(n,e),e=Sc(t,e,1),t=Wt(t,e,1),e=Re(),t!==null&&(Ir(t,1,e),He(t,e));break}}t=t.return}}function Sp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Re(),e.pingedLanes|=e.suspendedLanes&n,je===e&&(Ce&n)===n&&(we===4||we===3&&(Ce&130023424)===Ce&&500>me()-hs?an(e,0):ms|=n),He(e,t)}function Uc(e,t){t===0&&(e.mode&1?(t=Qr,Qr<<=1,!(Qr&130023424)&&(Qr=4194304)):t=1);var n=Re();e=zt(e,t),e!==null&&(Ir(e,t,n),He(e,n))}function Np(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Uc(e,n)}function Cp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(N(314))}r!==null&&r.delete(t),Uc(e,n)}var Vc;Vc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Be.current)De=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return De=!1,fp(e,t,n);De=!!(e.flags&131072)}else De=!1,ie&&t.flags&1048576&&qu(t,Tl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ml(e,t),e=t.pendingProps;var l=Fn(t,Le.current);Rn(t,n),l=is(null,t,r,e,l,n);var o=us();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,$e(r)?(o=!0,zl(t)):o=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,rs(t),l.updater=Zl,t.stateNode=l,l._reactInternals=t,ma(t,r,e,n),t=xa(null,t,r,!0,o,n)):(t.tag=0,ie&&o&&Ka(t),Pe(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ml(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Ep(r),e=it(r,e),l){case 0:t=ga(null,t,r,e,n);break e;case 1:t=ki(null,t,r,e,n);break e;case 11:t=yi(null,t,r,e,n);break e;case 14:t=wi(null,t,r,it(r.type,e),n);break e}throw Error(N(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:it(r,l),ga(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:it(r,l),ki(e,t,r,l,n);case 3:e:{if(Ec(t),e===null)throw Error(N(387));r=t.pendingProps,o=t.memoizedState,l=o.element,ec(e,t),Rl(t,r,null,n);var s=t.memoizedState;if(r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){l=$n(Error(N(423)),t),t=ji(e,t,r,n,l);break e}else if(r!==l){l=$n(Error(N(424)),t),t=ji(e,t,r,n,l);break e}else for(Qe=Vt(t.stateNode.containerInfo.firstChild),qe=t,ie=!0,ct=null,n=Zu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(An(),r===l){t=_t(e,t,n);break e}Pe(e,t,r,n)}t=t.child}return t;case 5:return tc(t),e===null&&da(t),r=t.type,l=t.pendingProps,o=e!==null?e.memoizedProps:null,s=l.children,aa(r,l)?s=null:o!==null&&aa(r,o)&&(t.flags|=32),bc(e,t),Pe(e,t,s,n),t.child;case 6:return e===null&&da(t),null;case 13:return Mc(e,t,n);case 4:return ls(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Dn(t,null,r,n):Pe(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:it(r,l),yi(e,t,r,l,n);case 7:return Pe(e,t,t.pendingProps,n),t.child;case 8:return Pe(e,t,t.pendingProps.children,n),t.child;case 12:return Pe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,o=t.memoizedProps,s=l.value,re(Ll,r._currentValue),r._currentValue=s,o!==null)if(pt(o.value,s)){if(o.children===l.children&&!Be.current){t=_t(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var i=o.dependencies;if(i!==null){s=o.child;for(var u=i.firstContext;u!==null;){if(u.context===r){if(o.tag===1){u=bt(-1,n&-n),u.tag=2;var d=o.updateQueue;if(d!==null){d=d.shared;var v=d.pending;v===null?u.next=u:(u.next=v.next,v.next=u),d.pending=u}}o.lanes|=n,u=o.alternate,u!==null&&(u.lanes|=n),fa(o.return,n,t),i.lanes|=n;break}u=u.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(N(341));s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),fa(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}Pe(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Rn(t,n),l=rt(l),r=r(l),t.flags|=1,Pe(e,t,r,n),t.child;case 14:return r=t.type,l=it(r,t.pendingProps),l=it(r.type,l),wi(e,t,r,l,n);case 15:return Nc(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:it(r,l),ml(e,t),t.tag=1,$e(r)?(e=!0,zl(t)):e=!1,Rn(t,n),kc(t,r,l),ma(t,r,l,n),xa(null,t,r,!0,e,n);case 19:return zc(e,t,n);case 22:return Cc(e,t,n)}throw Error(N(156,t.tag))};function Wc(e,t){return vu(e,t)}function bp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function tt(e,t,n,r){return new bp(e,t,n,r)}function ys(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ep(e){if(typeof e=="function")return ys(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Aa)return 11;if(e===Da)return 14}return 2}function qt(e,t){var n=e.alternate;return n===null?(n=tt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function xl(e,t,n,r,l,o){var s=2;if(r=e,typeof e=="function")ys(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case yn:return sn(n.children,l,o,t);case Fa:s=8,l|=8;break;case Ao:return e=tt(12,n,t,l|2),e.elementType=Ao,e.lanes=o,e;case Do:return e=tt(13,n,t,l),e.elementType=Do,e.lanes=o,e;case Bo:return e=tt(19,n,t,l),e.elementType=Bo,e.lanes=o,e;case tu:return to(n,l,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ji:s=10;break e;case eu:s=9;break e;case Aa:s=11;break e;case Da:s=14;break e;case It:s=16,r=null;break e}throw Error(N(130,e==null?e:typeof e,""))}return t=tt(s,n,t,l),t.elementType=e,t.type=r,t.lanes=o,t}function sn(e,t,n,r){return e=tt(7,e,r,t),e.lanes=n,e}function to(e,t,n,r){return e=tt(22,e,r,t),e.elementType=tu,e.lanes=n,e.stateNode={isHidden:!1},e}function Ro(e,t,n){return e=tt(6,e,null,t),e.lanes=n,e}function Io(e,t,n){return t=tt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Mp(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ho(0),this.expirationTimes=ho(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ho(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function ws(e,t,n,r,l,o,s,i,u){return e=new Mp(e,t,n,i,u),t===1?(t=1,o===!0&&(t|=8)):t=0,o=tt(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},rs(o),e}function zp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:vn,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Gc(e){if(!e)return Kt;e=e._reactInternals;e:{if(hn(e)!==e||e.tag!==1)throw Error(N(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if($e(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(N(171))}if(e.tag===1){var n=e.type;if($e(n))return Gu(e,n,t)}return t}function Qc(e,t,n,r,l,o,s,i,u){return e=ws(n,r,!0,e,l,o,s,i,u),e.context=Gc(null),n=e.current,r=Re(),l=Qt(n),o=bt(r,l),o.callback=t??null,Wt(n,o,l),e.current.lanes=l,Ir(e,l,r),He(e,r),e}function no(e,t,n,r){var l=t.current,o=Re(),s=Qt(l);return n=Gc(n),t.context===null?t.context=n:t.pendingContext=n,t=bt(o,s),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Wt(l,t,s),e!==null&&(ft(e,l,s,o),dl(e,l,s)),s}function Hl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Li(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ks(e,t){Li(e,t),(e=e.alternate)&&Li(e,t)}function _p(){return null}var qc=typeof reportError=="function"?reportError:function(e){console.error(e)};function js(e){this._internalRoot=e}ro.prototype.render=js.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(N(409));no(e,t,null,null)};ro.prototype.unmount=js.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;pn(function(){no(null,e,null,null)}),t[Mt]=null}};function ro(e){this._internalRoot=e}ro.prototype.unstable_scheduleHydration=function(e){if(e){var t=Cu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ft.length&&t!==0&&t<Ft[n].priority;n++);Ft.splice(n,0,e),n===0&&Eu(e)}};function Ss(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function lo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Pi(){}function Tp(e,t,n,r,l){if(l){if(typeof r=="function"){var o=r;r=function(){var d=Hl(s);o.call(d)}}var s=Qc(t,r,e,0,null,!1,!1,"",Pi);return e._reactRootContainer=s,e[Mt]=s.current,Cr(e.nodeType===8?e.parentNode:e),pn(),s}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var i=r;r=function(){var d=Hl(u);i.call(d)}}var u=ws(e,0,!1,null,null,!1,!1,"",Pi);return e._reactRootContainer=u,e[Mt]=u.current,Cr(e.nodeType===8?e.parentNode:e),pn(function(){no(t,u,n,r)}),u}function oo(e,t,n,r,l){var o=n._reactRootContainer;if(o){var s=o;if(typeof l=="function"){var i=l;l=function(){var u=Hl(s);i.call(u)}}no(t,s,e,l)}else s=Tp(n,t,e,l,r);return Hl(s)}Su=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=or(t.pendingLanes);n!==0&&(Ha(t,n|1),He(t,me()),!(Y&6)&&(Hn=me()+500,Jt()))}break;case 13:pn(function(){var r=zt(e,1);if(r!==null){var l=Re();ft(r,e,1,l)}}),ks(e,1)}};Ua=function(e){if(e.tag===13){var t=zt(e,134217728);if(t!==null){var n=Re();ft(t,e,134217728,n)}ks(e,134217728)}};Nu=function(e){if(e.tag===13){var t=Qt(e),n=zt(e,t);if(n!==null){var r=Re();ft(n,e,t,r)}ks(e,t)}};Cu=function(){return Z};bu=function(e,t){var n=Z;try{return Z=e,t()}finally{Z=n}};Ko=function(e,t,n){switch(t){case"input":if(Uo(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Yl(r);if(!l)throw Error(N(90));ru(r),Uo(r,l)}}}break;case"textarea":ou(e,n);break;case"select":t=n.value,t!=null&&_n(e,!!n.multiple,t,!1)}};fu=gs;pu=pn;var Lp={usingClientEntryPoint:!1,Events:[Fr,Sn,Yl,cu,du,gs]},tr={findFiberByHostInstance:rn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Pp={bundleType:tr.bundleType,version:tr.version,rendererPackageName:tr.rendererPackageName,rendererConfig:tr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Tt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=gu(e),e===null?null:e.stateNode},findFiberByHostInstance:tr.findFiberByHostInstance||_p,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ll=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ll.isDisabled&&ll.supportsFiber)try{Wl=ll.inject(Pp),vt=ll}catch{}}Ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Lp;Ke.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ss(t))throw Error(N(200));return zp(e,t,null,n)};Ke.createRoot=function(e,t){if(!Ss(e))throw Error(N(299));var n=!1,r="",l=qc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=ws(e,1,!1,null,null,n,!1,r,l),e[Mt]=t.current,Cr(e.nodeType===8?e.parentNode:e),new js(t)};Ke.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(N(188)):(e=Object.keys(e).join(","),Error(N(268,e)));return e=gu(t),e=e===null?null:e.stateNode,e};Ke.flushSync=function(e){return pn(e)};Ke.hydrate=function(e,t,n){if(!lo(t))throw Error(N(200));return oo(null,e,t,!0,n)};Ke.hydrateRoot=function(e,t,n){if(!Ss(e))throw Error(N(405));var r=n!=null&&n.hydratedSources||null,l=!1,o="",s=qc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=Qc(t,null,e,1,n??null,l,!1,o,s),e[Mt]=t.current,Cr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new ro(t)};Ke.render=function(e,t,n){if(!lo(t))throw Error(N(200));return oo(null,e,t,!1,n)};Ke.unmountComponentAtNode=function(e){if(!lo(e))throw Error(N(40));return e._reactRootContainer?(pn(function(){oo(null,null,e,!1,function(){e._reactRootContainer=null,e[Mt]=null})}),!0):!1};Ke.unstable_batchedUpdates=gs;Ke.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!lo(n))throw Error(N(200));if(e==null||e._reactInternals===void 0)throw Error(N(38));return oo(e,t,n,!1,r)};Ke.version="18.3.1-next-f1338f8080-20240426";function Yc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yc)}catch(e){console.error(e)}}Yc(),Yi.exports=Ke;var Rp=Yi.exports,Ri=Rp;Oo.createRoot=Ri.createRoot,Oo.hydrateRoot=Ri.hydrateRoot;const Ge={common:{label:"일반",color:"#64748b",bgColor:"#f1f5f9",borderColor:"#cbd5e1",glowColor:"transparent",multiplier:1},rare:{label:"희귀",color:"#0284c7",bgColor:"#e0f2fe",borderColor:"#7dd3fc",glowColor:"rgba(56, 189, 248, 0.4)",multiplier:1.8},epic:{label:"영웅",color:"#9333ea",bgColor:"#f3e8ff",borderColor:"#c084fc",glowColor:"rgba(192, 132, 252, 0.45)",multiplier:3.2},legendary:{label:"전설",color:"#d97706",bgColor:"#fef3c7",borderColor:"#fcd34d",glowColor:"rgba(251, 191, 36, 0.6)",multiplier:6},mythic:{label:"신화",color:"#e11d48",bgColor:"#ffe4e6",borderColor:"#fda4af",glowColor:"rgba(244, 63, 94, 0.75)",multiplier:12}},Ip={weapon:{id:"starter_wooden_sword",name:"수련용 목검",slot:"weapon",rarity:"common",level:1,atk:8,hp:0,def:0,critRate:.02,icon:"🗡️",description:"모험을 시작한 초보자를 위해 깎아 만든 튼튼한 목검."},helmet:{id:"starter_cloth_cap",name:"질긴 천 두건",slot:"helmet",rarity:"common",level:1,atk:0,hp:40,def:2,icon:"🧢",description:"햇빛과 먼지를 막아주는 부드러운 천 두건."},armor:{id:"starter_leather_tunic",name:"초보자 가죽 조끼",slot:"armor",rarity:"common",level:1,atk:0,hp:60,def:4,icon:"🦺",description:"약한 야수의 발톱을 막아줄 수 있는 질긴 가죽 조끼."},accessory:{id:"starter_wooden_ring",name:"행운의 나무 반지",slot:"accessory",rarity:"common",level:1,atk:3,hp:20,def:1,critRate:.03,icon:"💍",description:"작은 행운을 빌어주는 소박한 나무 조각 반지."}},Op={weapon:[{prefix:"검",names:{common:"견습생 철검",rare:"기사단의 은검",epic:"룬 각인 브로드소드",legendary:"태양빛 발뭉",mythic:"종말의 에스칼리버"},icon:"⚔️"},{prefix:"지팡이",names:{common:"참나무 지팡이",rare:"사파이어 완드",epic:"정령왕의 에테르 스태프",legendary:"세계수의 가지",mythic:"천상의 별빛 메테오라"},icon:"🪄"},{prefix:"활",names:{common:"사냥꾼 숏보우",rare:"바람의 롱보우",epic:"매의 눈 합성궁",legendary:"질풍의 가일포스",mythic:"신궁 아르테미스"},icon:"🏹"}],helmet:[{prefix:"투구",names:{common:"무쇠 바스켓헬름",rare:"기사단 깃털투구",epic:"용맹의 미스릴 바이저",legendary:"성전사의 황금관",mythic:"불멸의 발키리 윙헬름"},icon:"🪖"},{prefix:"모자",names:{common:"여행자 가죽 모자",rare:"마법사 펠트햇",epic:"별빛 예언가 후드",legendary:"현자의 오리하르콘 티아라",mythic:"전지전능의 관"},icon:"👑"}],armor:[{prefix:"갑옷",names:{common:"단단한 사슬갑옷",rare:"강철 플레이트메일",epic:"흑요석 드래곤아머",legendary:"빛의 가디언 체스트",mythic:"태초의 티타늄 성갑"},icon:"🛡️"},{prefix:"로브",names:{common:"수도사 삼베로브",rare:"마력직조 실크로브",epic:"극광의 오로라 맨틀",legendary:"대마법사 하이퍼코트",mythic:"무한의 성운의 망토"},icon:"🥋"}],accessory:[{prefix:"반지",names:{common:"황동 링",rare:"에메랄드 링",epic:"화염군주의 인장",legendary:"시간의 모래시계 링",mythic:"우주를 품은 오리진 링"},icon:"💍"},{prefix:"목걸이",names:{common:"뼈 조각 목걸이",rare:"달빛 수정 펜던트",epic:"불사조의 깃털 목걸이",legendary:"드래곤 하트 아뮬렛",mythic:"신의 숨결 목걸이"},icon:"📿"}]};function ol(e,t){const n=["weapon","helmet","armor","accessory"],r=t||n[Math.floor(Math.random()*n.length)];let l=e||"common";if(!e){const y=Math.random()*100;y<55?l="common":y<83?l="rare":y<95?l="epic":y<99?l="legendary":l="mythic"}const o=Op[r],s=o[Math.floor(Math.random()*o.length)],i=s.names[l],u=Ge[l].multiplier;let d=0,v=0,x=0,m=0;return r==="weapon"?(d=Math.floor((12+Math.random()*10)*u),m=Number(((.02+Math.random()*.04)*(u>2?1.5:1)).toFixed(3))):r==="helmet"?(v=Math.floor((40+Math.random()*30)*u),x=Math.floor((3+Math.random()*4)*u)):r==="armor"?(v=Math.floor((70+Math.random()*50)*u),x=Math.floor((6+Math.random()*6)*u)):r==="accessory"&&(d=Math.floor((5+Math.random()*6)*u),v=Math.floor((25+Math.random()*25)*u),x=Math.floor((2+Math.random()*3)*u),m=Number(((.01+Math.random()*.03)*(u>2?1.4:1)).toFixed(3))),{id:`item_${Date.now()}_${Math.floor(Math.random()*1e4)}`,name:i,slot:r,rarity:l,level:1,atk:d,hp:v,def:x,critRate:m>0?m:void 0,icon:s.icon,description:`${Ge[l].label} 등급의 아름다운 ${r} 장비입니다.`}}const Fp=[{id:"pet_slime",name:"퐁퐁 슬라임",icon:"🟢",description:"말랑말랑한 촉감으로 모험가의 사기를 북돋아 공격력을 올려줍니다.",buffType:"atk",baseBuffValue:.08,level:1,owned:!0,costGems:0,personality:"느긋하고 호기심 많은 친구"},{id:"pet_fairy",name:"햇살 반딧불 요정",icon:"🧚‍♀️",description:"반짝이는 빛가루를 뿌려 몬스터 처치 시 골드 획득량을 늘려줍니다.",buffType:"gold",baseBuffValue:.15,level:1,owned:!1,costGems:250,personality:"명랑하고 반짝이는 것을 좋아하는 요정"},{id:"pet_fox",name:"붉은 방울 여우",icon:"🦊",description:"민첩한 눈빛으로 적의 약점을 찾아내어 치명타 확률을 대폭 상승시킵니다.",buffType:"critRate",baseBuffValue:.05,level:1,owned:!1,costGems:600,personality:"영리하고 날렵한 숲의 길잡이"},{id:"pet_cat",name:"달빛 턱시도 냥이",icon:"🐱",description:"현란한 냥냥 펀치 리듬으로 모험가의 공격 속도를 촉진합니다.",buffType:"atkSpeed",baseBuffValue:.12,level:1,owned:!1,costGems:1200,personality:"시크하지만 츄르 앞에선 갸르릉거림"},{id:"pet_dragon",name:"아기 루비 드래곤",icon:"🐲",description:"작은 불꽃 숨결로 치명타 공격 발생 시 막대한 추가 폭발 데미지를 줍니다.",buffType:"critDmg",baseBuffValue:.35,level:1,owned:!1,costGems:2500,personality:"작지만 위대한 용족의 후예"}];function Ap(e){const t=e.baseBuffValue*(1+(e.level-1)*.2),n=Math.round(t*100);switch(e.buffType){case"atk":return`전체 공격력 +${n}%`;case"gold":return`골드 획득량 +${n}%`;case"critRate":return`치명타 확률 +${n}%`;case"atkSpeed":return`공격 속도 +${n}%`;case"critDmg":return`치명타 피해량 +${n}%`;default:return""}}const Dp=[{id:"q_kill_5",title:"숲속의 불청객 퇴치 (몬스터 5마리)",type:"kill_monster",targetCount:5,currentCount:0,rewardGold:200,rewardGems:30,completed:!1,claimed:!1},{id:"q_upgrade_atk_3",title:"모험 준비! 공격력 3회 강화",type:"upgrade_atk",targetCount:3,currentCount:0,rewardGold:350,rewardGems:40,completed:!1,claimed:!1},{id:"q_reach_1_3",title:"더 깊은 숲으로! 스테이지 1-3 돌파",type:"reach_stage",targetCount:3,currentCount:1,rewardGold:500,rewardGems:50,completed:!1,claimed:!1},{id:"q_equip_item",title:"무장 완료! 장비 착용하기",type:"equip_item",targetCount:1,currentCount:1,rewardGold:600,rewardGems:60,completed:!0,claimed:!1},{id:"q_kill_20",title:"숲의 수호자 (몬스터 20마리 처치)",type:"kill_monster",targetCount:20,currentCount:0,rewardGold:1200,rewardGems:100,completed:!1,claimed:!1},{id:"q_boss_1",title:"고대 버섯 장로 보스 격파!",type:"defeat_boss",targetCount:1,currentCount:0,rewardGold:3e3,rewardGems:300,completed:!1,claimed:!1},{id:"q_upgrade_atk_15",title:"강력한 타격! 공격력 15회 강화",type:"upgrade_atk",targetCount:15,currentCount:0,rewardGold:4e3,rewardGems:250,completed:!1,claimed:!1},{id:"q_reach_2_1",title:"새로운 모험! 챕터 2 달빛 호수 진입",type:"reach_stage",targetCount:11,currentCount:1,rewardGold:8e3,rewardGems:500,completed:!1,claimed:!1}],Kc="COZY_IDLE_RPG_SAVE_V1";function vl(){const e={level:1,exp:0,maxExp:100,gold:500,gems:100,atkLevel:1,hpLevel:1,defLevel:1,baseAtk:12,baseHp:180,baseDef:5,currentHp:180,critRate:.05,critDmg:1.5,atkSpeed:1},t={chapter:1,stage:1,killCount:0,killsRequired:5,isBossStage:!1,bossTimeLeft:30,bossMaxTime:30,inBossFight:!1,highestChapter:1,highestStage:1},n={bgmEnabled:!1,sfxEnabled:!0,damageNumbers:!0,autoBossRetry:!1};return{version:1,lastOnlineTime:Date.now(),stats:e,equipped:{...Ip},inventory:[],pets:[...Fp],activePetId:"pet_slime",stage:t,quests:[...Dp],freeChestLastOpened:0,settings:n}}function Ii(){try{const e=localStorage.getItem(Kc);if(!e)return{data:vl(),offlineSeconds:0};const t=JSON.parse(e),n=Date.now(),r=Math.max(0,Math.floor((n-(t.lastOnlineTime||n))/1e3)),l=Math.min(r,12*3600);return{data:{...vl(),...t,lastOnlineTime:n},offlineSeconds:l}}catch(e){return console.error("Failed to load save data:",e),{data:vl(),offlineSeconds:0}}}function Oi(e){try{const t={...e,lastOnlineTime:Date.now()};localStorage.setItem(Kc,JSON.stringify(t))}catch(t){console.error("Failed to save game data:",t)}}const Un=[{chapter:1,name:"새싹의 숲 (Green Sprout Forest)",subTitle:"초보 모험가가 첫 발을 내딛는 평화롭고 따스한 숲속",bgGradient:"linear-gradient(180deg, #d8ecd2 0%, #a4cca2 60%, #76a874 100%)",accentColor:"#5a8d58",monsters:[{id:"c1_m1",name:"풀잎 슬라임",icon:"🟢",maxHp:45,atk:4,def:1,expReward:8,goldReward:15,isBoss:!1,element:"grass"},{id:"c1_m2",name:"꼬마 버섯돌이",icon:"🍄",maxHp:75,atk:7,def:2,expReward:14,goldReward:25,isBoss:!1,element:"grass"},{id:"c1_m3",name:"도토리 다람쥐",icon:"🐿️",maxHp:120,atk:10,def:3,expReward:22,goldReward:40,isBoss:!1,element:"grass"},{id:"c1_m4",name:"숲속 반딧불 요정",icon:"🧚‍♂️",maxHp:180,atk:15,def:5,expReward:35,goldReward:65,isBoss:!1,element:"light"}],boss:{id:"c1_boss",name:"고대 버섯 장로 [BOSS]",icon:"👑🍄",maxHp:1200,atk:32,def:12,expReward:350,goldReward:800,isBoss:!0,element:"grass"}},{chapter:2,name:"달빛 호숫가 (Moonlight Lake)",subTitle:"은은한 달빛이 수면 위로 반짝이는 신비로운 호수",bgGradient:"linear-gradient(180deg, #cde3f7 0%, #9bc2e8 60%, #689ccd 100%)",accentColor:"#3c72a6",monsters:[{id:"c2_m1",name:"물방울 정령",icon:"💧",maxHp:320,atk:25,def:8,expReward:60,goldReward:120,isBoss:!1,element:"water"},{id:"c2_m2",name:"연잎 개구리",icon:"🐸",maxHp:480,atk:35,def:12,expReward:95,goldReward:190,isBoss:!1,element:"water"},{id:"c2_m3",name:"푸른빛 소라게",icon:"🐚",maxHp:720,atk:48,def:22,expReward:150,goldReward:290,isBoss:!1,element:"water"}],boss:{id:"c2_boss",name:"호수의 수호룡 [BOSS]",icon:"🐉🌊",maxHp:4800,atk:95,def:35,expReward:1200,goldReward:2800,isBoss:!0,element:"water"}},{chapter:3,name:"노을빛 단풍 골짜기 (Autumn Valley)",subTitle:"붉은 단풍잎이 흩날리는 따뜻하지만 거친 골짜기",bgGradient:"linear-gradient(180deg, #fed7aa 0%, #fba07a 60%, #e07a5f 100%)",accentColor:"#c25838",monsters:[{id:"c3_m1",name:"불씨 도깨비",icon:"🔥",maxHp:1200,atk:75,def:28,expReward:240,goldReward:450,isBoss:!1,element:"fire"},{id:"c3_m2",name:"붉은 꼬리 여우",icon:"🦊",maxHp:1800,atk:110,def:40,expReward:380,goldReward:700,isBoss:!1,element:"fire"}],boss:{id:"c3_boss",name:"화염의 바위 거인 [BOSS]",icon:"🌋🗿",maxHp:12500,atk:220,def:80,expReward:3500,goldReward:7500,isBoss:!0,element:"fire"}}];function nr(e,t){const n=Un[(e-1)%Un.length],r=1+(e-1)*2.2+(t-1)*.18;if(t===10){const i=n.boss,u=Math.floor(i.maxHp*r);return{...i,maxHp:u,currentHp:u,atk:Math.floor(i.atk*r),def:Math.floor(i.def*r),expReward:Math.floor(i.expReward*r),goldReward:Math.floor(i.goldReward*r)}}const l=n.monsters,o=l[(t-1)%l.length],s=Math.floor(o.maxHp*r);return{...o,maxHp:s,currentHp:s,atk:Math.floor(o.atk*r),def:Math.floor(o.def*r),expReward:Math.floor(o.expReward*r),goldReward:Math.floor(o.goldReward*r)}}class Bp{constructor(){gn(this,"ctx",null);gn(this,"sfxEnabled",!0);gn(this,"bgmEnabled",!1);gn(this,"bgmInterval",null);gn(this,"bgmStep",0)}initCtx(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx=new t)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}playAttack(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(320,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(140,this.ctx.currentTime+.08),n.gain.setValueAtTime(.06,this.ctx.currentTime),n.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.08),t.connect(n),n.connect(this.ctx.destination),t.start(),t.stop(this.ctx.currentTime+.08)}playCriticalHit(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.currentTime,n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type="sawtooth",n.frequency.setValueAtTime(800,t),n.frequency.exponentialRampToValueAtTime(250,t+.15),r.gain.setValueAtTime(.12,t),r.gain.exponentialRampToValueAtTime(.001,t+.15),n.connect(r),r.connect(this.ctx.destination),n.start(),n.stop(t+.15)}playMonsterDefeat(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.currentTime,n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(450,t),n.frequency.exponentialRampToValueAtTime(120,t+.2),r.gain.setValueAtTime(.08,t),r.gain.exponentialRampToValueAtTime(.001,t+.2),n.connect(r),r.connect(this.ctx.destination),n.start(),n.stop(t+.2)}playGold(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.currentTime,n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(987.77,t),n.frequency.setValueAtTime(1318.51,t+.05),r.gain.setValueAtTime(.06,t),r.gain.exponentialRampToValueAtTime(.001,t+.16),n.connect(r),r.connect(this.ctx.destination),n.start(),n.stop(t+.16)}playTap(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.currentTime,n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(520,t),r.gain.setValueAtTime(.04,t),r.gain.exponentialRampToValueAtTime(.001,t+.04),n.connect(r),r.connect(this.ctx.destination),n.start(),n.stop(t+.04)}playUpgrade(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[523.25,659.25,783.99,1046.5].forEach((n,r)=>{if(!this.ctx)return;const l=this.ctx.currentTime+r*.05,o=this.ctx.createOscillator(),s=this.ctx.createGain();o.type="triangle",o.frequency.setValueAtTime(n,l),s.gain.setValueAtTime(.05,l),s.gain.exponentialRampToValueAtTime(.001,l+.08),o.connect(s),s.connect(this.ctx.destination),o.start(l),o.stop(l+.08)})}playFanfare(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[523.25,659.25,783.99,1046.5,1318.51].forEach((n,r)=>{if(!this.ctx)return;const l=this.ctx.currentTime+r*.09,o=this.ctx.createOscillator(),s=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(n,l),s.gain.setValueAtTime(.08,l),s.gain.exponentialRampToValueAtTime(.001,l+.22),o.connect(s),s.connect(this.ctx.destination),o.start(l),o.stop(l+.22)})}startBgm(){if(this.bgmEnabled=!0,this.initCtx(),this.bgmInterval)return;const t=[349.23,392,440,523.25,587.33,698.46,783.99,880],n=[0,2,4,3,2,1,3,5,4,3,2,0];this.bgmInterval=window.setInterval(()=>{if(!this.bgmEnabled||!this.ctx)return;const r=t[n[this.bgmStep%n.length]];this.bgmStep++;const l=this.ctx.currentTime,o=this.ctx.createOscillator(),s=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(r,l),s.gain.setValueAtTime(.018,l),s.gain.exponentialRampToValueAtTime(1e-4,l+.45),o.connect(s),s.connect(this.ctx.destination),o.start(l),o.stop(l+.45)},450)}stopBgm(){this.bgmEnabled=!1,this.bgmInterval&&(clearInterval(this.bgmInterval),this.bgmInterval=null)}toggleBgm(){return this.bgmEnabled?(this.stopBgm(),!1):(this.startBgm(),!0)}}const X=new Bp;/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $p=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Xc=(...e)=>e.filter((t,n,r)=>!!t&&r.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Hp={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Up=U.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:l="",children:o,iconNode:s,...i},u)=>U.createElement("svg",{ref:u,...Hp,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:Xc("lucide",l),...i},[...s.map(([d,v])=>U.createElement(d,v)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=(e,t)=>{const n=U.forwardRef(({className:r,...l},o)=>U.createElement(Up,{ref:o,iconNode:t,className:Xc(`lucide-${$p(e)}`,r),...l}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zc=pe("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jc=pe("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vp=pe("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wp=pe("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gp=pe("Gem",[["path",{d:"M6 3h12l4 6-10 13L2 9Z",key:"1pcd5k"}],["path",{d:"M11 3 8 9l4 13 4-13-3-6",key:"1fcu3u"}],["path",{d:"M2 9h20",key:"16fsjt"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=pe("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fi=pe("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qp=pe("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yp=pe("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=pe("Music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xp=pe("Scroll",[["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=pe("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zp=pe("Skull",[["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",key:"1o5pge"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=pe("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jp=pe("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ul=pe("Swords",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}],["polyline",{points:"14.5 6.5 18 3 21 3 21 6 17.5 9.5",key:"hbey2j"}],["line",{x1:"5",x2:"9",y1:"14",y2:"18",key:"1hf58s"}],["line",{x1:"7",x2:"4",y1:"17",y2:"20",key:"pidxm4"}],["line",{x1:"3",x2:"5",y1:"19",y2:"21",key:"1pehsh"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const em=pe("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tm=pe("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nm=pe("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rm=pe("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=pe("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ed=pe("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),lm=({stats:e,stage:t,onOpenSettings:n,onOpenProfile:r})=>{const l=Un[(t.chapter-1)%Un.length],o=Math.min(100,Math.floor(e.exp/e.maxExp*100)),s=i=>i<1e3?i.toLocaleString():i<1e6?(i/1e3).toFixed(1)+"K":i<1e9?(i/1e6).toFixed(2)+"M":(i/1e9).toFixed(2)+"B";return a.jsxs("header",{className:"game-top-hud",children:[a.jsxs("div",{className:"profile-crest-slot",onClick:r,title:"영웅 프로필",children:[a.jsxs("div",{className:"crest-avatar-ring",children:[a.jsx("span",{className:"crest-face",children:"🧑‍🌾"}),a.jsxs("div",{className:"crest-ribbon-level game-stroke",children:["Lv.",e.level]})]}),a.jsxs("div",{className:"exp-capsule-badge",title:`EXP: ${e.exp} / ${e.maxExp}`,children:[a.jsx("div",{className:"exp-fill-bar",style:{width:`${o}%`}}),a.jsxs("span",{className:"exp-ratio-text",children:[o,"%"]})]})]}),a.jsx("div",{className:"stage-plaque-slot",children:a.jsxs("div",{className:"stage-wooden-board",children:[a.jsx("div",{className:"stage-title-text game-stroke-gold",children:t.isBossStage?"🔥 BOSS 관문":`${l.name} ${t.stage}`}),t.stage<10?a.jsx("div",{className:"leaf-pip-row",children:Array.from({length:t.killsRequired}).map((i,u)=>a.jsx("div",{className:`leaf-pip ${u<t.killCount?"leaf-active":""}`},u))}):a.jsxs("div",{className:`boss-timer-capsule ${t.bossTimeLeft<=10?"timer-emergency":""}`,children:["⏱️ ",t.bossTimeLeft,"초"]})]})}),a.jsxs("div",{className:"currencies-crest-slot",children:[a.jsxs("div",{className:"currency-pouch gold-pouch",children:[a.jsx("div",{className:"pouch-icon-3d",children:"🪙"}),a.jsx("span",{className:"pouch-val game-stroke",children:s(e.gold)})]}),a.jsxs("div",{className:"currency-pouch gem-pouch",children:[a.jsx("div",{className:"pouch-icon-3d",children:"💎"}),a.jsx("span",{className:"pouch-val game-stroke",children:s(e.gems)})]}),a.jsx("button",{className:"compass-settings-btn",onClick:n,title:"게임 설정",children:a.jsx(Wp,{size:20,color:"#fef08a"})})]}),a.jsx("style",{children:`
        .game-top-hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 84px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px 0;
          z-index: 40;
          pointer-events: none;
        }

        .game-top-hud > * {
          pointer-events: auto;
        }

        /* 🛡️ Left: Profile Crest */
        .profile-crest-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .profile-crest-slot:active {
          transform: scale(0.95);
        }

        .crest-avatar-ring {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, #fef8ee 0%, #ecdcc8 100%);
          border: 3px solid #f59e0b;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crest-face {
          font-size: 1.6rem;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
        }

        .crest-ribbon-level {
          position: absolute;
          bottom: -6px;
          background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 1px 7px;
          border-radius: 10px;
          border: 1.5px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .exp-capsule-badge {
          width: 52px;
          height: 6px;
          background: #23160c;
          border: 1px solid #78350f;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .exp-fill-bar {
          height: 100%;
          background: linear-gradient(90deg, #4ade80, #22c55e);
          transition: width 0.3s ease;
        }

        .exp-ratio-text {
          display: none;
        }

        /* 🌿 Center: Wooden Stage Plaque */
        .stage-plaque-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stage-wooden-board {
          background: linear-gradient(180deg, #6c462b 0%, #4a2f1b 60%, #321f12 100%);
          border: 2px solid #8c5b38;
          border-bottom: 3.5px solid #1a0f07;
          border-radius: 14px;
          padding: 4px 14px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.45);
        }

        .stage-title-text {
          font-size: 0.84rem;
          color: #fef08a;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .leaf-pip-row {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .leaf-pip {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22150a;
          border: 1.5px solid #5a3820;
          transition: all 0.2s ease;
        }

        .leaf-active {
          background: radial-gradient(circle, #86efac 0%, #22c55e 100%);
          border-color: #fef08a;
          box-shadow: 0 0 6px #22c55e;
          transform: scale(1.15);
        }

        .boss-timer-capsule {
          font-family: var(--font-game);
          font-size: 0.72rem;
          color: #ffffff;
          background: #dc2626;
          padding: 1px 7px;
          border-radius: 8px;
          border: 1px solid #fca5a5;
        }

        .timer-emergency {
          animation: timerBlink 0.8s infinite;
        }
        @keyframes timerBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* 🪙 Right: 3D Currency Pouches & Compass Settings */
        .currencies-crest-slot {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .currency-pouch {
          background: linear-gradient(180deg, #382416 0%, #22140a 100%);
          border: 1.5px solid #784c2a;
          border-bottom: 3px solid #140b05;
          border-radius: 12px;
          padding: 3px 8px 3px 5px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
        }

        .pouch-icon-3d {
          font-size: 1rem;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
        }

        .pouch-val {
          font-size: 0.8rem;
          color: #ffffff;
          line-height: 1;
        }

        .gold-pouch .pouch-val {
          color: #fef08a;
        }

        .gem-pouch .pouch-val {
          color: #7dd3fc;
        }

        .compass-settings-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(180deg, #8c5b38 0%, #4a2f1b 100%);
          border: 2px solid #f59e0b;
          border-bottom: 3.5px solid #23160c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          transition: transform 0.08s ease;
        }

        .compass-settings-btn:active {
          transform: translateY(2px);
          border-bottom-width: 1.5px;
        }
      `})]})},om=({stats:e,maxHp:t,isAttacking:n,isHit:r,equippedWeapon:l})=>{const[o,s]=U.useState(100),i=Math.max(0,Math.min(100,Math.round(e.currentHp/t*100)));U.useEffect(()=>{const d=setTimeout(()=>{s(i)},350);return()=>clearTimeout(d)},[i]);const u=l?Ge[l.rarity]:Ge.common;return a.jsxs("div",{className:"hero-character-box",children:[a.jsxs("div",{className:"hero-hp-gauge-container",children:[a.jsxs("div",{className:"hp-track-beveled hero-hp-track",children:[a.jsx("div",{className:"hp-bar-ghost",style:{width:`${o}%`}}),a.jsx("div",{className:"hp-bar-main hp-fill-hero",style:{width:`${i}%`}})]}),a.jsxs("div",{className:"hero-hp-text game-stroke",children:[e.currentHp," / ",t]})]}),a.jsxs("div",{className:`hero-sprite-stage ${n?"hero-lunge":"hero-idle"} ${r?"hero-hit-shake":""}`,children:[a.jsx("div",{className:"hero-ground-shadow"}),n&&a.jsx("div",{className:"slash-arc-effect"}),a.jsxs("svg",{viewBox:"0 0 120 130",className:"hero-vector-svg",children:[a.jsxs("defs",{children:[a.jsxs("filter",{id:"weapon-glow",x:"-20%",y:"-20%",width:"140%",height:"140%",children:[a.jsx("feGaussianBlur",{stdDeviation:"3",result:"blur"}),a.jsx("feComposite",{in:"SourceGraphic",in2:"blur",operator:"over"})]}),a.jsxs("linearGradient",{id:"blade-glow-grad",x1:"0",y1:"0",x2:"1",y2:"1",children:[a.jsx("stop",{offset:"0%",stopColor:"#ffffff"}),a.jsx("stop",{offset:"60%",stopColor:u.color}),a.jsx("stop",{offset:"100%",stopColor:"#78350f"})]}),a.jsxs("linearGradient",{id:"hair-grad",x1:"0",y1:"0",x2:"0",y2:"1",children:[a.jsx("stop",{offset:"0%",stopColor:"#8d5b38"}),a.jsx("stop",{offset:"100%",stopColor:"#4a2e18"})]}),a.jsxs("linearGradient",{id:"cape-grad",x1:"0",y1:"0",x2:"0",y2:"1",children:[a.jsx("stop",{offset:"0%",stopColor:"#558855"}),a.jsx("stop",{offset:"100%",stopColor:"#2c522c"})]})]}),a.jsx("path",{d:"M40 55 C30 85 24 105 20 110 C45 116 75 116 95 110 C90 100 85 85 78 55 Z",fill:"url(#cape-grad)",stroke:"#1a331a",strokeWidth:"2.5",strokeLinejoin:"round"}),a.jsx("rect",{x:"42",y:"52",width:"34",height:"42",rx:"10",fill:"#e2d6c6",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("rect",{x:"42",y:"70",width:"34",height:"8",fill:"#5a3a22",stroke:"#23160c",strokeWidth:"2"}),a.jsx("rect",{x:"54",y:"69",width:"10",height:"10",rx:"3",fill:"#f59e0b",stroke:"#78350f",strokeWidth:"1.5"}),a.jsx("rect",{x:"44",y:"90",width:"12",height:"22",rx:"5",fill:"#3a2414",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("rect",{x:"62",y:"90",width:"12",height:"22",rx:"5",fill:"#3a2414",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("line",{x1:"44",y1:"98",x2:"56",y2:"98",stroke:"#d97706",strokeWidth:"2"}),a.jsx("line",{x1:"62",y1:"98",x2:"74",y2:"98",stroke:"#d97706",strokeWidth:"2"}),a.jsx("circle",{cx:"59",cy:"38",r:"22",fill:"#ffe3cf",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("path",{d:"M37 38 C37 18 81 18 81 38 C81 28 72 22 59 22 C46 22 37 28 37 38 Z",fill:"url(#hair-grad)",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("path",{d:"M37 38 Q42 28 52 32 Q59 24 68 32 Q77 28 81 38",fill:"url(#hair-grad)",stroke:"#23160c",strokeWidth:"2.5"}),a.jsx("path",{d:"M37 34 Q59 31 81 34 L81 40 Q59 37 37 40 Z",fill:"#e11d48",stroke:"#881337",strokeWidth:"2"}),a.jsx("circle",{cx:"59",cy:"36",r:"3",fill:"#fef08a",stroke:"#78350f",strokeWidth:"1"}),a.jsxs("g",{className:"hero-eyes-group",children:[a.jsx("ellipse",{cx:"51",cy:"40",rx:"3.2",ry:"4.5",fill:"#23160c"}),a.jsx("circle",{cx:"52.2",cy:"38.5",r:"1.5",fill:"#ffffff"}),a.jsx("circle",{cx:"50",cy:"42",r:"0.7",fill:"#ffffff"}),a.jsx("ellipse",{cx:"67",cy:"40",rx:"3.2",ry:"4.5",fill:"#23160c"}),a.jsx("circle",{cx:"68.2",cy:"38.5",r:"1.5",fill:"#ffffff"}),a.jsx("circle",{cx:"66",cy:"42",r:"0.7",fill:"#ffffff"})]}),a.jsx("circle",{cx:"46",cy:"46",r:"3.5",fill:"#f43f5e",opacity:"0.45"}),a.jsx("circle",{cx:"72",cy:"46",r:"3.5",fill:"#f43f5e",opacity:"0.45"}),a.jsx("path",{d:"M55 47 Q59 51 63 47",stroke:"#7c3a20",strokeWidth:"2",fill:"none",strokeLinecap:"round"}),a.jsxs("g",{className:`hero-weapon-arm ${n?"weapon-strike-anim":""}`,children:[a.jsx("rect",{x:"76",y:"58",width:"10",height:"14",rx:"4",fill:"#8c6242",stroke:"#23160c",strokeWidth:"2"}),a.jsx("path",{d:"M80 58 L82 12 Q83 6 85 12 L87 58 Z",fill:"url(#blade-glow-grad)",stroke:"#23160c",strokeWidth:"2.5",filter:"url(#weapon-glow)"}),a.jsx("line",{x1:"84.5",y1:"18",x2:"84.5",y2:"52",stroke:"#ffffff",strokeWidth:"1.5",strokeLinecap:"round"}),a.jsx("rect",{x:"74",y:"58",width:"19",height:"5",rx:"2",fill:"#f59e0b",stroke:"#78350f",strokeWidth:"1.8"}),a.jsx("circle",{cx:"83.5",cy:"74",r:"3.5",fill:"#f59e0b",stroke:"#78350f",strokeWidth:"1.5"})]})]})]}),a.jsx("style",{children:`
        .hero-character-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 15;
        }

        .hero-hp-gauge-container {
          width: 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin-bottom: 4px;
        }

        .hero-hp-track {
          width: 100%;
          height: 10px;
        }

        .hero-hp-text {
          font-size: 0.68rem;
          color: #ffffff;
          line-height: 1;
        }

        .hero-sprite-stage {
          position: relative;
          width: 120px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-vector-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45));
        }

        .hero-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 70px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(16, 26, 16, 0.65) 0%, transparent 75%);
          z-index: -1;
        }

        /* Idle Breathing Animation */
        .hero-idle {
          animation: heroBreathe 2.4s ease-in-out infinite;
        }

        @keyframes heroBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px) scale(1.02, 0.98); }
        }

        /* Forward Lunge Strike */
        .hero-lunge {
          animation: heroLungeAnim 0.28s ease-in-out forwards;
        }

        @keyframes heroLungeAnim {
          0% { transform: translateX(0) scale(1); }
          30% { transform: translateX(-8px) scale(0.96, 1.04); } /* Anticipation */
          60% { transform: translateX(36px) scale(1.12, 0.94); } /* Strike */
          100% { transform: translateX(0) scale(1); }
        }

        /* Hit Shake */
        .hero-hit-shake {
          animation: heroShakeAnim 0.22s ease-in-out;
        }

        @keyframes heroShakeAnim {
          0%, 100% { transform: translateX(0); filter: none; }
          30% { transform: translateX(-8px); filter: brightness(2) saturate(1.8); }
          70% { transform: translateX(6px); }
        }

        /* Eyes Blink Animation */
        .hero-eyes-group {
          animation: eyeBlink 4s ease-in-out infinite;
          transform-origin: 59px 40px;
        }

        @keyframes eyeBlink {
          0%, 94%, 98%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }

        /* Weapon Strike Arc Animation */
        .weapon-strike-anim {
          transform-origin: 83px 62px;
          animation: swordSlash 0.28s ease-in-out;
        }

        @keyframes swordSlash {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(-35deg); }
          65% { transform: rotate(70deg) translate(6px, -4px); }
          100% { transform: rotate(0deg); }
        }
      `})]})},am=({monster:e,isHit:t,isDefeated:n,isAttacking:r})=>{const[l,o]=U.useState(100),s=Math.max(0,Math.min(100,Math.round(e.currentHp/e.maxHp*100)));U.useEffect(()=>{const u=setTimeout(()=>{o(s)},350);return()=>clearTimeout(u)},[s]);const i=()=>e.id.includes("slime")||e.name.includes("슬라임")||e.name.includes("정령")?a.jsxs("svg",{viewBox:"0 0 100 100",className:"monster-vector-svg",children:[a.jsx("defs",{children:a.jsxs("radialGradient",{id:"slime-grad",cx:"40%",cy:"35%",r:"65%",children:[a.jsx("stop",{offset:"0%",stopColor:"#bbf7d0"}),a.jsx("stop",{offset:"55%",stopColor:"#4ade80"}),a.jsx("stop",{offset:"100%",stopColor:"#15803d"})]})}),a.jsx("path",{d:"M50 16 C68 16 88 38 88 64 C88 84 74 88 50 88 C26 88 12 84 12 64 C12 38 32 16 50 16 Z",fill:"url(#slime-grad)",stroke:"#14532d",strokeWidth:"3.5",strokeLinejoin:"round"}),a.jsx("ellipse",{cx:"38",cy:"34",rx:"10",ry:"5",fill:"#ffffff",opacity:"0.75",transform:"rotate(-20 38 34)"}),a.jsx("circle",{cx:"30",cy:"45",r:"3",fill:"#ffffff",opacity:"0.6"}),a.jsx("circle",{cx:"42",cy:"54",r:"5",fill:"#14532d"}),a.jsx("circle",{cx:"43.5",cy:"52.5",r:"1.8",fill:"#ffffff"}),a.jsx("circle",{cx:"64",cy:"54",r:"5",fill:"#14532d"}),a.jsx("circle",{cx:"65.5",cy:"52.5",r:"1.8",fill:"#ffffff"}),a.jsx("path",{d:"M49 64 Q53 69 57 64",stroke:"#14532d",strokeWidth:"2.5",fill:"none",strokeLinecap:"round"})]}):e.id.includes("boss")||e.isBoss?a.jsxs("svg",{viewBox:"0 0 130 130",className:"monster-vector-svg boss-svg",children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:"boss-cap-grad",cx:"50%",cy:"30%",r:"70%",children:[a.jsx("stop",{offset:"0%",stopColor:"#fca5a5"}),a.jsx("stop",{offset:"45%",stopColor:"#ef4444"}),a.jsx("stop",{offset:"100%",stopColor:"#7f1d1d"})]}),a.jsxs("radialGradient",{id:"crown-gold",cx:"40%",cy:"30%",r:"60%",children:[a.jsx("stop",{offset:"0%",stopColor:"#fef08a"}),a.jsx("stop",{offset:"60%",stopColor:"#f59e0b"}),a.jsx("stop",{offset:"100%",stopColor:"#78350f"})]})]}),a.jsx("path",{d:"M45 28 L52 14 L65 24 L78 14 L85 28 Z",fill:"url(#crown-gold)",stroke:"#451a03",strokeWidth:"2.5",strokeLinejoin:"round"}),a.jsx("circle",{cx:"52",cy:"14",r:"2.5",fill:"#ef4444",stroke:"#451a03",strokeWidth:"1"}),a.jsx("circle",{cx:"65",cy:"24",r:"3",fill:"#38bdf8",stroke:"#451a03",strokeWidth:"1"}),a.jsx("circle",{cx:"78",cy:"14",r:"2.5",fill:"#ef4444",stroke:"#451a03",strokeWidth:"1"}),a.jsx("path",{d:"M20 62 C20 32 110 32 110 62 C110 68 20 68 20 62 Z",fill:"url(#boss-cap-grad)",stroke:"#450a0a",strokeWidth:"3.5",strokeLinejoin:"round"}),a.jsx("circle",{cx:"45",cy:"46",r:"7",fill:"#ffffff",opacity:"0.85"}),a.jsx("circle",{cx:"75",cy:"44",r:"9",fill:"#ffffff",opacity:"0.85"}),a.jsx("circle",{cx:"95",cy:"54",r:"5",fill:"#ffffff",opacity:"0.85"}),a.jsx("path",{d:"M38 64 C36 94 40 108 44 114 C56 116 74 116 86 114 C90 108 94 94 92 64 Z",fill:"#faeedd",stroke:"#451a03",strokeWidth:"3.5"}),a.jsx("path",{d:"M48 76 L58 82 M82 76 L72 82",stroke:"#451a03",strokeWidth:"3",strokeLinecap:"round"}),a.jsx("circle",{cx:"53",cy:"84",r:"5",fill:"#ef4444",stroke:"#451a03",strokeWidth:"2"}),a.jsx("circle",{cx:"77",cy:"84",r:"5",fill:"#ef4444",stroke:"#451a03",strokeWidth:"2"}),a.jsx("circle",{cx:"54",cy:"83",r:"1.5",fill:"#fff"}),a.jsx("circle",{cx:"78",cy:"83",r:"1.5",fill:"#fff"}),a.jsx("path",{d:"M56 94 Q65 110 74 94 Q65 104 56 94",fill:"#ffffff",stroke:"#451a03",strokeWidth:"2"})]}):a.jsxs("svg",{viewBox:"0 0 100 100",className:"monster-vector-svg",children:[a.jsx("defs",{children:a.jsxs("radialGradient",{id:"mush-cap",cx:"45%",cy:"30%",r:"65%",children:[a.jsx("stop",{offset:"0%",stopColor:"#fca5a5"}),a.jsx("stop",{offset:"60%",stopColor:"#ef4444"}),a.jsx("stop",{offset:"100%",stopColor:"#991b1b"})]})}),a.jsx("path",{d:"M16 52 C16 26 84 26 84 52 C84 58 16 58 16 52 Z",fill:"url(#mush-cap)",stroke:"#450a0a",strokeWidth:"3"}),a.jsx("circle",{cx:"36",cy:"38",r:"5",fill:"#fff",opacity:"0.85"}),a.jsx("circle",{cx:"60",cy:"36",r:"6.5",fill:"#fff",opacity:"0.85"}),a.jsx("path",{d:"M32 54 C30 76 34 88 38 92 C46 94 54 94 62 92 C66 88 70 76 68 54 Z",fill:"#fbf0e0",stroke:"#382110",strokeWidth:"3"}),a.jsx("line",{x1:"39",y1:"64",x2:"47",y2:"68",stroke:"#382110",strokeWidth:"2.5",strokeLinecap:"round"}),a.jsx("line",{x1:"61",y1:"64",x2:"53",y2:"68",stroke:"#382110",strokeWidth:"2.5",strokeLinecap:"round"}),a.jsx("circle",{cx:"44",cy:"72",r:"3.5",fill:"#1f140a"}),a.jsx("circle",{cx:"56",cy:"72",r:"3.5",fill:"#1f140a"}),a.jsx("circle",{cx:"45",cy:"71",r:"1.2",fill:"#fff"}),a.jsx("circle",{cx:"57",cy:"71",r:"1.2",fill:"#fff"})]});return a.jsxs("div",{className:"monster-character-box",children:[a.jsxs("div",{className:`monster-hp-gauge-container ${e.isBoss?"boss-gauge-width":""}`,children:[a.jsxs("div",{className:"monster-name-tag game-stroke",children:[a.jsx("span",{children:e.name}),a.jsxs("span",{className:"monster-hp-nums",children:[e.currentHp," / ",e.maxHp]})]}),a.jsxs("div",{className:"hp-track-beveled monster-hp-track",children:[a.jsx("div",{className:"hp-bar-ghost",style:{width:`${l}%`}}),a.jsx("div",{className:`hp-bar-main ${e.isBoss?"hp-fill-boss":"hp-fill-monster"}`,style:{width:`${s}%`}})]})]}),a.jsxs("div",{className:`monster-sprite-stage ${n?"monster-defeat-anim":t?"hit-flash-white":r?"monster-lunge-anim":"monster-squash-idle"} ${e.isBoss?"boss-scale-box":""}`,children:[e.isBoss&&a.jsx("div",{className:"boss-magic-ring"}),a.jsx("div",{className:"monster-ground-shadow"}),i()]}),a.jsx("style",{children:`
        .monster-character-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 15;
        }

        .monster-hp-gauge-container {
          width: 95px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 4px;
        }

        .boss-gauge-width {
          width: 140px;
        }

        .monster-name-tag {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          color: #ffffff;
          line-height: 1.1;
        }

        .monster-hp-nums {
          color: var(--gold-highlight);
          font-size: 0.62rem;
        }

        .monster-hp-track {
          width: 100%;
          height: 10px;
        }

        .monster-sprite-stage {
          position: relative;
          width: 110px;
          height: 115px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.08s ease;
        }

        .boss-scale-box {
          width: 155px;
          height: 155px;
        }

        .monster-vector-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45));
        }

        .monster-ground-shadow {
          position: absolute;
          bottom: 4px;
          width: 65px;
          height: 15px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(16, 26, 16, 0.65) 0%, transparent 75%);
          z-index: -1;
        }

        /* 🟢 Squash & Stretch Idle Animation */
        .monster-squash-idle {
          animation: monsterJellyBreathe 1.8s ease-in-out infinite;
        }

        @keyframes monsterJellyBreathe {
          0%, 100% {
            transform: scale(1, 1) translateY(0);
          }
          40% {
            transform: scale(1.08, 0.92) translateY(3px);
          }
          70% {
            transform: scale(0.94, 1.06) translateY(-6px);
          }
        }

        /* Monster Attack Lunge */
        .monster-lunge-anim {
          animation: monsterLungeAction 0.26s ease-in-out;
        }

        @keyframes monsterLungeAction {
          0% { transform: translateX(0); }
          50% { transform: translateX(-28px) scale(1.1, 0.95); }
          100% { transform: translateX(0); }
        }

        /* Monster Defeat Poof */
        .monster-defeat-anim {
          animation: monsterPoofFade 0.4s ease-out forwards;
        }

        @keyframes monsterPoofFade {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          40% { transform: scale(1.3) translateY(-10px); opacity: 0.8; filter: brightness(2); }
          100% { transform: scale(0.2) translateY(20px); opacity: 0; filter: blur(6px); }
        }

        /* Boss Magic Circle */
        .boss-magic-ring {
          position: absolute;
          bottom: -4px;
          width: 120px;
          height: 35px;
          border-radius: 50%;
          border: 2px dashed rgba(244, 63, 94, 0.8);
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
          animation: rotateMagicRing 8s linear infinite;
          z-index: -1;
        }

        @keyframes rotateMagicRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `})]})},sm=({pet:e})=>e?a.jsxs("div",{className:"pet-companion-box",title:`${e.name} (${e.description})`,children:[a.jsxs("div",{className:"pet-sprite anim-pet-bounce",children:[a.jsx("span",{className:"pet-icon",children:e.icon}),a.jsx("div",{className:"pet-shadow"})]}),a.jsx("style",{children:`
        .pet-companion-box {
          position: absolute;
          bottom: 12px;
          left: -20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          pointer-events: none;
        }
        .pet-sprite {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pet-icon {
          font-size: 2rem;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
        }
        .pet-shadow {
          width: 22px;
          height: 6px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          margin-top: -4px;
        }
        .anim-pet-bounce {
          animation: petHop 1.4s ease-in-out infinite;
        }
        @keyframes petHop {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-12px) scale(1.08, 0.95);
          }
          50% {
            transform: translateY(-14px) scale(0.95, 1.05);
          }
          80% {
            transform: translateY(0) scale(1.05, 0.95);
          }
        }
      `})]}):null,im=({damages:e})=>a.jsxs("div",{className:"damage-numbers-layer",children:[e.map(t=>a.jsxs("div",{className:`damage-number-pop ${t.isCritical?"dmg-crit":t.isPlayer?"dmg-player-hit":"dmg-normal"}`,style:{left:`${t.x}px`,top:`${t.y}px`},children:[t.isCritical&&a.jsx("span",{className:"crit-burst-label",children:"CRIT! "}),t.value.toLocaleString()]},t.id)),a.jsx("style",{children:`
        .damage-numbers-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 50;
        }
        .crit-burst-label {
          font-size: 0.6em;
          display: block;
          line-height: 1;
          letter-spacing: 1.5px;
          color: #fef08a;
          text-shadow: 0 0 10px #ff0055, -2px -2px 0 #78350f, 2px -2px 0 #78350f, -2px 2px 0 #78350f, 2px 2px 0 #78350f;
        }
      `})]}),um=({stats:e,maxHp:t,monster:n,stage:r,activePet:l,equippedWeapon:o,isPlayerAttacking:s,isMonsterAttacking:i,isPlayerHit:u,isMonsterHit:d,isMonsterDefeated:v,damages:x,onChallengeBoss:m,onRetreatToNormal:y})=>{const S=Un[(r.chapter-1)%Un.length];return a.jsxs("div",{className:"battle-environment-root",children:[a.jsxs("div",{className:"env-layer layer-sky",style:{background:S.bgGradient},children:[a.jsx("div",{className:"god-rays"}),a.jsx("div",{className:"ambient-sun-orb"})]}),a.jsx("div",{className:"env-layer layer-far-mountains",children:a.jsx("svg",{viewBox:"0 0 400 120",preserveAspectRatio:"none",className:"mountains-svg",children:a.jsx("path",{d:"M0 80 Q90 30 180 75 T360 40 Q390 60 400 80 L400 120 L0 120 Z",fill:"rgba(40, 80, 50, 0.45)"})})}),a.jsxs("div",{className:"env-layer layer-midground-forest",children:[a.jsx("svg",{viewBox:"0 0 400 160",preserveAspectRatio:"none",className:"canopy-svg",children:a.jsx("path",{d:"M-20 0 Q40 40 100 0 Q180 50 260 0 Q340 45 420 0 L420 160 L-20 160 Z",fill:"rgba(25, 55, 30, 0.7)"})}),a.jsx("div",{className:"firefly firefly-1"}),a.jsx("div",{className:"firefly firefly-2"}),a.jsx("div",{className:"firefly firefly-3"}),a.jsx("div",{className:"firefly firefly-4"})]}),a.jsx("div",{className:"env-layer layer-ground-path",children:a.jsxs("div",{className:"ground-soil-base",children:[a.jsx("div",{className:"stone-pebble stone-1"}),a.jsx("div",{className:"stone-pebble stone-2"}),a.jsx("div",{className:"stone-pebble stone-3"}),a.jsx("div",{className:"grass-tuft grass-1"}),a.jsx("div",{className:"grass-tuft grass-2"})]})}),a.jsxs("div",{className:"env-layer layer-foreground-vignette",children:[a.jsx("div",{className:"vine-leaf vine-top-left"}),a.jsx("div",{className:"vine-leaf vine-top-right"})]}),a.jsx(im,{damages:x}),a.jsxs("div",{className:"combat-arena-stage",children:[a.jsxs("div",{className:"hero-combat-slot",children:[a.jsx(om,{stats:e,maxHp:t,isAttacking:s,isHit:u,equippedWeapon:o}),a.jsx(sm,{pet:l})]}),a.jsx("div",{className:"arena-center-zone",children:r.stage===10&&r.inBossFight&&a.jsxs("div",{className:"boss-banner-stamp game-stroke",children:[a.jsx(Zp,{size:16,color:"#ffffff"}),a.jsx("span",{children:"BOSS BATTLE"})]})}),a.jsx("div",{className:"enemy-combat-slot",children:a.jsx(am,{monster:n,isHit:d,isDefeated:v,isAttacking:i})})]}),a.jsxs("div",{className:"battle-action-overlay",children:[r.stage===10&&!r.inBossFight&&a.jsxs("button",{className:"btn-game btn-game-gold boss-summon-btn",onClick:m,children:[a.jsx(Ul,{size:20}),a.jsx("span",{className:"game-stroke",children:"보스 소환 도전 (Boss Battle)"})]}),r.stage===10&&r.inBossFight&&a.jsx("button",{className:"btn-game btn-game-wood boss-retreat-btn",onClick:y,children:a.jsx("span",{children:"일반 사냥으로 후퇴"})})]}),a.jsx("style",{children:`
        .battle-environment-root {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          min-height: 380px;
          user-select: none;
        }

        .env-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Layer 0: Sky & God Rays */
        .layer-sky {
          z-index: 1;
        }
        .god-rays {
          position: absolute;
          top: -20px;
          left: 10%;
          width: 250px;
          height: 300px;
          background: linear-gradient(135deg, rgba(254, 240, 138, 0.28) 0%, transparent 60%);
          transform: rotate(-15deg);
          filter: blur(12px);
          animation: godRaysPulse 6s ease-in-out infinite alternate;
        }
        @keyframes godRaysPulse {
          0% { opacity: 0.5; transform: rotate(-15deg) scaleX(0.9); }
          100% { opacity: 0.9; transform: rotate(-12deg) scaleX(1.15); }
        }

        .ambient-sun-orb {
          position: absolute;
          top: 15px;
          right: 35px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 240, 138, 0.7) 0%, transparent 70%);
        }

        /* Layer 1: Far Mountains */
        .layer-far-mountains {
          z-index: 2;
          display: flex;
          align-items: flex-end;
        }
        .mountains-svg {
          width: 100%;
          height: 90px;
        }

        /* Layer 2: Midground Canopy & Fireflies */
        .layer-midground-forest {
          z-index: 3;
        }
        .canopy-svg {
          width: 100%;
          height: 90px;
        }
        .firefly {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fef08a;
          box-shadow: 0 0 8px #fef08a, 0 0 14px #86efac;
          animation: fireflyAnim 4s ease-in-out infinite;
        }
        .firefly-1 { top: 35%; left: 20%; animation-delay: 0s; }
        .firefly-2 { top: 48%; left: 75%; animation-delay: 1.2s; }
        .firefly-3 { top: 60%; left: 45%; animation-delay: 2.1s; }
        .firefly-4 { top: 25%; left: 60%; animation-delay: 3s; }

        @keyframes fireflyAnim {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(12px, -18px); opacity: 1; }
        }

        /* Layer 3: Ground Soil Base & Cobblestones */
        .layer-ground-path {
          z-index: 4;
          display: flex;
          align-items: flex-end;
        }
        .ground-soil-base {
          width: 100%;
          height: 75px;
          background: linear-gradient(180deg, #446e3e 0%, #2b4a26 40%, #1c3319 100%);
          border-top: 3.5px solid #6b9e5d;
          position: relative;
          box-shadow: inset 0 8px 16px rgba(0, 0, 0, 0.45);
        }
        .stone-pebble {
          position: absolute;
          background: #3b5037;
          border-radius: 50%;
          border: 1px solid #5a7554;
        }
        .stone-1 { width: 14px; height: 7px; top: 18px; left: 15%; }
        .stone-2 { width: 20px; height: 9px; top: 32px; left: 62%; }
        .stone-3 { width: 16px; height: 8px; top: 44px; left: 38%; }

        .grass-tuft {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 9px solid #86efac;
        }
        .grass-1 { top: -9px; left: 28%; }
        .grass-2 { top: -9px; left: 78%; }

        /* Layer 4: Foreground Leaf Vignette */
        .layer-foreground-vignette {
          z-index: 25;
        }
        .vine-leaf {
          position: absolute;
          width: 70px;
          height: 50px;
          background: radial-gradient(circle at 0% 0%, #22421f 0%, #152b13 80%);
          border-radius: 0 0 50px 0;
          opacity: 0.85;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
        }
        .vine-top-left { top: 0; left: 0; }
        .vine-top-right { top: 0; right: 0; transform: scaleX(-1); }

        /* Combat Arena Stage */
        .combat-arena-stage {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 0 16px 36px;
        }

        .hero-combat-slot {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .enemy-combat-slot {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .arena-center-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 45px;
        }

        .boss-banner-stamp {
          background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1.5px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.85);
          animation: bossStampPulse 1.2s infinite;
        }

        @keyframes bossStampPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); box-shadow: 0 0 24px rgba(239, 68, 68, 1); }
        }

        /* Action Buttons Over Battle */
        .battle-action-overlay {
          position: relative;
          z-index: 30;
          display: flex;
          justify-content: center;
          padding: 0 16px 8px;
        }

        .boss-summon-btn {
          width: 100%;
          max-width: 290px;
          min-height: 48px;
          font-size: 1.05rem;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
          animation: summonBounce 2s infinite;
        }

        @keyframes summonBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .boss-retreat-btn {
          font-size: 0.85rem;
          min-height: 38px;
          padding: 6px 16px;
        }
      `})]})},cm=({quest:e,onClaim:t})=>{if(!e)return null;const n=Math.min(100,Math.floor(e.currentCount/e.targetCount*100)),r=e.currentCount>=e.targetCount&&!e.claimed;return a.jsxs("div",{className:`quest-parchment-scroll ${r?"scroll-claim-ready":""}`,children:[a.jsx("div",{className:"scroll-roller scroll-roller-left"}),a.jsxs("div",{className:"parchment-canvas",children:[a.jsxs("div",{className:"quest-meta-col",children:[a.jsxs("div",{className:"quest-badge-row",children:[a.jsx("span",{className:"quest-emblem-icon",children:a.jsx(Xp,{size:14,color:"#78350f"})}),a.jsx("span",{className:"quest-text-heading",children:e.title})]}),a.jsxs("div",{className:"quest-wooden-track",children:[a.jsx("div",{className:"quest-leaf-fill",style:{width:`${n}%`}}),a.jsxs("span",{className:"quest-step-label game-stroke",children:[e.currentCount," / ",e.targetCount]})]})]}),a.jsx("div",{className:"quest-action-slot",children:r?a.jsx("button",{className:"wax-seal-btn",onClick:()=>t(e.id),children:a.jsxs("div",{className:"wax-seal-core",children:[a.jsx(Qn,{size:16,color:"#fff"}),a.jsx("span",{className:"wax-seal-text",children:"수령!"})]})}):a.jsxs("div",{className:"quest-reward-preview game-stroke",children:[a.jsxs("span",{children:["🪙 +",e.rewardGold]}),a.jsxs("span",{children:["💎 +",e.rewardGems]})]})})]}),a.jsx("div",{className:"scroll-roller scroll-roller-right"}),a.jsx("style",{children:`
        .quest-parchment-scroll {
          position: relative;
          margin: 0 12px 6px;
          display: flex;
          align-items: center;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45));
          z-index: 35;
        }

        .scroll-roller {
          width: 12px;
          height: 52px;
          background: linear-gradient(180deg, #8c5b38 0%, #4a2f1b 50%, #2a180c 100%);
          border: 1.5px solid #23160c;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
          flex-shrink: 0;
          z-index: 2;
        }

        .parchment-canvas {
          flex: 1;
          height: 46px;
          background: linear-gradient(180deg, #fef8ee 0%, #f3e6cf 50%, #e6d3b4 100%);
          border-top: 2px solid #caa882;
          border-bottom: 2.5px solid #9c7b55;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .scroll-claim-ready .parchment-canvas {
          background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
          border-color: #f59e0b;
        }

        .quest-meta-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }

        .quest-badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
        }

        .quest-emblem-icon {
          display: flex;
          align-items: center;
        }

        .quest-text-heading {
          font-family: var(--font-game);
          font-size: 0.82rem;
          color: #451a03;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quest-wooden-track {
          position: relative;
          width: 100%;
          height: 10px;
          background: #3a2212;
          border-radius: 6px;
          border: 1px solid #784c28;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quest-leaf-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .quest-step-label {
          position: relative;
          font-size: 0.58rem;
          color: #ffffff;
          line-height: 1;
        }

        .quest-action-slot {
          flex-shrink: 0;
        }

        /* 🔴 3D Wax Seal Button */
        .wax-seal-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f43f5e 0%, #e11d48 50%, #881337 100%);
          border: 2px solid #ffe4e6;
          border-bottom: 4px solid #4c0519;
          box-shadow: 0 4px 10px rgba(225, 29, 72, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.08s ease;
          animation: waxPulse 1.2s infinite;
        }

        @keyframes waxPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); box-shadow: 0 0 16px rgba(244, 63, 94, 0.85); }
        }

        .wax-seal-btn:active {
          transform: translateY(2px) scale(0.95);
          border-bottom-width: 2px;
        }

        .wax-seal-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .wax-seal-text {
          font-family: var(--font-game);
          font-size: 0.55rem;
          color: #fff;
          font-weight: 900;
          line-height: 1;
        }

        .quest-reward-preview {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1px;
          font-size: 0.65rem;
          color: #fef08a;
          line-height: 1.1;
        }
      `})]})},dm=({activeTab:e,onTabChange:t,badges:n={}})=>{const r=[{tab:"adventure",label:"모험",icon:a.jsx(Ul,{size:20})},{tab:"hero",label:"영웅",icon:a.jsx(tm,{size:20})},{tab:"equipment",label:"장비",icon:a.jsx(za,{size:20})},{tab:"pet",label:"펫",icon:a.jsx(Qn,{size:20})},{tab:"shop",label:"상점",icon:a.jsx(Jp,{size:20})}];return a.jsxs("nav",{className:"game-console-nav",children:[a.jsx("div",{className:"nav-timber-frame",children:r.map(l=>{const o=e===l.tab,s=!!n[l.tab];return a.jsxs("button",{className:`game-nav-btn ${o?"nav-btn-active":"nav-btn-inactive"}`,onClick:()=>t(l.tab),"aria-label":l.label,children:[o&&a.jsx("div",{className:"active-light-beam"}),a.jsxs("div",{className:"nav-btn-core",children:[a.jsxs("div",{className:"nav-icon-slot",children:[l.icon,s&&a.jsx("div",{className:"ruby-badge-gem"})]}),a.jsx("span",{className:"nav-btn-text game-stroke",children:l.label})]})]},l.tab)})}),a.jsx("style",{children:`
        .game-console-nav {
          position: relative;
          width: 100%;
          background: linear-gradient(180deg, #422d1d 0%, #2b1d12 40%, #170e08 100%);
          border-top: 3.5px solid #d97706;
          padding-bottom: max(6px, env(safe-area-inset-bottom));
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.7), inset 0 2px 0 rgba(254, 240, 138, 0.4);
          z-index: 50;
        }

        .nav-timber-frame {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 6px 8px 4px;
          gap: 6px;
        }

        /* 3D Tactile Nav Button */
        .game-nav-btn {
          flex: 1;
          position: relative;
          min-height: 52px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: transform 0.08s ease, filter 0.08s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
        }

        .nav-btn-inactive {
          background: linear-gradient(180deg, #5c3c26 0%, #3e2617 60%, #29180c 100%);
          border: 1.5px solid #784c28;
          border-bottom: 4px solid #140b05;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.35);
          color: #d4bda8;
        }
        .nav-btn-inactive:active {
          transform: translateY(3px);
          border-bottom-width: 1.5px;
        }

        /* 🌟 Raised 6px Upward with Golden Aura */
        .nav-btn-active {
          transform: translateY(-8px);
          background: linear-gradient(180deg, #fef08a 0%, #f59e0b 45%, #b45309 100%);
          border: 2px solid #fff;
          border-bottom: 5px solid #451a03;
          box-shadow: 0 8px 18px rgba(245, 158, 11, 0.55), 0 0 12px rgba(254, 240, 138, 0.8);
          color: #ffffff;
        }
        .nav-btn-active:active {
          transform: translateY(-5px);
          border-bottom-width: 2px;
        }

        .active-light-beam {
          position: absolute;
          top: -12px;
          width: 30px;
          height: 12px;
          background: radial-gradient(ellipse at center, rgba(254, 240, 138, 0.8) 0%, transparent 70%);
          pointer-events: none;
        }

        .nav-btn-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          position: relative;
          z-index: 2;
        }

        .nav-icon-slot {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
        }

        .nav-btn-text {
          font-size: 0.68rem;
          color: #ffffff;
          line-height: 1;
        }

        .nav-btn-active .nav-btn-text {
          color: #ffffff;
          font-weight: 900;
        }

        /* 💎 Ruby Gem Badge Dot */
        .ruby-badge-gem {
          position: absolute;
          top: -4px;
          right: -6px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fda4af 0%, #f43f5e 50%, #9f1239 100%);
          border: 1.5px solid #ffffff;
          box-shadow: 0 0 6px #f43f5e;
          animation: gemBlink 1.5s infinite;
        }

        @keyframes gemBlink {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); box-shadow: 0 0 10px #f43f5e; }
        }
      `})]})},fm=({seconds:e,gold:t,exp:n,onClaim:r})=>{const l=o=>{const s=Math.floor(o/3600),i=Math.floor(o%3600/60),u=o%60,d=[];return s>0&&d.push(`${s}시간`),(i>0||s>0)&&d.push(`${i}분`),d.push(`${u}초`),d.join(" ")};return a.jsxs("div",{className:"modal-backdrop",children:[a.jsxs("div",{className:"modal-content offline-modal-content",children:[a.jsx("div",{className:"offline-header-icon",children:a.jsx(Yp,{size:36,color:"#f59e0b"})}),a.jsx("h2",{className:"offline-title",children:"WELCOME BACK!"}),a.jsxs("p",{className:"offline-subtext",children:["자리를 비운 동안에도 작은 모험가가",a.jsx("br",{}),"열심히 몬스터를 사냥하고 있었습니다!"]}),a.jsxs("div",{className:"offline-stats-card",children:[a.jsxs("div",{className:"offline-stat-row",children:[a.jsx("span",{className:"stat-label",children:"방치 시간"}),a.jsx("span",{className:"stat-val time-val",children:l(e)})]}),a.jsx("div",{className:"stat-divider"}),a.jsxs("div",{className:"offline-stat-row",children:[a.jsx("span",{className:"stat-label",children:"획득 골드"}),a.jsxs("span",{className:"stat-val gold-val",children:["+",t.toLocaleString()," 🪙"]})]}),a.jsxs("div",{className:"offline-stat-row",children:[a.jsx("span",{className:"stat-label",children:"획득 경험치"}),a.jsxs("span",{className:"stat-val exp-val",children:["+",n.toLocaleString()," EXP"]})]})]}),a.jsxs("button",{className:"cozy-btn cozy-btn-gold offline-claim-btn",onClick:r,children:[a.jsx(Qn,{size:18}),a.jsx("span",{children:"보상 모두 받기"})]})]}),a.jsx("style",{children:`
        .offline-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .offline-header-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
        }
        .offline-title {
          font-family: var(--font-accent);
          font-size: 1.8rem;
          color: var(--cozy-brown);
          letter-spacing: 1px;
        }
        .offline-subtext {
          font-size: 0.85rem;
          color: var(--cozy-brown-light);
          line-height: 1.45;
          margin: 6px 0 16px;
        }
        .offline-stats-card {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid var(--border-soft);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .offline-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-divider {
          height: 1px;
          background: var(--border-soft);
          margin: 2px 0;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--cozy-brown-light);
        }
        .stat-val {
          font-size: 0.95rem;
          font-weight: 900;
        }
        .time-val {
          color: var(--sage-green-dark);
        }
        .gold-val {
          color: #b45309;
        }
        .exp-val {
          color: #0284c7;
        }
        .offline-claim-btn {
          width: 100%;
          min-height: 48px;
          font-size: 1.05rem;
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
        }
      `})]})};var Ns={};(function e(t,n,r,l){var o=!!(t.Worker&&t.Blob&&t.Promise&&t.OffscreenCanvas&&t.OffscreenCanvasRenderingContext2D&&t.HTMLCanvasElement&&t.HTMLCanvasElement.prototype.transferControlToOffscreen&&t.URL&&t.URL.createObjectURL),s=typeof Path2D=="function"&&typeof DOMMatrix=="function",i=function(){if(!t.OffscreenCanvas)return!1;try{var p=new OffscreenCanvas(1,1),f=p.getContext("2d");f.fillRect(0,0,1,1);var z=p.transferToImageBitmap();f.createPattern(z,"no-repeat")}catch{return!1}return!0}();function u(){}function d(p){var f=n.exports.Promise,z=f!==void 0?f:t.Promise;return typeof z=="function"?new z(p):(p(u,u),null)}var v=function(p,f){return{transform:function(z){if(p)return z;if(f.has(z))return f.get(z);var I=new OffscreenCanvas(z.width,z.height),F=I.getContext("2d");return F.drawImage(z,0,0),f.set(z,I),I},clear:function(){f.clear()}}}(i,new Map),x=function(){var p=Math.floor(16.666666666666668),f,z,I={},F=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(f=function($){var H=Math.random();return I[H]=requestAnimationFrame(function O(G){F===G||F+p-1<G?(F=G,delete I[H],$()):I[H]=requestAnimationFrame(O)}),H},z=function($){I[$]&&cancelAnimationFrame(I[$])}):(f=function($){return setTimeout($,p)},z=function($){return clearTimeout($)}),{frame:f,cancel:z}}(),m=function(){var p,f,z={};function I(F){function $(H,O){F.postMessage({options:H||{},callback:O})}F.init=function(O){var G=O.transferControlToOffscreen();F.postMessage({canvas:G},[G])},F.fire=function(O,G,J){if(f)return $(O,null),f;var ae=Math.random().toString(36).slice(2);return f=d(function(ee){function se(xe){xe.data.callback===ae&&(delete z[ae],F.removeEventListener("message",se),f=null,v.clear(),J(),ee())}F.addEventListener("message",se),$(O,ae),z[ae]=se.bind(null,{data:{callback:ae}})}),f},F.reset=function(){F.postMessage({reset:!0});for(var O in z)z[O](),delete z[O]}}return function(){if(p)return p;if(!r&&o){var F=["var CONFETTI, SIZE = {}, module = {};","("+e.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{p=new Worker(URL.createObjectURL(new Blob([F])))}catch($){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",$),null}I(p)}return p}}(),y={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function S(p,f){return f?f(p):p}function b(p){return p!=null}function R(p,f,z){return S(p&&b(p[f])?p[f]:y[f],z)}function g(p){return p<0?0:Math.floor(p)}function c(p,f){return Math.floor(Math.random()*(f-p))+p}function h(p){return parseInt(p,16)}function w(p){return p.map(j)}function j(p){var f=String(p).replace(/[^0-9a-f]/gi,"");return f.length<6&&(f=f[0]+f[0]+f[1]+f[1]+f[2]+f[2]),{r:h(f.substring(0,2)),g:h(f.substring(2,4)),b:h(f.substring(4,6))}}function C(p){var f=R(p,"origin",Object);return f.x=R(f,"x",Number),f.y=R(f,"y",Number),f}function _(p){p.width=document.documentElement.clientWidth,p.height=document.documentElement.clientHeight}function P(p){var f=p.getBoundingClientRect();p.width=f.width,p.height=f.height}function te(p){var f=document.createElement("canvas");return f.style.position="fixed",f.style.top="0px",f.style.left="0px",f.style.pointerEvents="none",f.style.zIndex=p,f}function W(p,f,z,I,F,$,H,O,G){p.save(),p.translate(f,z),p.rotate($),p.scale(I,F),p.arc(0,0,1,H,O,G),p.restore()}function Ee(p){var f=p.angle*(Math.PI/180),z=p.spread*(Math.PI/180);return{x:p.x,y:p.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:p.startVelocity*.5+Math.random()*p.startVelocity,angle2D:-f+(.5*z-Math.random()*z),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:p.color,shape:p.shape,tick:0,totalTicks:p.ticks,decay:p.decay,drift:p.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:p.gravity*3,ovalScalar:.6,scalar:p.scalar,flat:p.flat}}function wt(p,f){f.x+=Math.cos(f.angle2D)*f.velocity+f.drift,f.y+=Math.sin(f.angle2D)*f.velocity+f.gravity,f.velocity*=f.decay,f.flat?(f.wobble=0,f.wobbleX=f.x+10*f.scalar,f.wobbleY=f.y+10*f.scalar,f.tiltSin=0,f.tiltCos=0,f.random=1):(f.wobble+=f.wobbleSpeed,f.wobbleX=f.x+10*f.scalar*Math.cos(f.wobble),f.wobbleY=f.y+10*f.scalar*Math.sin(f.wobble),f.tiltAngle+=.1,f.tiltSin=Math.sin(f.tiltAngle),f.tiltCos=Math.cos(f.tiltAngle),f.random=Math.random()+2);var z=f.tick++/f.totalTicks,I=f.x+f.random*f.tiltCos,F=f.y+f.random*f.tiltSin,$=f.wobbleX+f.random*f.tiltCos,H=f.wobbleY+f.random*f.tiltSin;if(p.fillStyle="rgba("+f.color.r+", "+f.color.g+", "+f.color.b+", "+(1-z)+")",p.beginPath(),s&&f.shape.type==="path"&&typeof f.shape.path=="string"&&Array.isArray(f.shape.matrix))p.fill(Pt(f.shape.path,f.shape.matrix,f.x,f.y,Math.abs($-I)*.1,Math.abs(H-F)*.1,Math.PI/10*f.wobble));else if(f.shape.type==="bitmap"){var O=Math.PI/10*f.wobble,G=Math.abs($-I)*.1,J=Math.abs(H-F)*.1,ae=f.shape.bitmap.width*f.scalar,ee=f.shape.bitmap.height*f.scalar,se=new DOMMatrix([Math.cos(O)*G,Math.sin(O)*G,-Math.sin(O)*J,Math.cos(O)*J,f.x,f.y]);se.multiplySelf(new DOMMatrix(f.shape.matrix));var xe=p.createPattern(v.transform(f.shape.bitmap),"no-repeat");xe.setTransform(se),p.globalAlpha=1-z,p.fillStyle=xe,p.fillRect(f.x-ae/2,f.y-ee/2,ae,ee),p.globalAlpha=1}else if(f.shape==="circle")p.ellipse?p.ellipse(f.x,f.y,Math.abs($-I)*f.ovalScalar,Math.abs(H-F)*f.ovalScalar,Math.PI/10*f.wobble,0,2*Math.PI):W(p,f.x,f.y,Math.abs($-I)*f.ovalScalar,Math.abs(H-F)*f.ovalScalar,Math.PI/10*f.wobble,0,2*Math.PI);else if(f.shape==="star")for(var q=Math.PI/2*3,Me=4*f.scalar,Ue=8*f.scalar,Ve=f.x,ot=f.y,kt=5,Ze=Math.PI/kt;kt--;)Ve=f.x+Math.cos(q)*Ue,ot=f.y+Math.sin(q)*Ue,p.lineTo(Ve,ot),q+=Ze,Ve=f.x+Math.cos(q)*Me,ot=f.y+Math.sin(q)*Me,p.lineTo(Ve,ot),q+=Ze;else p.moveTo(Math.floor(f.x),Math.floor(f.y)),p.lineTo(Math.floor(f.wobbleX),Math.floor(F)),p.lineTo(Math.floor($),Math.floor(H)),p.lineTo(Math.floor(I),Math.floor(f.wobbleY));return p.closePath(),p.fill(),f.tick<f.totalTicks}function mt(p,f,z,I,F){var $=f.slice(),H=p.getContext("2d"),O,G,J=d(function(ae){function ee(){O=G=null,H.clearRect(0,0,I.width,I.height),v.clear(),F(),ae()}function se(){r&&!(I.width===l.width&&I.height===l.height)&&(I.width=p.width=l.width,I.height=p.height=l.height),!I.width&&!I.height&&(z(p),I.width=p.width,I.height=p.height),H.clearRect(0,0,I.width,I.height),$=$.filter(function(xe){return wt(H,xe)}),$.length?O=x.frame(se):ee()}O=x.frame(se),G=ee});return{addFettis:function(ae){return $=$.concat(ae),J},canvas:p,promise:J,reset:function(){O&&x.cancel(O),G&&G()}}}function en(p,f){var z=!p,I=!!R(f||{},"resize"),F=!1,$=R(f,"disableForReducedMotion",Boolean),H=o&&!!R(f||{},"useWorker"),O=H?m():null,G=z?_:P,J=p&&O?!!p.__confetti_initialized:!1,ae=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,ee;function se(q,Me,Ue){for(var Ve=R(q,"particleCount",g),ot=R(q,"angle",Number),kt=R(q,"spread",Number),Ze=R(q,"startVelocity",Number),ao=R(q,"decay",Number),so=R(q,"gravity",Number),io=R(q,"drift",Number),Br=R(q,"colors",w),k=R(q,"ticks",Number),M=R(q,"shapes"),E=R(q,"scalar"),V=!!R(q,"flat"),D=C(q),A=Ve,ne=[],K=p.width*D.x,Se=p.height*D.y;A--;)ne.push(Ee({x:K,y:Se,angle:ot,spread:kt,startVelocity:Ze,color:Br[A%Br.length],shape:M[c(0,M.length)],ticks:k,decay:ao,gravity:so,drift:io,scalar:E,flat:V}));return ee?ee.addFettis(ne):(ee=mt(p,ne,G,Me,Ue),ee.promise)}function xe(q){var Me=$||R(q,"disableForReducedMotion",Boolean),Ue=R(q,"zIndex",Number);if(Me&&ae)return d(function(Ze){Ze()});z&&ee?p=ee.canvas:z&&!p&&(p=te(Ue),document.body.appendChild(p)),I&&!J&&G(p);var Ve={width:p.width,height:p.height};O&&!J&&O.init(p),J=!0,O&&(p.__confetti_initialized=!0);function ot(){if(O){var Ze={getBoundingClientRect:function(){if(!z)return p.getBoundingClientRect()}};G(Ze),O.postMessage({resize:{width:Ze.width,height:Ze.height}});return}Ve.width=Ve.height=null}function kt(){ee=null,I&&(F=!1,t.removeEventListener("resize",ot)),z&&p&&(document.body.contains(p)&&document.body.removeChild(p),p=null,J=!1)}return I&&!F&&(F=!0,t.addEventListener("resize",ot,!1)),O?O.fire(q,Ve,kt):se(q,Ve,kt)}return xe.reset=function(){O&&O.reset(),ee&&ee.reset()},xe}var Lt;function Fe(){return Lt||(Lt=en(null,{useWorker:!0,resize:!0})),Lt}function Pt(p,f,z,I,F,$,H){var O=new Path2D(p),G=new Path2D;G.addPath(O,new DOMMatrix(f));var J=new Path2D;return J.addPath(G,new DOMMatrix([Math.cos(H)*F,Math.sin(H)*F,-Math.sin(H)*$,Math.cos(H)*$,z,I])),J}function T(p){if(!s)throw new Error("path confetti are not supported in this browser");var f,z;typeof p=="string"?f=p:(f=p.path,z=p.matrix);var I=new Path2D(f),F=document.createElement("canvas"),$=F.getContext("2d");if(!z){for(var H=1e3,O=H,G=H,J=0,ae=0,ee,se,xe=0;xe<H;xe+=2)for(var q=0;q<H;q+=2)$.isPointInPath(I,xe,q,"nonzero")&&(O=Math.min(O,xe),G=Math.min(G,q),J=Math.max(J,xe),ae=Math.max(ae,q));ee=J-O,se=ae-G;var Me=10,Ue=Math.min(Me/ee,Me/se);z=[Ue,0,0,Ue,-Math.round(ee/2+O)*Ue,-Math.round(se/2+G)*Ue]}return{type:"path",path:f,matrix:z}}function B(p){var f,z=1,I="#000000",F='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof p=="string"?f=p:(f=p.text,z="scalar"in p?p.scalar:z,F="fontFamily"in p?p.fontFamily:F,I="color"in p?p.color:I);var $=10*z,H=""+$+"px "+F,O=new OffscreenCanvas($,$),G=O.getContext("2d");G.font=H;var J=G.measureText(f),ae=Math.ceil(J.actualBoundingBoxRight+J.actualBoundingBoxLeft),ee=Math.ceil(J.actualBoundingBoxAscent+J.actualBoundingBoxDescent),se=2,xe=J.actualBoundingBoxLeft+se,q=J.actualBoundingBoxAscent+se;ae+=se+se,ee+=se+se,O=new OffscreenCanvas(ae,ee),G=O.getContext("2d"),G.font=H,G.fillStyle=I,G.fillText(f,xe,q);var Me=1/z;return{type:"bitmap",bitmap:O.transferToImageBitmap(),matrix:[Me,0,0,Me,-ae*Me/2,-ee*Me/2]}}n.exports=function(){return Fe().apply(this,arguments)},n.exports.reset=function(){Fe().reset()},n.exports.create=en,n.exports.shapeFromPath=T,n.exports.shapeFromText=B})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),Ns,!1);const sr=Ns.exports;Ns.exports.create;const pm=({item:e,onEquip:t,onClose:n})=>{const r=Ge[e.rarity];return U.useEffect(()=>{(e.rarity==="epic"||e.rarity==="legendary"||e.rarity==="mythic")&&sr({particleCount:50,spread:60,origin:{y:.6}})},[e]),a.jsxs("div",{className:"modal-backdrop",children:[a.jsxs("div",{className:"modal-content gacha-modal-content",children:[a.jsxs("div",{className:"gacha-title-badge",style:{background:r.bgColor,color:r.color,borderColor:r.borderColor},children:[a.jsx(Qn,{size:14}),a.jsxs("span",{children:[r.label," 획득!"]})]}),a.jsxs("div",{className:"gacha-card",style:{borderColor:r.borderColor,boxShadow:`0 8px 30px ${r.glowColor}`,background:`radial-gradient(circle at 50% 30%, #ffffff 0%, ${r.bgColor} 100%)`},children:[a.jsx("div",{className:"gacha-item-icon",children:e.icon}),a.jsx("div",{className:"gacha-item-name",style:{color:r.color},children:e.name}),a.jsxs("div",{className:"gacha-item-slot",children:[e.slot.toUpperCase()," Lv.",e.level]}),a.jsxs("div",{className:"gacha-stats-grid",children:[e.atk>0&&a.jsxs("span",{className:"stat-chip atk-chip",children:["⚔️ ATK +",e.atk]}),e.hp>0&&a.jsxs("span",{className:"stat-chip hp-chip",children:["❤️ HP +",e.hp]}),e.def>0&&a.jsxs("span",{className:"stat-chip def-chip",children:["🛡️ DEF +",e.def]}),e.critRate&&a.jsxs("span",{className:"stat-chip crit-chip",children:["🎯 치명타 +",Math.round(e.critRate*100),"%"]})]})]}),a.jsxs("div",{className:"gacha-actions",children:[a.jsx("button",{className:"cozy-btn cozy-btn-gold gacha-equip-btn",onClick:()=>t(e),children:a.jsx("span",{children:"즉시 장착하기"})}),a.jsx("button",{className:"cozy-btn cozy-btn-outline gacha-close-btn",onClick:n,children:a.jsx("span",{children:"가방에 보관"})})]})]}),a.jsx("style",{children:`
        .gacha-modal-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .gacha-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1.5px solid;
        }
        .gacha-card {
          width: 100%;
          border: 2px solid;
          border-radius: 20px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .gacha-item-icon {
          font-size: 4.2rem;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
          animation: itemBounce 1.5s ease-in-out infinite;
        }
        @keyframes itemBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .gacha-item-name {
          font-size: 1.25rem;
          font-weight: 900;
        }
        .gacha-item-slot {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--cozy-brown-light);
          letter-spacing: 0.5px;
        }
        .gacha-stats-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
        }
        .stat-chip {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          color: var(--cozy-brown);
        }
        .gacha-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }
        .gacha-equip-btn {
          width: 100%;
          min-height: 48px;
        }
        .gacha-close-btn {
          width: 100%;
          min-height: 42px;
        }
      `})]})},mm=({settings:e,onUpdateSettings:t,onResetData:n,onClose:r})=>a.jsxs("div",{className:"modal-backdrop",children:[a.jsxs("div",{className:"modal-content settings-modal-content",children:[a.jsxs("div",{className:"settings-header",children:[a.jsx("h3",{className:"settings-title",children:"⚙️ 게임 설정"}),a.jsx("button",{className:"settings-close-icon-btn",onClick:r,children:a.jsx(Dr,{size:20})})]}),a.jsxs("div",{className:"settings-options-list",children:[a.jsxs("div",{className:"settings-option-item",children:[a.jsxs("div",{className:"option-info",children:[a.jsx(Kp,{size:18,color:"var(--sage-green-dark)"}),a.jsxs("div",{className:"option-texts",children:[a.jsx("span",{className:"option-name",children:"배경음악 (BGM)"}),a.jsx("span",{className:"option-desc",children:"힐링 멜로디 루프"})]})]}),a.jsx("button",{className:`cozy-toggle-btn ${e.bgmEnabled?"active":""}`,onClick:()=>t({bgmEnabled:!e.bgmEnabled}),children:e.bgmEnabled?"ON":"OFF"})]}),a.jsxs("div",{className:"settings-option-item",children:[a.jsxs("div",{className:"option-info",children:[e.sfxEnabled?a.jsx(nm,{size:18,color:"var(--sage-green-dark)"}):a.jsx(rm,{size:18,color:"#94a3b8"}),a.jsxs("div",{className:"option-texts",children:[a.jsx("span",{className:"option-name",children:"효과음 (SFX)"}),a.jsx("span",{className:"option-desc",children:"타격, 코인, 레벨업 사운드"})]})]}),a.jsx("button",{className:`cozy-toggle-btn ${e.sfxEnabled?"active":""}`,onClick:()=>t({sfxEnabled:!e.sfxEnabled}),children:e.sfxEnabled?"ON":"OFF"})]}),a.jsxs("div",{className:"settings-option-item",children:[a.jsxs("div",{className:"option-info",children:[a.jsx("span",{style:{fontSize:"1.1rem"},children:"💥"}),a.jsxs("div",{className:"option-texts",children:[a.jsx("span",{className:"option-name",children:"데미지 숫자 표시"}),a.jsx("span",{className:"option-desc",children:"전투 시 플로팅 텍스트"})]})]}),a.jsx("button",{className:`cozy-toggle-btn ${e.damageNumbers?"active":""}`,onClick:()=>t({damageNumbers:!e.damageNumbers}),children:e.damageNumbers?"ON":"OFF"})]})]}),a.jsx("div",{className:"settings-danger-box",children:a.jsxs("button",{className:"cozy-btn cozy-btn-outline reset-data-btn",onClick:n,children:[a.jsx(em,{size:16,color:"var(--accent-red)"}),a.jsx("span",{style:{color:"var(--accent-red)"},children:"게임 데이터 초기화"})]})}),a.jsxs("div",{className:"settings-footer",children:[a.jsx("span",{children:"포근한 숲속 모험단 v1.0.0"}),a.jsx("span",{children:"Designed for Mobile & PC"})]})]}),a.jsx("style",{children:`
        .settings-modal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .settings-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--cozy-brown);
        }
        .settings-close-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--cozy-brown-light);
        }
        .settings-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .settings-option-item {
          background: #ffffff;
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .option-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .option-texts {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .option-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--cozy-brown);
        }
        .option-desc {
          font-size: 0.7rem;
          color: var(--cozy-brown-light);
        }
        .cozy-toggle-btn {
          min-width: 58px;
          height: 32px;
          border-radius: 16px;
          border: 1.5px solid var(--border-soft);
          background: #f1f5f9;
          color: #94a3b8;
          font-weight: 900;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cozy-toggle-btn.active {
          background: var(--sage-green-dark);
          color: #ffffff;
          border-color: var(--sage-green-dark);
        }
        .settings-danger-box {
          margin-top: 6px;
        }
        .reset-data-btn {
          width: 100%;
          min-height: 40px;
          border-color: rgba(244, 63, 94, 0.3);
          font-size: 0.82rem;
        }
        .settings-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.68rem;
          color: var(--cozy-brown-light);
          margin-top: 4px;
        }
      `})]}),hm=({stats:e,totalAtk:t,totalHp:n,totalDef:r,combatPower:l,activePet:o,onUpgradeStat:s,onClose:i})=>{const[u,d]=U.useState(1),v=c=>Math.floor(25*Math.pow(1.12,c-1)),x=c=>Math.floor(20*Math.pow(1.1,c-1)),m=c=>Math.floor(30*Math.pow(1.13,c-1)),y=c=>{let h=c==="atk"?e.atkLevel:c==="hp"?e.hpLevel:e.defLevel;const w=c==="atk"?v:c==="hp"?x:m;let j=1,C=0;if(u===1)j=1,C=w(h);else if(u===10){j=10;for(let _=0;_<10;_++)C+=w(h+_)}else{let _=e.gold,P=0;for(;_>=w(h+P)&&P<100;)_-=w(h+P),C+=w(h+P),P++;j=Math.max(1,P)}return{count:j,cost:C,canAfford:e.gold>=C&&C>0,nextLvl:h+j}},S=y("atk"),b=y("hp"),R=y("def"),g=(c,h)=>{X.playUpgrade(),s(c,h)};return a.jsxs("div",{className:"half-sheet-drawer",children:[a.jsxs("div",{className:"drawer-header",children:[a.jsxs("div",{className:"drawer-title",children:[a.jsx("span",{children:"🛡️ 영웅 성장 수첩"}),a.jsxs("span",{className:"hero-level-chip game-stroke",children:["Lv.",e.level]})]}),i&&a.jsx("button",{className:"drawer-close-btn",onClick:i,children:a.jsx(Dr,{size:18,color:"#fef08a"})})]}),a.jsxs("div",{className:"drawer-content",children:[a.jsxs("div",{className:"combat-power-banner",children:[a.jsxs("div",{className:"power-banner-left",children:[a.jsx(Qn,{size:18,color:"#f59e0b"}),a.jsx("span",{className:"power-banner-label",children:"종합 전투력"})]}),a.jsx("span",{className:"power-banner-val game-stroke-gold",children:l.toLocaleString()})]}),a.jsxs("div",{className:"core-stats-deck",children:[a.jsxs("div",{className:"stat-card-beveled",children:[a.jsx(Ul,{size:16,color:"#ef4444"}),a.jsxs("div",{className:"stat-texts",children:[a.jsx("span",{className:"stat-name",children:"공격력"}),a.jsx("span",{className:"stat-value",children:t.toLocaleString()})]})]}),a.jsxs("div",{className:"stat-card-beveled",children:[a.jsx(Fi,{size:16,color:"#22c55e"}),a.jsxs("div",{className:"stat-texts",children:[a.jsx("span",{className:"stat-name",children:"최대 체력"}),a.jsx("span",{className:"stat-value",children:n.toLocaleString()})]})]}),a.jsxs("div",{className:"stat-card-beveled",children:[a.jsx(za,{size:16,color:"#3b82f6"}),a.jsxs("div",{className:"stat-texts",children:[a.jsx("span",{className:"stat-name",children:"방어력"}),a.jsx("span",{className:"stat-value",children:r.toLocaleString()})]})]}),a.jsxs("div",{className:"stat-card-beveled",children:[a.jsx(ed,{size:16,color:"#f59e0b"}),a.jsxs("div",{className:"stat-texts",children:[a.jsx("span",{className:"stat-name",children:"치명 / 공속"}),a.jsxs("span",{className:"stat-value",children:[Math.round(e.critRate*100),"% / ",e.atkSpeed.toFixed(1),"/s"]})]})]})]}),a.jsxs("div",{className:"upgrade-multiplier-row",children:[a.jsx("span",{className:"multiplier-text",children:"강화 배율:"}),a.jsxs("div",{className:"multiplier-btn-group",children:[a.jsx("button",{className:`multiplier-pill-btn ${u===1?"pill-active":""}`,onClick:()=>d(1),children:"x1"}),a.jsx("button",{className:`multiplier-pill-btn ${u===10?"pill-active":""}`,onClick:()=>d(10),children:"x10"}),a.jsx("button",{className:`multiplier-pill-btn ${u==="max"?"pill-active":""}`,onClick:()=>d("max"),children:"MAX"})]})]}),a.jsxs("div",{className:"stat-upgrade-list",children:[a.jsxs("div",{className:"parchment-panel upgrade-parchment-row",children:[a.jsxs("div",{className:"upgrade-meta-left",children:[a.jsx("div",{className:"upgrade-icon-frame atk-icon-frame",children:a.jsx(Ul,{size:20,color:"#b91c1c"})}),a.jsxs("div",{className:"upgrade-name-col",children:[a.jsx("span",{className:"upgrade-stat-title",children:"공격력 강화"}),a.jsxs("span",{className:"upgrade-stat-level",children:["Lv.",e.atkLevel," → ",S.nextLvl]}),a.jsxs("span",{className:"upgrade-stat-gain",children:["기본 ATK +",S.count*4]})]})]}),a.jsxs("button",{className:"btn-game btn-game-gold upgrade-action-btn",disabled:!S.canAfford,onClick:()=>g("atk",S.count),children:[a.jsx("span",{className:"game-stroke",children:"강화"}),a.jsxs("span",{className:"upgrade-cost-text game-stroke",children:["🪙 ",S.cost.toLocaleString()]})]})]}),a.jsxs("div",{className:"parchment-panel upgrade-parchment-row",children:[a.jsxs("div",{className:"upgrade-meta-left",children:[a.jsx("div",{className:"upgrade-icon-frame hp-icon-frame",children:a.jsx(Fi,{size:20,color:"#15803d"})}),a.jsxs("div",{className:"upgrade-name-col",children:[a.jsx("span",{className:"upgrade-stat-title",children:"체력 강화"}),a.jsxs("span",{className:"upgrade-stat-level",children:["Lv.",e.hpLevel," → ",b.nextLvl]}),a.jsxs("span",{className:"upgrade-stat-gain",children:["기본 HP +",b.count*35]})]})]}),a.jsxs("button",{className:"btn-game btn-game-green upgrade-action-btn",disabled:!b.canAfford,onClick:()=>g("hp",b.count),children:[a.jsx("span",{className:"game-stroke",children:"강화"}),a.jsxs("span",{className:"upgrade-cost-text game-stroke",children:["🪙 ",b.cost.toLocaleString()]})]})]}),a.jsxs("div",{className:"parchment-panel upgrade-parchment-row",children:[a.jsxs("div",{className:"upgrade-meta-left",children:[a.jsx("div",{className:"upgrade-icon-frame def-icon-frame",children:a.jsx(za,{size:20,color:"#1e40af"})}),a.jsxs("div",{className:"upgrade-name-col",children:[a.jsx("span",{className:"upgrade-stat-title",children:"방어력 강화"}),a.jsxs("span",{className:"upgrade-stat-level",children:["Lv.",e.defLevel," → ",R.nextLvl]}),a.jsxs("span",{className:"upgrade-stat-gain",children:["기본 DEF +",R.count*2]})]})]}),a.jsxs("button",{className:"btn-game btn-game-wood upgrade-action-btn",disabled:!R.canAfford,onClick:()=>g("def",R.count),children:[a.jsx("span",{className:"game-stroke",children:"강화"}),a.jsxs("span",{className:"upgrade-cost-text game-stroke",children:["🪙 ",R.cost.toLocaleString()]})]})]})]})]}),a.jsx("style",{children:`
        .drawer-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #4a2f1b;
          border: 1.5px solid #8c5b38;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hero-level-chip {
          background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
          color: #ffffff;
          font-size: 0.72rem;
          padding: 1px 8px;
          border-radius: 10px;
          border: 1.5px solid #fff;
        }

        .combat-power-banner {
          background: linear-gradient(180deg, #5c3c26 0%, #3e2617 100%);
          border: 2px solid #f59e0b;
          border-radius: 14px;
          padding: 8px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }

        .power-banner-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .power-banner-label {
          font-family: var(--font-game);
          font-size: 0.85rem;
          color: #fef08a;
        }

        .power-banner-val {
          font-size: 1.25rem;
        }

        .core-stats-deck {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .stat-card-beveled {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 12px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .stat-texts {
          display: flex;
          flex-direction: column;
        }

        .stat-name {
          font-size: 0.65rem;
          color: #a8927e;
          font-weight: 700;
        }

        .stat-value {
          font-family: var(--font-game);
          font-size: 0.88rem;
          color: #fef8ee;
        }

        .upgrade-multiplier-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .multiplier-text {
          font-family: var(--font-game);
          font-size: 0.8rem;
          color: #d4bda8;
        }

        .multiplier-btn-group {
          display: flex;
          gap: 6px;
        }

        .multiplier-pill-btn {
          min-width: 46px;
          height: 28px;
          border-radius: 8px;
          background: #322013;
          border: 1.5px solid #5d3f28;
          color: #d4bda8;
          font-family: var(--font-game);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .multiplier-pill-btn.pill-active {
          background: #f59e0b;
          border-color: #fef08a;
          color: #3a1d00;
          font-weight: 900;
        }

        .stat-upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upgrade-parchment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
        }

        .upgrade-meta-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .upgrade-icon-frame {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          flex-shrink: 0;
        }
        .atk-icon-frame { background: #fee2e2; border-color: #fca5a5; }
        .hp-icon-frame { background: #dcfce7; border-color: #86efac; }
        .def-icon-frame { background: #dbeafe; border-color: #93c5fd; }

        .upgrade-name-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .upgrade-stat-title {
          font-family: var(--font-game);
          font-size: 0.92rem;
          color: #382110;
        }

        .upgrade-stat-level {
          font-size: 0.7rem;
          font-weight: 800;
          color: #15803d;
        }

        .upgrade-stat-gain {
          font-size: 0.68rem;
          color: #785232;
        }

        .upgrade-action-btn {
          min-width: 96px;
          min-height: 42px;
          flex-direction: column;
          gap: 1px;
          padding: 4px 10px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .upgrade-cost-text {
          font-size: 0.68rem;
        }
      `})]})},gm=({equipped:e,inventory:t,gold:n,combatPower:r,onEquip:l,onUnequip:o,onUpgradeItem:s,onAutoEquip:i,onClose:u})=>{var g;const[d,v]=U.useState(null),x=[{slot:"weapon",label:"무기",placeholderIcon:"⚔️"},{slot:"helmet",label:"투구",placeholderIcon:"🪖"},{slot:"armor",label:"갑옷",placeholderIcon:"🛡️"},{slot:"accessory",label:"장신구",placeholderIcon:"💍"}],m=c=>Math.floor(100*Math.pow(1.25,c.level)*Ge[c.rarity].multiplier),y=c=>{X.playTap(),v(c)},S=c=>{X.playFanfare(),l(c),v(null)},b=c=>{X.playTap(),o(c),v(null)},R=c=>{const h=m(c);n>=h&&(X.playUpgrade(),s(c.id,h),v({...c,level:c.level+1,atk:c.atk>0?Math.floor(c.atk*1.15)+2:0,hp:c.hp>0?Math.floor(c.hp*1.15)+15:0,def:c.def>0?Math.floor(c.def*1.15)+2:0}))};return a.jsxs("div",{className:"half-sheet-drawer",children:[a.jsxs("div",{className:"drawer-header",children:[a.jsx("div",{className:"drawer-title",children:a.jsx("span",{children:"🎒 장비 관리 & 인벤토리"})}),u&&a.jsx("button",{className:"drawer-close-btn",onClick:u,children:a.jsx(Dr,{size:18,color:"#fef08a"})})]}),a.jsxs("div",{className:"drawer-content",children:[a.jsx("div",{className:"parchment-panel paperdoll-slots-panel",children:a.jsx("div",{className:"paperdoll-grid",children:x.map(({slot:c,label:h,placeholderIcon:w})=>{const j=e[c],C=j?Ge[j.rarity]:null;return a.jsxs("div",{className:`paperdoll-slot ${j?"slot-occupied":"slot-empty"}`,style:C?{borderColor:C.borderColor,background:`radial-gradient(circle, ${C.bgColor} 0%, #1e140d 100%)`,boxShadow:`0 0 12px ${C.glowColor}`}:{},onClick:()=>j&&y(j),children:[a.jsx("span",{className:"paperdoll-slot-label",children:h}),a.jsx("div",{className:"paperdoll-slot-icon",children:j?j.icon:w}),j?a.jsxs("span",{className:"paperdoll-slot-lvl",style:{color:C==null?void 0:C.color},children:["Lv.",j.level]}):a.jsx("span",{className:"paperdoll-empty-tag",children:"빈 슬롯"})]},c)})})}),a.jsxs("div",{className:"auto-equip-action-bar",children:[a.jsxs("div",{className:"power-stat-box",children:[a.jsx(Qn,{size:16,color:"#f59e0b"}),a.jsx("span",{className:"power-stat-label",children:"전투력:"}),a.jsx("strong",{className:"power-stat-val game-stroke-gold",children:r.toLocaleString()})]}),a.jsxs("button",{className:"btn-game btn-game-gold auto-equip-press-btn",onClick:i,children:[a.jsx(ed,{size:16}),a.jsx("span",{className:"game-stroke",children:"최고 장비 일괄 장착"})]})]}),a.jsxs("div",{className:"inventory-status-bar",children:[a.jsxs("span",{className:"inventory-count-text",children:["보유 장비 (",t.length,")"]}),a.jsx("span",{className:"inventory-guide-tip",children:"터치하여 상세 정보 / 강화"})]}),a.jsx("div",{className:"inventory-tiles-grid",children:t.length===0?a.jsxs("div",{className:"empty-backpack-box",children:[a.jsx("span",{style:{fontSize:"2.5rem"},children:"🎒"}),a.jsxs("p",{children:["인벤토리가 비어 있습니다.",a.jsx("br",{}),"상점에서 장비 상자를 열어보세요!"]})]}):t.map(c=>{const h=Ge[c.rarity],w=Object.values(e).some(j=>(j==null?void 0:j.id)===c.id);return a.jsxs("div",{className:`inv-tile-card ${w?"inv-tile-equipped":""}`,style:{borderColor:h.borderColor,boxShadow:`0 2px 8px ${h.glowColor}`},onClick:()=>y(c),children:[w&&a.jsxs("div",{className:"equipped-ribbon-tag",children:[a.jsx(Jc,{size:10,color:"#fff"}),a.jsx("span",{children:"장착"})]}),a.jsx("span",{className:"inv-tile-icon",children:c.icon}),a.jsx("span",{className:"inv-tile-name",style:{color:h.color},children:c.name}),a.jsxs("span",{className:"inv-tile-level",children:["Lv.",c.level]})]},c.id)})})]}),d&&a.jsx("div",{className:"modal-backdrop",onClick:()=>v(null),children:a.jsxs("div",{className:"modal-content item-detail-modal-beveled",onClick:c=>c.stopPropagation(),children:[a.jsxs("div",{className:"detail-header-row",children:[a.jsx("span",{className:"detail-rarity-badge",style:{background:Ge[d.rarity].bgColor,color:Ge[d.rarity].color,borderColor:Ge[d.rarity].borderColor},children:Ge[d.rarity].label}),a.jsx("h3",{className:"detail-item-title game-stroke",style:{color:Ge[d.rarity].color},children:d.name}),a.jsxs("span",{className:"detail-slot-badge",children:[d.slot.toUpperCase()," Lv.",d.level]})]}),a.jsx("div",{className:"detail-icon-stage",children:d.icon}),a.jsxs("div",{className:"detail-stats-box",children:[d.atk>0&&a.jsxs("div",{className:"stat-comparison-row",children:[a.jsx("span",{children:"⚔️ 공격력"}),a.jsxs("strong",{className:"stat-highlight",children:["+",d.atk]})]}),d.hp>0&&a.jsxs("div",{className:"stat-comparison-row",children:[a.jsx("span",{children:"❤️ 체력"}),a.jsxs("strong",{className:"stat-highlight",children:["+",d.hp]})]}),d.def>0&&a.jsxs("div",{className:"stat-comparison-row",children:[a.jsx("span",{children:"🛡️ 방어력"}),a.jsxs("strong",{className:"stat-highlight",children:["+",d.def]})]}),d.critRate&&a.jsxs("div",{className:"stat-comparison-row",children:[a.jsx("span",{children:"🎯 치명타 확률"}),a.jsxs("strong",{className:"stat-highlight",children:["+",Math.round(d.critRate*100),"%"]})]})]}),a.jsxs("div",{className:"detail-action-column",children:[a.jsxs("button",{className:"btn-game btn-game-gold detail-modal-btn",disabled:n<m(d),onClick:()=>R(d),children:[a.jsx(Zc,{size:16}),a.jsxs("span",{className:"game-stroke",children:["장비 강화 (🪙 ",m(d).toLocaleString(),")"]})]}),((g=e[d.slot])==null?void 0:g.id)===d.id?a.jsx("button",{className:"btn-game btn-game-wood detail-modal-btn",onClick:()=>b(d.slot),children:a.jsx("span",{className:"game-stroke",children:"장비 해제"})}):a.jsx("button",{className:"btn-game btn-game-green detail-modal-btn",onClick:()=>S(d),children:a.jsx("span",{className:"game-stroke",children:"장비 장착"})}),a.jsx("button",{className:"btn-game btn-game-wood detail-modal-btn",onClick:()=>v(null),children:"닫기"})]})]})}),a.jsx("style",{children:`
        .paperdoll-slots-panel {
          padding: 10px;
        }

        .paperdoll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .paperdoll-slot {
          background: #24160d;
          border: 2px solid #5a3820;
          border-radius: 14px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.08s ease;
        }
        .paperdoll-slot:active {
          transform: scale(0.95);
        }

        .paperdoll-slot-label {
          font-family: var(--font-game);
          font-size: 0.65rem;
          color: #d4bda8;
        }

        .paperdoll-slot-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paperdoll-slot-lvl {
          font-family: var(--font-game);
          font-size: 0.65rem;
          font-weight: 900;
        }

        .paperdoll-empty-tag {
          font-size: 0.6rem;
          color: #785232;
        }

        .auto-equip-action-bar {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 14px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .power-stat-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .power-stat-label {
          font-family: var(--font-game);
          font-size: 0.8rem;
          color: #d4bda8;
        }

        .power-stat-val {
          font-size: 0.95rem;
        }

        .auto-equip-press-btn {
          min-height: 38px;
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .inventory-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .inventory-count-text {
          font-family: var(--font-game);
          font-size: 0.9rem;
          color: #fef08a;
        }

        .inventory-guide-tip {
          font-size: 0.7rem;
          color: #a8927e;
        }

        .inventory-tiles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .empty-backpack-box {
          grid-column: 1 / -1;
          background: #24160d;
          border: 1.5px dashed #5d3f28;
          border-radius: 16px;
          padding: 28px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #a8927e;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .inv-tile-card {
          position: relative;
          background: #24160d;
          border: 2px solid;
          border-radius: 14px;
          padding: 10px 4px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          transition: transform 0.08s ease;
        }
        .inv-tile-card:active {
          transform: scale(0.95);
        }

        .equipped-ribbon-tag {
          position: absolute;
          top: -6px;
          right: 4px;
          background: #15803d;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 2px;
          border: 1px solid #86efac;
        }

        .inv-tile-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 3px 5px rgba(0,0,0,0.5));
        }

        .inv-tile-name {
          font-family: var(--font-game);
          font-size: 0.72rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        .inv-tile-level {
          font-size: 0.65rem;
          color: #a8927e;
          font-weight: 700;
        }

        .item-detail-modal-beveled {
          background: linear-gradient(180deg, #422d1d 0%, #2b1d12 100%);
          border: 3px solid #f59e0b;
          border-radius: 20px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }

        .detail-header-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .detail-rarity-badge {
          font-family: var(--font-game);
          font-size: 0.75rem;
          padding: 2px 10px;
          border-radius: 12px;
          border: 1.5px solid;
        }

        .detail-item-title {
          font-size: 1.2rem;
        }

        .detail-slot-badge {
          font-size: 0.72rem;
          color: #d4bda8;
          font-weight: 800;
        }

        .detail-icon-stage {
          font-size: 3.8rem;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));
        }

        .detail-stats-box {
          width: 100%;
          background: #1e130b;
          border: 1.5px solid #5d3f28;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-comparison-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: #d4bda8;
        }

        .stat-highlight {
          color: #fef08a;
          font-family: var(--font-game);
          font-size: 0.95rem;
        }

        .detail-action-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .detail-modal-btn {
          width: 100%;
          min-height: 42px;
        }
      `})]})},xm=({pets:e,activePetId:t,gems:n,gold:r,onSelectPet:l,onUnlockPet:o,onUpgradePet:s,onClose:i})=>{const u=m=>Math.floor(300*Math.pow(1.3,m.level-1)),d=m=>{m.owned&&(X.playTap(),l(m.id))},v=m=>{n>=m.costGems&&(X.playFanfare(),o(m.id,m.costGems))},x=m=>{const y=u(m);r>=y&&(X.playUpgrade(),s(m.id,y))};return a.jsxs("div",{className:"half-sheet-drawer",children:[a.jsxs("div",{className:"drawer-header",children:[a.jsx("div",{className:"drawer-title",children:a.jsx("span",{children:"🐾 숲속 정령 펫 동반자"})}),i&&a.jsx("button",{className:"drawer-close-btn",onClick:i,children:a.jsx(Dr,{size:18,color:"#fef08a"})})]}),a.jsx("div",{className:"drawer-content",children:a.jsx("div",{className:"pet-roster-list",children:e.map(m=>{const y=t===m.id,S=u(m),b=r>=S,R=n>=m.costGems;return a.jsxs("div",{className:`parchment-panel pet-roster-card ${y?"pet-card-active":""} ${m.owned?"":"pet-card-locked"}`,children:[a.jsxs("div",{className:"pet-card-top-row",children:[a.jsxs("div",{className:"pet-plush-avatar",children:[a.jsx("span",{className:"pet-emoji-sprite",children:m.icon}),!m.owned&&a.jsx("div",{className:"pet-lock-badge",children:a.jsx(qp,{size:14,color:"#fff"})}),y&&a.jsxs("div",{className:"pet-active-crest",children:[a.jsx(Jc,{size:11,color:"#fff"}),a.jsx("span",{children:"동행"})]})]}),a.jsxs("div",{className:"pet-info-col",children:[a.jsxs("div",{className:"pet-title-line",children:[a.jsx("span",{className:"pet-title-name",children:m.name}),m.owned&&a.jsxs("span",{className:"pet-badge-level",children:["Lv.",m.level]})]}),a.jsxs("div",{className:"pet-buff-callout game-stroke-gold",children:["⚡ ",Ap(m)]}),a.jsx("div",{className:"pet-lore-text",children:m.description})]})]}),a.jsx("div",{className:"pet-action-bottom",children:m.owned?a.jsxs("div",{className:"pet-dual-action-row",children:[a.jsxs("button",{className:"btn-game btn-game-wood pet-lvlup-btn",disabled:!b,onClick:()=>x(m),children:[a.jsx(Zc,{size:14}),a.jsxs("span",{className:"game-stroke",children:["강화 (🪙 ",S.toLocaleString(),")"]})]}),a.jsx("button",{className:`btn-game ${y?"btn-game-wood active-companion-btn":"btn-game-green"} pet-select-btn`,disabled:y,onClick:()=>d(m),children:a.jsx("span",{className:"game-stroke",children:y?"동행 중":"동행 선택"})})]}):a.jsx("button",{className:"btn-game btn-game-gold pet-summon-btn",disabled:!R,onClick:()=>v(m),children:a.jsxs("span",{className:"game-stroke",children:["정령 계약 해제 (💎 ",m.costGems,")"]})})})]},m.id)})})}),a.jsx("style",{children:`
        .pet-roster-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pet-roster-card {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .pet-card-active {
          border-color: #f59e0b;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(245, 158, 11, 0.15);
        }

        .pet-card-locked {
          opacity: 0.8;
          filter: grayscale(0.2);
        }

        .pet-card-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pet-plush-avatar {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #322013;
          border: 2px solid #5d3f28;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pet-emoji-sprite {
          font-size: 2.3rem;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
        }

        .pet-lock-badge {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pet-active-crest {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #15803d;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 2px;
          border: 1px solid #86efac;
        }

        .pet-info-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .pet-title-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pet-title-name {
          font-family: var(--font-game);
          font-size: 0.95rem;
          color: #382110;
        }

        .pet-badge-level {
          background: #2e542e;
          color: #86efac;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 6px;
        }

        .pet-buff-callout {
          font-size: 0.78rem;
          color: #b45309;
        }

        .pet-lore-text {
          font-size: 0.7rem;
          color: #785232;
          line-height: 1.25;
        }

        .pet-dual-action-row {
          display: flex;
          gap: 8px;
        }

        .pet-lvlup-btn {
          flex: 1.2;
          min-height: 40px;
          font-size: 0.8rem;
        }

        .pet-select-btn {
          flex: 1;
          min-height: 40px;
          font-size: 0.82rem;
        }

        .active-companion-btn {
          opacity: 0.85;
          color: #86efac;
        }

        .pet-summon-btn {
          width: 100%;
          min-height: 42px;
          font-size: 0.85rem;
        }
      `})]})},vm=({gold:e,gems:t,freeChestLastOpened:n,onOpenFreeChest:r,onOpenGoldChest:l,onOpenGemChest:o,onBuyGemsWithGold:s,onClose:i})=>{const[d,v]=U.useState(0);U.useEffect(()=>{const R=()=>{const c=Math.floor((Date.now()-n)/1e3),h=Math.max(0,60-c);v(h)};R();const g=setInterval(R,1e3);return()=>clearInterval(g)},[n]);const x=500,m=100,y=()=>{d===0&&(X.playFanfare(),r())},S=()=>{e>=x&&(X.playFanfare(),l(x))},b=()=>{t>=m&&(X.playFanfare(),o(m))};return a.jsxs("div",{className:"half-sheet-drawer",children:[a.jsxs("div",{className:"drawer-header",children:[a.jsx("div",{className:"drawer-title",children:a.jsx("span",{children:"🎁 신비한 숲속 잡화점"})}),i&&a.jsx("button",{className:"drawer-close-btn",onClick:i,children:a.jsx(Dr,{size:18,color:"#fef08a"})})]}),a.jsxs("div",{className:"drawer-content",children:[a.jsxs("div",{className:"merchant-encounter-banner",children:[a.jsx("span",{className:"merchant-npc-icon",children:"🐿️"}),a.jsxs("div",{className:"merchant-speech-bubble",children:[a.jsx("span",{className:"merchant-name",children:"잡화점 상인 도토리"}),a.jsx("span",{className:"merchant-quote",children:'"오늘 들어온 보물 상자가 아주 실하다네!"'})]})]}),a.jsxs("div",{className:"chests-parchment-list",children:[a.jsxs("div",{className:"parchment-panel chest-row-panel free-chest-theme",children:[a.jsx("div",{className:"chest-badge-tag free-tag",children:"무료 보급"}),a.jsx("div",{className:"chest-visual-box",children:"🎁"}),a.jsxs("div",{className:"chest-details",children:[a.jsx("span",{className:"chest-headline",children:"모험가 보급 상자"}),a.jsx("span",{className:"chest-subtext",children:"일반 ~ 희귀 장비 & 골드"})]}),a.jsx("button",{className:`btn-game ${d===0?"btn-game-green":"btn-game-wood"} chest-open-btn`,disabled:d>0,onClick:y,children:d===0?a.jsxs(a.Fragment,{children:[a.jsx(Qp,{size:16}),a.jsx("span",{className:"game-stroke",children:"무료 개봉"})]}):a.jsxs(a.Fragment,{children:[a.jsx(Vp,{size:16}),a.jsxs("span",{className:"game-stroke",children:[d,"초 대기"]})]})})]}),a.jsxs("div",{className:"parchment-panel chest-row-panel gold-chest-theme",children:[a.jsx("div",{className:"chest-visual-box",children:"📦"}),a.jsxs("div",{className:"chest-details",children:[a.jsx("span",{className:"chest-headline",children:"골드 장비 상자"}),a.jsx("span",{className:"chest-subtext",children:"일반 ~ 영웅 장비 랜덤 드랍"})]}),a.jsxs("button",{className:"btn-game btn-game-gold chest-open-btn",disabled:e<x,onClick:S,children:[a.jsx("span",{className:"game-stroke",children:"소환"}),a.jsxs("span",{className:"chest-price-text game-stroke",children:["🪙 ",x]})]})]}),a.jsxs("div",{className:"parchment-panel chest-row-panel gem-chest-theme",children:[a.jsx("div",{className:"chest-badge-tag hot-tag",children:"HOT! 고등급"}),a.jsx("div",{className:"chest-visual-box",children:"👑💎"}),a.jsxs("div",{className:"chest-details",children:[a.jsx("span",{className:"chest-headline",children:"빛나는 유물 상자"}),a.jsx("span",{className:"chest-subtext",children:"희귀 ~ 신화 최고급 장비 출현!"})]}),a.jsxs("button",{className:"btn-game btn-game-ruby chest-open-btn",disabled:t<m,onClick:b,children:[a.jsx("span",{className:"game-stroke",children:"보석 소환"}),a.jsxs("span",{className:"chest-price-text game-stroke",children:["💎 ",m]})]})]})]}),a.jsxs("div",{className:"parchment-panel exchange-station-panel",children:[a.jsxs("div",{className:"exchange-station-header",children:[a.jsx(Gp,{size:18,color:"#0284c7"}),a.jsx("span",{className:"exchange-station-title",children:"골드로 보석 환전"})]}),a.jsxs("div",{className:"exchange-station-body",children:[a.jsxs("div",{className:"exchange-text-group",children:[a.jsx("span",{className:"exchange-ratio-text",children:"🪙 2,000 골드 → 💎 50 보석"}),a.jsx("span",{className:"exchange-note",children:"사냥 골드를 모아 보석으로 교환하세요"})]}),a.jsx("button",{className:"btn-game btn-game-wood exchange-press-btn",disabled:e<2e3,onClick:()=>s(2e3,50),children:a.jsx("span",{className:"game-stroke",children:"환전"})})]})]})]}),a.jsx("style",{children:`
        .merchant-encounter-banner {
          background: #322013;
          border: 1.5px solid #5d3f28;
          border-radius: 14px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .merchant-npc-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .merchant-speech-bubble {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .merchant-name {
          font-family: var(--font-game);
          font-size: 0.85rem;
          color: #fef08a;
        }

        .merchant-quote {
          font-size: 0.72rem;
          color: #d4bda8;
          font-style: italic;
        }

        .chests-parchment-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chest-row-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          gap: 10px;
        }

        .chest-badge-tag {
          position: absolute;
          top: -8px;
          left: 14px;
          font-family: var(--font-game);
          font-size: 0.62rem;
          color: #fff;
          padding: 1px 7px;
          border-radius: 6px;
          border: 1px solid #fff;
        }
        .free-tag { background: #15803d; }
        .hot-tag { background: #be123c; }

        .chest-visual-box {
          font-size: 2.4rem;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
          flex-shrink: 0;
        }

        .chest-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .chest-headline {
          font-family: var(--font-game);
          font-size: 0.95rem;
          color: #382110;
        }

        .chest-subtext {
          font-size: 0.7rem;
          color: #785232;
        }

        .chest-open-btn {
          min-width: 95px;
          min-height: 44px;
          flex-direction: column;
          gap: 1px;
          padding: 4px 10px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .chest-price-text {
          font-size: 0.68rem;
        }

        .exchange-station-panel {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exchange-station-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .exchange-station-title {
          font-family: var(--font-game);
          font-size: 0.9rem;
          color: #382110;
        }

        .exchange-station-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .exchange-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exchange-ratio-text {
          font-family: var(--font-game);
          font-size: 0.82rem;
          color: #1e3a8a;
        }

        .exchange-note {
          font-size: 0.68rem;
          color: #785232;
        }

        .exchange-press-btn {
          min-height: 38px;
          padding: 6px 16px;
          font-size: 0.82rem;
        }
      `})]})},ym=()=>{const[e,t]=U.useState(()=>{const{data:k}=Ii();return k}),[n,r]=U.useState("adventure"),[l,o]=U.useState(null),[s,i]=U.useState(null),[u,d]=U.useState(!1),[v,x]=U.useState(!1),m=e.stats,y=e.stage,S=e.equipped,b=e.inventory,R=e.pets,g=e.activePetId,c=e.quests,h=e.settings,w=e.freeChestLastOpened,j=U.useMemo(()=>R.find(k=>k.id===g)||null,[R,g]),[C,_]=U.useState(()=>nr(y.chapter,y.stage)),[P,te]=U.useState(!1),[W,Ee]=U.useState(!1),[wt,mt]=U.useState(!1),[en,Lt]=U.useState(!1),[Fe,Pt]=U.useState(!1),[T,B]=U.useState([]);U.useEffect(()=>{X.sfxEnabled=h.sfxEnabled,X.bgmEnabled=h.bgmEnabled},[h]),U.useEffect(()=>{const{offlineSeconds:k}=Ii();if(k>=30){const M=y.chapter*.8,E=Math.floor(k*3.5*M),V=Math.floor(k*1.5*M);o({seconds:k,gold:E,exp:V})}},[]),U.useEffect(()=>{const k=setInterval(()=>{Oi(e)},3e3);return()=>clearInterval(k)},[e]);const p=U.useMemo(()=>{let k=0,M=0,E=0,V=0;Object.values(S).forEach(at=>{at&&(k+=at.atk,M+=at.hp,E+=at.def,V+=at.critRate||0)});let D=0,A=0,ne=0,K=0,Se=0;if(j){const at=j.baseBuffValue*(1+(j.level-1)*.2);j.buffType==="atk"&&(D=at),j.buffType==="gold"&&(A=at),j.buffType==="critRate"&&(ne=at),j.buffType==="critDmg"&&(K=at),j.buffType==="atkSpeed"&&(Se=at)}const he=Math.floor((m.baseAtk+(m.atkLevel-1)*4+k)*(1+D)),ve=Math.floor(m.baseHp+(m.hpLevel-1)*35+M),$r=Math.floor(m.baseDef+(m.defLevel-1)*2+E),Cs=Math.min(.85,m.critRate+V+ne),td=m.critDmg+K,nd=m.atkSpeed*(1+Se),rd=Math.floor(he*4+ve*.5+$r*3+Cs*500);return{totalAtk:he,totalMaxHp:ve,totalDef:$r,totalCritRate:Cs,totalCritDmg:td,totalAtkSpeed:nd,combatPower:rd,petGoldMult:A}},[m,S,j]);U.useEffect(()=>{m.currentHp>p.totalMaxHp&&t(k=>({...k,stats:{...k.stats,currentHp:p.totalMaxHp}}))},[p.totalMaxHp]);const f=U.useCallback(()=>{x(!0),setTimeout(()=>x(!1),220)},[]),z=U.useCallback((k,M,E)=>{if(!h.damageNumbers)return;const V=`dmg_${Date.now()}_${Math.random()}`,D=E?70+Math.random()*30:220+Math.random()*40,A=160+Math.random()*30;M&&f(),B(ne=>[...ne.slice(-8),{id:V,value:k,isCritical:M,isPlayer:E,x:D,y:A}]),setTimeout(()=>{B(ne=>ne.filter(K=>K.id!==V))},750)},[h.damageNumbers,f]),I=U.useCallback((k,M=1)=>{t(E=>{const V=E.quests.map(D=>{if(D.type===k&&!D.completed){const A=D.currentCount+M;return{...D,currentCount:A,completed:A>=D.targetCount}}return D});return{...E,quests:V}})},[]),F=U.useCallback(()=>{X.playMonsterDefeat(),Pt(!0);const{petGoldMult:k}=p,M=Math.floor(C.goldReward*(1+k)),E=C.expReward;let V=null;(Math.random()<.18||C.isBoss)&&(V=ol(C.isBoss?"rare":void 0)),setTimeout(()=>{t(A=>{let ne=A.stats.exp+E,K=A.stats.level,Se=A.stats.maxExp,he=!1;for(;ne>=Se;)ne-=Se,K++,Se=Math.floor(Se*1.35),he=!0;he?(X.playFanfare(),sr({particleCount:50,spread:65,origin:{y:.5}})):X.playGold();let ve={...A.stage};ve.stage===10&&ve.inBossFight?(X.playFanfare(),sr({particleCount:90,spread:85,origin:{y:.5}}),I("defeat_boss",1),ve.chapter+=1,ve.stage=1,ve.killCount=0,ve.inBossFight=!1):ve.stage<10&&(ve.killCount+=1,I("kill_monster",1),ve.killCount>=ve.killsRequired&&(ve.stage+=1,ve.killCount=0,I("reach_stage",ve.stage)));const $r=V?[V,...A.inventory]:A.inventory;return{...A,stats:{...A.stats,gold:A.stats.gold+M,exp:ne,level:K,maxExp:Se,currentHp:p.totalMaxHp},inventory:$r,stage:ve}});const D=nr(y.chapter,y.stage);_(D),Pt(!1)},380)},[C,p,y,I]),$=U.useRef(!1);U.useEffect(()=>{if(Fe)return;const k=Math.max(400,Math.floor(1e3/p.totalAtkSpeed)),M=setInterval(()=>{$.current||Fe||($.current=!0,te(!0),setTimeout(()=>{const E=Math.random()<p.totalCritRate,V=Math.floor(Math.max(1,p.totalAtk*(E?p.totalCritDmg:1)-C.def*.3));E?X.playCriticalHit():X.playAttack(),Lt(!0),z(V,E,!1),_(D=>{const A=Math.max(0,D.currentHp-V);return A<=0&&F(),{...D,currentHp:A}}),setTimeout(()=>te(!1),140),setTimeout(()=>Lt(!1),200),setTimeout(()=>{$.current=!1},k*.4)},100))},k);return()=>clearInterval(M)},[p,C,Fe,F,z]),U.useEffect(()=>{if(Fe||C.currentHp<=0)return;const k=setInterval(()=>{Fe||(Ee(!0),setTimeout(()=>{const M=Math.floor(Math.max(1,C.atk-p.totalDef*.35));mt(!0),z(M,!1,!0),t(E=>{const V=Math.max(0,E.stats.currentHp-M);return V<=0?(X.playMonsterDefeat(),{...E,stats:{...E.stats,currentHp:p.totalMaxHp},stage:{...E.stage,inBossFight:!1}}):{...E,stats:{...E.stats,currentHp:V}}}),setTimeout(()=>Ee(!1),150),setTimeout(()=>mt(!1),220)},120))},2400);return()=>clearInterval(k)},[C,p,Fe,z]),U.useEffect(()=>{if(!y.inBossFight)return;const k=setInterval(()=>{t(M=>{if(!M.stage.inBossFight)return M;const E=M.stage.bossTimeLeft-1;return E<=0?{...M,stage:{...M.stage,inBossFight:!1,bossTimeLeft:M.stage.bossMaxTime}}:{...M,stage:{...M.stage,bossTimeLeft:E}}})},1e3);return()=>clearInterval(k)},[y.inBossFight]);const H=(k,M)=>{const E=A=>Math.floor(25*Math.pow(1.12,A-1)),V=A=>Math.floor(20*Math.pow(1.1,A-1)),D=A=>Math.floor(30*Math.pow(1.13,A-1));t(A=>{let ne=0,K=k==="atk"?A.stats.atkLevel:k==="hp"?A.stats.hpLevel:A.stats.defLevel;const Se=k==="atk"?E:k==="hp"?V:D;for(let he=0;he<M;he++)ne+=Se(K+he);return A.stats.gold<ne?A:(I("upgrade_atk",M),{...A,stats:{...A.stats,gold:A.stats.gold-ne,atkLevel:k==="atk"?A.stats.atkLevel+M:A.stats.atkLevel,hpLevel:k==="hp"?A.stats.hpLevel+M:A.stats.hpLevel,defLevel:k==="def"?A.stats.defLevel+M:A.stats.defLevel}})})},O=k=>{t(M=>{const E=M.equipped[k.slot],V=M.inventory.filter(D=>D.id!==k.id);return E&&V.unshift(E),I("equip_item",1),{...M,equipped:{...M.equipped,[k.slot]:k},inventory:V}})},G=k=>{t(M=>{const E=M.equipped[k];return E?{...M,equipped:{...M.equipped,[k]:void 0},inventory:[E,...M.inventory]}:M})},J=(k,M)=>{t(E=>{var ne;if(E.stats.gold<M)return E;const V=K=>({...K,level:K.level+1,atk:K.atk>0?Math.floor(K.atk*1.15)+2:0,hp:K.hp>0?Math.floor(K.hp*1.15)+15:0,def:K.def>0?Math.floor(K.def*1.15)+2:0}),D={...E.equipped};for(const K of["weapon","helmet","armor","accessory"])((ne=D[K])==null?void 0:ne.id)===k&&(D[K]=V(D[K]));const A=E.inventory.map(K=>K.id===k?V(K):K);return{...E,stats:{...E.stats,gold:E.stats.gold-M},equipped:D,inventory:A}})},ae=()=>{X.playFanfare(),sr({particleCount:40,spread:55,origin:{y:.6}}),t(k=>{const M=["weapon","helmet","armor","accessory"],E={...k.equipped};let V=[...k.inventory];return M.forEach(D=>{const A=V.filter(he=>he.slot===D);if(A.length===0)return;const ne=he=>he.atk*4+he.hp*.5+he.def*3+(he.critRate||0)*400;A.sort((he,ve)=>ne(ve)-ne(he));const K=A[0],Se=E[D];(!Se||ne(K)>ne(Se))&&(V=V.filter(he=>he.id!==K.id),Se&&V.push(Se),E[D]=K)}),{...k,equipped:E,inventory:V}})},ee=k=>{t(M=>({...M,activePetId:k}))},se=(k,M)=>{t(E=>{if(E.stats.gems<M)return E;const V=E.pets.map(D=>D.id===k?{...D,owned:!0}:D);return{...E,stats:{...E.stats,gems:E.stats.gems-M},pets:V,activePetId:k}})},xe=(k,M)=>{t(E=>{if(E.stats.gold<M)return E;const V=E.pets.map(D=>D.id===k?{...D,level:D.level+1}:D);return{...E,stats:{...E.stats,gold:E.stats.gold-M},pets:V}})},q=()=>{const k=ol("common");i(k),t(M=>({...M,freeChestLastOpened:Date.now(),inventory:[k,...M.inventory]}))},Me=k=>{const M=ol();i(M),t(E=>({...E,stats:{...E.stats,gold:E.stats.gold-k},inventory:[M,...E.inventory]}))},Ue=k=>{const M=ol(Math.random()<.6?"rare":"epic");i(M),t(E=>({...E,stats:{...E.stats,gems:E.stats.gems-k},inventory:[M,...E.inventory]}))},Ve=(k,M)=>{X.playGold(),t(E=>E.stats.gold<k?E:{...E,stats:{...E.stats,gold:E.stats.gold-k,gems:E.stats.gems+M}})},ot=c.find(k=>!k.claimed)||null,kt=k=>{X.playFanfare(),sr({particleCount:35,spread:55,origin:{y:.7}}),t(M=>{const E=M.quests.find(D=>D.id===k);if(!E||!E.completed||E.claimed)return M;const V=M.quests.map(D=>D.id===k?{...D,claimed:!0}:D);return{...M,stats:{...M.stats,gold:M.stats.gold+E.rewardGold,gems:M.stats.gems+E.rewardGems},quests:V}})},Ze=()=>{X.playFanfare(),t(k=>({...k,stage:{...k.stage,inBossFight:!0,bossTimeLeft:30}})),_(nr(y.chapter,10))},ao=()=>{t(k=>({...k,stage:{...k.stage,inBossFight:!1}})),_(nr(y.chapter,9))},so=()=>{l&&(X.playFanfare(),t(k=>({...k,stats:{...k.stats,gold:k.stats.gold+l.gold,exp:k.stats.exp+l.exp}})),o(null))},io=()=>{if(window.confirm("정말로 게임 데이터를 초기화하시겠습니까? 모든 진행 상황이 초기화됩니다.")){const k=vl();Oi(k),t(k),_(nr(1,1)),d(!1),X.playTap()}},Br={hero:m.gold>=50,equipment:b.length>0,pet:R.some(k=>!k.owned&&m.gems>=k.costGems),shop:Date.now()-w>6e4};return a.jsxs("div",{className:`mobile-frame ${v?"screen-shake":""}`,children:[a.jsx(lm,{stats:m,stage:y,onOpenSettings:()=>d(!0),onOpenProfile:()=>r("hero")}),a.jsxs("div",{className:"screen-container",children:[a.jsx(um,{stats:m,maxHp:p.totalMaxHp,monster:C,stage:y,activePet:j,equippedWeapon:S.weapon,isPlayerAttacking:P,isMonsterAttacking:W,isPlayerHit:wt,isMonsterHit:en,isMonsterDefeated:Fe,damages:T,onChallengeBoss:Ze,onRetreatToNormal:ao}),n==="adventure"&&a.jsx(cm,{quest:ot,onClaim:kt}),n==="hero"&&a.jsx(hm,{stats:m,totalAtk:p.totalAtk,totalHp:p.totalMaxHp,totalDef:p.totalDef,combatPower:p.combatPower,equipped:S,activePet:j,onUpgradeStat:H,onClose:()=>r("adventure")}),n==="equipment"&&a.jsx(gm,{equipped:S,inventory:b,gold:m.gold,combatPower:p.combatPower,onEquip:O,onUnequip:G,onUpgradeItem:J,onAutoEquip:ae,onClose:()=>r("adventure")}),n==="pet"&&a.jsx(xm,{pets:R,activePetId:g,gems:m.gems,gold:m.gold,onSelectPet:ee,onUnlockPet:se,onUpgradePet:xe,onClose:()=>r("adventure")}),n==="shop"&&a.jsx(vm,{gold:m.gold,gems:m.gems,freeChestLastOpened:w,onOpenFreeChest:q,onOpenGoldChest:Me,onOpenGemChest:Ue,onBuyGemsWithGold:Ve,onClose:()=>r("adventure")})]}),a.jsx(dm,{activeTab:n,onTabChange:k=>{X.playTap(),r(k)},badges:Br}),l&&a.jsx(fm,{seconds:l.seconds,gold:l.gold,exp:l.exp,onClaim:so}),s&&a.jsx(pm,{item:s,onEquip:k=>{O(k),i(null)},onClose:()=>i(null)}),u&&a.jsx(mm,{settings:h,onUpdateSettings:k=>{t(M=>({...M,settings:{...M.settings,...k}})),"bgmEnabled"in k&&(k.bgmEnabled?X.startBgm():X.stopBgm())},onResetData:io,onClose:()=>d(!1)})]})};Oo.createRoot(document.getElementById("root")).render(a.jsx(jd.StrictMode,{children:a.jsx(ym,{})}));
