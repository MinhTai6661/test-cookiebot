/*!
 * ScriptName: shared.js
 *
 */

// $(document).ready(function() {
//   $('.keyvisual').slick({
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     dots: false,
//     infinite: true,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     speed: 2000,
//     fade: true,
//     responsive: [
//       {
//         breakpoint: 999,
//         settings: {
//           arrows: false,
//           variableWidth: false,
//           centerMode: false,
//         }
//       }
//     ]
//   });
//   $(window).on('load resize orientationchange', function() {
//     $('.keyvisual').slick('resize');
//   });
// });

$(document).ready(function () {
  var scrollSpeed = 0.3;
  var imgWidth = 2168;
  var posX = 0;
  setInterval(function () {
    if (posX >= imgWidth) posX = 0;
    posX -= scrollSpeed;
    $('.slide-h').css("background-position", posX + "px 0px");
  }, 1);
});

$(document).ready(function () {
  var height;

  // ===============================
  // TÍNH HEIGHT
  // ===============================
  function updateHeight() {
    var height1 = $('.fixed-group-head').outerHeight();
    var height2 = $('#key-box').outerHeight();
    height = height2 - height1;
  }


  // ===============================
  // CHECK ĐANG Ở TRONG dark-sec?
  // ===============================
  function isInDarkSection() {

    var scrollTop = $(window).scrollTop();
    var winH = $(window).height();
    var middle = scrollTop + winH / 2; // lấy giữa viewport

    var isDark = false;

    $('.dark-sec').each(function () {

      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();

      if (middle >= top && middle < bottom) {
        isDark = true;
        return false; // break loop
      }
    });

    return isDark;
  }


  // ===============================
  // XỬ LÝ WHITE HEADER (DUY NHẤT 1 NƠI)
  // ===============================
  function checkScrollWhite() {

    var header = $('.fixed-group-head');

    // 1️⃣ Nếu menu mở → luôn trắng
    if ($('body').hasClass('menu-open')) {
      header.addClass('white');
      return;
    }

    // 2️⃣ Nếu đang ở dark-sec → trắng
    if (isInDarkSection()) {
      header.addClass('white');
      return;
    }

    // 3️⃣ Logic cũ của bạn
    if ($(window).scrollTop() > height) {
      header.removeClass('white');
    } else {
      header.addClass('white');
    }
  }


  // ===============================
  // FIXED BTN (GIỮ NGUYÊN)
  // ===============================
  function checkFixedBtn() {
    if ($(window).scrollTop() > height) {
      $('body').addClass('fixed-btn');
    } else {
      $('body').removeClass('fixed-btn');
    }
  }


  // ===============================
  // INIT
  // ===============================
  updateHeight();
  checkScrollWhite();
  checkFixedBtn();


  // ===============================
  // EVENTS
  // ===============================
  $(window).on('scroll', function () {
    checkScrollWhite();
    checkFixedBtn();
  });

  $(window).on('resize', function () {
    updateHeight();
    checkScrollWhite();
    checkFixedBtn();
  });
  var offsetY = 0;

  // Hamburger
  $('.hamberger-btn').on('click', function () {

    $('body').toggleClass('menu-open');
    $(this).toggleClass('active');

    // chỉ cần check white lại
    checkScrollWhite();

    return false;
  });

  // Close menu when clicking navigation links
  $('.nav a, .js-scroll a').click(function () {
    $('body').removeClass('menu-open');
  });

  // Close menu on overlay elements
  $('.hide-nav, .unsmooth').click(function () {
    if ($('body').hasClass('menu-open')) {
      $('body').removeClass('menu-open').css('top', '');
      $(window).scrollTop(offsetY);
    }
  });

  $('.unsmooth').click(function () {
    if ($('body').hasClass('popup-open')) {
      $('body').removeClass('popup-open');

      $('body').css('position', 'static');

      $(window).scrollTop(offsetY);
    } else {
      $('body').addClass('popup-open');

      offsetY = window.pageYOffset;
      requestAnimationFrame(() => {
        $('body').css({
          position: 'fixed',
          width: '100%',
          'top': -offsetY + 'px'
        });
      });
    }

    $('.remodal-wrapper').click(function () {
      $('body').removeClass('popup-open');
      $('body').css('position', 'static');
      $(window).scrollTop(offsetY);
    });
  });

});


var lastScrollTop = 0;
$(window).scroll(function () {
  var st = $(this).scrollTop();
  if (lastScrollTop != 0) {
    if (st < lastScrollTop) {
      $("#pagetop.style2").addClass("visible");
      if (st < 10) {
        $("#pagetop.style2").removeClass("visible");
      }
    }
    else if (st > lastScrollTop) {
      $("#pagetop.style2").removeClass("visible");
    }
  }
  lastScrollTop = st;
});

$(document).ready(function () {
  if ($('.nav[scroll-active]').length && $('.nav').attr('scroll-active') === "true") {
    $(document).on('scroll', onScroll)
    $('.nav a[href*="#"]').on('click', function () {
      var e = $(this).attr('href')
      var h = $('.nav').outerHeight()
      var b = $(e).length ? $(e).offset().top : 0
      console.log(b)
      console.log(b + 1 - h)
      $('html, body').animate({
        scrollTop: (b + 1 - h)
      }, 500)
    })
  }
});

