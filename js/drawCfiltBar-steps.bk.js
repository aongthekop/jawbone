
    var parseDate = d3.time.format("%m/%d/%Y").parse;

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", 
                      "August", "September", "October", "November", "December" ];

d3.json("data/cfilt-steps.json", function(d) {

        margin  = {top:5, right:5, bottom: 40, left:5},
        height  = 150 - margin.top - margin.bottom, 
        width = 500 - margin.left - margin.right, 
        barPadding = 1;

    d.forEach(function(d) {
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value;
        });
    
    var stepColor = d3.scale.threshold()
        .domain([100, 150, 200, 250, 300, 400, 500])
        .range(["#E3E3E3", "#D0DFD2", "#C3DABC", "#BDCB87", "#CAB44E", "#E29517", "#FF6600"]);

    var steps    = crossfilter(d),
        
        monthdim = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); }),
        monthgrp = monthdim.group().reduceSum(function(d){ return d.value; });
        
      //  daydim   = steps.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getDay(); }),
      //  daygrp   = daydim.group().reduceSum( function(d) { return d.value; });

    var xScale = d3.scale.ordinal()
        .domain(monthdim)
        .range(0, width);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(monthgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    var stepTip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return monthNames[d.key] + " " + d.value/2000 + " miles"; });

    var stepbars = d3.select("#steps-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .call(stepTip)

        stepbars.selectAll("rect")
            .data(monthgrp.all())
            .enter().append("rect")
            .attr("x", function(d,i){ return i * width/monthgrp.size(); })
            .attr("y", function(d){ return yScale(d.value); })
            .attr("width", width/monthgrp.size() - barPadding)
            .attr("height", function(d) { return height-yScale(d.value); })
            .attr("fill", function(d){ return stepColor(d.value/2000); })
            .on("mouseover",  stepTip.show ) 
            .on("mouseout",  stepTip.hide );
        // Bar month letter label
        stepbars.selectAll("text")
            .data(monthgrp.all())
            .enter().append("text")
            .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return yScale(d.value) + 15 })
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .html(function(d){ return monthNames[d.key].substring(0,1); })

});

/*
d3.json("data/cfilt-sleep.json", function(d) {

        margin  = {top:5, right:5, bottom: 50, left:5},
        height  = 150 - margin.top - margin.bottom, 
        width = 500 - margin.left - margin.right, 
        barPadding = 1;

    d.forEach(function(d) {
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        d.date = parseDate(d.date); d.value = +d.value/60;
        });
    
    var sleepColor = d3.scale.threshold()
        .domain([50, 100, 125, 225])
        .range(["#F2F1Fe", "#B8B1DA", "#7E72B7", "#453394"]);

    var sleep= crossfilter(d),
        monthdim = sleep.dimension(function(d){ thisDate = new Date(d.date); return thisDate.getMonth(); }),
        monthgrp = monthdim.group().reduceSum(function(d){return d.value;});

    var xScale = d3.scale.ordinal()
        .domain(monthdim)
        .range(0, width);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(monthgrp.all(), function(d){return d.value;})])
        .range([height, 5]);

    var sleepTip= d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return monthNames[d.key] + " " + Math.round(d.value) + " hours"; });

    var sleepbars = d3.select("#sleep-bar")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .call(sleepTip)

        sleepbars.selectAll("rect")
            .data(monthgrp.all())
            .enter().append("rect")
            .attr("x", function(d,i){ return i * width/monthgrp.size(); })
            .attr("y", function(d){ return yScale(d.value); })
            .attr("width", width/monthgrp.size() - barPadding)
            .attr("height", function(d) { return height-yScale(d.value); })
            .attr("fill", function(d){ return sleepColor(d.value); })
            .on("mouseover",  sleepTip.show ) 
            .on("mouseout",  sleepTip.hide );
        // Bar month letter label
        sleepbars.selectAll("text")
            .data(monthgrp.all())
            .enter().append("text")
            .attr("x", function(d,i){ return i* (width/monthgrp.size()) + (width/monthgrp.size() - barPadding) /2 ; })
            .attr("y", function(d){ return yScale(d.value) + 15 })
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .html(function(d){ return monthNames[d.key].substring(0,1); })

});

*/
