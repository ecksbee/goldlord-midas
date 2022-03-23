// this code copied and modified from pGridViewer.js.

import canvasDatagrid from 'canvas-datagrid'
import transformRootDomain from './transformRootDomain'

import arcDiagramTestData from '../../../test/mainPanel/definitionViewer/testDataArcDiagram'
import renderArcDiagram from './arcDiagram'

export default rawData => {
    const data = transformRootDomain(rawData)
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
        // grid.fitColumnToValues('a')
        rootDomainDiv.appendChild(grid)
        grid.style.height = '95%'
        grid.style.width = '95%'
        grid.data = data
        grid.frozenColumn = 1
        let numFrozenRows = rawData.VoidQuadrant.length + 1
        grid.frozenRow = numFrozenRows
        // grid.fitColumnToValues()
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        grid.addEventListener('contextmenu', e => {
            e.items.push({
                // dimensional relationship set
                title: 'Visualize DRS',
                click: () => {
                    // TODO: MAKE THE CONTEXT MENU GO AWAY AFTER THIS IS CLICKED.
                    mountArcDiagram()
                    document.getElementById(
                        'r-viewerDefinition'
                    ).style.display = 'none'
                },
            })
        })
    }, 100)
}

const mountArcDiagram = e => {
    const definitionPanel = document.getElementById('definitionPanel')
    let arcDiagramDiv = document.getElementById('arcDiagramDiv') // if it isn't on the page yet, returns null and evaluates to falsey.
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
        renderArcDiagram(arcDiagramTestData)
    }
}
