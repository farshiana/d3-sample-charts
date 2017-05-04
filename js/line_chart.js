var TRANSITION_TIME = 750;

/**
 * Returns a list - with a random length - of random objects
 *
 * @returns {Array} A list of objects
 */
function getLineData(){
    var length = d3.randomUniform(30, 50)(); // between 30 and 50 values
    return d3.range(length).map(function(i){
        return {
            x: i,
            y: d3.randomUniform(0, i)()
        }
    });
}

/**
 *  Initialize a line chart - creates svg and groups
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 */
function initLineChart(element, data, width, height, margins){
    /* SVG */
    var svg = d3.select(element)
        .append("svg")
            .attr("class", "svg")
            .attr("width", width)
            .attr("height", height);

    /* Groups */
    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    main.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0, " + (height - (margins.top + margins.bottom)) + ")");
    main.append("g")
        .attr("class", "yAxis");

    updateLineChart(element, data, width, height, margins, true);
}

/**
 * Draws a line chart
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 * @param {Boolean} init
 */
function updateLineChart(element, data, width, height, margins, init){
    /* SVG & groups */
    var svg  = d3.select(element).select(".svg");
    var main = svg.select(".main");

    /* Margins */
    width = width - margins.left - margins.right;
    height = height - margins.top - margins.bottom;

    /* Scales */
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d){ return d.x; })) // d3.extent computes min & max
        .range([0, width]);
    var y = d3.scaleLinear()
        .domain(d3.extent(data, function(d){ return d.y; }))
        .range([height, 0]);

    /* Axis */
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(4);
    var yAxis = d3.axisLeft()
        .tickSize(-width) /* transform small dashes into horizontal grid lines */
        .scale(y)
        .ticks(4);

    // Update
    main.selectAll(".xAxis")
        .transition()
        .duration(init ? 0 : TRANSITION_TIME)
        .call(xAxis);
    main.selectAll(".yAxis")
        .transition()
        .duration(init ? 0 : TRANSITION_TIME)
        .call(yAxis);

    /* Line */
    var line = d3.line()
        .curve(d3.curveMonotoneX) // specify interpolation method
        .x(function(d){ return x(d.x); })
        .y(function(d){ return y(d.y); });

    // Enter
    main.selectAll(".line")
        .data([data])
        .enter()
        .append("path")
            .attr("class", "line")
    // Update
    main.select(".line")
        .transition()
        .duration(TRANSITION_TIME)
        .attr("d", line(data));

    /* Circles */
    // Enter - add circles that are in data but don't match any circles
    main.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", "circle")
            .attr("r", 3.5);
    // Update - update circles that match the data
    main.selectAll(".circle")
        .transition()
        .duration(init ? 0 : TRANSITION_TIME)
        .attr("cx", function(d){ return x(d.x); })
        .attr("cy", function(d){ return y(d.y); });
    // Exit - remove circles that don't match any data
    main.selectAll(".circle")
    .data(data)
    .exit()
    .remove();
}

var line_chart   = document.getElementById('line_chart'),
    line_data    = getLineData(),
    line_width   = 500,
    line_height  = 300,
    line_margins = {top: 30, bottom: 30, left: 30, right: 30};

initLineChart(line_chart, line_data, line_width, line_height, line_margins);

document.getElementById("line_update").addEventListener("click", function(){
    line_data = getLineData();
    updateLineChart(line_chart, line_data, line_width, line_height, line_margins);
});