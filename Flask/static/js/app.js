// Function to display the fraud density map
function displayFraudDensityMap() {
  // Define the JSON URL
  let fraudAddressURL = '/api/fraud_address';
  // Load the JSON data using d3
  d3.json(fraudAddressURL).then(function(data) {

    let latObj = data.lat;
    let longObj = data.long;

    let myMap = L.map("map", {
      center: [37.0902, -95.7129], // Centered on the United States
      zoom: 4 // Zoom level adjusted to show the entire country
    });
  
    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    let markers = L.markerClusterGroup();
    for (let i = 0; i < 500000; i++) {
      let marker = L.marker([latObj[i], longObj[i]])
      markers.addLayer(marker)
    }

    myMap.addLayer(markers);
  }).catch(error => console.log("Error loading JSON data:", error));
}

//Function to Dislay the stacked bar chart
function displayPieChart(){

  //Define the API endpoint
  let fraudMerchURL = '/api/Fraud_Merch';

  //Load the data
  d3.json(fraudMerchURL).then(function(data) { 
    //Parse the data
    data.forEach(d => {
      d.amt = +d.amt;
    });

    //Select the char container element
    let chartContainer = d3.select("#pieChart");

    //Clear the existing chart
    chartContainer.html("");

    // Append the chart to the chart container
    let svg = chartContainer.append("svg")
        .attr("width", 900)
        .attr("height", 400)

    var width = svg.attr("width"),
        height = svg.attr("height"),
        radius = 200;
       
        var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Step 4
var colorScale = d3.scaleOrdinal()
               .domain(data.map(d => d.category))
               .range(['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72', '#b3e8ef', '#fcd5b5', '#e7c7f3', '#a3e2bd', '#fbb1b9', '#f4c2c2', '#d0e1f9', '#f6d9aa', '#80deea', '#ffb74d', '#ce93d8', '#aed581', '#ff8a65', '#81d4fa', '#fff176']);


// Step 5
var pie = d3.pie().value(function(d) { 
     return d.amt; 
 });

var arc = g.selectAll("arc")
        .data(pie(data))
        .enter();

// Step 6
var path = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);

arc.append("path")
.attr("d", path)
.attr("fill", function(d) { return colorScale(d.data.category); });


var legend = svg.append("g")
  .attr("transform", "translate(" + (width - 200) + ", 20)");

var legendItems = legend.selectAll(".legend-item")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

legendItems.append("rect")
  .attr("x", 0)
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", d => colorScale(d.category));

legendItems.append("text")
  .attr("x", 15)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .text(d => d.category);

    }).catch(error => console.log("Error loading the Pie chart:", error));
}

// Function to Dislay the stacked bar chart
function displayBarChart(){
  //Define the API endpoint
  let fraudMultipleURL = '/api/Multiple_fraud';

  // Load the CSV data using fetch
  d3.json(fraudMultipleURL).then(function(data) {

    // Extract the "first," "last," and "count" columns
    var firstNames = data.map((currElem, index) => index)//row => row.first + ' ' + row.last);
    var counts = data.map(row => parseInt(row.count));

    //Select the char container element
    let barChartContainer = d3.select("#myBarChart");

    //Clear the existing chart
    barChartContainer.html("");

    const ctx = document.getElementById('myBarChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: firstNames,
        datasets: [{
          label: 'Count of Multiple Fraud',
          data: counts,
          // backgroundColor: 'rgba(75, 192, 192, 0.6)',
          // borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
  });
});
}


// Function to handle dropdown menu selection change event
function optionChanged(selectedOption) {
  if (selectedOption === "option1") {
    // Display Fraud Density Map
    document.getElementById("map").style.display = "block"; // Show the map
    document.getElementById("pieChart").style.display = "none"; // Hide the chart
    document.getElementById("barChart").style.display = "none";
    displayFraudDensityMap();
  } else if (selectedOption === "option2") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("pieChart").style.display = "block"; //Show the chart
    document.getElementById("barChart").style.display = "none";
    displayPieChart();
  } else if (selectedOption === "option3") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("pieChart").style.display = "none"; //Show the chart
    document.getElementById("barChart").style.display = "block";
    displayBarChart();
  } else {
    // Hide the map for other options
    document.getElementById("map").style.display = "none";
    document.getElementById("pieChart").style.display = "none"; 
    document.getElementById("barChart").style.display = "none";
  }
}