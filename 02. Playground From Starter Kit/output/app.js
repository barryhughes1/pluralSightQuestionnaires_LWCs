(function (Engine) {
  'use strict';

  const proto = {
    add(className) {
      if (typeof className === 'string') {
        this[className] = true;
      } else {
        Object.assign(this, className);
      }

      return this;
    },

    invert() {
      Object.keys(this).forEach(key => {
        this[key] = !this[key];
      });
      return this;
    },

    toString() {
      return Object.keys(this).filter(key => this[key]).join(' ');
    }

  };
  function classSet(config) {
    if (typeof config === 'string') {
      const key = config;
      config = {};
      config[key] = true;
    }

    return Object.assign(Object.create(proto), config);
  }

  function assert(condition, message) {
    if (process.env.NODE_ENV !== 'production') {
      if (!condition) {
        throw new Error(message);
      }
    }
  }

  /**
  An emitter implementation based on the Node.js EventEmitter API:
  https://nodejs.org/dist/latest-v6.x/docs/api/events.html#events_class_eventemitter
  **/
  class EventEmitter {
    constructor() {
      this.registry = {};
    }
    /**
    Registers a listener on the emitter
    @method EventEmitter#on
    @param {String} name - The name of the event
    @param {Function} listener - The callback function
    @return {EventEmitter} - Returns a reference to the `EventEmitter` so that calls can be chained
    **/


    on(name, listener) {
      this.registry[name] = this.registry[name] || [];
      this.registry[name].push(listener);
      return this;
    }
    /**
    Registers a listener on the emitter that only executes once
    @method EventEmitter#once
    @param {String} name - The name of the event
    @param {Function} listener - The callback function
    @return {EventEmitter} - Returns a reference to the `EventEmitter` so that calls can be chained
    **/


    once(name, listener) {
      const doOnce = function () {
        listener.apply(null, arguments);
        this.removeListener(name, doOnce);
      }.bind(this);

      this.on(name, doOnce);
      return this;
    }
    /**
    Synchronously calls each listener registered with the specified event
    @method EventEmitter#emit
    @param {String} name - The name of the event
    @return {Boolean} - Returns `true` if the event had listeners, `false` otherwise
    **/


    emit(name, ...args) {
      const listeners = this.registry[name];
      let count = 0;

      if (listeners) {
        listeners.forEach(listener => {
          count += 1;
          listener.apply(null, args);
        });
      }

      return count > 0;
    }
    /**
    Removes the specified `listener` from the listener array for the event named `name`
    @method EventEmitter#removeListener
    @param {String} name - The name of the event
    @param {Function} listener - The callback function
    @return {EventEmitter} - Returns a reference to the `EventEmitter` so that calls can be chained
    **/


    removeListener(name, listener) {
      const listeners = this.registry[name];

      if (listeners) {
        for (let i = 0, len = listeners.length; i < len; i += 1) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            return this;
          }
        }
      }

      return this;
    }

  }

  /**
   * Utility function to generate an unique guid.
   * used on state objects to provide a performance aid when iterating
   * through the items and marking them for render
   * @returns {String} an unique string ID
   */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  function classListMutation(classList, config) {
    Object.keys(config).forEach(key => {
      if (typeof key === 'string' && key.length) {
        if (config[key]) {
          classList.add(key);
        } else {
          classList.remove(key);
        }
      }
    });
  }

  /**
  A string normalization utility for attributes.
  @param {String} value - The value to normalize.
  @param {Object} config - The optional configuration object.
  @param {String} [config.fallbackValue] - The optional fallback value to use if the given value is not provided or invalid. Defaults to an empty string.
  @param {Array} [config.validValues] - An optional array of valid values. Assumes all input is valid if not provided.
  @return {String} - The normalized value.
  **/
  function normalizeString(value, config = {}) {
    const {
      fallbackValue = '',
      validValues
    } = config;
    let normalized = typeof value === 'string' && value.trim() || '';
    normalized = normalized.toLowerCase();

    if (validValues && validValues.indexOf(normalized) === -1) {
      normalized = fallbackValue;
    }

    return normalized;
  }
  /**
  A boolean normalization utility for attributes.
  @param {Any} value - The value to normalize.
  @return {Boolean} - The normalized value.
  **/

  function normalizeBoolean(value) {
    return typeof value === 'string' || !!value;
  }
  /**
  A aria attribute normalization utility.
  @param {Any} value - A single aria value or an array of aria values
  @return {String} - A space separated list of aria values
  **/

  function normalizeAriaAttribute(value) {
    let arias = Array.isArray(value) ? value : [value];
    arias = arias.map(ariaValue => {
      if (typeof ariaValue === 'string') {
        return ariaValue.replace(/\s+/g, ' ').trim();
      }

      return '';
    }).filter(ariaValue => !!ariaValue);
    return arias.length > 0 ? arias.join(' ') : null;
  }

  const keyCodes = {
    tab: 9,
    backspace: 8,
    enter: 13,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46,
    shift: 16
  };
  const buffer = {};
  /**
   * Runs an action and passes the string of buffered keys typed within a short time period.
   * Use for type-ahead like functionality in menus, lists, comboboxes, and similar components.
   *
   * @param {CustomEvent} event A keyboard event
   * @param {Function} action function to run, it's passed the buffered text
   */

  function runActionOnBufferedTypedCharacters(event, action) {
    // If we were going to clear what keys were typed, don't yet.
    if (buffer._clearBufferId) {
      clearTimeout(buffer._clearBufferId);
    } // Store the letter.


    const letter = String.fromCharCode(event.keyCode);
    buffer._keyBuffer = buffer._keyBuffer || [];

    buffer._keyBuffer.push(letter);

    const matchText = buffer._keyBuffer.join('').toLowerCase();

    action(matchText); // eslint-disable-next-line lwc/no-set-timeout

    buffer._clearBufferId = setTimeout(() => {
      buffer._keyBuffer = [];
    }, 700);
  }

  const isIE11 = isIE11Test(navigator);
  const isChrome = isChromeTest(navigator); // The following functions are for tests only

  function isIE11Test(navigator) {
    // https://stackoverflow.com/questions/17447373/how-can-i-target-only-internet-explorer-11-with-javascript
    return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
  }
  function isChromeTest(navigator) {
    // https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }

  /**
   * Set an attribute on an element, if it's a normal element
   * it will use setAttribute, if it's an LWC component
   * it will use the public property
   *
   * @param {HTMLElement} element The element to act on
   * @param {String} attribute the attribute to set
   * @param {Any} value the value to set
   */
  function smartSetAttribute(element, attribute, value) {
    if (element.tagName.match(/^LIGHTNING/i)) {
      attribute = attribute.replace(/-\w/g, m => m[1].toUpperCase());
      element[attribute] = value ? value : null;
    } else if (value) {
      element.setAttribute(attribute, value);
    } else {
      element.removeAttribute(attribute);
    }
  }

  const CONTENT_SEPARATOR = '\n';
  /**
  <template>
      <span lwc:dom="manual" class="visually-hidden"></span>
      <input>
  </template>

  class Foo extends LightningElement {
      constructor() {
          super();
          this.ariaObserver = new ContentMutation(this);
      }

      @track ariaLabeledbyValue = '';

      @api
      get ariaLabeledby() {
          return this.ariaLabeledbyValue; // whatever they set, is what they get back.
      }
      set ariaLabeledby(refs) {
          this.ariaLabeledbyValue = refs;
          this.ariaObserver.link('input', 'aria-labeledby', refs, 'span.visually-hidden');
      }

      renderedCallback() {
          this.ariaObserver.sync();
      }
  }
  **/

  function getAttr(elm, attr) {
    if (elm.tagName.match(/lightning/i)) {
      return elm[attr];
    }

    return elm.getAttribute(attr);
  }

  function extractElements(root, selector) {
    if (typeof selector !== 'string' || selector === '') {
      return [];
    }

    return [].slice.call(root.querySelectorAll(selector));
  }

  function extractContent(elements) {
    return elements.map(element => element.textContent).filter(text => text.length).join(CONTENT_SEPARATOR);
  }

  function splitIds(ids) {
    return (ids + '').trim().split(/\s+/);
  }

  function hashIds(ids) {
    return (ids + '').trim().split(/\s+/).reduce((r, v) => {
      r[v] = 1;
      return r;
    }, {});
  } // this method should check each individual id from computedIds
  // against the existing value of the attrName on elm, and dupe
  // them, and add the new ones.


  function addAriaRefWhenNeeded(elm, attrName, computedIds) {
    const newIds = splitIds(computedIds);
    const oldIds = getAttr(elm, attrName) || '';
    const oldIdsHash = hashIds(oldIds);
    const suffix = [];

    for (let i = 0; i < newIds.length; i += 1) {
      if (!oldIdsHash[newIds[i]]) {
        suffix.push(newIds[i]);
      }
    }

    if (suffix.length !== 0) {
      smartSetAttribute(elm, attrName, oldIds + (oldIds.length === 0 ? '' : ' ') + suffix.join(' '));
    }
  } // this method should check each individual id from computedIds
  // against the existing value of the attrName on elm, and remove
  // them when possible in preparation for some new values.


  function removeAriaRefWhenPossible(elm, attrName, computedIds) {
    const newIds = splitIds(computedIds);
    const oldIds = getAttr(elm, attrName) || '';
    const oldIdsHash = hashIds(oldIds);
    const newValues = [];

    for (let i = 0; i < newIds.length; i += 1) {
      if (!oldIdsHash[newIds[i]]) {
        newValues.push(newIds[i]);
      }
    }

    smartSetAttribute(elm, attrName, newValues.join(' '));
  }

  class ContentMutation {
    constructor(component) {
      this.template = component.template;
      this.isNative = this.template.constructor.toString().match(/\[native code\]/);
      this.state = {};
      this.liveIds = {};
      this.guid = guid();
    }

    connectLiveIdRef(refs, callback) {
      const selector = (refs + '').trim().split(/\s+/).map(ref => `[id*="${ref}"]`).join(',');
      const liveId = {
        selector,
        callback
      };
      this.liveIds[refs] = liveId;
    }

    link(innerSelector, attrName, ids, placeholderContainerSelector) {
      let attrState = this.state[attrName];

      if (attrState) {
        // note: we don't support linking to a different innerSelector,
        // attrName, or placeholderContainerSelector
        if (!this.isNative) {
          const elm = this.template.querySelector(innerSelector);

          if (elm) {
            // removing the old ids if possible before setting the new ones
            removeAriaRefWhenPossible(elm, attrName, attrState.ids);
          }

          attrState.ids = ids;
        }
      } else {
        attrState = this.state[attrName] = {
          ids,
          innerSelector,
          placeholderContainerSelector
        };
      }

      if (this.isNative) {
        attrState.outerSelector = (ids + '').trim().split(/\s+/).map(ref => `#${ref}`).join(',');
        attrState.placeholder = document.createElement('span');
        attrState.placeholder.id = `auto-link-${attrName}-${this.guid}`;
      }

      if (this.template.host.parentNode) {
        this.privateUpdate(attrName);
      }
    }

    sync() {
      if (!this.template.host.parentNode) {
        throw new Error(`Invalid sync invocation. It can only be invoked during renderedCallback().`);
      }

      if (this.isNative && !this.mo) {
        this.privateConnect();
      }

      for (const attrName in this.state) {
        if (this.state.hasOwnProperty(attrName)) {
          this.privateUpdate(attrName);
        }
      } // live idRef feature is a no-op in native


      if (!this.isNative) {
        this.privateUpdateLiveIds();
      }
    }

    privateExtractIds(elements) {
      return elements.map(el => {
        return el.getAttribute('id');
      }).join(' ');
    }

    privateUpdateLiveIds() {
      const root = this.template.host.getRootNode(); // if not connected do nothing

      if (!root) {
        return;
      }

      for (const liveId in this.liveIds) {
        if (this.liveIds.hasOwnProperty(liveId)) {
          const thisId = this.liveIds[liveId];

          if (!thisId.elements) {
            // element refs are cached
            thisId.elements = Array.prototype.slice.call(root.querySelectorAll(thisId.selector));
          }

          const newIds = this.privateExtractIds(thisId.elements); // only fire calback if the value changed

          if (newIds !== thisId.ids) {
            thisId.callback(newIds);
            thisId.ids = newIds;
          }
        }
      }
    }

    privateUpdate(attrName) {
      const {
        innerSelector
      } = this.state[attrName];
      const elm = this.template.querySelector(innerSelector);

      if (!elm) {
        return; // nothing to update
      }

      let computedIds;

      if (this.isNative) {
        const {
          outerSelector,
          content,
          placeholder,
          placeholderContainerSelector
        } = this.state[attrName];
        const newContent = extractContent(extractElements(this.root, outerSelector));

        if (content !== newContent) {
          this.state[attrName].content = placeholder.textContent = newContent;
        }

        if (!placeholder.parentNode) {
          // inserting the placeholder once
          const container = this.template.querySelector(placeholderContainerSelector);

          if (container) {
            container.appendChild(placeholder);
          }
        }

        computedIds = placeholder.id;
      } else {
        computedIds = this.state[attrName].ids;
      }

      addAriaRefWhenNeeded(elm, attrName, computedIds);
    }

    privateConnect() {
      // caching root ref
      this.root = this.template.host.getRootNode(); // creating the observer once

      const mo = new MutationObserver(() => {
        if (!this.template.host.parentNode) {
          return; // do nothing when the template is not connected
        }

        this.sync();
      });
      mo.observe(this.root, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }

  }

  /**
   * @param {HTMLElement} element Element to act on
   * @param {Object} values values and attributes to set, if the value is
   *                        falsy it the attribute will be removed
   */

  function synchronizeAttrs(element, values) {
    if (!element) {
      return;
    }

    const attributes = Object.keys(values);
    attributes.forEach(attribute => {
      smartSetAttribute(element, attribute, values[attribute]);
    });
  }
  /**
   * Get the actual DOM id for an element
   * @param {HTMLElement|String} el The element to get the id for (string will just be returned)
   *
   * @returns {String} The DOM id or null
   */

  function getRealDOMId(el) {
    if (el && typeof el === 'string') {
      return el;
    } else if (el) {
      return el.getAttribute('id');
    }

    return null;
  }

  /* eslint eslint-comments/no-use: off */

  /* eslint-disable lwc/no-aura */
  function getConfigFromAura($A) {
    return {
      getFormFactor() {
        return $A.get('$Browser.formFactor');
      },

      getLocale() {
        return $A.get('$Locale');
      },

      getLocalizationService() {
        return $A.localizationService;
      },

      getPathPrefix() {
        return $A.getContext().getPathPrefix();
      },

      getToken(name) {
        return $A.getToken(name);
      },

      // used for the map, this should not be working when a config is not provided.
      getCoreInfo: {},

      sanitizeDOM(dirty, config) {
        return $A.util.sanitizeDOM(dirty, config);
      }

    };
  }

  function createStandAloneConfig() {
    return {
      getFormFactor() {
        return 'DESKTOP';
      },

      getLocale() {
        return {
          userLocaleLang: 'en',
          userLocaleCountry: 'US',
          language: 'en',
          country: 'US',
          variant: '',
          langLocale: 'en_US',
          nameOfMonths: [{
            fullName: 'January',
            shortName: 'Jan'
          }, {
            fullName: 'February',
            shortName: 'Feb'
          }, {
            fullName: 'March',
            shortName: 'Mar'
          }, {
            fullName: 'April',
            shortName: 'Apr'
          }, {
            fullName: 'May',
            shortName: 'May'
          }, {
            fullName: 'June',
            shortName: 'Jun'
          }, {
            fullName: 'July',
            shortName: 'Jul'
          }, {
            fullName: 'August',
            shortName: 'Aug'
          }, {
            fullName: 'September',
            shortName: 'Sep'
          }, {
            fullName: 'October',
            shortName: 'Oct'
          }, {
            fullName: 'November',
            shortName: 'Nov'
          }, {
            fullName: 'December',
            shortName: 'Dec'
          }, {
            fullName: '',
            shortName: ''
          }],
          nameOfWeekdays: [{
            fullName: 'Sunday',
            shortName: 'SUN'
          }, {
            fullName: 'Monday',
            shortName: 'MON'
          }, {
            fullName: 'Tuesday',
            shortName: 'TUE'
          }, {
            fullName: 'Wednesday',
            shortName: 'WED'
          }, {
            fullName: 'Thursday',
            shortName: 'THU'
          }, {
            fullName: 'Friday',
            shortName: 'FRI'
          }, {
            fullName: 'Saturday',
            shortName: 'SAT'
          }],
          labelForToday: 'Today',
          firstDayOfWeek: 1,
          timezone: 'America/Los_Angeles',
          isEasternNameStyle: false,
          dateFormat: 'MMM d, yyyy',
          datetimeFormat: 'MMM d, yyyy h:mm:ss a',
          timeFormat: 'h:mm:ss a',
          numberFormat: '#,##0.###',
          decimal: '.',
          grouping: ',',
          zero: '0',
          percentFormat: '#,##0%',
          currencyFormat: '¤ #,##0.00;¤-#,##0.00',
          currencyCode: 'USD',
          currency: '$',
          dir: 'ltr'
        };
      },

      getLocalizationService() {
        const pad = n => {
          return n < 10 ? '0' + n : n;
        };

        const doublePad = n => {
          return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
        };

        return {
          parseDateTime(dateString) {
            if (!dateString) {
              return null;
            }

            return new Date(dateString);
          },

          parseDateTimeUTC(dateString) {
            if (!dateString) {
              return null;
            }

            return new Date(dateString);
          },

          parseDateTimeISO8601(dateString) {
            // If input is time only
            if (!dateString.includes('-')) {
              dateString = '2014-03-20T' + dateString;
            }

            return new Date(dateString);
          },

          formatDate(date) {
            return date.toISOString().split('T')[0];
          },

          formatDateUTC(date) {
            return this.formatDate(date);
          },

          formatTime(date) {
            return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${doublePad(date.getMilliseconds())}`;
          },

          isBefore(date1, date2) {
            return date1.getTime() < date2.getTime();
          },

          isAfter(date1, date2) {
            return date1.getTime() > date2.getTime();
          },

          isSame(date1, date2) {
            return date1.getTime() === date2.getTime();
          },

          getToday(timezone, callback) {
            return callback(new Date().toISOString().split('T')[0]);
          },

          UTCToWallTime(date, timezone, callback) {
            callback(date);
          },

          WallTimeToUTC(date, timezone, callback) {
            callback(date);
          },

          translateToOtherCalendar(date) {
            return date;
          },

          formatDateTimeUTC(date) {
            return date;
          }

        };
      },

      getPathPrefix() {
  return '/slds/2.8.1/';
      },

      getToken(name) {
  return void 0;
      },

      // used for the map, this should not be working when a config is not provided.
      getCoreInfo: {} // not defaulting `sanitizeDOM` dependency since we dont have a good alternative for now.

    };
  }

  function getDefaultConfig() {
    return window.$A !== undefined && window.$A.localizationService ? getConfigFromAura(window.$A) : createStandAloneConfig();
  }

  let PROVIDED_IMPL = getDefaultConfig();
  let FORM_FACTOR;
  function getPathPrefix() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getPathPrefix && PROVIDED_IMPL.getPathPrefix() || '';
  }
  function getToken(name) {
    return PROVIDED_IMPL && PROVIDED_IMPL.getToken && PROVIDED_IMPL.getToken(name);
  }
  function getLocale() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocale && PROVIDED_IMPL.getLocale();
  }
  function getFormFactor() {
    if (!FORM_FACTOR) {
      if (PROVIDED_IMPL && PROVIDED_IMPL.getFormFactor) {
        FORM_FACTOR = PROVIDED_IMPL.getFormFactor();
      } else {
        FORM_FACTOR = 'DESKTOP';
      }
    }

    return FORM_FACTOR;
  }
  function getLocalizationService() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocalizationService && PROVIDED_IMPL.getLocalizationService();
  }

  var _tmpl = void 0;

  // Taken from https://github.com/jonathantneal/svg4everybody/pull/139
  // Remove this iframe-in-edge check once the following is resolved https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8323875/
  const isEdgeUA = /\bEdge\/.(\d+)\b/.test(navigator.userAgent);
  const inIframe = window.top !== window.self;
  const isIframeInEdge = isEdgeUA && inIframe;
  var isIframeInEdge$1 = Engine.registerComponent(isIframeInEdge, {
    tmpl: _tmpl
  });

  // Taken from https://git.soma.salesforce.com/aura/lightning-global/blob/999dc35f948246181510df6e56f45ad4955032c2/src/main/components/lightning/SVGLibrary/stamper.js#L38-L60
  function fetchSvg(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.send();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr);
          }
        }
      };
    });
  }

  // Which looks like it was inspired by https://github.com/jonathantneal/svg4everybody/blob/377d27208fcad3671ed466e9511556cb9c8b5bd8/lib/svg4everybody.js#L92-L107
  // Modify at your own risk!

  const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
  const webkitUA = /\bAppleWebKit\/(\d+)\b/;
  const olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
  const isIE = newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537;
  const supportsSvg = !isIE && !isIframeInEdge$1;
  var supportsSvg$1 = Engine.registerComponent(supportsSvg, {
    tmpl: _tmpl
  });

  /**
  This polyfill injects SVG sprites into the document for clients that don't
  fully support SVG. We do this globally at the document level for performance
  reasons. This causes us to lose namespacing of IDs across sprites. For example,
  if both #image from utility sprite and #image from doctype sprite need to be
  rendered on the page, both end up as #image from the doctype sprite (last one
  wins). SLDS cannot change their image IDs due to backwards-compatibility
  reasons so we take care of this issue at runtime by adding namespacing as we
  polyfill SVG elements.

  For example, given "/assets/icons/action-sprite/svg/symbols.svg#approval", we
  replace the "#approval" id with "#${namespace}-approval" and a similar
  operation is done on the corresponding symbol element.
  **/
  const svgTagName = /svg/i;

  const isSvgElement = el => el && svgTagName.test(el.nodeName);

  const requestCache = {};
  const symbolEls = {};
  const svgFragments = {};
  const spritesContainerId = 'slds-svg-sprites';
  let spritesEl;
  function polyfill(el) {
    if (!supportsSvg$1 && isSvgElement(el)) {
      if (!spritesEl) {
        spritesEl = document.createElement('svg');
        spritesEl.xmlns = 'http://www.w3.org/2000/svg';
        spritesEl['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
        spritesEl.style.display = 'none';
        spritesEl.id = spritesContainerId;
        document.body.insertBefore(spritesEl, document.body.childNodes[0]);
      }

      Array.from(el.getElementsByTagName('use')).forEach(use => {
        // We access the href differently in raptor and in aura, probably
        // due to difference in the way the svg is constructed.
        const src = use.getAttribute('xlink:href') || use.getAttribute('href');

        if (src) {
          // "/assets/icons/action-sprite/svg/symbols.svg#approval" =>
          // ["/assets/icons/action-sprite/svg/symbols.svg", "approval"]
          const parts = src.split('#');
          const url = parts[0];
          const id = parts[1];
          const namespace = url.replace(/[^\w]/g, '-');
          const href = `#${namespace}-${id}`;

          if (url.length) {
            // set the HREF value to no longer be an external reference
            if (use.getAttribute('xlink:href')) {
              use.setAttribute('xlink:href', href);
            } else {
              use.setAttribute('href', href);
            } // only insert SVG content if it hasn't already been retrieved


            if (!requestCache[url]) {
              requestCache[url] = fetchSvg(url);
            }

            requestCache[url].then(svgContent => {
              // create a document fragment from the svgContent returned (is parsed by HTML parser)
              if (!svgFragments[url]) {
                const svgFragment = document.createRange().createContextualFragment(svgContent);
                svgFragments[url] = svgFragment;
              }

              if (!symbolEls[href]) {
                const svgFragment = svgFragments[url];
                const symbolEl = svgFragment.querySelector(`#${id}`);
                symbolEls[href] = true;
                symbolEl.id = `${namespace}-${id}`;
                spritesEl.appendChild(symbolEl);
              }
            });
          }
        }
      });
    }
  }

  const validNameRe = /^([a-zA-Z]+):([a-zA-Z]\w*)$/;
  const underscoreRe = /_/g;
  let pathPrefix;
  const tokenNameMap = Object.assign(Object.create(null), {
    action: 'lightning.actionSprite',
    custom: 'lightning.customSprite',
    doctype: 'lightning.doctypeSprite',
    standard: 'lightning.standardSprite',
    utility: 'lightning.utilitySprite'
  });
  const defaultTokenValueMap = Object.assign(Object.create(null), {
    'lightning.actionSprite': '/assets/icons/action-sprite/svg/symbols.svg',
    'lightning.customSprite': '/assets/icons/custom-sprite/svg/symbols.svg',
    'lightning.doctypeSprite': '/assets/icons/doctype-sprite/svg/symbols.svg',
    'lightning.standardSprite': '/assets/icons/standard-sprite/svg/symbols.svg',
    'lightning.utilitySprite': '/assets/icons/utility-sprite/svg/symbols.svg'
  });

  const getDefaultBaseIconPath = category => defaultTokenValueMap[tokenNameMap[category]];

  const getBaseIconPath = category => getToken(tokenNameMap[category]) || getDefaultBaseIconPath(category);

  const getMatchAtIndex = index => iconName => {
    const result = validNameRe.exec(iconName);
    return result ? result[index] : '';
  };

  const getCategory = getMatchAtIndex(1);
  const getName = getMatchAtIndex(2);
  const isValidName = iconName => validNameRe.test(iconName);
  const getIconPath = iconName => {
    pathPrefix = pathPrefix !== undefined ? pathPrefix : getPathPrefix();

    if (isValidName(iconName)) {
      const baseIconPath = getBaseIconPath(getCategory(iconName));

      if (baseIconPath) {
        // This check was introduced the following MS-Edge issue:
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9655192/
        // If and when this get fixed, we can safely remove this block of code.
        if (isIframeInEdge$1) {
          // protocol => 'https:' or 'http:'
          // host => hostname + port
          const origin = `${window.location.protocol}//${window.location.host}`;
          return `${origin}${pathPrefix}${baseIconPath}#${getName(iconName)}`;
        }

        return `${pathPrefix}${baseIconPath}#${getName(iconName)}`;
      }
    }

    return '';
  };
  const computeSldsClass = iconName => {
    if (isValidName(iconName)) {
      const category = getCategory(iconName);
      const name = getName(iconName).replace(underscoreRe, '-');
      return `slds-icon-${category}-${name}`;
    }

    return '';
  };

  const isSafari = window.safari && window.safari.pushNotification && window.safari.pushNotification.toString() === '[object SafariRemoteNotification]'; // [W-3421985] https://bugs.webkit.org/show_bug.cgi?id=162866
  // https://git.soma.salesforce.com/aura/lightning-global/blob/82e8bfd02846fa7e6b3e7549a64be95b619c4b1f/src/main/components/lightning/primitiveIcon/primitiveIconHelper.js#L53-L56

  function safariA11yPatch(svgElement) {
    if (!svgElement || !isSafari) {
      return;
    } // In case we're dealing with a proxied element.


    svgElement = Engine.unwrap(svgElement);
    const use = svgElement.querySelector('use');

    if (!use) {
      return;
    }

    svgElement.insertBefore(document.createTextNode('\n'), use); // If use.nextSibling is null, the text node is added to the end of
    // the list of children of the SVG element.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore

    svgElement.insertBefore(document.createTextNode('\n'), use.nextSibling);
  }

  function stylesheet(hostSelector, shadowSelector, nativeShadow) {
    return "_:-ms-lang(x)" + shadowSelector + ", svg" + shadowSelector + " {pointer-events: none;}\n";
  }
  var _implicitStylesheets = [stylesheet];

  function tmpl($api, $cmp, $slotset, $ctx) {
    const {
      h: api_element
    } = $api;
    return [api_element("svg", {
      className: $cmp.computedClass,
      attrs: {
        "focusable": "false",
        "data-key": $cmp.name,
        "aria-hidden": "true"
      },
      key: 2
    }, [api_element("use", {
      attrs: {
        "xlink:href": Engine.sanitizeAttribute("use", "http://www.w3.org/2000/svg", "xlink:href", $cmp.href)
      },
      key: 3
    }, [])])];
  }

  var _tmpl$1 = Engine.registerTemplate(tmpl);
  tmpl.stylesheets = [];

  if (_implicitStylesheets) {
    tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
  }
  tmpl.stylesheetTokens = {
    hostAttribute: "lightning-primitiveIcon_primitiveIcon-host",
    shadowAttribute: "lightning-primitiveIcon_primitiveIcon"
  };

  class LightningPrimitiveIcon extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.iconName = void 0;
      this.src = void 0;
      this.svgClass = void 0;
      this.size = 'medium';
      this.variant = void 0;
    }

    renderedCallback() {
      if (this.iconName !== this.prevIconName) {
        this.prevIconName = this.iconName;
        const svgElement = this.template.querySelector('svg');
        polyfill(svgElement);
        safariA11yPatch(svgElement);
      }
    }

    get href() {
      return this.src || getIconPath(this.iconName);
    }

    get name() {
      return getName(this.iconName);
    }

    get normalizedSize() {
      return normalizeString(this.size, {
        fallbackValue: 'medium',
        validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
      });
    }

    get normalizedVariant() {
      // NOTE: Leaving a note here because I just wasted a bunch of time
      // investigating why both 'bare' and 'inverse' are supported in
      // lightning-primitive-icon. lightning-icon also has a deprecated
      // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
      // that no classes should be applied. So this component needs to
      // support both 'bare' and 'inverse' while lightning-icon only needs to
      // support 'inverse'.
      return normalizeString(this.variant, {
        fallbackValue: '',
        validValues: ['bare', 'error', 'inverse', 'warning']
      });
    }

    get computedClass() {
      const {
        normalizedSize,
        normalizedVariant
      } = this;
      const classes = classSet(this.svgClass);

      if (normalizedVariant !== 'bare') {
        classes.add('slds-icon');
      }

      switch (normalizedVariant) {
        case 'error':
          classes.add('slds-icon-text-error');
          break;

        case 'warning':
          classes.add('slds-icon-text-warning');
          break;

        case 'inverse':
        case 'bare':
          break;

        default:
          // if custom icon is set, we don't want to set
          // the text-default class
          if (!this.src) {
            classes.add('slds-icon-text-default');
          }

      }

      if (normalizedSize !== 'medium') {
        classes.add(`slds-icon_${normalizedSize}`);
      }

      return classes.toString();
    }

  }

  Engine.registerDecorators(LightningPrimitiveIcon, {
    publicProps: {
      iconName: {
        config: 0
      },
      src: {
        config: 0
      },
      svgClass: {
        config: 0
      },
      size: {
        config: 0
      },
      variant: {
        config: 0
      }
    }
  });

  var primitiveIcon = Engine.registerComponent(LightningPrimitiveIcon, {
    tmpl: _tmpl$1
  });

  function tmpl$1($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      d: api_dynamic,
      h: api_element
    } = $api;
    return [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": $cmp.state.iconName,
        "size": $cmp.size,
        "variant": $cmp.variant,
        "src": $cmp.state.src
      },
      key: 2
    }, []), $cmp.alternativeText ? api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 3
    }, [api_dynamic($cmp.alternativeText)]) : null];
  }

  var _tmpl$2 = Engine.registerTemplate(tmpl$1);
  tmpl$1.stylesheets = [];
  tmpl$1.stylesheetTokens = {
    hostAttribute: "lightning-icon_icon-host",
    shadowAttribute: "lightning-icon_icon"
  };

  /**
   * Represents a visual element that provides context and enhances usability.
   */

  class LightningIcon extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.state = {};
      this.alternativeText = void 0;
    }

    /**
     * A uri path to a custom svg sprite, including the name of the resouce,
     * for example: /assets/icons/standard-sprite/svg/test.svg#icon-heart
     * @type {string}
     */
    get src() {
      return this.privateSrc;
    }

    set src(value) {
      this.privateSrc = value; // if value is not present, then we set the state back
      // to the original iconName that was passed
      // this might happen if the user sets a custom icon, then
      // decides to revert back to SLDS by removing the src attribute

      if (!value) {
        this.state.iconName = this.iconName;
        this.classList.remove('slds-icon-standard-default');
      } // if isIE11 and the src is set
      // we'd like to show the 'standard:default' icon instead
      // for performance reasons.


      if (value && isIE11) {
        this.setDefault();
        return;
      }

      this.state.src = value;
    }
    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * @type {string}
     * @required
     */


    get iconName() {
      return this.privateIconName;
    }

    set iconName(value) {
      this.privateIconName = value; // if src is set, we don't need to validate
      // iconName

      if (this.src) {
        return;
      }

      if (isValidName(value)) {
        const isAction = getCategory(value) === 'action'; // update classlist only if new iconName is different than state.iconName
        // otherwise classListMutation receives class:true and class: false and removes slds class

        if (value !== this.state.iconName) {
          classListMutation(this.classList, {
            'slds-icon_container_circle': isAction,
            [computeSldsClass(value)]: true,
            [computeSldsClass(this.state.iconName)]: false
          });
        }

        this.state.iconName = value;
      } else {
        console.warn(`<lightning-icon> Invalid icon name ${value}`); // eslint-disable-line no-console
        // Invalid icon names should render a blank icon. Remove any
        // classes that might have been previously added.

        classListMutation(this.classList, {
          'slds-icon_container_circle': false,
          [computeSldsClass(this.state.iconName)]: false
        });
        this.state.iconName = undefined;
      }
    }
    /**
     * The size of the icon. Options include xx-small, x-small, small, medium, or large.
     * The default is medium.
     * @type {string}
     * @default medium
     */


    get size() {
      return normalizeString(this.state.size, {
        fallbackValue: 'medium',
        validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
      });
    }

    set size(value) {
      this.state.size = value;
    }
    /**
     * The variant changes the appearance of a utility icon.
     * Accepted variants include inverse, warning, and error.
     * Use the inverse variant to implement a white fill in utility icons on dark backgrounds.
     * @type {string}
     */


    get variant() {
      return normalizeVariant(this.state.variant, this.state.iconName);
    }

    set variant(value) {
      this.state.variant = value;
    }

    connectedCallback() {
      this.classList.add('slds-icon_container');
    }

    setDefault() {
      this.state.src = undefined;
      this.state.iconName = 'standard:default';
      this.classList.add('slds-icon-standard-default');
    }

  }

  Engine.registerDecorators(LightningIcon, {
    publicProps: {
      alternativeText: {
        config: 0
      },
      src: {
        config: 3
      },
      iconName: {
        config: 3
      },
      size: {
        config: 3
      },
      variant: {
        config: 3
      }
    },
    track: {
      state: 1
    }
  });

  var icon = Engine.registerComponent(LightningIcon, {
    tmpl: _tmpl$2
  });

  function normalizeVariant(variant, iconName) {
    // Unfortunately, the `bare` variant was implemented to do what the
    // `inverse` variant should have done. Keep this logic for as long as
    // we support the `bare` variant.
    if (variant === 'bare') {
      // TODO: Deprecation warning using strippable assertion
      variant = 'inverse';
    }

    if (getCategory(iconName) === 'utility') {
      return normalizeString(variant, {
        fallbackValue: '',
        validValues: ['error', 'inverse', 'warning']
      });
    }

    return 'inverse';
  }

  function tmpl$2($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      h: api_element,
      d: api_dynamic,
      t: api_text,
      b: api_bind,
      k: api_key
    } = $api;
    const {
      _m0
    } = $ctx;
    return [api_element("article", {
      classMap: {
        "slds-card": true,
        "slds-m-around--medium": true
      },
      key: api_key(2, $cmp.questionnaire.name)
    }, [api_element("div", {
      classMap: {
        "slds-card__header": true,
        "slds-grid": true
      },
      key: 3
    }, [api_element("header", {
      classMap: {
        "slds-media": true,
        "slds-media_center": true,
        "slds-has-flexi-truncate": true
      },
      key: 4
    }, [api_element("div", {
      classMap: {
        "slds-media__figure": true
      },
      key: 5
    }, [api_element("span", {
      classMap: {
        "slds-icon_container": true
      },
      attrs: {
        "title": "description of icon when needed"
      },
      key: 6
    }, [api_custom_element("lightning-icon", icon, {
      props: {
        "iconName": "custom:custom18",
        "size": "small",
        "alternativeText": "Questionnaire"
      },
      key: 7
    }, [])])]), api_element("div", {
      classMap: {
        "slds-media__body": true
      },
      key: 8
    }, [api_element("h2", {
      key: 9
    }, [api_element("a", {
      classMap: {
        "slds-card__header-link": true,
        "slds-truncate": true
      },
      attrs: {
        "href": "/questionnaire.html",
        "title": "[object Object]"
      },
      key: 10
    }, [api_element("span", {
      classMap: {
        "slds-text-heading_small": true
      },
      key: 11
    }, [api_dynamic($cmp.questionnaire.name)])])])])]), api_element("div", {
      classMap: {
        "slds-no-flex": true
      },
      key: 12
    }, [api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-button_neutral": true
      },
      key: 13,
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.openQuestionnaire))
      }
    }, [api_text("Open")])])]), api_element("div", {
      classMap: {
        "slds-card__body": true,
        "slds-card__body_inner": true
      },
      key: 14
    }, [api_element("p", {
      key: 15
    }, [api_dynamic($cmp.questionnaire.description__c)]), api_element("p", {
      key: 16
    }, [api_dynamic($cmp.questionnaire.questions__c), api_text(" to answer")])]), api_element("footer", {
      className: $cmp.questionnaire.cardtheme,
      key: 17
    }, [api_dynamic($cmp.questionnaire.status__c)])])];
  }

  var _tmpl$3 = Engine.registerTemplate(tmpl$2);
  tmpl$2.stylesheets = [];
  tmpl$2.stylesheetTokens = {
    hostAttribute: "c-questionnaireCard_questionnaireCard-host",
    shadowAttribute: "c-questionnaireCard_questionnaireCard"
  };

  class QuestionnaireCard extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.questionnaire = void 0;
    }

    openQuestionnaire(event) {
      // Prevents the anchor element from navigating to a URL.
      event.preventDefault(); // Creates the event with the questionnaire ID data.
      // sending a selected event

      const selectedEvent = new CustomEvent('selected', {
        detail: this.questionnaire.id
      }); // Dispatches the event.

      this.dispatchEvent(selectedEvent);
    }

  }

  Engine.registerDecorators(QuestionnaireCard, {
    publicProps: {
      questionnaire: {
        config: 0
      }
    }
  });

  var questionnaireCard = Engine.registerComponent(QuestionnaireCard, {
    tmpl: _tmpl$3
  });

  var labelRequired = 'required';

  var labelBadInput = 'Enter a valid value.';

  var labelPatternMismatch = 'Your entry does not match the allowed pattern.';

  var labelRangeOverflow = 'The number is too high.';

  var labelRangeUnderflow = 'The number is too low.';

  var labelStepMismatch = 'Your entry isn\'t a valid increment.';

  var labelTooLong = 'Your entry is too long.';

  var labelTooShort = 'Your entry is too short.';

  var labelTypeMismatch = 'You have entered an invalid format.';

  var labelValueMissing = 'Complete this field.';

  let idCounter = 0;
  function generateUniqueId(prefix = 'input') {
    idCounter++;
    return `${prefix}-${idCounter}`;
  }

  /**
   Represents an object which keeps track of a user's interacting state.
   @constructor InteractingState
   @param {Object} options - The options object.
   @param {Object} [options.duration=2000] - The number of milliseconds of idle time to wait before exiting the interacting state.
   @param {Object} [options.debounceInteraction=false] - Whether to debounce interaction to ignore consecutive leave-enter interactions.
   **/

  class InteractingState {
    constructor(options) {
      const duration = options && options.duration >= 0 ? options.duration : 2000;
      this.eventemitter = new EventEmitter();
      this._interacting = false;
      this._debouncedLeave = debounce(this.leave.bind(this), duration);
      this._debounceInteraction = options && options.debounceInteraction;
      this._interactedRecently = false;

      if (this._debounceInteraction) {
        // debounce leave until a short time later
        this._debouncedEmitLeave = debounce(() => {
          if (!this._interacting) {
            this._interactedRecently = false;
            this.eventemitter.emit('leave');
          }
        }, 200); // debounce enter until left

        this._debouncedEmitEnter = () => {
          if (!this._interactedRecently) {
            this._interactedRecently = true;
            this.eventemitter.emit('enter');
          }
        };
      }
    }
    /**
     Checks whether or not we are in the interacting state.
     @method InteractingState#isInteracting
     @return {Boolean} - Whether or not we are interacting.
     **/


    isInteracting() {
      return this._interacting;
    }
    /**
     Enters the interacting state.
     @method InteractingState#enter
     @returns {void}
     **/


    enter() {
      if (!this._interacting) {
        this._interacting = true;

        if (this._debounceInteraction) {
          this._debouncedEmitEnter();
        } else {
          this.eventemitter.emit('enter');
        }
      }
    }
    /**
     Registers a handler to execute when we enter the interacting state.
     @method InteractingState#onenter
     @param {Function} handler - The callback function.
     **/


    onenter(handler) {
      this.eventemitter.on('enter', handler);
    }
    /**
     Leaves the interacting state.
     @method InteractingState#leave
     @returns {void}
     **/


    leave() {
      if (this._interacting) {
        this._interacting = false;

        if (this._debounceInteraction) {
          this._debouncedEmitLeave();
        } else {
          this.eventemitter.emit('leave');
        }
      }
    }
    /**
     Registers a handler to execute when we leave the interacting state.
     @method InteractingState#onleave
     @param {Function} handler - The callback function.
     **/


    onleave(handler) {
      this.eventemitter.on('leave', handler);
    }
    /**
     Signals the start of the transition into the interacting state and
     schedules a transition out of the interacting state after an idle
     duration. Calling this method multiple times will reset the timer.
     @method InteractingState#interacting
     @returns {void}
     **/


    interacting() {
      this.enter();

      this._debouncedLeave();
    }

  }
  /**
   Creates a debounced function that delays invoking `func` until after
   `delay` milliseconds have elapsed since the last time the debounced
   function was invoked.
   @function debounce
   @param {Function} func - The function to debounce
   @param {Number} delay - The number of milliseconds to delay
   @param {Object} options - The options object
   @param {Boolean} options.leading - Specify invoking on the leading edge of the timeout
   @return {Function} - debounced function
   **/

  function debounce(func, delay, options) {
    const _options = options || {};

    let invokeLeading = _options.leading;
    let timer;
    return function debounced() {
      const args = Array.prototype.slice.apply(arguments);

      if (invokeLeading) {
        func.apply(this, args);
        invokeLeading = false;
      }

      clearTimeout(timer); // eslint-disable-next-line lwc/no-set-timeout

      timer = setTimeout(function () {
        func.apply(this, args);
        invokeLeading = _options.leading; // reset for next debounce sequence
      }, delay);
    };
  }

  const constraintsSortedByPriority = ['customError', 'badInput', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing'];
  const defaultLabels = {
    badInput: labelBadInput,
    customError: labelBadInput,
    patternMismatch: labelPatternMismatch,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    stepMismatch: labelStepMismatch,
    tooLong: labelTooLong,
    tooShort: labelTooShort,
    typeMismatch: labelTypeMismatch,
    valueMissing: labelValueMissing
  };

  function resolveBestMatch(validity) {
    let validityState;

    if (validity && validity.valid === false) {
      validityState = 'badInput';
      constraintsSortedByPriority.some(stateName => {
        if (validity[stateName] === true) {
          validityState = stateName;
          return true;
        }

        return false;
      });
    }

    return validityState;
  }

  function computeConstraint(valueProvider, constraint) {
    const provider = valueProvider[constraint];

    if (typeof provider === 'function') {
      return provider();
    }

    if (typeof provider === 'boolean') {
      return provider;
    }

    return false;
  } // We're doing the below to avoid exposing the constraintsProvider in the ValidityState


  function newValidityState(constraintsProvider) {
    class ValidityState {
      get valueMissing() {
        return computeConstraint(constraintsProvider, 'valueMissing');
      }

      get typeMismatch() {
        return computeConstraint(constraintsProvider, 'typeMismatch');
      }

      get patternMismatch() {
        return computeConstraint(constraintsProvider, 'patternMismatch');
      }

      get tooLong() {
        return computeConstraint(constraintsProvider, 'tooLong');
      }

      get tooShort() {
        return computeConstraint(constraintsProvider, 'tooShort');
      }

      get rangeUnderflow() {
        return computeConstraint(constraintsProvider, 'rangeUnderflow');
      }

      get rangeOverflow() {
        return computeConstraint(constraintsProvider, 'rangeOverflow');
      }

      get stepMismatch() {
        return computeConstraint(constraintsProvider, 'stepMismatch');
      }

      get customError() {
        return computeConstraint(constraintsProvider, 'customError');
      }

      get badInput() {
        return computeConstraint(constraintsProvider, 'badInput');
      }

      get valid() {
        return !(this.valueMissing || this.typeMismatch || this.patternMismatch || this.tooLong || this.tooShort || this.rangeUnderflow || this.rangeOverflow || this.stepMismatch || this.customError || this.badInput);
      }

    }

    return new ValidityState();
  }

  function buildSyntheticValidity(constraintProvider) {
    return Object.freeze(newValidityState(constraintProvider));
  }
  function getErrorMessage(validity, labelMap) {
    const key = resolveBestMatch(validity);

    if (key) {
      return labelMap[key] ? labelMap[key] : defaultLabels[key];
    }

    return '';
  }
  class FieldConstraintApi {
    constructor(inputComponentProvider, constraintProviders) {
      assert(typeof inputComponentProvider === 'function');
      this._inputComponentProvider = inputComponentProvider;
      this._constraintsProvider = Object.assign({}, constraintProviders);

      if (!this._constraintsProvider.customError) {
        this._constraintsProvider.customError = () => typeof this._customValidityMessage === 'string' && this._customValidityMessage !== '';
      }
    }

    get validity() {
      if (!this._constraint) {
        this._constraint = buildSyntheticValidity(this._constraintsProvider);
      }

      return this._constraint;
    }

    checkValidity() {
      const isValid = this.validity.valid;

      if (!isValid) {
        if (this.inputComponent) {
          this.inputComponent.dispatchEvent(new CustomEvent('invalid', {
            cancellable: true
          }));
        }
      }

      return isValid;
    }

    reportValidity(callback) {
      const valid = this.checkValidity();
      this.inputComponent.classList.toggle('slds-has-error', !valid);

      if (callback) {
        callback(this.validationMessage);
      }

      return valid;
    }

    setCustomValidity(message) {
      this._customValidityMessage = message;
    }

    get validationMessage() {
      return getErrorMessage(this.validity, {
        customError: this._customValidityMessage,
        badInput: this.inputComponent.messageWhenBadInput,
        patternMismatch: this.inputComponent.messageWhenPatternMismatch,
        rangeOverflow: this.inputComponent.messageWhenRangeOverflow,
        rangeUnderflow: this.inputComponent.messageWhenRangeUnderflow,
        stepMismatch: this.inputComponent.messageWhenStepMismatch,
        tooShort: this.inputComponent.messageWhenTooShort,
        tooLong: this.inputComponent.messageWhenTooLong,
        typeMismatch: this.inputComponent.messageWhenTypeMismatch,
        valueMissing: this.inputComponent.messageWhenValueMissing
      });
    }

    get inputComponent() {
      if (!this._inputComponentElement) {
        this._inputComponentElement = this._inputComponentProvider();
      }

      return this._inputComponentElement;
    }

  }
  class FieldConstraintApiWithProxyInput {
    constructor(inputComponent, overrides = {}, inputElementName = 'input') {
      this._inputComponent = inputComponent;
      this._overrides = overrides;
      this._proxyInput = document.createElement(inputElementName);
    }

    setInputAttributes(attributes) {
      this._attributes = attributes;

      this._attributeUpdater = attributeNames => {
        if (!attributes) {
          return;
        }

        if (typeof attributeNames === 'string') {
          this._setAttribute(attributeNames, attributes[attributeNames]());
        } else {
          attributeNames.forEach(attributeName => {
            this._setAttribute(attributeName, attributes[attributeName]());
          });
        }
      };

      return this._attributeUpdater;
    }

    get validity() {
      return this._constraintApi.validity;
    }

    checkValidity() {
      return this._constraintApi.checkValidity();
    }

    reportValidity(callback) {
      return this._constraintApi.reportValidity(callback);
    }

    setCustomValidity(message) {
      this._constraintApi.setCustomValidity(message);

      this._proxyInput.setCustomValidity(message);
    }

    get validationMessage() {
      return this._constraintApi.validationMessage;
    }

    _setAttribute(attributeName, value) {
      if (value !== null && value !== undefined && value !== false) {
        if (attributeName === 'value') {
          if (this._proxyInput.type === 'file') {
            // Can't set value on file
            return;
          }

          this._proxyInput.value = value;
        } else {
          this._proxyInput.setAttribute(attributeName, value);
        }
      } else {
        this._removeAttribute(attributeName);
      }
    }

    _removeAttribute(attributeName) {
      this._proxyInput.removeAttribute(attributeName);
    }

    get _constraintApi() {
      if (!this._privateConstraintApi) {
        this._updateAllAttributes();

        const computeConstraintWithProxyInput = constraintName => {
          const constraintOverride = this._overrides[constraintName];

          if (typeof constraintOverride === 'function') {
            const result = constraintOverride();

            if (typeof result === 'boolean') {
              return !this._proxyInput.hasAttribute('disabled') && !this._proxyInput.hasAttribute('readonly') && result;
            }
          }

          return this._proxyInput.validity[constraintName];
        };

        const constraintsProvider = constraintsSortedByPriority.reduce((provider, constraint) => {
          provider[constraint] = computeConstraintWithProxyInput.bind(this, constraint);
          return provider;
        }, {});
        this._privateConstraintApi = new FieldConstraintApi(this._inputComponent, constraintsProvider);
      }

      return this._privateConstraintApi;
    }

    _updateAllAttributes() {
      if (this._attributes) {
        Object.entries(this._attributes).forEach(([key, valueFunction]) => {
          this._setAttribute(key, valueFunction());
        });
      }
    }

  }

  const VARIANT = {
    STANDARD: 'standard',
    LABEL_HIDDEN: 'label-hidden',
    LABEL_STACKED: 'label-stacked'
  };
  /**
  A variant normalization utility for attributes.
  @param {Any} value - The value to normalize.
  @return {Boolean} - The normalized value.
  **/

  function normalizeVariant$1(value) {
    return normalizeString(value, {
      fallbackValue: VARIANT.STANDARD,
      validValues: [VARIANT.STANDARD, VARIANT.LABEL_HIDDEN, VARIANT.LABEL_STACKED]
    });
  }

  function isEmptyString(s) {
    return s === undefined || s === null || typeof s === 'string' && s.trim() === '';
  }

  function stylesheet$1(hostSelector, shadowSelector, nativeShadow) {
    return "\n" + (nativeShadow ? (":host {display: block;}") : (hostSelector + " {display: block;}")) + "\n";
  }
  var _implicitStylesheets$1 = [stylesheet$1];

  function tmpl$3($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      h: api_element,
      d: api_dynamic,
      gid: api_scoped_id,
      b: api_bind,
      k: api_key,
      i: api_iterator,
      f: api_flatten
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5
    } = $ctx;
    return [api_element("fieldset", {
      key: 2
    }, [api_element("legend", {
      classMap: {
        "slds-form-element__legend": true,
        "slds-form-element__label": true
      },
      key: 3
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 5
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 6
    }, api_flatten([$cmp.isRadio ? api_iterator($cmp.transformedOptions, function (option) {
      return api_element("span", {
        classMap: {
          "slds-radio": true
        },
        key: api_key(9, option.value)
      }, [api_element("input", {
        attrs: {
          "type": "radio",
          "name": $cmp.name,
          "id": api_scoped_id(option.indexId)
        },
        props: {
          "checked": option.isChecked,
          "value": option.value,
          "required": $cmp.required,
          "disabled": $cmp.disabled
        },
        key: 10,
        on: {
          "change": _m0 || ($ctx._m0 = api_bind($cmp.handleChange)),
          "focus": _m1 || ($ctx._m1 = api_bind($cmp.handleFocus)),
          "blur": _m2 || ($ctx._m2 = api_bind($cmp.handleBlur))
        }
      }, []), api_element("label", {
        classMap: {
          "slds-radio__label": true
        },
        attrs: {
          "for": api_scoped_id(option.indexId)
        },
        key: 11
      }, [api_element("span", {
        classMap: {
          "slds-radio_faux": true
        },
        key: 12
      }, []), api_element("span", {
        classMap: {
          "slds-form-element__label": true
        },
        key: 13
      }, [api_dynamic(option.label)])])]);
    }) : [], $cmp.isButton ? api_element("div", {
      classMap: {
        "slds-radio_button-group": true
      },
      key: 15
    }, api_iterator($cmp.transformedOptions, function (option) {
      return api_element("span", {
        classMap: {
          "slds-button": true,
          "slds-radio_button": true
        },
        key: api_key(17, option.value)
      }, [api_element("input", {
        attrs: {
          "type": "radio",
          "name": $cmp.name,
          "id": api_scoped_id(option.indexId)
        },
        props: {
          "checked": option.isChecked,
          "value": option.value,
          "required": $cmp.required,
          "disabled": $cmp.disabled
        },
        key: 18,
        on: {
          "change": _m3 || ($ctx._m3 = api_bind($cmp.handleChange)),
          "focus": _m4 || ($ctx._m4 = api_bind($cmp.handleFocus)),
          "blur": _m5 || ($ctx._m5 = api_bind($cmp.handleBlur))
        }
      }, []), api_element("label", {
        classMap: {
          "slds-radio_button__label": true
        },
        attrs: {
          "for": api_scoped_id(option.indexId)
        },
        key: 19
      }, [api_element("span", {
        classMap: {
          "slds-radio_faux": true
        },
        key: 20
      }, [api_dynamic(option.label)])])]);
    })) : null])), $cmp._helpMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "data-help-message": true,
        "id": api_scoped_id("help-message")
      },
      key: 22
    }, [api_dynamic($cmp._helpMessage)]) : null])];
  }

  var _tmpl$4 = Engine.registerTemplate(tmpl$3);
  tmpl$3.stylesheets = [];

  if (_implicitStylesheets$1) {
    tmpl$3.stylesheets.push.apply(tmpl$3.stylesheets, _implicitStylesheets$1);
  }
  tmpl$3.stylesheetTokens = {
    hostAttribute: "lightning-radioGroup_radioGroup-host",
    shadowAttribute: "lightning-radioGroup_radioGroup"
  };

  const i18n = {
    required: labelRequired
  };
  /**
   * A radio button group that can have a single option selected.
   */

  class LightningRadioGroup extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.type = 'radio';
      this.label = void 0;
      this.options = void 0;
      this.messageWhenValueMissing = void 0;
      this.name = generateUniqueId();
      this._required = false;
      this._disabled = false;
      this._helpMessage = void 0;
      this._value = void 0;
    }

    synchronizeA11y() {
      const inputs = this.template.querySelectorAll('input');
      Array.prototype.slice.call(inputs).forEach(input => {
        synchronizeAttrs(input, {
          'aria-describedby': this.computedUniqueHelpElementId
        });
      });
    }

    connectedCallback() {
      this.classList.add('slds-form-element');
      this.interactingState = new InteractingState();
      this.interactingState.onleave(this.showHelpMessageIfInvalid.bind(this));
    }

    renderedCallback() {
      this.synchronizeA11y();
    }
    /**
     * Specifies the value of the selected radio button.
     * @type {object}
     */


    get value() {
      return this._value;
    }

    set value(value) {
      this._value = value;
    }

    get radioButtonElements() {
      return this.template.querySelectorAll('input');
    }
    /**
     * If present, the radio group is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */


    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);
    }
    /**
     * If present, a radio button must be selected before the form can be submitted.
     * @type {boolean}
     * @default false
     */


    get required() {
      return this._required;
    }

    set required(value) {
      this._required = normalizeBoolean(value);
    }

    get i18n() {
      return i18n;
    }

    get transformedOptions() {
      const {
        options,
        value
      } = this;

      if (Array.isArray(options)) {
        return options.map((option, index) => ({
          label: option.label,
          value: option.value,
          isChecked: value === option.value,
          indexId: `radio-${index}`
        }));
      }

      return [];
    }

    get isRadio() {
      return this.normalizedType === 'radio';
    }

    get isButton() {
      return this.normalizedType === 'button';
    }

    get normalizedType() {
      return normalizeString(this.type, {
        fallbackValue: 'radio',
        validValues: ['radio', 'button']
      });
    }
    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     */


    get validity() {
      return this._constraint.validity;
    }
    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the radio group has any validity errors.
     */


    checkValidity() {
      return this._constraint.checkValidity();
    }
    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */


    reportValidity() {
      return this._constraint.reportValidity(message => {
        this._helpMessage = message;
      });
    }
    /**
     * Sets a custom error message to be displayed when the radio group value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message
     *     is reset.
     */


    setCustomValidity(message) {
      this._constraint.setCustomValidity(message);
    }
    /**
     * Shows the help message if the form control is in an invalid state.
     */


    showHelpMessageIfInvalid() {
      this.reportValidity();
    }
    /**
     * Sets focus on the first radio input element.
     */


    focus() {
      const firstRadio = this.template.querySelector('input');

      if (firstRadio) {
        firstRadio.focus();
      }
    }

    handleFocus() {
      this.interactingState.enter();
      this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
      this.interactingState.leave();
      this.dispatchEvent(new CustomEvent('blur'));
    }

    handleChange(event) {
      event.stopPropagation(); // Stop input element from propagating event up and instead propagate from radio group

      this.interactingState.interacting();
      const value = Array.from(this.radioButtonElements).filter(radioButton => radioButton.checked).map(radioButton => radioButton.value).toString();
      this._value = value;
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value
        },
        composed: true,
        bubbles: true,
        cancelable: true
      }));
    }

    get computedUniqueHelpElementId() {
      return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get _constraint() {
      if (!this._constraintApi) {
        this._constraintApi = new FieldConstraintApi(() => this, {
          valueMissing: () => !this.disabled && this.required && isEmptyString(this.value)
        });
      }

      return this._constraintApi;
    }

  }

  Engine.registerDecorators(LightningRadioGroup, {
    publicProps: {
      type: {
        config: 0
      },
      label: {
        config: 0
      },
      options: {
        config: 0
      },
      messageWhenValueMissing: {
        config: 0
      },
      name: {
        config: 0
      },
      value: {
        config: 3
      },
      disabled: {
        config: 3
      },
      required: {
        config: 3
      },
      validity: {
        config: 1
      }
    },
    publicMethods: ["checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid", "focus"],
    track: {
      _required: 1,
      _disabled: 1,
      _helpMessage: 1,
      _value: 1
    }
  });

  var radioGroup = Engine.registerComponent(LightningRadioGroup, {
    tmpl: _tmpl$4
  });

  var labelButtonAlternativeText = 'Help';

  function tmpl$4($api, $cmp, $slotset, $ctx) {
    const {
      h: api_element
    } = $api;
    return [api_element("div", {
      classMap: {
        "slds-popover__body": true
      },
      key: 2
    }, [])];
  }

  var _tmpl$5 = Engine.registerTemplate(tmpl$4);
  tmpl$4.stylesheets = [];
  tmpl$4.stylesheetTokens = {
    hostAttribute: "lightning-primitiveBubble_primitiveBubble-host",
    shadowAttribute: "lightning-primitiveBubble_primitiveBubble"
  };

  const DEFAULT_ALIGN = {
    horizontal: 'left',
    vertical: 'bottom'
  };

  class LightningPrimitiveBubble extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.state = {
        visible: false,
        contentId: ''
      };
      this.divElement = void 0;
    }

    get contentId() {
      return this.state.contentId;
    }

    set contentId(value) {
      this.state.contentId = value;

      if (this.state.inDOM) {
        this.divEl.setAttribute('id', this.state.contentId);
      }
    }

    connectedCallback() {
      this.updateClassList();
      this.state.inDOM = true;
    }

    disconnectedCallback() {
      this.state.inDOM = false;
    }

    renderedCallback() {
      // set content manually once rendered
      // - this is required to avoid the content update being in the wrong 'tick'
      this.setContentManually();
      this.setIdManually();
    }

    set content(value) {
      this.state.content = value;

      if (this.state.inDOM) {
        this.setContentManually();
      }
    }

    get content() {
      return this.state.content || '';
    }

    get align() {
      return this.state.align || DEFAULT_ALIGN;
    }

    set align(value) {
      this.state.align = value;
      this.updateClassList();
    }

    get visible() {
      return this.state.visible;
    }

    set visible(value) {
      this.state.visible = value;
      this.updateClassList();
    }

    setIdManually() {
      this.divElement = this.divElement ? this.divElement : this.template.querySelector('div');
      this.divElement.setAttribute('id', this.state.contentId);
    } // manually set the content value


    setContentManually() {
      /* manipulate DOM directly */
      this.template.querySelector('.slds-popover__body').textContent = this.state.content;
    } // compute class value for this bubble


    updateClassList() {
      const classes = classSet('slds-popover').add('slds-popover_tooltip'); // show or hide bubble

      classes.add({
        'slds-rise-from-ground': this.visible,
        'slds-fall-into-ground': !this.visible
      }); // apply the proper nubbin CSS class

      const {
        horizontal,
        vertical
      } = this.align;
      classes.add({
        'slds-nubbin_top-left': horizontal === 'left' && vertical === 'top',
        'slds-nubbin_top-right': horizontal === 'right' && vertical === 'top',
        'slds-nubbin_bottom-left': horizontal === 'left' && vertical === 'bottom',
        'slds-nubbin_bottom-right': horizontal === 'right' && vertical === 'bottom',
        'slds-nubbin_bottom': horizontal === 'center' && vertical === 'bottom',
        'slds-nubbin_top': horizontal === 'center' && vertical === 'top',
        'slds-nubbin_left': horizontal === 'left' && vertical === 'center',
        'slds-nubbin_right': horizontal === 'right' && vertical === 'center'
      });
      classListMutation(this.classList, classes);
    }

  }

  Engine.registerDecorators(LightningPrimitiveBubble, {
    publicProps: {
      contentId: {
        config: 3
      },
      content: {
        config: 3
      },
      align: {
        config: 3
      },
      visible: {
        config: 3
      }
    },
    track: {
      state: 1
    }
  });

  var primitiveBubble = Engine.registerComponent(LightningPrimitiveBubble, {
    tmpl: _tmpl$5
  });

  function tmpl$5($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      d: api_dynamic,
      h: api_element,
      gid: api_scoped_id
    } = $api;
    return [api_element("div", {
      classMap: {
        "slds-form-element__icon": true
      },
      key: 2
    }, [api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-button_icon": true
      },
      attrs: {
        "type": "button",
        "aria-describedby": api_scoped_id($cmp.computedBubbleUniqueId)
      },
      key: 3
    }, [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "svgClass": $cmp.computedSvgClass,
        "iconName": $cmp.computedIconName,
        "variant": "bare"
      },
      key: 4
    }, []), api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 5
    }, [api_dynamic($cmp.i18n.buttonAlternativeText)])])])];
  }

  var _tmpl$6 = Engine.registerTemplate(tmpl$5);
  tmpl$5.stylesheets = [];
  tmpl$5.stylesheetTokens = {
    hostAttribute: "lightning-helptext_helptext-host",
    shadowAttribute: "lightning-helptext_helptext"
  };

  const isiOS = !!navigator.platform && ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;

  function getBubbleAlignAndPosition(triggerBoundingClientRect, bubbleBoundingClientRect, defaultAlign, shiftAmounts, availableHeight, availableWidth, xOffset, yOffset) {
    let align = {
      horizontal: defaultAlign.horizontal,
      vertical: defaultAlign.vertical
    };
    let positionAt = {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
    const bubbleOverflows = getBubbleOverflows(triggerBoundingClientRect, bubbleBoundingClientRect, shiftAmounts, availableWidth, availableHeight); // evaluate where the bubble should be positioned

    const alignAndPosition = calculateAlignAndPosition(align, positionAt, bubbleOverflows, triggerBoundingClientRect, bubbleBoundingClientRect, availableWidth, availableHeight);
    align = alignAndPosition.alignment;
    positionAt = alignAndPosition.positioning;
    const result = {
      align
    }; // assign default values for position bottom & left based on trigger element if needed
    // - default anchor point of popover is bottom center attached to trigger element's top center

    positionAt.bottom = positionAt.top || positionAt.top === 0 ? null : availableHeight - triggerBoundingClientRect.top; // set the left positioning default according to vertical alignment when needed

    let defaultLeft = align.vertical === 'center' ? triggerBoundingClientRect.right : triggerBoundingClientRect.left; // don't use the default if we already have a value

    if (positionAt.left) {
      defaultLeft = positionAt.left;
    }

    positionAt.left = positionAt.right || positionAt.right === 0 ? null : defaultLeft;
    const shiftByVertical = align.vertical === 'center' ? 0 : shiftAmounts.vertical;
    let shiftByHorizontal = align.horizontal === 'center' ? 0 : shiftAmounts.horizontal; // Change horizontal shift value to opposite value (negative or positive)
    // :: needed to push the bubble away from the trigger instead of into it when positioned on left or right

    if (align.vertical === 'center') {
      shiftByHorizontal *= -1;
    } // apply calculated position values


    result.top = positionAt.top ? positionAt.top + shiftByVertical + yOffset + 'px' : positionAt.top;
    result.right = positionAt.right ? positionAt.right - shiftByHorizontal - xOffset + 'px' : positionAt.right;
    result.bottom = positionAt.bottom ? positionAt.bottom + shiftByVertical - yOffset + 'px' : positionAt.bottom;
    result.left = positionAt.left ? positionAt.left - shiftByHorizontal + xOffset + 'px' : positionAt.left;
    return result;
  }
  function getNubbinShiftAmount(nubbinComputedStyles, triggerWidth) {
    // calculate smallest positive value of horizontal nubbin distance, right or left
    // - the nubbin is the pointy element on the bubble
    const nubbinShiftLeft = parseInt(nubbinComputedStyles.left, 10) || -1;
    const nubbinShiftRight = parseInt(nubbinComputedStyles.right, 10) || -1; // check which measurement is the lesser of the two (closest to edge)

    let nubbinShift = nubbinShiftLeft < nubbinShiftRight ? nubbinShiftLeft : nubbinShiftRight; // use the positive, greater than zero, shift value

    if (nubbinShift < 0 && nubbinShiftLeft < 0 && nubbinShiftRight > 0) {
      nubbinShift = nubbinShiftRight;
    }

    if (nubbinShift < 0 && nubbinShiftRight < 0 && nubbinShiftLeft > 0) {
      nubbinShift = nubbinShiftLeft;
    }

    return {
      horizontal: nubbinShift - triggerWidth / 2,
      // prettier-ignore
      vertical: parseInt(nubbinComputedStyles.height, 10)
    };
  } //
  // Utility functions (for reduced complexity)
  //

  function getBubbleOverflows(triggerBoundingClientRect, bubbleBoundingClientRect, shiftAmounts, availableWidth, availableHeight) {
    const bubbleOverflows = {}; // evaluate in which directions the bubble overflows
    // is the bubble overflowing if positioned above the trigger?

    bubbleOverflows.top = triggerBoundingClientRect.top - (bubbleBoundingClientRect.height + shiftAmounts.vertical) < 0; // is the bubble overflowing if halfway positioned above the trigger?
    // :: useful for vertical center calculation

    bubbleOverflows.topCenter = triggerBoundingClientRect.top - bubbleBoundingClientRect.height / 2 < 0; // is the bubble overflowing if positioned below the trigger?

    bubbleOverflows.bottom = triggerBoundingClientRect.bottom + bubbleBoundingClientRect.height + shiftAmounts.vertical > availableHeight; // is the bubble overflowing if positioned to the right of the trigger?

    bubbleOverflows.right = triggerBoundingClientRect.left + bubbleBoundingClientRect.width > availableWidth; // is the bubble overflowing if halfway positioned to the right of the trigger?
    // :: useful for horizontal center calculation

    bubbleOverflows.rightCenter = triggerBoundingClientRect.left + bubbleBoundingClientRect.width / 2 > availableWidth; // is the bubble overflowing if positioned to the left of the trigger?

    bubbleOverflows.left = triggerBoundingClientRect.right - bubbleBoundingClientRect.width < 0; // is the bubble overflowing if halfway positioned to the left of the trigger?
    // :: useful for horizontal center calculation

    bubbleOverflows.leftCenter = triggerBoundingClientRect.right - bubbleBoundingClientRect.width / 2 < 0;
    return bubbleOverflows;
  }

  function calculateAlignAndPosition(align, positionAt, bubbleOverflows, triggerBoundingClientRect, bubbleBoundingClientRect, availableWidth, availableHeight) {
    let bubbleIsVerticallyCentered = false; // if enough space to be vertically centered from top

    if (bubbleOverflows.top && !bubbleOverflows.topCenter) {
      align.vertical = 'center'; // set the bubble to be vertically centered on the trigger
      // top position of the bubble to match the following formula:
      //  <bottom of trigger> - <half the height of trigger> - <half the height of the bubble>

      positionAt.top = triggerBoundingClientRect.bottom - triggerBoundingClientRect.height / 2 - bubbleBoundingClientRect.height / 2;
      bubbleIsVerticallyCentered = true; // if overflows upwards show below trigger
    } else if (bubbleOverflows.top) {
      align.vertical = 'top';
      positionAt.top = triggerBoundingClientRect.bottom;
    } // if overflows downward show above the trigger


    if (bubbleOverflows.bottom) {
      align.vertical = 'bottom';
      positionAt.bottom = availableHeight - triggerBoundingClientRect.top;
    } // if vertically centered and overflows left then show on right


    if (bubbleIsVerticallyCentered && bubbleOverflows.left) {
      align.horizontal = 'left';
      positionAt.left = triggerBoundingClientRect.right; // if overflows to the left show on right
    } else if (bubbleOverflows.left) {
      align.horizontal = 'left';
      positionAt.left = triggerBoundingClientRect.left;
    } // if vertically centered and overflows right then show on left


    if (bubbleIsVerticallyCentered && bubbleOverflows.right) {
      align.horizontal = 'right';
      positionAt.right = availableWidth - triggerBoundingClientRect.left; // if overflows to the right show on left
    } else if (bubbleOverflows.right) {
      align.horizontal = 'right';
      positionAt.right = availableWidth - triggerBoundingClientRect.right;
    } // only horizontally center bubble if it would overflow to the right or left


    if (bubbleOverflows.left && bubbleOverflows.right && !bubbleOverflows.leftCenter && !bubbleOverflows.rightCenter) {
      align.horizontal = 'center'; // set the bubble to be horizontally centered on the trigger
      // left position of the bubble to match the following formula:
      //  <left edge of trigger> - <half the width of trigger> - <half the width of the bubble>

      positionAt.left = triggerBoundingClientRect.left + triggerBoundingClientRect.width / 2 - bubbleBoundingClientRect.width / 2;
      positionAt.right = null;
    }

    return {
      alignment: align,
      positioning: positionAt
    };
  }

  const i18n$1 = {
    buttonAlternativeText: labelButtonAlternativeText
  }; // generate a unique ID

  const BUBBLE_ID = `salesforce-lightning-helptext-bubble_${guid()}`;
  const CACHED_BUBBLE_ELEMENT = Engine.createElement('lightning-primitive-bubble', {
    is: primitiveBubble
  });
  CACHED_BUBBLE_ELEMENT.contentId = BUBBLE_ID;
  CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
  CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
  const DEFAULT_ICON_NAME = 'utility:info';
  const DEFAULT_ANCHORING = {
    trigger: {
      horizontal: 'left',
      vertical: 'top'
    },
    bubble: {
      horizontal: 'left',
      vertical: 'bottom'
    }
  };
  /**
   * An icon with a text popover used for tooltips.
   */

  class LightningHelptext extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.content = '';
      this.iconName = DEFAULT_ICON_NAME;
      this.iconVariant = 'bare';
      this.state = {};
      this._initialRender = true;

      this.handleBrowserEvent = () => {
        // only perform changes for the currently focused/active trigger
        if (this.state.currentTrigger === true) {
          this.setBubblePosition();
        }
      };
    }

    connectedCallback() {
      // watch for resize & scroll events to recalculate when needed
      window.addEventListener('resize', this.handleBrowserEvent, false);
      window.addEventListener('scroll', this.handleBrowserEvent, true);
    }

    renderedCallback() {
      if (this._initialRender) {
        const buttonEle = this.template.querySelector('button');

        if (isiOS && 'ontouchstart' in document.documentElement) {
          buttonEle.addEventListener('touchstart', this.handleTouch.bind(this));
        } else {
          buttonEle.addEventListener('mouseover', this.handleMouseOver.bind(this));
          buttonEle.addEventListener('mouseout', this.handleMouseOut.bind(this));
          buttonEle.addEventListener('focusin', this.handleFocus.bind(this));
          buttonEle.addEventListener('focusout', this.handleBlur.bind(this));
        }
      }

      this._initialRender = false;
    }

    disconnectedCallback() {
      // remove event listeners
      window.removeEventListener('resize', this.handleBrowserEvent, false);
      window.removeEventListener('scroll', this.handleBrowserEvent, true); // handle the case where panels try to focus on element after closing

      if (this.state.currentTrigger === true) {
        this.hideBubble();
      }
    }

    get i18n() {
      return i18n$1;
    } // compute icon name


    get computedIconName() {
      if (isValidName(this.iconName)) {
        return this.iconName;
      }

      return DEFAULT_ICON_NAME;
    } // compute SVG CSS classes to apply to the icon


    get computedSvgClass() {
      const classes = classSet('slds-button__icon');

      switch (this.normalizedIconVariant) {
        case 'error':
          classes.add('slds-icon-text-error');
          break;

        case 'warning':
          classes.add('slds-icon-text-warning');
          break;

        case 'inverse':
        case 'bare':
          break;

        default:
          // if custom icon is set, we don't want to set
          // the text-default class
          classes.add('slds-icon-text-default');
      }

      return classes.toString();
    }

    get normalizedIconVariant() {
      // NOTE: Leaving a note here because I just wasted a bunch of time
      // investigating why both 'bare' and 'inverse' are supported in
      // lightning-primitive-icon. lightning-icon also has a deprecated
      // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
      // that no classes should be applied. So this component needs to
      // support both 'bare' and 'inverse' while lightning-icon only needs to
      // support 'inverse'.
      return normalizeString(this.iconVariant, {
        fallbackValue: 'bare',
        validValues: ['bare', 'error', 'inverse', 'warning']
      });
    }

    handleTouch() {
      if (this.state.currentTrigger === true) {
        this.hideBubble();
      } else {
        this.showBubble();
      }
    } // compute bubble's unique ID


    get computedBubbleUniqueId() {
      return BUBBLE_ID;
    } // handle mouse over event


    handleMouseOver() {
      this.showBubble();
    } // handle mouse out event


    handleMouseOut() {
      this.hideBubble();
    } // handle focus


    handleFocus() {
      this.showBubble();
    } // handle blur


    handleBlur() {
      this.hideBubble();
    } // handle resize + scroll event


    // retrieve trigger element bounding rectangle
    getTriggerBoundingRect() {
      const triggerEl = this.template.querySelector('div');
      return triggerEl ? triggerEl.getBoundingClientRect() : null;
    } // retrieve bubble element bounding rectangle (raw)


    getBubbleBoundingRect() {
      const bubbleEl = CACHED_BUBBLE_ELEMENT; // initialize position in top left corner

      bubbleEl.style.top = 0;
      bubbleEl.style.left = 0;
      bubbleEl.style.removeProperty('bottom');
      bubbleEl.style.removeProperty('right');
      return bubbleEl ? bubbleEl.getBoundingClientRect() : null;
    } // show bubble


    showBubble() {
      // set the triggered by element
      this.state.currentTrigger = true;
      const bubbleEl = CACHED_BUBBLE_ELEMENT;
      this.initBubble();
      this.setBubblePosition();
      bubbleEl.visible = true;
    } // hide bubble


    hideBubble() {
      const bubbleEl = CACHED_BUBBLE_ELEMENT; // remove the triggered by value

      this.state.currentTrigger = false;
      bubbleEl.visible = false;
    } // calculate shift amounts


    calculateShiftAmounts() {
      // only calculate once
      if (typeof this.shiftAmounts === 'undefined') {
        const bubbleEl = CACHED_BUBBLE_ELEMENT; // initialize position in top left corner

        bubbleEl.style.top = 0;
        bubbleEl.style.left = 0;
        bubbleEl.style.removeProperty('bottom');
        bubbleEl.style.removeProperty('right'); // calculate initial position of trigger element

        const triggerElRect = this.getTriggerBoundingRect(); // calculate shift to align nubbin

        const nubbinComputedStyles = window.getComputedStyle(bubbleEl, ':before') || bubbleEl.style;
        this.shiftAmounts = getNubbinShiftAmount(nubbinComputedStyles, triggerElRect.width);
      }
    } // initialize bubble element


    initBubble() {
      const bubbleEl = CACHED_BUBBLE_ELEMENT; // set the content value

      bubbleEl.content = this.content; // check if bubble element is already in DOM

      if (bubbleEl.parentNode === null) {
        document.body.appendChild(bubbleEl);
      }

      this.calculateShiftAmounts();
    } // set the position of the bubble relative to its target


    setBubblePosition() {
      const rootEl = document.documentElement;
      const bubbleEl = CACHED_BUBBLE_ELEMENT;
      const result = getBubbleAlignAndPosition(this.getTriggerBoundingRect(), this.getBubbleBoundingRect(), DEFAULT_ANCHORING.bubble, this.shiftAmounts, rootEl.clientHeight || window.innerHeight, rootEl.clientWidth || window.innerWidth, window.pageXOffset, window.pageYOffset);
      bubbleEl.align = result.align;
      bubbleEl.style.top = result.top;
      bubbleEl.style.right = result.right;
      bubbleEl.style.bottom = result.bottom;
      bubbleEl.style.left = result.left;
    }

  }

  Engine.registerDecorators(LightningHelptext, {
    publicProps: {
      content: {
        config: 0
      },
      iconName: {
        config: 0
      },
      iconVariant: {
        config: 0
      }
    },
    track: {
      state: 1
    }
  });

  var helptext = Engine.registerComponent(LightningHelptext, {
    tmpl: _tmpl$6
  });

  function stylesheet$2(hostSelector, shadowSelector, nativeShadow) {
    return "slot" + shadowSelector + " {display: inline-block;}\n";
  }
  var _implicitStylesheets$2 = [stylesheet$2];

  function tmpl$6($api, $cmp, $slotset, $ctx) {
    const {
      s: api_slot
    } = $api;
    return [api_slot("", {
      key: 2
    }, [], $slotset)];
  }

  var _tmpl$7 = Engine.registerTemplate(tmpl$6);
  tmpl$6.slots = [""];
  tmpl$6.stylesheets = [];

  if (_implicitStylesheets$2) {
    tmpl$6.stylesheets.push.apply(tmpl$6.stylesheets, _implicitStylesheets$2);
  }
  tmpl$6.stylesheetTokens = {
    hostAttribute: "lightning-primitiveFileDroppableZone_primitiveFileDroppableZone-host",
    shadowAttribute: "lightning-primitiveFileDroppableZone_primitiveFileDroppableZone"
  };

  class LightningPrimitiveFileDroppableZone extends Engine.LightningElement {
    get disabled() {
      return this.state.disabled || false;
    }

    set disabled(value) {
      this.state.disabled = normalizeBoolean(value);
    }

    get multiple() {
      return this.state.multiple || false;
    }

    set multiple(value) {
      this.state.multiple = normalizeBoolean(value);
    }

    constructor() {
      super();
      this.state = {};
      this.template.addEventListener('dragover', this.allowDrop.bind(this));
      this.template.addEventListener('dragleave', this.handleDragLeave.bind(this));
      this.template.addEventListener('drop', this.handleOnDrop.bind(this));
    }

    connectedCallback() {
      this.classList.add('slds-file-selector__dropzone');
    }

    setDragOver(dragOver) {
      this.classList.toggle('slds-has-drag-over', dragOver);
    }

    handleDragLeave() {
      this.setDragOver(false);
    }

    handleOnDrop(event) {
      event.preventDefault();
      this.setDragOver(false);

      if (this.disabled) {
        event.stopPropagation();
        return;
      }

      if (!this.meetsMultipleCriteria(event)) {
        event.stopPropagation();
      }
    }

    allowDrop(event) {
      event.preventDefault();

      if (!this.disabled) {
        this.setDragOver(true);
      }
    }

    meetsMultipleCriteria(dragEvent) {
      const files = dragEvent.dataTransfer.files;
      return !(files.length > 1 && !this.multiple);
    }

  }

  Engine.registerDecorators(LightningPrimitiveFileDroppableZone, {
    publicProps: {
      disabled: {
        config: 3
      },
      multiple: {
        config: 3
      }
    },
    track: {
      state: 1
    }
  });

  var primitiveFileDroppableZone = Engine.registerComponent(LightningPrimitiveFileDroppableZone, {
    tmpl: _tmpl$7
  });

  var labelBInput = 'B';

  var labelBlueAbbr = 'Blue';

  var labelColorPickerInstructions = 'Use arrow keys to select a saturation and brightness, on an x and y axis.';

  var labelErrorMessage = 'Enter a valid hexadecimal value.';

  var labelGInput = 'G';

  var labelGreenAbbr = 'Green';

  var labelHexLabel = 'Hex';

  var labelHueInput = 'Select Hue';

  var labelRInput = 'R';

  var labelRedAbbr = 'Red';

  function tmpl$7($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      gid: api_scoped_id,
      h: api_element,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6,
      _m7,
      _m8,
      _m9
    } = $ctx;
    return [api_element("div", {
      classMap: {
        "slds-color-picker__custom": true
      },
      key: 2
    }, [api_element("p", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "id": api_scoped_id("color-picker-instructions")
      },
      key: 3
    }, [api_dynamic($cmp.i18n.colorPickerInstructions)]), api_element("div", {
      classMap: {
        "slds-m-bottom_small": true
      },
      style: $cmp.gradientStyle,
      attrs: {
        "data-id": "color-gradient"
      },
      key: 4,
      on: {
        "mousedown": _m3 || ($ctx._m3 = api_bind($cmp.handleMouseDown))
      }
    }, [api_element("canvas", {
      classMap: {
        "canvas": true
      },
      attrs: {
        "width": $cmp.canvasRect.x,
        "height": $cmp.canvasRect.y
      },
      key: 5
    }, []), api_element("a", {
      classMap: {
        "slds-color-picker__range-indicator": true
      },
      styleMap: {
        "position": "absolute",
        "display": "inline"
      },
      attrs: {
        "data-id": "color-anchor",
        "href": "javascript:void(0)",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "aria-describedby": `${api_scoped_id("color-picker-instructions")}`
      },
      key: 6,
      on: {
        "mousedrag": _m0 || ($ctx._m0 = api_bind($cmp.handlePreventDefault)),
        "mousedown": _m1 || ($ctx._m1 = api_bind($cmp.handlePreventDefault)),
        "keydown": _m2 || ($ctx._m2 = api_bind($cmp.handleKeydown))
      }
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 7
    }, [api_dynamic($cmp.computedSaturationAndBrightness)])])]), api_element("div", {
      classMap: {
        "slds-color-picker__hue-and-preview": true
      },
      key: 8
    }, [api_element("label", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "for": `${api_scoped_id("rainbow")}`
      },
      key: 9
    }, [api_dynamic($cmp.i18n.hueInput)]), api_element("input", {
      classMap: {
        "slds-color-picker__hue-slider": true
      },
      attrs: {
        "data-id": "hue-slider",
        "type": "range",
        "min": "0",
        "max": "360",
        "id": api_scoped_id("rainbow")
      },
      props: {
        "value": $cmp.state.hueValue
      },
      key: 10,
      on: {
        "mousedown": _m4 || ($ctx._m4 = api_bind($cmp.handleDrag)),
        "change": _m5 || ($ctx._m5 = api_bind($cmp.onChange))
      }
    }, []), api_element("span", {
      classMap: {
        "slds-swatch": true
      },
      style: $cmp.thumbnailStyle,
      attrs: {
        "data-id": "color-preview"
      },
      key: 11
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "aria-hidden": "true"
      },
      key: 12
    }, [api_dynamic($cmp.state.hex)])])]), api_element("div", {
      classMap: {
        "slds-color-picker__custom-inputs": true
      },
      key: 13
    }, [api_element("div", {
      classMap: {
        "slds-form-element": true,
        "slds-color-picker__input-custom-hex": true
      },
      key: 14
    }, [api_element("label", {
      classMap: {
        "slds-form-element__label": true
      },
      attrs: {
        "for": `${api_scoped_id("input")}`
      },
      key: 15
    }, [api_dynamic($cmp.i18n.hexLabel)]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 16
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "data-primary-input": true,
        "type": "text",
        "id": api_scoped_id("input"),
        "minlength": "4",
        "maxlength": "7",
        "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        "placeholder": "#FFFFFF"
      },
      props: {
        "value": $cmp.state.hex
      },
      key: 17,
      on: {
        "change": _m6 || ($ctx._m6 = api_bind($cmp.handleHexChange))
      }
    }, [])])]), api_element("div", {
      classMap: {
        "slds-form-element": true
      },
      key: 18
    }, [api_element("label", {
      classMap: {
        "slds-form-element__label": true
      },
      attrs: {
        "for": `${api_scoped_id("red")}`
      },
      key: 19
    }, [api_element("abbr", {
      attrs: {
        "title": $cmp.i18n.redAbbr
      },
      key: 20
    }, [api_dynamic($cmp.i18n.rInput)])]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 21
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": "text",
        "id": api_scoped_id("red"),
        "data-color-name": "red",
        "placeholder": "255"
      },
      props: {
        "value": $cmp.state.rgb.red
      },
      key: 22,
      on: {
        "change": _m7 || ($ctx._m7 = api_bind($cmp.handleRgbChange))
      }
    }, [])])]), api_element("div", {
      classMap: {
        "slds-form-element": true
      },
      key: 23
    }, [api_element("label", {
      classMap: {
        "slds-form-element__label": true
      },
      attrs: {
        "for": `${api_scoped_id("green")}`
      },
      key: 24
    }, [api_element("abbr", {
      attrs: {
        "title": $cmp.i18n.greenAbbr
      },
      key: 25
    }, [api_dynamic($cmp.i18n.gInput)])]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 26
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": "text",
        "id": api_scoped_id("green"),
        "data-color-name": "green",
        "placeholder": "255"
      },
      props: {
        "value": $cmp.state.rgb.green
      },
      key: 27,
      on: {
        "change": _m8 || ($ctx._m8 = api_bind($cmp.handleRgbChange))
      }
    }, [])])]), api_element("div", {
      classMap: {
        "slds-form-element": true
      },
      key: 28
    }, [api_element("label", {
      classMap: {
        "slds-form-element__label": true
      },
      attrs: {
        "for": `${api_scoped_id("blue")}`
      },
      key: 29
    }, [api_element("abbr", {
      attrs: {
        "title": $cmp.i18n.blueAbbr
      },
      key: 30
    }, [api_dynamic($cmp.i18n.bInput)])]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 31
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": "text",
        "id": api_scoped_id("blue"),
        "data-color-name": "blue",
        "placeholder": "255"
      },
      props: {
        "value": $cmp.state.rgb.blue
      },
      key: 32,
      on: {
        "change": _m9 || ($ctx._m9 = api_bind($cmp.handleRgbChange))
      }
    }, [])])])]), $cmp.state.errorMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "aria-live": "assertive"
      },
      key: 34
    }, [api_dynamic($cmp.state.errorMessage)]) : null])];
  }

  var _tmpl$8 = Engine.registerTemplate(tmpl$7);
  tmpl$7.stylesheets = [];
  tmpl$7.stylesheetTokens = {
    hostAttribute: "lightning-colorPickerCustom_colorPickerCustom-host",
    shadowAttribute: "lightning-colorPickerCustom_colorPickerCustom"
  };

  function fullHexValue(hex) {
    if (hex && hex.length <= 6 && hex.charAt(0) !== '#') {
      hex = '#' + hex;
    }

    const isInputValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

    if (!isInputValid) {
      hex = '#000000';
    } // Converting 3 digit hex color to 6 digit hex color


    if (hex.length === 4) {
      hex = '#' + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3);
    }

    return hex;
  }
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHexValue(hex));

    if (!result) {
      return null;
    }

    return {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    };
  }
  function rgbToHex(rgb) {
    const r = rgb.red;
    const g = rgb.green;
    const b = rgb.blue;
    const bin = r << 16 | g << 8 | b;
    return function (hex) {
      return new Array(7 - hex.length).join('0') + hex;
    }(bin.toString(16).toUpperCase());
  }
  function rgbToHsl(rgb) {
    const r1 = rgb.red / 255;
    const g1 = rgb.green / 255;
    const b1 = rgb.blue / 255;
    const maxColor = Math.max(r1, g1, b1);
    const minColor = Math.min(r1, g1, b1); // Calculate L:

    let L = (maxColor + minColor) / 2;
    let S = 0;
    let H = 0;

    if (maxColor !== minColor) {
      // Calculate S:
      if (L < 0.5) {
        S = (maxColor - minColor) / (maxColor + minColor);
      } else {
        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
      } // Calculate H:


      if (r1 === maxColor) {
        const x = g1 - b1,
              y = maxColor - minColor;
        H = x / y;
      } else if (g1 === maxColor) {
        const x = b1 - r1,
              y = maxColor - minColor,
              z = x / y;
        H = 2.0 + z;
      } else {
        const x = r1 - g1,
              y = maxColor - minColor,
              z = x / y;
        H = 4.0 + z;
      }
    }

    L *= 100;
    S *= 100;
    H *= 60;

    if (H < 0) {
      H += 360;
    }

    const result = {
      hue: H,
      saturation: S,
      lightness: L
    };
    return result;
  }
  function rgbToPosition(rgb, canvas) {
    const hsv = rgbToHsv(rgb);
    const saturation = hsv.saturation / 100,
          brightness = hsv.brightness / 100;
    const x = canvas.x * saturation;
    const y = canvas.y * (1 - brightness);
    return {
      x,
      y
    };
  }
  function rgbToHsv(rgb) {
    const r = rgb.red / 255;
    const g = rgb.green / 255;
    const b = rgb.blue / 255;
    const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
    const d = max - min,
          s = max === 0 ? 0 : d / max,
          v = max;
    let h, x, y;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          x = g - b;
          y = x / d;
          h = y + (g < b ? 6 : 0);
          break;

        case g:
          x = b - r;
          y = x / d;
          h = y + 2;
          break;

        case b:
          x = r - g;
          y = x / d;
          h = y + 4;
          break;

        default:
          break;
      }

      h /= 6;
    }

    const result = {
      hue: h * 360,
      saturation: s * 100,
      brightness: v * 100
    };
    return result;
  }

  const i18n$2 = {
    bInput: labelBInput,
    blueAbbr: labelBlueAbbr,
    colorPickerInstructions: labelColorPickerInstructions,
    errorMessage: labelErrorMessage,
    gInput: labelGInput,
    greenAbbr: labelGreenAbbr,
    hexLabel: labelHexLabel,
    hueInput: labelHueInput,
    rInput: labelRInput,
    redAbbr: labelRedAbbr
  };
  const CANVAS = {
    x: 198,
    y: 80
  };

  class LightningColorPickerCustom extends Engine.LightningElement {
    constructor() {
      super();
      this.state = {
        hueValue: null,
        rgb: {
          red: '86',
          green: '121',
          blue: '192'
        },
        hex: '#5679C0',
        errorMessage: null,
        currentColor: null
      };
      this._initialized = false;
      this.uniqueId = generateUniqueId();
    }

    renderedCallback() {
      if (!this._initialized) {
        this.focus();
        this.gradient();
        this.handleUpdateAnchor();
        this._initialized = true;
      }
    }

    get currentColor() {
      return this.state.currentColor;
    }

    set currentColor(value) {
      const fullHex = fullHexValue(value);
      this.state.currentColor = value;
      this.state.hex = fullHex;
      this.state.rgb = hexToRgb(fullHex);
    }

    focus() {
      this.anchorElement.focus();
    }

    get i18n() {
      return i18n$2;
    }

    get thumbnailStyle() {
      return `background: ${this.state.hex || 'hsl(220, 46%, 55%)'};`;
    }

    get gradientStyle() {
      return `background: ${this.state.hex || 'rgb(0, 85, 255)'}; position: relative;`;
    }

    get canvasRect() {
      return CANVAS;
    }

    get anchorElement() {
      return this.template.querySelector('*[data-id="color-anchor"]');
    }

    get thumbnailElement() {
      return this.template.querySelector('*[data-id="color-preview"]');
    }

    get gradientElement() {
      return this.template.querySelector('*[data-id="color-gradient"]');
    }

    get computedSaturationAndBrightness() {
      const rgb = this.state.rgb;
      const saturation = rgbToHsv(rgb).saturation || 0;
      const brightness = rgbToHsv(rgb).brightness || 0;
      return `Saturation: ${saturation.toFixed()}%. Brightness: ${brightness.toFixed()}%.`;
    }

    handlePreventDefault(event) {
      event.preventDefault();
    }

    selectColor(event) {
      this.dispatchEvent( // eslint-disable-next-line lightning-global/no-custom-event-bubbling
      new CustomEvent('updatecolor', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          color: event.target.innerText
        }
      }));
    }

    handleMouseDown(event) {
      event.preventDefault();
      this.onMouseDrag(event, true);
    }

    handleDrag(event) {
      this.onMouseDrag(event, false);
    }

    onChange() {
      this.rainbowCursor();
    }

    parseAndLimit(value) {
      let out = value;

      if (!value || parseInt(value, 10) < 0 || isNaN(value)) {
        out = 0;
      } else if (parseInt(value, 10) > 255) {
        out = 255;
      }

      return out;
    }

    handleRgbChange(event) {
      const value = this.parseAndLimit(event.currentTarget.value); // Fix for no rerender on second bad value attempt

      event.currentTarget.value = value;

      if (event.currentTarget.getAttribute('data-color-name') === 'red') {
        this.state.rgb.red = value;
      } else if (event.currentTarget.getAttribute('data-color-name') === 'green') {
        this.state.rgb.green = value;
      } else if (event.currentTarget.getAttribute('data-color-name') === 'blue') {
        this.state.rgb.blue = value;
      }

      const rgb = this.state.rgb;
      const hue = rgbToHsl(rgb).hue;
      const position = this.rgbToPosition(rgb);
      const selectedColor = `#${rgbToHex(rgb)}`;
      this.updateRainbow(hue);
      this.setCanvasColor(hue);
      this.setCanvasCursor(position.x, position.y);
      this.updateSelectedColor(selectedColor);
    }

    handleHexChange(event) {
      const isInputValid = event.srcElement.validity.valid;

      if (isInputValid) {
        const selectedColor = fullHexValue(event.target.value);
        this.classList.remove('slds-has-error');
        this.state.errorMessage = null;
        const rgb = hexToRgb(selectedColor);
        this.state.rgb = rgb;
        const hue = rgbToHsl(rgb).hue;
        const position = this.rgbToPosition(rgb);
        this.updateRainbow(hue);
        this.setCanvasColor(hue);
        this.setCanvasCursor(position.x, position.y);
        this.updateSelectedColor(selectedColor);
      } else {
        event.srcElement.classList.add('slds-has-error');
        this.state.errorMessage = getErrorMessage(event.srcElement.validity, {
          patternMismatch: this.i18n.errorMessage
        });
      }
    }

    updateSelectedColor(selectedColor) {
      this.template.querySelector(`[data-primary-input]`).classList.remove('slds-has-error');
      this.state.errorMessage = null;
      this.state.hex = selectedColor;
      this.dispatchEvent( // eslint-disable-next-line lightning-global/no-custom-event-bubbling
      new CustomEvent('updateselectedcolor', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          color: selectedColor
        }
      }));
    }

    onMouseDrag(event, isGradientCursor) {
      const that = this;
      let drag = false;

      if (isGradientCursor) {
        this.getColorFromGradient(event);
      } else {
        this.rainbowCursor();
      }

      if (this._mousedown && this._mousemove && this._mouseup) {
        return;
      }

      that._mousedown = function () {
        drag = true;
        this._cursorActive = true;
      };

      that._mouseup = function () {
        drag = false;
        this._cursorActive = false;
        window.removeEventListener('mousedown', that._mousedown);
        window.removeEventListener('mouseup', that._mouseup);
        window.removeEventListener('mousemove', that._mousemove);
        that._mousedown = null;
        that._mouseup = null;
        that._mousemove = null;
      };

      that._mousemove = function (evt) {
        if (drag && isGradientCursor) {
          that.getColorFromGradient(evt);
        } else if (drag) {
          that.rainbowCursor();
        }
      };

      window.addEventListener('mousedown', that._mousedown);
      window.addEventListener('mouseup', that._mouseup);
      window.addEventListener('mousemove', that._mousemove);
    }

    gradient() {
      const hue = rgbToHsl(this.state.rgb).hue;
      this.canvasContext();
      this.setCanvasColor(hue);
      this.updateRainbow(hue);
    }

    getColorFromGradient(event) {
      let cursorPosition;

      if (event.type === 'keydown' && event.key !== 'Tab') {
        cursorPosition = this.gradientCursorPositionFromKeydown(event);
      } else if (event.type === 'mousedown' || event.type === 'mousemove') {
        cursorPosition = this.gradientCursorPosition(event);
      } else {
        return;
      }

      const x = cursorPosition.x;
      const y = cursorPosition.y; // Get the current HUE value and update the canvas & cursor

      this.setCanvasColor(this.state.hueValue); // set color from gradient

      this.setRGBValues(x, y);
    }

    rainbowCursor() {
      const rainbow = this.template.querySelector('*[data-id="hue-slider"]');
      const position = this._cachePosition || this.rgbToPosition(this.state.rgb);
      this.setCanvasColor(rainbow.value);
      this.setRGBValues(position.x, position.y);
      this.updateRainbow(rainbow.value);
    }

    updateRainbow(hue) {
      this.state.hueValue = hue;
    }

    handleUpdateAnchor() {
      const position = this._cachePosition || this.rgbToPosition(this.state.rgb);
      const anchor = this.anchorElement;
      const offset = anchor.offsetWidth / 2;
      const x = position.x - offset + 5;
      const y = position.y - offset - 5;
      const xPercent = x / this._canvas.width * 100;
      const yPercent = y / this._canvas.height * 100;
      anchor.style.left = `${xPercent}%`;
      anchor.style.top = `${yPercent}%`;
    }

    gradientCursorPosition(event) {
      const canvas = this._canvas;
      const gradientCanvas = canvas.getBoundingClientRect();
      let x = event.clientX - gradientCanvas.left;
      let y = event.clientY - gradientCanvas.top;

      if (x > gradientCanvas.width) {
        x = gradientCanvas.width - 1;
      }

      if (x < 0) {
        x = 0;
      }

      if (y > gradientCanvas.height) {
        y = gradientCanvas.height;
      }

      if (y < 0) {
        y = 0;
      }
      /*
       * Caching the position x & y in the component so that we can use it when moving the rainbow slider
       * instead of calculating the position of x & y each time.
       */


      this._cachePosition = {
        x,
        y
      };
      return {
        x,
        y
      };
    }

    gradientCursorPositionFromKeydown(event) {
      event.preventDefault();
      const canvas = this._canvas;
      const gradientCanvas = canvas.getBoundingClientRect();
      const keyCode = event.keyCode;
      let x, y;

      if (!this._cachePosition) {
        this._cachePosition = this.rgbToPosition(this.state.rgb);
      }

      const positionMap = {};
      positionMap[keyCodes.left] = {
        x: -1,
        y: 0
      };
      positionMap[keyCodes.up] = {
        x: 0,
        y: -1
      };
      positionMap[keyCodes.right] = {
        x: +1,
        y: 0
      };
      positionMap[keyCodes.down] = {
        x: 0,
        y: +1
      };
      const transform = positionMap[keyCode] ? positionMap[keyCode] : {
        x: 0,
        y: 0
      };
      x = this._cachePosition.x + transform.x;
      y = this._cachePosition.y + transform.y;

      if (x > gradientCanvas.width) {
        x = gradientCanvas.width - 1;
      }

      if (x < 0) {
        x = 0;
      }

      if (y > gradientCanvas.height) {
        y = gradientCanvas.height;
      }

      if (y < 0) {
        y = 0;
      }
      /*
       * Caching the position x & y in the component so that we can use it when moving the rainbow slider
       * instead of calculating the position of x & y each time.
       */


      this._cachePosition = {
        x,
        y
      };
      return {
        x,
        y
      };
    }

    setRGBValues(x, y) {
      const ctx = this._canvasCtx;
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const rgb = {
        red: imageData[0],
        green: imageData[1],
        blue: imageData[2]
      };
      const color = `#${rgbToHex(rgb)}`;
      this.state.rgb = rgb;
      this.updateSelectedColor(color);
      this.handleUpdateAnchor();
    }

    setCanvasColor(hue) {
      const ctx = this._canvasCtx;
      const white = ctx.createLinearGradient(0, 0, this.canvasRect.x, 0);
      white.addColorStop(0, 'rgb(255,255,255)');
      white.addColorStop(1, 'hsl(' + hue + ', 100%, 50%)');
      ctx.fillStyle = white;
      ctx.fillRect(0, 0, this.canvasRect.x, this.canvasRect.y);
      const black = ctx.createLinearGradient(0, 0, 0, this.canvasRect.y);
      black.addColorStop(0, 'rgba(0,0,0,0)');
      black.addColorStop(1, 'rgb(0,0,0)');
      ctx.fillStyle = black;
      ctx.fillRect(0, 0, this.canvasRect.x, this.canvasRect.y);
    }

    setCanvasCursor(x, y) {
      const position = {
        x,
        y
      };
      const anchor = this.anchorElement;
      const offset = anchor.offsetWidth / 2;
      x = position.x - offset + 5;
      y = position.y - offset - 5;
      const xPercent = x / this._canvas.width * 100;
      const yPercent = y / this._canvas.height * 100;
      anchor.style.left = `${xPercent}%`;
      anchor.style.top = `${yPercent}%`;
    }

    canvasContext() {
      this._canvas = document.querySelector('.canvas'); // Bug: this.template breaks gradient

      this._canvasCtx = this._canvas.getContext('2d');
      this._cursorActive = false;
    }

    handleKeydown(event) {
      this.getColorFromGradient(event);
    }

    rgbToPosition(rgb) {
      return rgbToPosition(rgb, this.canvasRect);
    }

  }

  Engine.registerDecorators(LightningColorPickerCustom, {
    publicProps: {
      currentColor: {
        config: 3
      }
    },
    publicMethods: ["focus"],
    track: {
      state: 1
    }
  });

  var colorPickerCustom = Engine.registerComponent(LightningColorPickerCustom, {
    tmpl: _tmpl$8
  });

  var labelCancelButton = 'Cancel';

  var labelCustomTab = 'Custom';

  var labelDefaultTab = 'Default';

  var labelDoneButton = 'Done';

  function tmpl$8($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      gid: api_scoped_id,
      h: api_element,
      d: api_dynamic,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3
    } = $ctx;
    return [api_element("section", {
      classMap: {
        "slds-popover": true,
        "slds-color-picker__selector": true,
        "slds-show": true,
        "slds-is-absolute": true
      },
      attrs: {
        "role": "dialog",
        "aria-label": "Choose a color",
        "aria-describedby": `${api_scoped_id("dialog-body-id")}`
      },
      key: 2,
      on: {
        "updateselectedcolor": _m2 || ($ctx._m2 = api_bind($cmp.handleUpdateSelectedColor)),
        "keydown": _m3 || ($ctx._m3 = api_bind($cmp.handleKeydown))
      }
    }, [api_element("div", {
      classMap: {
        "slds-popover__body": true
      },
      attrs: {
        "id": api_scoped_id("dialog-body-id")
      },
      key: 3
    }, [api_custom_element("lightning-color-picker-custom", colorPickerCustom, {
      props: {
        "currentColor": $cmp.currentColor
      },
      key: 4
    }, [])]), api_element("footer", {
      classMap: {
        "slds-popover__footer": true
      },
      key: 5
    }, [api_element("div", {
      classMap: {
        "slds-color-picker__selector-footer": true
      },
      key: 6
    }, [api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-button_neutral": true
      },
      attrs: {
        "name": "cancel"
      },
      key: 7,
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.handleCancelClick))
      }
    }, [api_dynamic($cmp.i18n.cancelButton)]), api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-button_brand": true
      },
      attrs: {
        "name": "done"
      },
      key: 8,
      on: {
        "click": _m1 || ($ctx._m1 = api_bind($cmp.handleDoneClick))
      }
    }, [api_dynamic($cmp.i18n.doneButton)])])])])];
  }

  var _tmpl$9 = Engine.registerTemplate(tmpl$8);
  tmpl$8.stylesheets = [];
  tmpl$8.stylesheetTokens = {
    hostAttribute: "lightning-colorPickerPanel_colorPickerPanel-host",
    shadowAttribute: "lightning-colorPickerPanel_colorPickerPanel"
  };

  const i18n$3 = {
    cancelButton: labelCancelButton,
    customTab: labelCustomTab,
    defaultTab: labelDefaultTab,
    doneButton: labelDoneButton
  };
  const DEFAULT_COLOR = '#000000';

  class LightningColorPickerPanel extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.currentColor = void 0;
      this.state = {
        isCustomTabActive: false,
        selectedColor: null
      };
    }

    connectedCallback() {
      this.state.selectedColor = this.currentColor || DEFAULT_COLOR;
    }

    get i18n() {
      return i18n$3;
    }

    get computedClassDefault() {
      return classSet({
        'slds-tabs_default__item': true,
        'slds-is-active': !this.state.isCustomTabActive
      }).toString();
    }

    get computedClassCustom() {
      return classSet({
        'slds-tabs_default__item': true,
        'slds-is-active': this.state.isCustomTabActive
      }).toString();
    }

    get ariaSelectedDefault() {
      return !this.state.isCustomTabActive.toString();
    }

    get ariaSelectedCustom() {
      return this.state.isCustomTabActive.toString();
    }

    handleTabChange(event) {
      event.preventDefault();
      const tabElement = event.currentTarget;

      if (tabElement.classList.contains('slds-is-active')) {
        return;
      }

      this.state.isCustomTabActive = tabElement.title !== i18n$3.defaultTab;
    }

    handleUpdateSelectedColor(event) {
      this.state.selectedColor = event.detail.color;
    }

    dispatchUpdateColorEventWithColor(color) {
      this.dispatchEvent( // eslint-disable-next-line lightning-global/no-custom-event-bubbling
      new CustomEvent('updatecolor', {
        composed: true,
        bubbles: true,
        detail: {
          color
        }
      }));
    }

    handleDoneClick() {
      this.dispatchUpdateColorEventWithColor(this.state.selectedColor);
    }

    handleCancelClick() {
      this.dispatchUpdateColorEventWithColor(this.currentColor);
    }

    handleKeydown(event) {
      if (event.keyCode === keyCodes.escape) {
        event.preventDefault();
        this.dispatchUpdateColorEventWithColor(this.currentColor);
      } else if (event.shiftKey && event.keyCode === keyCodes.tab && event.srcElement.dataset.id === 'color-anchor') {
        event.preventDefault();
        this.template.querySelector('button[name="done"]').focus();
      } else if (!event.shiftKey && event.keyCode === keyCodes.tab && event.srcElement.name === 'done') {
        event.preventDefault();
        this.template.querySelector('lightning-color-picker-custom').focus();
      }
    }

  }

  Engine.registerDecorators(LightningColorPickerPanel, {
    publicProps: {
      currentColor: {
        config: 0
      }
    },
    track: {
      state: 1
    }
  });

  var colorPickerPanel = Engine.registerComponent(LightningColorPickerPanel, {
    tmpl: _tmpl$9
  });

  var labelA11yTriggerText = 'Choose a color. Current color: ';

  const POSITION_ATTR_NAME = 'data-position-id';

  class BrowserWindow {
    get window() {
      if (!this._window) {
        this._window = window; // JTEST/Ingtegration: getComputedStyle may be null

        if (!this.window.getComputedStyle) {
          this.window.getComputedStyle = node => {
            return node.style;
          };
        }
      }

      return this._window;
    }

    mockWindow(value) {
      // For test, allow mock window.
      this._window = value;
    }

    get documentElement() {
      assert(this.window.document, 'Missing window.document');
      return this.window.document.documentElement;
    }

    get MutationObserver() {
      return this.window.MutationObserver;
    }

    isWindow(element) {
      return element && element.toString() === '[object Window]';
    }

  }

  const WindowManager = new BrowserWindow(); // A global

  let passiveEventsSupported;

  function supportsPassiveEvents() {
    if (typeof passiveEventsSupported !== 'boolean') {
      passiveEventsSupported = false;

      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: () => {
            passiveEventsSupported = true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts); // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    return passiveEventsSupported;
  }

  function attachPassiveEvent(element, eventName, callback) {
    const options = supportsPassiveEvents() ? {
      passive: true
    } : false;
    element.addEventListener(eventName, callback, options);
    return () => {
      element.removeEventListener(eventName, callback, options);
    };
  }

  function isShadowRoot(node) {
    return node && node.nodeType === 11;
  }

  function enumerateParent(elem, stopEl, checker) {
    // document.body is not necessarily a body tag, because of the (very rare)
    // case of a frameset.
    if (!elem || elem === stopEl || elem === document.body) {
      return null;
    } // if overflow is auto and overflow-y is also auto,
    // however in firefox the opposite is not true


    try {
      // getComputedStyle throws an exception
      // if elem is not an element
      // (can happen during unrender)
      const computedStyle = WindowManager.window.getComputedStyle(elem);

      if (!computedStyle) {
        return null;
      }

      if (checker(computedStyle)) {
        return elem;
      }

      return enumerateParent(isShadowRoot(elem.parentNode) ? elem.parentNode.host : elem.parentNode, stopEl, checker);
    } catch (e) {
      return null;
    }
  }

  function getScrollableParent(elem, stopEl) {
    return enumerateParent(elem, stopEl, computedStyle => {
      const overflow = computedStyle['overflow-y'];
      return overflow === 'auto' || overflow === 'scroll';
    });
  }

  function queryOverflowHiddenParent(elem, stopEl) {
    return enumerateParent(elem, stopEl, computedStyle => {
      return computedStyle['overflow-x'] === 'hidden' || computedStyle['overflow-y'] === 'hidden';
    });
  }

  function isInDom(el) {
    if (el === WindowManager.window) {
      return true;
    }

    if (!isShadowRoot(el.parentNode) && el.parentNode && el.parentNode.tagName && el.parentNode.tagName.toUpperCase() === 'BODY') {
      return true;
    }

    if (isShadowRoot(el.parentNode) && el.parentNode.host) {
      return isInDom(el.parentNode.host);
    }

    if (el.parentNode) {
      return isInDom(el.parentNode);
    }

    return false;
  }
  function isScrolling(elem) {
    return elem.scrollHeight > elem.clientHeight;
  }
  function isDomNode(obj) {
    return obj.nodeType && (obj.nodeType === 1 || obj.nodeType === 11);
  }
  function timeout(time) {
    return new Promise(resolve => {
      // eslint-disable-next-line lwc/no-set-timeout
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function containsScrollingElement(list) {
    const len = list.length;

    if (!len) {
      return false;
    }

    for (let i = 0; i < len; i++) {
      if (isScrolling(list[i])) {
        return true;
      }
    }

    return false;
  }
  function queryScrollableChildren(element) {
    return element.querySelectorAll('[data-scoped-scroll="true"]');
  }
  function getPositionTarget(element) {
    return element.tagName === 'TEXTAREA' ? isShadowRoot(element.parentNode) ? element.parentNode.host : element.parentNode : element;
  }
  let lastId = 1000000;
  function generateUniqueSelector() {
    return `lgcp-${lastId++}`;
  }
  function normalizeElement(element) {
    const selector = generateUniqueSelector();
    element.setAttribute(POSITION_ATTR_NAME, selector);
    element = document.querySelector(`[${POSITION_ATTR_NAME}="${selector}"]`) || element;
    return element;
  }

  function isInsideOverlay(element, modalOnly) {
    if (!element) {
      return false;
    }

    if (element.classList && (element.classList.contains('uiModal') || !modalOnly && element.classList.contains('uiPanel'))) {
      return true;
    }

    if (!element.parentNode) {
      return false;
    }

    return isInsideOverlay(isShadowRoot(element.parentNode) ? element.parentNode.host : element.parentNode, modalOnly);
  }

  function isInsideModal(element) {
    return isInsideOverlay(element, true);
  }
  function normalizePosition(element, nextIndex, target, alignWidth) {
    // Set element position to fixed
    // 1. element is inside overlay
    // or 2. When element isn't align with target's width, and target's parent has overflow-x:hidden setting.
    const isFixed = isInsideOverlay(element) || !alignWidth && queryOverflowHiddenParent(target, WindowManager.window, true);
    element.style.position = isFixed ? 'fixed' : 'absolute';
    element.style.zIndex = nextIndex || 0;
    element.style.left = '-9999px'; // Avoid flicker

    element.style.top = '0px'; // Avoid flicker

    return element;
  }
  function requestAnimationFrameAsPromise() {
    return new Promise(resolve => {
      requestAnimationFrame(() => resolve());
    });
  }

  const Direction = {
    Center: 'center',
    Middle: 'middle',
    Right: 'right',
    Left: 'left',
    Bottom: 'bottom',
    Top: 'top',
    Default: 'default'
  };
  const VerticalMap = {
    top: Direction.Top,
    bottom: Direction.Bottom,
    center: Direction.Middle
  };
  const HorizontalMap = {
    left: Direction.Left,
    right: Direction.Right,
    center: Direction.Center
  };
  const FlipMap = {
    left: Direction.Right,
    right: Direction.Left,
    top: Direction.Bottom,
    bottom: Direction.Top,
    default: Direction.Right
  };

  function getWindowSize() {
    return {
      width: WindowManager.window.innerWidth || document.body.clientWidth || 0,
      height: WindowManager.window.innerHeight || document.body.clientHeight || 0
    };
  }

  function normalizeDirection(direction, defaultValue) {
    return normalizeString(direction, {
      fallbackValue: defaultValue || Direction.Default,
      validValues: [Direction.Center, Direction.Right, Direction.Left, Direction.Bottom, Direction.Top, Direction.Middle, Direction.Default]
    });
  }
  function mapToHorizontal(value) {
    value = normalizeDirection(value, Direction.Left);
    return HorizontalMap[value];
  }
  function mapToVertical(value) {
    value = normalizeDirection(value, Direction.Left);
    return VerticalMap[value];
  }
  function flipDirection(value) {
    value = normalizeDirection(value, Direction.Left);
    return FlipMap[value];
  }
  function checkFlipPossibility(element, target, leftAsBoundary) {
    const viewPort = getWindowSize();
    const elemRect = element.getBoundingClientRect();
    const referenceElemRect = target.getBoundingClientRect();
    const height = typeof elemRect.height !== 'undefined' ? elemRect.height : elemRect.bottom - elemRect.top;
    const width = typeof elemRect.width !== 'undefined' ? elemRect.width : elemRect.right - elemRect.left;
    const hasSpaceAbove = referenceElemRect.top >= height;
    const hasSpaceBelow = viewPort.height - referenceElemRect.bottom >= height;
    const requireFlip = hasSpaceAbove && !hasSpaceBelow;
    const shouldAlignToRight = referenceElemRect.right >= width && // enough space on the left
    viewPort.width - referenceElemRect.left < width; // not enough space on the right

    const shouldAlignToLeft = referenceElemRect.left + width <= viewPort.width && referenceElemRect.right - width < (leftAsBoundary ? referenceElemRect.left : 0);
    return {
      shouldAlignToLeft,
      shouldAlignToRight,
      hasSpaceAbove,
      hasSpaceBelow,
      requireFlip
    };
  }

  class Transformer {
    constructor(pad, boxDirections, transformX, transformY) {
      this.pad = pad || 0;
      this.boxDirections = boxDirections || {
        left: true,
        right: true
      };

      this.transformX = transformX || function () {};

      this.transformY = transformY || function () {};
    }

    transform() {// no-op
    }

  }

  class TopTransformer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        top: this.transformY(targetBox.top, targetBox, elementBox) + this.pad
      };
    }

  }

  class BottomTransFormer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        top: this.transformY(targetBox.top, targetBox, elementBox) - elementBox.height - this.pad
      };
    }

  }

  class CenterTransformer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        left: Math.floor(this.transformX(targetBox.left, targetBox, elementBox) - 0.5 * elementBox.width)
      };
    }

  }

  class MiddleTransformer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        top: Math.floor(0.5 * (2 * targetBox.top + targetBox.height - elementBox.height))
      };
    }

  }

  class LeftTransformer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        left: this.transformX(targetBox.left, targetBox, elementBox) + this.pad
      };
    }

  }

  class RightTransformer extends Transformer {
    transform(targetBox, elementBox) {
      return {
        left: this.transformX(targetBox.left, targetBox, elementBox) - elementBox.width - this.pad
      };
    }

  }

  class BelowTransformer extends Transformer {
    transform(targetBox, elementBox) {
      const top = targetBox.top + targetBox.height + this.pad;
      return elementBox.top < top ? {
        top
      } : {};
    }

  }

  class BoundingBoxTransformer extends Transformer {
    transform(targetBox, elementBox) {
      const retBox = {};

      if (this.boxDirections.top && elementBox.top < targetBox.top + this.pad) {
        retBox.top = targetBox.top + this.pad;
      }

      if (this.boxDirections.left && elementBox.left < targetBox.left + this.pad) {
        retBox.left = targetBox.left + this.pad;
      }

      if (this.boxDirections.right && elementBox.left + elementBox.width > targetBox.left + targetBox.width - this.pad) {
        retBox.left = targetBox.left + targetBox.width - elementBox.width - this.pad;
      }

      if (this.boxDirections.bottom && elementBox.top + elementBox.height > targetBox.top + targetBox.height - this.pad) {
        retBox.top = targetBox.top + targetBox.height - elementBox.height - this.pad;
      }

      return retBox;
    }

  }

  class InverseBoundingBoxTransformer extends Transformer {
    transform(targetBox, elementBox) {
      const retBox = {};

      if (this.boxDirections.left && targetBox.left - this.pad < elementBox.left) {
        retBox.left = targetBox.left - this.pad;
      }

      if (this.boxDirections.right && elementBox.left + elementBox.width < targetBox.left + targetBox.width + this.pad) {
        retBox.left = targetBox.width + this.pad - elementBox.width + targetBox.left;
      }

      if (this.boxDirections.top && targetBox.top < elementBox.top + this.pad) {
        retBox.top = targetBox.top - this.pad;
      }

      if (this.boxDirections.bottom && elementBox.top + elementBox.height < targetBox.top + targetBox.height + this.pad) {
        retBox.top = targetBox.height + this.pad - elementBox.height + targetBox.top;
      }

      return retBox;
    }

  }

  const TransformFunctions = {
    center(input, targetBox) {
      return Math.floor(input + 0.5 * targetBox.width);
    },

    right(input, targetBox) {
      return input + targetBox.width;
    },

    left(input) {
      return input;
    },

    bottom(input, targetBox) {
      return input + targetBox.height;
    }

  };
  const Transformers = {
    top: TopTransformer,
    bottom: BottomTransFormer,
    center: CenterTransformer,
    middle: MiddleTransformer,
    left: LeftTransformer,
    right: RightTransformer,
    below: BelowTransformer,
    'bounding box': BoundingBoxTransformer,
    'inverse bounding box': InverseBoundingBoxTransformer,
    default: Transformer
  };
  function toTransformFunctions(value) {
    return TransformFunctions[value] || TransformFunctions.left;
  }

  class TransformBuilder {
    type(value) {
      this._type = value;
      return this;
    }

    align(horizontal, vertical) {
      this._transformX = toTransformFunctions(horizontal);
      this._transformY = toTransformFunctions(vertical);
      return this;
    }

    pad(value) {
      this._pad = parseInt(value, 10);
      return this;
    }

    boxDirections(value) {
      this._boxDirections = value;
      return this;
    }

    build() {
      const AConstructor = Transformers[this._type] ? Transformers[this._type] : Transformers[Direction.Default];
      return new AConstructor(this._pad || 0, this._boxDirections || {}, this._transformX || toTransformFunctions(Direction.left), this._transformY || toTransformFunctions(Direction.left));
    }

  }

  class Constraint {
    constructor(type, config) {
      const {
        target,
        element,
        pad,
        boxDirections
      } = config;
      const {
        horizontal,
        vertical
      } = config.targetAlign;
      this._element = element;
      this._targetElement = target;
      this.destroyed = false;
      this._transformer = new TransformBuilder().type(type).align(horizontal, vertical).pad(pad).boxDirections(boxDirections).build();
    }

    detach() {
      this._disabled = true;
    }

    attach() {
      this._disabled = false;
    }

    computeDisplacement() {
      if (!this._disabled) {
        this._targetElement.refresh();

        this._element.refresh();

        this._pendingBox = this._transformer.transform(this._targetElement, this._element);
      }

      return this;
    }

    computePosition() {
      const el = this._element;

      if (!this._disabled) {
        Object.keys(this._pendingBox).forEach(key => {
          el.setDirection(key, this._pendingBox[key]);
        });
      }

      return this;
    }

    destroy() {
      this._element.release();

      this._targetElement.release();

      this._disabled = true;
      this.destroyed = true;
    }

  }

  class ElementProxy {
    constructor(el, id) {
      this.id = id;
      this.width = 0;
      this.height = 0;
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this._dirty = false;
      this._node = null;
      this._releaseCb = null;

      if (!el) {
        throw new Error('Element missing');
      } // W-3262919
      // for some reason I cannot figure out sometimes the
      // window, which clearly a window object, is not the window object
      // this will correct that. It might be related to locker


      if (WindowManager.isWindow(el)) {
        el = WindowManager.window;
      }

      this._node = el;
      this.setupObserver();
      this.refresh();
    }

    setupObserver() {
      // this check is because phantomjs does not support
      // mutation observers. The consqeuence here
      // is that any browser without mutation observers will
      // fail to update dimensions if they changwe after the proxy
      // is created and the proxy is not not refreshed
      if (WindowManager.MutationObserver && !this._node.isObserved) {
        // Use mutation observers to invalidate cache. It's magic!
        this._observer = new WindowManager.MutationObserver(this.refresh.bind(this)); // do not observe the window

        if (!WindowManager.isWindow(this._node)) {
          this._observer.observe(this._node, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });

          this._node.isObserved = true;
        }
      }
    }

    setReleaseCallback(cb, scope) {
      const scopeObj = scope || this;
      this._releaseCb = cb.bind(scopeObj);
    }

    checkNodeIsInDom() {
      // if underlying DOM node is gone,
      // this proxy should be released
      if (!isInDom(this._node)) {
        return false;
      }

      return true;
    }

    refresh() {
      const w = WindowManager.window;

      if (!this.isDirty()) {
        if (!this.checkNodeIsInDom()) {
          return this.release();
        }

        let box, x, scrollTop, scrollLeft;

        if (typeof w.pageYOffset !== 'undefined') {
          scrollTop = w.pageYOffset;
          scrollLeft = w.pageXOffset;
        } else {
          scrollTop = w.scrollY;
          scrollLeft = w.scrollX;
        }

        if (!WindowManager.isWindow(this._node)) {
          // force paint
          // eslint-disable-next-line no-unused-vars
          const offsetHeight = this._node.offsetHeight;
          box = this._node.getBoundingClientRect(); // not using integers causes weird rounding errors
          // eslint-disable-next-line guard-for-in

          for (x in box) {
            this[x] = Math.floor(box[x]);
          }

          this.top = Math.floor(this.top + scrollTop);
          this.bottom = Math.floor(this.top + box.height);
          this.left = Math.floor(this.left + scrollLeft);
          this.right = Math.floor(this.left + box.width);
        } else {
          box = {};
          this.width = WindowManager.documentElement.clientWidth;
          this.height = WindowManager.documentElement.clientHeight;
          this.left = scrollLeft;
          this.top = scrollTop;
          this.right = WindowManager.documentElement.clientWidth + scrollLeft;
          this.bottom = WindowManager.documentElement.clientHeight;
        }

        this._dirty = false;
      }

      return this._dirty;
    }

    getNode() {
      return this._node;
    }

    isDirty() {
      return this._dirty;
    }

    bake() {
      const w = WindowManager.window;

      const absPos = this._node.getBoundingClientRect();

      const style = w.getComputedStyle(this._node) || this._node.style;

      let originalLeft, originalTop;
      let scrollTop, scrollLeft;

      if (typeof w.pageYOffset !== 'undefined') {
        scrollTop = w.pageYOffset;
        scrollLeft = w.pageXOffset;
      } else {
        scrollTop = w.scrollY;
        scrollLeft = w.scrollX;
      }

      if (style.left.match(/auto|fixed/)) {
        originalLeft = '0';
      } else {
        originalLeft = style.left;
      }

      if (style.top.match(/auto|fixed/)) {
        originalTop = '0';
      } else {
        originalTop = style.top;
      }

      originalLeft = parseInt(originalLeft.replace('px', ''), 10);
      originalTop = parseInt(originalTop.replace('px', ''), 10);
      const leftDif = Math.round(this.left - (absPos.left + scrollLeft));
      const topDif = this.top - (absPos.top + scrollTop);
      this._node.style.left = originalLeft + leftDif + 'px';
      this._node.style.top = originalTop + topDif + 'px';
      this._dirty = false;
    }

    setDirection(direction, val) {
      this[direction] = val;
      this._dirty = true;
    }

    release() {
      if (this._releaseCb) {
        this._releaseCb(this);
      }
    }

    querySelectorAll(selector) {
      return this._node.querySelectorAll(selector);
    }

  }

  class ProxyCache {
    constructor() {
      this.proxyCache = {};
    }

    get count() {
      return Object.keys(this.proxyCache).length;
    }

    releaseOrphanProxies() {
      for (const proxy in this.proxyCache) {
        if (!this.proxyCache[proxy].el.checkNodeIsInDom()) {
          this.proxyCache[proxy].el.release();
        }
      }
    }

    bakeOff() {
      for (const proxy in this.proxyCache) {
        if (this.proxyCache[proxy].el.isDirty()) {
          this.proxyCache[proxy].el.bake();
        }
      }
    }

    getReferenceCount(proxy) {
      const id = proxy.id;

      if (!id || !this.proxyCache[id]) {
        return 0;
      }

      return this.proxyCache[id].refCount;
    }

    release(proxy) {
      const proxyInstance = this.proxyCache[proxy.id];

      if (proxyInstance) {
        --proxyInstance.refCount;
      }

      if (proxyInstance && proxyInstance.refCount <= 0) {
        delete this.proxyCache[proxy.id];
      }
    }

    reset() {
      this.proxyCache = {};
    }

    create(element) {
      let key = 'window';

      if (!WindowManager.isWindow(element)) {
        key = element ? element.getAttribute(POSITION_ATTR_NAME) : null; // 1 - Node.ELEMENT_NODE, 11 - Node.DOCUMENT_FRAGMENT_NODE

        assert(key && element.nodeType && (element.nodeType !== 1 || element.nodeType !== 11), `Element Proxy requires an element and has property ${POSITION_ATTR_NAME}`);
      }

      if (this.proxyCache[key]) {
        this.proxyCache[key].refCount++;
        return this.proxyCache[key].el;
      }

      const newProxy = new ElementProxy(element, key);
      newProxy.setReleaseCallback(release, newProxy);
      this.proxyCache[key] = {
        el: newProxy,
        refCount: 1
      }; // run GC

      timeout(0).then(() => {
        this.releaseOrphanProxies();
      });
      return this.proxyCache[key].el;
    }

  }

  const elementProxyCache = new ProxyCache();
  function bakeOff() {
    elementProxyCache.bakeOff();
  }
  function release(proxy) {
    return elementProxyCache.release(proxy);
  }
  function createProxy(element) {
    return elementProxyCache.create(element);
  }

  class RepositionQueue {
    constructor() {
      this.callbacks = [];
      this.repositionScheduled = false;
      this._constraints = [];
      this.timeoutId = 0;
      this.lastIndex = 7000;
      this.eventsBound = false;
    }

    get nextIndex() {
      return this.lastIndex++;
    }

    get constraints() {
      return this._constraints;
    }

    set constraints(value) {
      this._constraints = this._constraints.concat(value);
    }

    dispatchRepositionCallbacks() {
      while (this.callbacks.length > 0) {
        this.callbacks.shift()();
      }
    }

    add(callback) {
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
        return true;
      }

      return false;
    }

    scheduleReposition(callback) {
      if (this.timeoutId === 0) {
        // eslint-disable-next-line lwc/no-set-timeout
        this.timeoutId = setTimeout(() => {
          this.reposition(callback);
        }, 10);
      }
    }

    reposition(callback) {
      // all the callbacks will be called
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      } // this is for throttling


      clearTimeout(this.timeoutId);
      this.timeoutId = 0; // this semaphore is to make sure
      // if reposition is called twice within one frame
      // we only run this once

      if (!this.repositionScheduled) {
        requestAnimationFrame(() => {
          this.repositionScheduled = false; // this must be executed in order or constraints
          // will behave oddly

          this._constraints = this._constraints.filter(constraint => {
            if (!constraint.destroyed) {
              constraint.computeDisplacement().computePosition();
              return true;
            }

            return false;
          });
          bakeOff();
          this.dispatchRepositionCallbacks();
        });
        this.repositionScheduled = true;
      }
    }

    get repositioning() {
      if (!this._reposition) {
        this._reposition = this.scheduleReposition.bind(this);
      }

      return this._reposition;
    }

    bindEvents() {
      if (!this.eventsBound) {
        window.addEventListener('resize', this.repositioning);
        window.addEventListener('scroll', this.repositioning);
        this.eventsBound = true;
      }
    }

    detachEvents() {
      window.removeEventListener('resize', this.repositioning);
      window.removeEventListener('scroll', this.repositioning);
      this.eventsBound = false;
    }

  }

  const positionQueue = new RepositionQueue();
  function scheduleReposition(callback) {
    positionQueue.scheduleReposition(callback);
  }
  function bindEvents() {
    positionQueue.bindEvents();
  }
  function addConstraints(list) {
    positionQueue.constraints = list;
  }
  function reposition(callback) {
    positionQueue.reposition(callback);
  }
  function nextIndex() {
    return positionQueue.nextIndex;
  }

  class Relationship {
    constructor(config, constraintList, scrollableParent) {
      this.config = config;
      this.constraintList = constraintList;
      this.scrollableParent = scrollableParent;
    }

    disable() {
      this.constraintList.forEach(constraintToDisable => {
        constraintToDisable.detach();
      });
    }

    enable() {
      this.constraintList.forEach(constraintToEnable => {
        constraintToEnable.attach();
      });
    }

    destroy() {
      if (this.config.removeListeners) {
        this.config.removeListeners();
        this.config.removeListeners = undefined;
      }

      while (this.constraintList.length > 0) {
        this.constraintList.pop().destroy();
      } // Clean up node appended to body of dom


      if (this.config.appendToBody && this.config.element) {
        const nodeToRemove = document.querySelector(`[${POSITION_ATTR_NAME}="${this.config.element.getAttribute(POSITION_ATTR_NAME)}"]`);

        if (nodeToRemove) {
          nodeToRemove.parentNode.removeChild(nodeToRemove);
        }
      }
    }

    reposition() {
      return new Promise(resolve => {
        reposition(() => {
          resolve();
        });
      });
    }

  }

  function setupObserver(config, scrollableParent) {
    let proxyWheelEvents = true;

    if (WindowManager.MutationObserver && !config.element.isObserved) {
      // phantomjs :(
      let scrollableChildren = queryScrollableChildren(config.element);
      const observer = new WindowManager.MutationObserver(() => {
        scrollableChildren = queryScrollableChildren(config.element);
        proxyWheelEvents = !containsScrollingElement(scrollableChildren);
      });

      if (containsScrollingElement(scrollableChildren)) {
        proxyWheelEvents = false;
      }

      observer.observe(config.element, {
        attributes: true,
        subtree: true,
        childList: true
      });
      config.element.isObserved = true;
    }

    if (scrollableParent) {
      const scrollRemovalFunction = attachPassiveEvent(scrollableParent, 'scroll', scheduleReposition); // if the target element is inside a
      // scrollable element, we need to make sure
      // scroll events move that element,
      // not the parent, also we need to reposition on scroll

      const wheelRemovalFunction = attachPassiveEvent(config.element, 'wheel', e => {
        if (proxyWheelEvents && scrollableParent && typeof scrollableParent.scrollTop !== 'undefined') {
          scrollableParent.scrollTop += e.deltaY;
        }
      });

      config.removeListeners = () => {
        scrollRemovalFunction();
        wheelRemovalFunction();
      };
    }
  }

  function validateConfig(config) {
    assert(config.element && isDomNode(config.element), 'Element is undefined or missing, or not a Dom Node');
    assert(config.target && (WindowManager.isWindow(config.target) || isDomNode(config.target)), 'Target is undefined or missing');
  }

  function createRelationship(config) {
    bindEvents();
    config.element = normalizePosition(config.element, nextIndex(), config.target, config.alignWidth);

    if (config.alignWidth && config.element.style.position === 'fixed') {
      config.element.style.width = config.target.getBoundingClientRect().width + 'px';
    }

    const constraintList = [];
    const scrollableParent = getScrollableParent(getPositionTarget(config.target), WindowManager.window); // This observer and the test for scrolling children
    // is so that if a panel contains a scroll we do not
    // proxy the events to the "parent"  (actually the target's parent)

    setupObserver(config, scrollableParent);

    if (config.appendToBody) {
      document.body.appendChild(config.element);
    }

    config.element = createProxy(config.element);
    config.target = createProxy(config.target); // Add vertical constraint.

    const verticalConfig = Object.assign({}, config);

    if (verticalConfig.padTop !== undefined) {
      verticalConfig.pad = verticalConfig.padTop;
    } // Add horizontal constraint.


    constraintList.push(new Constraint(mapToHorizontal(config.align.horizontal), config));
    constraintList.push(new Constraint(mapToVertical(config.align.vertical), verticalConfig));

    if (config.scrollableParentBound && scrollableParent) {
      const parent = normalizeElement(scrollableParent);
      const boxConfig = {
        element: config.element,
        enabled: config.enabled,
        target: createProxy(parent),
        align: {},
        targetAlign: {},
        pad: 3,
        boxDirections: {
          top: true,
          bottom: true,
          left: true,
          right: true
        }
      };
      constraintList.push(new Constraint('bounding box', boxConfig));
    }

    addConstraints(constraintList);
    reposition();
    return new Relationship(config, constraintList, scrollableParent);
  }

  function isAutoFlipHorizontal(config) {
    return config.autoFlip || config.autoFlipHorizontal;
  }

  function isAutoFlipVertical(config) {
    return config.autoFlip || config.autoFlipVertical;
  }

  function normalizeConfig(config) {
    config.align = config.align || {};
    config.targetAlign = config.targetAlign || {};
    const {
      shouldAlignToLeft,
      shouldAlignToRight,
      hasSpaceAbove,
      hasSpaceBelow,
      requireFlip
    } = checkFlipPossibility(config.element, config.target, config.leftAsBoundary);
    const vFlip = isAutoFlipVertical(config) ? requireFlip : false;
    const {
      align,
      targetAlign
    } = config;
    let hFlip = false;

    if (align.horizontal === Direction.Left) {
      hFlip = isAutoFlipHorizontal(config) ? shouldAlignToRight : false;
    } else if (align.horizontal === Direction.Right) {
      hFlip = isAutoFlipHorizontal(config) ? shouldAlignToLeft : false;
    } // When inside modal, element may expand out of the viewport and be cut off.
    // So if inside modal, and don't have enough space above or below, will add bounding box rule.


    if (isInsideModal(config.element) && !hasSpaceAbove && !hasSpaceBelow) {
      config.scrollableParentBound = true;
    }

    return {
      target: config.target,
      element: config.element,
      align: {
        horizontal: hFlip ? flipDirection(align.horizontal) : normalizeDirection(align.horizontal, Direction.Left),
        vertical: vFlip ? flipDirection(align.vertical) : normalizeDirection(align.vertical, Direction.Top)
      },
      targetAlign: {
        horizontal: hFlip ? flipDirection(targetAlign.horizontal) : normalizeDirection(targetAlign.horizontal, Direction.Left),
        vertical: vFlip ? flipDirection(targetAlign.vertical) : normalizeDirection(targetAlign.vertical, Direction.Bottom)
      },
      alignWidth: config.alignWidth,
      scrollableParentBound: config.scrollableParentBound
    };
  }

  function toElement(root, target) {
    if (target && typeof target === 'string') {
      return root.querySelector(target);
    } else if (target && typeof target === 'function') {
      return Engine.unwrap(target());
    }

    return target;
  }

  function startPositioning(root, config) {
    assert(root, 'Root is undefined or missing');
    assert(config, 'Config is undefined or missing');
    const node = normalizeElement(root);
    const target = toElement(node, config.target);
    const element = toElement(node, config.element); // when target/element is selector, there is chance, dom isn't present anymore.

    if (!target || !element) {
      return null;
    }

    config.target = normalizeElement(target);
    config.element = normalizeElement(element);
    validateConfig(config);
    return createRelationship(normalizeConfig(config));
  }
  function stopPositioning(relationship) {
    if (relationship) {
      relationship.destroy();
    }
  }
  class AutoPosition {
    constructor(root) {
      this._autoPositionUpdater = null;
      this._root = root;
    }

    start(config) {
      return requestAnimationFrameAsPromise().then(() => {
        let promise = Promise.resolve();

        if (!this._autoPositionUpdater) {
          this._autoPositionUpdater = startPositioning(this._root, config);
        } else {
          promise = promise.then(() => {
            return this._autoPositionUpdater.reposition();
          });
        }

        return promise.then(() => {
          return this._autoPositionUpdater;
        });
      });
    }

    stop() {
      if (this._autoPositionUpdater) {
        stopPositioning(this._autoPositionUpdater);
        this._autoPositionUpdater = null;
      }

      return Promise.resolve();
    }

  }

  function tmpl$9($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      h: api_element,
      c: api_custom_element,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return [api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-color-picker__summary-button": true,
        "slds-button_icon": true,
        "slds-button_icon-more": true
      },
      props: {
        "disabled": $cmp.disabled
      },
      key: 2,
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.handleColorPickerToggleClick))
      }
    }, [api_element("span", {
      classMap: {
        "slds-swatch": true
      },
      style: $cmp.colorInputStyle,
      attrs: {
        "data-id": "thumbnail"
      },
      key: 3
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 4
    }, [api_dynamic($cmp.i18n.a11yTriggerText)])]), api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": "utility:down",
        "svgClass": "slds-button__icon slds-button__icon_small",
        "variant": "bare"
      },
      key: 5
    }, []), api_element("span", {
      classMap: {
        "slds-assistive-text": true,
        "a11y-color-value": true
      },
      key: 6
    }, [api_dynamic($cmp.value)])]), $cmp._isColorPickerPanelOpen ? api_custom_element("lightning-color-picker-panel", colorPickerPanel, {
      classMap: {
        "color-picker-panel": true
      },
      props: {
        "currentColor": $cmp.value
      },
      key: 8,
      on: {
        "updatecolor": _m1 || ($ctx._m1 = api_bind($cmp.handleUpdateColorEvent))
      }
    }, []) : null];
  }

  var _tmpl$a = Engine.registerTemplate(tmpl$9);
  tmpl$9.stylesheets = [];
  tmpl$9.stylesheetTokens = {
    hostAttribute: "lightning-primitiveColorpickerButton_primitiveColorpickerButton-host",
    shadowAttribute: "lightning-primitiveColorpickerButton_primitiveColorpickerButton"
  };

  const i18n$4 = {
    a11yTriggerText: labelA11yTriggerText
  };

  class PrimitiveColorpickerButton extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this._isColorPickerPanelOpen = false;
      this._value = '';
    }

    get value() {
      return this._value;
    }

    set value(value) {
      this._value = value;
    }

    focus() {
      const button = this.template.querySelector('button');
      return button && button.focus();
    }

    blur() {
      const button = this.template.querySelector('button');
      return button && button.blur();
    }

    get colorInputStyle() {
      return `background: ${this.value || '#5679C0'};`;
    }

    handleColorPickerToggleClick(event) {
      event.preventDefault();
      this._isColorPickerPanelOpen = !this._isColorPickerPanelOpen;

      if (this._isColorPickerPanelOpen) {
        this.startColorPickerPositioning();
      } else {
        this.stopColorPickerPositioning();
      }
    }

    startColorPickerPositioning() {
      if (!this._autoPosition) {
        this._autoPosition = new AutoPosition(this);
      }

      this._autoPosition.start({
        target: () => this.template.querySelector('button.slds-color-picker__summary-button'),
        element: () => this.template.querySelector('lightning-color-picker-panel').shadowRoot.querySelector('section'),
        align: {
          horizontal: Direction.Left,
          vertical: Direction.Top
        },
        targetAlign: {
          horizontal: Direction.Left,
          vertical: Direction.Bottom
        },
        autoFlip: true
      });
    }

    stopColorPickerPositioning() {
      if (this._autoPosition) {
        this._autoPosition.stop();
      }
    }

    handleUpdateColorEvent(event) {
      event.stopPropagation();
      const detail = event.detail;
      this._isColorPickerPanelOpen = false;
      this.stopColorPickerPositioning();
      this.dispatchEvent(new CustomEvent('change', {
        detail
      }));
    }

    get i18n() {
      return i18n$4;
    }

  }

  Engine.registerDecorators(PrimitiveColorpickerButton, {
    publicProps: {
      value: {
        config: 3
      }
    },
    publicMethods: ["focus", "blur"],
    track: {
      _isColorPickerPanelOpen: 1,
      _value: 1
    }
  });

  var primitiveColorpickerButton = Engine.registerComponent(PrimitiveColorpickerButton, {
    tmpl: _tmpl$a
  });

  function tmpl$a($api, $cmp, $slotset, $ctx) {
    return [];
  }

  var _tmpl$b = Engine.registerTemplate(tmpl$a);
  tmpl$a.stylesheets = [];
  tmpl$a.stylesheetTokens = {
    hostAttribute: "lightning-primitiveButton_primitiveButton-host",
    shadowAttribute: "lightning-primitiveButton_primitiveButton"
  };

  class LightningPrimitiveButton extends Engine.LightningElement {
    get disabled() {
      return this.state.disabled;
    }

    set disabled(value) {
      this.state.disabled = normalizeBoolean(value);
    }

    set accessKey(value) {
      this.state.accesskey = value;
    }

    get accessKey() {
      return this.state.accesskey;
    }

    get computedAccessKey() {
      return this.state.accesskey;
    }

    get title() {
      return this.state.title;
    }

    set title(value) {
      this.state.title = value;
    }

    get ariaLabel() {
      return this.state.ariaLabel;
    }

    set ariaLabel(value) {
      this.state.ariaLabel = value;
    }

    get computedAriaLabel() {
      return this.state.ariaLabel;
    }

    get ariaDescribedBy() {
      return this.state.ariaDescribedBy;
    }

    set ariaDescribedBy(value) {
      this.state.ariaDescribedBy = value;
    }

    get computedAriaDescribedBy() {
      return this.state.ariaDescribedBy;
    }

    get ariaControls() {
      return this.state.ariaControls;
    }

    set ariaControls(value) {
      this.state.ariaControls = value;
    }

    get computedAriaControls() {
      return this.state.ariaControls;
    }

    get ariaExpanded() {
      return this.state.ariaExpanded;
    }

    set ariaExpanded(value) {
      this.state.ariaExpanded = normalizeString(value, {
        fallbackValue: undefined,
        validValues: ['true', 'false']
      });
    }

    get computedAriaExpanded() {
      return this.state.ariaExpanded || null;
    }

    set ariaLive(value) {
      this.state.ariaLive = value;
    }

    get ariaLive() {
      return this.state.ariaLive;
    }

    get computedAriaLive() {
      return this.state.ariaLive;
    }

    get ariaAtomic() {
      return this.state.ariaAtomic || null;
    }

    set ariaAtomic(value) {
      this.state.ariaAtomic = normalizeString(value, {
        fallbackValue: undefined,
        validValues: ['true', 'false']
      });
    }

    get computedAriaAtomic() {
      return this.state.ariaAtomic || null;
    }

    focus() {}

    constructor() {
      super(); // Workaround for an IE11 bug where click handlers on button ancestors
      // receive the click event even if the button element has the `disabled`
      // attribute set.

      this.state = {
        accesskey: null,
        ariaAtomic: null,
        ariaControls: null,
        ariaDescribedBy: null,
        ariaExpanded: null,
        ariaLabel: null,
        ariaLive: null,
        disabled: false
      };

      if (isIE11) {
        this.template.addEventListener('click', event => {
          if (this.disabled) {
            event.stopImmediatePropagation();
          }
        });
      }
    }

  }

  Engine.registerDecorators(LightningPrimitiveButton, {
    publicProps: {
      disabled: {
        config: 3
      },
      accessKey: {
        config: 3
      },
      title: {
        config: 3
      },
      ariaLabel: {
        config: 3
      },
      ariaDescribedBy: {
        config: 3
      },
      ariaControls: {
        config: 3
      },
      ariaExpanded: {
        config: 3
      },
      ariaLive: {
        config: 3
      },
      ariaAtomic: {
        config: 3
      }
    },
    publicMethods: ["focus"],
    track: {
      state: 1
    }
  });

  var primitiveButton = Engine.registerComponent(LightningPrimitiveButton, {
    tmpl: _tmpl$b
  });

  function tmpl$b($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      d: api_dynamic,
      h: api_element,
      gid: api_scoped_id,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return [api_element("button", {
      className: $cmp.computedButtonClass,
      attrs: {
        "name": $cmp.name,
        "title": $cmp.computedTitle,
        "accesskey": $cmp.computedAccessKey,
        "type": $cmp.normalizedType,
        "value": $cmp.value,
        "aria-describedby": api_scoped_id($cmp.computedAriaDescribedBy),
        "aria-label": $cmp.computedAriaLabel,
        "aria-controls": api_scoped_id($cmp.computedAriaControls),
        "aria-expanded": $cmp.computedAriaExpanded,
        "aria-live": $cmp.computedAriaLive,
        "aria-atomic": $cmp.computedAriaAtomic
      },
      props: {
        "disabled": $cmp.disabled
      },
      key: 2,
      on: {
        "focus": _m0 || ($ctx._m0 = api_bind($cmp.handleFocus)),
        "blur": _m1 || ($ctx._m1 = api_bind($cmp.handleBlur))
      }
    }, [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": $cmp.iconName,
        "svgClass": $cmp.computedIconClass,
        "variant": "bare"
      },
      key: 3
    }, []), $cmp.alternativeText ? api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 5
    }, [api_dynamic($cmp.alternativeText)]) : null])];
  }

  var _tmpl$c = Engine.registerTemplate(tmpl$b);
  tmpl$b.stylesheets = [];
  tmpl$b.stylesheetTokens = {
    hostAttribute: "lightning-buttonIcon_buttonIcon-host",
    shadowAttribute: "lightning-buttonIcon_buttonIcon"
  };

  const DEFAULT_SIZE = 'medium';
  const DEFAULT_VARIANT = 'border';
  const DEFAULT_TYPE = 'button';
  /**
   * An icon-only HTML button.
   */

  class LightningButtonIcon extends primitiveButton {
    constructor(...args) {
      super(...args);
      this.name = void 0;
      this.value = void 0;
      this.variant = DEFAULT_VARIANT;
      this.iconName = void 0;
      this.iconClass = void 0;
      this.size = DEFAULT_SIZE;
      this.type = DEFAULT_TYPE;
      this.alternativeText = void 0;
      this._order = null;
    }

    // this is there because raptor currently doesnt support inheritance
    render() {
      return _tmpl$c;
    }

    get computedTitle() {
      return this.state.title || this.alternativeText || '';
    }

    get normalizedVariant() {
      return normalizeString(this.variant, {
        fallbackValue: DEFAULT_VARIANT,
        validValues: ['bare', 'brand', 'container', 'border', 'border-filled', 'bare-inverse', 'border-inverse']
      });
    }

    get normalizedType() {
      return normalizeString(this.type, {
        fallbackValue: DEFAULT_TYPE,
        validValues: ['button', 'reset', 'submit']
      });
    }

    get normalizedSize() {
      return normalizeString(this.size, {
        fallbackValue: DEFAULT_SIZE,
        validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
      });
    }

    getVariantBase() {
      return this.normalizedVariant.split('-')[0];
    }

    getVariantModifier() {
      return this.normalizedVariant.split('-')[1] || '';
    }

    get computedButtonClass() {
      const {
        normalizedSize,
        normalizedVariant
      } = this;
      const isBare = this.getVariantBase(normalizedSize) === 'bare';
      const classes = classSet('slds-button');

      if (!isBare) {
        // If the variant is not bare, then size the button instead of the icon
        switch (normalizedSize) {
          case 'small':
            classes.add('slds-button_icon-small');
            break;

          case 'x-small':
            classes.add('slds-button_icon-x-small');
            break;

          case 'xx-small':
            classes.add('slds-button_icon-xx-small');
            break;

          case 'large':
            // There is no `large` modifier for buttons so we should drop down one size to `medium`
            // eslint-disable-next-line no-console
            console.warn(`<lightning-button-icon> The non-bare variants of buttonIcon do not support a size value of "large". Supported values include "xx-small", "x-small", "small", and "medium". Falling back to size value "medium".`);

          /* falls through */

          case 'medium': // Medium is the default size, and the default size doesn't require a size modifier

          default:
        }
      }

      return classes.add({
        'slds-button_icon-bare': isBare,
        'slds-button_icon-container': normalizedVariant === 'container',
        'slds-button_icon-border': normalizedVariant === 'border',
        'slds-button_icon-border-filled': normalizedVariant === 'border-filled',
        'slds-button_icon-border-inverse': normalizedVariant === 'border-inverse',
        'slds-button_icon-inverse': normalizedVariant === 'bare-inverse',
        'slds-button_icon-brand': normalizedVariant === 'brand',
        'slds-button_first': this._order === 'first',
        'slds-button_middle': this._order === 'middle',
        'slds-button_last': this._order === 'last'
      }).toString();
    }

    get computedIconClass() {
      const {
        normalizedSize,
        normalizedVariant
      } = this;
      const isBare = this.getVariantBase(normalizedVariant) === 'bare';
      const iconClass = this.iconClass || '';
      const classes = classSet('slds-button__icon');
      classes.add(iconClass);

      if (isBare) {
        // If the variant is bare, then size the icon instead of the button
        switch (normalizedSize) {
          case 'large':
            classes.add('slds-button__icon_large');
            break;

          case 'small':
            classes.add('slds-button__icon_small');
            break;

          case 'xx-small':
            // There is no `xx-small` modifier for bare so we should drop down one size to `x-small`
            // eslint-disable-next-line no-console
            console.warn(`<lightning-button-icon> The bare variant of buttonIcon does not support a size value of "xx-small". Supported values include "x-small", "small", "medium", and "large". The default is "medium".`);

          /* falls through */

          case 'x-small':
            classes.add('slds-button__icon_x-small');
            break;

          case 'medium': // Medium is the default size, and the default size doesn't require a size modifier

          default:
        }
      }

      if (this.getVariantModifier(normalizedVariant) === 'inverse') {
        classes.add('slds-button_icon-inverse');
      }

      return classes.toString();
    }

    handleFocus() {
      this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
      this.dispatchEvent(new CustomEvent('blur'));
    }
    /**
     * Sets focus on the button.
     */


    focus() {
      this.template.querySelector('button').focus();
    }
    /**
     * {Function} setOrder - Sets the order value of the button when in the context of a button-group or other ordered component
     * @param {String} order -  The order string (first, middle, last)
     */


    setOrder(order) {
      this._order = order;
    }
    /**
     * Once we are connected, we fire a register event so the button-group (or other) component can register
     * the buttons.
     */


    connectedCallback() {
      const privatebuttonregister = new CustomEvent('privatebuttonregister', {
        bubbles: true,
        detail: {
          callbacks: {
            setOrder: this.setOrder.bind(this),
            setDeRegistrationCallback: deRegistrationCallback => {
              this._deRegistrationCallback = deRegistrationCallback;
            }
          }
        }
      });
      this.dispatchEvent(privatebuttonregister);
    }

    disconnectedCallback() {
      if (this._deRegistrationCallback) {
        this._deRegistrationCallback();
      }
    }

  }

  LightningButtonIcon.delegatesFocus = true;

  Engine.registerDecorators(LightningButtonIcon, {
    publicProps: {
      name: {
        config: 0
      },
      value: {
        config: 0
      },
      variant: {
        config: 0
      },
      iconName: {
        config: 0
      },
      iconClass: {
        config: 0
      },
      size: {
        config: 0
      },
      type: {
        config: 0
      },
      alternativeText: {
        config: 0
      }
    },
    publicMethods: ["focus"],
    track: {
      _order: 1
    }
  });

  var buttonIcon = Engine.registerComponent(LightningButtonIcon, {
    tmpl: _tmpl$c
  });

  var labelAriaLabelMonth = 'Date picker: ';

  var labelNextMonth = 'Next Month';

  var labelPreviousMonth = 'Previous Month';

  var labelToday = 'Today';

  var labelYearSelector = 'Pick a Year';

  /*
   * Regex to test a string for an ISO8601 Date. The following formats are matched.
   * Note that if a time element is present (e.g. 'T'), the string should have a time zone designator (Z or +hh:mm or -hh:mm).
   *
   *  YYYY
   *  YYYY-MM
   *  YYYY-MM-DD
   *  YYYY-MM-DDThh:mmTZD
   *  YYYY-MM-DDThh:mm:ssTZD
   *  YYYY-MM-DDThh:mm:ss.STZD
   *
   *
   * @see: https://www.w3.org/TR/NOTE-datetime
   */
  const ISO8601_STRICT_PATTERN = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z){1})?)?)?$/i;
  /* Regex to test a string for an ISO8601 partial time or full time:
   * hh:mm
   * hh:mm:ss
   * hh:mm:ss.S
   * full time = partial time + TZD
   */

  const ISO8601_TIME_PATTERN = /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
  const STANDARD_TIME_FORMAT = 'HH:mm:ss.SSS';
  const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
  const TIME_SEPARATOR = 'T';
  const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2}):(\d{2}))$/;
  function isValidISODateTimeString(dateTimeString) {
    return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
  }
  function isValidISOTimeString(timeString) {
    if (!isValidISO8601TimeString(timeString)) {
      return false;
    }

    const timeOnly = removeTimeZoneSuffix(timeString);
    return isValidDate(`2018-09-09T${timeOnly}Z`);
  }
  function removeTimeZoneSuffix(dateTimeString) {
    if (typeof dateTimeString === 'string') {
      return dateTimeString.split(TIMEZONE_INDICATOR)[0];
    }

    return dateTimeString;
  }

  function isValidISO8601String(dateTimeString) {
    if (typeof dateTimeString !== 'string') {
      return false;
    }

    return ISO8601_STRICT_PATTERN.test(dateTimeString);
  }

  function isValidISO8601TimeString(timeString) {
    if (typeof timeString !== 'string') {
      return false;
    }

    return ISO8601_TIME_PATTERN.test(timeString);
  }

  function isValidDate(value) {
    // Date.parse returns NaN if the argument doesn't represent a valid date
    const timeStamp = Date.parse(value);
    return isFinite(timeStamp);
  }

  function getLocale$1() {
    return getLocale();
  }
  function isBefore(date1, date2, unit) {
    return getLocalizationService().isBefore(date1, date2, unit);
  }
  function isAfter(date1, date2, unit) {
    return getLocalizationService().isAfter(date1, date2, unit);
  }
  function isSame(date1, date2) {
    return getLocalizationService().isSame(date1, date2, 'day');
  }
  function formatDateTimeUTC(date) {
    return getLocalizationService().formatDateTimeUTC(date);
  }
  function formatDate(dateString, format, locale) {
    return getLocalizationService().formatDate(dateString, format, locale);
  }
  function formatTime(timeString, format) {
    return getLocalizationService().formatTime(timeString, format);
  }
  function parseDateTimeUTC(dateTimeString) {
    return getLocalizationService().parseDateTimeUTC(dateTimeString);
  }
  function parseDateTime(dateTimeString, format, strictMode) {
    return getLocalizationService().parseDateTime(dateTimeString, format, strictMode);
  }
  function syncUTCToWallTime(date, timeZone) {
    let converted = null; // eslint-disable-next-line new-cap

    getLocalizationService().UTCToWallTime(date, timeZone, result => {
      converted = result;
    });
    return converted;
  }
  function syncWallTimeToUTC(date, timeZone) {
    let converted = null; // eslint-disable-next-line new-cap

    getLocalizationService().WallTimeToUTC(date, timeZone, result => {
      converted = result;
    });
    return converted;
  }
  function toOtherCalendar(date) {
    return getLocalizationService().translateToOtherCalendar(date);
  }
  function fromOtherCalendar(date) {
    return getLocalizationService().translateFromOtherCalendar(date);
  } // This belongs to localization service; i.e. getLocalizationService().parseTime()
  // Should be removed after it's been added to the localization service

  function parseTime(timeString, format, strictParsing) {
    if (!timeString) {
      return null;
    }

    if (!format) {
      if (!isValidISOTimeString(timeString)) {
        return null;
      }

      return getLocalizationService().parseDateTimeISO8601(timeString);
    }

    const langLocale = getLocale$1().langLocale;
    const parseString = timeString.replace(/(\d)([AaPp][Mm])/g, '$1 $2'); // Modifying the time string so that strict parsing doesn't break on minor deviations

    const parseFormat = format.replace(/(\b|[^h])h{2}(?!h)/g, '$1h').replace(/(\b|[^H])H{2}(?!H)/g, '$1H').replace(/(\b|[^m])m{2}(?!m)/g, '$1m').replace(/\s*A/g, ' A').trim();
    const acceptableFormats = [parseFormat]; // We want to be lenient and accept input values with seconds or milliseconds precision.
    // So even though we may display the time as 10:23 AM, we would accept input values like 10:23:30.555 AM.

    acceptableFormats.push(parseFormat.replace('m', 'm:s'), parseFormat.replace('m', 'm:s.S'), parseFormat.replace('m', 'm:s.SS'), parseFormat.replace('m', 'm:s.SSS'));

    for (let i = 0; i < acceptableFormats.length; i++) {
      const time = getLocalizationService().parseDateTime(parseString, acceptableFormats[i], langLocale, strictParsing);

      if (time) {
        return time;
      }
    }

    return null;
  }

  var _tmpl$d = void 0;

  const FORMATTING_OPTS = ['weekday', 'year', 'month', 'day', 'hour', 'minute', 'second', 'era'];
  const FORMAT_MAP = {
    weekday: {
      short: 'EEE, ',
      narrow: 'EEE, ',
      long: 'EEEE, '
    },
    month: {
      short: 'MMM ',
      narrow: 'MMM ',
      numeric: 'MMM ',
      '2-digit': 'MMM ',
      long: 'MMMM '
    },
    day: {
      numeric: 'd, ',
      '2-digit': 'dd, '
    },
    year: {
      numeric: 'yyyy ',
      '2-digit': 'yy '
    },
    hour: {
      numeric12: 'h',
      numeric24: 'H',
      '2-digit12': 'hh',
      '2-digit24': 'HH'
    },
    minute: {
      numeric: 'mm',
      '2-digit': 'mm'
    },
    second: {
      numeric: 'ss',
      '2-digit': 'ss'
    },
    timeZoneName: {
      short: '[GMT]Z',
      long: '[GMT]Z'
    }
  };
  const SEPARATORS = [',', ' ', ':'];

  function getWeekDayPart(format, options) {
    const weekdayOptionValue = options.weekday;

    if (FORMAT_MAP.weekday[weekdayOptionValue] !== undefined) {
      format.push(FORMAT_MAP.weekday[weekdayOptionValue]);
    }
  }

  function getMonthPart(format, options) {
    const monthOptionValue = options.month;

    if (FORMAT_MAP.month[monthOptionValue] !== undefined) {
      format.push(FORMAT_MAP.month[monthOptionValue]);
    }
  }

  function getDayPart(format, options) {
    const dayOptionValue = options.day;

    if (FORMAT_MAP.day[dayOptionValue] !== undefined) {
      format.push(FORMAT_MAP.day[dayOptionValue]);
    }
  }

  function getYearPart(format, options) {
    const yearOptionValue = options.year;

    if (FORMAT_MAP.year[yearOptionValue] !== undefined) {
      format.push(FORMAT_MAP.year[yearOptionValue]);
    }
  }

  function getTZPart(format, options) {
    const timeZoneNameOptionValue = options.timeZoneName;

    if (FORMAT_MAP.timeZoneName[timeZoneNameOptionValue] !== undefined) {
      if (options.timeZone === 'UTC') {
        format.push('[GMT]');
      } else {
        format.push(FORMAT_MAP.timeZoneName[timeZoneNameOptionValue]);
      }
    }
  }

  function getTimePart(format, options) {
    const hourOptionValue = options.hour,
          minuteOptionValue = options.minute,
          secondOptionValue = options.second;
    let hasTime = false;
    let hasHourOnly = false; // hour 12 hr or 24 hr

    if (hourOptionValue === 'numeric' || hourOptionValue === '2-digit') {
      hasTime = true;

      if (options.hour12 === false) {
        if (hourOptionValue === 'numeric') {
          format.push(FORMAT_MAP.hour.numeric24);
        } else {
          format.push(FORMAT_MAP.hour['2-digit24']);
        }
      } else if (hourOptionValue === 'numeric') {
        format.push(FORMAT_MAP.hour.numeric12);
      } else {
        format.push(FORMAT_MAP.hour['2-digit12']);
      }

      if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
        format.push(':');
      } else if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
        hasHourOnly = true;
      }
    } // minute


    if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
      hasTime = true;
      format.push(FORMAT_MAP.minute[minuteOptionValue]);

      if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
        format.push(':');
      }
    } // second


    if (FORMAT_MAP.second[secondOptionValue] !== undefined && !hasHourOnly) {
      hasTime = true;
      format.push(FORMAT_MAP.second[secondOptionValue]);
    } // AM/PM marker


    if (hasTime) {
      format.push(' a ');
    }

    if (hasHourOnly) {
      format.push('[(sec]: ' + FORMAT_MAP.second[secondOptionValue] + '[)]');
    }
  }

  function DateTimeOptions(options) {
    this.options = options || {};
  }

  DateTimeOptions.prototype.hasFormattingOptions = function () {
    return FORMATTING_OPTS.some(opt => {
      return this.options[opt] !== undefined;
    });
  };

  DateTimeOptions.prototype.getSkeleton = function () {
    const format = [];
    getWeekDayPart(format, this.options);
    getMonthPart(format, this.options);
    getDayPart(format, this.options);
    getYearPart(format, this.options);
    getTimePart(format, this.options);
    getTZPart(format, this.options);
    let formatStr = format.join('');
    SEPARATORS.forEach(element => {
      if (formatStr.lastIndexOf(element) === formatStr.length - 1) {
        formatStr = formatStr.slice(0, -1);
      }
    });
    return formatStr;
  };

  var DateTimeOptions$1 = Engine.registerComponent(DateTimeOptions, {
    tmpl: _tmpl$d
  });

  const FALLBACK_LOCALE = 'en-us';
  const symbolsCache = {}; // Copied over from auraLocalizationService: override for locales which are not identified by browsers

  const localeOverrides = {
    no_NO: 'nb',
    // eslint-disable-line camelcase
    tl_PH: 'fil',
    // eslint-disable-line camelcase
    sh_BA: 'hr',
    // eslint-disable-line camelcase
    sh_ME: 'hr',
    // eslint-disable-line camelcase
    sh_CS: 'hr' // eslint-disable-line camelcase

  };
  function getNameOfWeekdays() {
    const locale = getNormalizedLocale();
    const localeCache = symbolsCache[locale];

    if (localeCache && localeCache.weekdays) {
      return localeCache.weekdays;
    }

    const locales = [locale, FALLBACK_LOCALE];
    const fullNameFormatter = new Intl.DateTimeFormat(locales, {
      weekday: 'long',
      timeZone: 'UTC'
    });
    const shortNameFormatter = new Intl.DateTimeFormat(locales, {
      weekday: 'short',
      timeZone: 'UTC'
    });
    const weekdays = [];

    for (let i = 0; i <= 6; i++) {
      // (1970, 0, 4) corresponds to a sunday.
      const date = new Date(Date.UTC(1970, 0, 4 + i));
      weekdays.push({
        fullName: format(fullNameFormatter, date),
        shortName: format(shortNameFormatter, date)
      });
    }

    if (!symbolsCache[locale]) {
      symbolsCache[locale] = {};
    }

    symbolsCache[locale].weekdays = weekdays;
    return weekdays;
  }
  function getMonthNames() {
    const locale = getNormalizedLocale();
    const localeCache = symbolsCache[locale];

    if (localeCache && localeCache.months) {
      return localeCache.months;
    }

    const locales = [locale, FALLBACK_LOCALE];
    const monthNameFormatter = new Intl.DateTimeFormat(locales, {
      month: 'long'
    });
    const months = [];

    for (let i = 0; i <= 11; i++) {
      const date = new Date(1970, i, 4);
      months.push({
        // we currently only need the fullName
        fullName: format(monthNameFormatter, date)
      });
    }

    if (!symbolsCache[locale]) {
      symbolsCache[locale] = {};
    }

    symbolsCache[locale].months = months;
    return months;
  }

  function format(dateTimeFormat, date) {
    const formattedDate = dateTimeFormat.format(date);
    return removeIE11Markers(formattedDate);
  }

  function removeIE11Markers(formattedString) {
    // IE11 adds LTR / RTL mark in the formatted date time string
    return formattedString.replace(/[\u200E\u200F]/g, '');
  }

  function getNormalizedLocale() {
    const locale = getLocale().langLocale;

    if (locale) {
      return localeOverrides[locale] || locale.toLowerCase().replace('_', '-');
    }

    return FALLBACK_LOCALE;
  }

  function normalizeISODate(value, format) {
    const dateValue = typeof value === 'string' ? value.trim() : value;

    if (!dateValue) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    } // if value is an ISO string, only fetch the date part


    const dateOnlyString = typeof dateValue === 'string' && dateValue.split(TIME_SEPARATOR)[0] || dateValue;
    assert(isValidISODateTimeString(dateOnlyString), `datetime component: The value attribute accepts a valid ISO8601 formatted string ` + `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`);
    const parsedDate = parseDateTime(dateOnlyString, STANDARD_DATE_FORMAT);

    if (!parsedDate) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    } // convert from Gregorian to Buddhist Calendar if necessary


    const civilDate = toOtherCalendar(parsedDate);
    return {
      isoValue: dateOnlyString,
      displayValue: formatDate(civilDate, format)
    };
  }
  function normalizeISOTime(value, format) {
    // We are not converting the time to the user's timezone. All values are displayed and saved as UTC time values
    const normalizedValue = removeTimeZoneSuffix(value);
    const timeValue = typeof normalizedValue === 'string' ? normalizedValue.trim() : normalizedValue;

    if (!timeValue) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    }

    assert(isValidISOTimeString(timeValue), `datetime component: The value attribute accepts a valid ISO8601 formatted string. ` + `but we are getting the ${typeof value} value "${value}" instead.`);
    const parsedTime = parseTime(timeValue);

    if (!parsedTime) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    }

    return {
      isoValue: formatTime(parsedTime, STANDARD_TIME_FORMAT),
      displayValue: formatTime(parsedTime, format)
    };
  }
  function normalizeISODateTime(value, timezone, format) {
    const dateTimeValue = typeof value === 'string' ? value.trim() : value;

    if (!dateTimeValue) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    }

    assert(isValidISODateTimeString(dateTimeValue), `datetime component: The value attribute accepts a valid ISO8601 formatted string ` + `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`);
    const parsedDate = parseDateTimeUTC(dateTimeValue);

    if (!parsedDate) {
      return {
        isoValue: null,
        displayValue: value || ''
      };
    }

    const convertedDate = syncUTCToWallTime(parsedDate, timezone);
    return {
      // We are passing the ISO value without a timezone designator.
      // the native input type='datetime-local' who calls this does not accept timezone offset
      isoValue: removeTimeZoneSuffix(convertedDate.toISOString()),
      displayValue: formatDateTimeUTC(convertedDate, format)
    };
  }
  function normalizeFormattedDate(value, format) {
    const dateValue = typeof value === 'string' ? value.trim() : value;

    if (!dateValue) {
      return null;
    }

    const parsedDate = parseDateTime(dateValue, format || getLocale$1().dateFormat, true);

    if (!parsedDate) {
      return null;
    }

    const gregorianDate = fromOtherCalendar(parsedDate);
    return formatDate(gregorianDate, STANDARD_DATE_FORMAT);
  }
  function normalizeFormattedTime(value, format) {
    const timeValue = typeof value === 'string' ? value.trim() : value;

    if (!timeValue) {
      return null;
    }

    const parsedDate = parseTime(timeValue, format || getLocale$1().timeFormat, true);

    if (!parsedDate) {
      return null;
    }

    return formatTime(parsedDate, STANDARD_TIME_FORMAT);
  }
  function normalizeFormattedDateTime(value, timezone, format) {
    const datetimeValue = typeof value === 'string' ? value.trim() : value;

    if (!datetimeValue) {
      return null;
    }

    const parsedDate = parseDateTimeUTC(datetimeValue, format);

    if (!parsedDate) {
      return null;
    }

    const convertedDate = syncWallTimeToUTC(parsedDate, timezone);
    return convertedDate.toISOString();
  }
  function getToday() {
    const today = getTodayBasedOnTimezone();
    return today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
  }
  function getCurrentTime(timezone) {
    const today = getTodayBasedOnTimezone(timezone);
    return pad(today.getHours()) + ':' + pad(today.getMinutes());
  }

  function getTodayBasedOnTimezone(timezone) {
    const today = new Date();
    today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000); // time in UTC
    // localization service will use $Locale.timezone when no timezone provided

    return syncUTCToWallTime(today, timezone);
  }

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  function tmpl$c($api, $cmp, $slotset, $ctx) {
    const {
      b: api_bind,
      c: api_custom_element,
      h: api_element,
      d: api_dynamic,
      gid: api_scoped_id,
      k: api_key,
      i: api_iterator,
      ti: api_tab_index
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6,
      _m7,
      _m8
    } = $ctx;
    return [api_element("div", {
      classMap: {
        "slds-datepicker": true,
        "slds-dropdown": true,
        "slds-dropdown_left": true
      },
      attrs: {
        "aria-hidden": "false",
        "aria-label": $cmp.computedAriaLabel,
        "role": "dialog"
      },
      key: 2
    }, [api_element("div", {
      classMap: {
        "slds-datepicker__filter": true,
        "slds-grid": true
      },
      key: 3
    }, [api_element("div", {
      classMap: {
        "slds-datepicker__filter_month": true,
        "slds-grid": true,
        "slds-grid_align-spread": true,
        "slds-grow": true
      },
      key: 4
    }, [api_element("div", {
      classMap: {
        "slds-align-middle": true
      },
      key: 5
    }, [api_custom_element("lightning-button-icon", buttonIcon, {
      props: {
        "iconName": "utility:left",
        "variant": "container",
        "alternativeText": $cmp.i18n.previousMonth
      },
      key: 6,
      on: {
        "click": _m0 || ($ctx._m0 = api_bind($cmp.goToPreviousMonth)),
        "keydown": _m1 || ($ctx._m1 = api_bind($cmp.handlePrevNavKeyDown))
      }
    }, [])]), api_element("h2", {
      classMap: {
        "slds-align-middle": true
      },
      attrs: {
        "aria-atomic": "true",
        "aria-live": "assertive",
        "id": api_scoped_id("month-title")
      },
      key: 7
    }, [api_dynamic($cmp.computedMonthTitle)]), api_element("div", {
      classMap: {
        "slds-align-middle": true
      },
      key: 8
    }, [api_custom_element("lightning-button-icon", buttonIcon, {
      props: {
        "iconName": "utility:right",
        "variant": "container",
        "alternativeText": $cmp.i18n.nextMonth
      },
      key: 9,
      on: {
        "click": _m2 || ($ctx._m2 = api_bind($cmp.goToNextMonth))
      }
    }, [])])]), api_element("div", {
      classMap: {
        "slds-shrink-none": true
      },
      key: 10
    }, [api_element("label", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "for": `${api_scoped_id("select-element")}`
      },
      key: 11
    }, [api_dynamic($cmp.i18n.yearSelector)]), api_element("div", {
      classMap: {
        "slds-select_container": true
      },
      key: 12
    }, [api_element("select", {
      classMap: {
        "slds-select": true
      },
      attrs: {
        "id": api_scoped_id("select-element")
      },
      key: 13,
      on: {
        "change": _m3 || ($ctx._m3 = api_bind($cmp.handleYearChange)),
        "click": _m4 || ($ctx._m4 = api_bind($cmp.handleYearSelectClick))
      }
    }, api_iterator($cmp.computedYearList, function (year) {
      return api_element("option", {
        attrs: {
          "value": year
        },
        key: api_key(15, year)
      }, [api_dynamic(year)]);
    }))])])]), api_element("table", {
      classMap: {
        "slds-datepicker__month": true
      },
      attrs: {
        "aria-labelledby": `${api_scoped_id("month-title")}`,
        "role": "grid"
      },
      key: 16
    }, [api_element("thead", {
      key: 17
    }, [api_element("tr", {
      attrs: {
        "id": api_scoped_id("weekdays-element")
      },
      key: 18
    }, api_iterator($cmp.computedWeekdayLabels, function (weekday) {
      return api_element("th", {
        attrs: {
          "id": api_scoped_id(weekday.fullName),
          "scope": "col"
        },
        key: api_key(20, weekday.fullName)
      }, [api_element("abbr", {
        attrs: {
          "title": weekday.fullName
        },
        key: 21
      }, [api_dynamic(weekday.shortName)])]);
    }))]), api_element("tbody", {
      key: 22,
      on: {
        "keydown": _m6 || ($ctx._m6 = api_bind($cmp.handleCalendarKeyDown))
      }
    }, api_iterator($cmp.computedMonth, function (week, index) {
      return api_element("tr", {
        key: api_key(24, week.id)
      }, api_iterator(week.days, function (day) {
        return api_element("td", {
          className: day.className,
          attrs: {
            "role": "gridcell",
            "aria-selected": day.isSelected,
            "aria-disabled": day.isDisabled,
            "aria-current": day.ariaCurrent,
            "tabindex": api_tab_index(day.tabIndex),
            "data-value": day.dateValue
          },
          key: api_key(26, day.dateValue)
        }, [api_element("span", {
          classMap: {
            "slds-day": true
          },
          key: 27,
          on: {
            "click": _m5 || ($ctx._m5 = api_bind($cmp.handleDateClick))
          }
        }, [api_dynamic(day.date)])]);
      }));
    }))]), api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-align_absolute-center": true,
        "slds-text-link": true
      },
      attrs: {
        "name": "today",
        "type": "button"
      },
      key: 28,
      on: {
        "click": _m7 || ($ctx._m7 = api_bind($cmp.handleTodayClick)),
        "keydown": _m8 || ($ctx._m8 = api_bind($cmp.handleTodayKeyDown))
      }
    }, [api_dynamic($cmp.i18n.today)])])];
  }

  var _tmpl$e = Engine.registerTemplate(tmpl$c);
  tmpl$c.stylesheets = [];
  tmpl$c.stylesheetTokens = {
    hostAttribute: "lightning-calendar_calendar-host",
    shadowAttribute: "lightning-calendar_calendar"
  };

  function handleKeyDownOnCalendar(event, date, calendarInterface) {
    const tdElement = event.target;

    switch (event.keyCode) {
      case keyCodes.up:
        preventDefaultAndStopPropagation(event);
        date.setDate(date.getDate() - 7);
        calendarInterface.focusDate(date);
        break;

      case keyCodes.down:
        preventDefaultAndStopPropagation(event);
        date.setDate(date.getDate() + 7);
        calendarInterface.focusDate(date);
        break;

      case keyCodes.right:
        preventDefaultAndStopPropagation(event);
        date.setDate(date.getDate() + 1);
        calendarInterface.focusDate(date);
        break;

      case keyCodes.left:
        preventDefaultAndStopPropagation(event);
        date.setDate(date.getDate() - 1);
        calendarInterface.focusDate(date);
        break;

      case keyCodes.enter:
      case keyCodes.space:
        preventDefaultAndStopPropagation(event);
        calendarInterface.selectDate(tdElement);
        break;

      case keyCodes.pageup:
        preventDefaultAndStopPropagation(event);

        if (event.altKey) {
          date.setFullYear(date.getFullYear() - 1);
        } else {
          date.setMonth(date.getMonth() - 1);
        }

        calendarInterface.focusDate(date);
        break;

      case keyCodes.pagedown:
        preventDefaultAndStopPropagation(event);

        if (event.altKey) {
          date.setFullYear(date.getFullYear() + 1);
        } else {
          date.setMonth(date.getMonth() + 1);
        }

        calendarInterface.focusDate(date);
        break;

      case keyCodes.home:
        // eslint-disable-line no-case-declarations
        preventDefaultAndStopPropagation(event);
        const startOfWeek = calendarInterface.getStartOfWeek(date);
        calendarInterface.focusDate(startOfWeek);
        break;

      case keyCodes.end:
        // eslint-disable-line no-case-declarations
        preventDefaultAndStopPropagation(event);
        const endOfWeek = calendarInterface.getStartOfWeek(date);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        calendarInterface.focusDate(endOfWeek);
        break;

      default:
    }
  }
  function handleKeyDownOnToday(event, calendarInterface) {
    switch (event.keyCode) {
      case keyCodes.tab:
        if (!event.shiftKey) {
          preventDefaultAndStopPropagation(event);
          calendarInterface.focusFirstFocusableElement();
        }

        break;

      default:
    }
  }
  function handleKeyDownOnPreviousMonthNav(event, calendarInterface) {
    switch (event.keyCode) {
      case keyCodes.tab:
        if (event.shiftKey) {
          preventDefaultAndStopPropagation(event);
          calendarInterface.focusLastFocusableElement();
        }

        break;

      default:
    }
  }

  function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const i18n$5 = {
    ariaLabelMonth: labelAriaLabelMonth,
    nextMonth: labelNextMonth,
    previousMonth: labelPreviousMonth,
    today: labelToday,
    yearSelector: labelYearSelector
  };
  const WEEKS_PER_MONTH = 6;
  const DAYS_PER_WEEK = 7;
  const calendarCache = {}; // cache of calendar cells for a given year/month

  class LightningCalendar extends Engine.LightningElement {
    get value() {
      return this.selectedDate;
    }

    set value(newValue) {
      // if value is an ISO string, only fetch the time part
      const dateOnlyString = typeof newValue === 'string' ? newValue.split(TIME_SEPARATOR)[0] : newValue;

      if (dateOnlyString !== this.selectedDate) {
        this.selectedDate = dateOnlyString;

        if (!this.connected) {
          return;
        }

        const newDate = this.parseDate(dateOnlyString); // if the date is invalid, render today's date

        if (!newDate) {
          this.selectedDate = null;
          this.renderToday();
        } else {
          this.selectDate(newDate);
        }
      }
    }

    constructor() {
      super();
      this.calendarYear = null;
      this.calendarMonth = null;
      this.min = void 0;
      this.max = void 0;
      this.initialRender = true;
      this.uniqueId = generateUniqueId();
    }

    renderedCallback() {
      if (this.initialRender) {
        this.todayDate = getToday(); // The connected logic here is needed because at the point when the @api setters are called, the actual value
        // for today's date may not have been set yet

        this.connected = true;
        const renderDate = this.getSelectedDate() || this.getTodaysDate();
        this.renderCalendar(renderDate);
        this.initialRender = false;
      }
    }

    connectedCallback() {
      this.keyboardInterface = this.calendarKeyboardInterface();
    }

    disconnectedCallback() {
      this.connected = false;
    }
    /**
     * Sets focus on the focusable date cell in the calendar.
     */


    focus() {
      requestAnimationFrame(() => {
        const dateElement = this.getFocusableDateCell();

        if (dateElement) {
          dateElement.focus();
        }
      });
    }

    get i18n() {
      return i18n$5;
    }

    get computedAriaLabel() {
      const renderedMonth = this.getCalendarDate().getMonth();
      return i18n$5.ariaLabelMonth + getMonthNames()[renderedMonth].fullName;
    }

    get computedMonthTitle() {
      const renderedMonth = this.getCalendarDate().getMonth();
      return getMonthNames()[renderedMonth].fullName;
    }

    get computedWeekdayLabels() {
      const nameOfWeekdays = getNameOfWeekdays();
      const firstDayOfWeek = this.getFirstDayOfWeek();
      const computedWeekdayLabels = []; // We need to adjust the weekday labels to start from the locale's first day of week

      for (let i = firstDayOfWeek; i < nameOfWeekdays.length; i++) {
        computedWeekdayLabels.push(nameOfWeekdays[i]);
      }

      for (let i = 0; i < firstDayOfWeek; i++) {
        computedWeekdayLabels.push(nameOfWeekdays[i]);
      }

      return computedWeekdayLabels;
    }

    get computedSelectElementId() {
      return this.uniqueId + '-select';
    }

    get computedWeekdaysElementId() {
      return this.uniqueId + '-weekdays';
    }

    get computedMonthTitleId() {
      return this.uniqueId + '-month';
    }

    get computedYearList() {
      const sampleDate = new Date();
      const currentYear = sampleDate.getFullYear();
      const minDate = this.parseDate(this.min);
      const maxDate = this.parseDate(this.max);
      const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
      sampleDate.setFullYear(minYear);
      const convertedMinYear = toOtherCalendar(sampleDate).getFullYear();
      const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 100;
      sampleDate.setFullYear(maxYear);
      const convertedMaxYear = toOtherCalendar(sampleDate).getFullYear();
      const yearList = [];

      for (let year = convertedMinYear; year <= convertedMaxYear; year++) {
        yearList.push(year);
      }

      return yearList;
    }

    get computedMonth() {
      // The calendar will be rendered after getting today's date based on the user's timezone
      if (!this.connected) {
        return [];
      }

      this.removeCurrentlySelectedDateAttributes();
      const selectedDate = this.getSelectedDate();
      const renderDate = this.getCalendarDate();
      const cacheKey = this.getCalendarCacheKey(renderDate, selectedDate);

      if (cacheKey in calendarCache) {
        return calendarCache[cacheKey];
      }

      const todayDate = this.getTodaysDate();
      const focusableDate = this.getInitialFocusDate(todayDate, selectedDate, renderDate);
      const calendarDates = {
        selectedDate,
        renderDate,
        focusableDate,
        todayDate,
        minDate: this.parseDate(this.min),
        maxDate: this.parseDate(this.max)
      };
      const monthCells = [];
      const date = this.getCalendarStartDate(renderDate);

      for (let week = 0; week < WEEKS_PER_MONTH; week++) {
        const weekCells = {
          id: week,
          days: []
        };

        for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday++) {
          const dayCell = this.getDateCellAttributes(date, calendarDates);
          weekCells.days.push(dayCell);
          date.setDate(date.getDate() + 1);
        }

        monthCells.push(weekCells);
      }

      calendarCache[cacheKey] = monthCells;
      return monthCells;
    }

    getDateCellAttributes(date, calendarDates) {
      const isDisabled = !this.dateInCalendar(date, calendarDates.renderDate) || !this.isBetween(date, calendarDates.minDate, calendarDates.maxDate);
      const isSelected = this.isSame(date, calendarDates.selectedDate);
      const isToday = this.isSame(date, calendarDates.todayDate);
      const ariaCurrent = isToday ? 'date' : false;
      const tabIndex = this.isSame(date, calendarDates.focusableDate) ? '0' : false;
      const className = classSet().add({
        'slds-is-today': isToday,
        'slds-is-selected': isSelected,
        'slds-disabled-text': isDisabled
      }).toString();
      return {
        date: date.getDate(),
        dateValue: this.formatDate(date),
        isDisabled,
        isSelected: isSelected ? 'true' : 'false',
        className,
        tabIndex,
        ariaCurrent
      };
    }

    dispatchSelectEvent() {
      this.dispatchEvent(new CustomEvent('select', {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this.selectedDate
        }
      }));
    } // Determines if the date is in the rendered month/year calendar.


    dateInCalendar(date, calendarDate) {
      const renderedCalendar = calendarDate || this.getCalendarDate();
      return date.getMonth() === renderedCalendar.getMonth() && date.getFullYear() === renderedCalendar.getFullYear();
    }

    getInitialFocusDate(todayDate, selectedDate, renderedDate) {
      if (selectedDate && this.dateInCalendar(selectedDate, renderedDate)) {
        return selectedDate;
      }

      if (this.dateInCalendar(todayDate, renderedDate)) {
        return todayDate;
      }

      return new Date(renderedDate.getFullYear(), renderedDate.getMonth(), 1);
    }

    getTodaysDate() {
      if (this.todayDate) {
        return this.parseDate(this.todayDate);
      } // Today's date will be fetched in connectedCallback. In the meantime, use the date based on the device timezone.


      return new Date();
    }

    getSelectedDate() {
      return this.parseDate(this.selectedDate);
    } // returns the month and year in the calendar


    getCalendarDate() {
      if (this.calendarYear) {
        return new Date(this.calendarYear, this.calendarMonth, 1);
      }

      return this.getTodaysDate();
    }

    getCalendarStartDate(renderedDate) {
      const firstDayOfMonth = new Date(renderedDate.getFullYear(), renderedDate.getMonth(), 1);
      return this.getStartOfWeek(firstDayOfMonth);
    }

    getStartOfWeek(dayInWeek) {
      const firstDayOfWeek = this.getFirstDayOfWeek(); // Negative dates in JS will subtract days from the 1st of the given month

      let startDay = dayInWeek.getDay();

      while (startDay !== firstDayOfWeek) {
        dayInWeek.setDate(dayInWeek.getDate() - 1);
        startDay = dayInWeek.getDay();
      }

      return dayInWeek;
    }

    getFirstDayOfWeek() {
      return getLocale$1().firstDayOfWeek - 1; // In Java, week days are 1 - 7
    } // This method is called when a new value is set, or when you click the today button.
    // In both cases, we need to check if newValue is in the currently rendered calendar


    selectDate(newDate) {
      if (this.dateInCalendar(newDate)) {
        const dateElement = this.getElementByDate(this.formatDate(newDate)); // do not select if date is disabled

        if (this.dateElementDisabled(dateElement)) {
          return;
        }

        this.selectDateInCalendar(dateElement);
      } else {
        this.renderCalendar(newDate);
      }
    } // Select a date in current calendar without the need to re-render the calendar


    selectDateInCalendar(dateElement) {
      this.selectedDate = dateElement.getAttribute('data-value');
      this.removeCurrentlySelectedDateAttributes();
      this.addSelectedDateAttributes(dateElement);
    }

    selectDateInCalendarAndDispatchSelect(dateElement) {
      // do not select if date is disabled
      if (this.dateElementDisabled(dateElement)) {
        return;
      }

      this.selectDateInCalendar(dateElement);
      this.dispatchSelectEvent();
    } // we should be able to control the select value with an attribute once we have a select component


    selectYear(year) {
      const sampleDate = new Date();
      sampleDate.setFullYear(year);
      const convertedYear = toOtherCalendar(sampleDate).getFullYear();
      const optionElement = this.template.querySelector(`option[value='${convertedYear}']`);

      if (optionElement) {
        optionElement.selected = true;
      }
    }

    getElementByDate(dateString) {
      return this.template.querySelector(`td[data-value='${dateString}']`);
    }

    getFocusableDateCell() {
      return this.template.querySelector(`td[tabIndex='0']`);
    }

    unfocusDateCell(element) {
      if (element) {
        element.removeAttribute('tabIndex');
      }
    }

    focusDateCell(element) {
      if (element) {
        element.setAttribute('tabIndex', 0);
        element.focus();
      }
    }

    focusElementByDate(date) {
      requestAnimationFrame(() => {
        const element = this.getElementByDate(this.formatDate(date));

        if (element) {
          this.unfocusDateCell(this.getFocusableDateCell());
          this.focusDateCell(element);
        }
      });
    }

    renderCalendar(newDate) {
      this.calendarMonth = newDate.getMonth();
      this.calendarYear = newDate.getFullYear();
      this.selectYear(newDate.getFullYear());
    }

    renderToday() {
      const todaysDate = this.getTodaysDate();

      if (this.dateInCalendar(todaysDate)) {
        this.removeCurrentlySelectedDateAttributes();
        this.unfocusDateCell(this.getFocusableDateCell());
        const todayElement = this.getElementByDate(this.todayDate);
        todayElement.setAttribute('tabIndex', 0);
      } else {
        this.renderCalendar(todaysDate);
      }
    }

    removeCurrentlySelectedDateAttributes() {
      const currentlySelectedElement = this.template.querySelector(`td[class*='slds-is-selected']`);

      if (currentlySelectedElement) {
        currentlySelectedElement.classList.remove('slds-is-selected');
        currentlySelectedElement.setAttribute('aria-selected', 'false');
      }

      this.unfocusDateCell(this.getFocusableDateCell());
    }

    addSelectedDateAttributes(dateElement) {
      this.focusDateCell(dateElement);
      dateElement.classList.add('slds-is-selected');
      dateElement.setAttribute('aria-selected', 'true');
    }

    dateElementDisabled(dateElement) {
      // do not select if date is disabled
      return !dateElement || dateElement.getAttribute('aria-disabled') === 'true';
    }

    handleCalendarKeyDown(event) {
      const dateString = event.target.getAttribute('data-value');
      handleKeyDownOnCalendar(event, this.parseDate(dateString), this.keyboardInterface);
    }

    handleTodayKeyDown(event) {
      handleKeyDownOnToday(event, this.keyboardInterface);
    }

    handlePrevNavKeyDown(event) {
      handleKeyDownOnPreviousMonthNav(event, this.keyboardInterface);
    }

    handleDateClick(event) {
      event.stopPropagation();
      const tdElement = event.target.parentElement;
      this.selectDateInCalendarAndDispatchSelect(tdElement);
    }

    handleTodayClick(event) {
      event.stopPropagation();
      this.selectedDate = this.todayDate;
      this.selectDate(this.getTodaysDate());
      this.dispatchSelectEvent();
    }

    handleYearSelectClick(event) {
      event.stopPropagation();
    }

    handleYearChange(event) {
      const sampleDate = new Date();
      sampleDate.setFullYear(event.target.value);
      const convertedYear = fromOtherCalendar(sampleDate).getFullYear();

      if (this.calendarYear !== convertedYear) {
        this.calendarYear = convertedYear;
      }
    }

    goToNextMonth(event) {
      event.stopPropagation();
      const calendarDate = this.getCalendarDate();
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      this.renderCalendar(calendarDate);
    }

    goToPreviousMonth(event) {
      event.stopPropagation();
      const calendarDate = this.getCalendarDate();
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      this.renderCalendar(calendarDate);
    }

    calendarKeyboardInterface() {
      const that = this;
      return {
        focusDate(newDate) {
          if (!that.dateInCalendar(newDate)) {
            that.renderCalendar(newDate);
          }

          that.focusElementByDate(newDate);
        },

        getStartOfWeek(dayInWeek) {
          return that.getStartOfWeek(dayInWeek);
        },

        focusFirstFocusableElement() {
          that.template.querySelector('lightning-button-icon').focus();
        },

        focusLastFocusableElement() {
          that.template.querySelector('button[name="today"]').focus();
        },

        selectDate(dateElement) {
          that.selectDateInCalendarAndDispatchSelect(dateElement);
        }

      };
    }

    formatDate(date) {
      return formatDate(date, STANDARD_DATE_FORMAT);
    }

    parseDate(dateString) {
      return parseDateTime(dateString, STANDARD_DATE_FORMAT, true);
    }

    isSame(date1, date2) {
      return isSame(date1, date2);
    }

    isBetween(date, date1, date2) {
      let isBeforeEndDate = true;
      let isAfterStartDate = true;

      if (date2) {
        isBeforeEndDate = isBefore(date, date2, 'day') || this.isSame(date, date2);
      }

      if (date1) {
        isAfterStartDate = isAfter(date, date1, 'day') || this.isSame(date, date1);
      }

      return isBeforeEndDate && isAfterStartDate;
    }

    getCalendarCacheKey(renderDate, selectedDate) {
      let key = renderDate.getFullYear() + '-' + renderDate.getMonth(); // Having the key include min/max seems enough for now.
      // We're not going to complicate things by checking if renderDate falls before/after the min/max.

      key += this.min ? 'min' + this.min : '';
      key += this.max ? 'max' + this.max : '';

      if (selectedDate && this.dateInCalendar(selectedDate, renderDate)) {
        key += '_' + selectedDate.getDate();
      }

      return key;
    }

  }

  Engine.registerDecorators(LightningCalendar, {
    publicProps: {
      min: {
        config: 0
      },
      max: {
        config: 0
      },
      value: {
        config: 3
      }
    },
    publicMethods: ["focus"],
    track: {
      calendarYear: 1,
      calendarMonth: 1
    }
  });

  var calendar = Engine.registerComponent(LightningCalendar, {
    tmpl: _tmpl$e
  });

  var labelInvalidDate = 'Your entry does not match the allowed format {0}.';

  var labelRangeOverflow$1 = 'Value must be {0} or earlier.';

  var labelRangeUnderflow$1 = 'Value must be {0} or later.';

  var labelSelectDate = 'Select a date';

  function tmpl$d($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      h: api_element,
      d: api_dynamic,
      gid: api_scoped_id,
      c: api_custom_element,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6,
      _m7,
      _m8,
      _m9,
      _m10,
      _m11
    } = $ctx;
    return [api_element("div", {
      classMap: {
        "slds-form-element": true,
        "slds-dropdown-trigger": true,
        "slds-dropdown-trigger_click": true,
        "slds-size_1-of-1": true
      },
      attrs: {
        "tabindex": "-1"
      },
      key: 2
    }, [api_element("label", {
      className: $cmp.computedLabelClass,
      attrs: {
        "for": `${api_scoped_id("input")}`
      },
      key: 3
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 5
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]), $cmp.fieldLevelHelp ? api_custom_element("lightning-helptext", helptext, {
      props: {
        "content": $cmp.fieldLevelHelp
      },
      key: 6
    }, []) : null, api_element("div", {
      classMap: {
        "slds-form-element__control": true,
        "slds-input-has-icon": true,
        "slds-input-has-icon_right": true
      },
      key: 7
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": "text",
        "id": api_scoped_id("input"),
        "name": $cmp.name,
        "placeholder": $cmp.placeholder,
        "aria-label": $cmp.ariaLabel
      },
      props: {
        "value": $cmp.displayValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 8,
      on: {
        "input": _m0 || ($ctx._m0 = api_bind($cmp.handleInput)),
        "change": _m1 || ($ctx._m1 = api_bind($cmp.handleInputChange)),
        "focus": _m2 || ($ctx._m2 = api_bind($cmp.handleInputFocus)),
        "blur": _m3 || ($ctx._m3 = api_bind($cmp.handleInputBlur)),
        "keydown": _m4 || ($ctx._m4 = api_bind($cmp.handleInputKeydown)),
        "click": _m5 || ($ctx._m5 = api_bind($cmp.handleInputClick))
      }
    }, []), api_custom_element("lightning-button-icon", buttonIcon, {
      classMap: {
        "slds-input__icon": true,
        "slds-input__icon_right": true
      },
      props: {
        "iconName": "utility:event",
        "variant": "bare",
        "disabled": $cmp.computedIconDisabledState,
        "title": $cmp.i18n.selectDate,
        "alternativeText": $cmp.i18n.selectDate
      },
      key: 9,
      on: {
        "click": _m6 || ($ctx._m6 = api_bind($cmp.handleDatePickerIconClick)),
        "keydown": _m7 || ($ctx._m7 = api_bind($cmp.handleDatePickerIconKeyDown)),
        "focus": _m8 || ($ctx._m8 = api_bind($cmp.handleIconFocus)),
        "blur": _m9 || ($ctx._m9 = api_bind($cmp.handleIconBlur))
      }
    }, []), $cmp.isCalendarVisible ? api_custom_element("lightning-calendar", calendar, {
      props: {
        "value": $cmp.value,
        "min": $cmp.min,
        "max": $cmp.max
      },
      key: 11,
      on: {
        "keydown": _m10 || ($ctx._m10 = api_bind($cmp.handleCalendarKeyDown)),
        "select": _m11 || ($ctx._m11 = api_bind($cmp.handleDateSelect))
      }
    }, []) : null])]), $cmp.errorMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "id": api_scoped_id("error-message"),
        "data-error-message": true,
        "aria-live": "assertive"
      },
      key: 13
    }, [api_dynamic($cmp.errorMessage)]) : null];
  }

  var _tmpl$f = Engine.registerTemplate(tmpl$d);
  tmpl$d.stylesheets = [];
  tmpl$d.stylesheetTokens = {
    hostAttribute: "lightning-datepicker_datepicker-host",
    shadowAttribute: "lightning-datepicker_datepicker"
  };

  function handleKeyDownOnDatePickerIcon(event, datepickerInterface) {
    switch (event.keyCode) {
      case keyCodes.enter:
      case keyCodes.space:
        preventDefaultAndStopPropagation$1(event);
        datepickerInterface.showCalendar();
        break;

      case keyCodes.escape:
        preventDefaultAndStopPropagation$1(event);
        datepickerInterface.hideCalendar();
        break;

      default:
    }
  }
  function handleBasicKeyDownBehaviour(event, datepickerInterface) {
    if (!datepickerInterface.isCalendarVisible()) {
      return;
    }

    if (event.keyCode === keyCodes.escape) {
      preventDefaultAndStopPropagation$1(event);
      datepickerInterface.hideCalendar();
    }
  }

  function preventDefaultAndStopPropagation$1(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const i18n$6 = {
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow$1,
    rangeUnderflow: labelRangeUnderflow$1,
    required: labelRequired,
    selectDate: labelSelectDate
  };
  const ARIA_CONTROLS = 'aria-controls';
  const ARIA_LABEL = 'aria-label';
  const ARIA_LABELLEDBY = 'aria-labelledby';
  const ARIA_DESCRIBEDBY = 'aria-describedby';

  class LightningDatePicker extends Engine.LightningElement {
    // setter is required to properly trigger update
    get ariaLabel() {
      return this._ariaLabel;
    }

    set ariaLabel(val) {
      this._ariaLabel = val;
    }

    set ariaLabelledByElement(el) {
      this._ariaLabelledBy = el;
      this.synchronizeA11y();
    }

    get ariaLabelledByElement() {
      return this._ariaLabelledBy;
    }

    set ariaControlsElement(el) {
      this._ariaControls = el;
      this.synchronizeA11y();
    }

    get ariaControlsElement() {
      return this._ariaControls;
    }

    set ariaDescribedByElements(el) {
      if (Array.isArray(el)) {
        this._ariaDescribedBy = el;
      } else {
        this._ariaDescribedBy = [el];
      }

      this.synchronizeA11y();
    }

    get ariaDescribedByElements() {
      return this._ariaDescribedBy;
    }

    get ariaLabelledbyId() {
      return getRealDOMId(this._ariaLabelledBy);
    }

    get ariaControlsId() {
      return getRealDOMId(this.ariaControlsElement);
    }

    synchronizeA11y() {
      const input = this.template.querySelector('input');

      if (!input) {
        return;
      }

      synchronizeAttrs(input, {
        [ARIA_LABELLEDBY]: this.ariaLabelledbyId,
        [ARIA_DESCRIBEDBY]: this.computedAriaDescribedby,
        [ARIA_CONTROLS]: this.ariaControlsId,
        [ARIA_LABEL]: this._ariaLabel
      });
    }

    renderedCallback() {
      this.synchronizeA11y();
    }

    get value() {
      return this._value;
    }

    set value(newValue) {
      const normalizedValue = this.normalizeInputValue(newValue);

      if (normalizedValue !== this._value) {
        const normalizedDate = normalizeISODate(normalizedValue);
        this._value = normalizedDate.isoValue;
        this._displayValue = normalizedDate.displayValue;
      }
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);
    }

    get readOnly() {
      return this._readonly;
    }

    set readOnly(value) {
      this._readonly = normalizeBoolean(value);
    }

    get required() {
      return this._required;
    }

    set required(value) {
      this._required = normalizeBoolean(value);
    }

    set fieldLevelHelp(value) {
      this._fieldLevelHelp = value;
    }

    get fieldLevelHelp() {
      return this._fieldLevelHelp;
    }

    get variant() {
      return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
      this._variant = normalizeVariant$1(value);
    }
    /**
     * Sets focus on the input element.
     */


    focus() {
      if (this.connected) {
        this.inputElement.focus();
      }
    }
    /**
     * Removes keyboard focus from the input element.
     */


    blur() {
      if (this.connected) {
        this.inputElement.blur();
      }
    }
    /**
     * The following will result in the value being invalid:
     * - Missing: if the value is missing when the input is required
     * - Bad input: if the date that cannot be parsed in the locale format using strict parsing
     * - Overflow/Underflow: if the date is before 'min' or after 'max'
     */


    get validity() {
      const selectedDate = this.parse(this._value);
      return buildSyntheticValidity({
        valueMissing: this.required && !this._displayValue,
        badInput: !!this._displayValue && this._value === null,
        rangeOverflow: this.isAfterMaxDate(selectedDate),
        rangeUnderflow: this.isBeforeMinDate(selectedDate),
        customError: this.customErrorMessage != null && this.customErrorMessage !== ''
      });
    }
    /**
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */


    checkValidity() {
      return this.validity.valid;
    }
    /**
     * Sets a custom error message to be displayed when the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */


    setCustomValidity(message) {
      this.customErrorMessage = message;
    }
    /**
     * Displays an error message if the input value is invalid.
     */


    showHelpMessageIfInvalid() {
      if (!this.connected || this.readOnly) {
        return;
      }

      const validity = this.validity;

      if (validity.valid) {
        this._errorMessage = '';
        this.classList.remove('slds-has-error');
      } else {
        this.classList.add('slds-has-error');
        this._errorMessage = getErrorMessage(validity, this.getErrorMessageLabels());
      }
    }

    constructor() {
      super();
      this._disabled = false;
      this._readonly = false;
      this._required = false;
      this._value = null;
      this._calendarVisible = false;
      this._displayValue = null;
      this._errorMessage = '';
      this._fieldLevelHelp = void 0;
      this._variant = void 0;
      this.label = void 0;
      this.name = void 0;
      this.max = void 0;
      this.min = void 0;
      this.placeholder = void 0;
      this.messageWhenValueMissing = void 0;
      this.messageWhenBadInput = void 0;
      this.messageWhenRangeOverflow = void 0;
      this.messageWhenRangeUnderflow = void 0;
      this._ariaLabelledBy = void 0;
      this._ariaControls = void 0;
      this._ariaDescribedBy = [];
      this.uniqueId = generateUniqueId();
    }

    connectedCallback() {
      this.connected = true;
      this.keyboardInterface = this.datepickerKeyboardInterface();
      this.documentClickHandler = this.getClickHandler.bind(this);
      this.interactingState = new InteractingState({
        debounceInteraction: true
      });
      this.interactingState.onenter(() => {
        this.dispatchEvent(new CustomEvent('focus'));
      });
      this.interactingState.onleave(() => {
        if (this.connected) {
          this.showHelpMessageIfInvalid();
          this.dispatchEvent(new CustomEvent('blur'));
        }
      });
    }

    disconnectedCallback() {
      this.connected = false; // make sure the click handler has been removed from the document

      document.removeEventListener('click', this.documentClickHandler);
    }

    get i18n() {
      return i18n$6;
    }

    get isLabelHidden() {
      return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
      return classSet('slds-form-element__label').add({
        'slds-assistive-text': this.isLabelHidden
      }).toString();
    }

    get computedUniqueErrorMessageElementId() {
      const el = this.template.querySelector('[data-error-message]');
      return getRealDOMId(el);
    }

    get isCalendarVisible() {
      return this._calendarVisible;
    }

    get displayValue() {
      return this._displayValue;
    }

    get errorMessage() {
      return this._errorMessage;
    }

    get computedIconDisabledState() {
      return this.disabled || this.readOnly;
    }

    get computedAriaDescribedby() {
      const ariaValues = [];

      if (this.errorMessage) {
        ariaValues.push(this.computedUniqueErrorMessageElementId);
      }

      this._ariaDescribedBy.forEach(item => {
        const id = getRealDOMId(item);

        if (id) {
          ariaValues.push(id);
        }
      });

      return normalizeAriaAttribute(ariaValues);
    }

    handleInputChange(event) {
      event.stopPropagation(); // keeping the display value in sync with the element's value

      this._displayValue = event.currentTarget.value;
      this._value = normalizeFormattedDate(this._displayValue);
      this.dispatchChangeEvent();
    }

    handleInput() {
      // keeping the display value in sync with the element's value
      this._displayValue = this.inputElement.value; // basically making sure that the focus remains on the input and we're not triggering leave

      this.hideCalendarAndFocusTrigger();
    }

    handleInputFocus() {
      this.interactingState.enter();
    }

    handleInputBlur() {
      if (!this.isCalendarVisible) {
        this.interactingState.leave();
      }
    }

    handleInputClick(event) {
      if (this.readOnly) {
        return;
      }

      this.calendarTrigger = event.target;
      this.showCalendar();
    }

    handleIconBlur() {
      if (!this.isCalendarVisible) {
        this.interactingState.leave();
      }
    }

    handleIconFocus() {
      this.interactingState.enter();
    }

    handleDatePickerIconClick(event) {
      if (this.readOnly || this.disabled) {
        return;
      }

      this.calendarTrigger = event.target;
      this.showAndFocusCalendar();
    }

    handleInputKeydown(event) {
      this.calendarTrigger = event.target;
      handleBasicKeyDownBehaviour(event, this.keyboardInterface);
    }

    handleDatePickerIconKeyDown(event) {
      this.calendarTrigger = event.target;
      handleKeyDownOnDatePickerIcon(event, this.keyboardInterface);
    }

    handleCalendarKeyDown(event) {
      handleBasicKeyDownBehaviour(event, this.keyboardInterface);
    }

    handleDateSelect(event) {
      event.stopPropagation();
      this._value = event.detail.value;
      this._displayValue = normalizeISODate(this._value).displayValue;
      this.hideCalendarAndFocusTrigger();
      this.showHelpMessageIfInvalid();
      this.dispatchChangeEvent();
    }

    showAndFocusCalendar() {
      this.showCalendar();
      requestAnimationFrame(() => {
        this.focusCalendar();
      });
    }

    hideCalendarAndFocusTrigger() {
      this.hideCalendar();
      this.calendarTrigger.focus(); // in the case where the input already has focus, we should re-enter to make sure we are not triggering leave

      this.interactingState.enter();
    }

    focusCalendar() {
      const calendar$$1 = this.template.querySelector('lightning-calendar');

      if (calendar$$1) {
        calendar$$1.focus();
      }
    }

    startPositioning() {
      requestAnimationFrame(() => {
        if (!this._relationship) {
          this._relationship = startPositioning(this, {
            target: () => this.template.querySelector('input'),
            element: () => this.template.querySelector('lightning-calendar').shadowRoot.querySelector('div'),
            align: {
              horizontal: Direction.Right,
              vertical: Direction.Top
            },
            targetAlign: {
              horizontal: Direction.Right,
              vertical: Direction.Bottom
            },
            autoFlip: true,
            // Auto flip direction if not have enough space
            leftAsBoundary: true // horizontal flip uses target left as boundary

          });
        } else {
          this._relationship.reposition();
        }
      });
    }

    stopPositioning() {
      if (this._relationship) {
        stopPositioning(this._relationship);
        this._relationship = null;
      }
    }

    showCalendar() {
      if (!this.isCalendarVisible) {
        this.interactingState.enter(); // Async bind the click handler because we are currently handling a
        // click event and we don't want to immediately close the calendar.

        requestAnimationFrame(() => {
          this.addDocumentClickHandler();
        });
        this.rootElement.classList.add('slds-is-open');
        this._calendarVisible = true;
        this.startPositioning();
      }
    }

    hideCalendar() {
      if (this.isCalendarVisible) {
        this.removeDocumentClickHandler();
        this.rootElement.classList.remove('slds-is-open');
        this.stopPositioning();
        this._calendarVisible = false;
        this.interactingState.leave();
      }
    }

    get rootElement() {
      return this.template.querySelector('div');
    }

    get inputElement() {
      return this.template.querySelector('input');
    }

    get dateFormat() {
      if (!this._dateFormat) {
        this._dateFormat = getLocale$1().dateFormat;
      }

      return this._dateFormat;
    }

    dispatchChangeEvent() {
      this.dispatchEvent(new CustomEvent('change', {
        composed: true,
        bubbles: true,
        detail: {
          value: this._value
        }
      }));
    }

    addDocumentClickHandler() {
      document.addEventListener('click', this.documentClickHandler);
    }

    removeDocumentClickHandler() {
      document.removeEventListener('click', this.documentClickHandler);
    }

    getClickHandler(event) {
      const rootElement = this.rootElement;

      if (!rootElement.contains(event.target)) {
        this.hideCalendar();
      }
    }

    datepickerKeyboardInterface() {
      const that = this;
      return {
        showCalendar() {
          that.showAndFocusCalendar();
        },

        hideCalendar() {
          that.hideCalendarAndFocusTrigger();
        },

        isCalendarVisible() {
          return that.isCalendarVisible;
        }

      };
    }

    normalizeInputValue(value) {
      if (!value || value === '') {
        return null;
      }

      return value;
    }

    parse(dateString) {
      return parseDateTime(dateString, STANDARD_DATE_FORMAT, true);
    }

    isBeforeMinDate(date) {
      const minDate = this.parse(this.min);
      return minDate ? isBefore(date, minDate, 'day') : false;
    }

    isAfterMaxDate(date) {
      const maxDate = this.parse(this.max);
      return maxDate ? isAfter(date, maxDate, 'day') : false;
    }

    getErrorMessageLabels() {
      const valueMissing = this.messageWhenValueMissing;
      const badInput = this.messageWhenBadInput || this.formatString(this.i18n.invalidDate, this.dateFormat);
      const rangeOverflow = this.messageWhenRangeOverflow || this.formatString(this.i18n.rangeOverflow, this.max);
      const rangeUnderflow = this.messageWhenRangeUnderflow || this.formatString(this.i18n.rangeUnderflow, this.min);
      return {
        valueMissing,
        badInput,
        rangeOverflow,
        rangeUnderflow,
        customError: this.customErrorMessage
      };
    }

    formatString(str, ...args) {
      return str.replace(/{(\d+)}/g, (match, i) => {
        return args[i];
      });
    }

  }

  Engine.registerDecorators(LightningDatePicker, {
    publicProps: {
      label: {
        config: 0
      },
      name: {
        config: 0
      },
      max: {
        config: 0
      },
      min: {
        config: 0
      },
      placeholder: {
        config: 0
      },
      messageWhenValueMissing: {
        config: 0
      },
      messageWhenBadInput: {
        config: 0
      },
      messageWhenRangeOverflow: {
        config: 0
      },
      messageWhenRangeUnderflow: {
        config: 0
      },
      ariaLabel: {
        config: 3
      },
      ariaLabelledByElement: {
        config: 3
      },
      ariaControlsElement: {
        config: 3
      },
      ariaDescribedByElements: {
        config: 3
      },
      value: {
        config: 3
      },
      disabled: {
        config: 3
      },
      readOnly: {
        config: 3
      },
      required: {
        config: 3
      },
      fieldLevelHelp: {
        config: 3
      },
      variant: {
        config: 3
      },
      validity: {
        config: 1
      }
    },
    publicMethods: ["focus", "blur", "checkValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
    track: {
      _disabled: 1,
      _readonly: 1,
      _required: 1,
      _value: 1,
      _calendarVisible: 1,
      _displayValue: 1,
      _errorMessage: 1,
      _fieldLevelHelp: 1,
      _variant: 1
    }
  });

  var datepicker = Engine.registerComponent(LightningDatePicker, {
    tmpl: _tmpl$f
  });

  function tmpl$e($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      k: api_key,
      h: api_element,
      i: api_iterator,
      f: api_flatten
    } = $api;
    return api_flatten([$cmp.hasParts ? api_iterator($cmp.text, function (item) {
      return [item.part.highlight ? api_element("strong", {
        key: api_key(5, item.key)
      }, [api_dynamic(item.part.text)]) : null, !item.part.highlight ? api_dynamic(item.part.text) : null];
    }) : [], !$cmp.hasParts ? api_dynamic($cmp.text) : null]);
  }

  var _tmpl$g = Engine.registerTemplate(tmpl$e);
  tmpl$e.stylesheets = [];
  tmpl$e.stylesheetTokens = {
    hostAttribute: "lightning-baseComboboxFormattedText_baseComboboxFormattedText-host",
    shadowAttribute: "lightning-baseComboboxFormattedText_baseComboboxFormattedText"
  };

  class LightningBaseComboboxFormattedText extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this._text = '';
      this.hasParts = void 0;
    }

    get text() {
      return this._text;
    }

    set text(value) {
      this.hasParts = Array.isArray(value) && value.length > 0;

      if (this.hasParts) {
        // Generate keys for LWC DOM
        this._text = value.map((part, i) => ({
          part,
          key: i
        }));
      } else {
        this._text = value;
      }
    }

  }

  Engine.registerDecorators(LightningBaseComboboxFormattedText, {
    publicProps: {
      text: {
        config: 3
      }
    },
    track: {
      _text: 1,
      hasParts: 1
    }
  });

  var baseComboboxFormattedText = Engine.registerComponent(LightningBaseComboboxFormattedText, {
    tmpl: _tmpl$g
  });

  var _tmpl$h = void 0;

  function tmpl$f($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      h: api_element
    } = $api;
    return [api_element("span", {
      classMap: {
        "slds-media__figure": true
      },
      key: 2
    }, [api_custom_element("lightning-icon", icon, {
      props: {
        "size": $cmp.iconSize,
        "alternativeText": $cmp.item.iconAlternativeText,
        "iconName": $cmp.item.iconName
      },
      key: 3
    }, [])]), api_element("span", {
      classMap: {
        "slds-media__body": true
      },
      key: 4
    }, [api_element("span", {
      classMap: {
        "slds-listbox__option-text": true,
        "slds-listbox__option-text_entity": true
      },
      attrs: {
        "title": $cmp.text
      },
      key: 5
    }, [api_element("span", {
      classMap: {
        "slds-truncate": true
      },
      key: 6
    }, [api_custom_element("lightning-base-combobox-formatted-text", baseComboboxFormattedText, {
      props: {
        "text": $cmp.item.text
      },
      key: 7
    }, [])])]), $cmp.hasSubText ? api_element("span", {
      classMap: {
        "slds-listbox__option-meta": true,
        "slds-listbox__option-meta_entity": true
      },
      attrs: {
        "title": $cmp.subText
      },
      key: 9
    }, [api_element("span", {
      classMap: {
        "slds-truncate": true
      },
      key: 10
    }, [api_custom_element("lightning-base-combobox-formatted-text", baseComboboxFormattedText, {
      props: {
        "text": $cmp.item.subText
      },
      key: 11
    }, [])])]) : null]), $cmp.item.rightIconName ? api_element("span", {
      classMap: {
        "slds-media__figure": true,
        "slds-media__figure_reverse": true
      },
      key: 13
    }, [api_custom_element("lightning-icon", icon, {
      props: {
        "size": $cmp.rightIconSize,
        "alternativeText": $cmp.item.rightIconAlternativeText,
        "iconName": $cmp.item.rightIconName
      },
      key: 14
    }, [])]) : null];
  }

  var card = Engine.registerTemplate(tmpl$f);
  tmpl$f.stylesheets = [];
  tmpl$f.stylesheetTokens = {
    hostAttribute: "lightning-baseComboboxItem_card-host",
    shadowAttribute: "lightning-baseComboboxItem_card"
  };

  function tmpl$1$1($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      h: api_element
    } = $api;
    return [api_element("span", {
      classMap: {
        "slds-media__figure": true
      },
      key: 2
    }, [api_custom_element("lightning-icon", icon, {
      props: {
        "alternativeText": $cmp.item.iconAlternativeText,
        "iconName": $cmp.item.iconName,
        "size": "x-small"
      },
      key: 3
    }, [])]), api_element("span", {
      classMap: {
        "slds-media__body": true
      },
      key: 4
    }, [api_custom_element("lightning-base-combobox-formatted-text", baseComboboxFormattedText, {
      classMap: {
        "slds-truncate": true
      },
      props: {
        "text": $cmp.item.text,
        "title": $cmp.text
      },
      key: 5
    }, [])])];
  }

  var inline = Engine.registerTemplate(tmpl$1$1);
  tmpl$1$1.stylesheets = [];
  tmpl$1$1.stylesheetTokens = {
    hostAttribute: "lightning-baseComboboxItem_inline-host",
    shadowAttribute: "lightning-baseComboboxItem_inline"
  };

  function tmpl$2$1($api, $cmp, $slotset, $ctx) {
    return [];
  }

  var defaultHtml = Engine.registerTemplate(tmpl$2$1);
  tmpl$2$1.stylesheets = [];
  tmpl$2$1.stylesheetTokens = {
    hostAttribute: "lightning-baseComboboxItem_default-host",
    shadowAttribute: "lightning-baseComboboxItem_default"
  };

  class LightningBaseComboboxItem extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.item = {};
    }

    connectedCallback() {
      // We want to make sure that the item has 'aria-selected' if it's selectable
      if (this.item.selectable) {
        this.setAttribute('aria-selected', 'false');
      }

      if (this.isInlineOption) {
        this.classList.add('slds-media_small');
        this.classList.add('slds-listbox__option_plain');
      } else {
        this.classList.add('slds-listbox__option_entity');
      }
    } // Return html based on the specified item type


    render() {
      switch (this.item.type) {
        case 'option-inline':
          return inline;

        case 'option-card':
          return card;

        default:
          return defaultHtml;
      }
    }

    highlight() {
      this.toggleHighlight(true);
    }

    removeHighlight() {
      this.toggleHighlight(false);
    }

    toggleHighlight(highlighted) {
      if (this.item.selectable) {
        this.setAttribute('aria-selected', highlighted ? 'true' : 'false');
        this.classList.toggle('slds-has-focus', highlighted);
      }
    } // Parts are needed for highlighting


    partsToText(parts) {
      if (parts && Array.isArray(parts) && parts.length > 0) {
        return parts.map(part => part.text).join('');
      }

      return parts;
    }

    get rightIconSize() {
      return this.item.rightIconSize || 'small';
    }

    get iconSize() {
      return this.item.iconSize || 'small';
    }

    get text() {
      return this.partsToText(this.item.text);
    }

    get subText() {
      return this.partsToText(this.item.subText);
    }

    get hasSubText() {
      return this.item.subText && this.item.subText.length > 0;
    }

    get isInlineOption() {
      return this.item.type === 'option-inline';
    }

  }

  Engine.registerDecorators(LightningBaseComboboxItem, {
    publicProps: {
      item: {
        config: 0
      }
    },
    publicMethods: ["highlight", "removeHighlight"]
  });

  var baseComboboxItem = Engine.registerComponent(LightningBaseComboboxItem, {
    tmpl: _tmpl$h
  });

  var labelAriaSelectedOptions = 'Selected Options:';

  var labelDeselectOptionKeyboard = 'Press delete or backspace to remove';

  var labelLoadingText = 'Loading';

  var labelPillCloseButtonAlternativeText = 'Clear Selection';

  function stylesheet$3(hostSelector, shadowSelector, nativeShadow) {
    return ".slds-inline-logo" + shadowSelector + " {height: 1rem;margin-top: 1rem;margin-bottom: 1rem;}\n";
  }
  var _implicitStylesheets$3 = [stylesheet$3];

  function tmpl$g($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      gid: api_scoped_id,
      b: api_bind,
      h: api_element,
      d: api_dynamic,
      k: api_key,
      i: api_iterator,
      f: api_flatten
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6,
      _m7,
      _m8,
      _m9,
      _m10,
      _m11,
      _m12,
      _m13,
      _m14,
      _m15
    } = $ctx;
    return [api_element("div", {
      className: $cmp.computedDropdownTriggerClass,
      attrs: {
        "role": "combobox",
        "aria-expanded": $cmp.computedAriaExpanded,
        "aria-haspopup": "listbox"
      },
      key: 2,
      on: {
        "click": _m15 || ($ctx._m15 = api_bind($cmp.handleTriggerClick))
      }
    }, [api_element("div", {
      className: $cmp.computedFormElementClass,
      attrs: {
        "role": "none"
      },
      key: 3
    }, [$cmp.hasInputPill ? api_custom_element("lightning-icon", icon, {
      classMap: {
        "slds-icon_container": true,
        "slds-combobox__input-entity-icon": true
      },
      props: {
        "iconName": $cmp.inputPill.iconName,
        "alternativeText": $cmp.inputPill.iconAlternativeText,
        "size": "x-small"
      },
      key: 5
    }, []) : null, api_element("input", {
      className: $cmp.computedInputClass,
      attrs: {
        "id": api_scoped_id("input"),
        "type": "text",
        "role": "textbox",
        "autocomplete": "off",
        "name": $cmp.name,
        "placeholder": $cmp.computedPlaceholder,
        "maxlength": $cmp.inputMaxlength,
        "aria-autocomplete": $cmp.computedAriaAutocomplete,
        "aria-label": $cmp.inputLabel
      },
      props: {
        "value": $cmp.computedInputValue,
        "disabled": $cmp.disabled,
        "readOnly": $cmp._inputReadOnly
      },
      key: 6,
      on: {
        "focus": _m0 || ($ctx._m0 = api_bind($cmp.handleFocus)),
        "select": _m1 || ($ctx._m1 = api_bind($cmp.handleInputSelect)),
        "change": _m2 || ($ctx._m2 = api_bind($cmp.handleTextChange)),
        "input": _m3 || ($ctx._m3 = api_bind($cmp.handleInput)),
        "keydown": _m4 || ($ctx._m4 = api_bind($cmp.handleInputKeyDown)),
        "blur": _m5 || ($ctx._m5 = api_bind($cmp.handleBlur))
      }
    }, []), $cmp.hasInputPill ? api_element("div", {
      classMap: {
        "slds-input__icon-group": true,
        "slds-input__icon-group_right": true
      },
      key: 8
    }, [api_element("button", {
      classMap: {
        "slds-button": true,
        "slds-button_icon": true,
        "slds-input__icon": true,
        "slds-input__icon_right": true
      },
      attrs: {
        "type": "button",
        "title": $cmp.i18n.pillCloseButtonAlternativeText
      },
      key: 9,
      on: {
        "click": _m6 || ($ctx._m6 = api_bind($cmp.handlePillRemove))
      }
    }, [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": "utility:close",
        "variant": "bare",
        "svgClass": "slds-button__icon"
      },
      key: 10
    }, []), api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 11
    }, [api_dynamic($cmp.i18n.pillCloseButtonAlternativeText)])])]) : null, !$cmp.hasInputPill ? api_element("div", {
      classMap: {
        "slds-input__icon-group": true,
        "slds-input__icon-group_right": true
      },
      key: 13
    }, [$cmp.showInputActivityIndicator ? api_element("div", {
      classMap: {
        "slds-spinner": true,
        "slds-spinner_brand": true,
        "slds-spinner_x-small": true,
        "slds-input__spinner": true
      },
      attrs: {
        "role": "status"
      },
      key: 15
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 16
    }, [api_dynamic($cmp.i18n.loadingText)]), api_element("div", {
      classMap: {
        "slds-spinner__dot-a": true
      },
      key: 17
    }, []), api_element("div", {
      classMap: {
        "slds-spinner__dot-b": true
      },
      key: 18
    }, [])]) : null, $cmp.inputIconName ? api_custom_element("lightning-icon", icon, {
      classMap: {
        "slds-input__icon": true,
        "slds-input__icon_right": true
      },
      props: {
        "alternativeText": $cmp.inputIconAlternativeText,
        "iconName": $cmp.inputIconName,
        "size": $cmp.inputIconSize
      },
      key: 20
    }, []) : null]) : null]), api_element("div", {
      className: $cmp.computedDropdownClass,
      attrs: {
        "id": api_scoped_id("dropdown-element"),
        "data-dropdown-element": true,
        "role": "listbox"
      },
      key: 21,
      on: {
        "scroll": _m11 || ($ctx._m11 = api_bind($cmp.handleListboxScroll)),
        "mousedown": _m12 || ($ctx._m12 = api_bind($cmp.handleDropdownMouseDown)),
        "mouseup": _m13 || ($ctx._m13 = api_bind($cmp.handleDropdownMouseUp)),
        "mouseleave": _m14 || ($ctx._m14 = api_bind($cmp.handleDropdownMouseLeave))
      }
    }, $cmp._hasDropdownOpened ? api_flatten([api_iterator($cmp._items, function (item) {
      return [!item.items ? api_custom_element("lightning-base-combobox-item", baseComboboxItem, {
        classMap: {
          "slds-media": true,
          "slds-listbox__option": true,
          "slds-media_center": true
        },
        attrs: {
          "data-item-id": item.id,
          "data-value": item.value
        },
        props: {
          "role": "option",
          "item": item,
          "id": api_scoped_id(item.id)
        },
        key: api_key(25, item.value),
        on: {
          "click": _m7 || ($ctx._m7 = api_bind($cmp.handleOptionClick)),
          "mouseenter": _m8 || ($ctx._m8 = api_bind($cmp.handleOptionMouseEnter))
        }
      }, []) : null, item.items ? api_element("ul", {
        attrs: {
          "role": "group",
          "aria-label": item.label
        },
        key: api_key(27, item.label)
      }, api_flatten([item.label ? api_element("li", {
        classMap: {
          "slds-listbox__item": true
        },
        attrs: {
          "role": "presentation"
        },
        key: 29
      }, [api_element("div", {
        classMap: {
          "slds-media": true,
          "slds-listbox__option": true,
          "slds-listbox__option_plain": true,
          "slds-media_small": true
        },
        attrs: {
          "role": "presentation"
        },
        key: 30
      }, [api_element("h3", {
        classMap: {
          "slds-text-title_caps": true
        },
        attrs: {
          "role": "presentation",
          "title": item.label
        },
        key: 31
      }, [api_dynamic(item.label)])])]) : null, api_iterator(item.items, function (groupItem) {
        return api_element("li", {
          classMap: {
            "slds-listbox__item": true
          },
          attrs: {
            "role": "presentation"
          },
          key: api_key(33, groupItem.value)
        }, [api_custom_element("lightning-base-combobox-item", baseComboboxItem, {
          classMap: {
            "slds-media": true,
            "slds-listbox__option": true,
            "slds-media_center": true
          },
          attrs: {
            "data-item-id": groupItem.id,
            "data-value": groupItem.value
          },
          props: {
            "role": "option",
            "item": groupItem,
            "id": api_scoped_id(groupItem.id)
          },
          key: 34,
          on: {
            "click": _m9 || ($ctx._m9 = api_bind($cmp.handleOptionClick)),
            "mouseenter": _m10 || ($ctx._m10 = api_bind($cmp.handleOptionMouseEnter))
          }
        }, [])]);
      })])) : null];
    }), $cmp.showDropdownActivityIndicator ? api_element("div", {
      classMap: {
        "slds-listbox__item": true
      },
      attrs: {
        "role": "presentation"
      },
      key: 36
    }, [api_element("div", {
      classMap: {
        "slds-align_absolute-center": true,
        "slds-p-top_medium": true
      },
      key: 37
    }, [api_element("div", {
      classMap: {
        "slds-spinner": true,
        "slds-spinner_x-small": true,
        "slds-spinner_inline": true
      },
      attrs: {
        "role": "status"
      },
      key: 38
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 39
    }, [api_dynamic($cmp.i18n.loadingText)]), api_element("div", {
      classMap: {
        "slds-spinner__dot-a": true
      },
      key: 40
    }, []), api_element("div", {
      classMap: {
        "slds-spinner__dot-b": true
      },
      key: 41
    }, [])])])]) : null, $cmp.showAttribution ? api_element("div", {
      classMap: {
        "slds-align_absolute-center": true
      },
      key: 43
    }, [api_element("img", {
      classMap: {
        "slds-inline-logo": true
      },
      attrs: {
        "src": $cmp.attributionLogoUrl,
        "alt": $cmp.attributionLogoAssistiveText,
        "title": $cmp.attributionLogoAssistiveText
      },
      key: 44
    }, [])]) : null]) : [])])];
  }

  var _tmpl$i = Engine.registerTemplate(tmpl$g);
  tmpl$g.stylesheets = [];

  if (_implicitStylesheets$3) {
    tmpl$g.stylesheets.push.apply(tmpl$g.stylesheets, _implicitStylesheets$3);
  }
  tmpl$g.stylesheetTokens = {
    hostAttribute: "lightning-baseCombobox_baseCombobox-host",
    shadowAttribute: "lightning-baseCombobox_baseCombobox"
  };

  function preventDefaultAndStopPropagation$2(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function moveHighlightToTypedCharacters(event, currentIndex, dropdownInterface) {
    runActionOnBufferedTypedCharacters(event, dropdownInterface.highlightOptionWithText.bind(this, currentIndex || 0));
  } // eslint-disable-next-line complexity


  function handleKeyDownOnInput(event, currentIndex, dropdownInterface) {
    const isVisible = dropdownInterface.isDropdownVisible();

    switch (event.keyCode) {
      case keyCodes.enter:
        preventDefaultAndStopPropagation$2(event);

        if (isVisible && currentIndex >= 0) {
          dropdownInterface.selectByIndex(currentIndex);
        } else {
          dropdownInterface.openDropdownIfNotEmpty();
        }

        break;

      case keyCodes.pagedown:
        preventDefaultAndStopPropagation$2(event);

        if (!isVisible) {
          dropdownInterface.openDropdownIfNotEmpty();
        } // Jump 10 options down


        requestAnimationFrame(() => dropdownInterface.highlightOptionWithIndex(Math.min(currentIndex + 10, dropdownInterface.getTotalOptions() - 1)));
        break;

      case keyCodes.pageup:
        preventDefaultAndStopPropagation$2(event);

        if (!isVisible) {
          dropdownInterface.openDropdownIfNotEmpty();
        } // Jump 10 options up


        requestAnimationFrame(() => dropdownInterface.highlightOptionWithIndex(Math.max(currentIndex - 10, 0)));
        break;

      case keyCodes.home:
        // If not a read-only input we want the default browser behaviour
        if (!dropdownInterface.isInputReadOnly()) {
          break;
        }

        preventDefaultAndStopPropagation$2(event);

        if (!isVisible) {
          dropdownInterface.openDropdownIfNotEmpty();
        }

        requestAnimationFrame(() => dropdownInterface.highlightOptionWithIndex(0));
        break;

      case keyCodes.end:
        // If not a read-only input we want the default browser behaviour
        if (!dropdownInterface.isInputReadOnly()) {
          break;
        }

        preventDefaultAndStopPropagation$2(event);

        if (!isVisible) {
          dropdownInterface.openDropdownIfNotEmpty();
        }

        requestAnimationFrame(() => dropdownInterface.highlightOptionWithIndex(dropdownInterface.getTotalOptions() - 1));
        break;

      case keyCodes.down:
      case keyCodes.up:
        // eslint-disable-line no-case-declarations
        preventDefaultAndStopPropagation$2(event);

        if (!isVisible) {
          currentIndex = -1;
          dropdownInterface.openDropdownIfNotEmpty();
        }

        let nextIndex;

        if (currentIndex >= 0) {
          nextIndex = event.keyCode === keyCodes.up ? currentIndex - 1 : currentIndex + 1;

          if (nextIndex >= dropdownInterface.getTotalOptions()) {
            nextIndex = 0;
          } else if (nextIndex < 0) {
            nextIndex = dropdownInterface.getTotalOptions() - 1;
          }
        } else {
          nextIndex = event.keyCode === keyCodes.up ? dropdownInterface.getTotalOptions() - 1 : 0;
        }

        requestAnimationFrame(() => {
          dropdownInterface.highlightOptionWithIndex(nextIndex);
        });
        break;

      case keyCodes.escape:
      case keyCodes.tab:
        if (isVisible) {
          event.stopPropagation();
          dropdownInterface.closeDropdown();
        }

        break;

      default:
        if (!isVisible) {
          dropdownInterface.openDropdownIfNotEmpty();
        }

        if (dropdownInterface.isInputReadOnly()) {
          // The element should be read only, it's a work-around for IE11 as it will still make editable an input
          // that has focus and was dynamically changed to be readonly on focus change. Remove once we no longer
          // support IE11
          event.preventDefault();
          requestAnimationFrame(() => moveHighlightToTypedCharacters(event, currentIndex, dropdownInterface));
        }

    }
  }

  class BaseComboboxEvents {
    constructor(baseCombobox) {
      this.dispatchEvent = baseCombobox.dispatchEvent.bind(baseCombobox);
    }

    dispatchPillRemove(pill) {
      this.dispatchEvent(new CustomEvent('pillremove', {
        detail: {
          item: pill
        }
      }));
    }

    dispatchEndReached() {
      this.dispatchEvent(new CustomEvent('endreached'));
    }

    dispatchFocus() {
      this.dispatchEvent(new CustomEvent('focus'));
    }

    dispatchBlur() {
      this.dispatchEvent(new CustomEvent('blur'));
    }

    dispatchTextInput(text) {
      this.dispatchEvent(new CustomEvent('textinput', {
        detail: {
          text
        }
      }));
    }

    dispatchTextChange(text) {
      this.dispatchEvent(new CustomEvent('textchange', {
        detail: {
          text
        }
      }));
    }

    dispatchSelect(value) {
      this.dispatchEvent(new CustomEvent('select', {
        detail: {
          value
        }
      }));
    }

    dispatchDropdownOpen() {
      this.dispatchEvent(new CustomEvent('dropdownopen'));
    }

    dispatchDropdownOpenRequest() {
      this.dispatchEvent(new CustomEvent('dropdownopenrequest'));
    }

  }

  const i18n$7 = {
    ariaSelectedOptions: labelAriaSelectedOptions,
    deselectOptionKeyboard: labelDeselectOptionKeyboard,
    pillCloseButtonAlternativeText: labelPillCloseButtonAlternativeText,
    loadingText: labelLoadingText
  };
  const ARIA_CONTROLS$1 = 'aria-controls';
  const ARIA_LABELLEDBY$1 = 'aria-labelledby';
  const ARIA_DESCRIBEDBY$1 = 'aria-describedby';
  const ARIA_LABEL$1 = 'aria-label';
  const ARIA_ACTIVEDESCENDANT = 'aria-activedescendant';

  class LightningBaseCombobox extends Engine.LightningElement {
    constructor() {
      super();
      this.inputText = '';
      this.inputIconName = 'utility:down';
      this.inputIconSize = 'x-small';
      this.inputIconAlternativeText = void 0;
      this.inputMaxlength = void 0;
      this.showInputActivityIndicator = false;
      this.dropdownAlignment = 'left';
      this.placeholder = 'Select an Item';
      this.inputLabel = void 0;
      this.name = void 0;
      this.inputPill = void 0;
      this.attributionLogoUrl = void 0;
      this.attributionLogoAssistiveText = void 0;
      this._showDropdownActivityIndicator = false;
      this._items = [];
      this._disabled = false;
      this._dropdownVisible = false;
      this._hasDropdownOpened = false;
      this._highlightedOptionElementId = '';
      this._variant = void 0;
      this._dropdownHeight = 'standard';
      this._readonly = false;
      this._logoLoaded = false;
      this._id = 0;
      this._inputDescribedBy = [];
      this._inputAriaControls = void 0;
      this._activeElementDOMId = void 0;
      this._events = new BaseComboboxEvents(this);
    }

    set inputControlsElement(el) {
      this._inputAriaControls = el;
      this.synchronizeA11y();
    }

    get inputControlsElement() {
      return this._inputAriaControls;
    }

    set inputDescribedByElements(els) {
      if (Array.isArray(els)) {
        this._inputDescribedBy = els;
      } else {
        this._inputDescribedBy = [els];
      }

      this.synchronizeA11y();
    }

    get inputDescribedByElements() {
      return this._inputDescribedBy;
    }

    set inputLabelledByElement(el) {
      this._inputLabelledBy = el;
      this.synchronizeA11y();
    }

    get inputLabelledByElement() {
      return this._inputLabelledBy;
    }

    get inputLabelledById() {
      return getRealDOMId(this._inputLabelledBy);
    }

    get inputAriaControlsId() {
      return getRealDOMId(this._inputAriaControls);
    }

    get inputId() {
      return getRealDOMId(this.template.querySelector('input'));
    }

    get computedAriaDescribedBy() {
      const ariaValues = [];

      this._inputDescribedBy.forEach(el => {
        ariaValues.push(getRealDOMId(el));
      });

      return normalizeAriaAttribute(ariaValues);
    }

    synchronizeA11y() {
      const input = this.template.querySelector('input');

      if (!input) {
        return;
      }

      synchronizeAttrs(input, {
        [ARIA_LABELLEDBY$1]: this.inputLabelledById,
        [ARIA_DESCRIBEDBY$1]: this.computedAriaDescribedBy,
        [ARIA_ACTIVEDESCENDANT]: this._activeElementDOMId,
        [ARIA_CONTROLS$1]: this.computedInputControls,
        [ARIA_LABEL$1]: this.inputLabel
      });
    }

    renderedCallback() {
      this.dispatchEvent(new CustomEvent('ready', {
        detail: {
          id: this.inputId,
          name: this.name
        }
      }));
      this.synchronizeA11y();
    }

    connectedCallback() {
      this.classList.add('slds-combobox_container');
      this._connected = true;
      this._keyboardInterface = this.dropdownKeyboardInterface();
    }

    disconnectedCallback() {
      this._connected = false;
      this._listBoxElementCache = undefined;
    }

    get dropdownHeight() {
      return this._dropdownHeight;
    }

    set dropdownHeight(height) {
      this._dropdownHeight = normalizeString(height, {
        fallbackValue: 'standard',
        validValues: ['standard', 'small']
      });
    }

    get showDropdownActivityIndicator() {
      return this._showDropdownActivityIndicator;
    }

    set showDropdownActivityIndicator(value) {
      this._showDropdownActivityIndicator = normalizeBoolean(value);

      if (this._connected) {
        if (this._showDropdownActivityIndicator) {
          if (this._shouldOpenDropDown) {
            this.openDropdownIfNotEmpty();
          }
        } else if (this._dropdownVisible && this.isDropdownEmpty) {
          this.closeDropdown();
        }
      }
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);

      if (this._disabled && this._dropdownVisible) {
        this.closeDropdown();
      }
    }

    get readOnly() {
      return this._readonly;
    }

    set readOnly(value) {
      this._readonly = normalizeBoolean(value);

      if (this._readonly && this._dropdownVisible) {
        this.closeDropdown();
      }
    }

    get variant() {
      return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
      this._variant = normalizeString(value, {
        fallbackValue: VARIANT.STANDARD,
        validValues: [VARIANT.STANDARD, 'lookup']
      });
    }

    set items(items = []) {
      this._unprocessedItems = items;

      if (this._connected) {
        if (this._hasDropdownOpened) {
          // The dropdown has already been opened at least once, so process the items immediately
          this.updateItems(items);

          if (this._dropdownVisible) {
            // The dropdown is visible but there are no items to show, close it
            if (this.isDropdownEmpty) {
              this.closeDropdown();
            } else {
              // We have new items, update highlight
              this.highlightDefaultItem(); // Since the items have changed, the positioning should be recomputed

              this.startDropdownAutoPositioning();
            }
          }
        }

        if (this._shouldOpenDropDown) {
          this.openDropdownIfNotEmpty();
        }
      }
    }

    get items() {
      return this._unprocessedItems;
    }

    highlightInputText() {
      if (this._connected) {
        // Safari has issues with invoking set selection range immediately in the 'focus' handler, instead
        // we'd be doing it in an animation frame. Remove the requestAnimationFrame once/if this is fixed
        // in Safari
        requestAnimationFrame(() => {
          const {
            inputElement
          } = this;
          inputElement.setSelectionRange(0, inputElement.value.length);
        });
      }
    }

    get showAttribution() {
      return this.attributionLogoUrl;
    }

    focus() {
      if (this._connected) {
        this.inputElement.focus();
      }
    }

    focusAndOpenDropdownIfNotEmpty() {
      if (this._connected) {
        if (!this._inputHasFocus) {
          this.focus();
        }

        this.openDropdownIfNotEmpty();
      }
    }

    blur() {
      if (this._connected) {
        this.inputElement.blur();
      }
    }

    itemId(index) {
      return this.inputId + '-' + index;
    }

    itemIndexFromId(id) {
      // Extracts the index from an item id.
      return parseInt(id.substring(id.lastIndexOf('-') + 1), 10);
    }

    processItem(item) {
      const itemCopy = {}; // Supported item properties:
      // 'type' (string): option-inline, option-card
      // 'highlight' (boolean): Whether to highlight the item when dropdown opens
      // 'iconName': left icon name
      // 'iconSize': left icon size
      // 'iconAlternativeText': assistive text for the left icon
      // 'rightIconName': right icon name
      // 'rightIconSize': right icon size
      // 'rightIconAlternativeText': assistive text for the right icon
      // 'text': text to display
      // 'subText': sub-text to display (only option-card supports it)
      // 'value': value associated with the option

      itemCopy.type = item.type;
      itemCopy.iconName = item.iconName;
      itemCopy.iconSize = item.iconSize;
      itemCopy.iconAlternativeText = item.iconAlternativeText;
      itemCopy.rightIconName = item.rightIconName;
      itemCopy.rightIconSize = item.rightIconSize;
      itemCopy.rightIconAlternativeText = item.rightIconAlternativeText;
      itemCopy.text = item.text;
      itemCopy.subText = item.subText;
      itemCopy.value = item.value; // extra metadata needed

      itemCopy.selectable = ['option-card', 'option-inline'].indexOf(item.type) >= 0;

      if (item.highlight) {
        this._highlightedItemIndex = this._selectableItems;
      }

      if (itemCopy.selectable) {
        itemCopy.index = this._selectableItems;
        itemCopy.id = this.itemId(itemCopy.index);
        this._selectableItems += 1;
      }

      return itemCopy;
    }

    get _inputReadOnly() {
      return this._readonly || this.variant === VARIANT.STANDARD || this.hasInputPill;
    }

    get computedAriaAutocomplete() {
      if (this.hasInputPill) {
        // no aria-autocomplete when pill is showing
        return null;
      }

      return this._inputReadOnly ? 'none' : 'list';
    }

    get computedPlaceholder() {
      return this.hasInputPill ? this.inputPill.label : this.placeholder;
    }

    get computedInputValue() {
      return this.hasInputPill ? this.inputPill.label : this.inputText;
    }

    handleListboxScroll(event) {
      const listbox = event.target;
      const height = listbox.getBoundingClientRect().height;
      const maxScroll = listbox.scrollHeight - height;
      const bottomReached = listbox.scrollTop >= maxScroll;

      if (bottomReached) {
        this._events.dispatchEndReached();
      }
    }

    get listboxElement() {
      if (!this._listBoxElementCache) {
        this._listBoxElementCache = this.template.querySelector('[role="listbox"]');
      }

      return this._listBoxElementCache;
    }

    get computedUniqueElementId() {
      return this.inputId;
    }

    get computedUniqueDropdownElementId() {
      const el = this.template.querySelector('[data-dropdown-element]');
      return getRealDOMId(el);
    }

    get computedInputControls() {
      const ariaValues = [this.computedUniqueDropdownElementId];

      if (this.inputControlsElement) {
        ariaValues.push(this.inputAriaControlsId);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    get i18n() {
      return i18n$7;
    }

    get computedDropdownTriggerClass() {
      return classSet('slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click').add({
        'slds-is-open': this._dropdownVisible
      }).toString();
    }

    get computedDropdownClass() {
      const alignment = this.dropdownAlignment;
      return classSet('slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid').add({
        'slds-dropdown_length-with-icon-10': this._dropdownHeight === 'standard',
        'slds-dropdown_length-with-icon-5': this._dropdownHeight === 'small',
        'slds-dropdown_left': alignment === 'left' || alignment === 'auto',
        'slds-dropdown_center': alignment === 'center',
        'slds-dropdown_right': alignment === 'right',
        'slds-dropdown_bottom': alignment === 'bottom-center',
        'slds-dropdown_bottom slds-dropdown_right slds-dropdown_bottom-right': alignment === 'bottom-right',
        'slds-dropdown_bottom slds-dropdown_left slds-dropdown_bottom-left': alignment === 'bottom-left'
      }).toString();
    }

    get computedInputClass() {
      const classes = classSet('slds-input slds-combobox__input');

      if (this.hasInputPill) {
        classes.add('slds-combobox__input-value');
      } else {
        classes.add({
          'slds-input-has-icon_group-right': this.showInputActivityIndicator
        });
      }

      return classes.toString();
    }

    get _shouldOpenDropDown() {
      // If items were empty and through a user interaction the dropdown should have opened, and if the
      // component still has the focus we'll open it on items update instead.
      return !this.dropdownDisabled && this._inputHasFocus && this._requestedDropdownOpen;
    }

    get dropdownDisabled() {
      return this.readOnly || this.disabled;
    }

    handleOptionClick(event) {
      if (event.currentTarget.hasAttribute('aria-selected')) {
        event.stopPropagation();
        event.preventDefault();
        this.selectOptionAndCloseDropdown(event.currentTarget);
      }
    }

    handleOptionMouseEnter(event) {
      if (event.currentTarget.hasAttribute('aria-selected')) {
        this.highlightOption(event.currentTarget);
      }
    }

    handleDropdownMouseLeave() {
      this.removeHighlight(); // This is to account for when a user makes a mousedown press on the dropdown and then leaves the dropdown
      // area, it would leave the dropdown open even though the focus would no longer be on the input

      if (!this._inputHasFocus) {
        this.closeDropdown();
      }
    }

    handleTriggerClick(event) {
      event.stopPropagation();
      this.allowBlur();

      if (this.dropdownDisabled) {
        return;
      }

      if (!this.hasInputPill) {
        // toggle dropdown only for readonly combobox, only open the dropdown otherwise
        // if it's not already opened.
        if (this._inputReadOnly) {
          if (this._dropdownVisible) {
            this.closeDropdown();
          } else {
            this.openDropdownIfNotEmpty();
          }
        } else {
          this.openDropdownIfNotEmpty();
        }

        this.inputElement.focus();
      }
    }

    handlePillKeyDown(event) {
      if (this.dropdownDisabled) {
        return;
      }

      if (event.keyCode === keyCodes.delete) {
        this.handlePillRemove();
      }
    }

    handleInputKeyDown(event) {
      if (this.dropdownDisabled) {
        return;
      }

      if (this.hasInputPill) {
        this.handlePillKeyDown(event);
      } else {
        handleKeyDownOnInput(event, this.getCurrentHighlightedOptionIndex(), this._keyboardInterface);
      }
    }

    handleTextChange() {
      this._events.dispatchTextChange(this.inputElement.value);
    }

    handleFocus() {
      this._inputHasFocus = true;

      this._events.dispatchFocus();
    }

    handleInput() {
      this._events.dispatchTextInput(this.inputElement.value);
    }

    handleBlur() {
      this._inputHasFocus = false;

      if (this._cancelBlur) {
        return;
      }

      this.closeDropdown();

      this._events.dispatchBlur();
    }

    handleDropdownMouseDown(event) {
      const mainButton = 0;

      if (event.button === mainButton) {
        this.cancelBlur();
      }
    }

    handleDropdownMouseUp() {
      // We need this to make sure that if a scrollbar is being dragged with the mouse, upon release
      // of the drag we allow blur, otherwise the dropdown would not close on blur since we'd have cancel blur
      // set
      this.allowBlur();
    }

    highlightOption(option) {
      this.removeHighlight();

      if (option) {
        option.highlight();
        this._highlightedOptionElement = option;
        this._highlightedOptionElementId = option.getAttribute('data-item-id'); // active element is a component id getter works properly

        this._activeElementDOMId = option.id;
      }

      this.synchronizeA11y();
    }

    highlightOptionAndScrollIntoView(optionElement) {
      if (this._items.length === 0 || !optionElement) {
        return;
      }

      this.highlightOption(optionElement);
      scrollIntoViewIfNeeded(optionElement, this.listboxElement);
    }

    removeHighlight() {
      const option = this._highlightedOptionElement;

      if (option) {
        option.removeHighlight();
        this._highlightedOptionElement = null;
        this._highlightedOptionElementId = null;
        this._activeElementDOMId = null;
      }
    }

    selectOptionAndCloseDropdown(optionElement) {
      this.closeDropdown();
      this.inputElement.focus();
      const value = optionElement.getAttribute('data-value');

      this._events.dispatchSelect(value);
    }

    handleInputSelect(event) {
      event.stopPropagation();
    }

    openDropdownIfNotEmpty() {
      if (this._dropdownVisible) {
        // Already visible
        return;
      }

      const noOptions = !Array.isArray(this.items) || this.items.length === 0;

      if (noOptions) {
        // Dispatch dropdown open request
        this._events.dispatchDropdownOpenRequest();
      } // Do not open if there's nothing to show in the dropdown (eg. no options and no dropdown activity indicator)


      if (this.isDropdownEmpty) {
        // We use this attribute to flag whether an attempt has been made via user-interaction
        // to open the dropdown
        this._requestedDropdownOpen = true;
        return;
      }

      if (!this._hasDropdownOpened) {
        if (this._unprocessedItems) {
          this.updateItems(this._unprocessedItems);
        }

        this._hasDropdownOpened = true;
      }

      this._requestedDropdownOpen = false;
      this._dropdownVisible = true;
      this.startDropdownAutoPositioning();
      this.highlightDefaultItem();

      this._events.dispatchDropdownOpen();
    }

    closeDropdown() {
      if (!this._dropdownVisible) {
        // Already closed
        return;
      }

      this.stopDropdownPositioning();
      this.removeHighlight();
      this._dropdownVisible = false;
    }

    findOptionElementByIndex(index) {
      return this.template.querySelector(`[data-item-id="${this.itemId(index)}"]`);
    }

    allowBlur() {
      this._cancelBlur = false;
    }

    cancelBlur() {
      this._cancelBlur = true;
    }

    getCurrentHighlightedOptionIndex() {
      if (this._highlightedOptionElementId) {
        return this.itemIndexFromId(this._highlightedOptionElementId);
      }

      return -1;
    }

    get inputElement() {
      return this.template.querySelector('input');
    }

    startDropdownAutoPositioning() {
      if (this.dropdownAlignment !== 'auto') {
        return;
      }

      if (!this._autoPosition) {
        this._autoPosition = new AutoPosition(this);
      }

      this._autoPosition.start({
        target: () => this.template.querySelector('input'),
        element: () => this.template.querySelector('div.slds-dropdown'),
        align: {
          horizontal: Direction.Left,
          vertical: Direction.Top
        },
        targetAlign: {
          horizontal: Direction.Left,
          vertical: Direction.Bottom
        },
        autoFlip: true,
        alignWidth: true
      });
    }

    stopDropdownPositioning() {
      if (this._autoPosition) {
        this._autoPosition.stop();
      }
    }

    get hasInputPill() {
      return this.inputPill && Object.keys(this.inputPill).length > 0;
    }

    handlePillRemove() {
      this.inputElement.focus();

      this._events.dispatchPillRemove(this.inputPill);
    }

    get computedFormElementClass() {
      const hasIcon = this.hasInputPill && this.inputPill.iconName;
      return classSet('slds-combobox__form-element slds-input-has-icon').add({
        'slds-input-has-icon_right': !hasIcon,
        'slds-input-has-icon_left-right': hasIcon
      }).toString();
    }

    get computedAriaExpanded() {
      return this._dropdownVisible ? 'true' : 'false';
    }

    updateItems(items) {
      if (!items) {
        return;
      }

      assert(Array.isArray(items), '"items" must be an array');
      this._selectableItems = 0;
      this._highlightedItemIndex = 0;
      this._items = items.map(item => {
        if (item.items) {
          // This is a group
          const groupCopy = {
            label: item.label
          };
          groupCopy.items = item.items.map(groupItem => {
            return this.processItem(groupItem);
          });
          return groupCopy;
        }

        return this.processItem(item);
      });
    }

    highlightDefaultItem() {
      requestAnimationFrame(() => {
        this.highlightOptionAndScrollIntoView(this.findOptionElementByIndex(this._highlightedItemIndex));
      });
    }

    get isDropdownEmpty() {
      // If the activity indicator is showing then it's not empty
      return !this.showDropdownActivityIndicator && (!Array.isArray(this.items) || this.items.length === 0);
    }

    dropdownKeyboardInterface() {
      const that = this;
      return {
        getTotalOptions() {
          return that._selectableItems;
        },

        selectByIndex(index) {
          that.selectOptionAndCloseDropdown(that.findOptionElementByIndex(index));
        },

        highlightOptionWithIndex(index) {
          that.highlightOptionAndScrollIntoView(that.findOptionElementByIndex(index));
        },

        isInputReadOnly() {
          return that._inputReadOnly;
        },

        highlightOptionWithText(currentIndex, text) {
          // This only supports a flat structure, groups are not supported
          for (let index = currentIndex + 1; index < that._items.length; index++) {
            const option = that._items[index];

            if (option.selectable && option.text && option.text.toLowerCase().indexOf(text.toLowerCase()) === 0) {
              that.highlightOptionAndScrollIntoView(that.findOptionElementByIndex(index));
              return;
            }
          }

          for (let index = 0; index < currentIndex; index++) {
            const option = that._items[index];

            if (option.selectable && option.text && option.text.toLowerCase().indexOf(text.toLowerCase()) === 0) {
              that.highlightOptionAndScrollIntoView(that.findOptionElementByIndex(index));
              return;
            }
          }
        },

        isDropdownVisible() {
          return that._dropdownVisible;
        },

        openDropdownIfNotEmpty() {
          that.openDropdownIfNotEmpty();
        },

        closeDropdown() {
          that.closeDropdown();
        }

      };
    }

  }

  Engine.registerDecorators(LightningBaseCombobox, {
    publicProps: {
      inputText: {
        config: 0
      },
      inputIconName: {
        config: 0
      },
      inputIconSize: {
        config: 0
      },
      inputIconAlternativeText: {
        config: 0
      },
      inputMaxlength: {
        config: 0
      },
      showInputActivityIndicator: {
        config: 0
      },
      dropdownAlignment: {
        config: 0
      },
      placeholder: {
        config: 0
      },
      inputLabel: {
        config: 0
      },
      name: {
        config: 0
      },
      inputPill: {
        config: 0
      },
      attributionLogoUrl: {
        config: 0
      },
      attributionLogoAssistiveText: {
        config: 0
      },
      inputControlsElement: {
        config: 3
      },
      inputDescribedByElements: {
        config: 3
      },
      inputLabelledByElement: {
        config: 3
      },
      dropdownHeight: {
        config: 3
      },
      showDropdownActivityIndicator: {
        config: 3
      },
      disabled: {
        config: 3
      },
      readOnly: {
        config: 3
      },
      variant: {
        config: 3
      },
      items: {
        config: 3
      }
    },
    publicMethods: ["highlightInputText", "focus", "focusAndOpenDropdownIfNotEmpty", "blur"],
    track: {
      _showDropdownActivityIndicator: 1,
      _items: 1,
      _disabled: 1,
      _dropdownVisible: 1,
      _hasDropdownOpened: 1,
      _highlightedOptionElementId: 1,
      _variant: 1,
      _dropdownHeight: 1,
      _readonly: 1,
      _logoLoaded: 1
    }
  });

  var baseCombobox = Engine.registerComponent(LightningBaseCombobox, {
    tmpl: _tmpl$i
  });

  function scrollIntoViewIfNeeded(element, scrollingParent) {
    const parentRect = scrollingParent.getBoundingClientRect();
    const findMeRect = element.getBoundingClientRect();

    if (findMeRect.top < parentRect.top) {
      if (element.offsetTop + findMeRect.height < parentRect.height) {
        // If element fits by scrolling to the top, then do that
        scrollingParent.scrollTop = 0;
      } else {
        // Otherwise, top align the element
        scrollingParent.scrollTop = element.offsetTop;
      }
    } else if (findMeRect.bottom > parentRect.bottom) {
      // bottom align the element
      scrollingParent.scrollTop += findMeRect.bottom - parentRect.bottom;
    }
  }

  function tmpl$h($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      h: api_element,
      d: api_dynamic,
      c: api_custom_element,
      b: api_bind,
      gid: api_scoped_id
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6
    } = $ctx;
    return [api_element("label", {
      className: $cmp.computedLabelClass,
      key: 2
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 4
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]), $cmp.fieldLevelHelp ? api_custom_element("lightning-helptext", helptext, {
      props: {
        "content": $cmp.fieldLevelHelp
      },
      key: 5
    }, []) : null, api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 6
    }, [api_custom_element("lightning-base-combobox", baseCombobox, {
      props: {
        "dropdownHeight": "small",
        "name": $cmp.name,
        "variant": "lookup",
        "placeholder": $cmp.placeholder,
        "disabled": $cmp.disabled,
        "readOnly": $cmp.readOnly,
        "items": $cmp.items,
        "inputText": $cmp.displayValue,
        "inputIconName": "utility:clock",
        "inputLabel": $cmp.ariaLabel,
        "inputControlsElement": $cmp.ariaControlsElement,
        "inputLabelledByElement": $cmp.ariaLabelledByElement,
        "dropdownAlignment": "auto"
      },
      key: 7,
      on: {
        "ready": _m0 || ($ctx._m0 = api_bind($cmp.handleReady)),
        "textchange": _m1 || ($ctx._m1 = api_bind($cmp.handleInputChange)),
        "textinput": _m2 || ($ctx._m2 = api_bind($cmp.handleTextInput)),
        "dropdownopenrequest": _m3 || ($ctx._m3 = api_bind($cmp.handleDropdownOpenRequest)),
        "focus": _m4 || ($ctx._m4 = api_bind($cmp.handleFocus)),
        "blur": _m5 || ($ctx._m5 = api_bind($cmp.handleBlur)),
        "select": _m6 || ($ctx._m6 = api_bind($cmp.handleTimeSelect))
      }
    }, [])]), $cmp._errorMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "id": api_scoped_id("error-message"),
        "data-error-message": true,
        "aria-live": "assertive"
      },
      key: 9
    }, [api_dynamic($cmp._errorMessage)]) : null];
  }

  var _tmpl$j = Engine.registerTemplate(tmpl$h);
  tmpl$h.stylesheets = [];
  tmpl$h.stylesheetTokens = {
    hostAttribute: "lightning-timepicker_timepicker-host",
    shadowAttribute: "lightning-timepicker_timepicker"
  };

  /* returns the closes time in the list that should be highlighted in case the value is not in the list. E.g.
  - if value is 16:18 and the list has 15 minute intervals, returns 16:30
  */

  function getTimeToHighlight(value, step) {
    const selectedTime = parseTime(value);

    if (!selectedTime) {
      return null;
    }

    selectedTime.setSeconds(0, 0);
    let closestHour = selectedTime.getHours();
    let closestMinute = selectedTime.getMinutes();
    const mod = closestMinute % step;
    const quotient = Math.floor(closestMinute / step);

    if (mod !== 0) {
      const multiplier = mod < step / 2 ? quotient : quotient + 1;
      closestMinute = multiplier * step;

      if (closestMinute >= 60) {
        if (closestHour === 23) {
          closestMinute -= step;
        } else {
          closestMinute = 0;
          closestHour++;
        }
      }

      selectedTime.setHours(closestHour);
      selectedTime.setMinutes(closestMinute);
    }

    return formatTime(selectedTime, STANDARD_TIME_FORMAT);
  }

  const i18n$8 = {
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow$1,
    rangeUnderflow: labelRangeUnderflow$1,
    required: labelRequired
  };
  const STEP = 15; // in minutes

  class LightningTimePicker extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this._disabled = false;
      this._required = false;
      this._displayValue = null;
      this._value = null;
      this._items = [];
      this._fieldLevelHelp = void 0;
      this._variant = 'lookup';
      this._mainInputId = void 0;
      this._errorMessage = void 0;
      this._readonly = true;
      this._describedByElements = [];
      this.label = void 0;
      this.name = void 0;
      this.max = void 0;
      this.min = void 0;
      this.placeholder = '';
      this.ariaLabelledByElement = void 0;
      this.ariaControlsElement = void 0;
      this.ariaLabel = void 0;
      this.messageWhenValueMissing = void 0;
      this.messageWhenBadInput = void 0;
      this.messageWhenRangeOverflow = void 0;
      this.messageWhenRangeUnderflow = void 0;
      this._ariaDescribedByElements = void 0;
    }

    set ariaDescribedByElements(el) {
      if (Array.isArray(el)) {
        this._ariaDescribedByElements = el;
      } else {
        this.ariaDescribedByElements = [el];
      }
    }

    get ariaDescribedByElements() {
      return this._ariaDescribedByElements;
    }

    get value() {
      return this._value;
    }

    set value(newValue) {
      const normalizedValue = this.normalizeInputValue(newValue);

      if (normalizedValue !== this._value) {
        const normalizedTime = normalizeISOTime(normalizedValue, this.timeFormat);
        this._value = normalizedTime.isoValue;
        this._displayValue = normalizedTime.displayValue;
      }
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);
    }

    get readOnly() {
      return this._readonly;
    }

    set readOnly(value) {
      this._readonly = normalizeBoolean(value);

      if (this._readonly) {
        this._variant = VARIANT.STANDARD;
      }
    }

    get required() {
      return this._required;
    }

    set required(value) {
      this._required = normalizeBoolean(value);
    }
    /**
     * The following will result in the value being invalid:
     * - Missing: if the value is missing when the input is required
     * - Bad input: if the entered time cannot be parsed in the locale format using strict parsing
     * - Overflow/Underflow: if the time is before 'min' or after 'max'
     */


    get validity() {
      const selectedTime = parseTime(this._value);
      return buildSyntheticValidity({
        valueMissing: this.required && !this._displayValue,
        badInput: !!this._displayValue && this._value === null,
        rangeOverflow: this.isAfterMaxTime(selectedTime),
        rangeUnderflow: this.isBeforeMinTime(selectedTime),
        customError: this.customErrorMessage != null && this.customErrorMessage !== ''
      });
    }

    set fieldLevelHelp(value) {
      this._fieldLevelHelp = value;
    }

    get fieldLevelHelp() {
      return this._fieldLevelHelp;
    }

    get variant() {
      return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
      this._variant = normalizeVariant$1(value);
    }
    /**
     * Sets focus on the input element.
     */


    focus() {
      if (this.connected) {
        this.getCombobox().focus();
      }
    }
    /**
     * Removes keyboard focus from the input element.
     */


    blur() {
      if (this.connected) {
        this.getCombobox().blur();
      }
    }
    /**
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */


    checkValidity() {
      return this.validity.valid;
    }
    /**
     * Sets a custom error message to be displayed when the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */


    setCustomValidity(message) {
      this.customErrorMessage = message;
    }
    /**
     * Displays an error message if the input value is invalid.
     */


    showHelpMessageIfInvalid() {
      if (!this.connected || this.readOnly) {
        return;
      }

      const validity = this.validity;

      if (validity.valid) {
        this.classList.remove('slds-has-error');
        this._errorMessage = '';
      } else {
        this.classList.add('slds-has-error');
        this._errorMessage = getErrorMessage(validity, this.getErrorMessageLabels());
      }
    }

    connectedCallback() {
      this.connected = true;
    }

    disconnectedCallback() {
      this.connected = false;
    }

    synchronizeA11y() {
      const label = this.template.querySelector('label');
      const comboBox = this.template.querySelector('lightning-base-combobox');
      let describedByElements = [];

      if (this._ariaDescribedByElements) {
        describedByElements = describedByElements.concat(this._ariaDescribedByElements);
      }

      const errorMessage = this.template.querySelector('[data-error-message]');

      if (errorMessage) {
        describedByElements.push(errorMessage);
      }

      comboBox.inputDescribedByElements = describedByElements;
      synchronizeAttrs(label, {
        for: this._mainInputId
      });
    }

    renderedCallback() {
      this.synchronizeA11y();
    }

    get displayValue() {
      return this._displayValue;
    }

    get items() {
      return this._items;
    }

    get i18n() {
      return i18n$8;
    }

    get isLabelHidden() {
      return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
      return classSet('slds-form-element__label').add({
        'slds-assistive-text': this.isLabelHidden
      }).toString();
    }

    handleReady(e) {
      this._mainInputId = e.detail.id;
    }

    buildTimeList() {
      const timeList = [];
      const minTime = parseTime(this.normalizeInputValue(this.min));
      const minHour = minTime ? minTime.getHours() : 0;
      const maxTime = parseTime(this.normalizeInputValue(this.max));
      const maxHour = maxTime ? maxTime.getHours() + 1 : 24;
      const date = new Date();

      for (let hour = minHour; hour < maxHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += STEP) {
          date.setHours(hour, minutes);
          date.setSeconds(0, 0);

          if (this.isBeforeMinTime(date, minTime)) {
            continue; // eslint-disable-line no-continue
          }

          if (this.isAfterMaxTime(date, maxTime)) {
            break;
          }

          timeList.push({
            type: 'option-inline',
            text: this.format(date, this.timeFormat),
            value: this.format(date)
          });
        }
      }

      return timeList;
    }

    get timeList() {
      if (!this._timeList) {
        this._timeList = this.buildTimeList();
      }

      if (!this._value) {
        return this._timeList;
      }

      const timeToHighlight = getTimeToHighlight(this._value, STEP);

      const timeList = this._timeList.map(item => {
        const itemCopy = Object.assign({}, item);

        if (item.value === this._value) {
          itemCopy.iconName = 'utility:check';
        }

        if (item.value === timeToHighlight) {
          itemCopy.highlight = true;
        }

        return itemCopy;
      });

      return timeList;
    }

    get timeFormat() {
      if (!this._timeFormat) {
        // We only remove the seconds when displaying the time
        this._timeFormat = this.getDisplayFormat(getLocale$1().timeFormat);
      }

      return this._timeFormat;
    }

    getCombobox() {
      return this.template.querySelector('lightning-base-combobox');
    }

    handleFocus() {
      this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
      this.dispatchEvent(new CustomEvent('blur'));
    }

    handleInputChange(event) {
      event.preventDefault();
      event.stopPropagation(); // keeping the display value in sync with the element's value

      this._displayValue = event.detail.text;
      this._value = normalizeFormattedTime(this._displayValue, this._timeFormat);
      this._items = this.timeList;
      this.dispatchChangeEvent();
    }

    handleTextInput(event) {
      event.preventDefault();
      event.stopPropagation(); // keeping the display value in sync with the element's value

      this._displayValue = event.detail.text;
    }

    handleTimeSelect(event) {
      event.stopPropagation(); // for some reason this event is fired without detail from grouped-combobox

      if (!event.detail) {
        return;
      }

      this._value = event.detail.value;
      this._displayValue = normalizeISOTime(this._value, this.timeFormat).displayValue;
      this._items = this.timeList;
      this.dispatchChangeEvent();
    }

    handleDropdownOpenRequest() {
      this._items = this.timeList;
    }

    dispatchChangeEvent() {
      this.dispatchEvent(new CustomEvent('change', {
        composed: true,
        bubbles: true,
        detail: {
          value: this._value
        }
      }));
    }

    getDisplayFormat(formatString) {
      const regexp = /(\W*(?=[sS])[^aAZ\s]*)/;
      return formatString.replace(regexp, '');
    }

    normalizeInputValue(value) {
      if (!value || value === '') {
        return null;
      }

      return removeTimeZoneSuffix(value);
    }

    format(date, formatString) {
      return formatTime(date, formatString || STANDARD_TIME_FORMAT);
    }

    isBeforeMinTime(date, minTime) {
      const minDate = minTime || parseTime(this.normalizeInputValue(this.min));
      return minDate ? isBefore(date, minDate, 'minute') : false;
    }

    isAfterMaxTime(date, maxTime) {
      const maxDate = maxTime || parseTime(this.normalizeInputValue(this.max));
      return maxDate ? isAfter(date, maxDate, 'minute') : false;
    }

    getErrorMessageLabels() {
      const valueMissing = this.messageWhenValueMissing;
      const badInput = this.messageWhenBadInput || this.formatString(i18n$8.invalidDate, this.timeFormat);
      const rangeOverflow = this.messageWhenRangeOverflow || this.formatString(i18n$8.rangeOverflow, normalizeISOTime(this.max, this.timeFormat).displayValue);
      const rangeUnderflow = this.messageWhenRangeUnderflow || this.formatString(i18n$8.rangeUnderflow, normalizeISOTime(this.max, this.timeFormat).displayValue);
      return {
        valueMissing,
        badInput,
        rangeOverflow,
        rangeUnderflow,
        customError: this.customErrorMessage
      };
    }

    formatString(str, ...args) {
      return str.replace(/{(\d+)}/g, (match, i) => {
        return args[i];
      });
    }

  }

  Engine.registerDecorators(LightningTimePicker, {
    publicProps: {
      label: {
        config: 0
      },
      name: {
        config: 0
      },
      max: {
        config: 0
      },
      min: {
        config: 0
      },
      placeholder: {
        config: 0
      },
      ariaLabelledByElement: {
        config: 0
      },
      ariaControlsElement: {
        config: 0
      },
      ariaLabel: {
        config: 0
      },
      messageWhenValueMissing: {
        config: 0
      },
      messageWhenBadInput: {
        config: 0
      },
      messageWhenRangeOverflow: {
        config: 0
      },
      messageWhenRangeUnderflow: {
        config: 0
      },
      ariaDescribedByElements: {
        config: 3
      },
      value: {
        config: 3
      },
      disabled: {
        config: 3
      },
      readOnly: {
        config: 3
      },
      required: {
        config: 3
      },
      validity: {
        config: 1
      },
      fieldLevelHelp: {
        config: 3
      },
      variant: {
        config: 3
      }
    },
    publicMethods: ["focus", "blur", "checkValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
    track: {
      _disabled: 1,
      _required: 1,
      _displayValue: 1,
      _value: 1,
      _items: 1,
      _fieldLevelHelp: 1,
      _variant: 1,
      _mainInputId: 1,
      _errorMessage: 1,
      _readonly: 1,
      _describedByElements: 1
    }
  });

  var timepicker = Engine.registerComponent(LightningTimePicker, {
    tmpl: _tmpl$j
  });

  var labelDate = 'Date';

  var labelTime = 'Time';

  function tmpl$i($api, $cmp, $slotset, $ctx) {
    const {
      t: api_text,
      h: api_element,
      d: api_dynamic,
      c: api_custom_element,
      b: api_bind,
      gid: api_scoped_id
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5
    } = $ctx;
    return [api_element("div", {
      classMap: {
        "slds-form": true,
        "slds-form_compound": true
      },
      attrs: {
        "tabindex": "-1"
      },
      key: 2
    }, [api_element("fieldset", {
      classMap: {
        "slds-form-element": true
      },
      key: 3
    }, [api_element("legend", {
      className: $cmp.computedLabelClass,
      key: 4
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 6
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]), $cmp.fieldLevelHelp ? api_custom_element("lightning-helptext", helptext, {
      props: {
        "content": $cmp.fieldLevelHelp
      },
      key: 7
    }, []) : null, api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 8
    }, [api_element("div", {
      classMap: {
        "slds-form-element__group": true
      },
      key: 9
    }, [api_element("div", {
      classMap: {
        "slds-form-element__row": true
      },
      key: 10
    }, [api_custom_element("lightning-datepicker", datepicker, {
      classMap: {
        "slds-form-element": true
      },
      props: {
        "value": $cmp.dateValue,
        "min": $cmp.dateMin,
        "max": $cmp.dateMax,
        "label": $cmp.i18n.date,
        "name": $cmp.name,
        "variant": $cmp.variant,
        "placeholder": $cmp.placeholder,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 11,
      on: {
        "focus": _m0 || ($ctx._m0 = api_bind($cmp.handleDatepickerFocus)),
        "blur": _m1 || ($ctx._m1 = api_bind($cmp.handleDatepickerBlur)),
        "change": _m2 || ($ctx._m2 = api_bind($cmp.handleDateChange))
      }
    }, []), api_custom_element("lightning-timepicker", timepicker, {
      classMap: {
        "slds-form-element": true
      },
      props: {
        "value": $cmp.timeValue,
        "label": $cmp.i18n.time,
        "name": $cmp.name,
        "variant": $cmp.variant,
        "placeholder": $cmp.placeholder,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 12,
      on: {
        "focus": _m3 || ($ctx._m3 = api_bind($cmp.handleTimepickerFocus)),
        "blur": _m4 || ($ctx._m4 = api_bind($cmp.handleTimepickerBlur)),
        "change": _m5 || ($ctx._m5 = api_bind($cmp.handleTimeChange))
      }
    }, [])])])]), $cmp.customErrorMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "data-error-message": true,
        "id": api_scoped_id("errormessage"),
        "aria-live": "assertive"
      },
      key: 14
    }, [api_dynamic($cmp.customErrorMessage)]) : null])])];
  }

  var _tmpl$k = Engine.registerTemplate(tmpl$i);
  tmpl$i.stylesheets = [];
  tmpl$i.stylesheetTokens = {
    hostAttribute: "lightning-datetimepicker_datetimepicker-host",
    shadowAttribute: "lightning-datetimepicker_datetimepicker"
  };

  const i18n$9 = {
    date: labelDate,
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow$1,
    rangeUnderflow: labelRangeUnderflow$1,
    required: labelRequired,
    time: labelTime
  };

  class LightningDateTimePicker extends Engine.LightningElement {
    // getters and setters necessary to trigger sync
    set timeAriaControls(val) {
      this._timeAriaControls = val;
      this.synchronizeA11y();
    }

    get timeAriaControls() {
      return this._timeAriaControls;
    }

    set timeAriaLabelledBy(val) {
      this._timeAriaLabelledBy = val;
      this.synchronizeA11y();
    }

    get timeAriaLabelledBy() {
      return this._timeAriaLabelledBy;
    }

    set timeAriaDescribedBy(val) {
      this._timeAriaDescribedBy = val;
      this.synchronizeA11y();
    }

    get timeAriaDescribedBy() {
      return this._timeAriaDescribedBy;
    }

    get max() {
      return this.maxValue;
    }

    set max(newValue) {
      this.maxValue = newValue;
      this.calculateFormattedMaxValue();
    }

    get min() {
      return this.minValue;
    }

    set min(newValue) {
      this.minValue = newValue;
      this.calculateFormattedMinValue();
    }

    get value() {
      return this._value;
    }

    set value(newValue) {
      const normalizedValue = this.normalizeInputValue(newValue);

      if (normalizedValue !== this._value) {
        if (!this.connected) {
          // we set the values in connectedCallback to make sure timezone is available.
          this._initialValue = normalizedValue;
          return;
        }

        this.setDateAndTimeValues(normalizedValue);
      }
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);
    }

    get readOnly() {
      return this._readonly;
    }

    set readOnly(value) {
      this._readonly = normalizeBoolean(value);
    }

    get required() {
      return this._required;
    }

    set required(value) {
      this._required = normalizeBoolean(value);
    }

    set fieldLevelHelp(value) {
      this._fieldLevelHelp = value;
    }

    get fieldLevelHelp() {
      return this._fieldLevelHelp;
    }

    get variant() {
      return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
      this._variant = normalizeVariant$1(value);
    }
    /**
     * Sets focus on the date input element.
     */


    focus() {
      if (this.connected) {
        this.getDatepicker().focus();
      }
    }
    /**
     * Removes keyboard focus from the input elements.
     */


    blur() {
      if (this.connected) {
        this.getDatepicker().blur();
        this.getTimepicker().blur();
      }
    }
    /**
     * The following will result in the value being invalid:
     * - Missing: if the value is missing when the input is required
     * - Overflow/Underflow: if the time is before 'min' or after 'max'
     * - Bad Input will be handled by the individual date or time components
     */


    get validity() {
      const selectedDateTime = parseDateTimeUTC(this._value);
      const dateValidity = this.getDatepicker().validity;
      const timeValidity = this.getTimepicker().validity;
      const dateMissing = this.required && !this._dateValue;
      const timeMissing = this.required && !this._timeValue;
      const rangeOverflow = this.isAfterMaxDate(selectedDateTime, 'minute');
      const dateOverflow = this.isAfterMaxDate(selectedDateTime, 'day');
      const timeOverflow = rangeOverflow && !dateOverflow;
      const rangeUnderflow = this.isBeforeMinDate(selectedDateTime, 'minute');
      const dateUnderflow = this.isBeforeMinDate(selectedDateTime, 'day');
      const timeUnderflow = rangeUnderflow && !dateUnderflow;
      this.dateValid = !dateOverflow && !dateUnderflow && !dateMissing && dateValidity.valid;
      this.timeValid = !timeOverflow && !timeUnderflow && !timeMissing && timeValidity.valid;
      return buildSyntheticValidity({
        valueMissing: dateMissing && timeMissing,
        rangeOverflow,
        rangeUnderflow,
        badInput: timeMissing || dateValidity.badInput || timeValidity.badInput,
        customError: this._customErrorMessage != null && this._customErrorMessage !== ''
      });
    }
    /**
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */


    checkValidity() {
      return this.validity.valid;
    }
    /**
     * Sets a custom error message to be displayed when the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */


    setCustomValidity(message) {
      this._customErrorMessage = message;
    }
    /**
     * Displays an error message if the input value is invalid.
     */


    showHelpMessageIfInvalid() {
      if (!this.connected || this.readOnly) {
        return;
      }

      const validity = this.validity;
      let errorMessage = '';

      if (validity.valid) {
        this._customErrorMessage = '';
        this.classList.remove('slds-has-error');
        this.updateDatepickerError(errorMessage);
        this.updateTimepickerError(errorMessage);
      } else {
        if (validity.customError) {
          // custom error messages apply to the whole component, not individial date/time components
          // TODO add aria-describedby on the input elements in datepicker and timepicker
          // As of 212, there is no good way to set aria-describedby on child components, raptor is currently working on a proposal
          this.classList.add('slds-has-error');
          return;
        }

        errorMessage = getErrorMessage(validity, this.getErrorMessageLabels());
        const dateError = !this.dateValid ? errorMessage : '';
        this.updateDatepickerError(dateError);
        const timeError = !this.timeValid ? errorMessage : '';
        this.updateTimepickerError(timeError);
      }
    }

    get isLabelHidden() {
      return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
      return classSet('slds-form-element__legend slds-form-element__label').add({
        'slds-assistive-text': this.isLabelHidden
      }).toString();
    }

    get i18n() {
      return i18n$9;
    }

    get dateValue() {
      return this._dateValue;
    }

    get timeValue() {
      return this._timeValue;
    }

    get customErrorMessage() {
      return this._customErrorMessage;
    }

    get dateMin() {
      return this._dateMin;
    }

    get dateMax() {
      return this._dateMax;
    }

    get errorMessageElementId() {
      return getRealDOMId(this.template.querySelector('[data-error-message'));
    }

    get computedDateAriaDescribedBy() {
      const ariaValues = [];

      if (this.customErrorMessage) {
        ariaValues.push(this.errorMessageElementId);
      }

      if (this.dateAriaDescribedBy) {
        ariaValues.push(this.dateAriaDescribedBy);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    get computedTimeAriaDescribedBy() {
      const ariaValues = [];

      if (this.customErrorMessage) {
        ariaValues.push(this.errorMessageElementId);
      }

      if (this.timeAriaDescribedBy) {
        ariaValues.push(this.timeAriaDescribedBy);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    constructor() {
      super();
      this._disabled = false;
      this._readonly = false;
      this._required = false;
      this._fieldLevelHelp = void 0;
      this._variant = void 0;
      this._value = null;
      this._dateValue = null;
      this._timeValue = null;
      this._customErrorMessage = '';
      this.label = void 0;
      this.name = void 0;
      this.timezone = void 0;
      this.placeholder = '';
      this.timeAriaLabel = void 0;
      this.dateAriaControls = void 0;
      this.dateAriaLabel = void 0;
      this.dateAriaLabelledBy = void 0;
      this.dateAriaDescribedBy = void 0;
      this.messageWhenValueMissing = void 0;
      this.messageWhenBadInput = void 0;
      this.messageWhenRangeOverflow = void 0;
      this.messageWhenRangeUnderflow = void 0;
      this.uniqueId = generateUniqueId();
    }

    synchronizeA11y() {
      const datepicker$$1 = this.template.querySelector('lightning-datepicker');
      const timepicker$$1 = this.template.querySelector('lightning-timepicker');

      if (datepicker$$1) {
        synchronizeAttrs(datepicker$$1, {
          ariaLabelledByElement: this.dateAriaLabelledBy,
          ariaDescribedByElements: this.computedDateAriaDescribedBy,
          ariaControlsElement: this.dateAriaControls,
          'aria-label': this.dateAriaLabel
        });
      }

      if (timepicker$$1) {
        synchronizeAttrs(timepicker$$1, {
          ariaLabelledByElement: this.timeAriaLabelledBy,
          ariaDescribedByElements: this.computedTimeAriaDescribedBy,
          ariaControlsElement: this.timeAriaControls,
          'aria-label': this.timeAriaLabel
        });
      }
    }

    connectedCallback() {
      this.classList.add('slds-form_compound');
      this.calculateFormattedMinValue();
      this.calculateFormattedMaxValue();
      this.connected = true; // we set the initial values here in order to make sure timezone is available.

      this.setDateAndTimeValues(this._initialValue);
      this.interactingState = new InteractingState();
      this.interactingState.onenter(() => {
        this.dispatchEvent(new CustomEvent('focus'));
      });
      this.interactingState.onleave(() => {
        this.dispatchEvent(new CustomEvent('blur'));
      });
    }

    renderedCallback() {
      this.synchronizeA11y();
    }

    disconnectedCallback() {
      this.connected = false;
    }

    updateTimepickerError(errorMessage) {
      const timepicker$$1 = this.getTimepicker();
      timepicker$$1.setCustomValidity(errorMessage);
      timepicker$$1.showHelpMessageIfInvalid();
    }

    updateDatepickerError(errorMessage) {
      const datepicker$$1 = this.getDatepicker();
      requestAnimationFrame(() => {
        datepicker$$1.setCustomValidity(errorMessage);
        datepicker$$1.showHelpMessageIfInvalid();
      });
    }

    getTimepicker() {
      return this.template.querySelector('lightning-timepicker');
    }

    getDatepicker() {
      return this.template.querySelector('lightning-datepicker');
    }

    handleDatepickerFocus() {
      this._dateFocus = true;
      this.interactingState.enter();
    }

    handleTimepickerFocus() {
      this._timeFocus = true;
      this.interactingState.enter();
    }

    handleDatepickerBlur() {
      this._dateFocus = false; // timepicker fires focus before datepicker fires blur

      if (!this._timeFocus) {
        this.interactingState.leave();
      }
    }

    handleTimepickerBlur() {
      this._timeFocus = false; // datepicker fires focus before timepicker fires blur

      if (!this._dateFocus) {
        this.interactingState.leave();
      }
    }

    handleDateChange(event) {
      event.stopPropagation(); // for some reason this event is fired without detail from listbox

      if (!event.detail) {
        return;
      }

      this._dateValue = event.detail.value;

      if (this._dateValue) {
        this._timeValue = this._timeValue || getCurrentTime(this.timezone);
      }

      this.updateValue();
    }

    handleTimeChange(event) {
      event.stopPropagation(); // for some reason this event is fired without detail from listbox

      if (!event.detail) {
        return;
      }

      this._timeValue = event.detail.value;
      this.updateValue();
    }

    updateValue() {
      const dateValue = this._dateValue;
      const timeValue = this._timeValue;

      if (dateValue && timeValue) {
        const dateTimeString = dateValue + TIME_SEPARATOR + timeValue;
        this._value = normalizeFormattedDateTime(dateTimeString, this.timezone);
        this.dispatchChangeEvent();
      } else if (!dateValue) {
        this._value = null;
        this._timeValue = null;
        this.dispatchChangeEvent();
      }
    }

    dispatchChangeEvent() {
      this.dispatchEvent(new CustomEvent('change', {
        composed: true,
        bubbles: true,
        detail: {
          value: this._value
        }
      }));
    }

    normalizeInputValue(value) {
      if (!value || value === '') {
        return null;
      }

      return value;
    }

    setDateAndTimeValues(value) {
      const normalizedValue = normalizeISODateTime(value, this.timezone).isoValue;
      const isDateOnly = normalizedValue && value.indexOf(TIME_SEPARATOR) < 0;

      if (isDateOnly) {
        this._dateValue = value;
        this._value = this._dateValue;
        return;
      }

      const dateAndTime = this.separateDateTime(normalizedValue);
      this._dateValue = dateAndTime && dateAndTime[0];
      this._timeValue = dateAndTime && dateAndTime[1];
      this._value = normalizedValue;
    }

    calculateFormattedMinValue() {
      if (!this.min) {
        return;
      }

      const normalizedDate = normalizeISODateTime(this.min, this.timezone);
      this._dateMin = this.separateDateTime(normalizedDate.isoValue)[0];
      this.formattedMin = normalizedDate.displayValue;
    }

    calculateFormattedMaxValue() {
      if (!this.max) {
        return;
      }

      const normalizedDate = normalizeISODateTime(this.max, this.timezone);
      this._dateMax = this.separateDateTime(normalizedDate.isoValue)[0];
      this.formattedMax = normalizedDate.displayValue;
    }

    separateDateTime(isoString) {
      return typeof isoString === 'string' ? isoString.split(TIME_SEPARATOR) : null;
    }

    isBeforeMinDate(date, unit) {
      const minDate = parseDateTimeUTC(this.min);
      return minDate ? isBefore(date, minDate, unit) : false;
    }

    isAfterMaxDate(date, unit) {
      const maxDate = parseDateTimeUTC(this.max);
      return maxDate ? isAfter(date, maxDate, unit) : false;
    }

    getErrorMessageLabels() {
      const badInput = this.messageWhenValueMissing;
      const valueMissing = this.messageWhenValueMissing;
      const rangeOverflow = this.messageWhenRangeOverflow || this.formatString(i18n$9.rangeOverflow, this.formattedMax);
      const rangeUnderflow = this.messageWhenRangeUnderflow || this.formatString(i18n$9.rangeUnderflow, this.formattedMin);
      return {
        badInput,
        valueMissing,
        rangeOverflow,
        rangeUnderflow,
        customError: this._customErrorMessage
      };
    }

    formatString(str, ...args) {
      return str.replace(/{(\d+)}/g, (match, i) => {
        return args[i];
      });
    }

  }

  Engine.registerDecorators(LightningDateTimePicker, {
    publicProps: {
      label: {
        config: 0
      },
      name: {
        config: 0
      },
      timezone: {
        config: 0
      },
      placeholder: {
        config: 0
      },
      timeAriaLabel: {
        config: 0
      },
      timeAriaControls: {
        config: 3
      },
      timeAriaLabelledBy: {
        config: 3
      },
      timeAriaDescribedBy: {
        config: 3
      },
      dateAriaControls: {
        config: 0
      },
      dateAriaLabel: {
        config: 0
      },
      dateAriaLabelledBy: {
        config: 0
      },
      dateAriaDescribedBy: {
        config: 0
      },
      messageWhenValueMissing: {
        config: 0
      },
      messageWhenBadInput: {
        config: 0
      },
      messageWhenRangeOverflow: {
        config: 0
      },
      messageWhenRangeUnderflow: {
        config: 0
      },
      max: {
        config: 3
      },
      min: {
        config: 3
      },
      value: {
        config: 3
      },
      disabled: {
        config: 3
      },
      readOnly: {
        config: 3
      },
      required: {
        config: 3
      },
      fieldLevelHelp: {
        config: 3
      },
      variant: {
        config: 3
      },
      validity: {
        config: 1
      }
    },
    publicMethods: ["focus", "blur", "checkValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
    track: {
      _disabled: 1,
      _readonly: 1,
      _required: 1,
      _fieldLevelHelp: 1,
      _variant: 1,
      _value: 1,
      _dateValue: 1,
      _timeValue: 1,
      _customErrorMessage: 1
    }
  });

  var datetimepicker = Engine.registerComponent(LightningDateTimePicker, {
    tmpl: _tmpl$k
  });

  var labelInputFileBodyText = 'Or drop files';

  var labelInputFileButtonLabel = 'Upload Files';

  var labelMessageToggleActive = 'Active';

  var labelMessageToggleInactive = 'Inactive';

  var labelClearInput = 'Clear';

  var labelLoadingIndicator = 'Loading';

  const MOCK = {};
  const numberFormat = MOCK;

  function stylesheet$4(hostSelector, shadowSelector, nativeShadow) {
    return "\n" + (nativeShadow ? (":host {display: block;}") : (hostSelector + " {display: block;}")) + "\n";
  }
  var _implicitStylesheets$4 = [stylesheet$4];

  function tmpl$j($api, $cmp, $slotset, $ctx) {
    const {
      h: api_element,
      t: api_text,
      d: api_dynamic,
      gid: api_scoped_id,
      c: api_custom_element,
      ti: api_tab_index,
      b: api_bind
    } = $api;
    const {
      _m0,
      _m1,
      _m2,
      _m3,
      _m4,
      _m5,
      _m6,
      _m7,
      _m8,
      _m9,
      _m10,
      _m11,
      _m12,
      _m13,
      _m14,
      _m15,
      _m16,
      _m17,
      _m18,
      _m19,
      _m20,
      _m21,
      _m22,
      _m23,
      _m24,
      _m25,
      _m26,
      _m27,
      _m28,
      _m29,
      _m30,
      _m31,
      _m32,
      _m33,
      _m34,
      _m35,
      _m36,
      _m37,
      _m38,
      _m39
    } = $ctx;
    return [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "data-aria": true
      },
      key: 2
    }, []), $cmp.isTypeSimple ? api_element("label", {
      className: $cmp.computedLabelClass,
      attrs: {
        "for": `${api_scoped_id("input")}`
      },
      key: 4
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 6
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]) : null, $cmp.isTypeSimple ? $cmp.fieldLevelHelp ? api_custom_element("lightning-helptext", helptext, {
      props: {
        "content": $cmp.fieldLevelHelp
      },
      key: 7
    }, []) : null : null, $cmp.isTypeSimple ? api_element("div", {
      className: $cmp.computedFormElementClass,
      key: 8
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": $cmp._internalType,
        "id": api_scoped_id("input"),
        "aria-label": $cmp.computedAriaLabel,
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "max": $cmp.normalizedMax,
        "min": $cmp.normalizedMin,
        "step": $cmp.step,
        "maxlength": $cmp.maxLength,
        "minlength": $cmp.minLength,
        "pattern": $cmp.pattern,
        "placeholder": $cmp.placeholder,
        "name": $cmp.name
      },
      props: {
        "value": $cmp.displayedValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 9,
      on: {
        "blur": _m0 || ($ctx._m0 = api_bind($cmp.handleBlur)),
        "focus": _m1 || ($ctx._m1 = api_bind($cmp.handleFocus)),
        "change": _m2 || ($ctx._m2 = api_bind($cmp.handleChange)),
        "input": _m3 || ($ctx._m3 = api_bind($cmp.handleInput)),
        "keypress": _m4 || ($ctx._m4 = api_bind($cmp.handleKeyPress))
      }
    }, []), $cmp.isTypeSearch ? api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": "utility:search",
        "variant": "bare",
        "svgClass": "slds-input__icon slds-input__icon_left slds-icon-text-default"
      },
      key: 11
    }, []) : null, $cmp.isTypeSearch ? api_element("div", {
      classMap: {
        "slds-input__icon-group": true,
        "slds-input__icon-group_right": true
      },
      key: 12
    }, [$cmp.isLoading ? api_element("div", {
      classMap: {
        "slds-spinner": true,
        "slds-spinner_brand": true,
        "slds-spinner_x-small": true,
        "slds-input__spinner": true
      },
      attrs: {
        "role": "status"
      },
      key: 14
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 15
    }, [api_dynamic($cmp.i18n.loading)]), api_element("div", {
      classMap: {
        "slds-spinner__dot-a": true
      },
      key: 16
    }, []), api_element("div", {
      classMap: {
        "slds-spinner__dot-b": true
      },
      key: 17
    }, [])]) : null, $cmp._showClearButton ? api_element("button", {
      classMap: {
        "slds-input__icon": true,
        "slds-input__icon_right": true,
        "slds-button": true,
        "slds-button_icon": true
      },
      attrs: {
        "data-element-id": "searchClear"
      },
      key: 19,
      on: {
        "blur": _m5 || ($ctx._m5 = api_bind($cmp.handleBlur)),
        "click": _m6 || ($ctx._m6 = api_bind($cmp.clearAndSetFocusOnInput))
      }
    }, [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": "utility:clear",
        "variant": "bare",
        "svgClass": "slds-button__icon"
      },
      key: 20
    }, []), api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 21
    }, [api_dynamic($cmp.i18n.clear)])]) : null]) : null]) : null, $cmp.isTypeToggle ? api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 23
    }, [api_element("label", {
      classMap: {
        "slds-checkbox_toggle": true,
        "slds-grid": true
      },
      attrs: {
        "for": `${api_scoped_id("checkbox-toggle")}`
      },
      key: 24
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 26
    }, [api_text("*")]) : null, api_element("span", {
      className: $cmp.computedLabelClass,
      key: 27
    }, [api_dynamic($cmp.label)]), api_element("input", {
      attrs: {
        "type": "checkbox",
        "id": api_scoped_id("checkbox-toggle"),
        "aria-label": $cmp.computedAriaLabel,
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "name": $cmp.name
      },
      props: {
        "checked": $cmp._checked,
        "value": $cmp.displayedValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 28,
      on: {
        "blur": _m7 || ($ctx._m7 = api_bind($cmp.handleBlur)),
        "focus": _m8 || ($ctx._m8 = api_bind($cmp.handleFocus)),
        "change": _m9 || ($ctx._m9 = api_bind($cmp.handleChange))
      }
    }, []), api_element("span", {
      classMap: {
        "slds-checkbox_faux_container": true
      },
      attrs: {
        "id": api_scoped_id("toggle-description"),
        "data-toggle-description": true,
        "aria-live": "assertive"
      },
      key: 29
    }, [api_element("span", {
      classMap: {
        "slds-checkbox_faux": true
      },
      key: 30
    }, []), api_element("span", {
      classMap: {
        "slds-checkbox_on": true
      },
      key: 31
    }, [api_dynamic($cmp.messageToggleActive)]), api_element("span", {
      classMap: {
        "slds-checkbox_off": true
      },
      key: 32
    }, [api_dynamic($cmp.messageToggleInactive)])])])]) : null, $cmp.isTypeCheckbox ? api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 34
    }, [api_element("span", {
      className: $cmp.computedCheckboxClass,
      key: 35
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 37
    }, [api_text("*")]) : null, api_element("input", {
      attrs: {
        "type": "checkbox",
        "id": api_scoped_id("checkbox"),
        "aria-label": $cmp.computedAriaLabel,
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "name": $cmp.name
      },
      props: {
        "checked": $cmp._checked,
        "value": $cmp.displayedValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 38,
      on: {
        "blur": _m10 || ($ctx._m10 = api_bind($cmp.handleBlur)),
        "focus": _m11 || ($ctx._m11 = api_bind($cmp.handleFocus)),
        "change": _m12 || ($ctx._m12 = api_bind($cmp.handleChange))
      }
    }, []), api_element("label", {
      classMap: {
        "slds-checkbox__label": true
      },
      attrs: {
        "for": `${api_scoped_id("checkbox")}`
      },
      key: 39
    }, [api_element("span", {
      classMap: {
        "slds-checkbox_faux": true
      },
      key: 40
    }, []), api_element("span", {
      className: $cmp.computedLabelClass,
      key: 41
    }, [api_dynamic($cmp.label)])]), $cmp.fieldLevelHelp ? api_custom_element("lightning-helptext", helptext, {
      props: {
        "content": $cmp.fieldLevelHelp
      },
      key: 42
    }, []) : null])]) : null, $cmp.isTypeCheckboxButton ? api_element("div", {
      classMap: {
        "slds-checkbox_add-button": true
      },
      key: 44
    }, [api_element("input", {
      classMap: {
        "slds-assistive-text": true
      },
      attrs: {
        "type": "checkbox",
        "id": api_scoped_id("checkbox-button"),
        "aria-label": $cmp.computedAriaLabel,
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "name": $cmp.name
      },
      props: {
        "checked": $cmp._checked,
        "value": $cmp.displayedValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 45,
      on: {
        "blur": _m13 || ($ctx._m13 = api_bind($cmp.handleBlur)),
        "focus": _m14 || ($ctx._m14 = api_bind($cmp.handleFocus)),
        "change": _m15 || ($ctx._m15 = api_bind($cmp.handleChange))
      }
    }, []), api_element("label", {
      classMap: {
        "slds-checkbox_faux": true
      },
      attrs: {
        "for": `${api_scoped_id("checkbox-button")}`
      },
      key: 46
    }, [api_element("span", {
      classMap: {
        "slds-assistive-text": true
      },
      key: 47
    }, [api_dynamic($cmp.label)])])]) : null, $cmp.isTypeRadio ? api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 49
    }, [api_element("span", {
      classMap: {
        "slds-radio": true
      },
      key: 50
    }, [api_element("input", {
      attrs: {
        "type": "radio",
        "id": api_scoped_id("radio"),
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "name": $cmp.name
      },
      props: {
        "checked": $cmp._checked,
        "value": $cmp.displayedValue,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 51,
      on: {
        "blur": _m16 || ($ctx._m16 = api_bind($cmp.handleBlur)),
        "focus": _m17 || ($ctx._m17 = api_bind($cmp.handleFocus)),
        "change": _m18 || ($ctx._m18 = api_bind($cmp.handleChange))
      }
    }, []), api_element("label", {
      classMap: {
        "slds-radio__label": true
      },
      attrs: {
        "for": `${api_scoped_id("radio")}`
      },
      key: 52
    }, [api_element("span", {
      classMap: {
        "slds-radio_faux": true
      },
      key: 53
    }, []), api_element("span", {
      className: $cmp.computedLabelClass,
      key: 54
    }, [api_dynamic($cmp.label)])])])]) : null, $cmp.isTypeFile ? api_element("span", {
      className: $cmp.computedLabelClass,
      attrs: {
        "id": api_scoped_id("form-label"),
        "data-form-label": true
      },
      key: 56
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 58
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]) : null, $cmp.isTypeFile ? api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 59
    }, [api_element("div", {
      classMap: {
        "slds-file-selector": true,
        "slds-file-selector_files": true
      },
      key: 60,
      on: {
        "drop": _m23 || ($ctx._m23 = api_bind($cmp.handleDropFiles))
      }
    }, [api_custom_element("lightning-primitive-file-droppable-zone", primitiveFileDroppableZone, {
      props: {
        "multiple": $cmp.multiple,
        "disabled": $cmp.disabled
      },
      key: 61
    }, [api_element("input", {
      classMap: {
        "slds-file-selector__input": true,
        "slds-assistive-text": true
      },
      attrs: {
        "type": "file",
        "id": api_scoped_id("input-file"),
        "aria-label": $cmp.computedAriaLabel,
        "accesskey": $cmp.accesskey,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "accept": $cmp.accept,
        "name": $cmp.name
      },
      props: {
        "value": $cmp.displayedValue,
        "multiple": $cmp.multiple,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "disabled": $cmp.disabled
      },
      key: 62,
      on: {
        "blur": _m19 || ($ctx._m19 = api_bind($cmp.handleBlur)),
        "click": _m20 || ($ctx._m20 = api_bind($cmp.handleFileClick)),
        "focus": _m21 || ($ctx._m21 = api_bind($cmp.handleFocus)),
        "change": _m22 || ($ctx._m22 = api_bind($cmp.handleChange))
      }
    }, []), api_element("label", {
      classMap: {
        "slds-file-selector__body": true
      },
      attrs: {
        "id": api_scoped_id("file-selector-label"),
        "data-file-selector-label": true,
        "for": `${api_scoped_id("input-file")}`
      },
      key: 63
    }, [api_element("span", {
      classMap: {
        "slds-file-selector__button": true,
        "slds-button": true,
        "slds-button_neutral": true
      },
      key: 64
    }, [api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": "utility:upload",
        "variant": "bare",
        "svgClass": "slds-button__icon slds-button__icon_left"
      },
      key: 65
    }, []), api_dynamic($cmp.i18n.inputFileButtonLabel)]), api_element("span", {
      classMap: {
        "slds-file-selector__text": true,
        "slds-medium-show": true
      },
      key: 66
    }, [api_dynamic($cmp.i18n.inputFileBodyText)])])])])]) : null, $cmp.isTypeColor ? api_element("div", {
      classMap: {
        "slds-color-picker": true
      },
      key: 68
    }, [api_element("div", {
      classMap: {
        "slds-color-picker__summary": true
      },
      key: 69
    }, [api_element("label", {
      className: $cmp.computedColorLabelClass,
      attrs: {
        "for": `${api_scoped_id("color")}`
      },
      key: 70
    }, [$cmp.required ? api_element("abbr", {
      classMap: {
        "slds-required": true
      },
      attrs: {
        "title": $cmp.i18n.required
      },
      key: 72
    }, [api_text("*")]) : null, api_dynamic($cmp.label)]), api_custom_element("lightning-primitive-colorpicker-button", primitiveColorpickerButton, {
      props: {
        "value": $cmp.value
      },
      key: 73,
      on: {
        "blur": _m24 || ($ctx._m24 = api_bind($cmp.handleBlur)),
        "focus": _m25 || ($ctx._m25 = api_bind($cmp.handleFocus)),
        "change": _m26 || ($ctx._m26 = api_bind($cmp.handleColorChange))
      }
    }, []), api_element("div", {
      classMap: {
        "slds-form-element": true,
        "slds-color-picker__summary-input": true
      },
      key: 74
    }, [api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 75
    }, [api_element("input", {
      classMap: {
        "slds-input": true
      },
      attrs: {
        "type": "text",
        "id": api_scoped_id("color"),
        "accesskey": $cmp.accesskey,
        "aria-label": $cmp.computedAriaLabel,
        "tabindex": api_tab_index($cmp.internalTabIndex),
        "minlength": "4",
        "maxlength": "7",
        "placeholder": $cmp.placeholder,
        "pattern": $cmp.pattern
      },
      props: {
        "value": $cmp.displayedValue,
        "disabled": $cmp.disabled
      },
      key: 76,
      on: {
        "blur": _m27 || ($ctx._m27 = api_bind($cmp.handleBlur)),
        "focus": _m28 || ($ctx._m28 = api_bind($cmp.handleFocus)),
        "change": _m29 || ($ctx._m29 = api_bind($cmp.handleChange)),
        "input": _m30 || ($ctx._m30 = api_bind($cmp.handleInput))
      }
    }, [])])])])]) : null, $cmp.isTypeDesktopDate ? api_custom_element("lightning-datepicker", datepicker, {
      props: {
        "value": $cmp.displayedValue,
        "max": $cmp.max,
        "min": $cmp.min,
        "label": $cmp.label,
        "name": $cmp.name,
        "variant": $cmp.variant,
        "ariaLabel": $cmp.ariaLabel,
        "placeholder": $cmp.placeholder,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "fieldLevelHelp": $cmp.fieldLevelHelp,
        "messageWhenBadInput": $cmp.messageWhenBadInput,
        "messageWhenValueMissing": $cmp.messageWhenValueMissing,
        "messageWhenRangeOverflow": $cmp.messageWhenRangeOverflow,
        "messageWhenRangeUnderflow": $cmp.messageWhenRangeUnderflow,
        "disabled": $cmp.disabled
      },
      key: 78,
      on: {
        "change": _m31 || ($ctx._m31 = api_bind($cmp.handleChange)),
        "blur": _m32 || ($ctx._m32 = api_bind($cmp.handleBlur)),
        "focus": _m33 || ($ctx._m33 = api_bind($cmp.handleFocus))
      }
    }, []) : null, $cmp.isTypeDesktopTime ? api_custom_element("lightning-timepicker", timepicker, {
      props: {
        "value": $cmp.displayedValue,
        "max": $cmp.max,
        "min": $cmp.min,
        "label": $cmp.label,
        "name": $cmp.name,
        "ariaLabel": $cmp.ariaLabel,
        "variant": $cmp.variant,
        "placeholder": $cmp.placeholder,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "fieldLevelHelp": $cmp.fieldLevelHelp,
        "messageWhenBadInput": $cmp.messageWhenBadInput,
        "messageWhenValueMissing": $cmp.messageWhenValueMissing,
        "messageWhenRangeOverflow": $cmp.messageWhenRangeOverflow,
        "messageWhenRangeUnderflow": $cmp.messageWhenRangeUnderflow,
        "disabled": $cmp.disabled
      },
      key: 80,
      on: {
        "change": _m34 || ($ctx._m34 = api_bind($cmp.handleChange)),
        "blur": _m35 || ($ctx._m35 = api_bind($cmp.handleBlur)),
        "focus": _m36 || ($ctx._m36 = api_bind($cmp.handleFocus))
      }
    }, []) : null, $cmp.isTypeDesktopDateTime ? api_custom_element("lightning-datetimepicker", datetimepicker, {
      props: {
        "dateAriaControls": $cmp.dateAriaControls,
        "dateAriaLabel": $cmp.dateAriaLabel,
        "dateAriaLabelledBy": $cmp.dateAriaLabelledBy,
        "dateAriaDescribedBy": $cmp.dateAriaDescribedBy,
        "timeAriaControls": $cmp.timeAriaControls,
        "timeAriaLabel": $cmp.timeAriaLabel,
        "timeAriaLabelledBy": $cmp.timeAriaLabelledBy,
        "timeAriaDescribedBy": $cmp.timeAriaDescribedBy,
        "value": $cmp.displayedValue,
        "max": $cmp.max,
        "min": $cmp.min,
        "timezone": $cmp.timezone,
        "label": $cmp.label,
        "name": $cmp.name,
        "variant": $cmp.variant,
        "placeholder": $cmp.placeholder,
        "required": $cmp.required,
        "readOnly": $cmp.readOnly,
        "fieldLevelHelp": $cmp.fieldLevelHelp,
        "messageWhenBadInput": $cmp.messageWhenBadInput,
        "messageWhenValueMissing": $cmp.messageWhenValueMissing,
        "messageWhenRangeOverflow": $cmp.messageWhenRangeOverflow,
        "messageWhenRangeUnderflow": $cmp.messageWhenRangeUnderflow,
        "disabled": $cmp.disabled
      },
      key: 82,
      on: {
        "change": _m37 || ($ctx._m37 = api_bind($cmp.handleChange)),
        "blur": _m38 || ($ctx._m38 = api_bind($cmp.handleBlur)),
        "focus": _m39 || ($ctx._m39 = api_bind($cmp.handleFocus))
      }
    }, []) : null, $cmp._helpMessage ? api_element("div", {
      classMap: {
        "slds-form-element__help": true
      },
      attrs: {
        "id": api_scoped_id("help-message"),
        "data-help-message": true,
        "role": "alert"
      },
      key: 84
    }, [api_dynamic($cmp._helpMessage)]) : null];
  }

  var _tmpl$l = Engine.registerTemplate(tmpl$j);
  tmpl$j.stylesheets = [];

  if (_implicitStylesheets$4) {
    tmpl$j.stylesheets.push.apply(tmpl$j.stylesheets, _implicitStylesheets$4);
  }
  tmpl$j.stylesheetTokens = {
    hostAttribute: "lightning-input_input-host",
    shadowAttribute: "lightning-input_input"
  };

  function normalizeInput(value) {
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }

    return '';
  }
  function normalizeDate(value) {
    return normalizeISODate(value).isoValue || '';
  }
  function normalizeTime(value) {
    return normalizeISOTime(value, STANDARD_TIME_FORMAT).isoValue || '';
  } // Converts value to the user's timezone and formats it in a way that will be accepted by the input

  function normalizeUTCDateTime(value, timezone) {
    return normalizeISODateTime(value, timezone).isoValue || '';
  } // parses the input value and converts it back to UTC from the user's timezone

  function normalizeDateTimeToUTC(value, timezone) {
    return normalizeFormattedDateTime(value, timezone) || '';
  }

  const i18n$a = {
    a11yTriggerText: labelA11yTriggerText,
    inputFileBodyText: labelInputFileBodyText,
    inputFileButtonLabel: labelInputFileButtonLabel,
    messageToggleActive: labelMessageToggleActive,
    messageToggleInactive: labelMessageToggleInactive,
    required: labelRequired,
    clear: labelClearInput,
    loading: labelLoadingIndicator
  };
  const ARIA_CONTROLS$2 = 'aria-controls';
  const ARIA_LABEL$2 = 'aria-label';
  const ARIA_LABELEDBY = 'aria-labelledby';
  const ARIA_DESCRIBEDBY$2 = 'aria-describedby';
  /*
  * This component supports the regular native input types, with the addition of toggle, checkbox-button and color.
  * Furthermore the file type supports a droppable zone, search has a clear button, number has formatting.
  * Input changes (native oninput event) triggers an onchange event,
  *     the native even is stopped, the dispatched custom event has a value that points to the state of the component
  *     in case of files it's the files uploaded (via droppable zone or through the upload button),
  *     checked for radio and checkbox, checkbox-button, and just straight input's value for everything else
  *
  *
  * _Toggle_ (always has an aria-describedby, on error has an additional one, default label text for active and inactive
  * states)
  * _File_ (as it has a droppable zone, the validity returned would have to be valid - unless a custom error message was
  *    passed)
  * _Search_ (it has the clear button and the icon)
  * _Number_ (formatting when not in focus, when in focus shows raw value)
  *
  * */

  const VALID_NUMBER_FORMATTERS = ['decimal', 'percent', 'percent-fixed', 'currency'];
  const DEFAULT_COLOR$1 = '#000000';
  const DEFAULT_FORMATTER = VALID_NUMBER_FORMATTERS[0];
  /**
   * Returns an aria string with all the non-autolinked values removed
   * @param {String} values space sperated list of ids
   * @returns {String} The aria values with the non-auto linked ones removed
   */

  function filterNonAutoLink(values) {
    const ariaValues = values.split(/\s+/);
    return ariaValues.filter(val => {
      if (val.match(/^auto-link/)) {
        return true;
      }

      return false;
    }).join(' ');
  }
  /**
   * Represents interactive controls that accept user input depending on the type attribute.
   */


  class LightningInput extends Engine.LightningElement {
    /**
     * Text that is displayed when the field is empty, to prompt the user for a valid entry.
     * @type {string}
     *
     */

    /**
     * Specifies the name of an input element.
     * @type {string}
     *
     */

    /**
     * Text label for the input.
     * @type {string}
     * @required
     *
     */

    /**
     * Reserved for internal use.
     * @type {number}
     *
     */

    /**
     * Error message to be displayed when a bad input is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when a pattern mismatch is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when a range overfolow is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when a range underflow is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when a step mismatch is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when the value is too short.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when the value is too long.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when a type mismatch is detected.
     * @type {string}
     *
     */

    /**
     * Error message to be displayed when the value is missing.
     * @type {string}
     *
     */

    /**
     * Text shown for the active state of a toggle. The default is "Active".
     * @type {string}
     */

    /**
     * Text shown for then inactive state of a toggle. The default is "Inactive".
     * @type {string}
     */

    /**
     * Describes the input to assistive technologies.
     * @type {string}
     */
    set timeAriaControls(refs) {
      this._timeAriaControls = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._timeAriaControls = ref;
      });
    }
    /**
     * A space-separated list of element IDs whose presence or content is controlled by the
     * time input when type='datetime'. On mobile devices, this is merged with aria-controls
     * and date-aria-controls to describe the native date time input.
     * @type {string}
     */


    get timeAriaControls() {
      return this._timeAriaControls;
    }
    /**
     * Describes the date input to assistive technologies when type='datetime'. On mobile devices,
     * this label is merged with aria-label and time-aria-label to describe the native date time input.
     * @type {string}
     *
     */


    set dateAriaLabelledBy(refs) {
      this._dateAriaLabelledBy = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._dateAriaLabelledBy = ref;
      });
    }
    /**
     * A space-separated list of element IDs that provide labels for the date input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and time-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     */


    get dateAriaLabelledBy() {
      return this._dateAriaLabelledBy;
    }

    set timeAriaLabelledBy(refs) {
      this._timeAriaLabelledBy = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._timeAriaLabelledBy = ref;
      });
    }
    /**
     * A space-separated list of element IDs that provide labels for the time input when type='datetime'.
     * On mobile devices, this is merged with aria-labelled-by and date-aria-labelled-by to describe
     * the native date time input.
     * @type {string}
     *
     */


    get timeAriaLabelledBy() {
      return this._timeAriaLabelledBy;
    }

    set timeAriaDescribedBy(refs) {
      this._timeAriaDescribedBy = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._timeAriaDescribedBy = ref;
      });
    }
    /**
     * A space-separated list of element IDs that provide descriptive labels for the time input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and date-aria-described-by
     * to describe the native date time input.
     *  @type {string}
     *
     */


    get timeAriaDescribedBy() {
      return this._timeAriaDescribedBy;
    }

    set dateAriaControls(refs) {
      this._dateAriaControls = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._dateAriaControls = ref;
      });
    }
    /**
     * A space-separated list of element IDs whose presence or content is controlled by the
     * date input when type='datetime'. On mobile devices, this is merged with aria-controls
     * and time-aria-controls to describe the native date time input.
     * @type {string}
     *
     */


    get dateAriaControls() {
      return this._dateAriaControls;
    }

    set dateAriaDescribedBy(refs) {
      this._dateAriaDescribedBy = refs;
      this.ariaObserver.connectLiveIdRef(refs, ref => {
        this._dateAriaDescribedBy = ref;
      });
    }
    /**
     * A space-separated list of element IDs that provide descriptive labels for the date input when
     * type='datetime'. On mobile devices, this is merged with aria-described-by and time-aria-described-by
     * to describe the native date time input.
     * @type {string}
     */


    get dateAriaDescribedBy() {
      return this._dateAriaDescribedBy;
    }

    constructor() {
      super();
      this.placeholder = void 0;
      this.name = void 0;
      this.label = void 0;
      this.formatFractionDigits = void 0;
      this.messageWhenBadInput = void 0;
      this.messageWhenPatternMismatch = void 0;
      this.messageWhenRangeOverflow = void 0;
      this.messageWhenRangeUnderflow = void 0;
      this.messageWhenStepMismatch = void 0;
      this.messageWhenTooShort = void 0;
      this.messageWhenTooLong = void 0;
      this.messageWhenTypeMismatch = void 0;
      this.messageWhenValueMissing = void 0;
      this.messageToggleActive = i18n$a.messageToggleActive;
      this.messageToggleInactive = i18n$a.messageToggleInactive;
      this.ariaLabel = void 0;
      this._timeAriaDescribedBy = void 0;
      this._timeAriaLabelledBy = void 0;
      this._timeAriaControls = void 0;
      this._dateAriaControls = void 0;
      this._dateAriaDescribedBy = void 0;
      this._dateAriaLabelledBy = void 0;
      this.dateAriaLabel = void 0;
      this._value = '';
      this._type = 'text';
      this._pattern = void 0;
      this._max = void 0;
      this._min = void 0;
      this._step = void 0;
      this._disabled = false;
      this._readOnly = false;
      this._required = false;
      this._checked = false;
      this._formatter = DEFAULT_FORMATTER;
      this._isLoading = false;
      this._multiple = false;
      this._timezone = false;
      this._helpMessage = null;
      this._isColorPickerPanelOpen = false;
      this._fieldLevelHelp = void 0;
      this._accesskey = void 0;
      this._tabindex = void 0;
      this._maxLength = void 0;
      this._minLength = void 0;
      this._accept = void 0;
      this._variant = void 0;
      this._connected = void 0;
      this._initialChecked = false;
      this._initialValue = '';
      this._showFormattedNumber = true;
      this._files = null;
      this.ariaObserver = new ContentMutation(this); // Native Shadow Root will return [native code].
      // Our synthetic method will return the function source.

      this.isNative = this.template.querySelector.toString().match(/\[native code\]/);
    }

    set ariaControls(refs) {
      this._ariaControls = refs;
      this.ariaObserver.link('input', 'aria-controls', refs, '[data-aria]');
    }
    /**
     * A space-separated list of element IDs whose presence or content is controlled by the input.
     * @type {string}
     */


    get ariaControls() {
      return this._ariaControls;
    }

    set ariaLabelledBy(refs) {
      this._ariaLabelledBy = refs;
      this.ariaObserver.link('input', 'aria-labelledby', refs, '[data-aria]');
    }
    /**
     * A space-separated list of element IDs that provide labels for the input.
     * @type {string}
     */


    get ariaLabelledBy() {
      // native version returns the auto linked value
      if (this.isNative) {
        const ariaValues = this.template.querySelector('input').getAttribute('aria-labelledby');
        return filterNonAutoLink(ariaValues);
      }

      return this._ariaLabelledBy;
    }

    set ariaDescribedBy(refs) {
      this._ariaDescribedBy = refs;
      this.ariaObserver.link('input', 'aria-describedby', refs, '[data-aria]');
    }
    /**
     * A space-separated list of element IDs that provide descriptive labels for the input.
     * @type {string}
     */


    get ariaDescribedBy() {
      if (this.isNative) {
        // in native case return the linked value
        const ariaValues = this.template.querySelector('input').getAttribute('aria-describedby');
        return filterNonAutoLink(ariaValues);
      }

      return this._ariaDescribedBy;
    }

    synchronizeA11y() {
      const input = this.template.querySelector('input');
      const datepicker$$1 = this.template.querySelector('lightning-datepicker');
      const timepicker$$1 = this.template.querySelector('lightning-timepicker');

      if (datepicker$$1) {
        synchronizeAttrs(datepicker$$1, {
          ariaLabelledByElement: this.ariaLabelledBy,
          ariaDescribedByElements: this.ariaDescribedBy,
          ariaControlsElement: this.ariaControls,
          [ARIA_LABEL$2]: this.computedAriaLabel
        });
        return;
      }

      if (timepicker$$1) {
        synchronizeAttrs(timepicker$$1, {
          ariaLabelledByElement: this.ariaLabelledBy,
          ariaDescribedByElements: this.ariaDescribedBy,
          ariaControlsElement: this.ariaControls,
          [ARIA_LABEL$2]: this.computedAriaLabel
        });
        return;
      }

      if (!input) {
        return;
      }

      synchronizeAttrs(input, {
        [ARIA_LABELEDBY]: this.computedAriaLabelledBy,
        [ARIA_DESCRIBEDBY$2]: this.computedAriaDescribedBy,
        [ARIA_CONTROLS$2]: this.computedAriaControls,
        [ARIA_LABEL$2]: this.computedAriaLabel
      });
    }

    connectedCallback() {
      this.classList.add('slds-form-element');
      this.validateRequiredAttributes();
      this._connected = true;
      this.interactingState = new InteractingState();
      this.interactingState.onleave(() => this.reportValidity());
      this._initialChecked = this.checked;
      this._initialValue = this.displayedValue;
    }

    renderedCallback() {
      this.ariaObserver.sync();
      this.synchronizeA11y();
    }

    disconnectedCallback() {
      this._connected = false;
      this._inputElement = undefined;
    }
    /**
     * String value with the formatter to be used for number input. Valid values include
     * decimal, percent, percent-fixed, and currency.
     * @type {string}
     */


    get formatter() {
      return this._formatter;
    }

    set formatter(value) {
      this._formatter = normalizeString(value, {
        fallbackValue: DEFAULT_FORMATTER,
        validValues: VALID_NUMBER_FORMATTERS
      });
    }
    /**
     * The type of the input. This value defaults to text.
     * @type {string}
     * @default text
     */


    get type() {
      return this._type;
    }

    set type(value) {
      const normalizedValue = normalizeString(value);
      this._type = normalizedValue === 'datetime' ? 'datetime-local' : normalizedValue;
      this.validateType(normalizedValue);
      this._inputElementRefreshNeeded = true;

      this._updateProxyInputAttributes(['type', 'value', 'max', 'min', 'required', 'pattern']);
    }
    /**
     * If present, a spinner is displayed to indicate that data is loading.
     * @type {boolean}
     * @default false
     */


    get isLoading() {
      return this._isLoading;
    }

    set isLoading(value) {
      this._isLoading = normalizeBoolean(value);
    }
    /**
     * Specifies the regular expression that the input's value is checked against.
     * This attribute is supported for text, search, url, tel, email, and password types.
     * @type {string}
     *
     */


    get pattern() {
      if (this.isTypeColor) {
        return '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
      }

      return this._pattern;
    }

    set pattern(value) {
      this._pattern = value;

      this._updateProxyInputAttributes('pattern');
    }
    /**
     * The maximum number of characters allowed in the field.
     * @type {number}
     */


    get maxLength() {
      return this._maxLength;
    }

    set maxLength(value) {
      this._maxLength = value;

      this._updateProxyInputAttributes('maxlength');
    }
    /**
     * Specifies the types of files that the server accepts. This attribute can be used only when type='file'.
     * @type {string}
     */


    get accept() {
      return this._accept;
    }

    set accept(value) {
      this._accept = value;

      this._updateProxyInputAttributes('accept');
    }
    /**
     * The minimum number of characters allowed in the field.
     * @type {number}
     */


    get minLength() {
      return this._minLength;
    }

    set minLength(value) {
      this._minLength = value;

      this._updateProxyInputAttributes('minlength');
    } // number and date/time

    /**
     * The maximum acceptable value for the input.  This attribute can be used only with number,
     * range, date, time, and datetime input types. For number and range type, the max value is a
     * decimal number. For the date, time, and datetime types, the max value must use a valid string for the type.
     * @type {decimal|string}
     */


    get max() {
      return this._max;
    }

    set max(value) {
      this._max = value;

      this._updateProxyInputAttributes('max');
    }
    /**
     * The minimum acceptable value for the input. This attribute can be used only with number,
     * range, date, time, and datetime input types. For number and range types, the min value
     * is a decimal number. For the date, time, and datetime types, the min value must use a valid string for the type.
     * @type {decimal|string}
     */


    get min() {
      return this._min;
    }

    set min(value) {
      this._min = value;

      this._updateProxyInputAttributes('min');
    }
    /**
     * Granularity of the value, specified as a positive floating point number.
     * Use 'any' when granularity is not a concern. This value defaults to 1.
     * @type {decimal|string}
     * @default 1
     */


    get step() {
      const stepNotSupportedYet = this.isTypeDateTime || this.isTypeTime; // The step attribute is broken on IE11; e.g. 123.45 with step=0.01 returns stepMismatch. See W-5356698 for details.

      const nativeStepBroken = this.isTypeNumber && isIE11;

      if (stepNotSupportedYet || nativeStepBroken) {
        return 'any';
      }

      return this._step;
    }

    set step(value) {
      this._step = normalizeInput(value);

      this._updateProxyInputAttributes('step');

      this._calculateFractionDigitsFromStep(value);
    }
    /**
     * If present, the checkbox is selected.
     * @type {boolean}
     * @default false
     */


    get checked() {
      return this._checked;
    }

    set checked(value) {
      this._checked = normalizeBoolean(value);

      this._updateProxyInputAttributes('checked');

      if (this._connected) {
        this.inputElement.checked = this._checked;
      }
    }
    /**
     * Specifies that a user can enter more than one value. This attribute can be used only when type='file' or type='email'.
     * @type {boolean}
     * @default false
     */


    get multiple() {
      return this._multiple;
    }

    set multiple(value) {
      this._multiple = normalizeBoolean(value);

      this._updateProxyInputAttributes('multiple');
    }
    /**
     * Specifies the value of an input element.
     * @type {object}
     */


    get value() {
      return this._value;
    }

    set value(value) {
      this._value = normalizeInput(value);

      this._updateProxyInputAttributes('value'); // do not reset to the same value because it causes IE11 to push the cursor to the end
      // in a re-render see W-5091299


      if (this._connected && this.inputElement.value !== this.displayedValue) {
        this.inputElement.value = this.displayedValue;
      }
    }
    /**
     * The variant changes the appearance of an input field. Accepted variants include standard and label-hidden. This value defaults to standard.
     * @type {string}
     * @default standard
     */


    get variant() {
      return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
      this._variant = normalizeVariant$1(value);
    }
    /**
     * If present, the input field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */


    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      this._disabled = normalizeBoolean(value);

      this._updateProxyInputAttributes('disabled');
    }
    /**
     * If present, the input field is read-only and cannot be edited by users.
     * @type {boolean}
     * @default false
     */


    get readOnly() {
      return this._readOnly;
    }

    set readOnly(value) {
      this._readOnly = normalizeBoolean(value);

      this._updateProxyInputAttributes('readonly');
    }
    /**
     * If present, the input field must be filled out before the form is submitted.
     * @type {boolean}
     * @default false
     */


    get required() {
      return this._required;
    }

    set required(value) {
      this._required = normalizeBoolean(value);

      this._updateProxyInputAttributes('required');
    }
    /**
     * Specifies the time zone used when type='datetime' only. This value defaults to the user's Salesforce time zone setting.
     * @type {string}
     *
     */


    get timezone() {
      return this._timezone || getLocale().timezone;
    }

    set timezone(value) {
      this._timezone = value; // mobile date/time normalization of value/max/min depends on timezone, so we need to update here as well

      this._updateProxyInputAttributes(['value', 'max', 'min']);
    }
    /**
     * A FileList that contains selected files. This attribute can be used only when type='file'.
     * @type {object}
     *
     */


    get files() {
      if (this.isTypeFile) {
        return Engine.unwrap(this._files);
      }

      return null;
    }
    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */


    get validity() {
      return this._constraint.validity;
    }
    /**
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */


    checkValidity() {
      return this._constraint.checkValidity();
    }
    /**
     * Sets a custom error message to be displayed when a form is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */


    setCustomValidity(message) {
      this._constraint.setCustomValidity(message);
    }
    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */


    reportValidity() {
      if (this._connected && !this.isNativeInput) {
        // We let the date components handle their own error messaging for now
        let customValidity = '';

        if (this.validity.customError) {
          customValidity = this._constraint.validationMessage;
        }

        this.inputElement.setCustomValidity(customValidity);
        this.inputElement.showHelpMessageIfInvalid();
        return this.checkValidity();
      }

      return this._constraint.reportValidity(message => {
        this._helpMessage = message;
      });
    }

    get isNativeInput() {
      return !(this.isTypeDesktopDate || this.isTypeDesktopDateTime || this.isTypeDesktopTime);
    }

    set fieldLevelHelp(value) {
      this._fieldLevelHelp = value;
    }
    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     *
     */


    get fieldLevelHelp() {
      return this._fieldLevelHelp;
    }
    /**
     * Sets focus on the input element.
     */


    focus() {
      if (this._connected) {
        this.inputElement.focus();
      }
    }
    /**
     * Removes keyboard focus from the input element.
     */


    blur() {
      if (this._connected) {
        this.inputElement.blur();
      }
    }
    /**
     * Displays error messages on invalid fields.
     * An invalid field fails at least one constraint validation and returns false when checkValidity() is called.
     */


    showHelpMessageIfInvalid() {
      this.reportValidity();
    }

    get computedAriaControls() {
      const ariaValues = []; // merge all date & time arias on mobile since it's displayed as a single field

      if (this.isTypeMobileDateTime) {
        ariaValues.push(this.dateAriaControls);
        ariaValues.push(this.timeAriaControls);
      }

      if (this.ariaControls) {
        ariaValues.push(this.ariaControls);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabel() {
      const ariaValues = []; // merge all date & time arias on mobile since it's displayed as a single field

      if (this.isTypeMobileDateTime) {
        ariaValues.push(this.dateAriaLabel);
        ariaValues.push(this.timeAriaLabel);
      }

      if (this.ariaLabel) {
        ariaValues.push(this.ariaLabel);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaLabelledBy() {
      const ariaValues = [];

      if (this.isTypeFile) {
        ariaValues.push(this.computedUniqueFileElementLabelledById);
      } // merge all date & time arias on mobile since it's displayed as a single field


      if (this.isTypeMobileDateTime) {
        ariaValues.push(this.dateAriaLabelledBy);
        ariaValues.push(this.timeAriaLabelledBy);
      }

      if (this.ariaLabelledBy) {
        ariaValues.push(this.ariaLabelledBy);
      }

      return normalizeAriaAttribute(ariaValues);
    }

    get computedAriaDescribedBy() {
      const ariaValues = [];

      if (this._helpMessage) {
        ariaValues.push(this.computedUniqueHelpElementId);
      } // The toggle type is described by a secondary element


      if (this.isTypeToggle) {
        ariaValues.push(this.computedUniqueToggleElementDescribedById);
      } // merge all date & time arias on mobile since it's displayed as a single field


      if (this.isTypeMobileDateTime) {
        ariaValues.push(this.dateAriaDescribedBy);
        ariaValues.push(this.timeAriaDescribedBy);
      }

      if (this.ariaDescribedBy) {
        ariaValues.push(this.ariaDescribedBy);
      }

      return normalizeAriaAttribute(ariaValues);
    }
    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */


    get tabIndex() {
      return this._tabindex;
    }

    set tabIndex(newValue) {
      this._tabindex = newValue;
    }
    /**
     * Specifies a shortcut key to activate or focus an element.
     * @type {string}
     *
     */


    get accessKey() {
      return this._accesskey;
    }

    set accessKey(newValue) {
      this._accesskey = newValue;
    }

    get isLabelHidden() {
      return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get isLabelStacked() {
      return this.variant === VARIANT.LABEL_STACKED;
    }

    get accesskey() {
      return this._accesskey;
    }

    get internalTabIndex() {
      return this._tabindex;
    }

    get isTypeCheckable() {
      return this.isTypeCheckbox || this.isTypeCheckboxButton || this.isTypeRadio || this.isTypeToggle;
    }

    get colorInputElementValue() {
      return this.validity.valid && this.value ? this.value : DEFAULT_COLOR$1;
    }

    get colorInputStyle() {
      return `background: ${this.value || '#5679C0'};`;
    }

    get computedUniqueHelpElementId() {
      return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get computedUniqueToggleElementDescribedById() {
      if (this.isTypeToggle) {
        const toggle = this.template.querySelector('[data-toggle-description]');
        return getRealDOMId(toggle);
      }

      return null;
    }

    get computedUniqueFormLabelId() {
      if (this.isTypeFile) {
        const formLabel = this.template.querySelector('[data-form-label]');
        return getRealDOMId(formLabel);
      }

      return null;
    }

    get computedUniqueFileSelectorLabelId() {
      if (this.isTypeFile) {
        const fileBodyLabel = this.template.querySelector('[data-file-selector-label]');
        return getRealDOMId(fileBodyLabel);
      }

      return null;
    }

    get computedUniqueFileElementLabelledById() {
      if (this.isTypeFile) {
        const labelIds = [this.computedUniqueFormLabelId, this.computedUniqueFileSelectorLabelId];
        return labelIds.join(' ');
      }

      return null;
    }

    get computedFormElementClass() {
      const classes = classSet('slds-form-element__control slds-grow');

      if (this.isTypeSearch) {
        classes.add('slds-input-has-icon slds-input-has-icon_left-right');
      }

      return classes.toString();
    }

    get i18n() {
      return i18n$a;
    }

    get computedLabelClass() {
      const classnames = classSet('slds-form-element__label');

      if (this.isTypeCheckable || this.isTypeFile) ; else if (this.isTypeToggle) {
        classnames.add('slds-m-bottom_none');
      } else {
        classnames.add('slds-no-flex');
      }

      return classnames.add({
        'slds-assistive-text': this.isLabelHidden
      }).toString();
    }

    get computedNumberClass() {
      return classSet('slds-input').add({
        'slds-is-disabled': this.disabled
      }).toString();
    }

    get computedColorLabelClass() {
      return classSet('slds-color-picker__summary-label').add({
        'slds-assistive-text': this.isLabelHidden
      }).toString();
    }

    get computedCheckboxClass() {
      return classSet('slds-checkbox').add({
        'slds-checkbox_stacked': this.isLabelStacked
      }).toString();
    }

    get normalizedMax() {
      return this.normalizeDateTimeString(this.max);
    }

    get normalizedMin() {
      return this.normalizeDateTimeString(this.min);
    }

    get isTypeNumber() {
      return this.type === 'number';
    }

    get isTypeSearch() {
      return this.type === 'search';
    }

    get isTypeToggle() {
      return this.type === 'toggle';
    }

    get isTypeText() {
      return this.type === 'text';
    }

    get isTypeCheckbox() {
      return this.type === 'checkbox';
    }

    get isTypeRadio() {
      return this.type === 'radio';
    }

    get isTypeCheckboxButton() {
      return this.type === 'checkbox-button';
    }

    get isTypeFile() {
      return this.type === 'file';
    }

    get isTypeColor() {
      return this.type === 'color';
    }

    get isTypeDate() {
      return this.type === 'date';
    }

    get isTypeDateTime() {
      return this.type === 'datetime' || this.type === 'datetime-local';
    }

    get isTypeTime() {
      return this.type === 'time';
    }

    get isTypeMobileDate() {
      return this.isTypeDate && !this.isDesktopBrowser();
    }

    get isTypeDesktopDate() {
      return this.isTypeDate && this.isDesktopBrowser();
    }

    get isTypeMobileDateTime() {
      return this.isTypeDateTime && !this.isDesktopBrowser();
    }

    get isTypeDesktopDateTime() {
      return this.isTypeDateTime && this.isDesktopBrowser();
    }

    get isTypeMobileTime() {
      return this.isTypeTime && !this.isDesktopBrowser();
    }

    get isTypeDesktopTime() {
      return this.isTypeTime && this.isDesktopBrowser();
    }

    get isTypeSimple() {
      return !this.isTypeCheckbox && !this.isTypeCheckboxButton && !this.isTypeToggle && !this.isTypeRadio && !this.isTypeFile && !this.isTypeColor && !this.isTypeDesktopDate && !this.isTypeDesktopDateTime && !this.isTypeDesktopTime;
    }

    get inputElement() {
      if (!this._connected) {
        return undefined;
      }

      if (!this._inputElement || this._inputElementRefreshNeeded) {
        let inputElement;

        if (this.isTypeDesktopDate) {
          inputElement = this.template.querySelector('lightning-datepicker');
        } else if (this.isTypeDesktopDateTime) {
          inputElement = this.template.querySelector('lightning-datetimepicker');
        } else if (this.isTypeDesktopTime) {
          inputElement = this.template.querySelector('lightning-timepicker');
        } else {
          inputElement = this.template.querySelector('input');
        }

        this._inputElementRefreshNeeded = false;
        this._inputElement = inputElement;
      }

      return this._inputElement;
    }

    get nativeInputType() {
      let inputType = 'text';

      if (this.isTypeSimple) {
        inputType = this.type;
      } else if (this.isTypeToggle || this.isTypeCheckboxButton || this.isTypeCheckbox) {
        inputType = 'checkbox';
      } else if (this.isTypeRadio) {
        inputType = 'radio';
      } else if (this.isTypeFile) {
        inputType = 'file';
      } else if (this.isTypeDateTime) {
        inputType = 'datetime-local';
      } else if (this.isTypeTime) {
        inputType = 'time';
      } else if (this.isTypeDate) {
        inputType = 'date';
      }

      return inputType;
    }

    clearAndSetFocusOnInput(clickEvent) {
      this.interactingState.enter();
      this.inputElement.value = '';

      this._updateValueAndValidityAttribute('');

      this.dispatchChangeEventWithDetail({
        value: this._value
      });
      this.inputElement.focus(); // LWC dynamically retargets events for performance reasons. In the case
      // that the original target--in this case, button--is no longer part of
      // the document when a listener receives an event, LWC bails retargeting
      // and returns the original target. By relaying this click, we avoid
      // leaking internals by manually changing the target from the detached
      // button to the host element.

      clickEvent.stopPropagation(); // eslint-disable-next-line lightning-global/no-custom-event-bubbling

      const retargetedEvent = new CustomEvent('click', {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(retargetedEvent);
    }

    dispatchChangeEventWithDetail(detail) {
      this.dispatchEvent(new CustomEvent('change', {
        composed: true,
        bubbles: true,
        detail
      }));
    }

    getFormattedValue(value) {
      if (!this.isTypeNumber) {
        return value;
      }

      if (isEmptyString(value)) {
        return '';
      }

      let formattedValue = value;
      let inputValue = value; // set formatter style & default options

      const formatStyle = this.formatter;
      const formatOptions = {
        style: formatStyle
      }; // Use the min/max fraction digits from the formatFractionDigits provided by the user if available.
      // Otherwise, use the number of digits calculated from step

      if (this.formatFractionDigits !== undefined) {
        formatOptions.minimumFractionDigits = this.formatFractionDigits;
        formatOptions.maximumFractionDigits = this.formatFractionDigits;
      } else if (this._calculatedFractionDigits !== undefined) {
        formatOptions.minimumFractionDigits = this._calculatedFractionDigits;
        formatOptions.maximumFractionDigits = this._calculatedFractionDigits;
      }

      if (formatStyle === 'percent-fixed') {
        // percent-fixed just uses percent format and divides the value by 100
        // before passing to the library, this is to deal with the
        // fact that percentages in salesforce are 0-100, not 0-1
        formatOptions.style = 'percent';
        inputValue = parseFloat(inputValue) / 100;
      }

      try {
        formattedValue = numberFormat(formatOptions).format(inputValue) || this.placeholder || '';
      } catch (ignore) {// ignore any errors
      }

      return formattedValue;
    }

    validateType(type) {
      assert(type !== 'hidden', `<lightning-input> The type attribute value "hidden" is invalid. Use a regular <input type="hidden"> instead.`);
      assert(type !== 'submit' && type !== 'reset' && type !== 'image' && type !== 'button', `<lightning-input> The type attribute value "${type}" is invalid. Use <lightning:button> instead.`);

      if (this.isTypeRadio) {
        assert(!this.required, `<lightning-input> The required attribute is not supported on radio inputs directly. It should be implemented at the radio group level.`);
      }
    }

    validateRequiredAttributes() {
      const {
        label
      } = this;
      assert(typeof label === 'string' && label.length, `<lightning-input> The required label attribute value "${label}" is invalid.`);
    }

    handleFileClick() {
      this.inputElement.value = null;

      this._updateValueAndValidityAttribute(null);
    }

    handleDropFiles(event) {
      // drop doesn't trigger focus nor blur, so set state to interacting
      // and auto leave when there's no more action
      this.interactingState.interacting();
      this.fileUploadedViaDroppableZone = true;
      this._files = event.dataTransfer && event.dataTransfer.files;

      this._updateProxyInputAttributes('required');

      this.dispatchChangeEventWithDetail({
        files: Engine.unwrap(this._files)
      });
    }

    handleFocus() {
      this.interactingState.enter();

      if (this.isTypeColor) {
        this._isColorPickerPanelOpen = false;
      }

      if (this._connected && this.isTypeNumber) {
        this._showFormattedNumber = false;
        this.inputElement.value = this.displayedValue; // The below check is needed due to a bug in Firefox with switching the
        // type to/from 'number'.
        // Remove the check once https://bugzilla.mozilla.org/show_bug.cgi?id=981248 is fixed

        const isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;

        if (isFirefox) {
          if (this.validity.badInput) {
            // reset value manually for Firefox to emulate the behaviour of
            // a native input type number
            this.inputElement.value = '';
          }
        } else {
          this.inputElement.type = 'number';
        }
      }

      this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur(event) {
      this.interactingState.leave();

      if (this._connected && this.isTypeNumber) {
        // Don't need to change type to text and show the formatted number when value is empty.
        // This also fixes the issue where the component resets to empty string when
        // there's invalid value since input in badInput validity state gives us back an empty
        // string instead of the invalid value.
        this._showFormattedNumber = !isEmptyString(this._value);

        if (this._showFormattedNumber) {
          this.inputElement.type = 'text';
          this.inputElement.value = this.displayedValue;
        }
      }

      if (!event.relatedTarget || !this.template.contains(event.relatedTarget)) {
        this.dispatchEvent(new CustomEvent('blur'));
      }
    }

    handleChange(event) {
      event.stopPropagation(); // For text and search we want every character typed to trigger a change event, so we ignore the native
      // input's 'change' event and respond to the 'input' event instead.

      const shouldIgnoreChangeEvent = this.isTypeText || this.isTypeSearch;

      if (shouldIgnoreChangeEvent) {
        return;
      }

      this.dispatchChangeEvent(this.isTypeNumber);
    }

    handleInput(event) {
      event.stopPropagation();

      if (this.isTypeSimple && this.value === event.target.value) {
        return;
      }

      this.dispatchChangeEvent();
    }

    handleKeyPress(event) {
      if (this.isTypeNumber && !this.isFunctionKeyStroke(event) && !this.isValidNumericKeyStroke(event)) {
        event.preventDefault();
      }
    }

    dispatchChangeEvent(ignoreDispatchEvent) {
      this.interactingState.enter();
      const detail = {};

      if (this.isTypeCheckable) {
        this._updateCheckedAndValidityAttribute(this.inputElement.checked);

        detail.checked = this._checked;
      } else if (this.isTypeFile) {
        this._files = this.inputElement.files; // this.template.querySelector returns a proxy, and .files would also be proxied
        // we're unwrapping it here so that native apis can be used on it

        detail.files = Engine.unwrap(this._files);

        this._updateProxyInputAttributes('required');
      }

      if (!this.isTypeCheckable) {
        detail.value = this.inputElement.value;

        if (this.isTypeMobileDateTime) {
          detail.value = normalizeDateTimeToUTC(detail.value, this.timezone);
        } else if (this.isTypeMobileTime) {
          detail.value = normalizeTime(detail.value);
        }

        this._updateValueAndValidityAttribute(detail.value);
      }

      if (!ignoreDispatchEvent) {
        this.dispatchChangeEventWithDetail(detail);
      }
    }

    get _showClearButton() {
      return this.isTypeSearch && this._value !== undefined && this._value !== null && this._value !== '';
    }

    handleColorPickerToggleClick(event) {
      event.preventDefault(); // Don't want error state inside panel

      if (!this.validity.valid) {
        this.inputElement.value = DEFAULT_COLOR$1;

        this._updateValueAndValidityAttribute(DEFAULT_COLOR$1);

        this._helpMessage = null;
        this.classList.remove('slds-has-error');
        this.dispatchChangeEventWithDetail({
          value: DEFAULT_COLOR$1
        });
      }
    }

    handleColorChange(event) {
      const selectedColor = event.detail.color;

      if (selectedColor !== this.inputElement.value) {
        this.inputElement.value = selectedColor;

        this._updateValueAndValidityAttribute(selectedColor);

        this.focus();
        this.dispatchChangeEventWithDetail({
          value: selectedColor
        });
      }

      this.template.querySelector('lightning-primitive-colorpicker-button').focus();
    }

    isNonPrintableKeyStroke(keyCode) {
      return Object.keys(keyCodes).some(code => keyCodes[code] === keyCode);
    }

    isFunctionKeyStroke(event) {
      return event.ctrlKey || event.metaKey || this.isNonPrintableKeyStroke(event.keyCode);
    }

    isValidNumericKeyStroke(event) {
      return /^[0-9eE.,+-]$/.test(event.key);
    }

    isDesktopBrowser() {
      return getFormFactor() === 'DESKTOP';
    }

    normalizeDateTimeString(value) {
      let result = value;

      if (this.isTypeDate) {
        result = normalizeDate(value);
      } else if (this.isTypeTime) {
        result = normalizeTime(value);
      } else if (this.isTypeDateTime) {
        result = normalizeUTCDateTime(value, this.timezone);
      }

      return result;
    }

    get displayedValue() {
      if (this.isTypeNumber && this._showFormattedNumber) {
        return this.getFormattedValue(this._value);
      }

      if (this.isTypeSimple) {
        return this.normalizeDateTimeString(this._value);
      }

      return this._value;
    }

    get _internalType() {
      if (this.isTypeNumber) {
        return 'text';
      }

      return this._type;
    }

    _updateValueAndValidityAttribute(value) {
      this._value = value;

      this._updateProxyInputAttributes('value');
    }

    _updateCheckedAndValidityAttribute(value) {
      this._checked = value;

      this._updateProxyInputAttributes('checked');
    }

    _calculateFractionDigitsFromStep(step) {
      // clear any previous value if set
      this._calculatedFractionDigits = undefined;

      if (step && step !== 'any') {
        let numDecimals = 0; // calculate number of decimals using step

        const decimals = String(step).split('.')[1]; // we're parsing the decimals to account for cases where the step is
        // '1.0'

        if (decimals && parseInt(decimals, 10) > 0) {
          numDecimals = decimals.length;
        }

        this._calculatedFractionDigits = numDecimals;
      }
    }

    get _ignoreRequired() {
      // If uploading via the drop zone or via the input directly, we should
      // ignore the required flag as a file has been uploaded
      return this.isTypeFile && this._required && (this.fileUploadedViaDroppableZone || this._files && this._files.length > 0);
    }

    _updateProxyInputAttributes(attributes) {
      if (this._constraintApiProxyInputUpdater) {
        this._constraintApiProxyInputUpdater(attributes);
      }
    }

    get _constraint() {
      if (!this._constraintApi) {
        const overrides = {
          badInput: () => {
            if (!this._connected) {
              return false;
            }

            if (this.isTypeNumber && this.getFormattedValue(this._value) === 'NaN') {
              return true;
            }

            return this.inputElement.validity.badInput;
          },
          tooLong: () => // since type=number is type=text in the dom when not in focus
          // we should always return false as maxlength doesn't apply
          !this.isTypeNumber && this._connected && this.inputElement.validity.tooLong,
          tooShort: () => // since type=number is type=text in the dom when not in focus
          // we should always return false as minlength doesn't apply
          !this.isTypeNumber && this._connected && this.inputElement.validity.tooShort,
          patternMismatch: () => this._connected && this.inputElement.validity.patternMismatch
        }; // FF, IE and Safari don't support datetime-local,
        // IE and Safari don't support time
        // we need to defer to the base component to check rangeOverflow/rangeUnderflow.
        // Due to the custom override, changing the type to or from datetime/time would affect the validation

        if (this.isTypeDesktopDateTime || this.isTypeDesktopTime) {
          overrides.rangeOverflow = () => this._connected && this.inputElement.validity.rangeOverflow;

          overrides.rangeUnderflow = () => this._connected && this.inputElement.validity.rangeUnderflow;
        }

        this._constraintApi = new FieldConstraintApiWithProxyInput(() => this, overrides);
        this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes({
          type: () => this.nativeInputType,
          // We need to normalize value so that it's consumable by the proxy input (otherwise the value
          // will be invalid for the native input)
          value: () => this.normalizeDateTimeString(this.value),
          checked: () => this.checked,
          maxlength: () => this.maxLength,
          minlength: () => this.minLength,
          // 'pattern' depends on type
          pattern: () => this.pattern,
          // 'max' and 'min' depend on type and timezone
          max: () => this.normalizedMax,
          min: () => this.normalizedMin,
          step: () => this.step,
          accept: () => this.accept,
          multiple: () => this.multiple,
          disabled: () => this.disabled,
          readonly: () => this.readOnly,
          // depends on type and whether an upload has been made
          required: () => this.required && !this._ignoreRequired
        });
      }

      return this._constraintApi;
    }

  }

  Engine.registerDecorators(LightningInput, {
    publicProps: {
      placeholder: {
        config: 0
      },
      name: {
        config: 0
      },
      label: {
        config: 0
      },
      formatFractionDigits: {
        config: 0
      },
      messageWhenBadInput: {
        config: 0
      },
      messageWhenPatternMismatch: {
        config: 0
      },
      messageWhenRangeOverflow: {
        config: 0
      },
      messageWhenRangeUnderflow: {
        config: 0
      },
      messageWhenStepMismatch: {
        config: 0
      },
      messageWhenTooShort: {
        config: 0
      },
      messageWhenTooLong: {
        config: 0
      },
      messageWhenTypeMismatch: {
        config: 0
      },
      messageWhenValueMissing: {
        config: 0
      },
      messageToggleActive: {
        config: 0
      },
      messageToggleInactive: {
        config: 0
      },
      ariaLabel: {
        config: 0
      },
      timeAriaControls: {
        config: 3
      },
      dateAriaLabel: {
        config: 0
      },
      dateAriaLabelledBy: {
        config: 3
      },
      timeAriaLabelledBy: {
        config: 3
      },
      timeAriaDescribedBy: {
        config: 3
      },
      dateAriaControls: {
        config: 3
      },
      dateAriaDescribedBy: {
        config: 3
      },
      ariaControls: {
        config: 3
      },
      ariaLabelledBy: {
        config: 3
      },
      ariaDescribedBy: {
        config: 3
      },
      formatter: {
        config: 3
      },
      type: {
        config: 3
      },
      isLoading: {
        config: 3
      },
      pattern: {
        config: 3
      },
      maxLength: {
        config: 3
      },
      accept: {
        config: 3
      },
      minLength: {
        config: 3
      },
      max: {
        config: 3
      },
      min: {
        config: 3
      },
      step: {
        config: 3
      },
      checked: {
        config: 3
      },
      multiple: {
        config: 3
      },
      value: {
        config: 3
      },
      variant: {
        config: 3
      },
      disabled: {
        config: 3
      },
      readOnly: {
        config: 3
      },
      required: {
        config: 3
      },
      timezone: {
        config: 3
      },
      files: {
        config: 1
      },
      validity: {
        config: 1
      },
      fieldLevelHelp: {
        config: 3
      },
      tabIndex: {
        config: 3
      },
      accessKey: {
        config: 3
      }
    },
    publicMethods: ["checkValidity", "setCustomValidity", "reportValidity", "focus", "blur", "showHelpMessageIfInvalid"],
    track: {
      _timeAriaDescribedBy: 1,
      _timeAriaLabelledBy: 1,
      _timeAriaControls: 1,
      _dateAriaControls: 1,
      _dateAriaDescribedBy: 1,
      _dateAriaLabelledBy: 1,
      _value: 1,
      _type: 1,
      _pattern: 1,
      _max: 1,
      _min: 1,
      _step: 1,
      _disabled: 1,
      _readOnly: 1,
      _required: 1,
      _checked: 1,
      _formatter: 1,
      _isLoading: 1,
      _multiple: 1,
      _timezone: 1,
      _helpMessage: 1,
      _isColorPickerPanelOpen: 1,
      _fieldLevelHelp: 1,
      _accesskey: 1,
      _tabindex: 1,
      _maxLength: 1,
      _minLength: 1,
      _accept: 1,
      _variant: 1,
      _connected: 1
    }
  });

  var input = Engine.registerComponent(LightningInput, {
    tmpl: _tmpl$l
  });
  LightningInput.interopMap = {
    exposeNativeEvent: {
      change: true,
      focus: true,
      blur: true
    }
  };

  function tmpl$k($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      h: api_element,
      t: api_text,
      gid: api_scoped_id
    } = $api;
    return [api_element("div", {
      classMap: {
        "slds-box": true,
        "slds-theme_shade": true,
        "slds-m-around_large": true
      },
      key: 2
    }, [api_element("div", {
      classMap: {
        "slds-form": true,
        "slds-form_stacked": true
      },
      key: 3
    }, [api_element("fieldset", {
      classMap: {
        "slds-form-element": true
      },
      key: 4
    }, [api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 5
    }, [api_custom_element("lightning-radio-group", radioGroup, {
      props: {
        "name": "radioGroup",
        "label": $cmp.question.question__c,
        "options": $cmp.options,
        "value": $cmp.value,
        "type": "radio"
      },
      key: 6
    }, [])])]), api_element("div", {
      classMap: {
        "slds-form-element": true
      },
      key: 7
    }, [api_element("label", {
      classMap: {
        "slds-form-element__label": true,
        "slds-assistive-text": true
      },
      attrs: {
        "for": `${api_scoped_id("comments")}`
      },
      key: 8
    }, [api_text("Please add any further comments")]), api_element("div", {
      classMap: {
        "slds-form-element__control": true
      },
      key: 9
    }, [api_custom_element("lightning-input", input, {
      props: {
        "type": "text",
        "label": "Comments",
        "name": "comments",
        "value": $cmp.comments,
        "placeholder": "Please add any further comments"
      },
      key: 10
    }, [])])])])])];
  }

  var _tmpl$m = Engine.registerTemplate(tmpl$k);
  tmpl$k.stylesheets = [];
  tmpl$k.stylesheetTokens = {
    hostAttribute: "c-questionnaireAnswer_questionnaireAnswer-host",
    shadowAttribute: "c-questionnaireAnswer_questionnaireAnswer"
  };

  class QuestionnaireAnswer extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.question = void 0;
      this.comments = void 0;
      this.value = '';
    }

    get options() {
      return [{
        'label': 'Strongly Disagree',
        'value': 'Strongly Disagree'
      }, {
        'label': 'Disagree',
        'value': 'Disagree'
      }, {
        'label': 'Undecided',
        'value': 'Undecided'
      }, {
        'label': 'Agree',
        'value': 'Agree'
      }, {
        'label': 'Strongly Agree',
        'value': 'Strongly Agree'
      }];
    }

  }

  Engine.registerDecorators(QuestionnaireAnswer, {
    publicProps: {
      question: {
        config: 0
      }
    },
    track: {
      comments: 1,
      value: 1
    }
  });

  var questionnaireAnswer = Engine.registerComponent(QuestionnaireAnswer, {
    tmpl: _tmpl$m
  });

  function tmpl$l($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element,
      d: api_dynamic,
      gid: api_scoped_id,
      b: api_bind,
      h: api_element
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return [api_element("button", {
      className: $cmp.computedButtonClass,
      attrs: {
        "name": $cmp.name,
        "accesskey": $cmp.computedAccessKey,
        "title": $cmp.computedTitle,
        "type": $cmp.normalizedType,
        "value": $cmp.value,
        "aria-describedby": api_scoped_id($cmp.computedAriaDescribedBy),
        "aria-label": $cmp.computedAriaLabel,
        "aria-controls": api_scoped_id($cmp.computedAriaControls),
        "aria-expanded": $cmp.computedAriaExpanded,
        "aria-live": $cmp.computedAriaLive,
        "aria-atomic": $cmp.computedAriaAtomic
      },
      props: {
        "disabled": $cmp.disabled
      },
      key: 2,
      on: {
        "focus": _m0 || ($ctx._m0 = api_bind($cmp.handleButtonFocus)),
        "blur": _m1 || ($ctx._m1 = api_bind($cmp.handleButtonBlur))
      }
    }, [$cmp.showIconLeft ? api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": $cmp.iconName,
        "svgClass": $cmp.computedIconClass,
        "variant": "bare"
      },
      key: 4
    }, []) : null, api_dynamic($cmp.label), $cmp.showIconRight ? api_custom_element("lightning-primitive-icon", primitiveIcon, {
      props: {
        "iconName": $cmp.iconName,
        "svgClass": $cmp.computedIconClass,
        "variant": "bare"
      },
      key: 6
    }, []) : null])];
  }

  var _tmpl$n = Engine.registerTemplate(tmpl$l);
  tmpl$l.stylesheets = [];
  tmpl$l.stylesheetTokens = {
    hostAttribute: "lightning-button_button-host",
    shadowAttribute: "lightning-button_button"
  };

  /**
   * A clickable element used to perform an action.
   */

  class LightningButton extends primitiveButton {
    constructor(...args) {
      super(...args);
      this.name = void 0;
      this.value = void 0;
      this.label = void 0;
      this.variant = 'neutral';
      this.iconName = void 0;
      this.iconPosition = 'left';
      this.type = 'button';
      this.title = null;
      this._order = null;
      this._id = null;
    }

    render() {
      return _tmpl$n;
    }

    get computedButtonClass() {
      return classSet('slds-button').add({
        'slds-button_neutral': this.normalizedVariant === 'neutral',
        'slds-button_brand': this.normalizedVariant === 'brand',
        'slds-button_destructive': this.normalizedVariant === 'destructive',
        'slds-button_inverse': this.normalizedVariant === 'inverse',
        'slds-button_success': this.normalizedVariant === 'success',
        'slds-button_first': this._order === 'first',
        'slds-button_middle': this._order === 'middle',
        'slds-button_last': this._order === 'last'
      }).toString();
    }

    get computedTitle() {
      return this.title;
    }

    get normalizedVariant() {
      return normalizeString(this.variant, {
        fallbackValue: 'neutral',
        validValues: ['base', 'neutral', 'brand', 'destructive', 'inverse', 'success']
      });
    }

    get normalizedType() {
      return normalizeString(this.type, {
        fallbackValue: 'button',
        validValues: ['button', 'reset', 'submit']
      });
    }

    get normalizedIconPosition() {
      return normalizeString(this.iconPosition, {
        fallbackValue: 'left',
        validValues: ['left', 'right']
      });
    }

    get showIconLeft() {
      return this.iconName && this.normalizedIconPosition === 'left';
    }

    get showIconRight() {
      return this.iconName && this.normalizedIconPosition === 'right';
    }

    get computedIconClass() {
      return classSet('slds-button__icon').add({
        'slds-button__icon_left': this.normalizedIconPosition === 'left',
        'slds-button__icon_right': this.normalizedIconPosition === 'right'
      }).toString();
    }

    handleButtonFocus() {
      this.dispatchEvent(new CustomEvent('focus'));
    }

    handleButtonBlur() {
      this.dispatchEvent(new CustomEvent('blur'));
    }
    /**
     * Sets focus on the button.
     */


    focus() {
      this.template.querySelector('button').focus();
    }
    /**
     * {Function} setOrder - Sets the order value of the button when in the context of a button-group or other ordered component
     * @param {String} order -  The order string (first, middle, last)
     */


    setOrder(order) {
      this._order = order;
    }
    /**
     * Once we are connected, we fire a register event so the button-group (or other) component can register
     * the buttons.
     */


    connectedCallback() {
      const privatebuttonregister = new CustomEvent('privatebuttonregister', {
        bubbles: true,
        detail: {
          callbacks: {
            setOrder: this.setOrder.bind(this),
            setDeRegistrationCallback: deRegistrationCallback => {
              this._deRegistrationCallback = deRegistrationCallback;
            }
          }
        }
      });
      this.dispatchEvent(privatebuttonregister);
    }

    disconnectedCallback() {
      if (this._deRegistrationCallback) {
        this._deRegistrationCallback();
      }
    }

  }

  LightningButton.delegatesFocus = true;

  Engine.registerDecorators(LightningButton, {
    publicProps: {
      name: {
        config: 0
      },
      value: {
        config: 0
      },
      label: {
        config: 0
      },
      variant: {
        config: 0
      },
      iconName: {
        config: 0
      },
      iconPosition: {
        config: 0
      },
      type: {
        config: 0
      }
    },
    publicMethods: ["focus"],
    track: {
      title: 1,
      _order: 1
    }
  });

  var button = Engine.registerComponent(LightningButton, {
    tmpl: _tmpl$n
  });
  LightningButton.interopMap = {
    exposeNativeEvent: {
      click: true,
      focus: true,
      blur: true
    }
  };

  function tmpl$m($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      h: api_element,
      k: api_key,
      c: api_custom_element,
      i: api_iterator,
      b: api_bind,
      f: api_flatten
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return api_flatten([api_element("h2", {
      classMap: {
        "slds-text-align--center": true,
        "slds-text-heading--large": true,
        "slds-m-around--large": true
      },
      key: 2
    }, [api_dynamic($cmp.json.Title)]), api_iterator($cmp.json.questions, function (question) {
      return api_custom_element("c-questionnaire-answer", questionnaireAnswer, {
        props: {
          "question": question
        },
        key: api_key(4, question.name)
      }, []);
    }), api_element("div", {
      classMap: {
        "slds-box": true,
        "slds-m-around_x-small": true
      },
      key: 5
    }, [api_element("div", {
      classMap: {
        "slds-grid": true,
        "slds-wrap": true
      },
      key: 6
    }, [api_element("div", {
      classMap: {
        "slds-size_1-of-3": true
      },
      key: 7
    }, [api_element("span", {
      classMap: {
        "slds-checkbox": true
      },
      key: 8
    }, [api_custom_element("lightning-input", input, {
      props: {
        "label": "I accept the terms of use and participation in this questionnaire",
        "type": "checkbox",
        "value": $cmp.termsConditions
      },
      key: 9,
      on: {
        "change": _m0 || ($ctx._m0 = api_bind($cmp.handleChangeTermsConditions))
      }
    }, [])])]), api_element("div", {
      classMap: {
        "slds-size_2-of-3": true
      },
      key: 10
    }, [api_element("div", {
      classMap: {
        "slds-text-align_right": true
      },
      key: 11
    }, [api_custom_element("lightning-button", button, {
      classMap: {
        "slds-m-left": true
      },
      props: {
        "variant": "brand",
        "label": "Mark Complete",
        "title": "Mark Complete",
        "iconName": "utility:download"
      },
      key: 12
    }, []), api_custom_element("lightning-button", button, {
      classMap: {
        "slds-m-left_medium": true
      },
      props: {
        "variant": "brand",
        "label": "Close",
        "title": "Close",
        "iconName": "utility:close"
      },
      key: 13,
      on: {
        "click": _m1 || ($ctx._m1 = api_bind($cmp.closeQuestionnaire))
      }
    }, [])])])])])]);
  }

  var _tmpl$o = Engine.registerTemplate(tmpl$m);
  tmpl$m.stylesheets = [];
  tmpl$m.stylesheetTokens = {
    hostAttribute: "c-questionnaire_questionnaire-host",
    shadowAttribute: "c-questionnaire_questionnaire"
  };

  class Questionnaire extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.json = {
        "Title": "UAT Evaluation",
        "questions": [{
          "name": "QUEST-0001",
          "question__c": "1. I didn't experience issues in my database related to the performance of software, hardware or network.",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }, {
          "name": "QUEST-0001",
          "question__c": "2. The combination of the UPK \"Try It\" mode and the business processes will be sufficient documentation for me to perform my day to day activities after the upgrade is complete",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }, {
          "name": "QUEST-0001",
          "question__c": "3. The tests conducted during UAT and in homework were representative of the major business processes my institution will perform on a recurring basis.",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }, {
          "name": "QUEST-0001",
          "question__c": "4. I didn't experience issues in my database related to the performance of software, hardware or network.",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }, {
          "name": "QUEST-0001",
          "question__c": "5. I didn't experience issues in my database related to the performance of software, hardware or network.",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }, {
          "name": "QUEST-0001",
          "question__c": "6. I didn't experience issues in my database related to the performance of software, hardware or network.",
          "help_text__c": "This question relates to the main database as well as the CMS connector.",
          "options": "AgreeValues",
          "comment_available__c": "Yes"
        }]
      };
      this.termsConditions = false;
    }

    handleChangeTermsConditions(event) {
      this.termsConditions = event.target.value;
    }

    get options() {
      return [{
        label: 'Strongly Disagree',
        value: 'Strongly Disagree'
      }, {
        label: 'Disagree',
        value: 'Disagree'
      }, {
        label: 'No Opinion',
        value: 'No Opinion'
      }, {
        label: 'Agree',
        value: 'Agree'
      }, {
        label: 'Strongly Agree',
        value: 'Strongly Agree'
      }];
    }

    closeQuestionnaire() {
      this.dispatchEvent(new CustomEvent('close'));
    }

  }

  Engine.registerDecorators(Questionnaire, {
    track: {
      termsConditions: 1
    }
  });

  var questionnaire = Engine.registerComponent(Questionnaire, {
    tmpl: _tmpl$o
  });

  function tmpl$n($api, $cmp, $slotset, $ctx) {
    const {
      d: api_dynamic,
      h: api_element,
      k: api_key,
      b: api_bind,
      c: api_custom_element,
      i: api_iterator,
      f: api_flatten
    } = $api;
    const {
      _m0,
      _m1
    } = $ctx;
    return api_flatten([!$cmp.showQuestionnaire ? api_element("h2", {
      classMap: {
        "slds-text-align--center": true,
        "slds-text-heading--large": true,
        "slds-m-around--large": true
      },
      key: 2
    }, [api_dynamic($cmp.json.pageTitle)]) : null, api_iterator($cmp.json.questionnaires, function (questionnaire$$1) {
      return !$cmp.showQuestionnaire ? api_custom_element("c-questionnaire-card", questionnaireCard, {
        props: {
          "questionnaire": questionnaire$$1
        },
        key: api_key(4, questionnaire$$1.name),
        on: {
          "selected": _m0 || ($ctx._m0 = api_bind($cmp.openQuestionnaire))
        }
      }, []) : null;
    }), $cmp.showQuestionnaire ? api_custom_element("c-questionnaire", questionnaire, {
      key: 5,
      on: {
        "close": _m1 || ($ctx._m1 = api_bind($cmp.closeQuestionnaire))
      }
    }, []) : null]);
  }

  var _tmpl$p = Engine.registerTemplate(tmpl$n);
  tmpl$n.stylesheets = [];
  tmpl$n.stylesheetTokens = {
    hostAttribute: "c-questionnaireList_questionnaireList-host",
    shadowAttribute: "c-questionnaireList_questionnaireList"
  };

  class QuestionnaireList extends Engine.LightningElement {
    constructor(...args) {
      super(...args);
      this.json = {
        "pageTitle": "Questionnaires",
        "questionnaires": [{
          "name": "UAT Evaluation",
          "description__c": "Customer - Direct",
          "due_date__c": "11-04-2017",
          "status__c": "Not Started",
          "cardtheme": "slds-card__footer slds-theme_inverse",
          "icontheme": "slds-icon-standard-bot",
          "questions__c": "10",
          "questions_mandatory__c": "8",
          "answers__c": "6",
          "status-theme__c": "info"
        }, {
          "name": "Big Sky Inc Project",
          "description__c": "Customer - Direct",
          "due_date__c": "11-08-2017",
          "status__c": "Not Submitted",
          "cardtheme": "slds-card__footer slds-theme_warning",
          "icontheme": "slds-icon-custom-custom18",
          "questions__c": "10",
          "questions_mandatory__c": "8",
          "answers__c": "6",
          "status-theme__c": "info"
        }, {
          "name": "Edge Communications Data Cleanse Project Evaluation",
          "description__c": "Customer - Direct",
          "due_date__c": "11-11-2017",
          "status__c": "Submitted",
          "cardtheme": "slds-card__footer",
          "icontheme": "slds-icon-standard-opportunity",
          "questions__c": "10",
          "questions_mandatory__c": "8",
          "answers__c": "6",
          "status-theme__c": "success"
        }]
      };
      this.showQuestionnaire = void 0;
    }

    openQuestionnaire(event) {
      const questionnaireId = event.detail;
      this.selectedQuestionnaireId = questionnaireId;
      this.showQuestionnaire = true;
    }

    closeQuestionnaire(event) {
      this.selectedQuestionnaireId = '';
      this.showQuestionnaire = false;
    }

  }

  Engine.registerDecorators(QuestionnaireList, {
    track: {
      showQuestionnaire: 1
    }
  });

  var questionnaireList = Engine.registerComponent(QuestionnaireList, {
    tmpl: _tmpl$p
  });

  function tmpl$o($api, $cmp, $slotset, $ctx) {
    const {
      c: api_custom_element
    } = $api;
    return [api_custom_element("c-questionnaire-list", questionnaireList, {
      key: 2
    }, [])];
  }

  var _tmpl$q = Engine.registerTemplate(tmpl$o);
  tmpl$o.stylesheets = [];
  tmpl$o.stylesheetTokens = {
    hostAttribute: "c-app_app-host",
    shadowAttribute: "c-app_app"
  };

  class App extends Engine.LightningElement {}

  var app = Engine.registerComponent(App, {
    tmpl: _tmpl$q
  });

  const element = Engine.createElement('c-app', { is: app });
  document.body.appendChild(element);

}(Engine));
