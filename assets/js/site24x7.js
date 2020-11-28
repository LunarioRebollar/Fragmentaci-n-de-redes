if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
    	return this.replace(/^\s+|\s+$/g, '');
    }
}

function isNotEmpty(varName) {
    var response = true;
    if (varName == "" || varName == undefined) {
        response = false;
    }
    return response;
}

var countryEu = ['RS', 'VA', 'GB', 'UA', 'CH', 'SE', 'ES', 'SI', 'SK', 'SM', 'RU', 'RO', 'PT', 'PL', 'NO', 'NL', 'ME', 'MC', 'MD', 'MT', 'MK', //No i18N
    'LU', 'LT', 'LI', 'LV', 'IT', 'IM', 'IE', 'IS', 'HU', 'GR', 'GI', 'DE', 'FR', 'FI', 'FO', 'EE', 'DK', 'CZ', 'CY', 'HR', 'BG', 'BA', 'BE', //No i18N
    'BY', 'AT', 'AD', 'AL', 'AX', 'GG', 'JE', 'XK', 'SJ', 'CS']; //No i18N


var headerHeight = $('.header.uheader').height() + $('#mini-panel-product_menu').height();
// $(window).scroll(function() {

//     if ($(this).scrollTop() >= 160)
//      {
//         $('#product-top-header').show();
//         $('#product-top-header').removeClass('slide');
//      }
//     else
//      {
//       $('#product-top-header').addClass('slide');
//       //$('#product-top-header').hide();
//      }
//  });



/* Remove the sites24*7 for zoho.eu*/
var zohoDomain = document.domain;
if (zohoDomain == "www.site24x7.eu" || zohoDomain == "site24x7.eu") {

    /* zoho .eu cookie policy */

   $(document).ready(function (e) {

        var cookieHtml = '<div id="cookie-clear-bar" class="cookie-banner">We use cookies to give you the best online experience. By using our website you agree to our use of cookies in accordance with our <a class="content-wrap__anchor" href="/cookiepolicy.html"> cookie policy</a>.<button id="CookieClear" class="btn btn-primary btn-sm ml-2" onclick="CookieClearAccept()">OK</button></div>'
        $('body').prepend(cookieHtml);

        jQuery("html").css("margin-top", "0");
        var uidcookieVal = getCookie('euCookiepolicy');
        if (uidcookieVal == 'true') {
            jQuery("#cookie-clear-bar").hide();
            // jQuery("html").css("margin-top", "0");
            // jQuery('.signing').removeAttr('style');
        }
        else {
            jQuery("#cookie-clear-bar").show();
            // jQuery("html").css("margin-top", "32px");
            // jQuery('.signing').css('top', '35px');
        }

        $('#common-service-foooter').attr("href", "//status.site24x7.eu");

        var $deskappLink = $('#mobile-access-deskapp');
        if ($deskappLink.length) {
            var link = $deskappLink.attr('href');
            $deskappLink.attr('href', link.replace(/\.com/g, '.eu'));
        }

    });
    function CookieClearAccept() {
        days = 30;
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = "euCookiepolicy=true" + expires + "; path=/";
        jQuery("#cookie-clear-bar").hide();
        jQuery("html").css("margin-top", "0");
        jQuery('.signing').removeAttr('style');
    }
} else {
    $.ajax({
        url: 'https://iplocation.zoho.com/getipinfo?type=jsonp', //No i18N
        dataType: 'jsonp', //No i18N
        success: function (data) {
            /*if ($.inArray(data.COUNTRY_CODE, countryEu) >= 0) {
                var url = [location.protocol, '//', location.host, location.pathname].join('');
                if (!(/events\.html$/.test(url))) {
                    showBanner();
                }
            }*/
            $(document).trigger("geo-located", data);
        }
    });
}

