var margin  = {top:5, right:5, bottom:5, left:5},
    height  = 150 - margin.top - margin.bottom, 
    width   = (document.getElementById("steps-horizon").offsetWidth)  - margin.left - margin.right,
    barPadding = 1;

var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

// Sleep Chart
var chart2 = d3.horizon()
    .width(width)
    .height(height)
    .bands(2)
    .mode("offset")
    .interpolate("cardinal");

// Sleep container
var svg2 = d3.select("#sleep-horizon").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/horizon-sleep.json", function(error, data) {

    color = d3.scale.linear()
    .domain([-1, 0, 0, 1])
    .range(["#6AA8B4", "#2D87AE", "#1C61A3"]);

    // Cast strings to UTC dates and INTs
    data.forEach(function(d) {
            parseDate = d3.time.format("%Y-%m-%d").parse;
            d.date = parseDate(d.date); 
            d.value = Math.round(+d.value);     
            });
    // Calculate an AVG
    mean = Math.round(d3.mean(data, function(d){ return d.value; }));
    // Center the value around the AVG
    data.forEach(function(d) {
            d.value = d.value - mean; 
            });
    // Convert date from UTC to Unix Epoch time
    data = data.map(function(obj) {
            return [obj.date.getTime(), obj.value];
            });
    svg2.data([data]).call(chart2);
});
