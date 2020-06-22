var key = window.my_uuid;
var url_server = "https://app.epsa.services";
var key_dev = localStorage.getItem('key_dev');
var id_cliente = localStorage.getItem('id_cliente');
var lat = localStorage.getItem('lat');
var lon = localStorage.getItem('lon');
var session_id = localStorage.getItem('session_id');
var user_agent = localStorage.getItem('user_agent');
var Usuario = localStorage.getItem('Usuario');
var ip = localStorage.getItem('ip');

var id_n = localStorage.getItem('id_n');
var uid_cookie = localStorage.getItem('uid_cookie');

var is_app = "1";
window.localStorage.setItem('is_app', is_app);
var get_token = localStorage.getItem('token');

var params_loadurl = "?is_app="+is_app+"&token="+get_token+"&uuid="+window.my_uuid;

$.root_ = $('body');
$.navAsAjax = true;
var root = this, debugState = false, debugStyle = 'font-weight: bold; color: #00f;',
debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;',
debugStyle_red = 'font-weight: bold; color: #ed1c24;',
debugStyle_warning = 'background-color:yellow',
debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;',
debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;',
throttle_delay = 350, menu_speed = 235, menu_accordion = true, enableJarvisWidgets = true,
ignore_key_elms = ["#header, #left-panel, #right-panel, #main, div.page-footer, #shortcut, #divSmallBoxes, #divMiniIcons, #divbigBoxes, #voiceModal, script, .ui-chatbox"],
boxList = [], showList = [], nameList = [], idList = [],
shortcut_dropdown = $('#shortcut'),
bread_crumb = $('#ribbon ol.breadcrumb'),
thisDevice = null,
ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
realizado_por = "myhostmx";

$.intervalArr = [];


var jsArray = {}; // keeps track of all loaded scripts

function setup_widgets_mobile() {

}
function setup_widgets_desktop() {

}

function loadScript_old(scriptName, callback) {
if (!jsArray[scriptName]) {
jsArray[scriptName] = true;
// adding the script tag to the head as suggested before
var body = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = scriptName;
// then bind the event to the callback function
// there are several events for cross browser compatibility
//script.onreadystatechange = callback;
script.onload = callback;
// fire the loading
body.appendChild(script);
} else if (callback) { // changed else to else if(callback)
//console.log("JS file already added!");
//execute function
callback();
}
}

function loadScript(scriptName, callback) {
	   if (!jsArray[scriptName]) {
	      var promise = jQuery.Deferred();
	      // adding the script tag to the head as suggested before
	      var body = document.getElementsByTagName('body')[0],
	          script = document.createElement('script');
	      script.type = 'text/javascript';
	      script.src = scriptName;
	      // then bind the event to the callback function
	      // there are several events for cross browser compatibility
	      script.onload = function() {
	         promise.resolve();
	      };
	      // fire the loading
	      body.appendChild(script);
	      // clear DOM reference
	      //body = null;
	      //script = null;

	      jsArray[scriptName] = promise.promise();
	   } else if (debugState)
	      root.root.console.log("This script was already loaded %c: " + scriptName, debugStyle_warning);

	   jsArray[scriptName].then(function () {
	           if(typeof callback === 'function')
	               callback();
	   });
}



