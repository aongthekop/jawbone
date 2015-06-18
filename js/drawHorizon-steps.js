
d3.json("data/horizon-steps.json", function(error, data) {

        // Override default color scale
        color = d3.scale.linear()
            .domain([-1, 0, 0, 1])
            .range(["##BDCB87", "#DDD696", "#E29517", "#FF3300"]);

        margin = { top: 5, right: 5, bottom: 5, left: 5 };
        height = 75 - margin.top - margin.bottom;
        width = (document.getElementById("horizon-steps").offsetWidth) - margin.left - margin.right;
        barPadding = 1;

        data.forEach(function(d) {
                parseDate = d3.time.format("%Y-%m-%d").parse;
                d.date = parseDate(d.date);
                d.value = Math.round(+d.value);
        });

        xScale = d3.time.scale()
                .domain(d3.extent(data, function(d) {
                        return d.date;
                }))
                .range([0, width]);

        yScale = d3.scale.linear()
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

        mean = Math.round(d3.mean(data, function(d) {
                return d.value;
        }));
        // center data on the mean        
        data.forEach(function(d) {
                d.value = d.value - mean;
        });
        // Convert date from UTC to Unix Epoch time
        data = data.map(function(obj) {
                return [obj.date.getTime(), obj.value];
        });

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
        color = d3.scale.linear()
            .domain([-1, 0, 0, 1])
            .range(["#AAC6C2", "#2D87AE", "#1C61A3", "#453485"]);

        margin = { top: 5, right: 5, bottom: 5, left: 5 };
        height = 75 - margin.top - margin.bottom;
        width = (document.getElementById("horizon-sleep").offsetWidth) - margin.left - margin.right;
        barPadding = 1;

        data.forEach(function(d) {
                parseDate = d3.time.format("%Y-%m-%d").parse;
                d.date = parseDate(d.date);
                d.value = Math.round(+d.value);
        });

        xScale = d3.time.scale()
                .domain(d3.extent(data, function(d) {
                        return d.date;
                }))
                .range([0, width]);

        yScale = d3.scale.linear()
                .range([height, 0]);

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

        mean = Math.round(d3.mean(data, function(d) {
                return d.value;
        }));
        // center data on the mean        
        data.forEach(function(d) {
                d.value = d.value - mean;
        });
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

