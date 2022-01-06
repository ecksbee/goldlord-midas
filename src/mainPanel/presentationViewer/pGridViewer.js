// also used in rootDomainViewer.js

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
        const grid = canvasDatagrid()
        pGridDiv.appendChild(grid)
        grid.style.height = '100%'
        grid.style.width = '100%'
        grid.data = data
    }, 100)
}
