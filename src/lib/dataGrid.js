import canvasDatagrid from 'canvas-datagrid'

export default (data, numFrozenRows, numFrozenCols, mount, onContextMenu) => {
    setTimeout(() => {
        const grid = canvasDatagrid({
            allowSorting: false, // affected by this bug https://github.com/TonyGermaneri/canvas-datagrid/issues/261
            allowColumnReordering: false,
            autoResizeColumns: true,
            editable: false,
            allowFreezingColumns: true,
            allowFreezingRows: true,
        })
        mount.appendChild(grid)
        grid.style.height = '98%'
        grid.style.width = '98%'
        grid.data = data
        grid.frozenColumn = numFrozenCols || 1
        grid.frozenRow = numFrozenRows
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        if (onContextMenu) {
            grid.addEventListener('contextmenu', e => {
                onContextMenu(grid, e)
            })
        }
        grid.addEventListener('click', function (e) {
            if (!e.cell) { return }
            const r = e.cell.rowIndex
            const c = e.cell.columnIndex
            if (r >= 0 && c >= 0) {
                //todo raise signal for textblock rendering
                //todo also raise signal for footnotes
            }
        })
    }, 100)
}
