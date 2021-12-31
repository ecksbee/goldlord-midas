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
    const grid = canvasDatagrid()
    rootDomainDiv.appendChild(grid)
    grid.style.height = '100%'
    grid.style.width = '100%'
    grid.data = data
}
