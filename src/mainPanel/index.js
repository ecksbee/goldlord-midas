import renderPGridViewer from './presentationViewer/pGridViewer'
import renderRootDomain from './definitionViewer/rootDomainViewer'
// import renderArcDiagram from './definitionViewer/arcDiagram'
import testDataPGrid from '../../test/mainPanel/presentationViewer/testDataPGrid'
import testDataRootDomain from '../../test/mainPanel/definitionViewer/testDataRootDomain'
// import testDataArc from '../../test/mainPanel/definitionViewer/testDataArcDiagram'

const renderPresentationTab = e => {
    const temp = document.getElementById('r-viewerPresentation')
    if (temp) {
        return
    }
    const presentationPanel = document.getElementById('presentationPanel')
    const rViewerPresentation = document.createElement('div')
    presentationPanel.appendChild(rViewerPresentation)
    rViewerPresentation.setAttribute('id', 'r-viewerPresentation')
    renderPGridViewer(testDataPGrid)
}

const renderDefinitionTab = e => {
    const temp = document.getElementById('r-viewerDefinition')
    if (temp) {
        return
    }
    const definitionPanel = document.getElementById('definitionPanel')
    const rViewerDefinition = document.createElement('div')
    definitionPanel.appendChild(rViewerDefinition)
    rViewerDefinition.setAttribute('id', 'r-viewerDefinition')
    renderRootDomain(testDataRootDomain)
}

export default title => {
    const mainPanel = document.getElementById('main-panel')
    if (!mainPanel) {
        return
    }
    const mainTitleBar = document.createElement('div')
    mainTitleBar.innerHTML = `<h1 class='truncate'>` + title + `</h1>`
    mainPanel.appendChild(mainTitleBar)
    const mainPanelTabs = document.createElement('div')
    mainPanelTabs.innerHTML = `<fluent-tabs activeid="entrees">
    <fluent-tab id="presentation">Presentation</fluent-tab>
    <fluent-tab id="definition">Definition</fluent-tab>
    <fluent-tab id="calculation">Calculation</fluent-tab>
    <fluent-tab-panel id="presentationPanel">
    </fluent-tab-panel>
    <fluent-tab-panel id="definitionPanel">
    </fluent-tab-panel>
    <fluent-tab-panel id="calculationPanel">
        <ol>
            <li><fluent-anchor href="#" appearance="hypertext">Tiramisu</fluent-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Spumoni</fluent-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Limoncello and Ice Cream with Biscotti</fluent-anchor></li>
        </ol>
    </fluent-tab-panel>
</fluent-tabs>
    `
    mainPanel.appendChild(mainPanelTabs)

    // renderArcDiagram(testDataArc)
    renderPresentationTab()

    document
        .getElementById('presentation')
        .addEventListener('click', renderPresentationTab)

    document
        .getElementById('definition')
        .addEventListener('click', renderDefinitionTab)
}
