import{d as f,b as l,R as u}from"./AppPage-BJw4_jKb.js";import{P as a,J as c,a2 as v,_ as w,d as m,I as h,o as s,c as i,w as p,a as C,b,Z as g,H as k,a3 as y}from"./index-9_Myw3Yf.js";function B(e){const o=Object.assign({noopener:!0},e),t=[];for(const r in o){const n=o[r];n===!0?t.push(r):(v(n)||typeof n=="string"&&n!=="")&&t.push(r+"="+n)}return t.join(",")}function d(e,o,t){let r=window.open;if(a.is.cordova===!0){if(cordova!==void 0&&cordova.InAppBrowser!==void 0&&cordova.InAppBrowser.open!==void 0)r=cordova.InAppBrowser.open;else if(navigator!==void 0&&navigator.app!==void 0)return navigator.app.loadUrl(e,{openExternal:!0})}const n=r(e,"_blank",B(t));if(n)return a.is.desktop&&n.focus(),n}const S=(e,o,t)=>{if(a.is.ios===!0&&window.SafariViewController!==void 0){window.SafariViewController.isAvailable(r=>{r?window.SafariViewController.show({url:e},c,o):d(e,o,t)});return}return d(e,o,t)},$=m({props:{to:{type:Object,default:void 0},href:{type:String,default:void 0},icon:{type:String,default:void 0}},methods:{route(){if(this.to)return this.$router.replace(this.to);if(this.href)return S(this.href)}}});function V(e,o,t,r,n,I){return h((s(),i(y,{flat:"",class:"non-selectable cursor-pointer q-hoverable bg-secondary text-white q-pa-none",onClick:o[0]||(o[0]=q=>e.route())},{default:p(()=>[o[1]||(o[1]=C("span",{class:"q-focus-helper"},null,-1)),b(f,{class:"q-pa-sm"},{default:p(()=>[e.icon?(s(),i(l,{key:0,left:"",name:e.icon,size:"2rem"},null,8,["name"])):g("",!0),k(e.$slots,"default")]),_:3})]),_:3})),[[u]])}const _=w($,[["render",V]]);export{_ as C};
