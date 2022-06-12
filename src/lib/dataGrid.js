import canvasDatagrid from 'canvas-datagrid'

export default (data, numFrozenRows, numFrozenCols, mount, onContextMenu, footnoteGrid, footnotes) => {
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
        grid.addEventListener('afterrendercell', function (e) {
            if (!footnotes?.length) { 
                return
            }
            const i = e?.cell?.rowIndex || -1
            const j = e?.cell?.columnIndex || -1
            if (i < numFrozenRows || j < numFrozenCols) {
                return
            }
            const superscripts = footnoteGrid[i - numFrozenRows][j - numFrozenCols]
            const cell = e.cell.value
            if (cell === '...') {
                return
            }
            if (!superscripts?.length) {
                return
            }
            let newInnerHtml = `<span style="font: 10.66px CarlitoRegular;">${cell}</span><superscript style="vertical-align: super; font: 9px CarlitoRegular;">(`
            for (let k = 0; k < superscripts.length; k++) {
                const superscript = superscripts[k] - 1
                newInnerHtml += superscript
                if (k !== superscripts.length - 1) {
                    newInnerHtml += ', '
                }
            }
            newInnerHtml += `)</superscript>`
            e.cell.innerHTML = newInnerHtml
        })
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        if (onContextMenu) {
            grid.addEventListener('contextmenu', e => {
                onContextMenu(grid, e)
            })
        }
        const l = numFrozenCols || 1
        const columnNames = Array.from(Array(l)).map((e, i) => i.toString())
        columnNames.forEach(
            name =>  grid.fitColumnToValues(name)
        )
        grid.draw()
    }, 100)
}
