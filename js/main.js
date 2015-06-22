/***************************************/ 
/*    SECTION 1 STREAM GRAPHS          */
/***************************************/ 

queue()
        .defer(d3.json, "data/stream-steps.json")
        .await(drawStreamSteps);

function drawStreamSteps(error, data) {

        divheight   = $('#streams').height();

        divwidth    = $('#streams').width();

        margin      = { top: 20, right: 50, bottom: 20, left: 30 };

        width       = divwidth - margin.left - margin.right;

        height      = (divheight / 2) - margin.top - margin.bottom;

        colorrange  = ["#CAB44E", "#E29517", "#FF6600"];

        parseDate   = d3.time.format("%m/%d/%Y").parse;

        datearray   = [];

        x           = d3.time.scale().range([0, width]);

        y           = d3.scale.linear().range([height, 0]);

        z           = d3.scale.ordinal().range(colorrange);

        xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(d3.time.years);

        yAxis = d3.svg.axis().scale(y);

        nest = d3.nest()
                .key(function(d) {
                        return d.key;
                });

        data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.value = +d.value;
        });

        assignDefaultValues(data);

        stack = d3.layout.stack()
                .offset("silhouette")
                .values(function(d) {
                        return d.values;
                })
                .x(function(d) {
                        return d.date;
                })
                .y(function(d) {
                        return d.value;
                });

        layers = stack(nest.entries(data));

        area_stp = d3.svg.area()
                .interpolate("basis")
                .x(function(d) {
                        return x(d.date);
                })
                .y0(function(d) {
                        return y(d.y0);
                })
                .y1(function(d) {
                        return y(d.y0 + d.y);
                });

        svg_str_stp = d3.select("#stream-steps").append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        layers = stack(nest.entries(data));

        x.domain(d3.extent(data, function(d) {
                return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
                return d.y0 + d.y;
        })]);

        svg_str_stp.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", "layer")
                .attr("d", function(d) {
                        return area_stp(d.values);
                })
                .attr("transform", "translate(8, 0)")
                .style("fill", function(d, i) {
                        return z(i);
                });

        svg_str_stp.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(8," + height + ")")
                .attr("class", "axis")
                .call(xAxis);

        svg_str_stp.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(8, 0)")
                .call(yAxis.orient("left"));

        tooltip = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "20")
                .style("visibility", "hidden")
                .style("top", "150px")
                .style("left", (divwidth / 2) + "px");

        strokecolor = '#FFF';

        svg_str_stp.selectAll(".layer")
                .attr("opacity", .5)
                .on("mouseover", function(d, i) {
                        svg_str_stp.selectAll(".layer").transition()
                                .duration(250)
                                .attr("opacity", function(d, j) {
                                        return j != i ? 0.5 : 1;
                                })
                })
                .on("mousemove", function(d, i) {
                        mousex = d3.mouse(this);
                        mousex = mousex[0];
                        var invertedx = x.invert(mousex);
                        invertedx = invertedx.getMonth() + invertedx.getDate();
                        var selected = (d.values);
                        for (var k = 0; k < selected.length; k++) {
                                datearray[k] = selected[k].date;
                                datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
                        }

                        mousedate = datearray.indexOf(invertedx);
                        pro = d.values[mousedate].value;

                        d3.select(this)
                                .classed("hover", true)
                                .attr("stroke", strokecolor)
                                .attr("stroke-width", "0.5px"),

                                tooltip.html("<p>" + d.key + ": " + pro + "</p>")
                                .style("visibility", "visible");

                })
                .on("mouseout", function(d, i) {
                        svg_str_stp.selectAll(".layer")
                                .transition()
                                .duration(250)
                                .attr("opacity", "1");
                        d3.select(this)
                                .classed("hover", false)
                                .attr("stroke-width", "0px"),
                                tooltip.html("<p>" + d.key + ": " + pro + "</p>")
                                .style("visibility", "hidden");
                })

        vertical = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "19")
                .style("width", "1px")
                .style("height", divheight)
                .style("top", "100px")
                .style("bottom", "0px")
                .style("left", "0px")
                .style("background", "#fff");

        d3.select("#streams")
                .on("mousemove", function() {
                        mousex = d3.mouse(this);
                        vertical.style("left", ( mousex[0]) + "px")
                })
                .on("mouseover", function() {
                        mousex = d3.mouse(this);
                        vertical.style("left", ( mousex[0]) + "px")
                });


} // End draw steps stream 

