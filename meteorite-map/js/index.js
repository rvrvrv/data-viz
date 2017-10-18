// Return top-left and bottom-right boundaries of projection
function mercatorBounds(projection, maxLat) {
  return [projection([(-projection.rotate()[0] - 180) + 1e-6, maxLat]),
    projection([(-projection.rotate()[0] + 180) - 1e-6, -maxLat])];
}

document.addEventListener('DOMContentLoaded', () => {
  // Initial vars
  const width = window.innerWidth * 0.95;
  const height = window.innerHeight * 0.8;
  const maxLat = 83;

  // Centered map projection
  const projection = d3
    .geoMercator()
    .rotate([60, 0])
    .scale(1)
    .translate([width / 2, height / 2]);

  // Initial boundaries and scale setup
  let bounds = mercatorBounds(projection, maxLat);
  const scale = width / (bounds[1][0] - bounds[0][0]);
  const scaleExtent = [scale, 10 * scale];
  projection.scale(scale);
  const path = d3.geoPath().projection(projection);

  // Zoom and drag functionality
  const zoom = d3.zoom()
    .scaleExtent(scaleExtent)
    .on('zoom', drawMap);

  // Create SVG based on size props
  const svg = d3.selectAll('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'world-map')
    .call(zoom);

    // Draw world map from data
  svg
    .append('g')
    .attr('class', 'land')
    .selectAll('path')
    .data([topojson.feature(worldMapData, worldMapData.objects.land)])
    .enter()
    .append('path');
  svg
    .append('g')
    .attr('class', 'boundary')
    .selectAll('boundary')
    .data([topojson.feature(worldMapData, worldMapData.objects.countries)])
    .enter()
    .append('path');

  let lastScaleEvt = null;
  let lastTransEvt = [0, 0];

  // Draw map (called upon page load and at zoom/drag)
  function drawMap() {
    // If zooming/dragging map, perform appropriate operation
    if (d3.event) {
      // Store translation coordinates
      const transEvt = { x: d3.event.transform.x, y: d3.event.transform.y };
      // Prevent scale from reverting to 1
      const scaleEvt = (d3.event.transform.k === 1) ? scale : d3.event.transform.k;
      // If scale changes, perform zoom only (ignore translation)
      if (scaleEvt !== lastScaleEvt) projection.scale(scaleEvt);
      else {
        // Calculate translation from drag
        const dx = transEvt.x - lastTransEvt.x;
        let dy = transEvt.y - lastTransEvt.y; // Reassignable to stay within boundaries
        const yaw = projection.rotate()[0];
        const transProj = projection.translate();
        // Infinite map roll
        projection.rotate([yaw + ((((360 * dx) / width) * scaleExtent[0]) / 150), 0, 0]);
        // Keep map within boundaries
        bounds = mercatorBounds(projection, maxLat);
        if (bounds[0][1] + dy > 0) dy = -bounds[0][1];
        else if (bounds[1][1] + dy < height) dy = height - bounds[1][1];
        // Perform translation
        projection.translate([transProj[0], transProj[1] + dy]);
      }
      // Save most recent events
      lastScaleEvt = scaleEvt;
      lastTransEvt = transEvt;
    }
    // Project path data (draw the map)
    svg.selectAll('path')
      .attr('d', path);
  }
  drawMap();
});
