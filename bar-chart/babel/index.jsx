const Tooltip = ({ x, y, text }) => (
  <svg>
    <filter id="f1">
      <feGaussianBlur stdDeviation="5" />
    </filter>
    <text
      x={x}
      y={y}
      style={{ stroke: '#f5fff5', strokeWidth: 20, filter: 'url(#f1)' }}
    >
      {text}
    </text>
    <text x={x} y={y} style={{ fill: '#050' }}>
      {text}
    </text>
  </svg>
);

class Bars extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovering: false, x: 0, y: 0 };
    // Set color based on GDP value
    this.colorScale = d3
      .scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#ab7', '#5a1'])
      .interpolate(d3.interpolateLab);
  }

  showTooltip = (e) => {
    // Update state with hovered stats
    this.setState({
      hovering: `${e.target.dataset.date}: $${d3.format(',')(e.target.dataset.gdp)} bn`,
      x: Math.min(window.innerWidth - 250, e.target.getAttribute('x') * 0.75),
      y: Math.max(40, e.target.getAttribute('y') * 0.9)
    });
  };

  hideTooltip = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { scales, margins, data, height } = this.props;
    const { xScale, yScale } = scales;
    const bars = data.map(d => (
      <rect
        style={{ animation: `barEntrance ${Math.random() + 0.5}s` }}
        key={d[0]}
        x={xScale(d[0])}
        y={yScale(d[1])}
        height={height - margins.bottom - scales.yScale(d[1])}
        width={xScale.bandwidth() + 1}
        fill={this.colorScale(d[1])}
        data-date={d[0]}
        data-gdp={d[1]}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
      />
    ));
    return (
      <svg>
        {/* Bars */}
        <g>{bars}</g>
        {/* Tooltip */}
        {this.state.hovering && (
          <Tooltip
            x={this.state.x}
            y={this.state.y}
            text={this.state.hovering}
          />
        )}
      </svg>
    );
  }
}

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
        .tickSize(this.props.tickSize)
        .tickSizeOuter(0)
        .tickValues([
          'Jan 1950',
          'Jan 1960',
          'Jan 1970',
          'Jan 1980',
          'Jan 1990',
          'Jan 2000',
          'Jan 2010'
        ])
        .tickFormat(d => d.slice(4));
      d3.select(this.axisElement).call(xAxis);
    } else {
      const yAxis = d3
        .axisLeft()
        .scale(this.props.scale)
        .tickSize(this.props.tickSize)
        .tickValues([6000, 12000])
        .tickFormat(d => `$${d / 1000}k bn`);
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

const Axes = ({ scales, margins, height, width }) => {
  const xProps = {
    axis: 'x',
    scale: scales.xScale,
    translate: `translate(0, ${height - margins.bottom})`,
    tickSize: 5
  };
  const yProps = {
    axis: 'y',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSize: -(width - margins.left - margins.right)
  };

  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  );
};

const Chart = ({ height, width, data }) => {
  const margins = { top: 0, right: 10, bottom: 40, left: 45 };
  const maxValue = d3.max(data.map(d => d[1]));
  // scaleBand (Date values)
  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d[0]))
    .range([margins.left + 1, width - margins.right - 1]);

  // scaleLinear (GDP values)
  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue + 10])
    .range([height - margins.bottom, margins.top]);

  return (
    <svg width={width} height={height}>
      <Axes
        scales={{ xScale, yScale }}
        margins={margins}
        height={height}
        width={width}
      />
      <Bars
        scales={{ xScale, yScale }}
        margins={margins}
        data={data}
        maxValue={maxValue}
        height={height}
      />
    </svg>
  );
};

class ChartWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      height: Math.max(200, window.innerHeight - 175),
      width: Math.max(200, window.innerWidth - 20)
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
      height: Math.max(200, window.innerHeight - 175),
      width: Math.max(200, window.innerWidth - 20)
    });
  };

  render() {
    return (
      <div>
        <Chart
          height={this.state.height}
          width={this.state.width}
          data={this.props.data}
        />
        {window.innerHeight > 300 &&
        <footer>
          For more information, visit the{' '}
          <a href="https://bea.gov/methodologies/index.htm" target="_blank">
            U.S. Department of Commerce Bureau of Economic Analysis (BEA)
          </a>
        </footer>
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      // Load GDP data from imported js file
      const data = barChartData.data.map(d => [
        d3.timeFormat('%b %Y')(d3.timeParse('%Y-%m-%d')(d[0])),
        d[1]
      ]);
      this.state = { data };
    } catch (e) {
      this.state = { data: null };
    }
  }

  render() {
    return (
      <div>
        <h1>US Quarterly GDP</h1>
        {this.state.data
          ? <ChartWrapper data={this.state.data} />
          : <h2>An error has occurred. Please try again later.</h2>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
