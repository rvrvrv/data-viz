class Bars extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovering: false, x: 0, y: 0 };
    this.colorScale = d3
      .scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#ac7', '#5a1'])
      .interpolate(d3.interpolateLab);
  }

  showTooltip = (e) => {
    const formattedDate = d3.timeFormat('%b %Y')(d3.timeParse('%Y-%m-%d')(e.target.dataset.date));
    this.setState({
      hovering: `${formattedDate}:$${e.target.dataset.gdp} Bil.`,
      x: e.target.getAttribute('x') * 0.75,
      y: e.target.getAttribute('y') * 0.95,
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
        key={d[0]}
        x={xScale(d[0])}
        y={yScale(d[1])}
        height={height - margins.bottom - scales.yScale(d[1])}
        width={xScale.bandwidth()}
        fill={this.colorScale(d[1])}
        data-date={d[0]}
        data-gdp={d[1]}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
      />
    ));
    return (
      <svg>
        { /* Tooltips */ }
        {this.state.hovering &&
        <text
          x={this.state.x}
          y={this.state.y}
        >
          {this.state.hovering}
        </text>
        }
        { /* Bars */ }
        <g>{bars}</g>
      </svg>
    );
  }
}

class ChartWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      height: window.innerHeight - 200,
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
      height: window.innerHeight - 200,
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

const Chart = ({ height, width, data }) => {
  const margins = { top: 0, right: 10, bottom: 50, left: 40 };
  const maxValue = d3.max(data.map(d => d[1]));
  // scaleBand (Date values)
  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d[0]))
    .range([margins.left, width - margins.right]);

  // scaleLinear (GDP values)
  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([height - margins.bottom, margins.top]);

  return (
    <svg width={width} height={height}>
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: null,
    };
  }

  // Fetch GDP data via async/await
  async componentDidMount() {
    const dataURL =
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    try {
      const response = await (await fetch(dataURL)).json();
      this.setState({ data: response.data, status: 'loaded' });
    } catch (e) {
      console.error(e);
      this.setState({ status: 'error' });
    }
  }

  render() {
    return (
      <div className="chart">
        <h2 className="title">US Quarterly GDP</h2>
        {!this.state.status && <h2 className="blinking">Retrieving data...</h2>}
        {this.state.status === 'error' && (
          <h2>An error has occurred. Please try again later.</h2>
        )}
        {this.state.status === 'loaded' && (
          <ChartWrapper data={this.state.data} />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
