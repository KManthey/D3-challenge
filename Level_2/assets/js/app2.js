//use D3 to create a scatter plot of either healthcare vs poverty or smokers vs age
// (so is this really scatter with circle elements or does that just mean a buble chart?)
//each circle elements represent each state - include the state abbreviations in the circles (abbr[2])
//include axes x In Poverty(%) y Lacks Healthcare (%)
// NOTE will need to use python -m http.server to run the visualization.  This will host the page at localhost:8000 in your web browser
// is this the same as in integrated server after running conda activate PythonData???
//use d3.csv function to pull in the data
//***below based on 3/9  compare this to 3/12  PS nothing currently works with this code */
//NOTE tooltip and state abbrev not working!!

// Load data from .csv
var svgWidth = 960;
var svgHeight = 800;
    
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

// Import Data
d3.csv("data.csv").then(function(healthData, err) {
  if (err) throw err;

// Parse Data/Cast as numbers
      healthData.forEach(function(data) {
      data.state = data.state;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.abbr = data.abbr;
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

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
function renderxAxes(newXScale, xAxis) {
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
          .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
console.log(circlesGroup)
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}  

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  if (chosenXAxis === "poverty") {
    xlabel = "In Poverty (%)"
    }
  else if (chosenXAxis === "age") {
    xlabel = "Age (Median)"
  }
  else{
    xlabel = "Household Income (Median)"
  };

  var ylabel;
  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare"
  }
  else if (chosenYAxis === "smokes") {
      ylabel = "Smokes (%)";
  }
  else{
    ylabel = "Obese (%)"
  }; 
  console.log(xlabel)

   // Initialize tool tip
        var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          //distance from the circle
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
          });
    circlesGroup.call(toolTip);
    console.log("after line 143")
    circlesGroup.on("mouseover", function(data) {
      console.log(data)
      toolTip.show(data, this);
    })
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });
  return circlesGroup;
}
      // xLinearScale function above csv import
        var xLinearScale = xScale(healthData, chosenXAxis);
    
        // Create y scale functions
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(healthData, d => d[chosenYAxis])])
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
      var yAxis = 
      chartGroup.append("g")
      .call(leftAxis);  

       
      // Create group for x-axis labels
      var xlabelsGroup = chartGroup.append("g")  
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
      
      // first x axis - poverty
      // note x and y are directional attributes vs actual axis that is why set padding on y instead of x
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
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);
//****************see original append y axis */
    // first y axis - healthcare
    var healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")  
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare");

    //second y axis - smokes
    var smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")  
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Smokes (%)");

     // Append initial circles 
    // third y axis - Obese (%) "obesity"  
    var obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
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
      //   .attr("dy", "1em")
      //   .classed("axis-text", true)
      //   .text("Lacks Healthcare");
      
      let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        // .append("text")
        .attr("opacity", ".5")
        // .style("font-size", "15px")
        // .style("text-anchor", "middle")
        // .style("fill", "white")
        // .text(d=>(d.abbr));
        //added this for the state abbreviation text within the circle - this works in L1, but breaks everything in L2 - move to different location
        let stateLabels = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d=> xLinearScale(d[chosenXAxis]))
        .attr("y", (d, i)=> yLinearScale(d[chosenYAxis]))
        .style("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(d=>(d.abbr));  
      
      function renderAbbr (stateLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis) {
        stateLabels.transition().duration(1000)
        .attr("x", d=> xLinearScale(d[chosenXAxis]))
        .attr("y", (d, i)=> yLinearScale(d[chosenYAxis]))
        return stateLabels();
      }

       // updateToolTip function above csv import
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
  // x axis labels event lisener
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
        xAxis = renderxAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // update state labels
        stateLabels = renderAbbr (stateLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

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
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderyAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // update state labels
        stateLabels = renderAbbr (stateLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // Active axis in bold text - made changes to these 
        if (chosenYAxis === "healthcare") {
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }  
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
      }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
    }
  }
  });  

}).catch(function(error) {
  console.log(error);
});
 