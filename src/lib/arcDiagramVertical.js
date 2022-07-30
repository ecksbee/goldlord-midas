import * as d3 from 'd3'
// for arc diagram, reference https://observablehq.com/@d3/arc-diagram.
// for pan and zoom, reference the link below.
// https://www.d3indepth.com/zoom-and-pan/#:~:text=%20There%E2%80%99s%20three%20steps%20to%20add%20zoom%20and,receives%20the%20zoom%20and%20pan%20gestures%20More%20




export default (data, mount) => {
    const win = window,
      doc = document,
      docElem = doc.documentElement,
      body = doc.getElementsByTagName('body')[0],
      width = win.innerWidth || docElem.clientWidth || body.clientWidth
    const margin = {top: 20, right: 20, bottom: 20, left: width/2}
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

    function handleZoom(e) {
      d3.select('g#wrapper')
      .attr('transform', e.transform);
     }
     
     let zoom = d3.zoom()
       .on('zoom', handleZoom);

    function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;
        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${margin.left},${y2}`;
      }

    const svgmount = d3.select(mount).call(zoom)
    const svg = svgmount.append("g").attr('id','wrapper')
      
    svg.append("style").text(`
      
      svg#arc-diagram text {
        font-family: CourierPrime;

      }

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
            label.classed("primary", n => n.id === d.target.__data__.id);
            label.classed("secondary", n => n.sourceLinks.some(l => l.target.id === d.target.__data__.id) || n.targetLinks.some(l => l.source.id === d.target.__data__.id));
            path.classed("primary", l => l.source.id === d.target.__data__.id || l.target.id === d.target.__data__.id).filter(".primary").raise();
        })
        .on("mouseout", d => {
            svg.classed("hover", false);
            label.classed("primary", false);
            label.classed("secondary", false);
            path.classed("primary", false).order();
        });
      
}
