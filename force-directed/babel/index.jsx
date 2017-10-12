class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      width: Math.max(200, window.innerWidth - 50),
      height: Math.max(200, window.innerHeight - 100),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeGraph);
    this.generateGraph();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeGraph);
  }

  // Generate graph
  generateGraph = (resize) => {
    const { width, height } = this.state;
    const data = this.props.data;

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

    // Function to display tooltips
    const showTooltip = (country, x, y) => {
      tooltip.transition()
        .duration(250)
        .style('opacity', 0.9);
      tooltip.html(country)
        .style('left', `${x - 42}px`)
        .style('top', `${y - 16}px`);
    };

    // forceX and forceY strength based on size props
    const xStrength = width < 500 ? 0.4 : 0.1;
    const yStrength = height < 700 ? 0.2 : 0.06;

    // Set up force-directed simulation
    const simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody().strength(-55))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(xStrength))
      .force('y', d3.forceY(height / 2).strength(yStrength));

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
      // Drag functionality
      .call(d3.drag()
        .on('start', (d) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d) => {
          // Only allow dragging within SVG box
          if (d3.event.x > 0
                  && d3.event.y > 0
                  && d3.event.x < window.innerWidth - 64
                  && d3.event.y < window.innerHeight - 100) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
        })
        .on('end', (d) => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }),
      )
      // Tooltips
      .on('mouseover', (d) => {
        if (window.event.buttons) return;
        showTooltip(d.country, d.x, d.y);
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(400)
          .style('opacity', 0);
      })
      // Ensure tooltips appear on mobile devices
      .on('click', (d) => {
        showTooltip(d.country, d.x, d.y);
      });

    // Set position of links and nodes
    const ticked = () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .style('left', d => `${d.x}px`)
        .style('top', d => `${d.y + 48}px`);
    };

    // Draw nodes and links
    simulation.nodes(data.nodes).on('tick', ticked).alpha(0.3);
    simulation.force('link').links(data.links);
  };

  // Resize graph when window is resized
  resizeGraph = () => {
    this.setState({
      width: Math.max(200, window.innerWidth - 50),
      height: Math.max(200, window.innerHeight - 100),
    });
  };

  render() {
    return (
      <div className="graph-wrapper">
        <svg width={this.state.width} height={this.state.height} id="graphBox" />
        <div id="flags" />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      // Load data from imported js file
      const data = forceDirectedData;
      this.state = { data };
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