function showBanner() {
    var cookieName = "webinar-may-2020"; //No i18N
    var bannerCookie = readCookie(cookieName);
    var $header = $('#header-wrap');
    var pageRegex = /\/tools(\/|\.html)|^\/check-website-availability.html|^\/link-explorer.html|^\/web-speed-report.html|^\/lynx-view.html|^\/text-ratio.html|^\/server-header.html|^\/html-validator.html|^\/link-checker.html|^\/code-cleaner.html|^\/dns-lookup.html|^\/port-test.html|^\/check-heartbleed-vulnerability.html|^\/web-page-analyzer.html|^\/find-ip-address-of-web-site.html|^\/trace-route.html|^\/ping-test.html|^\/find-website-location.html|^\/ssl-certificate.html/;
    var bannerStyle = `
        <style>
            #announcement-banner {
                position: relative;
                border: 1px solid transparent;
                width: 100%;
                background-color: #dfeaf4;
            }

            .announcement-text {
                font-size:15px;
                text-align: center;
                color:#333!important;
                padding-top: 0px;
                padding: .5rem 2rem;
                
            }
            
            .premoclose {
                position: absolute;
                right: 10px;
                top: 10px;
                width: 20px;
                height: 20px;
                opacity: 1;
                background: #fff;
                font-size: 0;
                cursor: pointer;
                text-indent: -9999px;
            }

            @media (min-width: 1200px) {
                .premoclose {
                    right: 1%;
                }
            }

            @media (min-width: 1400px) {
                .premoclose {
                    right: 4%;
                }
            }
            .premoclose:before, .premoclose:after {
                position: absolute;
                left: 9px;
                content: ' ';
                height: 10px;
                width: 1px;
                background-color: #000;
                top: 5px;
            }
            .premoclose:before {
                transform: rotate(45deg);
            }
            .premoclose:after {
                transform: rotate(-45deg);
            }
        </style>
    `;

    var $banner = $(`
        <aside>
            <div id="announcement-banner">
                <span class="premoclose" data-dismiss="alert" aria-hidden="true">close</span>
               <p class="mb-0 announcement-text">[Webinar] Best practices for monitoring the operational health of your servers. Register: 
               <a style="color: #007bff" href="https://meeting.zoho.com/meeting/register?sessionId=1075542529" target="_blank" rel="noopener">AEST</a> | 
               <a style="color: #007bff" href="https://meeting.zoho.com/meeting/register?sessionId=1085740204" target="_blank" rel="noopener">GMT</a> | 
               <a style="color: #007bff" href="https://meeting.zoho.com/meeting/register?sessionId=1060792809" target="_blank" rel="noopener">PST</a>
               </p>
            </div>
        </aside>
    `);

    /*if (bannerCookie == null && $header.length) {
        var pathname = location.pathname;
        if (pageRegex.test(pathname)) {
            $(bannerStyle).appendTo('head');
            $banner.insertAfter($header);
            $('.premoclose').on('click', function () {
                createCookie(cookieName, 0);
                $banner.hide();
            });
        }
    }*/
}

var Tracker = Tracker || function () {};

Tracker.prototype = {
    categories: {
        server: 0,
        apm: 2,
        networkMonitor: 1,
        website: 5,
        rum: 3,
        tools: 4,
        statusPage: 7,
        aws: 6,
        mobileApm: 8,
        msp: 9,
        appLog: 10,
        vmware: 11,
        home: 12
    },
    setProduct: function (productCode) {
        if (productCode === undefined) {
            var category = $('meta[name=s247-category]').attr('content');
            if (category !== undefined) {
                productCode = this.categories[category];
            }
        }

        if (productCode === undefined) {
            return;
        }

        var visitedProducts = readCookie('VPT');

        if (visitedProducts != null) {
            var productList = visitedProducts.split(",");

            if ($.inArray(productCode.toString(), productList) == -1) {
                visitedProducts = visitedProducts + "," + productCode;
            }
        } else {
            visitedProducts = productCode;
        }

        createCookie('VPT', visitedProducts);
    }
};

var tracker = new Tracker();

