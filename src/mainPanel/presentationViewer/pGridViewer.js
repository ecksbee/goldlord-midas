import canvasDatagrid from 'canvas-datagrid'
import transformPGrid from './transformPGrid'

export default rawData => {
    const data = transformPGrid(rawData)
    const rViewer = document.getElementById('r-viewer')
    if (!rViewer) {
        return
    }
    const pGridDiv = document.createElement('div')
    pGridDiv.setAttribute('id', 'pgrid')
    rViewer.appendChild(pGridDiv)
    const grid = canvasDatagrid()
    pGridDiv.appendChild(grid)
    grid.style.height = '100%'
    grid.style.width = '100%'
    grid.data = data
}
