'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require('sinon');

var _enzyme = require('enzyme');

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mouseMove = function mouseMove(x, y) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousemove', true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

var mouseUp = function mouseUp(x, y) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

describe('rbd', function () {
  beforeEach(function () {
    var div = document.createElement('div');
    document.body.appendChild(div);
  });

  describe('mount', function () {
    it('should mount without error', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, { 'default': { x: 100, y: 100, width: 100, height: 100 } }));
      (0, _assert2.default)(!!rnd);
    });
  });

  describe('props', function () {
    it('Should custom class name be applied to box', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        className: 'custom-class-name',
        'default': { x: 100, y: 100, width: 100, height: 100 }
      }));
      (0, _assert2.default)(rnd.getDOMNode().classList.contains('custom-class-name'));
    });

    it('Should set handler className', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        'default': { x: 100, y: 100, width: 100, height: 100 },
        resizeHandlerClasses: {
          top: 'handler',
          right: 'handler',
          bottom: 'handler',
          left: 'handler',
          topRight: 'handler',
          bottomRight: 'handler',
          bottomLeft: 'handler',
          topLeft: 'handler'
        }
      }));
      var handlers = rnd.find('.handler');
      _assert2.default.equal(handlers.length, 8);
    });

    it('Should not render resizer when enable props all false', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        'default': { x: 100, y: 100, width: 100, height: 100 },
        enableResizing: {
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        },
        resizeHandlerClasses: {
          top: 'handler',
          right: 'handler',
          bottom: 'handler',
          left: 'handler',
          topRight: 'handler',
          bottomRight: 'handler',
          bottomLeft: 'handler',
          topLeft: 'handler'
        }
      }));
      var handlers = rnd.find('.handler');
      _assert2.default.equal(handlers.length, 0);
    });
  });

  describe('drag', function () {
    describe('callcack', function () {
      it('should call onDragStart when start dragging', function () {
        var onDragStart = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          onDragStart: onDragStart
        }));
        rnd.find('div').at(0).simulate('mousedown');
        _assert2.default.equal(onDragStart.callCount, 1);
        _assert2.default.equal(onDragStart.firstCall.args[0].type, 'mousedown');
        _assert2.default.equal(onDragStart.firstCall.args[1].x, 100);
        _assert2.default.equal(onDragStart.firstCall.args[1].y, 100);
      });

      it('should call onDrag when dragging', function () {
        var onDrag = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          onDrag: onDrag
        }));
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onDrag.callCount, 1);
        _assert2.default.equal(onDrag.firstCall.args[1].x, 300);
        _assert2.default.equal(onDrag.firstCall.args[1].y, 320);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(300px, 320px)'), -1);
      });

      it('should call onDragStop when drag stop', function () {
        var onDragStop = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          onDragStop: onDragStop
        }));
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        mouseUp(100, 120);
        _assert2.default.equal(onDragStop.callCount, 1);
        _assert2.default.equal(onDragStop.firstCall.args[1].x, 200);
        _assert2.default.equal(onDragStop.firstCall.args[1].y, 220);
      });
    });

    describe('axis', function () {
      it('should dragging disabled when axis equals none', function () {
        var onDrag = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          onDrag: onDrag,
          dragAxis: 'none',
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onDrag.callCount, 1);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(100px, 100px)'), -1);
      });

      it('should enable dragging only x when axis equals x', function () {
        var onDrag = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          onDrag: onDrag,
          dragAxis: 'x',
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onDrag.callCount, 1);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(300px, 100px)'), -1);
      });

      it('should enable dragging only y when axis equals y', function () {
        var onDrag = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          onDrag: onDrag,
          dragAxis: 'y',
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onDrag.callCount, 1);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(100px, 320px)'), -1);
      });

      it('should enable dragging both x & y when axis equals both', function () {
        var onDrag = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          onDrag: onDrag,
          dragAxis: 'both',
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onDrag.callCount, 1);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(300px, 320px)'), -1);
      });
    });

    describe('grid', function () {
      it('should snap when dragging smaller than threshold', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          dragGrid: [30, 100],
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(14, 49);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(100px, 100px)'), -1);
      });

      it('should snap when dragging larger than threshold', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          dragGrid: [30, 100],
          'default': { x: 100, y: 100, width: 100, height: 100 }
        }), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(15, 50);
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(130px, 200px)'), -1);
      });
    });

    describe('bounds', function () {
      it('should limit position by parent bounds', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(
          'div',
          { style: { width: '800px', height: '600px' } },
          _react2.default.createElement(_2.default, {
            bounds: 'parent',
            'default': { x: 0, y: 0, width: 100, height: 100 }
          })
        ), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).childAt(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(1000, 1000);
        _assert2.default.notEqual(rnd.childAt(0).getDOMNode().getAttribute('style').indexOf('transform: translate(700px, 500px)'), -1);
      });

      it('should limit position by selector bounds', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(
          'div',
          { className: 'target', style: { width: '1000px', height: '800px' } },
          _react2.default.createElement(
            'div',
            { style: { width: '800px', height: '600px' } },
            _react2.default.createElement(_2.default, {
              bounds: '.target',
              'default': { x: 0, y: 0, width: 100, height: 100 }
            })
          )
        ), { attachTo: document.querySelector('div') });
        rnd.find('div').at(0).childAt(0).childAt(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(2000, 2000);
        _assert2.default.notEqual(rnd.childAt(0).childAt(0).getDOMNode().getAttribute('style').indexOf('transform: translate(900px, 700px)'), -1);
      });
    });
  });

  describe('resize', function () {
    describe('callback and size', function () {
      it('Should box width and height equal 100px', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          }
        }), { attachTo: document.querySelector('div') });
        _assert2.default.equal(rnd.childAt(0).getDOMNode().style.width, '100px');
        _assert2.default.equal(rnd.childAt(0).getDOMNode().style.height, '100px');
      });

      it('Should call onResizeStart when mousedown', function () {
        var onResizeStart = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          },
          onResizeStart: onResizeStart
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        _assert2.default.equal(onResizeStart.callCount, 1);
        _assert2.default.equal(onResizeStart.getCall(0).args[1], 'right');
      });

      it('should call onResize with expected args when resize direction right', function () {
        var onResize = (0, _sinon.spy)();
        var onResizeStart = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          },
          onResizeStart: onResizeStart,
          onResize: onResize
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        _assert2.default.equal(onResize.callCount, 1);
        (0, _assert2.default)(onResize.getCall(0).args[0] instanceof Event);
        _assert2.default.equal(onResize.getCall(0).args[1], 'right');
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 300);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 100);
        _assert2.default.deepEqual(onResize.getCall(0).args[3], { width: 200, height: 0 });
      });

      it('should call onResizeStop with expected args when resize direction right', function () {
        var onResize = (0, _sinon.spy)();
        var onResizeStop = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          },
          onResizeStop: onResizeStop,
          onResize: onResize
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(200, 220);
        mouseUp(200, 220);
        _assert2.default.equal(onResizeStop.callCount, 1);
        (0, _assert2.default)(onResize.getCall(0).args[0] instanceof Event);
        _assert2.default.equal(onResize.getCall(0).args[1], 'right');
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 300);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 100);
        _assert2.default.deepEqual(onResize.getCall(0).args[3], { width: 200, height: 0 });
      });

      it('should move x when resizing left', function () {
        var onResize = (0, _sinon.spy)();
        var onResizeStart = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          },
          onResizeStart: onResizeStart,
          onResize: onResize
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(-50, 0);
        _assert2.default.equal(onResize.callCount, 1);
        _assert2.default.equal(onResize.getCall(0).args[1], 'left');
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 150);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 100);
        _assert2.default.deepEqual(onResize.getCall(0).args[3], { width: 50, height: 0 });
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(50px, 100px)'), -1);
      });

      it('should move y when resizing top', function () {
        var onResize = (0, _sinon.spy)();
        var onResizeStart = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: true,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          },
          onResizeStart: onResizeStart,
          onResize: onResize
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(0, -50);
        _assert2.default.equal(onResize.callCount, 1);
        _assert2.default.equal(onResize.getCall(0).args[1], 'top');
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 100);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 150);
        _assert2.default.deepEqual(onResize.getCall(0).args[3], { width: 0, height: 50 });
        _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(100px, 50px)'), -1);
      });
    });

    describe('grid', function () {
      it('should snapped by original grid when x axis resizing smaller then threshold', function () {
        var onResize = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          },
          onResize: onResize,
          resizeGrid: [20, 1]
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(9, 0);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 100);
      });

      it('should snapped by original grid when x axis resizing larger then threshold', function () {
        var onResize = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          },
          onResize: onResize,
          resizeGrid: [20, 1]
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(10, 0);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 120);
      });

      it('should snapped by original grid when y axis resizing smaller then threshold', function () {
        var onResize = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          },
          onResize: onResize,
          resizeGrid: [1, 20]
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(0, 9);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 100);
      });

      it('should snapped by original grid when y axis resizing larger then threshold', function () {
        var onResize = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          },
          onResize: onResize,
          resizeGrid: [1, 20]
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(0, 10);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 120);
      });

      it('should snapped by original grid when y axis resizing larger then threshold', function () {
        var onResize = (0, _sinon.spy)();
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
          'default': { x: 100, y: 100, width: 100, height: 100 },
          resizeHandlerClasses: {
            top: 'handler',
            right: 'handler',
            bottom: 'handler',
            left: 'handler',
            topRight: 'handler',
            bottomRight: 'handler',
            bottomLeft: 'handler',
            topLeft: 'handler'
          },
          enableResizing: {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          },
          onResize: onResize,
          resizeGrid: [30, 20]
        }), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(20, 10);
        // TODO: It'a resizable-box grid bug??
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientWidth, 120);
        _assert2.default.deepEqual(onResize.getCall(0).args[2].clientHeight, 120);
      });
    });

    describe('bounds', function () {
      it('should clamped by parent size', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(
          'div',
          { style: { width: '800px', height: '600px' } },
          _react2.default.createElement(_2.default, {
            'default': { x: 0, y: 0, width: 100, height: 100 },
            resizeHandlerClasses: {
              top: 'handler',
              right: 'handler',
              bottom: 'handler',
              left: 'handler',
              topRight: 'handler',
              bottomRight: 'handler',
              bottomLeft: 'handler',
              topLeft: 'handler'
            },
            bounds: 'parent',
            enableResizing: {
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: true,
              bottomLeft: false,
              topLeft: false
            }
          })
        ), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(1200, 1200);
        _assert2.default.equal(rnd.childAt(0).childAt(0).getDOMNode().style.width, '800px');
        _assert2.default.equal(rnd.childAt(0).childAt(0).getDOMNode().style.height, '600px');
      });

      it('should clamped by selector size', function () {
        var rnd = (0, _enzyme.mount)(_react2.default.createElement(
          'div',
          { className: 'target', style: { width: '1000px', height: '800px' } },
          _react2.default.createElement(
            'div',
            { style: { width: '800px', height: '600px' } },
            _react2.default.createElement(_2.default, {
              'default': { x: 0, y: 0, width: 100, height: 100 },
              resizeHandlerClasses: {
                top: 'handler',
                right: 'handler',
                bottom: 'handler',
                left: 'handler',
                topRight: 'handler',
                bottomRight: 'handler',
                bottomLeft: 'handler',
                topLeft: 'handler'
              },
              bounds: '.target',
              enableResizing: {
                top: false,
                right: false,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: true,
                bottomLeft: false,
                topLeft: false
              }
            })
          )
        ), { attachTo: document.querySelector('div') });
        rnd.find('div.handler').at(0).simulate('mousedown', { clientX: 0, clientY: 0 });
        mouseMove(2000, 2000);
        _assert2.default.equal(rnd.childAt(0).childAt(0).childAt(0).getDOMNode().style.width, '1000px');
        _assert2.default.equal(rnd.childAt(0).childAt(0).childAt(0).getDOMNode().style.height, '800px');
      });
    });
  });

  describe('method', function () {
    it('should get rnd updated when updatePosition invoked', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        'default': { x: 100, y: 100, width: 100, height: 100 }
      }));
      rnd.instance().updatePosition({ x: 200, y: 300 });
      _assert2.default.notEqual(rnd.getDOMNode().getAttribute('style').indexOf('transform: translate(200px, 300px)'), -1);
    });

    it('should get rnd updated when updateSize invoked', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        'default': { x: 100, y: 100, width: 100, height: 100 }
      }));
      rnd.instance().updateSize({ width: 200, height: 300 });
      _assert2.default.equal(rnd.childAt(0).getDOMNode().style.width, '200px');
      _assert2.default.equal(rnd.childAt(0).getDOMNode().style.height, '300px');
    });

    it('should get rnd updated when updateZIndex invoked', function () {
      var rnd = (0, _enzyme.mount)(_react2.default.createElement(_2.default, {
        'default': { x: 100, y: 100, width: 100, height: 100 },
        z: 200
      }));
      rnd.instance().updateZIndex(300);
      _assert2.default.equal(rnd.find('div').at(0).getDOMNode().style.zIndex, 300);
    });
  });
});