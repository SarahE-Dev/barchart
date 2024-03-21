import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Fetch the JSON data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const gdpData = data.data;

    console.log(gdpData);
    const margin = { top: 100, right: 30, bottom: 30, left: 60 };
    const width = 1300 - margin.left - margin.right;
    const innerWidth = width - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    
    const svg = d3.select('body')
                  .append('svg')
                  .attr('id', 'title')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);

    const dates = gdpData.map(d=>new Date(d[0]))
    const xScale = d3.scaleTime()
    .domain(d3.extent(dates))
    .range([0, innerWidth]);

    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(gdpData, d => d[1])])
                     .range([height, 0]);


    svg.selectAll('.bar')
       .data(gdpData)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('x', d => xScale(new Date(d[0]) ))
       .attr('y', d => yScale(d[1]))
       .attr('width', 10)
       .attr('height', d => height-yScale(d[1]))
       .style('fill', 'steelblue')
       .attr('data-date', d => d[0]) // Add data-date property
       .attr('data-gdp', d => d[1])  // Add data-gdp property
       .on('mouseover', function(event, d) {
         tooltip.transition()
           .duration(200)
           .style('opacity', .9);
         tooltip.html(`Date: ${d[0]}<br/>GDP: $${d[1]} Billion`)
           .attr('data-date', d[0])
           .style('left', (event.pageX + 10) + 'px')
           .style('top', (event.pageY - 28) + 'px');
       })
       .on('mouseout', () => {
         tooltip.transition()
           .duration(500)
           .style('opacity', 0);
       });

    // Draw x-axis
    svg.append('g')
       .attr('id', 'x-axis') // Add ID for x-axis
       .attr('transform', `translate(0,${height})`)
       .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y%-%d-%m')))
       .selectAll('text')
       .attr('transform', 'rotate(-45)')
       .style('text-anchor', 'end');

    // Draw y-axis
    svg.append('g')
       .attr('id', 'y-axis') // Add ID for y-axis
       .call(d3.axisLeft(yScale));

    // Append a tooltip div
    const tooltip = d3.select('body')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('opacity', 0);

   })
