var key = "";
var key_dev = "";
var id_cliente = "";
var lat = "";
var lon = "";
var session_id = "";
var user_agent = "";
var Usuario = "";
var ip = "";
var is_app = "1";

var myapp_config = {
	/*
	SAVE INSTANCE REFERENCE
	Save a reference to the global object (window in the browser)
	*/
	root_: $('body'), // used for core app reference
	root_logo: $('.page-sidebar > .page-logo'), // used for core app reference
	/*
	DELAY VAR FOR FIRING REPEATED EVENTS (eg., scroll & resize events)
	Lowering the variable makes faster response time but taxing on the CPU
	Reference: http://benalman.com/code/projects/jquery-throttle-debounce/examples/throttle/
	*/
	throttleDelay: 450, // for window.scrolling & window.resizing
	filterDelay: 150,   // for keyup.functions
	/*
	DETECT MOBILE DEVICES
	Description: Detects mobile device - if any of the listed device is
	detected a class is inserted to $.root_ and the variable thisDevice
	is decleard. (so far this is covering most hand held devices)
	*/
	thisDevice: null, // desktop or mobile
	isMobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())), //popular device types available on the market
	mobileMenuTrigger: null, // used by pagescrolling and appHeight script, do not change!
	mobileResolutionTrigger: 992, //the resolution when the mobile activation fires
	/*
	DETECT IF WEBKIT
	Description: this variable is used to fire the custom scroll plugin.
	If it is a non-webkit it will fire the plugin.
	*/
	isWebkit: ((!!window.chrome && !!window.chrome.webstore) === true || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 === true),
	/*
	DETECT CHROME
	Description: this variable is used to fire the custom CSS hacks
	*/
	isChrome: (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())),
	/*
	DETECT IE (it only detects the newer versions of IE)
	Description: this variable is used to fire the custom CSS hacks
	*/
	isIE: ( (window.navigator.userAgent.indexOf('Trident/') ) > 0 === true ),
	/*
	DEBUGGING MODE
	debugState = true; will spit all debuging message inside browser console.
	*/
	debugState: true, // outputs debug information on browser console
	/*
	Turn on ripple effect for buttons and touch events
	Dependency:
	*/
	rippleEffect: true, // material design effect that appears on all buttons
	/*
	Primary menu anchor point #js-primary-nav
	This is the root anchor point where the menu script will begin its build
	*/
	navAnchor: $('#js-primary-nav'), //changing this may implicate slimscroll plugin target
	navHooks: $('#js-nav-menu'), //changing this may implicate CSS targets
	navAccordion: true, //nav item when one is expanded the other closes
	navInitalized: 'js-nav-built', //nav finished class
	navFilterInput: $('#nav_filter_input'), //changing this may implicate CSS targets
	navHorizontalWrapperId: 'js-nav-menu-wrapper',
	/*
	The rate at which the menu expands revealing child elements on click
	Lower rate reels faster expansion of nav childs
	*/
	navSpeed: 500, //ms
	/*
	Color profile reference hook (needed for getting CSS value for theme colors in charts and various graphs)
	*/
	mythemeColorProfileID: $('#js-color-profile'),
	/*
	Nav close and open signs
	This uses the fontawesome css class
	*/
	navClosedSign: 'fal fa-angle-down',
	navOpenedSign: 'fal fa-angle-up',
	/*
	App date ID
	found inside the breadcrumb unit, displays current date to the app on pageload
	*/
	appDateHook: $('.js-get-date'),
	/*
	* SaveSettings to localStorage
	* DOC: to store settings to a DB instead of LocalStorage see below:
	*    initApp.pushSettings("className1 className2") //sets value
	*    var DB_string = initApp.getSettings(); //returns setting string
	*/
	storeLocally: true,
	/*
	* Used with initApp.loadScripts
	* DOC: Please leave it blank
	*/
	jsArray : []
};

var jsArray = [];

