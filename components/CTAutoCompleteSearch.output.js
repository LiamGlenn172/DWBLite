'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
*   --------------------------------------------------
*   CT Auto Complete Search Component V1
*   --------------------------------------------------
*
*   Recoded for version 1 of the web components spec.
*
*   This will create a text field allowing you to
*   bind a "source" of data for use in auto filtering
*   the list as you type.
*
*   --------------------------------------------------
*/

(function () {

    /**
     * CTAutoCompleteSearch
     * @attribute {string} listSource
     */
    var CTAutoCompleteSearch = function (_HTMLElement) {
        _inherits(CTAutoCompleteSearch, _HTMLElement);

        // Default Component methods

        function CTAutoCompleteSearch(self) {
            var _this2, _ret;

            _classCallCheck(this, CTAutoCompleteSearch);

            self = (_this2 = _possibleConstructorReturn(this, (CTAutoCompleteSearch.__proto__ || Object.getPrototypeOf(CTAutoCompleteSearch)).call(this, self)), _this2);
            _this2.initialRender();
            return _ret = self, _possibleConstructorReturn(_this2, _ret);
        }

        _createClass(CTAutoCompleteSearch, [{
            key: 'connectedCallback',
            value: function connectedCallback() {}

            // Custom Component Methods (for this component only)

        }, {
            key: 'initialRender',
            value: function initialRender() {
                this.list = cti.store[this.getAttribute('listSource')];

                this.searchInput = document.createElement('input');
                this.searchInput.type = 'text';

                var _this = this;

                this.searchInput.oninput = function (e) {
                    return _this.searchTypeEvent(e);
                };

                this.appendChild(this.searchInput);
            }
        }, {
            key: 'searchTypeEvent',
            value: function searchTypeEvent(e) {
                var count = 0;

                if (e.target.value.length > 1) {
                    var ul = document.createElement('ul');

                    if (this.list !== undefined && this.list.length > 0) {
                        for (var i = 0; i < this.list.length; i++) {
                            var site = this.list[i];
                            var search = e.target.value.toLowerCase();

                            if (site.SiteName.toLowerCase().indexOf(search) > -1 || site.ContractAlias !== null && site.ContractAlias.toLowerCase().indexOf(search) > -1) {
                                var li = document.createElement('li');
                                li.innerText = site.SiteName;

                                var _this = this;
                                li.onclick = function (e) {
                                    return _this.suggestionSelection(e);
                                };

                                ul.appendChild(li);

                                count++;
                            }
                        }
                    }

                    if (this.suggestionsList !== undefined) {
                        this.removeChild(this.suggestionsList);
                        delete this.suggestionsList;
                    }

                    if (count > 0) {
                        this.suggestionsList = ul;
                        this.appendChild(this.suggestionsList);
                    }
                } else {
                    if (this.suggestionsList !== undefined) {
                        this.removeChild(this.suggestionsList);
                        delete this.suggestionsList;
                    }
                }
            }
        }, {
            key: 'suggestionSelection',
            value: function suggestionSelection(e) {
                this.searchInput.value = e.target.innerText;
                this.removeChild(this.suggestionsList);
                delete this.suggestionsList;

                cti.chooseSiteFromList(e.target.innerText);
                $('div#btnNext').removeClass('ng-hide');
                this.searchInput.blur();
            }
        }]);

        return CTAutoCompleteSearch;
    }(HTMLElement);

    // New V1 component definition


    customElements.define('ct-autocomplete-search', CTAutoCompleteSearch);
})();