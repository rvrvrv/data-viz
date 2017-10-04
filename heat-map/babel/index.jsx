const Tooltip = ({ x, y, info }) => {
  const { year, month, variance, fill } = info;
  const styles = {
    left: x + (year < 1890 ? 0 : -170),
    top: y + 200,
    background: `rgba(${fill.slice(4, fill.length - 1)}, .7)`,
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

const Cells = (props) => {
  const { scales, data, height, width } = props;
  const { xScale, yScale } = scales;
  // Set color based on temperature
  const colorScale = d3
    .scaleLinear()
    .domain([-6.976, 5.228])
    .range(['#ddf', '#f00'])
    .interpolate(d3.interpolateLab);

  const cells = data.map(d => (
    <rect
      key={`${d.month}-${d.year}`}
      x={xScale(d.year)}
      y={yScale(d.month)}
      fill={colorScale(d.variance)}
      height={height}
      width={width / 262}
      data-year={d3.timeFormat('%Y')(d.year)}
      data-month={d3.timeFormat('%b')(d.month)}
      data-variance={d.variance}
      data-fill={colorScale(d.variance)}
      onMouseEnter={props.onHover}
      onMouseLeave={props.onExitHover}
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
        .tickSize(-this.props.width)
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%B'));
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
  };
  const yProps = {
    axis: 'y',
    scale: scales.yScale,
    width,
    translate: `translate(${margins.left}, 0)`,
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
      y: 0,
    };
  }

  showTooltip = (e) => {
    // Update state with hovered stats
    this.setState({
      hovering: e.target.dataset,
      x: Math.min(window.innerWidth - 150, e.target.getAttribute('x') * 0.9),
      y: Math.max(50, e.target.getAttribute('y') * 0.9),
    });
  };

  hideTooltip = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { height, width, data } = this.props;
    const margins = { top: 10, right: 15, bottom: 50, left: 80 };

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

    return (
      <div>
        <svg width={width} height={height}>
          <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            height={height}
            width={width}
          />
          <Cells
            scales={{ xScale, yScale }}
            margins={margins}
            data={data}
            height={(height - margins.top - margins.bottom) / 12}
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
      </div>
    );
  }
}

class ChartWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      height: window.innerHeight - 270,
      width: window.innerWidth - 50,
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
      height: window.innerHeight - 270,
      width: window.innerWidth - 50,
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
    this.state = {
      data: [],
      status: null,
    };
  }

  // Fetch cyclist data via async/await
  async componentDidMount() {
    const dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    try {
      const response = await (await fetch(dataURL)).json();
      // Parse time from all years and months
      response.monthlyVariance.forEach((e) => {
        e.year = d3.timeParse('%Y')(e.year);
        e.month = d3.timeParse('%m')(e.month);
      });
      this.setState({ data: response.monthlyVariance, status: 'loaded' });
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error' });
    }
  }

  render() {
    return (
      <div>
        <h1>Global Surface Temperature</h1>
        <h2>1753 - 2015</h2>
        {!this.state.status && <h2 className="blinking">Retrieving data...</h2>}
        {this.state.status === 'error' && (
          <h3>An error has occurred. Please try again later.</h3>
        )}
        {this.state.status === 'loaded' && (
          <ChartWrapper data={this.state.data} />
        )}
        <footer>
          Temperature differentials are relative to the average absolute
          temperature between Jan 1951 and Dec 1980 (8.66°C +/- 0.07).
        </footer>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
