const Tooltip = ({ x, y, info }) => {
  const { time, place, name, year, nat, doping, url } = info;
  const stylePosition = {
    left: x,
    top: y,
  };
  return (
    <div className="tooltip" style={stylePosition}>
      <span>Time: {time}</span>
    </div>
  );
};

const Circles = (props) => {
  const { scales, data } = props;
  const { xScale, yScale } = scales;
  const circles = data.map(d => (
    <circle
      key={d.Name}
      cx={xScale(d3.timeParse('%M:%S')(d.Time))}
      cy={yScale(d.Place)}
      r={5}
      fill={d.Doping ? '#e00' : '#00d'}
      data-time={d.Time}
      data-place={d.Place}
      data-name={d.Name}
      data-year={d.Year}
      data-nat={d.Nationality}
      data-doping={d.Doping}
      data-url={d.URL}
      onMouseEnter={props.onHover}
      onMouseLeave={props.onExitHover}
    />
  ));
  return <g>{circles}</g>;
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
        .ticks(10)
        .tickSize(this.props.tickSize);
      d3.select(this.axisElement).call(xAxis);
    } else {
      const yAxis = d3
        .axisLeft()
        .scale(this.props.scale)
        .tickSize(this.props.tickSize);
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
    tickSize: -(height - margins.top - margins.bottom),
  };
  const yProps = {
    axis: 'y',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSize: -(width - margins.left - margins.right),
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
    console.log(e.target);
    // Update state with hovered stats
    this.setState({
      hovering: e.target.dataset,
      x: Math.min(window.innerWidth - 150, e.target.getAttribute('cx') * 0.9),
      y: Math.max(50, e.target.getAttribute('cy') * 0.9),
    });
  };

  hideTooltip = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { height, width, data } = this.props;
    const margins = { top: 10, right: 10, bottom: 40, left: 40 };
    const extTime = d3.extent(data, d => d3.timeParse('%M:%S')(d.Time));
    const timeMin = extTime[0];
    const timeMax = extTime[1];
    console.log(timeMin, timeMax);

    // scaleTime (Time values)
    const xScale = d3
      .scaleTime(extTime[0], extTime[1])
      .domain([timeMin, timeMax])
      .range([margins.left, width - margins.right]);

    // scaleLinear (Rank values)
    const yScale = d3
      .scaleLinear()
      .domain([35, 1])
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
          <Circles
            scales={{ xScale, yScale }}
            margins={margins}
            data={data}
            height={height}
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
      height: window.innerHeight - 175,
      width: window.innerWidth - 20,
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
      height: window.innerHeight - 175,
      width: window.innerWidth - 20,
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
    const dataURL =
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    try {
      const response = await (await fetch(dataURL)).json();
      this.setState({ data: response, status: 'loaded' });
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error' });
    }
  }

  render() {
    return (
      <div>
        <h1>Cyclist Data</h1>
        {!this.state.status && <h2 className="blinking">Retrieving data...</h2>}
        {this.state.status === 'error' && (
          <h2>An error has occurred. Please try again later.</h2>
        )}
        {this.state.status === 'loaded' && (
          <ChartWrapper data={this.state.data} />
        )}
        <footer>
          For more information, visit{' '}
          <a href="https://www.dopeology.org/" target="_blank">
            Dopeology.org
          </a>
        </footer>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
