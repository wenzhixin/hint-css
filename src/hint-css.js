/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.0.0
 * https://github.com/wenzhixin/hint-css
 */

(function($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    }

    function Hint(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }

    Hint.prototype = {
        show: function() {
            $('.hint-css').remove();
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.hint-css-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'hint-css'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('hint-css-' + gravity);
                $tip.find('.hint-css-arrow')[0].className = 'hint-css-arrow hint-css-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },

        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },

        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('data-hint')) != 'string') {
                $e.attr('data-hint', $e.attr('title') || '').removeAttr('title');
            }
        },

        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'data-hint' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },

        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="hint-css"></div>').html('<div class="hint-css-arrow"></div><div class="hint-css-inner"></div>');
                this.$tip.data('hint-pointee', this.$element[0]);
            }
            return this.$tip;
        }
    };

    // global listen
    $.hint = function () {
        var get = function (ele, options) {
            var hint = ele.data('hint-css');
            if (!hint) {
                hint = new Hint(ele, $.extend({}, $.hint.defaults, options));
                ele.data('hint-css', hint);
            }
            return hint;
        };

        $(document).on('mouseenter', '[data-hint]', function (e) {
            var $e = $(e.currentTarget);
            var hint = get($e, {gravity: $e.hasClass('hint--top') ? 's' : 'n'});
            hint.hoverState = 'in';
            hint.show();
        });
        $(document).on('mouseleave', '[data-hint]', function (e) {
            var $e = $(e.currentTarget);
            var hint = get($e, {gravity: $e.hasClass('hint--top') ? 's' : 'n'});
            hint.hoverState = 'out';
            hint.hide();
        });
    };

    $.hint.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

})(jQuery);

$(function () {
    $.hint();
});