(function($) {

	/**
	 * Menu Plugin
	 **/
	$.fn.extend({

		/**
		 * pass the options variable to the function
		 *
		 *   $(id).navigation({
		 *       accordion: true,
		 *       animate: 'easeOutExpo',
		 *       speed: 200,
		 *       closedSign: '[+]',
		 *       openedSign: '[-]',
		 *       initClass: 'js-nav-built'
		 *   });
		 *
		 **/

	    navigation: function(options) {

	        var defaults = {
					accordion: true,
					animate: 'easeOutExpo',
					speed: 200,
					closedSign: '[+]',
					openedSign: '[-]',
					initClass: 'js-nav-built'
	            },

	            /**
	             * extend our default options with those provided.
	             **/
	            opts = $.extend(defaults, options),

	            /**
	             * assign current element to variable, in this case is UL element
	             **/
	            self = $(this);

				if (!self.hasClass(opts.initClass)) {

				    /**
				     * confirm build to prevent rebuild error
				     **/
				    self.addClass(opts.initClass);

				    /**
				     * add a mark [+] to a multilevel menu
				     **/
				    self.find("li").each(function() {
				        if ($(this).find("ul").length !== 0) {

				            /**
				             * add the multilevel sign next to the link
				             **/
				            $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

				            /**
				             * avoid jumping to the top of the page when the href is an #
				             **/
				            if ($(this).find("a:first").attr('href') == "#") {
				                $(this).find("a:first").click(function() {
				                    return false;
				                });
				            }
				        }
				    });

				    /**
				     * add open sign to all active lists
				     **/
				    self.find("li.active").each(function() {
				        $(this).parents("ul")
				        	.parent("li")
				        	.find("a:first")
				        	.attr('aria-expanded', true)
				        	.find("b:first")
				        	.html(opts.openedSign);
				    });

				    /**
				     * click events
				     **/
				    self.find("li a").on('mousedown', function(e) {

				        if ($(this).parent().find("ul").length !== 0) {

				            if (opts.accordion) {

				                /**
				                 * do nothing when the list is open
				                 **/
				                if (!$(this).parent().find("ul").is(':visible')) {

				                    parents = $(this).parent().parents("ul");
				                    visible = self.find("ul:visible");
				                    visible.each(function(visibleIndex) {
				                        var close = true;
				                        parents.each(function(parentIndex) {

				                            if (parents[parentIndex] == visible[visibleIndex]) {

				                                close = false;
				                                return false;
				                            }
				                        });
				                        if (close) {

				                            if ($(this).parent().find("ul") != visible[visibleIndex]) {

				                                $(visible[visibleIndex]).slideUp(opts.speed + 300, opts.animate, function() {
				                                    $(this).parent("li")
				                                    	.removeClass("open")
				                                    	.find("a:first")
				                                    	.attr('aria-expanded', false)
				                                    	.find("b:first")
				                                    	.html(opts.closedSign);

				                                    if (myapp_config.debugState)
				                                        console.log("nav item closed")
				                                });
				                            }
				                        }
				                    });
				                }
				            }

				            /**
				             * Add active class to open element
				             **/
				            if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {

				                $(this).parent().find("ul:first").slideUp(opts.speed + 100, opts.animate, function() {
				                    $(this).parent("li")
				                    	.removeClass("open")
				                    	.find("a:first")
				                    	.attr('aria-expanded', false)
				                    	.find("b:first").delay(opts.speed)
				                    	.html(opts.closedSign);

				                    if (myapp_config.debugState)
				                        console.log("nav item closed")
				                });
				            } else {
				                $(this).parent().find("ul:first").slideDown(opts.speed, opts.animate, function() {

				                    $(this).parent("li")
				                    	.addClass("open")
				                    	.find("a:first")
				                    	.attr('aria-expanded', true)
				                    	.find("b:first").delay(opts.speed)
				                    	.html(opts.openedSign);

				                    if (myapp_config.debugState)
				                        console.log("nav item opened");

				                });
				            }
				        }
				    });

				} else {

				    if (myapp_config.debugState)
				        console.log(self.get(0) + " this menu already exists");
				}

	    },

	    /**
	     * DOC: $(id).destroy();
	     **/
	    navigationDestroy: function() {

			self = $(this);

			if (self.hasClass(myapp_config.navInitalized)) {
			    self.find("li").removeClass("active open");
			    self.find("li a").off('mousedown').removeClass("active").removeAttr("aria-expanded").find(".collapse-sign").remove();
			    self.removeClass(myapp_config.navInitalized).find("ul").removeAttr("style");

			    if (myapp_config.debugState)
			        console.log( self.get(0) + " destroyed");

			} else {
			    console.log("menu does not exist")
			}


	    }
	});

})(jQuery, window, document);

;

