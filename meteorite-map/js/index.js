document.addEventListener('DOMContentLoaded', () => {
  // Initialize map properties and vars
  let projection, path, svg, g;
  const radiusScale = d3.scalePow().exponent(0.5).domain([0.15, 23e6]).range([1, 80]);
  const opacityScale = d3.scalePow().exponent(0.5).domain([0.15, 23e6]).range([0.8, 0.3]);
  const container = document.getElementsByClassName('map-container')[0];
  let width = container.offsetWidth;
  let height = Math.min(width * 0.7, window.innerHeight - 100);
  // Create tooltip div
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip');

  // Show tooltip (called during mouseover/click)
  function showTooltip(meteor, x, y) {
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.9);
    tooltip
      .html(`<h2>${meteor.name}</h2><h3>Year: ${meteor.year.slice(0, 4)}</h3><h3>Mass: ${meteor.mass}</h3>`)
      // Keep tooltip within window
      .style('left', `${x = x > (window.innerWidth * 0.7) ? x - 150 : x}px`)
      .style('top', `${y = y > (window.innerHeight * 0.6) ? y - 200 : y + 75}px`);
  }

  // Hide tooltip (called during mouseout)
  function hideTooltip() {
    tooltip
      .transition()
      .duration(400)
      .style('opacity', 0);
  }

  // Plot land and meteorite hits on map
  function drawMap() {
    // Draw world map from worldMapData
    svg
      .append('g')
      .attr('class', 'land')
      .selectAll('path')
      .data([topojson.feature(worldMapData, worldMapData.objects.land)])
      .enter()
      .append('path');
    svg
      .append('g')
      .attr('class', 'boundaries')
      .selectAll('path')
      .data([topojson.feature(worldMapData, worldMapData.objects.countries)])
      .enter()
      .append('path');
    svg.selectAll('path').attr('d', path);
    // Draw meteorites from meteoriteMapData
    svg
      .append('g')
      .attr('class', 'meteorites')
      .selectAll('path')
      .data(meteoriteMapData)
      .enter()
      .append('circle')
      .attr('class', 'meteorite')
      .attr('cx', d => projection(d.geometry.coordinates)[0])
      .attr('cy', d => projection(d.geometry.coordinates)[1])
    // Radius based on mass
      .attr('r', d => Math.floor(radiusScale(d.properties.mass)))
    // Fill color based on year
      .attr('fill', d => `hsla(${d.properties.year.slice(0, 4)}, 80%, 50%, ${opacityScale(d.properties.mass)})`)
    // Tooltips
      .on('mouseover', (d) => {
        if (!window.event.buttons) showTooltip(d.properties, d3.event.x, d3.event.y);
      })
      .on('mouseout', (d) => {
        hideTooltip();
      })
      // Ensure tooltips appear on mobile devices
      .on('click', (d) => {
        showTooltip(d.properties, d3.event.x, d3.event.y);
        setTimeout(hideTooltip, 1000);
      });
  }

  // Move map within boundaries
  function moveMap() {
    // Store translate and scale values from d3 event
    const trans = [d3.event.transform.x, d3.event.transform.y];
    const scale = d3.event.transform.k;

    // Keep translation within boundaries
    trans[0] = Math.min((width / height) * (scale - 1),
      Math.max(width * (1 - scale), trans[0]));
    trans[1] = Math.min((height * (scale - 1)) + ((height / 5) * scale),
      Math.max((height * (1 - scale)) - ((height / 5) * scale), trans[1]));
    // Perform translation
    svg.attr('transform', `translate(${trans}) scale(${scale})`);
  }

  // Zoom/drag functionality
  const zoom = d3.zoom()
    .scaleExtent([1, 9])
    .on('zoom', moveMap);

  // Create centered, correctly sized SVG
  function setupMap(width, height) {
    // Centered, flat map projection
    projection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale((width / 2) / Math.PI);
    path = d3.geoPath().projection(projection);
    // SVG based on size
    svg = d3.select('.map-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'world-map')
      .call(zoom)
      .append('g');
    g = svg.append('g');
    // Draw the map
    drawMap();
  }

  // Redraw map (called upon window resize)
  function redrawMap() {
    // Reset map container size and re-center
    width = container.offsetWidth;
    height = Math.min(width * 0.7, window.innerHeight - 100);
    // Erase and recreate map
    d3.select('svg').remove();
    setupMap(width, height);
    drawMap();
  }

  // Redraw map upon window resize
  d3.select(window).on('resize', redrawMap);

  // Setup map upon page load
  setupMap(width, height);
});
