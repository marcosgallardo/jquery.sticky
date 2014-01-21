(function($) {
  'use strict';

  var Sticky = function(element) {
    this.init(element);
  };

  Sticky.useSticky = (function() {
    var ua = navigator.userAgent.match(/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i),
      stickyTest = $('html').hasClass('csspositionsticky');

    // if i'm running iOS 6 - use the fallback
    if (stickyTest && ua && (parseInt(ua[2], 10) < 7)) return false;

    return stickyTest;
  }());

  Sticky.prototype = {
    constructor: Sticky,

    init: function($el) {
      if (!Sticky.useSticky) {
        this.$el = $el;

        // Force position - iOS 6 bug
        $el.css('position', 'static');
        this.initialLeft = parseInt($el.css('left'), 10) || 0;
        this.initialTop = parseInt($el.css('top'), 10) || 0;

        // cache scrollable
        this.$scrollable = this.$el.closest(this.$el.data('target'));

        this.translate();
        this.listenScroll();
      }
    },

    translate: function(x, y) {
      this.$el.css({
        transform: 'translate(' + (this.initialLeft + (x || 0)) + 'px, ' + (this.initialTop + (y || 0)) + 'px)'
      });

      return this;
    },

    listenScroll: function() {
      var self = this,
        currentTop = 0,
        previousTop = 0,
        currentLeft = 0,
        previousLeft = 0,
        rAF = function() {
          self.rAFIndex = requestAnimationFrame(rAF);
          currentTop = self.$scrollable.scrollTop();
          currentLeft = self.$scrollable.scrollLeft();

          if (currentTop !== previousTop || currentLeft !== previousLeft) {
            self.translate(currentLeft, currentTop);
            previousTop = currentTop;
            previousLeft = currentLeft;
          }
        };

      // start animation frame
      rAF();
    },

    destroy: function() {
      if (!Sticky.useSticky) {

        cancelAnimationFrame(this.rAFIndex);

        this.$el.data('sticky', null);
        this.$el.css({
          transform: 'none'
        });
      }
    }

  };

  var old = $.fn.sticky;

  $.fn.sticky = function(option) {
    return this.each(function() {
      var $this = $(this),
        data = $this.data('sticky'),
        options = typeof option == 'object' && option;

      if (!data) {
        $this.data('sticky', (data = new Sticky($this, options)));
      }

      if (typeof option == 'string') {
        data[option]();
      }
    });
  };

  $.fn.sticky.Constructor = Sticky;

  $.fn.sticky.defaults = {};

  $.fn.sticky.noConflict = function() {
    $.fn.sticky = old;
    return this;
  };

}(this.jQuery));