// Establish chart dimensions
var margin  = {top:30, right:20, bottom: 30, left:20},
    height  = 600 - margin.top - margin.bottom, 
    width   = 960 - margin.left - margin.right,
    barPadding = 1;

// Color buckets for scores
var color = d3.scale.threshold()
    .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 
             1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1,7, 1.8, 1.9, 2.0])
    .range(["#000000", "#C5F4C8", "#BCECBF", "#B4E3B6", "#ABDBAE",
            "#A2D2A5", "#9ACA9C", "#91C194", "#88B98B", "#80B082",
            "#77A87A", "#6EA071", "#669768", "#5D8F5F", "#548657",
            "#4C7E4E", "#437545", "#3A6D3D", "#326434", "#295C2B" ]);
            
// Synchronously load data
queue() 
    .defer(d3.json, "js/d3/uscounties.min.json")
    //.defer(d3.json, "data/HQ_MSPB/getData.php")
    .defer(d3.json, "data/HQ_MSPB/testdata.json")
    .await(drawChart); 

function drawChart (error, us, MSPB) {

    // Crossfilter dimensions and groups
    var nation      = crossfilter(MSPB),
        byScr       = nation.dimension(function(d){ return d.score; }),
        byScrGrp    = byScr.group().reduceCount()
        byHosp      = nation.dimension(function(d){ return d.FIPS; }); 

    // Scales
    var keys = byScrGrp.all()
            .map(function(d){ return d.key; });

    var xScale = d3.scale.ordinal()
            .domain(keys)
            .rangeBands([0, width], .1);

    var yScale = d3.scale.linear() 
            .domain([0, d3.max(byScrGrp.all(), function (d) {return d.value;})])
            .range([height/2, 0]);

    // bar tool tip
    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) { return  d.value + " hospitals" + "<br/>" + "achieved " + d.key; });

    // brush
    var brush = d3.svg.brush()
            .x(xScale)
            .extent([xScale(.95), xScale(1.05)])
            .on("brush", brushmove);

    var _barChart = d3.select("#histogram").append("svg:svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height/2 + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(tip)

    var brushg = _barChart.append("g")
            .attr("class", "brush")
            .call(brush)

        brushg.selectAll("rect")
            .attr("height", height/2);

        brushg.selectAll(".resize")
            .append("path")
            .attr("d", resizePath);
        
        // Histogram bars
        _barChart.selectAll("rect")
            .data(byScrGrp.all())
            .enter().append("rect")
            .attr("x", function (d) {return xScale(d.key); })
            .attr("width", width / byScrGrp.size() - barPadding)
            .attr("y", function (d) { return yScale(d.value); })
            .attr("height", function (d) { return (height/2 - yScale(d.value)); })
            .attr("fill", function(d){ return color(d.key); })   
            .on("mouseover",  tip.show ) 
            .on("mouseout",  tip.hide )

        // Histogram Title (below)
        _barChart.append("text")
            .attr("x", width/2)
            .attr("y", height/2 + margin.top)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("MSPB Score Distribution");

        // Add Y Axis Label 
        _barChart.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 45)
            .attr("text-anchor", "end")
            .text("Number of Hospitals");

    // Histogram Y Axis 
    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .ticks(5);

        _barChart.append("g")
            .attr("class", "axis")
            .call(yAxis);

    // Histogram X Axis Object
    var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickValues(xScale.domain().filter(function(d,i){ return !(i % 10); }))
            .orient("bottom");
        
        _barChart.append("g")
            .attr("class", "axis")
            .call(xAxis)
            .attr("transform", "translate(0, " + height/2 + ")") ;
        


    // Dark arts of ugly hackery ahead 
    function brushmove() { 
        // Get brush extent vals
        var s = brush.extent(), lower = s[0], upper = s[1];
        // Select bar rects and adjust opacity
        _barChart.selectAll("rect")
            .style("opacity", function(d) {
                // Get data value keys and scale them
                var k = xScale(d.key) + barPadding * xScale.rangeBand();
                // If d.key is within extent adjust opacity
                return lower <= k && k <= upper ? "1" : ".2";  
             });
        
        // Calculate pseudo extent from .range() and .rangeBand()
        var leftEdge = xScale.range(), width = xScale.rangeBand(); 
        for (var _l=0; lower > (leftEdge[_l] + width); _l++) {};
        for (var _u=0; upper > (leftEdge[_u] + width); _u++) {};
        // Filter crossfilter by the pseudo extent
        filt = byScr.filterRange([ xScale.domain()[_l], xScale.domain()[_u] ])
        // Render filtered hospital plots
        _mapChart.selectAll("g.hospital").remove();
        _mapChart.selectAll("g.hospital").transition(); 
        _mapChart.select("g.hospital").attr("d", plotHospitals(filt));

    } // End brushmove





// Choropleth

    // Setup hospital tool tip
    var hosptip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('n')
            .html(function(d){
                return d.hospital + '<br/>' + d.county + ' County' + '<br/>Score: ' + d.score ;
                });

    // Setup county tool tip
    var countytip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('n')
            .html(function(d) {
                    var str1 = ' County', str2 = 'No data', cty = '', scr = '';

                    MSPB.forEach(function(e){
                    if (+e.FIPS == d.id) { 
                        cty = e.county;
                        scr = e.score;
                        }  
                    });

                    if (!scr && !cty) {
                        return str2 ;
                    } else {
                        return cty.concat(str1) + '<br/>Avg. Score: ' + scr;
                    };
                });

    var projection = d3.geo.albersUsa()
            .scale(1000)
            .translate([width/2 , height/2]);

    var path = d3.geo.path().projection(projection);

    var _mapChart = d3.select("#choropleth").append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .call(hosptip)
            .call(countytip);;

        _mapChart.append("g")
            .attr("id", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                var numerator = 0, denominator = 0;
                MSPB.forEach(function(e) { 
                    if (+e.FIPS == d.id) {
                        numerator += e.score; denominator++;
                        } else {
                        numerator += 0; denominator += 0;
                        };
                    });

                    // Calc County AVG score
                    if (!denominator) {   // Check for Div by Zero Nan
                        denominator = 1; return color(numerator/denominator);
                        } else {
                        return color(numerator/denominator);
                        };
                })
            .on("mouseover", countytip.show)
            .on("mouseout", countytip.hide);    
            
        // Draw State borders
        _mapChart.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) { 
                return a !== b; 
                }))
            .attr("id", "state-borders")
            .attr("d", path);
            

var initialFilt = byScr.filterRange([0.9,1.1]).top(Infinity);

plotHospitals(initialFilt);

function plotHospitals(data){

    // Plot hospitals    
    var hospital= _mapChart.selectAll("g.hospital")
            .data(byHosp.top(Infinity))
            .enter().append("g")
            .attr("class", "hospital")
            .attr("transform", function(d) { 
                return "translate(" + projection([d.longitude, d.latitude]) + ")"; 
                });

        hospital.append("circle")
            .attr("r", 3)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("fill", "red")
            .style("opacity", 0.75)
            .on('mouseover',hosptip.show)
            .on('mouseout', hosptip.hide);

} // END plotHospitals FUNC



} // End drawChart


function resizePath(d) {
        // Style the brush resize handles. No idea what these vals do.
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 4; // Relative positon if handles
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
