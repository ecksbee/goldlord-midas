import renderPGridViewer from './presentationViewer/pGridViewer'
// import renderArcDiagram from './definitionViewer/arcDiagram'
import testDataPGrid from '../../test/mainPanel/presentationViewer/testDataPGrid'
// import testDataArc from '../../test/mainPanel/definitionViewer/testDataArcDiagram'

export default () => {
    const mainPanel = document.getElementById('main-panel')
    if (!mainPanel) {
        return
    }
    const mainTitleBar = document.createElement('div')
    mainTitleBar.innerHTML = `<h1>00010101 Title</h1>`
    mainPanel.appendChild(mainTitleBar)
    const rViewer = document.createElement('div')
    rViewer.setAttribute('id', 'r-viewer')
    mainPanel.appendChild(rViewer)
    renderPGridViewer(testDataPGrid)
    // renderArcDiagram(testDataArc)
}
