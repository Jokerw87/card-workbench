(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CardContrast=api;})(globalThis,function(){
 'use strict';
 function luminance(hex){if(typeof hex!=='string'||!/^#[0-9a-f]{6}$/i.test(hex))throw Error('Expected opaque six-digit HEX color');const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
 function ratio(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
 function meetsReference(value){return Number.isFinite(value)&&value>=4.5;}
 return{luminance,ratio,meetsReference};
});