/*
* APP AJAX REQUEST SETUP
* Description: Executes and fetches all ajax requests also
* updates naivgation elements to active
*/
if ($.navAsAjax) {
// fire this on page load if nav exists
if ($('.nav-main').length) { checkURL(); }

$(document).on('click', '.navsillo a[href!="#"]', function (e) {
//alert(JSON.stringify(e));
e.preventDefault();
var $this = $(e.currentTarget);
// if parent is not active then get hash, or else page is assumed to be loaded
if (!$this.parent().hasClass("active") && !$this.attr('target')) {
// update window with hash
// you could also do here:  thisDevice === "mobile" - and save a little more memory
if ($.root_.hasClass('mobile-view-activated')) {
$.root_.removeClass('hidden-menu');
$('html').removeClass("hidden-menu-mobile-lock");
window.setTimeout(function () {
if (window.location.search) {
window.location.href =
window.location.href.replace(window.location.search, '')
.replace(window.location.hash, '') + '#' + $this.attr('href');
} else {
window.location.hash = $this.attr('href');
}
}, 150);
// it may not need this delay...
} else {
if (window.location.search) {
window.location.href =
window.location.href.replace(window.location.search, '')
.replace(window.location.hash, '') + '#' + $this.attr('href');
} else {
window.location.hash = $this.attr('href');
}
}

// clear DOM reference
// $this = null;
}

});

/*
// fire links with targets on different window
$(document).on('click', 'nav a[target="_blank"]', function (e) {
e.preventDefault();
var $this = $(e.currentTarget);
window.open($this.attr('href'));
});
// fire links with targets on same window
$(document).on('click', 'nav a[target="_top"]', function (e) {
e.preventDefault();
var $this = $(e.currentTarget);
window.location = ($this.attr('href'));
});
// all links with hash tags are ignored
$(document).on('click', 'nav a[href="#"]', function (e) {
e.preventDefault();
});*/

$(document).on('click', 'a[href!="#"]', function (e) {
var title = $(this).attr('title');
if(title != "" && title != "undefined" && title != null){
console.log("title: ".title); $(".breadcrumb-item .active").html(title);
//document.title = title+" | Demo | Dalila";
}
});

// DO on hash change
$(window).on('hashchange', function () {
$("#page-container").removeClass("sidebar-o-xs");
$(".index_saludo").hide('slow');
checkURL();
});
}

/*
* CHECK TO SEE IF URL EXISTS
*/
function checkURL() {
//get the url by removing the hash
//var url = location.hash.replace(/^#/, '');
var url = location.href.split('#').splice(1).join('#');
//BEGIN: IE11 Work Around
if (!url) { try { var documentUrl = window.document.URL;
if (documentUrl) { if (documentUrl.indexOf('#', 0) > 0 && documentUrl.indexOf('#', 0) < (documentUrl.length + 1)) {
url = documentUrl.substring(documentUrl.indexOf('#', 0) + 1); } } } catch (err) { } }
//END: IE11 Work Around
container = $('#content');
if (url) {
$('navsillo li.active').removeClass("active");
$('navsillo li:has(a[href="' + url + '"])').addClass("active");
var title = ($('nav a[href="' + url + '"]').attr('title'));
//document.title = (title || document.title);
if (debugState){ root.console.log("Page title: %c " + document.title, debugStyle_green); }
loadURL(url + location.search, container);
} else {
var $this = $('nav > ul > li:first-child > a[href!="#"]');
window.location.hash = $this.attr('href');
$this = null;
}
}

function total_cargado(total){ $(".response_upload_text").html(""+ total+"%"); $(".progress_upload").css('width', total+'%'); }
function total_cargado_kb(total){ $(".response_upload_text").html(""+ total+" kbs"); console.log(total+" kbs"); }

