import * as d3 from 'd3'

const charWidth = 7
export default (data, mount) => {
    d3.select(mount)
        .selectChildren()
        .remove()
    const allNodes = data.nodes.map(d => d.name)
    const idToNode = {}
    data.nodes.forEach(n => {
        idToNode[n.id] = n
    })
    const x = d3
        .scalePoint()
        .range([0, data.nodes.length * 2 * charWidth])
        .domain(allNodes)
    let maxChar = 0
    data.nodes.forEach(node => {
        if (node.name.length > maxChar) {
            maxChar = node.name.length
        }
    })
    const magic = maxChar * charWidth
    const dMagic = data.nodes.length * 2 * charWidth
    const yMagic = Math.cos(Math.PI / 4) * magic
    const height = yMagic + dMagic * 0.5
    let trueXMagic = x(data.nodes[0].name)
    data.nodes.forEach(node => {
        const xMagic = Math.sin(Math.PI / 4) * node.name.length * charWidth
        if (xMagic > trueXMagic) {
            trueXMagic = xMagic
        }
    })
    const width = dMagic / 2
    const handleZoom = e => {
        d3.select('svg g').attr('transform', e.transform)
    }
    let zoom = d3.zoom().on('zoom', handleZoom)
    const svg = d3
        .select(mount)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('width', '100vw')
        .attr('height', '85vh')
        .append('g')
        .attr('id', 'theG')
        .call(zoom)
    // Add the links
    const links = svg
        .selectAll('mylinks')
        .data(data.links)
        .join('path')
        .attr('d', d => {
            let start = x(idToNode[d.source].name) // X position of start node on the X axis
            let end = x(idToNode[d.target].name) // X position of end node
            return [
                'M',
                start,
                height / 2 - 18, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                'A', // This means we're gonna build an elliptical arc
                (start - end) / 2,
                ',', // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                (start - end) / 2,
                0,
                0,
                ',',
                start < end ? 1 : 0,
                end,
                ',',
                height / 2 - 18,
            ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                .join(' ')
        })
        .style('fill', 'none')
        .attr('stroke', 'white')
        .style('stroke-width', 1)
        .style('stroke-opacity', 0.8)
    svg.selectAll('mynodes').data(
        data.nodes.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
                return 1
            }
            return 0
        })
    )
    const labels = svg
        .selectAll('mylabels')
        .data(data.nodes)
        .join('text')
        .attr('x', 0)
        .attr('y', 0)
        .text(d => d.name)
        .style('text-anchor', 'end')
        .attr(
            'transform',
            d => `translate(${x(d.name)},${height / 2 - 15}) rotate(-45)`
        )
        .style('font-size', '50%')
        .style('font-family', 'CarlitoRegular')
        .attr('stroke', 'white')
    let source = []
    let target = []
    labels
        .on('mouseover', (_, d) => {
            source = []
            target = []
            links.style('stroke-opacity', link => {
                if (link.source === d.id || link.target === d.id) {
                    source.push(link.source)
                    target.push(link.target)
                    return 1
                }
                return 0.2
            })
            links.style('stroke-width', link =>
                link.source === d.id || link.target === d.id ? 4 : 1
            )
            labels.style('font-size', labelD => {
                if (source.includes(labelD.id) || target.includes(labelD.id)) {
                    return '100%'
                }
                return '10%'
            })
        })
        .on('mouseout', d => {
            source = []
            target = []
            links.style('stroke-opacity', 0.8)
            links.style('stroke-width', 1)
            labels.style('font-size', '50%')
        })
    links
        .on('mouseover', (_, d) => {
            source = []
            target = []
            links.style('stroke-opacity', link => {
                return link.source === d.source && link.target === d.source
                    ? 1
                    : 0.2
            })
            links.style('stroke-width', link =>
                link.source === d.source && link.target === d.target ? 4 : 1
            )
            labels.style('font-size', labelD => {
                return d.source === labelD.id || d.target === labelD.id
                    ? '100%'
                    : '50%'
            })
        })
        .on('mouseout', d => {
            source = []
            target = []
            links.style('stroke-opacity', 0.8)
            links.style('stroke-width', 1)
            labels.style('font-size', '50%')
        })
}
