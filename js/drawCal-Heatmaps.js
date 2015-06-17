
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
            cellSize: 8,
            previousSelector: "#steps-previous-selector",
	        nextSelector: "#steps-next-selector",
            animationDuration: 1500,
            tooltip: true,
            displayLegend:true, 
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
            cellSize: 8,
            previousSelector: "#sleep-previous-selector",
	        nextSelector: "#sleep-next-selector",
            animationDuration: 1500,
            tooltip: true,
            displayLegend:true, 
            legendHorizontalPosition: "left",
            legendVerticalPosition: "top",
            legend: [50, 100, 150, 200, 250],
            legendColors: ["#e3e3e3", "#453485"]
    });

});

var parse = function(data) {
    var stats={};
    for (var d in data){
        stats[+data[d].date] = Math.round(+data[d].value);
    }
    return stats;
}
