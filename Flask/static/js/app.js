// Creating the map object
let myMap;
// Creating the marker cluster group
let markers = L.markerClusterGroup();

let colorScale = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

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

// Create Bar Chart
function displayGenderChart(){
let fraudPersonalURL = '/api/fraud_personal';

  // Fetch the data from the API endpoint
  fetch(fraudPersonalURL)
    .then(response => response.json()) //Parse the repsonse to Json
    .then(apiData => {
      console.log(apiData)
      // Parse the CSV data using Papa Parse
      const ctx = document.getElementById('genderChart').getContext('2d');

      // Extract male and female data
      let maleCount = 0;
      let femaleCount = 0;

      apiData.forEach(row => {
        if (row.gender === 'M') {
          maleCount++;
        } else if (row.gender === 'F') {
          femaleCount++;
        }
      });
      // Define the data for the bar chart
      const data = {
        labels: ['M', 'F'],
        datasets: [{
          label: 'Number of People',
          data: [maleCount, femaleCount],
          backgroundColor: ['blue', 'pink'],
          borderWidth: 1
        }]
      };
      // Create the bar chart
      const genderChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(maleCount, femaleCount) // Adjust the maximum value if needed
            }
          }
        }
      });
    })
    .catch(error => console.error('Error fetching API data:', error));
}

/// Function to display the stacked bar chart
function displayStackedBarChart() {
  // Define the API endpoint
  let fraudStackedURL = '/api/Fraud_Date';

  // Load the data
  d3.json(fraudStackedURL).then(function(data) {
    console.log(data);
    // Parse the date strings to JavaScript Date objects
    data.forEach(d => {
      d.fraud_date = new Date(d.fraud_date);
      d.amount = +d.amount;
    });

    // Sort the data by date in ascending order (if it's not already sorted)
    data.sort((a, b) => a.fraud_date - b.fraud_date);

    // Extract unique categories
    let categories = Array.from(new Set(data.map(d => d.category)));

    // Format the data in a compatible format for Plot.js
    let stocks = categories.map(category => {
      return {
        Symbol: category,
        ...data.map(d => {
          if (d.category === category) {
            return {
              Date: d.fraud_date,
              Close: d.amount
            };
          } else {
            return {
              Date: d.fraud_date,
              Close: 0 // Fill non-matching categories with 0
            };
          }
        })
      };
    });

    // Create the labeled multi-line chart
    Plot.plot({
      style: "overflow: visible;",
      y: { grid: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(stocks, { x: "fraud_date", y: "amount", stroke: "category" }),
        Plot.text(
          stocks,
          Plot.selectLast({
            x: "fraud_date",
            y: "amount",
            z: "category",
            text: "category",
            textAnchor: "start",
            dx: 3
          })
        )
      ]
    });
  }).catch(error => console.log("Error loading the Labeled Multi-line Chart:", error));
}


let timerInterval;
Swal.fire({
  title: 'Welcome to our Dashboard!',
  html: 'I will autoclose in <b></b> milliseconds.',
  timer: 4000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})

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
    document.getElementById("genderChart").style.display = "none";
    document.getElementById("timelineChartContainer").style.display = "none";
    displayFraudDensityMap();
  } else if (selectedOption === "option2") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("chart-container").style.display = "block"; //Show the chart
    document.getElementById("genderChart").style.display = "none";
    document.getElementById("timelineChartContainer").style.display = "none";
    displayPieChart();
  } else if (selectedOption === "option3") {
    document.getElementById("map").style.display="none"; //Hide the map
    document.getElementById("chart-container").style.display = "none"; //Show the chart
    document.getElementById("genderChart").style.display = "block";
    document.getElementById("timelineChartContainer").style.display = "none";
    displayGenderChart();
  } else if (selectedOption === "option4") {
    document.getElementById("map").style.display="none"; 
    document.getElementById("chart-container").style.display = "none";
    document.getElementById("genderChart").style.display = "none";
    document.getElementById("timelineChartContainer").style.display = "block";
    displayStackedBarChart();
  } else {
    // Hide the map for other options
    document.getElementById("map").style.display = "none";
    document.getElementById("chart-container").style.display = "none"; 
    document.getElementById("genderChart").style.display = "none";
    document.getElementById("StackedBarChart").style.display = "none";
  }
}