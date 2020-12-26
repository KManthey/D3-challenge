// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window. - window is the entire browswer screen
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // data
  var pizzasEatenByMonth = [15, 5, 25, 18, 12, 22, 0, 4, 15, 10, 21, 2];

  // append svg and group
  var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    //everything to be displayed is grouped together
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // scales
  var xScale = d3.scaleLinear()
    .domain([0, pizzasEatenByMonth.length])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(pizzasEatenByMonth)])
    .range([height, 0]);

  // line generator
  var line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d));

  // create path
  chartGroup.append("path")
    .attr("d", line(pizzasEatenByMonth))
    .attr("fill", "none")
    .attr("stroke", "blue");

  //create the sape for the data points...this is a circle
    // append circles to data points
  var circlesGroup = chartGroup.selectAll("circle")
    .data(pizzasEatenByMonth)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(i))
    .attr("cy", d => yScale(d))
    .attr("r", "5")
    .attr("fill", "red");
//default of none is set in css file

  // Step 1: Append a div to the body to create tooltips, assign it a class
  // =======================================================
  var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip");

  // Step 2: Add an onmouseover event to display a tooltip
  //mouseout event shows tooltip  mouseout is the display function - show is block
  // ========================================================
  circlesGroup.on("mouseover", function(d, i) {
    toolTip.style("display", "block");
    //block here is in a container so it will only cover the parent and not the whole window
    toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
      .style("left", d3.event.pageX + "px")
      //pageX will give the value of - want to push to where the pointer is moving
      .style("top", d3.event.pageY + "px");
  })
    // Step 3: Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
//could be used to trigger other events besides resize
d3.select(window).on("resize", makeResponsive);
