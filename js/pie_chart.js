var TRANSITION_TIME = 750;

/**
 * Returns a list - with a random length - of random values
 *
 * @returns {Array} A list of values
 */
function getPieData(){
    var length = d3.randomUniform(5, 10)(); // between 5 and 10 values
    return d3.range(length).map(d3.randomUniform(0, 10));
}

/**
 *  Initialize a pie chart - creates svg and groups
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 * @param {Boolean} init
 */
function initPieData(element, data, width, height, margins){
    /* SVG */
    var svg = d3.select(element)
        .append("svg")
            .attr("class", "svg")
            .attr("width", width)
            .attr("height", height);

    /* Groups */
    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + (margins.left + (width - (margins.left + margins.right))/2)+ "," + (margins.top + (height - (margins.top + margins.bottom))/2) + ")");

    updatePieChart(element, data, width, height, margins, true);
}

/**
 * Draws a pie chart
 *
 * @param {Element} element
 * @param {Array} data
 * @param {Number} width
 * @param {Number} height
 * @param {Object} margins
 * @param {Boolean} init
 */
function updatePieChart(element, data, width, height, margins, init){
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

    /* Pie */
    var radius = Math.floor(Math.min(width, height) / 2);
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d; });

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    // Enter - add arcs that are in data but don't match any arcs
    var arcs = pie(data);
    main.selectAll(".arc")
        .data(arcs)
        .enter()
        .append("path")
            .attr("class", "arc")
            .on("mousemove", function(){
                d3.select(this).classed("active", true);
            })
            .on("mouseout", function(){
                d3.select(this).classed("active", false);
            });
    // Update - update arcs that match the data
    main.selectAll(".arc")
        .style("fill", function(d) { return color(d.data); })
        .transition()
        .duration(TRANSITION_TIME)
        .attr("d", arc);
    // Exit - remove arcs that don't match any data
    main.selectAll(".arc")
        .data(arcs)
        .exit()
        .remove();
}

var pie_chart   = document.getElementById('pie_chart'),
    pie_data    = getPieData(),
    pie_width   = 300,
    pie_height  = 300,
    pie_margins = {top: 30, bottom: 30, left: 30, right: 30};

initPieData(pie_chart, pie_data, pie_width, pie_height, pie_margins);

document.getElementById("pie_update").addEventListener("click", function(){
    pie_data = getPieData();
    updatePieChart(pie_chart, pie_data, pie_width, pie_height, pie_margins);
});