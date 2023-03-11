// Define width and height of SVG
var width = 400;
var height = 200;

// Append SVG element to div
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Append tooltip div to body
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); // Hide the tooltip by default

// Read data from a CSV file and return a promise
var promise = d3.csv("data.csv");

// Use then() method to access the data when it is resolved
promise.then(function(data) {
  // Filter the data to only keep the QCASTEb column and remove NaN values
  var filteredData = data.map(d => +d.QCASTEb).filter(d => !Number.isNaN(d));

  // Define histogram function
  var histogram = d3.histogram()
      .domain([0, 1]) // Set domain to match QCASTEb range
      .thresholds(10); // Set number of bins

  // Bin the data using histogram function
  var bins = histogram(filteredData);

  // Set scale for x-axis using continuous domain
  var xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);

  // Set scale for y-axis using bin counts
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([height, 0]);

  // Create bars using bins instead of filteredData
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.x0)) // Use lower bound of bin as x coordinate
      .attr("y", d => yScale(d.length)) // Use bin count as y coordinate
      .attr("width", d => xScale(d.x1) - xScale(d.x0)) // Use bin width as bar width
      .attr("height", d => height - yScale(d.length)) // Use bin count as bar height
      .attr("fill", "steelblue")

      /* Add mouseover event handler */
      /* This function will be called when the mouse enters a bar */
      /* The 'this' keyword refers to the current bar element */
      /* The 'd' parameter refers to the current bin object */
      
      /* Show and position the tooltip with the data value */
      /* Show and position the tooltip with the data value */
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 1); // Show the tooltip
        tooltip.html(d.length) // Set the tooltip text to the bin count
            .style("left", (d3.pointer(this)[0] + 10) + "px") // Use d3.pointer(this)[0] instead of d3.event.pageX
            .style("top", (d3.pointer(this)[1] - 10) + "px"); // Use d3.pointer(this)[1] instead of d3.event.pageY
    })

    /* Add mouseout event handler */
    /* This function will be called when the mouse leaves a bar */
    
    /* Hide the tooltip */
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0); // Hide the tooltip
    });
});

// Use catch() method to handle errors when they are rejected
promise.catch(function(error) {
// Do something with error
console.error(error);
});