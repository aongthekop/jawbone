// http://stackoverflow.com/questions/14713503/how-to-handle-layers-with-missing-data-points-in-d3-layout-stack
function assignDefaultValues( dataset )
{
    defaultValue = 0;
    keys = [ 'Group1' , 'Group2', 'Group3' ];
    hadData = [ true, true, true];
    newData = [];
    previousdate = new Date();
    sortByDate = function(a,b){ return a.date > b.date ? 1 : -1; };

    dataset.sort(sortByDate);
    dataset.forEach(function(row){
        if(row.date.valueOf() !== previousdate.valueOf()){
            for(var i = 0 ; i < keys.length ; ++i){
                if(hadData[i] === false){
                    newData.push( { key: keys[i], 
                                   value: defaultValue, 
                                   date: previousdate });
                }
                hadData[i] = false;
            }
            previousdate = row.date;
        }
        hadData[keys.indexOf(row.key)] = true; 
    });
    for( i = 0 ; i < keys.length ; ++i){
        if(hadData[i] === false){
            newData.push( { key: keys[i], value: defaultValue, 
                            date: previousdate });
        }
    }
    return dataset.concat(newData).sort(sortByDate);
}


queue()
    .defer(d3.json, "data/stream-steps.json")
    .await(drawStreamSteps);

function drawStreamSteps (error, data) {

        divheight   = $('#streams').height(),
        
        divwidth    = $('#streams').width()

        margin      = {top: 20, right: 80, bottom: 20, left: 30},
        
        width       = divwidth  - margin.left - margin.right,
        
        height      = (divheight/2) - margin.top - margin.bottom;

        colorrange  = ["#CAB44E", "#E29517", "#FF6600"];

        parseDate   = d3.time.format("%m/%d/%Y").parse;

        datearray   = [];

        x = d3.time.scale().range([0, width]);

        y = d3.scale.linear().range([height, 0]);

        z = d3.scale.ordinal().range(colorrange);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.years);

    yAxis = d3.svg.axis().scale(y);

    yAxisr = d3.svg.axis().scale(y);
    
    nest = d3.nest()
        .key(function(d) { return d.key; });

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value= +d.value;
        });

    assignDefaultValues(data);

    stack = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    layers = stack(nest.entries(data));

    area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    svg = d3.select("#streamgraph-steps").append("svg")
        .attr("width", width - margin.left - margin.right) 
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    layers = stack(nest.entries(data));

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
         .data(layers)
         .enter().append("path")
         .attr("class", "layer")
         .attr("d", function(d) { return area(d.values); })
         .attr("transform", "translate(3, 0)")
         .style("fill", function(d, i) { return z(i); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(3," + height + ")")
        .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(3, 0)")
            .call(yAxis.orient("left"));

    tooltip = d3.select("#streams")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", "250px")
            .style("left", (divwidth/2)+"px");

    strokecolor = '#FFF';

    svg.selectAll(".layer")
            .attr("opacity", .5)
            .on("mouseover", function(d, i) {
                svg.selectAll(".layer").transition()
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

              tooltip.html( "<p>" + d.key + ": " + pro + "</p>" )
                .style("visibility", "visible");
      
            })
            .on("mouseout", function(d, i) {
                 svg.selectAll(".layer")
                      .transition()
                      .duration(250)
                      .attr("opacity", "1");
                  d3.select(this)
                      .classed("hover", false)
                      .attr("stroke-width", "0px"), 
                  tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" )
                      .style("visibility", "hidden");
          })
            


    vertical = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "19")
                .style("width", "1px")
                //.style("height", "380px")
                .style("height", divheight)
                .style("top", "175px")
                .style("bottom", "0px")
                .style("left", "0px")
                .style("background", "#fff");

    d3.select("#streams")
              .on("mousemove", function(){  
                   mousex = d3.mouse(this);
                   vertical.style("left", (45 + mousex[0]) + "px" )
                 })
              .on("mouseover", function(){  
                   mousex = d3.mouse(this);
                   vertical.style("left", (45 + mousex[0]) + "px")
              });


} // End draw Func Steps


queue()
    .defer(d3.json, "data/stream-sleep.json")
    .await(drawStreamSleep);

function drawStreamSleep (error, data) {

        divheight   = $('#streams').height(),
        
        divwidth    = $('#streams').width(),
        
        margin      = {top: 20, right: 80, bottom: 20, left: 30},

        width       =  divwidth - margin.left - margin.right,

        height      = (divheight/2) - margin.top - margin.bottom,

        colorrange  = ["#6AA8B4", "#2D87AE", "#1C61A3"],

        parseDate   = d3.time.format("%m/%d/%Y").parse,

        datearray   = [],

    x = d3.time.scale().range([0, width]);

    y = d3.scale.linear().range([height, 0]);

    z = d3.scale.ordinal().range(colorrange);

    yAxis = d3.svg.axis().scale(y);

    yAxisr = d3.svg.axis().scale(y);
    
    nest = d3.nest()
        .key(function(d) { return d.key; });

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value= +d.value;
        });

    assignDefaultValues(data);

    stack = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    layers = stack(nest.entries(data));

    area2 = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    svg2 = d3.select("#streamgraph-sleep").append("svg")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)"); 
        
    layers = stack(nest.entries(data));

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    svg2.selectAll(".layer")
          .data(layers)
          .enter().append("path")
          .attr("class", "layer")
          .attr("d", function(d) { return area2(d.values); })
          .attr("transform", "translate(3, 0)")
          .style("fill", function(d, i) { return z(i); });

    svg2.append("g")
          .attr("class", "y axis")
           .attr("transform", "translate(3, 0)")
          .call(yAxis.orient("left"));

    tooltip = d3.select("#streams")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", "250px")
            .style("left", (divwidth/2)+"px");

    strokecolor = '#FFF';

    svg2.selectAll(".layer")
            .attr("opacity", .5)
            .on("mouseover", function(d, i) {
                svg2.selectAll(".layer").transition()
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

              tooltip.html( "<p>" + d.key + ": " + pro + "</p>" )
                .style("visibility", "visible");
      
            })
            .on("mouseout", function(d, i) {
                 svg2.selectAll(".layer")
                      .transition()
                      .duration(250)
                      .attr("opacity", "1");
                  d3.select(this)
                      .classed("hover", false)
                      .attr("stroke-width", "0px"), 
                tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" )
                        .style("visibility", "hidden");
          })

    vertical = d3.select("#streams")
                .append("div")
                .attr("class", "remove")
                .style("position", "absolute")
                .style("z-index", "19")
                .style("width", "1px")
                //.style("height", "680px")
                .style("height", divheight)
                .style("top", "175px")
                .style("bottom", "-175px")
                .style("left", "0px")
                .style("background", "#fff");

    d3.select("#streams")
              .on("mousemove", function(){  
                 mousex = d3.mouse(this);
                 vertical.style("left", (45 + mousex[0]) + "px" )
              })
              .on("mouseover", function(){  
                 mousex = d3.mouse(this);
                 vertical.style("left", (45 + mousex[0]) + "px")
              });


} // End draw Func