(function($) {
    var pluginName = 'menuSlider';

    function Plugin(element, options) {

        var $el = $(element),
             el = element;
        options = $.extend({}, $.fn[pluginName].defaults, options);

        function init() {

            /* reset margin */
            $el.css('margin-left', '0px');

            /* add wrapper around navigation */
            $el.wrap( '<div id="'+options.wrapperId+'" class="nav-menu-wrapper d-flex flex-grow-1 width-0 overflow-hidden"></div>' );

            /* add buttons for scroller */
            $('#' + options.wrapperId).before('<a href="#" id="' + options.wrapperId + '-left-btn" class="d-flex align-items-center justify-content-center width-4 btn mt-1 mb-1 mr-2 ml-1 p-0 fs-xxl text-primary"><i class="fal fa-angle-left"></i></a>');
            $('#' + options.wrapperId).after('<a href="#" id="' + options.wrapperId + '-right-btn" class="d-flex align-items-center justify-content-center width-4 btn mt-1 mb-1 mr-1 ml-2 p-0 fs-xxl text-primary"><i class="fal fa-angle-right"></i></a>');

            var getListWidth = $.map($el.children('li:not(.nav-title)'),function(val){ return $(val).outerWidth(true);}),
                /* define variables */
                wrapperWidth,
                currentMarginLeft,
                contentWidth,
                setMargin,
                maxMargin,


                /* update variables for margin calculations */
                _getValues = function() {
                    wrapperWidth = $('#' + options.wrapperId).outerWidth(); /* incase its changed we get it again */
                    contentWidth = $.map( $el.children('li:not(.nav-title)'), function(val){ return $(val).outerWidth(true); }).reduce(function(a, b) { return a + b; }, 0);
                    currentMarginLeft = parseFloat($el.css('margin-left'));

                    /*console.log("got new values");
                    console.log("wrapperWidth :" + wrapperWidth);
                    console.log("contentWidth :" + contentWidth);
                    console.log("currentMarginLeft :" + currentMarginLeft);*/
                },

                /* scroll right */
                navMenuScrollRight = function() {

                    _getValues();

                    if (-currentMarginLeft + wrapperWidth < contentWidth) {
                        setMargin = Math.max(currentMarginLeft - wrapperWidth, -(contentWidth - wrapperWidth) );
                    } else {
                        setMargin = currentMarginLeft;
                        console.log("right end");
                    }

                    $el.css({
                        marginLeft: setMargin
                    });

                },

                /* scroll left */
                navMenuScrollLeft = function() {

                    _getValues();

                    if (currentMarginLeft < 0) {
                        setMargin = Math.min(currentMarginLeft + wrapperWidth, 0);
                    } else {
                        setMargin = currentMarginLeft;
                        console.log("left end");
                    }

                    $el.css({
                        marginLeft: setMargin
                    });

                };

            /* assign buttons for right*/
            $('#' + options.wrapperId + '-left-btn').click(function(e) {

                navMenuScrollLeft();

                e.preventDefault();
            });

            /* assign buttons for left */
             $('#' + options.wrapperId + '-right-btn').click(function(e) {

                navMenuScrollRight();

                e.preventDefault();
            });

            hook('onInit');
        }

        function option(key, val) {
            if (val) {
                options[key] = val;
            } else {
                return options[key];
            }
        }

        function destroy(options) {
            $el.each(function() {
                var el = this;
                var $el = $(this);

                // Add code to restore the element to its original state...

                $el.css('margin-left', '0px');
                $el.unwrap(parent);
                $el.prev().off().remove();
                $el.next().off().remove();

                hook('onDestroy');
                $el.removeData('plugin_' + pluginName);
            });
        }

        function hook(hookName) {
            if (options[hookName] !== undefined) {
                options[hookName].call(el);
            }
        }

        init();

        return {
            option: option,
            destroy: destroy
        };
    }

    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

    $.fn[pluginName].defaults = {
        onInit: function() {},
        onDestroy: function() {},
        element: myapp_config.navHooks,
        wrapperId: myapp_config.navHorizontalWrapperId
    };


})(jQuery);


var initApp = (function(app) {

app.addDeviceType = function() {

		if (!myapp_config.isMobile) {
			/* desktop */
			myapp_config.root_.addClass('desktop');
			myapp_config.thisDevice = 'desktop';
		} else {
			/* mobile */
			myapp_config.root_.addClass('mobile');
			myapp_config.thisDevice = 'mobile';
		}
		return myapp_config.thisDevice;
};

app.detectBrowserType = function () {
		/* safari, chrome or IE detect */
		if(myapp_config.isChrome){

			myapp_config.root_.addClass('chrome webkit');
			return 'chrome webkit';

		} else if (myapp_config.isWebkit) {

			myapp_config.root_.addClass('webkit');
			return 'webkit';

		} else if (myapp_config.isIE) {

			myapp_config.root_.addClass('ie');
			return 'ie';
		}
};

app.loadScript = function (scriptName, callback) {

		if (!myapp_config.jsArray[scriptName]) {
			var promise = jQuery.Deferred();

			/* adding the script tag to the head as suggested before */
			var body = document.getElementsByTagName('body')[0],
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = scriptName;

			/* then bind the event to the callback function
			   there are several events for cross browser compatibility */
			script.onload = function() {
				promise.resolve();
			};

			/* fire the loading */
			body.appendChild(script);
			myapp_config.jsArray[scriptName] = promise.promise();
		}

		else if (myapp_config.debugState)
			console.log("This script was already loaded: " + scriptName);

		myapp_config.jsArray[scriptName].then(function () {
			if(typeof callback === 'function') {
				callback();
			}
		});
};

return app;
})({});

