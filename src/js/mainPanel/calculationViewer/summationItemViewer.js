import canvasDatagrid from 'canvas-datagrid'
import transformSummationItem from './transformSummationItem'

export default CGrid => {
    const summationItem = CGrid.SummationItems[0]
    const data = transformSummationItem(summationItem)
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
        summationItemDiv.appendChild(grid)
        grid.style.height = '95%'
        grid.style.width = '95%'
        grid.data = data
        grid.frozenColumn = 2
        let numFrozenRows = summationItem.VoidQuadrant.length + 1
        grid.frozenRow = numFrozenRows
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        grid.addEventListener('contextmenu', e => {
            CGrid.SummationItems.forEach(item => {
                e.items.push({
                    title: item.Href,
                    click: () => {
                        grid.data = transformSummationItem(item)
                        grid.frozenRow = item.VoidQuadrant.length + 1
                    },
                })
            });
        })
    }, 100)
}
