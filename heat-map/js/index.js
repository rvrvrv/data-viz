"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function Tooltip(_ref) {
  var x = _ref.x;
  var y = _ref.y;
  var info = _ref.info;
  var year = info.year;
  var month = info.month;
  var variance = info.variance;
  var fill = info.fill;

  var styles = {
    left: x + (year < 1890 ? 0 : -170),
    top: y + 200,
    background: "rgba(" + fill.slice(4, fill.length - 1) + ", .7)"
  };
  return React.createElement(
    "div",
    { className: "tooltip", style: styles },
    React.createElement(
      "p",
      null,
      React.createElement(
        "span",
        { className: "tooltip-title" },
        month,
        " ",
        year
      ),
      React.createElement("br", null),
      variance
    )
  );
};

var Cells = function Cells(props) {
  var scales = props.scales;
  var data = props.data;
  var height = props.height;
  var width = props.width;
  var xScale = scales.xScale;
  var yScale = scales.yScale;
  // Set color based on temperature

  var colorScale = d3.scaleLinear().domain([-6.976, 5.228]).range(['#ddf', '#f00']).interpolate(d3.interpolateLab);

  var cells = data.map(function (d) {
    return React.createElement("rect", {
      key: d.month + "-" + d.year,
      x: xScale(d.year),
      y: yScale(d.month),
      fill: colorScale(d.variance),
      height: height,
      width: width / 262,
      "data-year": d3.timeFormat('%Y')(d.year),
      "data-month": d3.timeFormat('%b')(d.month),
      "data-variance": d.variance,
      "data-fill": colorScale(d.variance),
      onMouseEnter: props.onHover,
      onMouseLeave: props.onExitHover
    });
  });
  return React.createElement(
    "g",
    null,
    cells
  );
};

