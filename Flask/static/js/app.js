// Creating the map object
let myMap;
// Creating the marker cluster group
let markers = L.markerClusterGroup();

// Function to initialize the map
function initializeMap() {
  myMap = L.map("map", {
    center: [37.0902, -95.7129], // Centered on the United States
    zoom: 4 // Zoom level adjusted to show the entire country
  });

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
}

// Function to display the fraud density map
function displayFraudDensityMap() {
  // Define the JSON URL
  let fraudAddressURL = '/api/fraud_address';
  // Load the JSON data using d3
  d3.json(fraudAddressURL).then(function(data) {
    console.log(Object.keys(data))
    let latObj = data.lat;
    let longObj = data.long;
    console.log(latObj)
    console.log(longObj)
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
  d3.json(fraudMerchURL).then(function(data){ 
    //Parse the data
    data.forEach(d=> {
      d.amt= +d.amt;
    });

    //Create D3 Pie Layout
    pie = d3.pie()
      .value(d=>d.amt)
      .sort(null);

    //Specify the colors for the pie slices
    let colorScale = d3.scaleOrdinal()
      .domain(data.map(d=>d.category))
      .range(d3.schemeCategory10);

    //Select the char container element
    let chartContainer = d3.select("#chart");

    //Clear the existing chart
    chartContainer.html("");

    // Append the chart to the chart container
    let svg = chartContainer.append("svg")
      .attr("width", 800)
      .attr("height", 800)
      .append("g")
      .attr("transform", "translate (400, 400)");
    
    //Generate the pie slices
    let arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    //Add the pie slices as pie elements
    arcs.append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(150))
      .attr("fill", d=> colorScale(d.data.category))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    //Add legend
    let legend = svg.selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate (250,${i*25})`);

    legend.append("rect")
      .attr("x", -18)
      .attr("y", -10)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d=> colorScale(d.category));

    legend.append("text")
      .attr("x", 15)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d=> d.category);    
    }).catch(error => console.log("Error loading the Pie chart:", error));
}

// Function to Dislay the stacked bar chart
function displayBarChart(){
  //Define the API endpoint
  let fraudMultipleURL = '/api/Multiple_fraud';

  // Load the CSV data using fetch
  d3.json(fraudMultipleURL).then(function(csvData){ 
    // Parse the CSV data into an array of objects
    const data = Papa.parse(csvData, { header: true }).data;
    // Extract the "first," "last," and "count" columns
    const firstNames = data.map(row => row.first + ' ' + row.last);
    const counts = data.map(row => parseInt(row.count));
    // Create the bar chart using Chart.js
    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: firstNames,
        datasets: [{
          label: 'Count',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: false
      }
  });
});
}


// Function to handle dropdown menu selection change event
function optionChanged(selectedOption) {
  if (selectedOption === "option1") {
     // Initialize the map if it's not already initialized
     if (!myMap) {
      initializeMap();
    }
    // Display Fraud Density Map
    document.getElementById("map").style.display = "block"; // Show the map
    document.getElementById("chart-container").style.display = "none"; // Hide the chart
    document.getElementById("barChart").style.display = "none";
    displayFraudDensityMap();
  } else if (selectedOption === "option2") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("chart-container").style.display = "block"; //Show the chart
    document.getElementById("barChart").style.display = "none";
    displayPieChart();
  } else if (selectedOption === "option3") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("chart-container").style.display = "none"; //Show the chart
    document.getElementById("barChart").style.display = "block";
    displayBarChart();
  } else {
    // Hide the map for other options
    document.getElementById("map").style.display = "none";
    document.getElementById("chart-container").style.display = "none"; 
    document.getElementById("barChart").style.display = "none";
  }
}