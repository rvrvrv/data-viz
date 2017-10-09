const Tooltip = ({ x, y, info }) => {
  const { time, place, name, year, nat, doping } = info;
  const styles = {
    left: x + (place < 15 ? 0 : -170),
    top: y + (place < 15 ? 150 : 0),
    background: doping ? 'rgba(255, 200, 200, 0.9)' : 'rgba(175,220,255, 0.9)',
  };
  return (
    <div className="tooltip" style={styles}>
      <p>
        <span className="tooltip-title">{place} - {name} - {nat}</span>
        <br />Time: {time}
        <br />Year: {year}
      </p>
      {doping &&
        <p><span className="blinking">Doping Allegations:</span>
          <br />{doping}
        </p>
      }
    </div>
  );
};

const Circles = (props) => {
  const { scales, data } = props;
  const { xScale, yScale } = scales;
  const circles = data.map(d => (
    <circle
      className={d.Doping ? 'doping' : 'clean'}
      style={{ animation: `circleEntrance ${(Math.random() * 2) + 1}s` }}
      key={`cyclist-${d.Place}`}
      cx={xScale(d.Seconds)}
      cy={yScale(d.Place)}
      r={6}
      data-time={d.Time}
      data-place={d.Place}
      data-name={d.Name}
      data-year={d.Year}
      data-nat={d.Nationality}
      data-doping={d.Doping}
      data-url={d.URL}
      onClick={props.onClick}
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
        .tickValues([30, 60, 90, 120, 150, 180])
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
      <text x={width / 2} y={height - (margins.top / 4)} style={{ textAnchor: 'middle' }}>Seconds Behind 1st Place</text>
      <Axis {...xProps} />
      <text x={-((height / 2) - margins.top)} y={margins.left / 2} style={{ transform: 'rotate(-90deg)' }}>Place</text>
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

  openDopingLink = e =>
    // When user clicks a doping cyclist, open the appropriate link
    (e.target.dataset.url
      ? window.open(e.target.dataset.url)
      : e.preventDefault())
  ;

  showTooltip = (e) => {
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

    // scaleTime (Time values)
    const xScale = d3
      .scaleLinear()
      .domain([0, 180])
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
            onClick={this.openDopingLink}
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
      height: window.innerHeight - 120,
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
      height: window.innerHeight - 120,
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
    try {
      // Load cyclist data from imported js file
      const data = scatterplotData;
      // Recalculate 'Seconds' property to equal seconds behind 1st place
      data.forEach(d => d.Seconds -= 2210);
      this.state = { data, status: 'loaded' };
    } catch (e) {
      this.state = { data: null, status: 'error' };
    }
  }

  render() {
    return (
      <div>
        <h2>Fastest Cyclists at Alpe d'Huez</h2>
        {this.state.status === 'loaded' && (
          <ChartWrapper data={this.state.data} />
        )}
        {this.state.status === 'error' && (
          <h2>An error has occurred. Please try again later.</h2>
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
