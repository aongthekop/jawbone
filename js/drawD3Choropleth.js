queue()
    .defer(d3.json, "/js/d3/uscounties.json")
    .defer(d3.json, "data/HQ_MSPB/getHQ_MSPB.php")
    .await(ready)

function ready(error, us, MSPB) {
// Set container width + height
var w = 960, h = 600;

// Define the map projection
var projection = d3.geo.albersUsa()
        .scale(1280)
        .translate([w/2 , h/2]);
        
// Define path generator
var path = d3.geo.path()
        .projection(projection);

// Setup hospital tool tip
var hosptip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .direction('n')
        .html(function(d){
            return d.hospital + ', ' + d.county + ' County' + ' (' + d.score + ')' ;
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
                    return cty.concat(str1) + ' (' + scr + ')';
                };
            });

// Create SVG element
var svg = d3.select("#choropleth").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .call(hosptip)
        .call(countytip);

// Define scale to sort data into color buckets
var color = d3.scale.threshold()
        .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 
                1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1,7, 1.8, 1.9, 2.0])
        .range(["#CEFDD1", "#C5F4C8", "#BCECBF", "#B4E3B6", "#ABDBAE",
                "#A2D2A5", "#9ACA9C", "#91C194", "#88B98B", "#80B082",
                "#77A87A", "#6EA071", "#669768", "#5D8F5F", "#548657",
                "#4C7E4E", "#437545", "#3A6D3D", "#326434", "#295C2B",
                "#215423"
                ]);

// Draw Counties
var g = svg.append("g");
    g.append("g")
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

// Draw State Borders
    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) { 
            return a !== b; 
            }))
        .attr("id", "state-borders")
        .attr("d", path);

// Plot hospitals    

var hospital= svg.selectAll("g.hospital")
    .data(MSPB)
    .enter().append("g")
    .attr("class", "hospital")
    .attr("transform", function(d) { 
        return "translate(" + projection([d.longitude, d.latitude]) + ")"; 
        });

    hospital.append("circle")
    .attr("r", 2)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .style("fill", "red")
    .style("opacity", 0.75)
    .on('mouseover',hosptip.show)
    .on('mouseout', hosptip.hide);






       


} // END ready FUNCTION
