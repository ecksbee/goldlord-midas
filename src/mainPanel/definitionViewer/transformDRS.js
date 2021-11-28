export default drs => ({
    nodes: drs.Nodes.map(data => ({
        name: data.Href,
        id: data.Href,
    })),
    links: drs.Links.map(link => ({
        source: link.SourceHref,
        target: link.TargetHref,
    })),
})
