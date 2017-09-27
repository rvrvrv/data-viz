'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bars = function (_React$Component) {
  _inherits(Bars, _React$Component);

  function Bars(props) {
    _classCallCheck(this, Bars);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.showTooltip = function (e) {
      var formattedDate = d3.timeFormat('%b %Y')(d3.timeParse('%Y-%m-%d')(e.target.dataset.date));
      _this.setState({
        hovering: formattedDate + ':$' + e.target.dataset.gdp + ' Bil.',
        x: e.target.getAttribute('x') * 0.75,
        y: e.target.getAttribute('y') * 0.95
      });
    };

    _this.hideTooltip = function () {
      _this.setState({ hovering: false });
    };

    _this.state = { hovering: false, x: 0, y: 0 };
    _this.colorScale = d3.scaleLinear().domain([0, _this.props.maxValue]).range(['#ac7', '#5a1']).interpolate(d3.interpolateLab);
    return _this;
  }

  Bars.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props;
    var scales = _props.scales;
    var margins = _props.margins;
    var data = _props.data;
    var height = _props.height;
    var xScale = scales.xScale;
    var yScale = scales.yScale;

    var bars = data.map(function (d) {
      return React.createElement('rect', {
        key: d[0],
        x: xScale(d[0]),
        y: yScale(d[1]),
        height: height - margins.bottom - scales.yScale(d[1]),
        width: xScale.bandwidth(),
        fill: _this2.colorScale(d[1]),
        'data-date': d[0],
        'data-gdp': d[1],
        onMouseEnter: _this2.showTooltip,
        onMouseLeave: _this2.hideTooltip
      });
    });
    return React.createElement(
      'svg',
      null,
      this.state.hovering && React.createElement(
        'text',
        {
          x: this.state.x,
          y: this.state.y
        },
        this.state.hovering
      ),
      React.createElement(
        'g',
        null,
        bars
      )
    );
  };

  return Bars;
}(React.Component);

var ChartWrapper = function (_React$Component2) {
  _inherits(ChartWrapper, _React$Component2);

  function ChartWrapper() {
    _classCallCheck(this, ChartWrapper);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.resizeChart = function () {
      _this3.setState({
        height: window.innerHeight - 200,
        width: window.innerWidth - 20
      });
    };

    _this3.state = {
      height: window.innerHeight - 200,
      width: window.innerWidth - 20
    };
    return _this3;
  }

  ChartWrapper.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.resizeChart);
  };

  ChartWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  };

  // Resize chart when window is resized

  ChartWrapper.prototype.render = function render() {
    return React.createElement(Chart, {
      height: this.state.height,
      width: this.state.width,
      data: this.props.data
    });
  };

  return ChartWrapper;
}(React.Component);

var Chart = function Chart(_ref) {
  var height = _ref.height;
  var width = _ref.width;
  var data = _ref.data;

  var margins = { top: 0, right: 10, bottom: 50, left: 40 };
  var maxValue = d3.max(data.map(function (d) {
    return d[1];
  }));
  // scaleBand (Date values)
  var xScale = d3.scaleBand().domain(data.map(function (d) {
    return d[0];
  })).range([margins.left, width - margins.right]);

  // scaleLinear (GDP values)
  var yScale = d3.scaleLinear().domain([0, maxValue]).range([height - margins.bottom, margins.top]);

  return React.createElement(
    'svg',
    { width: width, height: height },
    React.createElement(Bars, {
      scales: { xScale: xScale, yScale: yScale },
      margins: margins,
      data: data,
      maxValue: maxValue,
      height: height
    })
  );
};

var App = function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    _classCallCheck(this, App);

    var _this4 = _possibleConstructorReturn(this, _React$Component3.call(this, props));

    _this4.state = {
      data: [],
      status: null
    };
    return _this4;
  }

  // Fetch GDP data via async/await

  App.prototype.componentDidMount = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var dataURL, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
              _context.prev = 1;
              _context.next = 4;
              return fetch(dataURL);

            case 4:
              _context.next = 6;
              return _context.sent.json();

            case 6:
              response = _context.sent;

              this.setState({ data: response.data, status: 'loaded' });
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](1);

              console.error(_context.t0);
              this.setState({ status: 'error' });

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 10]]);
    }));

    return function componentDidMount() {
      return ref.apply(this, arguments);
    };
  }();

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'chart' },
      React.createElement(
        'h2',
        { className: 'title' },
        'US Quarterly GDP'
      ),
      !this.state.status && React.createElement(
        'h2',
        { className: 'blinking' },
        'Retrieving data...'
      ),
      this.state.status === 'error' && React.createElement(
        'h2',
        null,
        'An error has occurred. Please try again later.'
      ),
      this.state.status === 'loaded' && React.createElement(ChartWrapper, { data: this.state.data })
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));