function loadURL(url, container) {
if (url == "undefined" || url == null || url == "") { url = url_server+"/_/index"+params_loadurl; } else { url = url_server+"/_/" + url; }
if (debugState) { root.console.log("Loading URL: %c" + url, debugStyle); }
console.log(url);

$.ajax({
url: url, type: "GET", cache: false, dataType: "html",

xhr: function(){ var xhr = new window.XMLHttpRequest();
xhr.addEventListener("progress", function (evt) {
var loaded_size = (Math.round(evt.loaded/1000));
if (evt.lengthComputable){ var percentComplete = evt.loaded / evt.total; total_cargado(Math.round(percentComplete * 100)); console.log(percentComplete); }
$(".response_upload_text").html(""+loaded_size+" kbs");
//console.log(loaded_size+" kbs");
}, false);
return xhr; },
beforeSend: function() {

if ($.navAsAjax && $(".google_maps")[0] && (container[0] == $("#content")[0])) {
var collection = $(".google_maps"), i = 0; collection.each(function () { i++;
var divDealerMap = document.getElementById(this.id);
if (i == collection.length + 1) { } else {
if (divDealerMap) divDealerMap.parentNode.removeChild(divDealerMap);
if (debugState) { root.console.log("Bye Maps%c" + this.id, debugStyle_warning); } }
});
if (debugState) { root.console.log(""); } }

/*  */
if ($.navAsAjax && $('.dataTables_wrapper')[0] && (container[0] == $("#content")[0])) {
var tables = $.fn.dataTable.fnTables(true);
$(tables).each(function () {
if ($(this).find('.details-control').length != 0) {
$(this).find('*').addBack().off().remove();
$(this).dataTable().fnDestroy();
} else {
$(this).dataTable().fnDestroy();
}
});
if (debugState) { root.console.log("Datatable bye :o !!!"); } }

if ($.navAsAjax && $.intervalArr.length > 0 && (container[0] == $("#content")[0]) && enableJarvisWidgets) {
while ($.intervalArr.length > 0) clearInterval($.intervalArr.pop());
if (debugState) { root.console.log(" All JarvisWidget intervals cleared"); } }

if ($.navAsAjax && (container[0] == $("#content")[0]) && enableJarvisWidgets && $("#widget-grid")[0]) {
$("#widget-grid").jarvisWidgets('destroy'); if (debugState) { root.console.log(" JarvisWidgets destroyed"); } }

if ($.navAsAjax && (container[0] == $("#content")[0])) { if (typeof pagedestroy == 'function') { try { pagedestroy(); if (debugState) { root.console.log(" Pagedestroy()"); } }
catch (err) { pagedestroy = undefined; if (debugState) { root.console.log("! Pagedestroy() Catch Error"); } } }

if ($.fn.sparkline && $("#content .sparkline")[0]) {
$("#content .sparkline").sparkline('destroy');
if (debugState) { root.console.log(" Sparkline Charts destroyed!"); } }
if ($.fn.easyPieChart && $("#content .easy-pie-chart")[0]) {
$("#content .easy-pie-chart").easyPieChart('destroy');
if (debugState) { root.console.log(" EasyPieChart Charts destroyed!"); } }

if ($.fn.select2 && $("#content select.select2")[0]) { $("#content select.select2").select2('destroy');
if (debugState) { root.console.log(" Select2 destroyed!"); } }

if ($.fn.mask && $('#content [data-mask]')[0]) { $('#content [data-mask]').unmask();

if (debugState) { root.console.log(" Input Mask destroyed!"); }
}

if ($.fn.datepicker && $('#content .datepicker')[0]) { $('#content .datepicker').off(); $('#content .datepicker').remove();
if (debugState) { root.console.log(" Datepicker destroyed!"); } }

if ($.fn.slider && $('#content .slider')[0]) { $('#content .slider').off(); $('#content .slider').remove();

if (debugState) { root.console.log(" Bootstrap Slider destroyed!"); } } }

pagefunction = null;
container.removeData().html("");
container.html('<div class="content text-center"><br><br><br><h2 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> <span class="response_upload_text"></span></h2><br><br><br></div>');
if (container[0] == $("#content")[0]) {
// clear everything else except these key DOM elements
// we do this because sometime plugins will leave dynamic elements behind
//$('body').find('> *').filter(':not(' + ignore_key_elms + ')').empty().remove();
//Linea con problemas
//drawBreadCrumb();
$("html").animate({ scrollTop: 0 }, "fast");
}

}}).done(function(data, textStatus, jqXHR) {
var conti = $('#content');
//container.html("Ya casi...");
conti.promise().done(function(){
container.css({ opacity: '0.0' }).delay(50).animate({ opacity: '1.0' }, 300);
container.html(data);
});
data = null; container = null;

}).fail(function(xhr, status, thrownError, error) {

container.html('<div class="content text-center"><br><br><br><h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error '+xhr.status+' al cargar: <span class="txt-color-red"><a href="'+url+'">'+url+'</a></span><br><span style="text-transform: capitalize;">' + thrownError + '</span></h4><br><br><br></div>');

});

}

/*
* UPDATE BREADCRUMB
*/
function drawBreadCrumb(opt_breadCrumbs) {
var a = $("nav li.active > a"),
b = a.length;

bread_crumb.empty(),
bread_crumb.append($("<li>Inicio</li>")), a.each(function () {
bread_crumb.append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text()))), --b || (document.title = bread_crumb.find("li:last-child").text())
});

// Push breadcrumb manually -> drawBreadCrumb(["Users", "John Doe"]);
// Credits: Philip Whitt | philip.whitt@sbcglobal.net
if (opt_breadCrumbs != undefined) {
$.each(opt_breadCrumbs, function (index, value) {
bread_crumb.append($("<li></li>").html(value));
document.title = bread_crumb.find("li:last-child").text();
});
}
}

