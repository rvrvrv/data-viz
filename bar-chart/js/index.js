"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function Tooltip(_ref) {
  var x = _ref.x;
  var y = _ref.y;
  var text = _ref.text;
  return React.createElement(
    "svg",
    null,
    React.createElement(
      "filter",
      { id: "f1" },
      React.createElement("feGaussianBlur", { stdDeviation: "5" })
    ),
    React.createElement(
      "text",
      {
        x: x,
        y: y,
        style: { stroke: "#f5fff5", strokeWidth: 20, filter: "url(#f1)" }
      },
      text
    ),
    React.createElement(
      "text",
      { x: x, y: y, style: { fill: "#050" } },
      text
    )
  );
};

var Bars = function (_React$Component) {
  _inherits(Bars, _React$Component);

  function Bars(props) {
    _classCallCheck(this, Bars);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.showTooltip = function (e) {
      // Update state with hovered stats
      _this.setState({
        hovering: e.target.dataset.date + ": $" + e.target.dataset.gdp + " bn",
        x: Math.min(window.innerWidth - 200, e.target.getAttribute("x") * 0.75),
        y: Math.max(40, e.target.getAttribute("y") * 0.9)
      });
    };

    _this.hideTooltip = function () {
      _this.setState({ hovering: false });
    };

    _this.state = { hovering: false, x: 0, y: 0 };
    // Set color based on GDP value
    _this.colorScale = d3.scaleLinear().domain([0, _this.props.maxValue]).range(["#ac7", "#5a1"]).interpolate(d3.interpolateLab);
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
      return React.createElement("rect", {
        key: d[0],
        x: xScale(d[0]),
        y: yScale(d[1]),
        height: height - margins.bottom - scales.yScale(d[1]),
        width: xScale.bandwidth() + .7,
        fill: _this2.colorScale(d[1]),
        "data-date": d[0],
        "data-gdp": d[1],
        onMouseEnter: _this2.showTooltip,
        onMouseLeave: _this2.hideTooltip
      });
    });
    return React.createElement(
      "svg",
      null,
      React.createElement(
        "g",
        null,
        bars
      ),
      this.state.hovering && React.createElement(Tooltip, {
        x: this.state.x,
        y: this.state.y,
        text: this.state.hovering
      })
    );
  };

  return Bars;
}(React.Component);

var Axis = function (_React$Component2) {
  _inherits(Axis, _React$Component2);

  function Axis() {
    _classCallCheck(this, Axis);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Axis.prototype.componentDidMount = function componentDidMount() {
    this.renderAxis();
  };

  Axis.prototype.componentDidUpdate = function componentDidUpdate() {
    this.renderAxis();
  };

  Axis.prototype.renderAxis = function renderAxis() {
    if (this.props.axis === "x") {
      var xAxis = d3.axisBottom().scale(this.props.scale).tickSize(this.props.tickSize).tickSizeOuter([0]).tickValues(["Jan 1950", "Jan 1960", "Jan 1970", "Jan 1980", "Jan 1990", "Jan 2000", "Jan 2010"]);
      d3.select(this.axisElement).call(xAxis);
    } else {
      var yAxis = d3.axisLeft().scale(this.props.scale).tickSize(-this.props.tickSize).tickValues([9000]);
      d3.select(this.axisElement).call(yAxis);
    }
  };

  Axis.prototype.render = function render() {
    var _this4 = this;

    return React.createElement("g", {
      className: "axis axis-" + this.props.axis,
      ref: function ref(e) {
        _this4.axisElement = e;
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
    axis: "x",
    scale: scales.xScale,
    translate: "translate(0, " + (height - margins.bottom) + ")",
    tickSize: -5
  };
  var yProps = {
    axis: "y",
    scale: scales.yScale,
    translate: "translate(" + margins.left + ", 0)",
    tickSize: width - margins.left - margins.right
  };

  return React.createElement(
    "g",
    null,
    React.createElement(Axis, xProps),
    React.createElement(Axis, yProps)
  );
};

var Chart = function Chart(_ref3) {
  var height = _ref3.height;
  var width = _ref3.width;
  var data = _ref3.data;

  var margins = { top: 0, right: 10, bottom: 40, left: 40 };
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
    "svg",
    { width: width, height: height },
    React.createElement(Bars, {
      scales: { xScale: xScale, yScale: yScale },
      margins: margins,
      data: data,
      maxValue: maxValue,
      height: height
    }),
    React.createElement(Axes, {
      scales: { xScale: xScale, yScale: yScale },
      margins: margins,
      height: height,
      width: width
    })
  );
};

var ChartWrapper = function (_React$Component3) {
  _inherits(ChartWrapper, _React$Component3);

  function ChartWrapper() {
    _classCallCheck(this, ChartWrapper);

    var _this5 = _possibleConstructorReturn(this, _React$Component3.call(this));

    _this5.resizeChart = function () {
      _this5.setState({
        height: window.innerHeight - 200,
        width: window.innerWidth - 20
      });
    };

    _this5.state = {
      height: window.innerHeight - 200,
      width: window.innerWidth - 20
    };
    return _this5;
  }

  ChartWrapper.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener("resize", this.resizeChart);
  };

  ChartWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener("resize", this.resizeChart);
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

    var _this6 = _possibleConstructorReturn(this, _React$Component4.call(this, props));

    _this6.state = {
      data: [],
      status: null
    };
    return _this6;
  }

  // Fetch GDP data via async/await

  App.prototype.componentDidMount = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var dataURL, response, formatted;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
              _context.prev = 1;
              _context.next = 4;
              return fetch(dataURL);

            case 4:
              _context.next = 6;
              return _context.sent.json();

            case 6:
              response = _context.sent;

              // Format dates for axes and tooltips
              formatted = response.data.map(function (d) {
                return [d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(d[0])), d[1]];
              });

              this.setState({ data: formatted, status: "loaded" });
              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);

              console.error(_context.t0);
              this.setState({ status: "error" });

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
        "US Quarterly GDP"
      ),
      !this.state.status && React.createElement(
        "h2",
        { className: "blinking" },
        "Retrieving data..."
      ),
      this.state.status === "error" && React.createElement(
        "h2",
        null,
        "An error has occurred. Please try again later."
      ),
      this.state.status === "loaded" && React.createElement(ChartWrapper, { data: this.state.data }),
      React.createElement(
        "footer",
        null,
        "For more information, visit the",
        " ",
        React.createElement(
          "a",
          { href: "https://bea.gov/methodologies/index.htm", target: "_blank" },
          "U.S. Department of Commerce Bureau of Economic Analysis (BEA)"
        )
      )
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