function createCookie(name,value,days) {
    var expires = "";
    if (isNotEmpty(value)) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=None; Secure";
    }
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' '){ c = c.substring(1,c.length) };
        if (c.indexOf(nameEQ) == 0) {return decodeURIComponent(c.substring(nameEQ.length,c.length))};
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function getCookie(name) {
    var cookiename = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        if (c.indexOf(cookiename) > 0){
            return c.substring(cookiename.length + 1, c.length);
        }
    }
    return null;
}

var cookieExpiry = 90;
$.QueryString = (function(paramsArray) {
    var params = {};

    for (var i = 0; i < paramsArray.length; ++i) {
        var param = paramsArray[i].split('=', 2);

        if (param.length !== 2) {
            continue;
        }

        params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }

    return params;
})(window.location.search.substr(1).split('&'));

(function($) {
    var httpReferrer1 = readCookie("httpReferrer1"); //No i18N
    if (!isNotEmpty(httpReferrer1)) {
        var referrer = document.referrer && document.referrer.length > 0 ? document.referrer : "-";
        createCookie("httpReferrer1", referrer, cookieExpiry); //No i18N
    }

    var landingPageUrl = readCookie("landingPageUrl"); //No i18N
    if (!isNotEmpty(landingPageUrl)) {
        createCookie("landingPageUrl", document.location.href, cookieExpiry); //No i18N
    }

    createCookie("ad_src", $.QueryString.ad_src, cookieExpiry); //No i18N
    createCookie("ad_grp", $.QueryString.ad_grp, cookieExpiry); //No i18N

    /*$('.mobile-menu-icon1').click(function () {
        $(this).toggleClass('active');
        $('.zhamburger').toggleClass('active');
        $('.zmobile-menu-new').toggleClass('active');
        $('.zmobile-menu-new').toggle();
        $('.zmobile-menu-new-inner').toggle();
        $('.zmobile-menu-new-inner').toggleClass('zshow');
    });*/

    // var toggleMyDropdown = function(){
    //     $(this).find('.dropdown-toggle').dropdown('toggle');
    // };
    // $('#myDropdown, #myDropdown-2').hover(toggleMyDropdown, toggleMyDropdown);
    // $('#myDropdown, #myDropdown-2').on('shown.bs.dropdown', function () {
    //     $('.backdrop').show();
    //     // $('body').css("overflow-y","hidden");
    // });
    // $('#myDropdown, #myDropdown-2').on('hide.bs.dropdown', function () {
    //     $('.backdrop').hide();
    //     // $('body').css("overflow-y","auto");
    // });

    createCookie("utm_source", $.QueryString.utm_source, cookieExpiry); //No i18N
    createCookie("utm_medium", $.QueryString.utm_medium, cookieExpiry); //No i18N
    createCookie("utm_term", $.QueryString.utm_term, cookieExpiry); //No i18N
    createCookie("utm_content", $.QueryString.utm_content, cookieExpiry); //No i18N
    createCookie("utm_campaign", $.QueryString.utm_campaign, cookieExpiry); //No i18N
    createCookie("utm_expid", $.QueryString.utm_expid, cookieExpiry); //No i18N
    createCookie("utm_referrer", $.QueryString.utm_referrer, cookieExpiry); //No i18N

    var url = [location.protocol, '//', location.host, location.pathname].join('');
    if (/signup\.html$/.test(url)) {
        persistCrossDCCookies();
    }

    tracker.setProduct();

    showBanner();

    $('#footer a').on('click', function () {
        var ea = $(this).attr('href');
        ea = ea.replace(/\.\.\//g, '');
        var el = $(this).closest("ul").attr('data-ft');
        try{$zoho.salesiq.visitor.customaction("{'eventCategory':'Footer LinkClick','eventAction':'" + ea + "','eventLabel':'" + el + "','customID':'-'}");}catch(exp){}
    });
    $('.product-card > a').on('click', function () {
        var anchorLink = $(this).attr('href');
        anchorLink = anchorLink.replace(/\.\.\//g, '');
        var anchorLinkParent = $(this).closest(".product-wrap").attr('data-parent');
        try{$zoho.salesiq.visitor.customaction("{'eventCategory':'Product Dropdown','eventAction':'" + anchorLink + "','eventLabel':'" + anchorLinkParent + "','customID':'-'}");}catch(exp){}
    });
    $('.resource-menu-dropdown-item').on('click', function () {
        var dropDownLink = $(this).attr('href');
        dropDownLink = dropDownLink.replace(/\.\.\//g, '');
        try{$zoho.salesiq.visitor.customaction("{'eventCategory':'Resource Dropdown','eventAction':'" + dropDownLink + "','customID':'-'}");}catch(exp){}
    });
})(jQuery);

function persistCrossDCCookies() {
    var cookieNames = ["utm_source", "utm_medium", "VPT", "httpReferrer1", "httpReferrer2", "landingPageUrl", "ad_src", "ad_grp"]; //No i18N
    var params = [];
    for (var i = 0; i < cookieNames.length; i++) {
        var cookieName = cookieNames[i];
        var cookieValue = readCookie(cookieName);
        if (cookieValue) {
            params.push(cookieName + "=" + encodeURIComponent(cookieValue));
        }
    }
    var uri = "/lp/mar-com.html?" + params.join('&'); //No i18N
    $('body').append('<iframe style="display:none" src="https://www.site24x7.in' + uri + '"></iframe>');
    $('body').append('<iframe style="display:none" src="https://www.site24x7.eu' + uri + '"></iframe>');
    $('body').append('<iframe style="display:none" src="https://www.site24x7.net.au' + uri + '"></iframe>');
}



$(".search-btn").click(function () {
    $(".search-wrap").addClass("search-visible");
    $('#search-input').attr("tabindex", "0").focus();
});

$(".close-btn").click(function () {
    $(".search-wrap").removeClass("search-visible");
    $('#search-input').attr("tabindex", "-1")
});

$("#mobile-search").click(function (e) {
    e.stopPropagation();
    if ($("#navbarNavAltMarkup").hasClass("show")) {
        $("#navbarNavAltMarkup").collapse('hide')      
    }
    $(".s247-search-container").addClass("search-active");
    $(".overlay").addClass("overlay-active");
    $("#search-query").focus();

});

$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        $('.s247-search-container').removeClass("search-active");
    }
});

