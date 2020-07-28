/*
console._log_old = console.log; console.log = function(msg){ alert("log: "+msg); console._log_old(msg); };
console._error_old = console.error; console.error = function(msg){ alert("error: "+msg); console._error_old(msg); };
console._warn_old = console.warn; console.warn = function(msg){ alert("warn: "+msg); console._warn_old(msg); };
console.log = function(msg){ alert("log: "+msg); };
console.warning = function(msg){ alert("warning: "+msg); };
console.error = function(msg){ alert("error: "+msg); }; */

var config_adminpanel_fb = {
    apiKey: "AIzaSyAgck_wCIAoEfo-iHtv9h1Z9-SXowzZcag",
    authDomain: "ecologiaypetroleo.firebaseapp.com",
    databaseURL: "https://ecologiaypetroleo.firebaseio.com",
    projectId: "ecologiaypetroleo",
    storageBucket: "ecologiaypetroleo.appspot.com",
    messagingSenderId: "567517067874",
    appId: "1:567517067874:web:2a81dac3b8fa359b"
};
var User_Lat, User_Lon, geo_aprox, handle;

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var color_header_aplicativo = localStorage.getItem('color_header_aplicativo');
var color_header_aplicativo_def = "#aaa";
if (!url_server) {
color_header_aplicativo = color_header_aplicativo_def;
} else {
//color_header_aplicativo = color_header_aplicativo;
}
$('.am-top-header').css("background-color", color_header_aplicativo );

function guid() {
function s4() {
return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
var my_uuid = localStorage.getItem('my_uuid');
var my_uuid_def = guid();
if (!my_uuid) {
window.my_uuid = my_uuid_def;
localStorage.setItem('my_uuid', my_uuid_def);
} else {
window.my_uuid = my_uuid;
}

window.handle_url = "";
function handleOpenURL(url){
setTimeout(function() {
//alert("Recibido: " + url);
window.handle_url = url;
window.onOnline(url);
}, 0);
}

window.url_target = function url_target(page,id){
var imei = window.localStorage.getItem("imei");
if(id == "undefined" || id == null || id == ""){ id = ""; }
if(page == "undefined" || page == null || page == ""){ page = ""; }
//alert(page+" : "+id);
$('.ajax-content').html('<div align="center"><br><br><h4><i class="fa fa-spinner fa-spin"></i></h4><br></div>');
$.getJSON(window.url_server+"/movil/html.templates.php", { key: window.my_uuid, imei: imei, html: page, id: id, view_as: 'json', is_app: '1' }, function (j) {
var stateObj = { html: page };
var data_html = j['content'];
$(".ajax-content").html(data_html);
$("body").removeClass("aside-toggled");
});
};

