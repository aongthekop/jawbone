
d3.json("data/cfilt-steps.json", function(d) {

var monthNames  = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December" ];

var dayNames    = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                "Fridays", "Saturdays", "Sundays"];

    d.forEach(function(d) {
        parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value;
        });

    margin      = {top:5, right:5, bottom: 40, left:5};
    height      = 150 - margin.top - margin.bottom; 
    width       = 500 - margin.left - margin.right; 
    barPadding  = 1;

    steps    = crossfilter(d);
    
    monthdim = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); });
    
    monthgrp = monthdim.group().reduceSum(function(d){ return d.value; });
    
    daydim   = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getDay(); });
    
    daygrp   = daydim.group().reduceSum( function(d) { return d.value; });

    stepColor = d3.scale.threshold()
        .domain([100, 150, 200, 250, 300, 400, 500])
        .range(["#E3E3E3", "#D0DFD2", "#C3DABC", "#BDCB87", "#CAB44E", "#E29517", "#FF6600"]);

    dayYscale= d3.scale.linear()
        .domain([0, d3.max(daygrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    monthYscale = d3.scale.linear()
        .domain([0, d3.max(monthgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    d3.select("#monthly-steps-previous-selector")
        .on("click", function(d) {reDrawSteps(monthgrp.all(), monthYscale, "monthly"); })   

    d3.select("#monthly-steps-next-selector")
        .on("click", function(d) {reDrawSteps(daygrp.all(), dayYscale, "daily"); })    

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return Math.round(d.value/2000) + " miles"; });

    svg_steps = d3.select("#steps-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .call(tip);

    svg_steps.selectAll("rect")
        .data(monthgrp.all())
        .enter().append("rect")
        .attr("x", function(d,i){ return i * width / monthgrp.size(); })
        .attr("y", function(d){ return monthYscale(d.value); })
        .attr("width", width / monthgrp.size() - barPadding)
        .attr("height", function(d) { return height - monthYscale(d.value); })
        .attr("fill", function(d){ return stepColor(d.value/2000); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    svg_steps.selectAll("text")
        .data(monthgrp.all())
        .enter().append("text")
        .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
        .attr("y", function(d){ return monthYscale(d.value) + 15 })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .html(function(d){ return monthNames[d.key].substring(0,1); })

    function reDrawSteps(data, scale, flag) {

        monthNames  = ["January", "February", "March", "April", "May", "June", "July", 
                        "August", "September", "October", "November", "December" ];

        dayNames    = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                        "Fridays", "Saturdays", "Sundays"];

        margin      = {top:5, right:5, bottom: 40, left:5};
        height      = 150 - margin.top - margin.bottom; 
        width       = 500 - margin.left - margin.right; 
        barPadding  = 1;

        svg_steps.selectAll("rect")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i * width / data.length; })
            .attr("y", function(d){ return scale(d.value); })
            .attr("width", width / data.length - barPadding)
            .attr("height", function(d) { return height - scale(d.value); })
            .attr("fill", function(d){ return stepColor(d.value/60); })
           
        if (flag=="monthly") {
          svg_steps.selectAll("text")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .text(function(d){ return monthNames[d.key].substring(0,1); })
            };
        
        if (flag=="daily") {
          svg_steps.selectAll("text")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i* (width/daygrp.size()) + (width/daygrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .text(function(d){ return dayNames[d.key].substring(0,1); })
            };

    } //End reDraw


});





d3.json("data/cfilt-sleep.json", function(d) {

    monthNames  = ["January", "February", "March", "April", "May", "June", "July", 
                   "August", "September", "October", "November", "December" ];

    dayNames    = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                   "Fridays", "Saturdays", "Sundays"];

    margin      = {top:5, right:5, bottom: 40, left:5};
    height      = 150 - margin.top - margin.bottom; 
    width       = 500 - margin.left - margin.right; 
    barPadding  = 1;
 
    d.forEach(function(d) {
        parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value;
        });

    margin      = {top:5, right:5, bottom: 40, left:5},
    height      = 150 - margin.top - margin.bottom, 
    width       = 500 - margin.left - margin.right, 
    barPadding  = 1;

    sleep    = crossfilter(d);
    monthdim = sleep.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); });
    monthgrp = monthdim.group().reduceSum(function(d){ return d.value; });
    daydim   = sleep.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getDay(); });
    daygrp   = daydim.group().reduceSum( function(d) { return d.value; });

    stepColor = d3.scale.threshold()
        .domain([50, 100, 125, 225])
        .range(["#F2F1Fe", "#B8B1DA", "#7E72B7", "#453394"]); 

    dayYscale= d3.scale.linear()
        .domain([0, d3.max(daygrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    monthYscale = d3.scale.linear()
        .domain([0, d3.max(monthgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    d3.select("#monthly-sleep-previous-selector")
        .on("click", function(d) {reDrawSleep(monthgrp.all(), monthYscale, "monthly"); })   

    d3.select("#monthly-sleep-next-selector")
        .on("click", function(d) {reDrawSleep(daygrp.all(), dayYscale, "daily"); })    

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return Math.round(d.value/60) + " hours"; });

    svg_sleep = d3.select("#sleep-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .call(tip);

    svg_sleep.selectAll("rect")
        .data(monthgrp.all())
        .enter().append("rect")
        .attr("x", function(d,i){ return i * width / monthgrp.size(); })
        .attr("y", function(d){ return monthYscale(d.value); })
        .attr("width", width / monthgrp.size() - barPadding)
        .attr("height", function(d) { return height - monthYscale(d.value); })
        .attr("fill", function(d){ return stepColor(d.value/60); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    svg_sleep.selectAll("text")
        .data(monthgrp.all())
        .enter().append("text")
        .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
        .attr("y", function(d){ return monthYscale(d.value) + 15 })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .html(function(d){ return monthNames[d.key].substring(0,1); })

    function reDrawSleep(data, scale, flag) {

        monthNames  = ["January", "February", "March", "April", "May", "June", "July", 
                        "August", "September", "October", "November", "December" ];

        dayNames    = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", 
                        "Fridays", "Saturdays", "Sundays"];

                        margin      = {top:5, right:5, bottom: 40, left:5};
        height      = 150 - margin.top - margin.bottom; 
        width       = 500 - margin.left - margin.right; 
        barPadding  = 1;

        svg_sleep.selectAll("rect")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i * width / data.length; })
            .attr("y", function(d){ return scale(d.value); })
            .attr("width", width / data.length - barPadding)
            .attr("height", function(d) { return height - scale(d.value); })
            .attr("fill", function(d){ return stepColor(d.value/60); })
           
        if (flag=="monthly") {
          svg_sleep.selectAll("text")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .text(function(d){ return monthNames[d.key].substring(0,1); })
            };
        
        if (flag=="daily") {
          svg_sleep.selectAll("text")
            .transition().duration(1500)
            .attr("x", function(d,i){ return i* (width/daygrp.size()) + (width/daygrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return scale(d.value) + 15 })
            .text(function(d){ return dayNames[d.key].substring(0,1); })
            };
      } //End reDraw




});






