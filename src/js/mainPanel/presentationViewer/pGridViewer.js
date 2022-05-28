import canvasDatagrid from 'canvas-datagrid'
import transformPGrid from './transformPGrid'

export default rawData => {
    const data = transformPGrid(rawData)
    const rViewer = document.getElementById('r-viewerPresentation')
    if (!rViewer) {
        return
    }
    const pGridDiv = document.createElement('div')
    pGridDiv.setAttribute('id', 'pgrid')
    rViewer.appendChild(pGridDiv)

    setTimeout(() => {
        const grid = canvasDatagrid({
            allowSorting: false, // affected by this bug https://github.com/TonyGermaneri/canvas-datagrid/issues/261
            allowColumnReordering: false,
            autoResizeColumns: true,
            editable: false,
            allowFreezingColumns: true,
            allowFreezingRows: true,
        })

        pGridDiv.appendChild(grid)
        grid.style.height = '98%'
        grid.style.width = '98%'
        grid.data = data
        grid.frozenColumn = 1
        let numFrozenRows = rawData.VoidQuadrant.length + 1
        grid.frozenRow = numFrozenRows
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
    }, 100)
}