$(document).click(function (e) {
    $target = $(e.target);
    if (!$target.closest('.global-search-icon').length && !$target.closest('.s247-search-container').length &&
        $('.s247-search-container').is(":visible")) {
        $('.s247-search-container').removeClass("search-active");
        $(".overlay").removeClass("overlay-active");
    }
});

$('#menuDropdown').on('shown.bs.dropdown', function () {
    $screensize = $(window).width();
    if ($screensize < 768) {
    $('#navbarNavAltMarkup').addClass('max-height overflow-auto');
                        }
        })
  $('#menuDropdown').on('hidden.bs.dropdown', function () {
    $screensize = $(window).width();
    if ($screensize < 768) {
    $('#navbarNavAltMarkup').removeClass('max-height overflow-auto');
              }
        })
        $('#navbarNavAltMarkup').on('show.bs.collapse', function () {
            $('.nav-toggler-menu').addClass('open');
              });
              $('#navbarNavAltMarkup').on('hide.bs.collapse', function () {
            $('.nav-toggler-menu').removeClass('open');
              });


    function toggleDropdown (e) {
    const _d = $(e.target).closest('.dropdown'),
    _m = $('.dropdown-menu', _d);
    setTimeout(function(){
        const shouldOpen = e.type !== 'click' && _d.is(':hover');//No i18N
        _m.toggleClass('show', shouldOpen);//No i18N
        _d.toggleClass('show', shouldOpen);//No i18N
        $('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);//No i18N
        }, e.type === 'mouseleave' ? 100 : 0);
    }

    $('body').on('mouseenter mouseleave','.dropdown',toggleDropdown)