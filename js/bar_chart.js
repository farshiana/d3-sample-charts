var TRANSITION_TIME = 750;

/**
 * Returns a list of 100 random values
 *
 * @returns {Array} A list of values
 */
function getBarData(){
    return d3.range(100).map(d3.randomBates(10));
}

/**
 *  Initialize a bar chart - creates svg and groups
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 */
function initBarChart(element, data, width, height, margins){
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

    updateBarChart(element, data, width, height, margins, true);
}

/**
 * Draws a bar chart
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 * @param {Boolean} init
 */
function updateBarChart(element, data, width, height, margins, init){
    /* SVG & groups */
    var svg  = d3.select(element).select(".svg");
    var main = svg.select(".main");

    /* Margins */
    width = width - margins.left - margins.right;
    height = height - margins.top - margins.bottom;

    /* Scales */
    var x = d3.scaleLinear()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height, 0]);

    /* Histogram */
    var histogram = d3.histogram()
        .thresholds(10); // we wish to divide values into 10 bins
    var bins = histogram(data);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // Enter - add bars that are in data but don't match any bars
    main.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .on("mousemove", function(){
                d3.select(this).classed("active", true);
            })
            .on("mouseout", function(){
                d3.select(this).classed("active", false);
            });
    // Update - update bars that match the data
    main.selectAll(".bar")
        .transition()
        .duration(init ? 0 : TRANSITION_TIME)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return Math.max(x(d.x1) - x(d.x0) - 1, 1) ; })
        .attr("height", function(d) { return height - y(d.length); });
    // Exit - remove bars that don't match any data
    main.selectAll(".bar")
    .data(bins)
    .exit()
    .remove();

    /* Axis */
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(4);
    var yAxis = d3.axisLeft()
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
}

var bar_chart   = document.getElementById('bar_chart'),
    bar_data    = getBarData(),
    bar_width   = 500,
    bar_height  = 300,
    bar_margins = {top: 30, bottom: 30, left: 30, right: 30};

initBarChart(bar_chart, bar_data, bar_width, bar_height, bar_margins);

document.getElementById("bar_update").addEventListener("click", function(){
    bar_data = getBarData();
    updateBarChart(bar_chart, bar_data, bar_width, bar_height, bar_margins);
});