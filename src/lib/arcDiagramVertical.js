import * as d3 from 'd3'
//reference https://observablehq.com/@d3/arc-diagram.
export default (data, mount) => {
    const margin = {top: 20, right: 20, bottom: 20, left: 100}
    const step = 14
    const height = (data.nodes.length - 1) * step + margin.top + margin.bottom
    const y = d3.scalePoint(data.nodes.map(d => d.id).sort(d3.ascending), [margin.top, height - margin.bottom])
    const color = d3.scaleOrdinal(data.nodes.map(d => d.id).sort(d3.ascending), d3.schemeCategory10)
    const graph = (() => {
      const nodes = data.nodes.map(({id, group}) => ({
        id,
        sourceLinks: [],
        targetLinks: [],
        group
      }));
    
      const nodeById = new Map(nodes.map(d => [d.id, d]));
    
      const links = data.links.map(({source, target, value}) => ({
        source: nodeById.get(source),
        target: nodeById.get(target),
        value
      }));
    
      for (const link of links) {
        const {source, target, value} = link;
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      }
    
      return {nodes, links};
    })()
    function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;
        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${margin.left},${y2}`;
      }

    const svg = d3.select(mount)
      
    svg.append("style").text(`
      
      .hover path {
        stroke: #ccc;
      }
      
      .hover text {
        fill: #ccc;
      }
      
      .hover g.primary text {
        fill: black;
        font-weight: bold;
      }
      
      .hover g.secondary text {
        fill: #333;
      }
      
      .hover path.primary {
        stroke: #333;
        stroke-opacity: 1;
      }
      
      `);
      
    const label = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(graph.nodes)
        .join("g")
        .attr("transform", d => `translate(${margin.left},${d.y = y(d.id)})`)
        .call(g => g.append("text")
            .attr("x", -6)
            .attr("dy", "0.35em")
            .attr("fill", d => d3.lab(color(d.group)).darker(2))
            .text(d => d.id))
        .call(g => g.append("circle")
            .attr("r", 3)
            .attr("fill", d => color(d.group)));
      
    const path = svg.insert("g", "*")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(graph.links)
        .join("path")
        .attr("stroke", d => d.source.id === d.target.id ? color(d.source.id) :  "#aaa")
        .attr("d", arc);
      
    const overlay = svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data(graph.nodes)
        .join("rect")
        .attr("width", margin.left + 40)
        .attr("height", step)
        .attr("y", d => y(d.id) - step / 2)
        .on("mouseover", d => {
            svg.classed("hover", true);
            label.classed("primary", n => n === d);
            label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
            path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
        })
        .on("mouseout", d => {
            svg.classed("hover", false);
            label.classed("primary", false);
            label.classed("secondary", false);
            path.classed("primary", false).order();
        });
      
}
