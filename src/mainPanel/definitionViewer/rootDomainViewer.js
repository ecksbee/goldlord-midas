// this code copied and modified from pGridViewer.js.

import canvasDatagrid from 'canvas-datagrid'
import transformRootDomain from './transformRootDomain'

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
    }, 100)
}
