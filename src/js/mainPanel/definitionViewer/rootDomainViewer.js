import canvasDatagrid from 'canvas-datagrid'
import transformRootDomain from './transformRootDomain'

import renderArcDiagram from './arcDiagram'

export default DGrid => {
    const rootDomain = DGrid.RootDomains[0]
    const data = transformRootDomain(rootDomain)
    const rViewer2 = document.getElementById('r-viewerDefinition')
    if (!rViewer2) {
        return
    }
    const rootDomainDiv = document.createElement('div')
    rootDomainDiv.setAttribute('id', 'rootdomain')
    rViewer2.appendChild(rootDomainDiv)

    setTimeout(() => {
        const grid = canvasDatagrid({
            allowSorting: false, // affected by this bug https://github.com/TonyGermaneri/canvas-datagrid/issues/261
            allowColumnReordering: false,
            autoResizeColumns: true,
            editable: false,
            allowFreezingColumns: true,
            allowFreezingRows: true,
        })
        rootDomainDiv.appendChild(grid)
        grid.style.height = '95%'
        grid.style.width = '95%'
        grid.data = data
        grid.frozenColumn = 1
        let numFrozenRows = rootDomain.VoidQuadrant.length + 1
        grid.frozenRow = numFrozenRows
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        grid.addEventListener('contextmenu', e => {
            console.log("test")
            e.items.push({
                title: 'Visualize DRS',
                click: () => {
                    mountArcDiagram(DGrid.DRS)
                    document.getElementById(
                        'r-viewerDefinition'
                    ).style.display = 'none'
                },
            })
        })
    }, 100)
}

const mountArcDiagram = DRS => {
    const definitionPanel = document.getElementById('definitionPanel')
    let arcDiagramDiv = document.getElementById('arcDiagramDiv')
    if (arcDiagramDiv) {
        arcDiagramDiv.style.display = 'block'
    } else {
        arcDiagramDiv = document.createElement('div')
        arcDiagramDiv.setAttribute('id', 'arcDiagramDiv')
        let returnToRootDomainViewerButton = document.createElement('button')
        returnToRootDomainViewerButton.innerText =
            'Return to Root Domain Viewer'
        arcDiagramDiv.appendChild(returnToRootDomainViewerButton)
        returnToRootDomainViewerButton.addEventListener('click', e => {
            document.getElementById('r-viewerDefinition').style.display =
                'block'
            document.getElementById('arcDiagramDiv').style.display = 'none'
        })
        definitionPanel.appendChild(arcDiagramDiv)
        renderArcDiagram(DRS)
    }
}
