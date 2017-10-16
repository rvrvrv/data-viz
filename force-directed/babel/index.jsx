class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      width: Math.max(200, window.innerWidth - 50),
      height: Math.max(200, window.innerHeight - 100)
    };
    this.simulation = null;
  }

  componentDidMount() {
    this.generateGraph();
    // Update state (width and height) when window is resized
    window.addEventListener('resize', this.resizeGraph);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeGraph);
  }

  // Resize and recenter graph
  resizeGraph = () => {
    this.setState(
      {
        width: Math.max(200, window.innerWidth - 50),
        height: Math.max(200, window.innerHeight - 100)
      },
      () => {
        this.centerSim();
        this.simulation.alpha(0.3).restart();
      }
    );
  };

  // Center simulation within window
  centerSim = ({ width, height } = this.state) => {
    // forceX and forceY strength based on size props
    const xStrength = width < 500 ? 0.25 : width < 1000 ? 0.09 : 0.05;
    const yStrength = height < 450 ? 0.35 : height < 800 ? 0.12 : 0.05;
    this.simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX(width / 2).strength(xStrength))
      .force('y', d3.forceY(height / 2).strength(yStrength));
  };

  // Generate graph
  generateGraph = () => {
    const data = this.props.data;
    const { width, height } = this.state;

    // SVG based on size props
    const svg = d3
      .select('svg')
      .attr('width', width)
      .attr('height', height);

    // Create tooltip div
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');

    // Tooltip functions
    const showTooltip = (country, x, y) => {
      tooltip
        .transition()
        .duration(250)
        .style('opacity', 0.9);
      tooltip
        .html(country)
        .style('left', `${x - 16}px`)
        .style('top', `${y - 16}px`);
    };
    const hideTooltip = () => {
      tooltip
        .transition()
        .duration(400)
        .style('opacity', 0);
    };

    // Set up force-directed simulation
    this.simulation = d3.forceSimulation().force('link', d3.forceLink());
    this.centerSim();

    // Create links (lines between flags)
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line');

    // Create nodes (flag images)
    const node = d3
      .select('#flags')
      .selectAll('img')
      .data(data.nodes)
      .enter()
      .append('img')
      .attr('src', 'https://rvrvrv.github.io/img/blank.gif')
      .attr('class', d => `flag flag-${d.code}`)
      .attr('alt', d => d.country)
      .style('transform', `scale(${width < 600 || height < 600 ? 0.3 : 0.5})`)
      // Drag functionality
      .call(
        d3
          .drag()
          .on('start', (d) => {
            if (!d3.event.active) this.simulation.alphaTarget(0.5).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (d) => {
            // Only allow dragging within SVG box
            if (
              d3.event.x > 0 &&
              d3.event.y > 0 &&
              d3.event.x < window.innerWidth - 64 &&
              d3.event.y < window.innerHeight - 100
            ) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            }
          })
          .on('end', (d) => {
            if (!d3.event.active) this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      // Tooltips
      .on('mouseover', (d) => {
        if (!window.event.buttons) showTooltip(d.country, d.x, d.y);
      })
      .on('mouseout', (d) => {
        hideTooltip();
      })
      // Ensure tooltips appear on mobile devices
      .on('click', (d) => {
        showTooltip(d.country, d.x, d.y);
        setTimeout(hideTooltip, 1000);
      });

    // Set position of links and nodes
    const ticked = () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.style('left', d => `${d.x}px`).style('top', d => `${d.y + 48}px`);
    };

    // Draw nodes and links
    this.simulation
      .nodes(data.nodes)
      .on('tick', ticked)
      .alpha(0.3);
    this.simulation.force('link').links(data.links);
  };

  render() {
    return (
      <div className="graph-wrapper">
        <svg
          width={this.state.width}
          height={this.state.height}
          id="graphBox"
        />
        <div id="flags" />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      // Store data from imported js file
      this.state = { data: forceDirectedData };
    } catch (e) {
      this.state = { data: null };
    }
  }

  render() {
    return (
      <div>
        <h1>National Contiguity</h1>
        <h2>Neighboring Countries</h2>
        {this.state.data ? (
          <Graph data={this.state.data} />
        ) : (
          <h3>An error has occurred. Please try again later.</h3>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
