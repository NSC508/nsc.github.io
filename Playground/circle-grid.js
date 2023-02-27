// Get a reference to the SVG element
const svg = d3.select("svg");

// Define the number of circles and categories
const numCircles = 100;
const categories = [
  { value: 10, color: "blue" },
  { value: 20, color: "red" },
  { value: 15, color: "green" },
  { value: 5, color: "orange" },
  { value: 50, color: "purple" },
];

// Calculate the animation delay for each circle
const delays = [];
let totalDelay = 0;
for (let i = 0; i < numCircles; i++) {
  const delay = totalDelay.toFixed(1);
  delays.push(delay);
  totalDelay += 1 / numCircles;
}

// Generate the CSS rules for each circle
const style = document.createElement("style");
style.textContent = delays.map((delay, i) => `
  circle:nth-child(${i + 1}) {
    animation-delay: ${delay}s;
  }
`).join("");
document.head.appendChild(style);

// Create the circles
const circles = svg.selectAll("circle")
  .data(d3.range(numCircles))
  .enter()
  .append("circle")
  .attr("cx", (d, i) => (i % 10) * 60 + 50)
  .attr("cy", (d, i) => Math.floor(i / 10) * 60 + 50)
  .attr("r", 20)
  .style("fill", "#ccc");

// Color the circles based on category percentages
let index = 0;
categories.forEach(category => {
  const numCirclesInCategory = Math.round(category.value / 100 * numCircles);
  for (let i = 0; i < numCirclesInCategory; i++) {
    circles.filter((d, j) => j === index)
      .style("fill", category.color);
    index++;
  }
});