var Axis = function (_React$Component) {
  _inherits(Axis, _React$Component);

  function Axis() {
    _classCallCheck(this, Axis);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Axis.prototype.componentDidMount = function componentDidMount() {
    this.renderAxis();
  };

  Axis.prototype.componentDidUpdate = function componentDidUpdate() {
    this.renderAxis();
  };

  Axis.prototype.renderAxis = function renderAxis() {
    if (this.props.axis === 'x') {
      var xAxis = d3.axisBottom().scale(this.props.scale).ticks(d3.timeYear.every(30)).tickSize(0).tickFormat(d3.timeFormat('%Y'));
      d3.select(this.axisElement).call(xAxis);
    } else {
      var yAxis = d3.axisLeft().scale(this.props.scale).tickSize(-this.props.width).tickSizeOuter(0).tickFormat(d3.timeFormat('%B'));
      d3.select(this.axisElement).call(yAxis);
    }
  };

  Axis.prototype.render = function render() {
    var _this2 = this;

    return React.createElement("g", {
      className: "axis axis-" + this.props.axis,
      ref: function ref(e) {
        _this2.axisElement = e;
      },
      transform: this.props.translate
    });
  };

  return Axis;
}(React.Component);

var Axes = function Axes(_ref2) {
  var scales = _ref2.scales;
  var margins = _ref2.margins;
  var height = _ref2.height;
  var width = _ref2.width;

  var xProps = {
    axis: 'x',
    scale: scales.xScale,
    translate: "translate(0, " + (height - margins.bottom) + ")"
  };
  var yProps = {
    axis: 'y',
    scale: scales.yScale,
    width: width,
    translate: "translate(" + margins.left + ", 0)"
  };
  return React.createElement(
    "g",
    null,
    React.createElement(Axis, xProps),
    React.createElement(Axis, yProps)
  );
};

var Chart = function (_React$Component2) {
  _inherits(Chart, _React$Component2);

  function Chart() {
    _classCallCheck(this, Chart);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.showTooltip = function (e) {
      // Update state with hovered stats
      _this3.setState({
        hovering: e.target.dataset,
        x: Math.min(window.innerWidth - 150, e.target.getAttribute('x') * 0.9),
        y: Math.max(50, e.target.getAttribute('y') * 0.9)
      });
    };

    _this3.hideTooltip = function () {
      _this3.setState({ hovering: false });
    };

    _this3.state = {
      hovering: null,
      x: 0,
      y: 0
    };
    return _this3;
  }

  Chart.prototype.render = function render() {
    var _props = this.props;
    var height = _props.height;
    var width = _props.width;
    var data = _props.data;

    var margins = { top: 10, right: 15, bottom: 50, left: 80 };

    // scaleTime (Year values)
    var xScale = d3.scaleTime().domain([new Date(1753, 0, 1), new Date(2015, 11, 31)]).range([margins.left, width - margins.right]);

    // scaleTime (Month values)
    var yScale = d3.scaleTime().domain([new Date(1900, 11, 1), new Date(1900, 0, 1)]).range([height - margins.bottom, margins.top]);

    return React.createElement(
      "div",
      null,
      React.createElement(
        "svg",
        { width: width, height: height },
        React.createElement(Axes, {
          scales: { xScale: xScale, yScale: yScale },
          margins: margins,
          height: height,
          width: width
        }),
        React.createElement(Cells, {
          scales: { xScale: xScale, yScale: yScale },
          margins: margins,
          data: data,
          height: (height - margins.top - margins.bottom) / 12,
          width: width,
          onHover: this.showTooltip,
          onExitHover: this.hideTooltip
        })
      ),
      this.state.hovering && React.createElement(Tooltip, {
        x: this.state.x,
        y: this.state.y,
        info: this.state.hovering
      })
    );
  };

  return Chart;
}(React.Component);

var ChartWrapper = function (_React$Component3) {
  _inherits(ChartWrapper, _React$Component3);

  function ChartWrapper() {
    _classCallCheck(this, ChartWrapper);

    var _this4 = _possibleConstructorReturn(this, _React$Component3.call(this));

    _this4.resizeChart = function () {
      _this4.setState({
        height: window.innerHeight - 270,
        width: window.innerWidth - 50
      });
    };

    _this4.state = {
      height: window.innerHeight - 270,
      width: window.innerWidth - 50
    };
    return _this4;
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

var App = function (_React$Component4) {
  _inherits(App, _React$Component4);

  function App(props) {
    _classCallCheck(this, App);

    var _this5 = _possibleConstructorReturn(this, _React$Component4.call(this, props));

    _this5.state = {
      data: [],
      status: null
    };
    return _this5;
  }

  // Fetch cyclist data via async/await

  App.prototype.componentDidMount = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var dataURL, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
              _context.prev = 1;
              _context.next = 4;
              return fetch(dataURL);

            case 4:
              _context.next = 6;
              return _context.sent.json();

            case 6:
              response = _context.sent;

              // Parse time from all years and months
              response.monthlyVariance.forEach(function (e) {
                e.year = d3.timeParse('%Y')(e.year);
                e.month = d3.timeParse('%m')(e.month);
              });
              this.setState({ data: response.monthlyVariance, status: 'loaded' });
              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);

              console.error(_context.t0);
              this.setState({ status: 'error' });

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 11]]);
    }));

    return function componentDidMount() {
      return ref.apply(this, arguments);
    };
  }();

  App.prototype.render = function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "Global Surface Temperature"
      ),
      React.createElement(
        "h2",
        null,
        "1753 - 2015"
      ),
      !this.state.status && React.createElement(
        "h2",
        { className: "blinking" },
        "Retrieving data..."
      ),
      this.state.status === 'error' && React.createElement(
        "h3",
        null,
        "An error has occurred. Please try again later."
      ),
      this.state.status === 'loaded' && React.createElement(ChartWrapper, { data: this.state.data }),
      React.createElement(
        "footer",
        null,
        "Temperature differentials are relative to the average absolute temperature between Jan 1951 and Dec 1980 (8.66°C +/- 0.07)."
      )
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
