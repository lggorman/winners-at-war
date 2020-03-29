import * as d3 from "d3";
import playerData from './players';

let svg = d3.selectAll('#main')
    .attr("width", 860)
    .attr("height", 650);

playerData.sort((a,b) => {return Math.min(...a.seasons.map(item => item.number)) - Math.min(...b.seasons.map(item => item.number))});

let playerDataWithIndex = playerData.map((item, i) => {
    item.index = i;
    item.seasons.push({
        "name": "Winners at War",
        "number": 40,
        "winner": false,
    })
    return item;
});

const paddingTop = 35;

const xScale = d3.scaleLinear()
  .domain([0, 40])
  .range([100, 715]);

const yScale = d3.scaleLinear()
  .domain([0, 20])
  .range([0, 550]);

const getEarliestSeaason = player => Math.min(...player.seasons.map(x => x.number));
const getLatestSeason = player => Math.max(...player.seasons.map(x => x.number));


svg.selectAll('line')
    .data(playerDataWithIndex)
    .enter()
    .append('line')
    .attr('x1', d => xScale(getEarliestSeaason(d)))
    .attr('x2', d => xScale(getLatestSeason(d)))
    .attr('y1', d => yScale(d.index) + paddingTop)
    .attr('y2', d => yScale(d.index) + paddingTop)
    .attr('stroke', '#00004c');

svg.selectAll('text')
    .data(playerDataWithIndex)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('x', function(d) {return xScale(getEarliestSeaason(d)) - this.getComputedTextLength() - 15})
    .attr('y', d => yScale(d.index) + paddingTop + 5)
    .attr('fill', 'black');

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


let i = 0
playerDataWithIndex.map(player => {
    svg.selectAll('.player' + player.index)
        .data(player.seasons)
        .enter()
        .append('circle')
        .classed('player' + player.index, true)
        .attr('cx', d => xScale(d.number))
        .attr('cy', d => yScale(player.index) + paddingTop)
        .attr('r', 5)
        .attr('fill', d => d.winner ? '#19a319' : '#00004c')
        .on('mouseenter', function(d) {

            let tooltip = svg.append('g')
                .attr("class", "tooltip");

            // set text first so we can use it's width
            let text = tooltip.append('text')
                .text(`${d.number}: ${d.name}`)	

            let mousePos = d3.mouse(this);
            tooltip.append('rect')	
                .attr('height', 23)
                .attr('width', Math.round(text.node().getComputedTextLength()) + 10)
                .attr('stroke', 'black')
                .attr('fill', 'white')

            // Remove and re-append text so it's on top
            tooltip.selectAll('text').remove();
            text = tooltip.append('text')
                .text(`${d.number}: ${d.name}`)   
                .attr('fill', 'black')
        })
        .on('mousemove', function(d) {
            let mousePos = d3.mouse(this);

            svg.selectAll('.tooltip').selectAll('rect')
                .attr('x', mousePos[0] + 2)
                .attr('y', mousePos[1] - 25);

            svg.selectAll('.tooltip').selectAll('text')
                .attr('x', mousePos[0] + 7)
                .attr('y', mousePos[1] - 8);
        })
        .on('mouseleave', d => {
            svg.selectAll('.tooltip').remove();
        });

    i += 1
});