queue()
        .defer(d3.json, "data/stream-sleep.json")
        .await(drawStreamSleep);

function drawStreamSleep(error, data) {

        divheight   = $('#streams').height();

        divwidth    = $('#streams').width(),

        margin      = { top: 20, right: 50, bottom: 20, left: 30 };

        width       = divwidth - margin.left - margin.right;

        height      = (divheight / 2) - margin.top - margin.bottom;

        colorrange  = ["#6AA8B4", "#2D87AE", "#1C61A3"];

        parseDate   = d3.time.format("%m/%d/%Y").parse;

        datearray   = [];

        x           = d3.time.scale().range([0, width]);

        y           = d3.scale.linear().range([height, 0]);

        z           = d3.scale.ordinal().range(colorrange);

        yAxis       = d3.svg.axis().scale(y);

        yAxisr      = d3.svg.axis().scale(y);

        nest = d3.nest()
                .key(function(d) {
                        return d.key;
                });

        data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.value = +d.value;
        });

        assignDefaultValues(data);

        stack = d3.layout.stack()
                .offset("silhouette")
                .values(function(d) {
                        return d.values;
                })
                .x(function(d) {
                        return d.date;
                })
                .y(function(d) {
                        return d.value;
                });

        layers = stack(nest.entries(data));

        area_slp = d3.svg.area()
                .interpolate("basis")
                .x(function(d) {
                        return x(d.date);
                })
                .y0(function(d) {
                        return y(d.y0);
                })
                .y1(function(d) {
                        return y(d.y0 + d.y);
                });

        svg_str_slp = d3.select("#stream-sleep").append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + ",0)");

        layers = stack(nest.entries(data));

        x.domain(d3.extent(data, function(d) {
                return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
                return d.y0 + d.y;
        })]);

        svg_str_slp.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", "layer")
                .attr("d", function(d) {
                        return area_slp(d.values);
                })
                .attr("transform", "translate(8, 0)")
                .style("fill", function(d, i) {
                        return z(i);
                });

        svg_str_slp.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(8, 0)")
                .call(yAxis.orient("left"));

        tooltip = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "20")
                .style("visibility", "hidden")
                .style("top", "150px")
                .style("left", (divwidth / 2) + "px");

        strokecolor = '#FFF';

        svg_str_slp.selectAll(".layer")
                .attr("opacity", .5)
                .on("mouseover", function(d, i) {
                        svg_str_slp.selectAll(".layer").transition()
                                .duration(250)
                                .attr("opacity", function(d, j) {
                                        return j != i ? 0.5 : 1;
                                })
                })
                .on("mousemove", function(d, i) {
                        mousex = d3.mouse(this);
                        mousex = mousex[0];
                        var invertedx = x.invert(mousex);
                        invertedx = invertedx.getMonth() + invertedx.getDate();
                        var selected = (d.values);
                        for (var k = 0; k < selected.length; k++) {
                                datearray[k] = selected[k].date;
                                datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
                        }

                        mousedate = datearray.indexOf(invertedx);
                        pro = d.values[mousedate].value;

                        d3.select(this)
                                .classed("hover", true)
                                .attr("stroke", strokecolor)
                                .attr("stroke-width", "0.5px"),

                                tooltip.html("<p>" + d.key + ": " + pro + "</p>")
                                .style("visibility", "visible");

                })
                .on("mouseout", function(d, i) {
                        svg_str_slp.selectAll(".layer")
                                .transition()
                                .duration(250)
                                .attr("opacity", "1");
                        d3.select(this)
                                .classed("hover", false)
                                .attr("stroke-width", "0px"),
                                tooltip.html("<p>" + d.key + ": " + pro + "</p>")
                                .style("visibility", "hidden");
                })

        vertical = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "19")
                .style("width", "1px")
                .style("height", divheight)
                .style("top", "100px")
                .style("bottom", "-175px")
                .style("left", "0px")
                .style("background", "#fff");

        d3.select("#streams")
                .on("mousemove", function() {
                        mousex = d3.mouse(this);
                        vertical.style("left", ( mousex[0]) + "px")
                })
                .on("mouseover", function() {
                        mousex = d3.mouse(this);
                        vertical.style("left", ( mousex[0]) + "px")
                });


} // End draw sleep strame

