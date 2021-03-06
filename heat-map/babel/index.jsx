const Legend = ({ colorScale, height, width, margins }) => {
  const legendData = [-6.5, -5, -3.5, -2.25, -0.75, 0.5, 1.75, 3, 4.25, 5.5];
  const legendCells = legendData.map((d, i) => (
    <rect
      key={`legend-${d}`}
      x={(width / 10) * i}
      y={0}
      fill={colorScale(d)}
      height={height}
      width={width / 10}
    />
  ));
  return (
    <div>
      <div
        className="legend"
        style={{
          left: (window.innerWidth - width) / 2,
          marginTop: (window.innerHeight > 450) ? margins.top : -(margins.top * 3)
        }}
      >
        <svg height={height} width={width}>
          <g>{legendCells}</g>
        </svg>
        <br />
        <div className="legend-labels">
          <span>-6.5</span>
          <span>
          Temp{width < 225 ? '. Diff.' : 'erature Differential'}
          </span>
          <span>5.5</span>
        </div>
      </div>
      {(width > 200 && window.innerHeight > 500) &&
      <div className="footer">Temp{width < 450 ? '. diff. relative to avg. abs. temp. 1/1951 - 12/1980' : 'erature differentials are relative to the average absolute temperature between Jan 1951 and Dec 1980 (8.66°C +/- 0.07)'}</div>
      }
    </div>
  );
};

const Tooltip = ({ x, y, info }) => {
  const { year, month, variance, fill } = info;
  // Convert hex fill color to rgba for tooltip background
  const rgbaFill = d3.color(fill);
  rgbaFill.opacity = 0.8;
  const styles = {
    left: x,
    top: y + (y < window.innerHeight / 5 ? 150 : 0),
    background: rgbaFill
  };
  return (
    <div className="tooltip" style={styles}>
      <p>
        <span className="tooltip-title">
          {month} {year}
        </span>
        <br />
        {variance}
      </p>
    </div>
  );
};

const Cells = ({ scales, data, height, width, onHover, onExitHover }) => {
  const { xScale, yScale, colorScale } = scales;
  const cells = data.map(d => (
    <rect
      key={`${d.month}-${d.year}`}
      x={xScale(d.year)}
      y={yScale(d.month)}
      fill={colorScale(d.variance)}
      height={(height / 12) + 2}
      width={width / 262}
      data-year={d3.timeFormat('%Y')(d.year)}
      data-month={d3.timeFormat('%b')(d.month)}
      data-variance={d.variance}
      data-fill={colorScale(d.variance)}
      onMouseEnter={onHover}
      onMouseLeave={onExitHover}
    />
  ));
  return <g>{cells}</g>;
};

class Axis extends React.Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    if (this.props.axis === 'x') {
      const xAxis = d3
        .axisBottom()
        .scale(this.props.scale)
        .ticks(d3.timeYear.every(30))
        .tickSize(0)
        .tickFormat(d3.timeFormat('%Y'));
      d3.select(this.axisElement).call(xAxis);
    } else {
      const yAxis = d3
        .axisLeft()
        .scale(this.props.scale)
        .tickSize(0)
        .tickFormat(d3.timeFormat(this.props.margins.left === 40 ? '%b' : '%B'));
      d3.select(this.axisElement).call(yAxis);
    }
  }

  render() {
    return (
      <g
        className={`axis axis-${this.props.axis}`}
        ref={(e) => {
          this.axisElement = e;
        }}
        transform={this.props.translate}
      />
    );
  }
}

const Axes = ({ scales, margins, height }) => {
  const xProps = {
    axis: 'x',
    margins,
    scale: scales.xScale,
    translate: `translate(0, ${scales.yScale(d3.timeParse('%m')(13)) + 5})`
  };
  const yProps = {
    axis: 'y',
    margins,
    scale: scales.yScale,
    translate: `translate(${margins.left}, ${height / 22})`
  };
  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  );
};

class Chart extends React.Component {
  constructor() {
    super();
    this.state = {
      hovering: null,
      x: 0,
      y: 0
    };
  }

  showTooltip = (e) => {
    // Update state with hovered stats
    this.setState({
      hovering: e.target.dataset,
      x: Math.min(window.innerWidth - 150, e.target.getAttribute('x') * 0.9),
      y: Math.max(50, e.target.getAttribute('y') * 0.9)
    });
  };

  hideTooltip = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { height, width, data } = this.props;
    const margins = { top: 10, right: 5, bottom: 50, left: width < 521 ? 40 : 80 };

    // scaleTime (Year values)
    const xScale = d3
      .scaleTime()
      .domain([new Date(1753, 0, 1), new Date(2015, 11, 31)])
      .range([margins.left, width - margins.right]);

    // scaleTime (Month values)
    const yScale = d3
      .scaleTime()
      .domain([new Date(1900, 11, 1), new Date(1900, 0, 1)])
      .range([height - margins.bottom, margins.top]);

    // scaleQuantile (color is based on temperature differential)
    const colorScale = d3
      .scaleQuantile()
      .domain([-6.5, 5.5])
      .range([
        '#4df',
        '#aef',
        '#dfb',
        '#ffb',
        '#fd8',
        '#fc8',
        '#fa8',
        '#f98',
        '#f44',
        '#c10'
      ]);
    return (
      <div>
        <svg width={width} height={height + margins.bottom}>
          <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            height={height}
            width={width}
          />
          <Cells
            scales={{ xScale, yScale, colorScale }}
            data={data}
            height={height}
            width={width}
            onHover={this.showTooltip}
            onExitHover={this.hideTooltip}
          />
        </svg>
        {this.state.hovering && (
          <Tooltip
            x={this.state.x}
            y={this.state.y}
            info={this.state.hovering}
          />
        )}
        <Legend
          colorScale={colorScale}
          height={Math.max(40, height / 13)}
          width={width / 2}
          margins={margins}
        />
      </div>
    );
  }
}

class ChartWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      height: Math.max(250, window.innerHeight - 250),
      width: Math.max(250, window.innerWidth - 30)
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  }

  // Resize chart when window is resized
  resizeChart = () => {
    this.setState({
      height: Math.max(250, window.innerHeight - 250),
      width: Math.max(250, window.innerWidth - 30)
    });
  };

  render() {
    return (
      <Chart
        height={this.state.height}
        width={this.state.width}
        data={this.props.data}
      />
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      // Load data from imported js file
      const data = heatMapData.monthlyVariance;
      // Parse time from all years and months
      data.forEach((d) => {
        d.year = d3.timeParse('%Y')(d.year);
        d.month = d3.timeParse('%m')(d.month);
      });
      this.state = { data };
    } catch (e) {
      this.state = { data: null };
    }
  }

  render() {
    return (
      <div>
        <h1>Global Surface Temperature</h1>
        <h2>1753 - 2015</h2>
        {this.state.data
          ? <ChartWrapper data={this.state.data} />
          : <h3>An error has occurred. Please try again later.</h3>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