document.addEventListener('DOMContentLoaded', function() {

initApp.addDeviceType();
initApp.detectBrowserType();

});

/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */
var ignore_key_elms = [".pace, .page-wrapper, .shortcut-menu, .js-modal-messenger, .js-modal-settings, script"];
var container = $('#js-page-content');
var bread_crumb = $('.page-breadcrumb');

var loadScript = function(scriptName, callback) {

	if (!jsArray[scriptName]) {
		var promise = jQuery.Deferred();

		// adding the script tag to the head as suggested before
		var body = document.getElementsByTagName('body')[0],
			script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptName;

		// then bind the event to the callback function
		// there are several events for cross browser compatibility
		script.onload = function () {
			promise.resolve();
		};

		// fire the loading
		body.appendChild(script);

		// clear DOM reference
		//body = null;
		//script = null;

		jsArray[scriptName] = promise.promise();

	} else {
		console.log("This script was already loaded %c: " + scriptName);
	}

	jsArray[scriptName].then(function () {
		if (typeof callback === 'function')
			callback();
	});
};

/* ~ END: LOAD SCRIPTS */

/*
 * APP AJAX REQUEST SETUP
 * Description: Executes and fetches all ajax requests also
 * updates naivgation elements to active
 */

// fire this on page load if nav exists
if ($('#js-nav-menu').length) {
//checkURL();
}
checkURL();

