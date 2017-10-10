'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*   --------------------------------------------------
*   CT Activity Loader Web Component V1
*   --------------------------------------------------
*
*   Recoded for version 1 of the web components spec.
*
*   This will overlay a non-interactive spinner
*   animation over the contents of the current app
*   page. Useful for blocking user actions when
*   performing a background operation.
*
*   --------------------------------------------------
*/

(function () {

    /**
     * CTActivityLoader
     */
    var CTActivityLoader = function (_HTMLElement) {
        _inherits(CTActivityLoader, _HTMLElement);

        // Default Component methods

        function CTActivityLoader(self) {
            var _this, _ret;

            _classCallCheck(this, CTActivityLoader);

            self = (_this = _possibleConstructorReturn(this, (CTActivityLoader.__proto__ || Object.getPrototypeOf(CTActivityLoader)).call(this, self)), _this);
            _this.initialRender();
            return _ret = self, _possibleConstructorReturn(_this, _ret);
        }

        _createClass(CTActivityLoader, [{
            key: 'connectedCallback',
            value: function connectedCallback() {}

            // Custom Component Methods (for this component only)

            // Handles the initial rendering of the component

        }, {
            key: 'initialRender',
            value: function initialRender() {
                this.className = 'hidden';
                var icon = document.createElement('i');
                this.appendChild(icon);

                var text = document.createElement('p');
                this.appendChild(text);
            }
        }, {
            key: 'show',
            value: function show() {
                var loader = document.getElementsByTagName('activity-loader')[0];
                loader.className = '';
            }
        }, {
            key: 'hide',
            value: function hide() {
                var loader = document.getElementsByTagName('activity-loader')[0];
                loader.className = 'hidden';
            }
        }, {
            key: 'updateText',
            value: function updateText(text) {
                var loader = document.querySelector('activity-loader > p');
                loader.innerText = text;
            }
        }]);

        return CTActivityLoader;
    }(HTMLElement);

    // New V1 component definition


    customElements.define('activity-loader', CTActivityLoader);
})();