import canvasDatagrid from 'canvas-datagrid'

export default (data, numFrozenRows, numFrozenCols, mount, onContextMenu) => {
    setTimeout(() => {
        const grid = canvasDatagrid({
            allowSorting: false, // affected by this bug https://github.com/TonyGermaneri/canvas-datagrid/issues/261
            allowColumnReordering: false,
            autoResizeColumns: false,
            editable: false,
            allowFreezingColumns: true,
            allowFreezingRows: true,
            style: {
                cellFont: '10.66px CarlitoRegular',
                columnHeaderCellFont: '12px CarlitoRegular',
                rowHeaderCellFont: '12px CarlitoRegular',
                activeCellFont: '10.66px CarlitoRegular',
            }
        })
        mount.appendChild(grid)
        grid.style.height = 'calc(100vh - 16px - 38px - 32px - 40px - 16px)'
        grid.style.width = '98vw'
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
        const l = numFrozenCols || 1
        const columnNames = Array.from(Array(l)).map((e, i) => i.toString())
        columnNames.forEach(
            name =>  grid.fitColumnToValues(name)
        )
    }, 100)
}
