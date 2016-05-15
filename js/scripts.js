(function( $ ){

	"use strict";

	var handheldBreakpoint 	= 980;	//media query breakpoint at which the mobile menu is shown
	var mobileBreakpoint 	= 640;	//breakpoint at which everything collapses into one column

	// header menu reveal
	var $menu_icon = jQuery('.cd-nav-trigger');

	// show/hide main menu
	/*
	$menu_icon.on('click', function() {
		jQuery('body').toggleClass('reveal-nav');
		jQuery(this).toggleClass('nav-visible');
	});
	*/
	jQuery(document).keyup(function(e) {
		if (e.keyCode == 27) { // escape
			jQuery('body').removeClass('reveal-nav');
			$menu_icon.removeClass('nav-visible');
		}
	});

	// seamless internal links scroll
	jQuery('a[href^="#"]:not(.gallery-heart,.gallery a)').on('click',function(event) {
		event.preventDefault();

		var target = this.hash;
		var $target = $(target);
		/*
		jQuery('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 900, 'easeOut', function () {
			window.location.hash = target;
		});
		*/
	});

	// init Magnific popup
	jQuery('a.popup, .gallery-icon.file a').magnificPopup({
		type: 'image',
		gallery:{enabled:true},
		titleSrc: 'alt',
		cursor: 'mfp-zoom-out-cur'
	});

	// remove title on img hover
	var imgTitle;
	jQuery("img, a").on('hover', function(){
		imgTitle = jQuery(this).attr("title");
		jQuery(this).removeAttr("title");
	}, function(){
		jQuery(this).attr("title", imgTitle);
	});


	//*********** GALLERIES ***********//
	if ( ( jQuery('.gallery').length == 0 ) && ( jQuery('body').hasClass('layout-fullscreen-gallery') ) ) {
		jQuery('#footer .back-to-top, #footer .copyright, .gallery-count').hide();
	}

	function runCoverAnimations() {
		jQuery('.hero-headline, .scrolldown').removeClass('hide');
		jQuery('.hero-headline').find('p').velocity("transition.slideUpBigIn",{
			duration: 600, stagger: 100
		}).find('span').velocity("transition.slideUpIn",{
			duration: 600, stagger: 200
		});
		jQuery('.tl-border').velocity("transition.slideRightIn",{duration: 400,delay:100});
		jQuery('.tr-border').velocity("transition.slideLeftIn",{duration: 400,delay:150});
		jQuery('.bl-border').velocity("transition.slideRightIn",{duration: 400,delay:200});
		jQuery('.br-border').velocity("transition.slideLeftIn",{duration: 400,delay:250});
		jQuery('.gallery-item.activeSlide').find('.animWords').blast({ delimiter: "character" }).velocity("transition.fadeIn", {
			display: null, duration: 1250, stagger: 40, delay: 400
		});
	}

	function animateCaptions() {
		jQuery('.gallery-item.activeSlide').find('.animIn').css({opacity:0}).velocity("transition.slideDownIn", {
			duration: 1000,
			easing: 'easeOut',
			stagger: 120
		});
		setTimeout(function() {
			jQuery('.gallery-item.activeSlide').find('.animInFromTop').css({opacity:0}).velocity("transition.slideDownIn", {
				duration: 300,
				easing: 'easeOut',
				stagger: 80
			});
		}, 200);
	}

	function kenburnsMe(k) {
		k = parseInt(k);
		if (k==1) return;//do not kenburns featured image

		jQuery('.gallery-item[data-index='+parseInt(k-1)+'] img').velocity("stop");
		if (k%2 == 0) { var leftValue = "100px" }
		else var leftValue = "-100px";

		jQuery('.gallery-item[data-index='+k+'] img').css({left:leftValue}).velocity({
			scale: [ 1, 1.2 ],
			left: "0px"
		},{
			duration: 5000
		})
	}

	// preloading function for galleries
	function loadImageInGallery(l) {
		l = parseInt(l);

		// load image that isn't already loaded (.reveal)
		if (( l>1 ) && ( l<=jQuery('.gallery-item').length ) && ( !jQuery('.gallery-item[data-index='+l+']').hasClass('reveal')) ) {
			var loadImageSrc = jQuery('.gallery-item[data-index='+l+'] img').attr('data-src');
			jQuery('.gallery-item[data-index='+l+'] img').attr('src', loadImageSrc);
			jQuery('.gallery-item[data-index='+l+']').addClass('reveal');
		}
	}

	// scroll gallery
	var isMoving = false;

	function scrollFullscreenGallery(j) {
		isMoving = true;
		//find item to scroll to
		j = parseInt(j);
		var slide = jQuery('.gallery-item[data-index='+j+']');

		jQuery('.gallery-item').removeClass('activeSlide');
		slide.addClass('activeSlide');

		if(jQuery('#gallerythumbs, .gallery-caption').hasClass('hide'))
			jQuery('#gallerythumbs, .gallery-caption').removeClass('hide');
		if(jQuery('#logo .dark').hasClass('reveal'))
			jQuery('#logo .dark').removeClass('reveal');

		loadImageInGallery(j);

		jQuery('.gallery-item[data-index='+j+']').imagesLoaded().done( function( instance ) {
			jQuery('body').velocity("scroll", { //animate scroll
				duration: 800,
				easing: 'easeOut',
				offset: slide.offset().top
			});
			var isMac = /mac/i.test(navigator.platform);
			var setTimeoutTime = 800;
			if ( isMac ) setTimeoutTime = 1200;
			setTimeout(function() { //after animation ends, set isMoving to false
				isMoving = false;
			}, setTimeoutTime);

			jQuery('#gallerythumbs li').removeClass('activeSlide');
			jQuery('#gallerythumbs li[data-thumb='+j+']').addClass('activeSlide');
			if ( j > 1 ) jQuery('.hero-headline,.scrolldown').addClass('hide')
			if ( j==1 ) runCoverAnimations();

			//animate image, caption and description
			if ($fullscreen_gallery.find('.gallery').hasClass('kenburns')) {
				kenburnsMe(j);
			}
			if ($fullscreen_gallery.find('.gallery').hasClass('proportional')) {
				var backImage = jQuery('.gallery-item[data-index='+j+'] img').attr('src');
				jQuery('.blurred-background-image').fadeOut(200, function(){
					jQuery(this).css('background-image', 'url(' + backImage + ')');
					jQuery(this).fadeIn(800);
				});
			}
			animateCaptions();
		});
	}

	function scrollToGalleryFooter(){
		isMoving = true;

		jQuery('body').velocity("scroll", { //animate scroll
			duration: 600,
			easing: 'easeOut',
			offset: jQuery('.gallery-footer').offset().top
		});
		setTimeout(function() { //after animation ends, set isMoving to false
			isMoving = false;
		}, 600);

		//animate albums in
		jQuery('.gallery-album').css('opacity', 0).velocity("transition.slideDownIn", { stagger: 60, duration: 600, delay: 200 })
		jQuery('.hero-headline, #gallerythumbs, .gallery-caption, .scrolldown').addClass('hide');
		jQuery('#logo .dark').addClass('reveal');

		slide = parseInt(jQuery('.gallery-item').length+1);
	}

	// fullscreen gallery scrolling
	var $fullscreen_gallery = jQuery('.layout-fullscreen-gallery');//gallery,image,video
	if ( ($fullscreen_gallery.length > 0)  && ( jQuery('body').width() > handheldBreakpoint ) ) {

		if ( $fullscreen_gallery.find('.gallery-item').length >= 1 ) { // if there are more then 1 image

			// on mousewheel scroll gallery by one slide
			var slide = 1;
			jQuery(window).on('mousewheel keydown', function(event, delta) {
				event.stopPropagation();
				console.log('scroll event fired');

				if (isMoving) return;
				if ( (delta < 0) || (event.keyCode == 40) )  { // scroll down
					event.preventDefault();
					slide = parseInt(slide + 1);
				}
				if ( (delta > 0) || (event.keyCode == 38) ) { // scroll up
					event.preventDefault();
					if ( slide == 1) return;
					slide = parseInt(slide - 1);
					if (slide<1) slide = 1;
				}
				// scroll gallery or go to footer if at the end of gallery
				if (slide>jQuery('.gallery-item').length) {
					scrollToGalleryFooter();
				}
				else {
					scrollFullscreenGallery(slide);
				}
			});

			// Touch listeners
			$fullscreen_gallery.swipe({
				swipeUp:function() {
					slide = parseInt(slide + 1);

					if (slide>jQuery('.gallery-item').length) {
						scrollToGalleryFooter();
					}
					else {
						scrollFullscreenGallery(slide);
					}
				},
				swipeDown:function() {
					if ( slide == 1) return;
					slide = parseInt(slide - 1);
					if (slide<1) slide = 1;

					scrollFullscreenGallery(slide);
				}
			});

			//on thumb click, scroll to the slide
			jQuery('#gallerythumbs li').on('click', function() {
				slide = parseInt(jQuery(this).attr('data-thumb'));
				scrollFullscreenGallery(slide);
			});

			//back to top button
			jQuery('.back-to-top a').on('click', function() {
				slide = 1;
				scrollFullscreenGallery(slide);
			});

			//on load, find out the scroll position, load images accordingly
			jQuery(window).on('load',function() {
				var currentScroll = jQuery(this).scrollTop();

				// if at start or at first slide
				if ( currentScroll <= parseInt(jQuery('.gallery-item:first-child').offset().top) ) {
					runCoverAnimations();
				}
				// if at gallery footer
				else if ( currentScroll >= parseInt(jQuery('.gallery-footer').offset().top)) {
					scrollToGalleryFooter();
				}
				// get scrolled slide
				else if ( currentScroll > 0 ){
					var g = 1;
					var previousItemOffset = 0;
					//find out slide number
					jQuery('.gallery-item').each( function() {
						g++;
						loadImageInGallery(g);
						if (( jQuery(this).offset().top < currentScroll ) && ( currentScroll > previousItemOffset )) {
							slide = parseInt(g);
						}
					});
					jQuery('.gallery-item[data-index='+slide+']').addClass('activeSlide');
					jQuery('#gallerythumbs li').removeClass('activeSlide');
					jQuery('#gallerythumbs li[data-thumb='+slide+']').addClass('activeSlide');
					jQuery('.hero-headline, .gallery-caption, .scrolldown').addClass('hide');
					jQuery('.gallery-item[data-index='+slide+'] .gallery-caption').removeClass('hide');
					animateCaptions();
				}

			});
		}//end fullscreen gallery-items scrolling

		// fullscreen self hosted ([video]) video
		var $fullscreen_selfhost_video = jQuery('.layout-fullscreen-gallery .wp-video');
		if ( ($fullscreen_selfhost_video.length > 0)  && ( jQuery('body').width() > mobileBreakpoint ) ) {
			//$fullscreen_selfhost_video.parent().after($fullscreen_selfhost_video);
			runCoverAnimations();
			$fullscreen_selfhost_video.find('video').get(0).play();
		}

		// fullscreen hosted (youtube/vimeo) video
		var $fullscreen_hosted_video = jQuery('.layout-fullscreen-gallery iframe');
		if ( ($fullscreen_hosted_video.length > 0) && ( jQuery('body').width() > mobileBreakpoint ) ) {
			// find out if youtube or vimeo
			if( $fullscreen_hosted_video.attr('src').indexOf("vimeo") >= 0 ) {
				var $fullscreen_hosted_video_ID = $fullscreen_hosted_video.attr('src').substring( $fullscreen_hosted_video.attr('src').lastIndexOf("/") + 1, $fullscreen_hosted_video.attr('src').length);//get the substring after last slash (vimeo ID)  URL format: https://vimeo.com/117382655
			}
			if ( $fullscreen_hosted_video.attr('src').indexOf("youtube") >= 0 ) {
				var $fullscreen_hosted_video_ID = $fullscreen_hosted_video.attr('src').substring( $fullscreen_hosted_video.attr('src').lastIndexOf("=") + 1, $fullscreen_hosted_video.attr('src').length);//get the substring after last = (yotuube ID) URL format: https://www.youtube.com/watch?v=CZhFtd1QZWc
			}
			$.okvideo({ video: $fullscreen_hosted_video_ID }) // [:id] refers to a YouTube or Vimeo ID

		}
	}//end fullscreen

	// handheld fullscreen gallery - no mouse scrolling
	if ( ($fullscreen_gallery.length > 0)  && ( jQuery('body').width() <= handheldBreakpoint ) ) {
		runCoverAnimations();
		//no preloading - show all images
		for (var f = 1; f <= jQuery('.gallery-item').length; f++) {
			loadImageInGallery(f);
		}
		//on scroll, hide hero headline that's fixed in center
		jQuery(window).on('scroll', function() {
			jQuery('.hero-headline, .scrolldown').addClass('hide');
			if ( jQuery(this).scrollTop() == 0) jQuery('.hero-headline').removeClass('hide');
		});
	}


	// masonry gallery
	function animateCaptionsInMasonryGallery(m) {
		m = parseInt(m);
		jQuery('.gallery-item').eq(m).find('.animIn').css({opacity:0}).velocity("transition.slideDownIn", {
			duration: 1000,
			easing: 'easeOut',
			stagger: 120
		});
	}

	var $masonry_gallery = jQuery('.masonry-gallery.gallery');
	if ( ($masonry_gallery.length > 0 ) && ( jQuery(window).width() > mobileBreakpoint ) ) {
		// set masonry layout
		$masonry_gallery.isotope({
			masonry: { columnWidth: $masonry_gallery.find('.gallery-item')[0], gutter: 0 },
			itemSelector: '.gallery-item'
		});

		$masonry_gallery.imagesLoaded().progress( function() {
			$masonry_gallery.isotope('layout');
		});

		//load first 6 images at start
		var i = 1;
		jQuery('.gallery-item').eq(1).addClass('reveal');
		for (i = 1; i <= 6; i++) {
			loadImageInGallery(i);
			animateCaptionsInMasonryGallery(i);
		}
		i = 7;
		jQuery(window).on('scroll', function() {
			if (i < jQuery('.gallery-item').length) {
				var scrolled = jQuery(window).scrollTop() + jQuery(window).height();

				//compare scroll with every third image offset (=row)
				if (parseInt(scrolled) > parseInt(jQuery('.gallery-item').eq(i).offset().top)) {
					//load 3 images (row)
					for (var j = i; j < (i+3); j++) {
						loadImageInGallery(j);
						animateCaptionsInMasonryGallery(j);
					}
					i = i + 3;

					$masonry_gallery.imagesLoaded().progress( function() {
						$masonry_gallery.isotope('layout');
					});
				}
			}
		});
	}
	// handheld masonry gallery
	if ( ($masonry_gallery.length > 0)  && ( jQuery('body').width() <= mobileBreakpoint ) ) {
		//no preloading - show all images
		for (var f = 1; f <= jQuery('.gallery-item').length; f++) {
			loadImageInGallery(f);
		}
	}

	// horizontal gallery
	var $horizontal_gallery = jQuery('.gallery.horizontal-gallery');
	if (( $horizontal_gallery.length > 0 ) && ( jQuery(window).width() > handheldBreakpoint )) {
		// styling adjustments
		jQuery('#footer').hide();
		var h = 1;
		var scrollTo = 0;
		var step = 600;
		var galleryWidth = $horizontal_gallery.width();
		var isMoving = false;

		// reveal first 2
		jQuery('.gallery-item[data-index="1"]').addClass('reveal');
		jQuery('.gallery-item[data-index="2"]').addClass('reveal');

		// make gallery scrollable with mousewheel
		jQuery(window).on('mousewheel keydown', function(event, delta) {

			if (isMoving) return;

			if ( (delta < 0) || (event.keyCode == 39) )  { // scroll down
				event.preventDefault();
				if ( scrollTo < galleryWidth ) {

					scrollTo = scrollTo + step;
					jQuery('.horizontal-gallery-description').velocity({ opacity: 100/scrollTo, duration: 1600 });

					if ( h < jQuery('.gallery-item').length ) {
						// load image if it's in viewport
						if ( jQuery('.gallery-item[data-index="'+h+'"]').offset().left < jQuery(window).width() ) {
							h = h+1;
							loadImageInGallery(h);
						}
					}
					galleryWidth = galleryWidth + jQuery('.gallery-item[data-index="'+h+'"]').width();

				}
			}
			if ( (delta > 0) || (event.keyCode == 37) ) { // scroll up
				event.preventDefault();
				if ( scrollTo > step ) {
					scrollTo = scrollTo - step;
				}
				else {
					scrollTo = 0;
					jQuery('.horizontal-gallery-description').velocity({ opacity: 1, duration: 1600 });
				};
			}
			isMoving = true;

			// move the content and scroll track		
			$horizontal_gallery.stop().animate({scrollLeft: scrollTo+'px' }, 600, 'easeOut');
			setTimeout(function() { //after animation ends, set isMoving to false
				isMoving = false;
			}, 200);
		});

		//horizontal gallery drag with kinetic plugin
		$horizontal_gallery.kinetic({
			x: true,
			y: false,
			stopped: function(){
				jQuery('.horizontal-gallery-description').velocity({ opacity: 100/($horizontal_gallery.scrollLeft()+1), duration: 1600 });

				if ( h < jQuery('.gallery-item').length ) {
					// load image if it's in viewport
					if ( jQuery('.gallery-item[data-index="'+h+'"]').offset().left < jQuery(window).width() ) {
						h = h+1;
						loadImageInGallery(h);
					}
				}

				galleryWidth = galleryWidth + jQuery('.gallery-item[data-index="'+h+'"]').width();
			}
		});
	}

	// handheld horizontal = vertical, no preloading
	// handheld fullscreen gallery - no mouse scrolling
	if ( ($horizontal_gallery.length > 0)  && ( jQuery('body').width() <= handheldBreakpoint ) ) {

		//no preloading - show all images
		jQuery('.gallery-item[data-index="1"]').addClass('reveal');
		for (var f = 1; f <= jQuery('.gallery-item').length; f++) {
			loadImageInGallery(f);
		}

	}


	/***************** BLOG PAGE ******************/
	// blog timeline
	function animateArticle(){
		jQuery('article.activeSlide .entry-featured-image').velocity("transition.slideLeftBigIn", {
			duration: 800, easing: 'easeOut'
		});
		jQuery('article.activeSlide h2').velocity("transition.slideRightBigIn", {
			duration: 800, easing: 'easeOut'
		});
		jQuery('article.activeSlide .entry-meta p').find('span').velocity("transition.slideDownBigIn", {
			display: null, duration: 800, easing: 'easeOut', stagger: 100
		});
		jQuery('article.activeSlide .entry-summary').find('p').velocity("transition.slideRightIn", {
			display: null, duration: 800, easing: 'easeOut', stagger: 100
		});
	}

	function articleScroll() {
		isMoving = true;

		jQuery('article').removeClass('activeSlide');
		articlesArray.eq(parseInt(i-1)).addClass('activeSlide');

		jQuery('body').velocity("scroll", { //animate scroll
			duration: 600,
			easing: 'easeOut',
			offset: jQuery('article.activeSlide').offset().top //eq starts at 0
		});
		animateArticle();
		setTimeout(function() { //after animation ends, set isMoving to false
			isMoving = false;
		}, 600);
	}
	var $blog_timeline = jQuery('.blog-timeline');
	if ( ($blog_timeline.length > 0 ) && ( jQuery(window).width() > handheldBreakpoint ) ) {

		$blog_timeline.find('article').eq(0).addClass('activeSlide');

		$blog_timeline.find('article').each( function( index ) {
			var nr = parseInt(index+1);
			jQuery(this).find('.entry-count .nr').text(nr);
		});

		var isMoving = false;
		var i = 1;
		var articlesArray = $blog_timeline.find('article');
		animateArticle();

		jQuery(window).on('mousewheel keydown', function(event, delta) {
			if (isMoving) return;
			if (!jQuery('.scrolldown').hasClass('hide')) jQuery('.scrolldown').addClass('hide');

			if ( (delta < 0) || (event.keyCode == 40) )  { // scroll down
				event.preventDefault();
				if ( i == articlesArray.length) return;
				i = i + 1;
				if (i > articlesArray.length) i = parseInt(articlesArray.length);
			}
			if ( (delta > 0) || (event.keyCode == 38) ) { // scroll up
				event.preventDefault();
				if ( i == 1) return;
				i = i - 1;
				if ( i <= 1 ) i = 1;
			}

			//scroll to next article
			articleScroll();
		});

		// Touch listeners
		$blog_timeline.swipe({
			swipeUp:function() {
				if ( i == articlesArray.length) return;
				i = i + 1;
				if (i > articlesArray.length) i = parseInt(articlesArray.length);

				articleScroll();
			},
			swipeDown:function() {
				if ( i == 1) return;
				i = i - 1;
				if ( i <= 1 ) i = 1;

				articleScroll();
			}
		});

		jQuery(window).on('load', function() {
			jQuery('body').velocity("scroll", { //animate scroll
				duration: 0,
				easing: 'easeOut',
				offset: 0
			});
		});
		jQuery('.back-to-top a').on('click', function() {
			i = 1;
			jQuery('body').velocity("scroll", { //animate scroll
				duration: 900,
				easing: 'easeOut',
				offset: 0
			});
		});
	}

	/***************** LOADING *******************/
		// load screen
	jQuery('body.loading').height( jQuery(window).height() ) ;
	jQuery( "a:not(#gallerythumbs a, .gallery-social a, .gallery-count a)" ).on( 'click', function( e ) {
		var link = $( this ).attr( 'href' );

		if ( $( this ).attr( 'target' ) != '_blank' && link.indexOf( '.jpg' ) < 0 && link.indexOf( '.jpeg' ) < 0 && link.indexOf( '.png' ) < 0 && link.indexOf( '.gif' ) < 0 && link.indexOf( '#' ) < 0 ) {
			jQuery('body').addClass('loading');
			$( '.loadreveal').removeClass('reveal');
			setTimeout( function() {
				window.location.href=link;
			}, 400 );
			e.preventDefault();
		}
	});


	/* ********* WINDOW LOAD ********** */
	window.onunload = function(){};
	jQuery(window).load(function() {

		// load screen
		jQuery('.loadreveal').addClass('reveal');
		jQuery('#loadscreen').stop().animate( { opacity: 0 }, 200, function() {
			jQuery('body').removeClass('loading');
			jQuery(this).hide();
		});


		/******************* GALLERIES *************************/
		// fullscreen gallery on mobile
		if ( ($fullscreen_gallery.length > 0)  && ( jQuery('body').width() <= mobileBreakpoint ) ) {

			// preloading - show first 2 images
			jQuery('.gallery-item:first-child').addClass('reveal');
			jQuery('.gallery-item:nth-child(2)').addClass('reveal');

			// on scroll, load images
			jQuery(window).scroll(function() {

				// load image that comes to viewport
				var i = jQuery('.gallery-item.reveal').length;//number of images already revealed
				var previousImagesWidths = 0;

				jQuery('.gallery-item.reveal').each( function() {
					previousImagesWidths += jQuery(this).outerWidth(true);
				});
				var scrolled = jQuery(window).scrollTop() + jQuery(window).height();

				if (parseInt(scrolled) > parseInt(previousImagesWidths)) {
					i++;
					loadImageInGallery(i);
				}
			});
		}

		// before-after
		var $before_after = jQuery('.before-after.gallery');
		if ( $before_after.length > 0 ) {
			$before_after.imageReveal({
				barWidth: 4,
				touchBarWidth: 4,
				startPosition: 0.5,
				width: jQuery('.before-after img').width(),
				height:  jQuery('.before-after img').height()
			});
		}

	});


	//easings
	jQuery.easing['jswing'] = jQuery.easing['swing'];

	jQuery.extend( jQuery.easing,
		{
			def: 'easeOutQuad',
			swing: function (x, t, b, c, d) {
				//alert(jQuery.easing.default);
				return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
			},
			easeInQuad: function (x, t, b, c, d) {
				return c*(t/=d)*t + b;
			},
			easeOutQuad: function (x, t, b, c, d) {
				return -c *(t/=d)*(t-2) + b;
			},
			easeInOutQuad: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInCubic: function (x, t, b, c, d) {
				return c*(t/=d)*t*t + b;
			},
			easeOut: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			easeInOutCubic: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			easeInQuart: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOutQuart: function (x, t, b, c, d) {
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			easeInOutQuart: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			easeInQuint: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t*t + b;
			},
			easeOutQuint: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			easeInOutQuint: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			easeInSine: function (x, t, b, c, d) {
				return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
			},
			easeOutSine: function (x, t, b, c, d) {
				return c * Math.sin(t/d * (Math.PI/2)) + b;
			},
			easeInOutSine: function (x, t, b, c, d) {
				return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
			},
			easeInExpo: function (x, t, b, c, d) {
				return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			easeInOutExpo: function (x, t, b, c, d) {
				if (t==0) return b;
				if (t==d) return b+c;
				if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
				return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			easeInCirc: function (x, t, b, c, d) {
				return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
			},
			easeOutCirc: function (x, t, b, c, d) {
				return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
			},
			easeInOutCirc: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
				return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
			},
			easeInElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			easeInOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
			},
			easeInBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			easeOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			easeInBounce: function (x, t, b, c, d) {
				return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
			},
			easeOutBounce: function (x, t, b, c, d) {
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
			},
			easeInOutBounce: function (x, t, b, c, d) {
				if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
				return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
			}
		});


} )( jQuery );