//use D3 to create a scatter plot of either healthcare vs poverty or smokers vs age
// (so is this really scatter with circle elements or does that just mean a buble chart?)
//each circle elements represent each state - include the state abbreviations in the circles (abbr[2])
//include axes x In Poverty(%) y Lacks Healthcare (%)
// NOTE will need to use python -m http.server to run the visualization.  This will host the page at localhost:8000 in your web browser
// is this the same as in integrated server after running conda activate PythonData???
//use d3.csv function to pull in the data
//***below based on 3/9  compare this to 3/12  PS nothing currently works with this code */
//***********then see bonus work */

// Load data from .csv
var svgWidth = 960;
var svgHeight = 600;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 100,
      left: 100
    };
    
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

// set the initial parameters for X axis
var chosenXAxis = "poverty";

// provide axis label click functionality to update x-scale
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
          .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
          d3.max(healthData, d => d[chosenXAxis]) * 1.2])
          .range([0, width]);
  return xLinearScale;
}
  
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//set the initial paramaters for Y axis
var chosenYAxis = "healthcare";

// provide axis label click functionality to update x-scale
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
          .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
          d3.max(healthData, d => d[chosenYAxis]) * 1.2])
          .range([0, width]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}  

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    label = "Age (Median)";
  }
  else{
    label = "Household Income (Median)"
  };

   // Initialize tool tip
        var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          //distance from the circle
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
          });
    circlesGroup.call(toolTip);

    circlesGroup.on("mousover", function(data) {
      toolTip.show(data);
    })
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  return circlesGroup;
}
    
    // Import Data
    d3.csv("data.csv").then(function(healthData, err) {
      if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
          healthData.forEach(function(data) {
          data.state = data.state;
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          data.abbr = data.abbr;
        });

        // xLinearScale function above csv import
        var xLinearScale = xScale(healthData, chosenXAxis);
    
        // Create y scale functions
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(healthData, d => d.healthcare)])
          .range([height, 0]);

        // Initial axis function
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append x axis
        var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      // Append y axis
      chartGroup.append("g")
      .call(leftAxis);  

      // Append initial circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");
        
      // Create group for x-axis labels
      var xlabelsGroup = chartGroup.append("g")  
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
      
      // first x axis - poverty
      var povertyLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty")
          .classed("active", true)
          .text("In Poverty (%)");

      //second x axis - age
      var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

      // third x axis of Household Income (Median) "income"  
      var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

      // Create group for y-axis labels
      var ylabelsGroup = chartGroup.append("g")  
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
//****************see original append y axis */
    // first y axis - healthcare
    var healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")  
      .attr("y", 0 - margin.left)
      .attr("x", 20 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare");

    //second y axis - smokes
    var smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")  
      .attr("y", 0 - margin.left)
      .attr("x", 40 - (height / 2))
      .attr("value", "smokes")
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Smokes (%)");

    // third y axis - Obese (%) "obesity"  
    var incomeLabel = xlabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 60 - (height / 2))
      .attr("value", "obesity")
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Obese (%)");

     //**********this is the original y axis coding */   
      // append y axis
      // chartGroup.append("text")
      //   .attr("transform", "rotate(-90)")
      //   .attr("y", 0 - margin.left)
      //   .attr("x", 0 - (height / 2))
      //   //???????????????????  what is "1em" below ?????????????????????
      //   .attr("dy", "1em")
      //   .classed("axis-text", true)
      //   .text("Lacks Healthcare");

      
       // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else if (chosenXAxis === "poverty") {
          ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else if (chosenXAxis === "healthcare") {
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);  
        }
        else {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });  

}).catch(function(error) {
  console.log(error);
});
 