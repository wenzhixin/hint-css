/**
 * version: 1.2.0
 * https://github.com/wenzhixin/hint-css
 */

(function ($) {

  function maybeCall(thing, ctx) {
    return (typeof thing == 'function') ? (thing.call(ctx)) : thing
  }

  function Hint(element, options) {
    this.$element = $(element)
    this.options = options
    this.enabled = true
    this.fixTitle()
  }

  Hint.prototype = {
    show: function () {
      $('.hint-css').remove()
      var title = this.getTitle()
      if (title && this.enabled) {
        var $tip = this.tip()

        $tip.find('.hint-css-inner')[this.options.html ? 'html' : 'text'](title)
          [this.options.html ? 'addClass' : 'removeClass']('hint-css-inner-html')
          .css({
            'text-align': this.options.textAlign,
            'max-width': this.options.maxWidth ? this.options.maxWidth : ''
          })

        $tip[0].className = 'hint-css' // reset classname in case of dynamic gravity
        $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body)

        if (this.options.className) {
          $tip.addClass(maybeCall(this.options.className, this.$element[0]))
        }

        if (this.options.fade) {
          $tip.stop().css({
            opacity: 0,
            display: 'block',
            visibility: 'visible'
          }).animate({opacity: this.options.opacity})
        } else {
          $tip.css({visibility: 'visible', opacity: this.options.opacity})
        }
        this.calculatePosition()
        this._checkStatus()
      }
    },

    update: function (title) {
      var $tip = this.tip()
      if ($tip && title && this.enabled) {

        $tip.find('.hint-css-inner')[this.options.html ? 'html' : 'text'](title)
      }
    },

    calculatePosition: function () {
      var $tip = this.tip()
      var pos = $.extend({}, this.$element.offset(), {
        width: this.$element[0].offsetWidth,
        height: this.$element[0].offsetHeight
      })

      // reset height every time
      $tip.css('height', 'auto')

      var actualWidth = $tip[0].offsetWidth,
        actualHeight = $tip[0].offsetHeight,
        gravity = maybeCall(this.options.gravity, this.$element[0])

      var tp
      switch (gravity.charAt(0)) {
        case 'n':
          tp = {
            top: pos.top + pos.height + this.options.offset,
            left: pos.left + pos.width / 2 - actualWidth / 2
          }
          break
        case 's':
          tp = {
            top: pos.top - actualHeight - this.options.offset,
            left: pos.left + pos.width / 2 - actualWidth / 2
          }
          break
        case 'e':
          tp = {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth - this.options.offset
          }
          break
        case 'w':
          tp = {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width + this.options.offset
          }
          break
      }

      if (gravity.length == 2) {
        if (gravity.charAt(1) == 'w') {
          tp.left = pos.left + pos.width / 2 - 15
        } else {
          tp.left = pos.left + pos.width / 2 - actualWidth + 15
        }
      }

      if (
        gravity === 'n' &&
        tp.top + actualHeight > $(window).height()
      ) {
        if (pos.top - actualHeight - this.options.offset > 0) {
          gravity = 's'
          tp.top = pos.top - actualHeight - this.options.offset
        } else {
          tp.height = $(window).height() - tp.top - this.options.offset - 10
        }
      }

      if (tp.left < 0 || tp.top < 0) {
        tp.left = -1000
        tp.top = -1000
      }

      $tip.css(tp)
      $tip.addClass('hint-css-' + gravity)
      $tip.find('.hint-css-arrow')[0].className = 'hint-css-arrow hint-css-arrow-' + gravity.charAt(0)
    },

    hide: function () {
      if (this.options.fade) {
        this.tip().stop().fadeOut(function () {
          $(this).remove()
        })
      } else {
        this.tip().remove()
      }
      window.clearInterval(this._checkingInterval)
    },

    fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') && !$e.attr('data-hint')) {
        $e.attr('data-hint', $e.attr('title') || '').removeAttr('title')
      }
    },

    getTitle: function () {
      var title, $e = this.$element, o = this.options
      this.fixTitle()
      if (typeof o.title == 'string') {
        title = $e.attr(o.title == 'title' ? 'data-hint' : o.title)
      } else if (typeof o.title == 'function') {
        title = o.title.call($e[0])
      }
      title = ('' + title).replace(/(^\s*|\s*$)/, "")
      return title || o.fallback
    },

    tip: function () {
      if (!this.$tip) {
        this.$tip = $('<div class="hint-css"></div>')
          .html('<div class="hint-css-arrow"></div><div class="hint-css-inner"></div>')
        this.$tip.data('hint-pointee', this.$element[0])
      }
      return this.$tip
    },

    _checkStatus: function () {
      if (this._checkingInterval) {
        window.clearInterval(this._checkingInterval)
      }
      var that = this
      this._checkingInterval = window.setInterval(function () {
      if (!that.$element || that.$element.is(':hidden')) {
        that.hide()
      }
      }, 300)
    }
  }

  // global listen
  $.hint = function () {
    var hint
    var timer = 0
    var leaveTimer = 0
    var inHint = false
    var get = function (ele, options) {
      var hint = ele.data('hint-css')
      var keyAndValue = ele.data('hint-object')
      options.html = !!ele.data('hint-html')
      options.textAlign = ele.data('hint-align') || $.hint.defaults.textAlign
      options.maxWidth = ele.data('hint-max-width') || 0
      if (!hint) {
        if (keyAndValue && typeof keyAndValue === 'object') {
          hint = new Hint(ele, $.extend({}, $.hint.defaults, options, {
            className: 'hint-object',
            html: true,
            title: function () {
              try {
                keyAndValue = JSON.parse(ele.attr('data-hint-object'))
              } catch (e) {
                // to nothing
              }
              return $('<div>').append($.dialog.getKeyAndValTable(keyAndValue, 2)).html()
            }
          }))
        } else {
          hint = new Hint(ele, $.extend({}, $.hint.defaults, options))
        }
        ele.data('hint-css', hint)
      }
      return hint
    }
    var getGravity = function ($e) {
      if ($e.data('gravity')) {
        return $e.data('gravity')
      }
      if ($e.hasClass('hint--top')) {
        return 's'
      } else if ($e.hasClass('hint--bottom')) {
        return 'n'
      } else if ($e.hasClass('hint--left')) {
        return 'e'
      } else if ($e.hasClass('hint--right')) {
        return 'w'
      }
      return 'n'
    }
    var hideHint = function (e) {
      inHint = false
      clearTimeout(timer)
      if (hint) {
        hint.hoverState = 'out'
        hint.hide()
      }
    }

    $(document).on('mouseenter', '[data-hint]', function (e) {
      if ($(this).data('hint-type') === 'ignore') {
        return
      }
      if (
        $(this).attr('hint-auto') !== undefined &&
        $(this)[0].offsetWidth >= $(this)[0].scrollWidth
      ) {
        return
      }
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      clearTimeout(leaveTimer)
      hideHint()
      timer = setTimeout(function () {
        var $e = $(e.currentTarget)
        hint = get($e, {gravity: getGravity($e)})
        hint.hoverState = 'in'
        hint.show()
      }, $.hint.defaults.delayIn)
    })
    $(document).on('mouseleave', '[data-hint]', function (e) {
      if ($(this).data('hint-type') === 'ignore') {
        return
      }
      leaveTimer = setTimeout(function () {
        if (!inHint) {
          hideHint()
        }
      }, 100)
    })
    $(document).on('click', '[data-hint]', function (e) {
      clearTimeout(timer)
    })
    $(document).on('mouseenter', '.hint-css', function (e) {
      inHint = true
    })
    $(document).on('mouseleave', '.hint-css', function (e) {
      hideHint()
    })
  }

  $.fn.hint = function (method, params) {
    var $e = this
    var hint = $('body').data('hint-css')
    $e.data('hint-type', 'ignore')
    switch (method) {
    case 'show':
      hint = new Hint($e, $.extend({}, $.hint.defaults, {
        gravity: 'n',
        className: 'hint-object',
        html: true,
        title: function () {
          return $('<div>').append($.dialog.getKeyAndValTable(params, 2)).html()
        }
      }))
      hint.hoverState = 'in'
      hint.show()
      $('body').data('hint-css', hint)
      break
    case 'update':
      hint.update($('<div>').append($.dialog.getKeyAndValTable(params, 2)).html())
      break
    case 'hide':
      hint.hoverState = 'out'
      hint.hide()
      break
    }
  }

  $.hint.defaults = {
    className: null,
    delayIn: 800,
    fade: false,
    fallback: '',
    gravity: 'n',
    html: false, //data-hint-html="true|false"
    live: false,
    offset: 0,
    opacity: 0.8,
    title: 'title',
    textAlign: 'left',  //data-hint-align="left"
    maxWidth: 0  // data-hint-max-width
  }

})(jQuery)

$(function () {
  $.hint()
})