/*  Helper Func populates and pads missing dates & data */

// http://stackoverflow.com/questions/14713503/how-to-handle-layers-with-missing-data-points-in-d3-layout-stack
function assignDefaultValues(dataset) {
        defaultValue = 0;
        keys = ['Group1', 'Group2', 'Group3'];
        hadData = [true, true, true];
        newData = [];
        previousdate = new Date();
        sortByDate = function(a, b) {
                return a.date > b.date ? 1 : -1;
        };

        dataset.sort(sortByDate);
        dataset.forEach(function(row) {
                if (row.date.valueOf() !== previousdate.valueOf()) {
                        for (var i = 0; i < keys.length; ++i) {
                                if (hadData[i] === false) {
                                        newData.push({
                                                key: keys[i],
                                                value: defaultValue,
                                                date: previousdate
                                        });
                                }
                                hadData[i] = false;
                        }
                        previousdate = row.date;
                }
                hadData[keys.indexOf(row.key)] = true;
        });
        for (i = 0; i < keys.length; ++i) {
                if (hadData[i] === false) {
                        newData.push({
                                key: keys[i],
                                value: defaultValue,
                                date: previousdate
                        });
                }
        }
        return dataset.concat(newData).sort(sortByDate);
}

/***************************************/ 
/*      SECTION 2 CAL-HEATMAP          */
/***************************************/ 


d3.json("data/cal-heatmap-steps.json", function(d) {

        var cal1 = new CalHeatMap();
        cal1.init({
                itemSelector: "#steps",
                itemNamespace: "cal1",
                data: d,
                afterLoadData: parse,
                itemName: ["step"],
                dataType: "json",
                range: 1,
                domain: "year",
                subDomain: "day",
                start: new Date(2015, 0),
                minDate: new Date(2013, 0),
                maxDate: new Date(2015, 0),
                cellSize: 7,
                previousSelector: "#steps-previous-selector",
                nextSelector: "#steps-next-selector",
                animationDuration: 1500,
                tooltip: true,
                displayLegend: true,
                legendHorizontalPosition: "left",
                legendVerticalPosition: "top",
                legend: [2500, 5000, 10000, 15000, 20000, 25000],
                legendColors: ["#e3e3e3", "#ff6600"]
        });

});

d3.json("data/cal-heatmap-sleep.json", function(d) {

        var cal2 = new CalHeatMap();
        cal2.init({
                itemSelector: "#sleep",
                itemNamespace: "cal2",
                data: d,
                afterLoadData: parse,
                itemName: ["mins slept"],
                dataType: "json",
                range: 1,
                domain: "year",
                subDomain: "day",
                start: new Date(2015, 0),
                minDate: new Date(2013, 0),
                maxDate: new Date(2015, 0),
                cellSize: 7,
                previousSelector: "#sleep-previous-selector",
                nextSelector: "#sleep-next-selector",
                animationDuration: 1500,
                tooltip: true,
                displayLegend: true,
                legendHorizontalPosition: "left",
                legendVerticalPosition: "top",
                legend: [50, 100, 150, 200, 250],
                legendColors: ["#e3e3e3", "#453485"]
        });

});

// Post procesing formatting
var parse = function(data) {
        var stats = {};
        for (var d in data) {
                stats[+data[d].date] = Math.round(+data[d].value);
        }
        return stats;
}




/***************************************/ 
/*      SECTION 3 HORIZON CHARTS       */
/***************************************/