function onScroll() {
  var scroll = $(window).scrollTop()
  var header = $('.nav').outerHeight()
  if ($(window).width() > 999) {
    var header = $('.nav').outerHeight()
  } else {
    var header = 60
  }

  $('.nav a[href^="#"]').each(function () {
    var el = $(this).attr('href')
    var offset = $(el).length ? $(el).offset().top : 0

    if (scroll === 0) {
      $('.nav a').removeClass('active');
      $('.nav a').eq(0).addClass('active');
      return false;
    }

    if ((scroll + header) >= offset && ($(el).outerHeight() + offset) > (scroll + header)) {
      $('.nav a').eq(0).removeClass('active');
      $('.nav a[href^="#"]').removeClass('active')
      $(this).addClass('active')
      // $(this).find('img').trigger('mouseout').trigger('mouseover')
    }
  })
}


function parAuto() {

  // if (window.matchMedia('(min-width: 999px)').matches) {
  //   $('.img_parallax img').each(function (index, element) {
  //     let src = $(element).attr('data-src');
  //     if (src === undefined) {
  //       src = $(element).attr('src')
  //     }
  //     $(element).css('display', 'none');
  //     $(element).parent().parent().parent().css({
  //       'background-image': "url('" + src + "')"
  //     });
  //   });
  // } 
  // else {
  //   $('.img_parallax img').each(function (index, element) {
  //     let src = $(element).attr('data-src');
  //     if (src === undefined) {
  //       src = $(element).attr('src')
  //     }
  //     $(element).css('display', 'block');
  //     $(element).parent().parent().parent().css({
  //       'background-image': "url('" + src + "')"
  //     });
  //   });  
  // }
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  if (isIE === true) {
    $('body').on("mousewheel", function (e) {
      event.preventDefault();
      var wd = event.wheelDelta;
      var csp = window.pageYOffset;
      window.scrollTo(0, csp - wd);
    });
    $('.unsmooth').click(function () {
      $('body').on("mousewheel", function (e) {
        if (e.wheelDelta) delta = e.wheelDelta;
        else if (e.originalEvent) {
          if (e.originalEvent.wheelDelta) delta = e.originalEvent.wheelDelta;
          else if (e.originalEvent.deltaY) delta = 0 - e.originalEvent.deltaY;
          else if (e.originalEvent.detail) delta = e.originalEvent.detail * -40;
        } else if (event.originalEvent) {
          if (event.originalEvent.wheelDelta) delta = event.originalEvent.wheelDelta;
          else if (event.originalEvent.deltaY) delta = 0 - event.originalEvent.deltaY;
          else if (event.originalEvent.detail) delta = event.originalEvent.detail * -40;
        }
      });
    });
  }

}
$(document).ready(function () {
  parAuto()
})

$(document).load($(window).bind("resize orientationchange", parAuto));


$(window).on('load', function () {
  setTimeout(function () {
    var hash1 = location.hash;
    var $root = $('html, body');

    if (hash1 && $(hash1).length) {
      var top01 = $(hash1).offset().top;

      if ($(window).width() < 768) {
        $root.animate({ scrollTop: top01 }, 500);
      } else {
        $root.animate({ scrollTop: top01 }, 500);
        // $root.animate({ scrollTop: top01 - 100 }, 500);
      }
    }
  }, 100);
});

const doc = document.documentElement
doc.style.setProperty('--app-height', `${window.innerHeight}px`)
window.addEventListener('resize', doc.style.setProperty('--app-height', `${window.innerHeight}px`))

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".scroll_active").forEach((el, index) => {

  const startPoint = $(window).width() < 768 ? "top 80%" : "top 65%";

  ScrollTrigger.create({
    trigger: el,
    start: startPoint,
    toggleClass: {
      targets: el,
      className: "active"
    },
    once: true
  });

});



/**
 * COOKIEBOT & JQUERY CONFLICT RESOLUTION v2
 */
(function () {
  function applySafePatch() {
    if (window.jQuery && window.jQuery.event && window.jQuery.event.dispatch) {
      var originalDispatch = window.jQuery.event.dispatch;

      if (originalDispatch.__isPatched) return;

      window.jQuery.event.dispatch = function (event) {
        var handlers = (jQuery._data(this, "events") || {})[event.type] || [];

        for (var i = 0; i < handlers.length; i++) {
          if (handlers[i] && !handlers[i].handler) {
            handlers[i].handler = function () { };
          }
        }

        try {
          return originalDispatch.apply(this, arguments);
        } catch (e) {
          // console.warn("Recovered from jQuery dispatch error:", e.message);
          return undefined;
        }
      };

      window.jQuery.event.dispatch.__isPatched = true;
    }
  }

  var checkCount = 0;
  var interval = setInterval(function () {
    checkCount++;
    if (window.jQuery) {
      applySafePatch();
      clearInterval(interval);
    }
    if (checkCount > 100) clearInterval(interval);
  }, 100);

  window.addEventListener('load', applySafePatch);
})();