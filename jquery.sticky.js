/**
  Simulation of top/left side fixed column using position:sticky and CSS transform as fallback

  @author "Marcos Gallardo" <socramg@gmail.com>
  @author "Facundo Cabrera" <cabrerafacundo@gmail.com>
**/

(function($) {
  'use strict';


  /* STICKY CLASS DEFINITION
   * ========================= */

  /**
  @class Sticky
  @constructor
  **/
  var Sticky = function(element) {
    this._init(element);
  };

  /**
   * Validates if sticky polyfill is required
   *
   * @property Sticky.useSticky
   **/
  Sticky.useSticky = (function() {
    var ua = navigator.userAgent.match(/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i),
      stickyTest = $('html').hasClass('csspositionsticky');

    // if i'm running iOS 6 - use the fallback
    if (stickyTest && ua && (parseInt(ua[2], 10) < 7)) return false;

    return stickyTest;
  }());

  Sticky.prototype = {
    /**
     * Reference to contructor.
     *
     * @property {Object}
     **/
    constructor: Sticky,

    /**
     * Initialize componente
     *
     * @method init
     * @private
     **/
    _init: function($el) {
      var top,
        left;

      if (!Sticky.useSticky) {
        this.$el = $el;

        // Force position - iOS 6 bug
        $el.css('position', 'static');

        top = $el.css('top');
        left = $el.css('left');
        this.initialTop = top === 'auto' ? false : parseInt(top);
        this.initialLeft = left === 'auto' ? false : parseInt(left);

        // cache scrollable
        this.$scrollable = this.$el.closest(this.$el.data('target'));

        this._translate(0, 0);
        this._listenScroll();
      }
    },

    /**
     * Updates element position
     *
     * @param x {Integer} left position
     * @param y {Integer} top position
     * @method _translate
     * @private
     **/
    _translate: function(x, y) {
      var top = (this.initialTop === false)? 0 : this.initialTop + y,
        left = (this.initialLeft === false)? 0 : this.initialLeft + x;

      this.$el.css({
        transform: 'translate(' + left + 'px, ' + top + 'px)'
      });

      return this;
    },

    /**
     * Ckecks current scroll position to update element position
     *
     * @method _listenScroll
     * @private
     **/
    _listenScroll: function() {
      var self = this,
        currentTop = 0,
        previousTop = 0,
        currentLeft = 0,
        previousLeft = 0,
        rAF = function() {
          self.rAFIndex = requestAnimationFrame(rAF);
          currentTop = self.$scrollable.scrollTop();
          currentLeft = self.$scrollable.scrollLeft();

          if ((self.initialTop !== false && currentTop !== previousTop) || (self.initialLeft !== false && currentLeft !== previousLeft)) {
            self._translate(currentLeft, currentTop);
            previousTop = currentTop;
            previousLeft = currentLeft;
          }
        };

      // start animation frame
      rAF();
    },

    /**
     * Plugin cleanup
     *
     * @method destroy
     * @public
     **/
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


  /* STICKY PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.sticky;

  /**
   * Jquery plugin - $.fn.sticky
   *
   * @params {String} method
   * @class
   **/
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


  /* STICKY NO CONFLICT
   * ==================== */

  $.fn.sticky.noConflict = function() {
    $.fn.sticky = old;
    return this;
  };

}(jQuery));
