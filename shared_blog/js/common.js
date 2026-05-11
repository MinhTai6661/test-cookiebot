/*!
 * ScriptName: common.js
 * Version: 1.6
 *
 * Project: FC-Blog
 *
 * FoodConnection
 * http://foodconnection.jp/
 * http://foodconnection.vn/
 *
 */

$(document).ready(function() {
	var UA = navigator.userAgent;
	if (UA.indexOf("iPhone") < 0 && UA.indexOf("Android") < 0) $(".telhref").contents().unwrap(); // remove link [tel] on desktop

	// BEGIN: rollover button
	$("body").on({
		mouseover: function() {
			if (!$(this).data("src-original")) $(this).data("src-original", $(this).attr("src"));

			$(this).attr("src").match(/^(.*)(\.{1}.*)/g);

			var $src = RegExp.$1 + "_on" + RegExp.$2;

			$(this).attr("src", $src); // update src
		}, mouseout: function() {
			if ($(this).data("src-original")) {
				$(this).attr("src", $(this).data("src-original")); // update src
				$(this).removeData("src-original")
			}
		}
	}, "img.btn");
	// END: rollover button

	$(".toggle").click(function() {
		$(this).parents("aside").toggleClass("active");
	});

	// sidebar
	$("#sidebar h2").click(function() {
		if ($(window).width() <= 768) {
			if ($(this).parent().hasClass("active")) {
				$(this).nextAll().stop().slideUp(300, function() {
					$(this).removeAttr("style");
					$(this).parent().removeClass("active");
				});
			} else {
				$(this).nextAll().stop().slideDown(300, function() {
					$(this).removeAttr("style");
					$(this).parent().addClass("active");
				});
			}
		}
	});
});



// calendar
var pathMonth = location.pathname ? location.pathname.split("/") : false,
	paramMonth = false,
	referrer = document.referrer.replace(/^https?:\/\//i, "").split("/")[0];

if (referrer == location.hostname && pathMonth && pathMonth.constructor === Array && pathMonth.length > 0) {
	paramMonth = pathMonth[pathMonth.length - 1];

	if (!paramMonth || paramMonth.length < 1) paramMonth = pathMonth[pathMonth.length - 2]; // slash

	if (!isNaN(parseFloat(paramMonth)) && isFinite(paramMonth)) {
		if ($("#calendar").length > 0) {
			$("#calendar").addClass("active"); // collapsed

			if ($(window).width() <= 768 && $("#calendar").is(":visible")) window.scroll(0, $("#calendar").offset().top);
		}
	}
}