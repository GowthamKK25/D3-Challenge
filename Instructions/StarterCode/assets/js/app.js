// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper and append to group with the set margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import and format to numerical values
d3.csv("assets/data/data.csv").then(function(CensusData) {
  CensusData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
    // console.log(data);
  });

  //Create Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(CensusData, x => x.age))
    .range([0, width])
    .nice(); //makes the intersection of axes crisp

  const yScale = d3.scaleLinear()
    .domain([6,d3.max(CensusData, y => y.smokes)])
    .range([height, 0])
    .nice();
  
  //Create Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);


// Append axes to the chartGroup
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  
  chartGroup.append("g").call(yAxis);

//Generate scatter plot
chartGroup.selectAll("circle")
.data(CensusData)
.enter()
.append("circle")
.attr("cx", x=>xScale(x.age))
.attr("cy", y=>yScale(y.smokes))
.attr("r", "9.5")
.attr("stroke-width", "1.5")
.classed("stateCircle", true)
.attr("opacity", 0.80);

//add texts to each datapoint
chartGroup.append("g")
  .selectAll('text')
  .data(CensusData)
  .enter()
  .append("text")
  .text(t=>t.abbr)
  .attr("x",t=>xScale(t.age))
  .attr("y",t=>yScale(t.smokes))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");
  
  //add axes titles
  chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 12})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        chartGroup.append("text")
        .attr("y", 0 - ((margin.left / 2) + 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Smokers (%)");
}).catch(function(error) {
  console.log(error);
});