$(document).on('click', '#js-nav-menu_ a[href!="#"]', function (e) {
	e.preventDefault();
	var $this = $(e.currentTarget);

	// if parent is not active then get hash, or else page is assumed to be loaded
	if (!$this.parent().hasClass("active") && !$this.attr('target')) {

		// update window with hash
		// you could also do here:  thisDevice === "mobile" - and save a little more memory

		if (myapp_config.root_.hasClass('mobile-view-activated')) {
			myapp_config.root_.removeClass('hidden-menu');
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

// fire links with targets on different window
$(document).on('click', '#js-nav-menu a[target="_blank"]', function (e) {
	e.preventDefault();
	var $this = $(e.currentTarget);

	window.open($this.attr('href'));
});

// fire links with targets on same window
$(document).on('click', '#js-nav-menu a[target="_top"]', function (e) {
	e.preventDefault();
	var $this = $(e.currentTarget);

	window.location = ($this.attr('href'));
});

// all links with hash tags are ignored
$(document).on('click', '#js-nav-menu a[href="#"]', function (e) {
	e.preventDefault();
});

// DO on hash change
$(window).on('hashchange', function () {
$("#page-container").removeClass("sidebar-o-xs");
$(".index_saludo").hide('slow');
checkURL();
});

/*
 * CHECK TO SEE IF URL EXISTS
 */
function checkURL() {

	//get the url by removing the hash
	//var url = location.hash.replace(/^#/, '');
	var url = location.href.split('#').splice(1).join('#');
	//BEGIN: IE11 Work Around
	if (!url) {

		try {
			var documentUrl = window.document.URL;
			if (documentUrl) {
				if (documentUrl.indexOf('#', 0) > 0 && documentUrl.indexOf('#', 0) < (documentUrl.length + 1)) {
					url = documentUrl.substring(documentUrl.indexOf('#', 0) + 1);

				}

			}

		} catch (err) {}
	}
	//END: IE11 Work Around


	// Do this if url exists (for page refresh, etc...)
	if (url) {
		// remove all active class
		$('#js-nav-menu li.active').removeClass("active");
		// match the url and add the active class
		$('#js-nav-menu li:has(a[href="' + url + '"])').addClass("active");
		var title = ($('nav a[href="' + url + '"]').attr('title'));

		// change page title from global var
		document.title = (title || document.title);

		// debugState
//		console.log("Page title: %c " + document.title);

		// parse url to jquery
		loadURL(url + location.search, container);

	} else {

		// grab the first URL from nav
		var $this = $('#js-nav-menu > li:first-child > a[href!="#"]');

		//update hash
		window.location.hash = $this.attr('href');

		//clear dom reference
		$this = null;

	}

}
/*
 * LOAD AJAX PAGES
 */
function loadURL(url, container) {

if (url == "undefined" || url == null || url == "") { url = url_server+"/_/index?is_app="+is_app; } else { url = url_server+"/_/" + url; }

	// debugState
	console.log("URL: " + url);

	$.ajax({
		type: "GET",
		url: url,
        data: { is_app: is_app },
		dataType: 'html',
		cache: true, // (warning: setting it to false will cause a timestamp and will call the request twice)
		beforeSend: function () {

			// destroy all widget instances
			if ($.navAsAjax && (container[0] == $("#js-page-content")[0]) && enableJarvisWidgets && $("#widget-grid")[0]) {

				$("#widget-grid").jarvisWidgets('destroy');
				// debugState
				console.log("âœ” JarvisWidgets destroyed");

			}
			// end destroy all widgets

			// cluster destroy: destroy other instances that could be on the page
			// this runs a script in the current loaded page before fetching the new page
			if ((container[0] == $("#js-page-content")[0])) {

				/*
				 * The following elements should be removed, if they have been created:
				 *
				 *	colorList
				 *	icon
				 *	picker
				 *	inline
				 *	And unbind events from elements:
				 *
				 *	icon
				 *	picker
				 *	inline
				 *	especially $(document).on('mousedown')
				 *	It will be much easier to add namespace to plugin events and then unbind using selected namespace.
				 *
				 *	See also:
				 *
				 *	http://f6design.com/journal/2012/05/06/a-jquery-plugin-boilerplate/
				 *	http://keith-wood.name/pluginFramework.html
				 */

				// this function is below the pagefunction for all pages that has instances

				if (typeof pagedestroy == 'function') {

					try {
						pagedestroy();

//						console.log("âœ” Pagedestroy()");

					} catch (err) {
						pagedestroy = undefined;

//						console.log("! Pagedestroy() Catch Error");

					}

				}


			}
			// end cluster destroy

			// empty container and var to start garbage collection (frees memory)
			pagefunction = null;
			container.removeData().html("");

			// place cog
			container.html('<br><h3 class="text-center_ ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Cargando...</h3><br>');

			// Only draw breadcrumb if it is main content material
			if (container[0] == $("#js-page-content")[0]) {

				// clear everything else except these key DOM elements
				// we do this because sometime plugins will leave dynamic elements behind
//				$('body').find('> *').filter(':not(' + ignore_key_elms + ')').empty().remove();

				// draw breadcrumb
				//drawBreadCrumb();

				// scroll up
				$("html").animate({
					scrollTop: 0
				}, "fast");
			}
			// end if
		},
		success: function (data) {

			// dump data to container
			container.css({
				opacity: '0.0'
			}).html(data).delay(50).animate({
				opacity: '1.0'
			}, 300);

			// clear data var
			data = null;
			container = null;
			codebase_app_init();
		},
		error: function (xhr, status, thrownError, error) {
			container.html('<h4 class="text-danger"><i class="fa fa-warning text-warning"></i> Error requesting <span class="text-danger">' + url + '</span>: ' + xhr.status + ' <span style="text-transform: capitalize;">' + thrownError + '</span></h4>');
		},
		async: true
	});

}

/*
 * UPDATE BREADCRUMB
 */
function drawBreadCrumb(opt_breadCrumbs) {
	var a = $("nav li.active > a"),
		b = a.length;

	bread_crumb.empty(),
		bread_crumb.append($("<li>Home</li>")), a.each(function () {
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
/* ~ END: APP AJAX REQUEST SETUP */

/*
 * PAGE SETUP
 * Description: fire certain scripts that run through the page
 * to check for form elements, tooltip activation, popovers, etc...
 */
function pageSetUp() {

	if (thisDevice === "desktop") {
		// is desktop

		// activate tooltips
		$("[rel=tooltip], [data-rel=tooltip]").tooltip();

		// activate popovers
		$("[rel=popover], [data-rel=popover]").popover();

		// activate popovers with hover states
		$("[rel=popover-hover], [data-rel=popover-hover]").popover({
			trigger: "hover"
		});

		// setup widgets
		setup_widgets_desktop();

		// activate inline charts
		runAllCharts();

		// run form elements
		runAllForms();

	} else {

		// is mobile

		// activate popovers
		$("[rel=popover], [data-rel=popover]").popover();

		// activate popovers with hover states
		$("[rel=popover-hover], [data-rel=popover-hover]").popover({
			trigger: "hover"
		});

		// activate inline charts
		runAllCharts();

		// setup widgets
		setup_widgets_mobile();

		// run form elements
		runAllForms();

	}

}
/* ~ END: PAGE SETUP */