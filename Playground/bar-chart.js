var data = [];
for (var i = 0; i < 10; i++) {
  data.push(Math.floor(Math.random() * 100));
}

var chartWidth = 1000;
var chartHeight = 1000;

var xScale = d3.scaleBand()
               .domain(d3.range(data.length))
               .range([0, chartWidth])
               .paddingInner(0.05);

var yScale = d3.scaleLinear()
               .domain([0, d3.max(data)])
               .range([chartHeight, 0]);

var svg = d3.select("body")
            .append("svg")
            .attr("class", "chart")
            .attr("width", chartWidth)
            .attr("height", chartHeight);

var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = chartWidth - margin.left - margin.right;
var height = chartHeight - margin.top - margin.bottom;

var chartGroup = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chartGroup.append("text")
          .attr("class", "title")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", -20)
          .text("Bar Chart Title");

var bars = chartGroup.selectAll("rect")
                     .data(data)
                     .enter()
                     .append("rect")
                     .attr("x", function(d, i) {
                       return xScale(i);
                     })
                     .attr("y", chartHeight)
                     .attr("width", xScale.bandwidth())
                     .attr("height", 0)
                     .attr("fill", "steelblue")
                     .on("mouseover", function(d) {
                        d3.select(this).attr("fill", "orange");
                        tooltip.transition()
                               .duration(200)
                               .style("opacity", .9);
                        tooltip.html("Value: " + d)
                               .style("left", (d3.event.pageX) + "px")
                               .style("top", (d3.event.pageY - 28) + "px");
                      })
                     .on("mouseout", function() {
                        d3.select(this).attr("fill", "steelblue");
                        tooltip.transition()
                               .duration(500)
                               .style("opacity", 0);
                      });

var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

chartGroup.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("y", 10)
          .attr("x", 10)
          .attr("text-anchor", "start")
          .attr("transform", "rotate(45)");

chartGroup.append("g")
          .call(d3.axisLeft(yScale)
          .ticks(5)
          .tickSizeInner(-width)
          .tickSizeOuter(0)
          .tickPadding(10)
          );

chartGroup.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom - 10)
          .text("X Axis Label");

chartGroup.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("x", -height / 2)
          .attr("y", -margin.left + 20)
          .attr("transform", "rotate(-90)")
          .text("Y Axis Label");

bars.transition()
    .duration(2500)
    .attr("y", function(d) {
        return yScale(d);
    })
    .attr("height", function(d) {
        return chartHeight - yScale(d);
    });
