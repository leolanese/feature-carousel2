/*!
 * Based on Feature Carousel, Version 1.3
 * http://www.bkosolutions.com
 *
 * Copyright 2011 Brian Osborne
 * Licensed under GPL version 3
 * brian@bkosborne.com
 *
 * http://www.gnu.org/licenses/gpl.txt
 *
 * Updated by @LeoLaneseltd: Update include: Support jQuery v.2. Swipe event included. ECScript 5 support. Major js structure changes.
 *
 */
var fc = (function (aug) {

    'use strict';

    var a = aug;

    a.fn.featureCarousel = function(f) {

        // div#carousel > 1
        if (this.length > 1) {
            this.each(function() {
                a(this)
                    .featureCarousel(f);
            });
            return this;
        }

        var swipe = function() {
            var maxTime = 500,
                // allow movement if < 1000 ms (1 sec)
                maxDistance = 30,

                // swipe movement of 50 pixels triggers the swipe
                target = $('.carousel-container'),
                startX = 0,
                startTime = 0,
                touch = "ontouchend" in document,
                startEvent = (touch) ? 'touchstart' : 'mousedown',
                moveEvent = (touch) ? 'touchmove' : 'mousemove',
                endEvent = (touch) ? 'touchend' : 'mouseup';

            target.on(startEvent, function(e) {
                // prevent image drag (Firefox)
                e.preventDefault();
                startTime = e.timeStamp;
                startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
            }).on(endEvent, function(e) {
                    startTime = 0;
                    startX = 0;
                }).on(moveEvent, function(e) {
                    e.preventDefault();
                    var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
                        currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
                    // allow if movement < 1 sec
                        currentTime = e.timeStamp;

                    if (startTime !== 0 && currentTime - startTime < maxTime && currentDistance > maxDistance) {
                        if (currentX < startX) {
                            move(true, 1);

                        } else {
                            move(false, 1);
                        }
                        startTime = 0;
                        startX = 0;
                    }
                });

        };

        f = a.extend({}, a.fn.featureCarousel.defaults, f || {});

        var container = {
            currentCenterNum: f.startingFeature,
            containerWidth: 0,
            containerHeight: 0,
            largeFeatureWidth: 0,
            largeFeatureHeight: 0,
            smallFeatureWidth: 0,
            smallFeatureHeight: 0,
            totalFeatureCount: a(this)
                .children("div")
                .length,
            currentlyMoving: false,
            featuresContainer: a(this),
            featuresArray: [],
            containerIDTag: "#" + a(this).attr("id"),
            timeoutVar: null,
            rotationsRemaining: 0,
            itemsToAnimate: 1,
            borderWidth: 0
        };


        var j = function(w) {

            (f.swiper === 1)? swipe() : '';

            if (f.preload === true) {
                var u = $("img");
                var t = 0;
                var v = u.length;
                u.each(function(y, z) {
                    var x = new Image();
                    a(x)
                        .bind("load error", function() {
                            t++;
                            if (t === v) {
                                w();
                            }
                        });
                    x.src = z.src;
                });
            } else {
                w();
            }
        };

        var m = function(t) {
            return container.featuresArray[t - 1];
        };

        var n = function(t) {
            a.each(container.featuresArray, function() {
                if (a(this)
                    .data()
                    .setPosition === t) {
                    return a(this);
                }
            });
        };

        var c = function(t) {
            if ((t - 1) === 0) {
                return container.totalFeatureCount;
            } else {
                return t - 1;
            }
        };

        var i = function(t) {
            if ((t + 1) > container.totalFeatureCount) {
                return 1;
            } else {
                return t + 1;
            }
        };

        var e = function() {
            container.containerWidth = container.featuresContainer.width();
            container.containerHeight = container.featuresContainer.height();
            var t = a(container.containerIDTag)
                .find(".carousel-image:first");
            if (f.largeFeatureWidth > 1) {
                container.largeFeatureWidth = f.largeFeatureWidth;
            } else {
                if (f.largeFeatureWidth > 0 && f.largeFeatureWidth < 1) {
                    container.largeFeatureWidth = t.width() * f.largeFeatureWidth;
                } else {
                    container.largeFeatureWidth = t.outerWidth();
                }
            }
            if (f.largeFeatureHeight > 1) {
                container.largeFeatureHeight = f.largeFeatureHeight;
            } else {
                if (f.largeFeatureHeight > 0 && f.largeFeatureHeight < 1) {
                    container.largeFeatureHeight = t.height() * f.largeFeatureHeight;
                } else {
                    container.largeFeatureHeight = t.outerHeight();
                }
            }
            if (f.smallFeatureWidth > 1) {
                container.smallFeatureWidth = f.smallFeatureWidth;
            } else {
                if (f.smallFeatureWidth > 0 && f.smallFeatureWidth < 1) {
                    container.smallFeatureWidth = t.width() * f.smallFeatureWidth;
                } else {
                    container.smallFeatureWidth = t.outerWidth() / 2;
                }
            }
            if (f.smallFeatureHeight > 1) {
                container.smallFeatureHeight = f.smallFeatureHeight;
            } else {
                if (f.smallFeatureHeight > 0 && f.smallFeatureHeight < 1) {
                    container.smallFeatureHeight = t.height() * f.smallFeatureHeight;
                } else {
                    container.smallFeatureHeight = t.outerHeight() / 2;
                }
            }
        };


        var b = function() {
            if (f.displayCutoff > 0 && f.displayCutoff < container.totalFeatureCount) {
                container.totalFeatureCount = f.displayCutoff;
            }
            $(".carousel-feature")
                .each(function(t) {
                    if (t < container.totalFeatureCount) {
                        container.featuresArray[t] = a(this);
                    }
                });
            if ($(".carousel-feature")
                .first()
                .css("borderLeftWidth") !== "medium") {
                container.borderWidth = parseInt( $(".carousel-feature").first().css("borderLeftWidth"), 10 ) * 2;
            }
            $(".carousel-feature")
                .each(function() {
                    a(this)
                        .css({
                            left: (container.containerWidth / 2) - (container.smallFeatureWidth / 2) - (container.borderWidth / 2),
                            width: container.smallFeatureWidth,
                            height: container.smallFeatureHeight,
                            top: f.smallFeatureOffset + f.topPadding,
                            opacity: 0
                        });
                })
                .find(".carousel-image")
                .css({
                    width: container.smallFeatureWidth
                });
            if (f.captionBelow) {
                $(".carousel-caption")
                    .css("position", "relative");
            }
            if (container.totalFeatureCount < 4) {
                container.itemsToAnimate = container.totalFeatureCount;
            } else {
                container.itemsToAnimate = 4;
            }
            $(".carousel-caption").hide();
        };


        var r = function() {
            a.each(container.featuresArray, function(x) {
                a(this).data("setPosition", x + 1);
            });
            var w = c(f.startingFeature);
            container.currentCenterNum = w;
            var v = m(w);
            v.data("position", 1);
            var u = v.prevAll();
            u.each(function(x) {
                a(this)
                    .data("position", (container.totalFeatureCount - x));
            });
            var t = v.nextAll();
            t.each(function(x) {
                if (a(this)
                    .data("setPosition") !== undefined) {
                    a(this)
                        .data("position", (x + 2));
                }
            });
            if (f.counterStyle === "caption") {
                a.each(container.featuresArray, function() {
                    var y = c(a(this)
                        .data("position"));
                    var x = a("<span></span>");
                    x.addClass("numberTag");
                    x.html("(" + y + " of " + container.totalFeatureCount + ") ");
                    a(this)
                        .find(".carousel-caption p")
                        .prepend(x);
                });
            }
        };

        // h()
        var h = function() {
            if (f.trackerIndividual && $('.tracker-individual-container').length === 0) {
                // tracker-individual-container: tracker-individual-blip
                var z = a("<ul></ul>");
                z.addClass("tracker-individual-container");
                for (var y = 0, n = container.totalFeatureCount; y < n; y++) {
                    var t = y + 1;
                    var x = a("<article>" + t + "</article>");
                    x.addClass("tracker-individual-blip");
                   // x.css("cursor", "pointer");
                    x.attr("id", "tracker-" + (y + 1));
                    var w = a("<li></li>");
                    w.append(x);
                   // w.css("float", "left");
                  //  w.css("list-style-type", "none");
                    z.append(w);
                }
                a(container.containerIDTag)
                     .append(z);
                    z.hide()
                    .show();
            }
            if (f.trackerSummation) {
                var v = a("<div></div>");
                v.addClass("tracker-summation-container");
                var u = a("<span></span>")
                    .addClass("tracker-summation-current")
                    .text(f.startingFeature);
                var B = a("<span></span>")
                    .addClass("tracker-summation-total")
                    .text(container.totalFeatureCount);
                var A = a("<span></span>")
                    .addClass("tracker-summation-middle")
                    .text(" of ");
                v.append(u)
                    .append(A)
                    .append(B);
                a(container.containerIDTag)
                    .append(v);
            }
        };


        var s = function(x, t) {
            if (f.trackerIndividual) {
                var u = $(".tracker-individual-container");
                var v = u.find("#tracker-" + x);
                var w = u.find("#tracker-" + t);
                v.removeClass("tracker-individual-blip-selected");
                w.addClass("tracker-individual-blip-selected");
            }
            if (f.trackerSummation) {
                var u = $(".tracker-summation-container");
                u.find(".tracker-summation-current")
                    .text(t);
            }
        };

        var speed = function(u) {
            clearTimeout(container.timeoutVar);
            if (!u && f.autoPlay !== 0) {
                var t = (Math.abs(f.autoPlay) < f.carouselSpeed) ? f.carouselSpeed : Math.abs(f.autoPlay);
                container.timeoutVar = setTimeout(function() {
                    (f.autoPlay > 0) ? move(true, 1) : move(false, 1);
                }, t);
            }
        };

        var d = function(t) {
            a.each(container.featuresArray, function() {
                var u;
                if (t === false) {
                    u = i(a(this)
                        .data()
                        .position);
                } else {
                    u = c(a(this)
                        .data()
                        .position);
                }
                a(this)
                    .data("position", u);
            });
        };



        var o = function(y, C) {
            var w, t, v, z, u, D, A;
            var B = y.data("position");
            var x;
            if (C === true) {
                x = c(B);
            } else {
                x = i(B);
            }
            if (B === 1) {
                f.leavingCenter(y);
            }
            if (x === 1) {
                w = container.largeFeatureWidth;
                t = container.largeFeatureHeight;
                v = f.topPadding;
                u = y.css("z-index");
                z = (container.containerWidth / 2) - (container.largeFeatureWidth / 2) - (container.borderWidth / 2);
                A = 1;
            } else {
                w = container.smallFeatureWidth;
                t = container.smallFeatureHeight;
                v = f.smallFeatureOffset + f.topPadding;
                u = 1;
                A = 0.4;
                if (x === container.totalFeatureCount) {
                    z = f.sidePadding;
                } else {
                    if (x === 2) {
                        z = container.containerWidth - container.smallFeatureWidth - f.sidePadding - container.borderWidth;
                    } else {
                        z = (container.containerWidth / 2) - (container.smallFeatureWidth / 2) - (container.borderWidth / 2);
                        A = 0;
                    }
                }
            }


            if (B === 1) {
                y.find(".carousel-caption")
                    .hide();
            }


            y.animate({
                width: w,
                height: t,
                top: v,
                left: z,
                opacity: A
            }, f.carouselSpeed, f.animationEasing, function() {
                if (x === 1) {
                    if (f.captionBelow) {
                        y.css("height", "auto");
                    }
                    y.find(".carousel-caption")
                        .fadeTo("fast", 0.45); // rollover opacity
                    f.movedToCenter(y);
                }
                container.rotationsRemaining = container.rotationsRemaining - 1;
                y.css("z-index", u);
                if (f.trackerIndividual || f.trackerSummation) {
                    if (x === 1) {
                        var E = $(".carousel-feature")
                            .index(y) + 1;
                        var F;
                        if (C === false) {
                            F = i(E);
                        } else {
                            F = c(E);
                        }
                        s(F, E);
                    }
                }
                var G = container.rotationsRemaining / container.itemsToAnimate;
                if (G % 1 === 0) {
                    container.currentlyMoving = false;
                    d(C);
                    if (container.rotationsRemaining > 0) {
                        l(C);
                    }
                }
                speed(false);
            })
                .find(".carousel-image")
                .animate({
                    width: w,
                    height: t
                }, f.carouselSpeed, f.animationEasing)
                .end();
        };

        var l = function(w) {
            container.currentlyMoving = true;
            var x, v, t, u;
            if (w === true) {
                x = m(i(container.currentCenterNum));
                v = m(container.currentCenterNum);
                t = m(i(i(container.currentCenterNum)));
                u = m(c(container.currentCenterNum));
                container.currentCenterNum = i(container.currentCenterNum);
            } else {
                x = m(c(container.currentCenterNum));
                v = m(c(c(container.currentCenterNum)));
                t = m(container.currentCenterNum);
                u = m(i(container.currentCenterNum));
                container.currentCenterNum = c(container.currentCenterNum);
            }
            if (w) {
                v.css("z-index", 3);
            } else {
                t.css("z-index", 3);
            }
            x.css("z-index", 4);
            o(v, w);
            o(x, w);
            o(t, w);
            if (container.totalFeatureCount > 3) {
                o(u, w);
            }
        };


        var move = function(v, u) {
            if (container.currentlyMoving === false) {
                var t = u * container.itemsToAnimate;
                container.rotationsRemaining = t;
                l(v);
            }
        };


        var g = function(x, w) {
            var u = 1,
                t = 1,
                v;
            v = x;
            while ((v = c(v)) !== w) {
                u++;
            }
            v = x;
            while ((v = i(v)) !== w) {
                t++;
            }
            return (u < t) ? u * -1 : t;
        };

        // left and right arrows
        a(f.leftButtonTag)
            .on("click", function() {
                move(false, 1);
            });

        a(f.rightButtonTag)
            .on("click", function() {
                move(true, 1);
            });

        // click right and left
        $(".carousel-feature")
            .on('click',function() {
                var t = a(this).data("position");

                if (t === 2) {
                    // click right
                    move(true, 1);
                } else {
                    if (t === container.totalFeatureCount) {
                        // click left
                        move(false, 1);
                    }
                }
            })
            .mouseover(function() {
                if (container.currentlyMoving === false) {
                    var t = a(this)
                        .data("position");
                    if (t === 2 || t === container.totalFeatureCount) {
                        a(this)
                            .css("opacity", 0.5);
                    }
                }
                if (f.pauseOnHover) {
                    speed(true);
                }
                if (f.stopOnHover) {
                    f.autoPlay = 0;
                }
            })
            .mouseout(function() {
                if (container.currentlyMoving === false) {
                    var t = a(this)
                        .data("position");
                    if (t === 2 || t === container.totalFeatureCount) {
                        a(this)
                            .css("opacity", 0.4);
                    }
                }
                if (f.pauseOnHover) {
                    speed(false);
                }
            });


        a("a", container.containerIDTag)
            .on("click", function(u) {
                var t = a(this)
                    .parentsUntil(container.containerIDTag);
                t.each(function() {
                    var v = a(this)
                        .data("position");
                    if (v !== undefined) {
                        if (v !== 1) {
                            if (v === container.totalFeatureCount) {
                                (false, 1);
                            } else {
                                if (v === 2) {
                                    move(true, 1);
                                }
                            }
                            u.preventDefault();
                            return false;
                        } else {
                            f.clickedCenter(a(this));
                        }
                    }
                });
            });

        a(".tracker-individual-blip", container.containerIDTag)
            .on("click", function() {
                var t = a(this)
                    .attr("id")
                    .substring(8);

                var v = $(".carousel-feature")
                    .eq(t - 1)
                    .data("position");
                var u = container.currentCenterNum;
                if (t !== u) {
                    var w = g(1, v);
                    if (w < 0) {
                        move(false, (w * -1));
                    } else {
                        move(true, w);
                    }
                }
            });

        this.initialize = function() {
            j(function() {
                e();
                b();
                r();
                h();
                move(true, 1);
            });
            return this;
        };

        return this.initialize();
    };


    // default values
    a.fn.featureCarousel.defaults = {

        largeFeatureWidth: 0,
        largeFeatureHeight: 0,
        smallFeatureWidth: 0.5,
        smallFeatureHeight: 0.5,

        topPadding: 5,
        sidePadding: 0,

        opacityMultiplier: 0.3,

        smallFeatureOffset: 20,
        startingFeature: 1,
        carouselSpeed: 400,

        autoPlay: 5000,
        pauseOnHover: true,
        stopOnHover: true,

        trackerIndividual: true,
        trackerSummation: false,

        preload: true,
        displayCutoff: 0,
        animationEasing: "swing",
        leftButtonTag: "#carousel-left",
        rightButtonTag: "#carousel-right",

        captionBelow: false,
        movedToCenter: a.noop,
        leavingCenter: a.noop,
        clickedCenter: a.noop,
        swiper: 1

    };

    return a || 0;

})($ || window);

