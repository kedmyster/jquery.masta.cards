/**
 * "cards" jQuery plugin.
 *
 * Here is a description of what my plugin does and why.
 *
 * Include examples, and list the various options that can be passed in.
 *
 * @author Lior Kedmi <lior@masta.co.il>
 */
(function(window, undefined) {

  "use strict";

  var $ = window.jQuery;
  var console = window.console;

  var defaults = {
    cardSelector: '.card',
    cardLastSelector: '.card-last',
    animation_duration: 750,
    animation_timing: "ease"
  };

  /**
   * Constructor.
   *
   * @param {Object} element DOM Element plugin is bound against
   * @param {Object} options Options
   */
  function cards(element, options) {

    // Cache (jQuery wrapped) reference to element this plugin binds against.
    this.$element = $(element);

    // Override defaults with passed options.
    this.options = $.extend({}, defaults, options);

    // Common scenario
    this.setup();
  }

  // Override prototype object with methods.
  // Use extend to preserve constructor.
  cards.prototype = $.extend(cards.prototype, {

    /**
     * Called from constructor.
     * Prepares the cards.
     */
    setup: function() {

      var self = this;

      this.$cards = this.$element.find(this.options.cardSelector);

      // Binds all elements to their related events
      this.bindEvents();

      // Set default state
      this.init();

    },

    bindEvents: function() {

      var self = this;

      // resize
      self.resize();
      $(window).resize(function() {
        self.resize();
      });

      // move
      $(document).on('keydown', function(e) {
        self.moveKeyboard(e);
      });
      $(document).on('mousewheel DOMMouseScroll wheel MozMousePixelScroll', function(e) {
        self.moveMouse(e);
      });
      var touchLastY;
      $(document).on('touchmove', function(e) {
        self.moveTouch(e);
      });
    },

    init: function() {
      // Set the first card as the default card
      this.$active = $(this.$cards[0]).addClass("active");

      // Position each of the cards
      for (var i=0; i<this.$cards.length; i++) {
        var $card = $(this.$cards[i]);
        $card.css({
          'z-index': $card.index()+1
        })

        if ($card.hasClass("active")) {
          $card.css({
            top: 0
          });
        } else {
          $card.css({
            top: $(window).height()+"px"
          });
        }
      }
    },

    resize: function() {

      var self = this;

      var w, h, i;
      w = $(window).width();
      h = $(window).height();

      for (i=0; i<this.$cards.length; i++) {
        var $card = $(this.$cards[i]);

        if (!$card.hasClass(this.options.lastCardClass)) {
          $card.css({
            width: w+"px",
            height: h+"px"
          });
        } else {
          $card.css({
            width: w+"px",
            height: "auto",
            "max-height": h+'px'
          });
        }
      }
    },

    moveKeyboard: function(e) {
      // If move is already being animated, cancel
      if (this.$cards.hasClass("velocity-animating")) {
        return;
      }

      var self = this;
      var code = e.keyCode || e.which;

      switch (code) {
        case 38: { // up
          self.moveUp();

          // prevent the default action (scroll / move caret)
          e.preventDefault();

          break;
        }
        case 40: { // down
          self.moveDown();

          // prevent the default action (scroll / move caret)
          e.preventDefault();

          break;
        }
        default: {
          return;
        }
      }
    },

    moveMouse: function(e) {
      // If move is already being animated, cancel
      if (this.$cards.hasClass("velocity-animating")) {
        return;
      }

      var self = this;

      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) { // up
        self.moveUp();

        // prevent the default action (scroll / move caret)
        e.preventDefault();
        return;
      } else { // down
        self.moveDown();

        // prevent the default action (scroll / move caret)
        e.preventDefault();
        return;
      }
    },

    moveTouch: function(e) {
      // If move is already being animated, cancel
      if (this.$cards.hasClass("velocity-animating")) {
        return;
      }

      var self = this;

      var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

      if (Math.abs(currentY-lastY) < 10) {
        return;
      }

      if (currentY <= lastY) { // up
        self.moveUp();

        // prevent the default action (scroll / move caret)
        e.preventDefault();
        return;
      } else { // down
        self.moveDown();

        // prevent the default action (scroll / move caret)
        e.preventDefault();
        return;
      }

      touchLastY = currentY;
    },

    moveUp: function() {
      var self = this;
      var currentIndex = $(this.$active).index();

      // Make sure we have a previus card
      if (currentIndex === 0) {
        return;
      }

      var $card = $(this.$cards[currentIndex]);
      var $card_target = $(this.$cards[currentIndex-1]);

      if (!$card.hasClass(this.options.lastCardClass)) {
        $card.velocity({
          top: $(window).height()+"px"
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing,
          begin: function(elements) {
            if (self.options.onBeforeSlide) {
              self.options.onBeforeSlide(currentIndex, currentIndex-1);
            }
          },
          complete: function(elements) {
            self.$cards.removeClass("active");
            self.$active = $card.prev().addClass("active");

            if (self.options.onAfterSlide) {
              self.options.onAfterSlide(currentIndex, currentIndex-1);
            }
          }
        });
      } else {
        var h = $card.height();

        $card_target.velocity({
          top: 0
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing
        });

        $card.velocity({
          top: $(window).height()+"px"
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing,
          begin: function(elements) {
            if (self.options.onBeforeSlide) {
              self.options.onBeforeSlide(currentIndex, currentIndex-1);
            }
          },
          complete: function(elements) {
            self.$cards.removeClass("active");
            self.$active = $card.prev().addClass("active");

            if (self.options.onAfterSlide) {
              self.options.onAfterSlide(currentIndex, currentIndex-1);
            }
          }
        });
      }
    },

    moveDown: function(index) {
      var self = this;
      var currentIndex = $(this.$active).index();

      // Make sure we have a previus card
      if (currentIndex === this.$cards.length-1) {
        return;
      }

      var $card = $(this.$cards[currentIndex+1]);
      var $card_source = $(this.$cards[currentIndex]);

      if (!$card.hasClass(this.options.lastCardClass)) {
        $card.velocity({
          top: 0
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing,
          begin: function(elements) {
            if (self.options.onBeforeSlide) {
              self.options.onBeforeSlide(currentIndex, currentIndex+1);
            }
          },
          complete: function(elements) {
            self.$cards.removeClass("active");
            self.$active = $card.addClass("active");

            if (self.options.onAfterSlide) {
              self.options.onAfterSlide(currentIndex, currentIndex+1);
            }
          }
        });
      } else {
        var h = $card.height();

        $card_source.velocity({
          top: "-"+h+"px"
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing
        });

        $card.velocity({
          top: ($(window).height() - h)+"px"
        }, {
          duration: this.options.animation_duration,
          offset: 0,
          easing: this.options.animation_timing,
          begin: function(elements) {
            if (self.options.onBeforeSlide) {
              self.options.onBeforeSlide(currentIndex, currentIndex+1);
            }
          },
          complete: function(elements) {
            self.$cards.removeClass("active");
            self.$active = $card.addClass("active");

            if (self.options.onAfterSlide) {
              self.options.onAfterSlide(currentIndex, currentIndex+1);
            }
          }
        });
      }
    }

  });

  // Create function for plugin in jQuery "fn" namespace.
  $.fn.cards = function(options) {
    // For chainability, return jQuery object.
    return this.each(function() {
      $(this).data('cards', new cards(this, options));
    });
  };

})(window);
