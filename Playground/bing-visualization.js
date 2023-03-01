// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set the radius of the circles
var radius = 10;

// create an array of objects that represent each category and its percentage
var data = [
  {name: "A", value: 0.2},
  {name: "B", value: 0.3},
  {name: "C", value: 0.1},
  {name: "D", value: 0.25},
  {name: "E", value: 0.15}
];

// create a scale to map each category name to a color
var color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

// create a scale to map each percentage value to a position on the grid
var x = d3.scaleLinear()
    .domain([0, Math.ceil(d3.sum(data, d => d.value))])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, Math.ceil(d3.max(data, d => d.value))])
    .range([height, 0]);

// append the svg object to the body of the page
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append circles for each data point and position them according to the scales
var circles = svg.selectAll("circle")
    .data(data)
  	.enter().append("circle")
    	.attr("cx", (d,i) => x(i))
    	.attr("cy", height)
    	.attr("r", radius)
    	.attr("fill", d => color(d.name));

// add a scroll event listener to make the circles fall down individually as you scroll down
window.addEventListener('scroll', function() {
  
   // get the scroll position in pixels
   var scrollPos = window.scrollY;
  
   // calculate how many circles should fall down based on the scroll position and the circle radius
   var numCircles = Math.floor(scrollPos / (radius * 2));
  
   // select the circles that should fall down and transition them to their final positions with custom tweens
   circles.filter((d,i) => i < numCircles)
      .transition()
      .duration(1000)
      .ease(d3.easeBounceOut)
      .tween('fall', function(d) {
         // get the current circle element and its initial position
         var circle = this;
         var cx0 = circle.getAttribute('cx');
         var cy0 = circle.getAttribute('cy');
        
         // calculate the final position based on the data value and a random offset
         var cx1 = x(d.value) + Math.random() * (width - x(d.value));
         var cy1 = y(d.value);
        
         // return an interpolator function that updates the circle attributes at each step of the transition
         return function(t) {
            // interpolate between initial and final positions using t as a parameter between [0,1]
            var cx = cx0 * (1 - t) + cx1 * t;
            var cy = cy0 * (1 - t) + cy1 * t;
            
            // set the new attributes for the circle element
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
          };
      });
});