/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

    'use strict';

    var bodyEl = document.body,
        support = { transitions: Modernizr.csstransitions },
    // transition end event name
        transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
        transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
        onEndTransition = function( el, callback ) {
            var onEndCallbackFn = function( ev ) {
                if( support.transitions ) {
                    if( ev.target != this ) return;
                    this.removeEventListener( transEndEventName, onEndCallbackFn );
                }
                if( callback && typeof callback === 'function' ) { callback.call(this); }
            };
            if( support.transitions ) {
                el.addEventListener( transEndEventName, onEndCallbackFn );
            }
            else {
                onEndCallbackFn();
            }
        },
    // window sizes
        win = {width: window.innerWidth, height: window.innerHeight},
    // some helper vars to disallow scrolling
        lockScroll = false, xscroll, yscroll,
        scrollContainer = document.querySelector('#content'),
    // the main slider and its items
        sliderEl = document.querySelector('.gallery'),
        items = [].slice.call(sliderEl.querySelectorAll('.gallery-item')),
    // the main content element
        contentEl = document.querySelector('.zoomer-content'),
    // close content control
        closeContentCtrl = contentEl.querySelector('button.button--close'),
    // index of current item
        current = 0,
    // check if an item is "open"
        isOpen = false,
        isFirefox = typeof InstallTrigger !== 'undefined',
    // scale body when zooming into the items, if not Firefox (the performance in Firefox is not very good)
        bodyScale = isFirefox ? false : 3;


    function throttle(fn, delay) {
        var allowSample = true;

        return function(e) {
            if (allowSample) {
                allowSample = false;
                setTimeout(function() { allowSample = true; }, delay);
                fn(e);
            }
        };
    }

    function init() {
        initEvents();
    }

    // event binding
    function initEvents() {
        // open items
        jQuery(".gallery-item").on('click', function() {
            current = jQuery(this).data("index")-1;
            jQuery(this).find(".zoomer").addClass('zoomer--active');
            jQuery(this).css("z-index",9999);
            var postID = jQuery(this).find('header').data("postid");
            var postBG = jQuery(this).find('header').data("bgcolor");
            var $container = jQuery("#content-1");
            if(postBG){
                $container.css("background",postBG)
            } else {
                $container.css("background","")
            }

            var currentItem = this;
            jQuery.get("/wp-admin/admin-ajax.php", {action: 'load-single-post', pID: postID}, function (content) {
                $container.html(content);
                jQuery(currentItem).find(".gallery-caption").hide();
                openItem(currentItem);
            });


        });

        // close content
        closeContentCtrl.addEventListener('click', closeContent);

        // window resize
        window.addEventListener('resize', throttle(function(ev) {
            // reset window sizes
            win = {width: window.innerWidth, height: window.innerHeight};

            // reset transforms for the items (slider items)
            items.forEach(function(item, pos) {
                if( pos === current ) return;
                var el = item.querySelector('.slide__mover');
                dynamics.css(el, { translateX: el.offsetWidth });
            });
        }, 10));

        // keyboard navigation events

    }

    // opens one item
    function openItem(item) {
        if( isOpen ) return;
        isOpen = true;
        jQuery('div#menu-burger').hide();
        // the element that will be transformed
        var zoomer = item.querySelector('.zoomer');
        // slide screen preview


        //classie.add(zoomer, 'zoomer--active');
        // disallow scroll
        scrollContainer.addEventListener('scroll', noscroll);

            applyTransforms(zoomer);
            // also scale the body so it looks the camera moves to the item.
            if( bodyScale ) {
                dynamics.animate(bodyEl, { scale: bodyScale }, { type: dynamics.easeInOut, duration: 500 });
            }
     //   }, 275);


        // after the transition is finished:
        onEndTransition(zoomer, function() {
            // reset body transform
            if( bodyScale ) {
                dynamics.stop(bodyEl);
                dynamics.css(bodyEl, { scale: 1 });
                bodyEl.style.WebkitTransform = 'none';
                bodyEl.style.transform = 'none';
            }
            // no scrolling
            classie.add(bodyEl, 'noscroll');
            classie.add(contentEl, 'content--open');
            var contentItem = document.getElementById("content-1")
            classie.add(contentItem, 'content__item--current');
            classie.add(contentItem, 'content__item--reset');

            classie.add(zoomer, 'zoomer--notrans');
            zoomer.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';

           zoomer.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

        });
    }

    // closes the item/content
    function closeContent() {
        var contentItem = contentEl.querySelector('.content__item--current'),
            zoomer = items[current].querySelector('.zoomer');

        classie.remove(contentEl, 'content--open');
        classie.remove(contentItem, 'content__item--current');
        classie.remove(bodyEl, 'noscroll');

        if( bodyScale ) {
            // reset fix for safari (allowing fixed children to keep position)
            bodyEl.style.WebkitTransform = '';
            bodyEl.style.transform = '';
        }

        /* fix for safari flickering */
        var nobodyscale = true;
        jQuery(zoomer).parent().find(".gallery-caption").show();

        applyTransforms(zoomer, nobodyscale);
        /* fix for safari flickering */

        // wait for the inner content to finish the transition
        onEndTransition(contentItem, function(ev) {
            classie.remove(this, 'content__item--reset');

            // reset scrolling permission
            lockScroll = false;
            scrollContainer.removeEventListener('scroll', noscroll);

            /* fix for safari flickering */
            zoomer.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
            zoomer.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';
            /* fix for safari flickering */

            // scale up - behind the scenes - the item again (without transition)
            applyTransforms(zoomer);

            // animate/scale down the item
            setTimeout(function() {
                classie.remove(zoomer, 'zoomer--notrans');
                classie.remove(zoomer, 'zoomer--active');
                zoomer.style.WebkitTransform = '';
                zoomer.style.transform = '';

            }, 25);
            jQuery('div#menu-burger').show();
            if( bodyScale ) {
                dynamics.css(bodyEl, { scale: bodyScale });
                dynamics.animate(bodyEl, { scale: 1 }, {
                    type: dynamics.easeInOut,
                    duration: 500
                });
                bodyEl.style.WebkitTransform = 'none';
                bodyEl.style.height = 'auto';
                bodyEl.height = 100;
                setTimeout(function() {
                    jQuery(zoomer).parent().css("z-index","");
                }, 425);

                onEndTransition(bodyEl, function() {

                    dynamics.stop(bodyEl);
                    dynamics.css(bodyEl, { scale: 1 });

                    // fix for safari (allowing fixed children to keep position)
                    bodyEl.style.WebkitTransform = 'none';
                    bodyEl.style.transform = 'none';


                });
            }

            isOpen = false;
        });
    }

    // applies the necessary transform value to scale the item up
    function applyTransforms(el, nobodyscale) {
        // zoomer area and scale value
        var zoomerArea = el.querySelector('.zoomer__area'),
            zoomerAreaSize = {width: zoomerArea.offsetWidth, height: zoomerArea.offsetHeight},
            zoomerOffset = zoomerArea.getBoundingClientRect(),
            scaleVal = zoomerAreaSize.width/zoomerAreaSize.height < win.width/win.height ? win.width/zoomerAreaSize.width : win.height/zoomerAreaSize.height;

        if( bodyScale && !nobodyscale ) {
            scaleVal /= bodyScale;
        }
        // apply transform
        el.style.WebkitTransform = 'translate3d(' + Number(win.width/2 - (zoomerOffset.left+zoomerAreaSize.width/2)) + 'px,' + Number(win.height/2 - (zoomerOffset.top+zoomerAreaSize.height/2)) + 'px,0) scale3d(' + scaleVal + ',' + scaleVal + ',1)';
        el.style.transform = 'translate3d(' + Number(win.width/2 - (zoomerOffset.left+zoomerAreaSize.width/2)) + 'px,' + Number(win.height/2 - (zoomerOffset.top+zoomerAreaSize.height/2)) + 'px,0) scale3d(' + scaleVal + ',' + scaleVal + ',1)';
    }

    // disallow scrolling (on the scrollContainer)
    function noscroll() {
        if(!lockScroll) {
            lockScroll = true;
            xscroll = scrollContainer.scrollLeft;
            yscroll = scrollContainer.scrollTop;
        }
        scrollContainer.scrollTop = yscroll;
        scrollContainer.scrollLeft = xscroll;
    }

    init();

})(window);