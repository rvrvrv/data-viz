class Graph extends React.Component {
  componentDidMount() {
    this.generateGraph();
  }

  generateGraph = () => {
    const { width, height, data } = this.props;
    // Create svg based on size props
    const svg = d3
      .select('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up force-directed simulation
    const simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.index))
      .force('charge', d3.forceManyBody().strength(-55))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2));

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
      .select('.graph-wrapper')
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
                  && d3.event.x < window.innerWidth - 50
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
      );

    // Set position of links and nodes
    const ticked = () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .style('left', d => `${d.x + 8}px`)
        .style('top', d => `${d.y + 64}px`);
    };

    // Draw nodes and links
    simulation.nodes(data.nodes).on('tick', ticked);
    simulation.force('link').links(data.links);
  };

  render() {
    return <div className="graph" />;
  }
}

class GraphWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      width: Math.max(200, window.innerWidth - 50),
      height: Math.max(200, window.innerHeight - 100),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeGraph);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeGraph);
  }

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
        <svg width={this.state.width} height={this.state.height} />
        <Graph
          width={this.state.width}
          height={this.state.height}
          data={this.props.data}
        />
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
          <GraphWrapper data={this.state.data} />
        ) : (
          <h3>An error has occurred. Please try again later.</h3>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
