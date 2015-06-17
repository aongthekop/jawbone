var margin  = {top:5, right:5, bottom:5, left:5},
    height  = 75 - margin.top - margin.bottom, 
    width   = 1100 - margin.left - margin.right,
    barPadding = 1;

var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.linear()
    .domain([-1, 0, 0, 1])
    //.range(["#08519c", "#bdd7e7", "#bae4b3", "#006d2c"]);
    .range(["#E3E3E3", "#DDD696", "#E2DB84", "#E7A471" ]);

// Steps Chart
var chart1 = d3.horizon()
    .width(width)
    .height(height)
    .bands(2)
    .mode("offset")
    .interpolate("basis");
// Sleep Chart
var chart2 = d3.horizon()
    .width(width)
    .height(height)
    .bands(2)
    .mode("offset")
    .interpolate("cardinal");
// Steps conatainer
var svg1 = d3.select("#steps-horizon").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Sleep container
var svg2 = d3.select("#sleep-horizon").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("data/horizon-steps.json", function(error, data) {
    // Cast strings to UTC dates and INTs
    data.forEach(function(d) {
            parseDate = d3.time.format("%Y-%m-%d").parse;
            d.date = parseDate(d.date); 
            d.value = Math.round(+d.value);     
            });
    // Calculate an AVG
    var mean = Math.round(d3.mean(data, function(d){ return d.value; }));
    // Center the value around the AVG
    data.forEach(function(d) {
            d.value = d.value - mean; 
            });
    // Convert date from UTC to Unix Epoch time
    data = data.map(function(obj) {
            return [obj.date.getTime(), obj.value];
            });
    svg1.data([data]).call(chart1);
});


d3.json("data/horizon-sleep.json", function(error, data) {
    // Cast strings to UTC dates and INTs
    data.forEach(function(d) {
            parseDate = d3.time.format("%Y-%m-%d").parse;
            d.date = parseDate(d.date); 
            d.value = Math.round(+d.value);     
            });
    // Calculate an AVG
    var mean = Math.round(d3.mean(data, function(d){ return d.value; }));
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