d3.json("data/horizon-steps.json", function(error, data) {

        // Override default color scale in horizon.js
        color       = d3.scale.linear().domain([-1, 0, 0, 1]) 
                        .range(["##BDCB87", "#DDD696", "#E29517", "#FF3300"]);

        margin      = { top: 5, right: 5, bottom: 5, left: 5 };

        height      = 75 - margin.top - margin.bottom;
        
        width       = (document.getElementById("horizon-steps").offsetWidth) - margin.left - margin.right;
        
        barPadding  = 1;


        xScale      = d3.time.scale()
                        .domain(d3.extent(data, function(d) { return d.date; }))
                        .range([0, width]);

        yScale      = d3.scale.linear()
                        .range([height, 0]);

        horizon_stp = d3.horizon()
                        .width(width)
                        .height(height)
                        .bands(4)
                        .mode("offset")
                        .interpolate("basis");

        svg_hor_stp = d3.select("#horizon-steps").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
                parseDate = d3.time.format("%Y-%m-%d").parse;
                d.date = parseDate(d.date);
                d.value = Math.round(+d.value);
        });

        mean    = Math.round(d3.mean(data, function(d) { return d.value; }));

        // center data on the mean        
        data.forEach(function(d) { d.value = d.value - mean; });

        // Convert date from UTC to Unix Epoch time
        data = data.map(function(obj) { return [obj.date.getTime(), obj.value]; });

        svg_hor_stp
                .data([data])
                .attr("opacity", .5)
                .on("mouseover", function(d, i) {
                        svg_hor_stp.selectAll("path")
                                .transition()
                                .duration(150)
                                .attr("opacity", function(d, j) {
                                        return j != i ? 1 : 0.25;
                                });

                })
                .on("mouseout", function(d, i) {
                        svg_hor_stp.selectAll("path")
                                .transition()
                                .duration(150)
                                .attr("opacity", "1");
                })
                .call(horizon_stp);

        // X Axis Object
        var hor_xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.years)
                .orient("bottom");

        svg_hor_stp.append("g")
                .attr("class", "axis")
                .call(hor_xAxis)

});


d3.json("data/horizon-sleep.json", function(error, data) {

        // Override default color scale
        color       = d3.scale.linear().domain([-1, 0, 0, 1])
                        .range(["#AAC6C2", "#2D87AE", "#1C61A3", "#453485"]);

        margin      = { top: 5, right: 5, bottom: 5, left: 5 };
        
        height      = 75 - margin.top - margin.bottom;
        
        width       = (document.getElementById("horizon-sleep").offsetWidth) - margin.left - margin.right;
        
        barPadding  = 1;



        xScale      = d3.time.scale()
                        .domain(d3.extent(data, function(d) { return d.date; }))
                        .range([0, width]);

        yScale      = d3.scale.linear().range([height, 0]);

        horizon_slp = d3.horizon()
                        .width(width)
                        .height(height)
                        .bands(4)
                        .mode("offset")
                        .interpolate("basis");

        svg_hor_slp = d3.select("#horizon-sleep").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        data.forEach(function(d) {
                parseDate = d3.time.format("%Y-%m-%d").parse;
                d.date = parseDate(d.date);
                d.value = Math.round(+d.value);
        });

        mean = Math.round(d3.mean(data, function(d) { return d.value; }));

        // center data on the mean        
        data.forEach(function(d) { d.value = d.value - mean; });

        // Convert date from UTC to Unix Epoch time
        data = data.map(function(obj) {
                return [obj.date.getTime(), obj.value];
        });

        svg_hor_slp
                .data([data])
                .attr("opacity", .5)
                .on("mouseover", function(d, i) {
                        svg_hor_slp.selectAll("path")
                                .transition()
                                .duration(150)
                                .attr("opacity", function(d, j) {
                                        return j != i ? 1 : 0.25;
                                });

                })
                .on("mouseout", function(d, i) {
                        svg_hor_slp.selectAll("path")
                                .transition()
                                .duration(150)
                                .attr("opacity", "1");
                })
                .call(horizon_slp);

        // X Axis Object
        var hor_xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.years)
                .orient("bottom");

        svg_hor_slp.append("g")
                .attr("class", "axis")
                .call(hor_xAxis)

});



/***************************************/ 
/*      SECTION 4 BAR CHARTS           */
/***************************************/

