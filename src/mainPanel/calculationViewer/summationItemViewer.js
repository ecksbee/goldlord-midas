// this code copied and modified from rootDomainViewer.js.

import canvasDatagrid from 'canvas-datagrid'
// import transformCGrid from './transformCGrid' will be used in future

// import calculationTestData from '../../../test/mainPanel/calculationViewer/testDataCGrid' will be used in future

export default rawData => {
    const data = [
        ['hi', 'hi again'],
        [2, 4],
    ]
    // const data = transformRootDomain(rawData)
    const rViewer2 = document.getElementById('r-viewerCalculation')
    if (!rViewer2) {
        return
    }
    const summationItemDiv = document.createElement('div')
    summationItemDiv.setAttribute('id', 'summationItem')
    rViewer2.appendChild(summationItemDiv)

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
        summationItemDiv.appendChild(grid)
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
