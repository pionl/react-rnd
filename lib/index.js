'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _reactResizableBox = require('react-resizable-box');

var _reactResizableBox2 = _interopRequireDefault(_reactResizableBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boxStyle = {
  width: 'auto',
  height: 'auto',
  cursor: 'move',
  display: 'inline-block',
  position: 'absolute'
};

var Rnd = function (_Component) {
  (0, _inherits3.default)(Rnd, _Component);

  function Rnd(props) {
    (0, _classCallCheck3.default)(this, Rnd);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Rnd.__proto__ || (0, _getPrototypeOf2.default)(Rnd)).call(this, props));

    _this.state = {
      disableDragging: false,
      z: props.z,
      original: {
        x: props.default.x || 0,
        y: props.default.y || 0
      },
      bounds: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      maxWidth: props.maxWidth,
      maxHeight: props.maxHeight
    };
    _this.onResizeStart = _this.onResizeStart.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    _this.onResizeStop = _this.onResizeStop.bind(_this);
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.onDrag = _this.onDrag.bind(_this);
    _this.onDragStop = _this.onDragStop.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Rnd, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.z === nextProps.z) return;
      this.setState({
        z: nextProps.z
      });
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e, data) {
      if (this.props.onDragStart) {
        this.props.onDragStart(e, data);
      }
      if (!this.props.bounds) return;
      var parent = this.wrapper && this.wrapper.parentNode;
      var target = this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
      if (!(target instanceof HTMLElement) || !(parent instanceof HTMLElement)) return;
      var targetRect = target.getBoundingClientRect();
      var targetLeft = targetRect.left;
      var targetTop = targetRect.top;
      var parentRect = parent.getBoundingClientRect();
      var parentLeft = parentRect.left;
      var parentTop = parentRect.top;
      var left = targetLeft - parentLeft;
      var top = targetTop - parentTop;
      this.setState({
        bounds: {
          top: top,
          right: left + (target.offsetWidth - this.resizable.size.width),
          bottom: top + (target.offsetHeight - this.resizable.size.height),
          left: left
        }
      });
    }
  }, {
    key: 'onDrag',
    value: function onDrag(e, data) {
      if (this.props.onDrag) {
        this.props.onDrag(e, data);
      }
    }
  }, {
    key: 'onDragStop',
    value: function onDragStop(e, data) {
      if (this.props.onDragStop) {
        this.props.onDragStop(e, data);
      }
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart(e, dir, refToResizableElement) {
      e.stopPropagation();
      this.setState({
        disableDragging: true,
        original: { x: this.draggable.state.x, y: this.draggable.state.y }
      });
      if (this.props.bounds) {
        var parent = this.wrapper && this.wrapper.parentNode;
        var target = this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
        var self = this.wrapper;
        if (target instanceof HTMLElement && parent instanceof HTMLElement) {
          var selfRect = self.getBoundingClientRect();
          var selfLeft = selfRect.left;
          var selfTop = selfRect.top;
          var targetRect = target.getBoundingClientRect();
          var targetLeft = targetRect.left;
          var targetTop = targetRect.top;
          if (/left/i.test(dir)) {
            var max = selfLeft - targetLeft + this.resizable.size.width;
            this.setState({ maxWidth: max > this.props.maxWidth ? this.props.maxWidth : max });
          }
          if (/right/i.test(dir)) {
            var _max = target.offsetWidth + (targetLeft - selfLeft);
            this.setState({
              maxWidth: _max > (this.props.maxWidth || Infinity) ? this.props.maxWidth : _max
            });
          }
          if (/top/i.test(dir)) {
            var _max2 = selfTop - targetTop + this.resizable.size.height;
            this.setState({ maxHeight: _max2 > this.props.maxHeight ? this.props.maxHeight : _max2 });
          }
          if (/bottom/i.test(dir)) {
            var _max3 = target.offsetHeight + (targetTop - selfTop);
            this.setState({
              maxHeight: _max3 > (this.props.maxHeight || Infinity) ? this.props.maxHeight : _max3
            });
          }
        }
      } else {
        this.setState({ maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight });
      }
      if (this.props.onResizeStart) {
        this.props.onResizeStart(e, dir, refToResizableElement);
      }
    }
  }, {
    key: 'onResize',
    value: function onResize(e, direction, refToResizableElement, delta) {
      var parentLeft = 0;
      var selfLeft = 0;
      var parentTop = 0;
      var selfTop = 0;
      if (this.props.bounds) {
        var parent = this.wrapper && this.wrapper.parentNode;
        var target = this.props.bounds === 'parent' ? parent : document.querySelector(this.props.bounds);
        var self = this.wrapper;
        if (target instanceof HTMLElement && parent instanceof HTMLElement) {
          var selfRect = self.getBoundingClientRect();
          var parentRect = parent.getBoundingClientRect();
          selfLeft = selfRect.left;
          selfTop = selfRect.top;
          parentLeft = parentRect.left;
          parentTop = parentRect.top;
        }
      }
      if (/left/i.test(direction)) {
        var _x = selfLeft >= parentLeft ? this.state.original.x - delta.width : parentLeft - selfLeft;
        this.draggable.setState({ x: _x });
      }
      if (/top/i.test(direction)) {
        var _y = selfTop >= parentTop ? this.state.original.y - delta.height : parentTop - selfTop;
        this.draggable.setState({ y: _y });
      }
      if (this.props.onResize) {
        this.props.onResize(e, direction, refToResizableElement, delta, {
          x: this.draggable.state.x,
          y: this.draggable.state.y
        });
      }
    }
  }, {
    key: 'onResizeStop',
    value: function onResizeStop(e, direction, refToResizableElement, delta) {
      this.setState({ disableDragging: false });
      if (this.props.onResizeStop) {
        this.props.onResizeStop(e, direction, refToResizableElement, delta, {
          x: this.draggable.state.x,
          y: this.draggable.state.y
        });
      }
    }
  }, {
    key: 'updateSize',
    value: function updateSize(size) {
      this.resizable.updateSize({ width: size.width, height: size.height });
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(position) {
      this.draggable.setState(position);
    }
  }, {
    key: 'updateZIndex',
    value: function updateZIndex(z) {
      this.setState({ z: z });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var cursorStyle = this.props.disableDragging ? { cursor: 'normal' } : {};
      var innerStyle = (0, _extends3.default)({}, boxStyle, {
        zIndex: this.state.z
      }, cursorStyle);

      return _react2.default.createElement(
        _reactDraggable2.default,
        {
          ref: function ref(c) {
            _this2.draggable = c;
          },
          handle: this.props.dragHandlerClassName,
          defaultPosition: { x: this.props.default.x, y: this.props.default.y },
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop,
          axis: this.props.dragAxis,
          disabled: this.props.disableDragging,
          grid: this.props.dragGrid,
          bounds: this.props.bounds ? this.state.bounds : undefined
        },
        _react2.default.createElement(
          'div',
          (0, _extends3.default)({
            className: this.props.className,
            style: innerStyle,
            ref: function ref(c) {
              _this2.wrapper = c;
            }
          }, this.props.extendsProps),
          _react2.default.createElement(
            _reactResizableBox2.default,
            {
              ref: function ref(c) {
                _this2.resizable = c;
              },
              enable: this.props.enableResizing,
              onResizeStart: this.onResizeStart,
              onResize: this.onResize,
              onResizeStop: this.onResizeStop,
              style: this.props.style,
              width: this.props.default.width,
              height: this.props.default.height,
              minWidth: this.props.minWidth,
              minHeight: this.props.minHeight,
              maxWidth: this.state.maxWidth,
              maxHeight: this.state.maxHeight,
              grid: this.props.resizeGrid,
              lockAspectRatio: this.props.lockAspectRatio,
              handlerStyles: this.props.resizeHandlerStyles,
              handlerClasses: this.props.resizeHandlerClasses
            },
            this.props.children
          )
        )
      );
    }
  }]);
  return Rnd;
}(_react.Component);

exports.default = Rnd;