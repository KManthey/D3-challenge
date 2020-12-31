//use D3 to create a scatter plot of either healthcare vs poverty or smokers vs age
// (so is this really scatter with circle elements or does that just mean a buble chart?)
//each circle elements represent each state - include the state abbreviations in the circles (abbr[2])
//include axes x In Poverty(%) y Lacks Healthcare (%)
// NOTE will need to use python -m http.server to run the visualization.  This will host the page at localhost:8000 in your web browser
// is this the same as in integrated server after running conda activate PythonData???
//use d3.csv function to pull in the data
//***below based on 3/9  compare this to 3/12  PS nothing currently works with this code */
//***********then see bonus work */
//NOTE - tooltip function now broken!!

// Load data from .csv
var svgWidth = 960;
var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
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
    d3.csv("data.csv").then(function(healthData) {
         // d3.csv("./data.csv").then(function(Data) {
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        healthData.forEach(function(data) {
          data.state = data.state;
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          data.abbr = data.abbr;
        });
    
        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear().domain([8, d3.max(healthData, d => d.poverty)]).range([0, width]);
        var yLinearScale = d3.scaleLinear().domain([0, d3.max(healthData, d => d.healthcare)]).range([height, 0]);
    
        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
    
        chartGroup.append("g")
          .call(leftAxis);
    
        // Create axes labels
        // x axes 1
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "aText")
          .text("Lacks Healthcare (%)");
          // x axis 2
          chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "aText")
          .text("In Poverty (%)");

        // Step 5: Create Circles
        // ==============================
        let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "17")
        .attr("fill", "blue")
        .attr("opacity", ".85");

        circlesGroup = chartGroup.selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d=> xLinearScale(d.poverty))
        .attr("y",(d,i)=>yLinearScale(d.healthcare))
        .style("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(d=>(d.abbr))

         
        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          //distance from the circle
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
          });
    
        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);
    
        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
  
      }).catch(function(error) {
        console.log(error);
      });

      //***do I need to add some code to the html for the charts??