// Bootstrap tooltip, for more examples you can check out https://getbootstrap.com/docs/4.0/components/tooltips/
var uiHelperCoreTooltip = function() {
jQuery('[data-toggle="tooltip"]:not(.js-tooltip-enabled)').add('.js-tooltip:not(.js-tooltip-enabled)').each(function(){
var el = jQuery(this);

// Add .js-tooltip-enabled class to tag it as activated
el.addClass('js-tooltip-enabled');

// Init
el.tooltip({
container: el.data('container') || 'body',
animation: el.data('animation') || false
});
});
};

// Bootstrap popover, for more examples you can check out https://getbootstrap.com/docs/4.0/components/popovers/
var uiHelperCorePopover = function() {
jQuery('[data-toggle="popover"]:not(.js-popover-enabled)').add('.js-popover:not(.js-popover-enabled)').each(function(){
var el = jQuery(this);

// Add .js-popover-enabled class to tag it as activated
el.addClass('js-popover-enabled');

// Init
el.popover({
container: el.data('container') || 'body',
animation: el.data('animation') || false,
trigger: el.data('trigger') || 'hover focus'
});
});
};

// Bootstrap tab, for more examples you can check out http://getbootstrap.com/docs/4.0/components/navs/#tabs
var uiHelperCoreTab = function() {
jQuery('[data-toggle="tabs"]:not(.js-tabs-enabled)').add('.js-tabs:not(.js-tabs-enabled)').each(function(){
var el = jQuery(this);

// Add .js-tabs-enabled class to tag it as activated
el.addClass('js-tabs-enabled');

// Init
el.find('a').on('click.cb.helpers.core', function(e){
e.preventDefault();
jQuery(this).tab('show');
});
});
};

/*
* PAGE SETUP
* Description: fire certain scripts that run through the page
* to check for form elements, tooltip activation, popovers, etc...
*/
function pageSetUp() {
uiHelperCoreTooltip();
uiHelperCorePopover();
uiHelperCoreTab();

if (thisDevice === "desktop"){
// is desktop
// activate tooltips
$("[rel=tooltip], [data-rel=tooltip], [data-toggle=tooltip]").tooltip();
// activate popovers
$("[rel=popover], [data-rel=popover], [data-toggle=popover]").popover();
// activate popovers with hover states
$("[rel=popover-hover], [data-rel=popover-hover]").popover({
trigger : "hover"
});
// setup widgets
setup_widgets_desktop();
// activate inline charts
//runAllCharts();
// run form elements
//runAllForms();
} else {
// is mobile
// activate popovers
$("[rel=popover], [data-rel=popover]").popover();
// activate popovers with hover states
$("[rel=popover-hover], [data-rel=popover-hover]").popover({
trigger : "hover"
});

// activate inline charts
//runAllCharts();

// setup widgets
setup_widgets_mobile();

// run form elements
//runAllForms();

}

}
/* ~ END: PAGE SETUP */

/*
* DELETE MODEL DATA ON HIDDEN
* Clears the model data once it is hidden, this way you do not create duplicated data on multiple modals
*/
$('body').on('hidden.bs.modal', '.modal', function () {
$(this).removeData('bs.modal');
});
/* ~ END: DELETE MODEL DATA ON HIDDEN */

/*
* HELPFUL FUNCTIONS
* We have included some functions below that can be resued on various occasions
*
* Get param value
* example: alert( getParam( 'param' ) );
*/
function getParam(name) {
name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
var regexS = "[\\?&]" + name + "=([^&#]*)";
var regex = new RegExp(regexS);
var results = regex.exec(window.location.href);
if (results == null)
return "";
else
return results[1];
}
/* ~ END: HELPFUL FUNCTIONS */

$(".open_modalin").click(function(e){
e.preventDefault();
var modal_src = $(this).attr('data-modalin');
console.log("open_modalin: ",modal_src);
if(modal_src !== "") {
$(".modalin").modal({keyboard: false, backdrop: false, focus: true});
$(".modalin_content").load(modal_src);
}
});

window.open_modalin = function (modal_src) {
if(modal_src !== "") {
$(".modalin").modal({keyboard: false, backdrop: false, focus: true});
$(".modalin_content").load(modal_src);
}
}