d3.json("data/cfilt-steps.json", function(d) {

    d.forEach(function(d) {
        parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value;
        });
    
    mNames_stp  = ["January", "February", "March", "April", "May", "June", "July", 
                    "August", "September", "October", "November", "December" ],

    dNames_stp  = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                    "Fridays", "Saturdays" ];

    margin      = {top:5, right:50, bottom: 40, left:5};
    
    height      = 125 - margin.top - margin.bottom; 
    
    width       = 500 - margin.left - margin.right; 
    
    barPadding  = 1;

    steps       = crossfilter(d);
    
    monthdim    = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); });
    
    mgrp_stp    = monthdim.group().reduceSum(function(d){ return d.value; });
    
    daydim      = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getDay(); });
    
    dgrp_stp    = daydim.group().reduceSum( function(d) { return d.value; });

    mYscale_stp = d3.scale.linear()
        .domain([0, d3.max(mgrp_stp.all(), function(d){return d.value;})])
        .range([height, 5]);

    dYscale_stp= d3.scale.linear()
        .domain([0, d3.max(dgrp_stp.all(), function(d){return d.value;})])
        .range([height, 5]);

    dColor_stp = d3.scale.threshold() // Daily color scale
        .domain([500000, 550000, 580000, 600000, 700000, 900000, 1300000])
        .range(["#E3E3E3", "#D0DFD2", "#C3DABC", "#BDCB87", "#CAB44E", "#E29517", "#FF6600"]);

    mColor_stp = d3.scale.threshold() // Monthly color scale
        .domain([100000, 200000, 300000, 400000, 500000, 600000, 900000])
        .range(["#E3E3E3", "#D0DFD2", "#C3DABC", "#BDCB87", "#CAB44E", "#E29517", "#FF6600"]);

    d3.select("#monthly-steps-selector")
        .on("click", function(d) { // Monthly Event listener
            svg_steps.selectAll("rect.stepbars")
                .remove();
            svg_steps.selectAll("text.steptext")
                .remove();
            svg_steps.selectAll("rect.stepbars")
                .attr("d", reDrawStepBars(mgrp_stp.all(), mYscale_stp, mColor_stp) );
            svg_steps.selectAll("text.steptext")
                .attr("d", reDrawStepText(mgrp_stp.all(), mYscale_stp, mNames_stp) );
        });

    d3.select("#daily-steps-selector")
        .on("click", function(d) { // Daily Event listener 
            svg_steps.selectAll("rect.stepbars")
                .remove();
            svg_steps.selectAll("text.steptext")
                .remove();
            svg_steps.selectAll("rect.stepbars")
                .attr("d", reDrawStepBars(dgrp_stp.all(), dYscale_stp, dColor_stp) );
            svg_steps.selectAll("text.steptext")
                .attr("d", reDrawStepText(dgrp_stp.all(), dYscale_stp, dNames_stp) );
        });

    svg_steps = d3.select("#steps-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);
    
    svg_steps.selectAll("rect.stepbars")
        .data(mgrp_stp.all())
        .enter().append("rect")
        .attr("class", "stepbars")
        .attr("x", function(d,i){ return i * width / mgrp_stp.size(); })
        .attr("y", function(d){ return mYscale_stp(d.value); })
        .attr("width", width / mgrp_stp.size() - barPadding)
        .attr("height", function(d) { return height - mYscale_stp(d.value); })
        .attr("fill", function(d){ return mColor_stp(d.value); });

    svg_steps.selectAll("text.steptext")
        .data(mgrp_stp.all())
        .enter().append("text")
        .attr("class", "steptext")
        .attr("x", function(d,i){ return i* (width/mgrp_stp.size()) + (width/mgrp_stp.size() - barPadding) /2 ; })
        .attr("y", function(d){ return mYscale_stp(d.value) + 15 })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .html(function(d){ return mNames_stp[d.key].substring(0,1); })

    function reDrawStepBars(data, scale, colorscale) {

        svg_steps.selectAll("rect.stepbars")
            .data(data)
            .enter().append("rect")
            .attr("class", "stepbars")
            .attr("x", function(d,i){ return i * width / data.length; })
            .attr("y", function(d){ return scale(d.value); })
            .attr("width", width / data.length - barPadding)
            .attr("height", function(d) { return height - scale(d.value); })
            .attr("fill", function(d){ console.log(d.value) ; return colorscale(d.value); });
    }; 

    function reDrawStepText(data, scale, names) {
   
        svg_steps.selectAll("text.steptext")
            .data(data)
            .enter().append("text")
            .attr("class", "steptext")
            .attr("x", function(d,i){ return i* (width/data.length) + (width/data.length - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .html(function(d){ return names[d.key].substring(0,1); });

    };

});

d3.json("data/cfilt-sleep.json", function(d) {

    d.forEach(function(d) {
        parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value;
        });
    
    mNames      = ["January", "February", "March", "April", "May", "June", "July", 
                    "August", "September", "October", "November", "December" ],

    dNames      = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                    "Fridays", "Saturdays" ];

    margin      = {top:5, right:50, bottom: 40, left:5};
    
    height      = 125 - margin.top - margin.bottom; 
    
    width       = 500 - margin.left - margin.right; 
    
    barPadding  = 1;

    sleep    = crossfilter(d);
    
    monthdim = sleep.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); });
    
    mgrp = monthdim.group().reduceSum(function(d){ return d.value; });
    
    daydim   = sleep.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getDay(); });
    
    dgrp   = daydim.group().reduceSum( function(d) { return d.value; });

    mYscale = d3.scale.linear()
        .domain([0, d3.max(mgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    dYscale= d3.scale.linear()
        .domain([0, d3.max(dgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    d3.select("#monthly-sleep-selector")
        .on("click", function(d) { 
            svg_sleep.selectAll("rect.sleepbars")
                .remove();
            svg_sleep.selectAll("text.sleeptext")
                .remove();
            svg_sleep.selectAll("rect.sleepbars")
                .attr("d", redrawSleepBars(mgrp.all(), mYscale, mColor) );
            svg_sleep.selectAll("text.sleeptext")
                .attr("d", reDrawSleepText(mgrp.all(), mYscale, mNames) );
        });

    d3.select("#daily-sleep-selector")
        .on("click", function(d) { 
            svg_sleep.selectAll("rect.sleepbars")
                .remove();
            svg_sleep.selectAll("text.sleeptext")
                .remove();
            svg_sleep.selectAll("rect.sleepbars")
                .attr("d", redrawSleepBars(dgrp.all(), dYscale, dColor) );

            svg_sleep.selectAll("text.sleeptext")
                .attr("d", reDrawSleepText(dgrp.all(), dYscale, dNames) );
        });

    dColor = d3.scale.threshold()
        .domain([180, 190, 200, 210, 220, 230])
        .range(["#E3E3E3", "#AAC6C2", "#6AA8B4", "#2D87AE", "#1C61A3E", "#453485"]);

    mColor = d3.scale.threshold()
        .domain([100, 200, 250, 300, 400, 500])
        .range(["#E3E3E3", "#AAC6C2", "#6AA8B4", "#2D87AE", "#1C61A3E", "#453485"]);

    svg_sleep = d3.select("#sleep-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);
    
    svg_sleep.selectAll("rect.sleepbars")
        .data(mgrp.all())
        .enter().append("rect")
        .attr("class", "sleepbars")
        .attr("x", function(d,i){ return i * width / mgrp.size(); })
        .attr("y", function(d){ return mYscale(d.value); })
        .attr("width", width / mgrp.size() - barPadding)
        .attr("height", function(d) { return height - mYscale(d.value); })
        .attr("fill", function(d){ return mColor(d.value / 60); });

    svg_sleep.selectAll("text.sleeptext")
        .data(mgrp.all())
        .enter().append("text")
        .attr("class", "sleeptext")
        .attr("x", function(d,i){ return i* (width/mgrp.size()) + (width/mgrp.size() - barPadding) /2 ; })
        .attr("y", function(d){ return mYscale(d.value) + 15 })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .html(function(d){ return mNames[d.key].substring(0,1); })

    function redrawSleepBars(data, scale, colorscale) {

        svg_sleep.selectAll("rect.sleepbars")
            .data(data)
            .enter().append("rect")
            .attr("class", "sleepbars")
            .attr("x", function(d,i){ return i * width / data.length; })
            .attr("y", function(d){ return scale(d.value); })
            .attr("width", width / data.length - barPadding)
            .attr("height", function(d) { return height - scale(d.value); })
            .attr("fill", function(d){ return colorscale(d.value / 60); });
    }; 

    function reDrawSleepText(data, scale, names) {
   
        svg_sleep.selectAll("text.sleeptext")
            .data(data)
            .enter().append("text")
            .attr("class", "sleeptext")
            .attr("x", function(d,i){ return i* (width/data.length) + (width/data.length - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .html(function(d){ return names[d.key].substring(0,1); });

    };

});


