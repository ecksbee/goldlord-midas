import renderPGridViewer from './presentationViewer/pGridViewer'
// import renderArcDiagram from './definitionViewer/arcDiagram'
import testDataPGrid from '../../test/mainPanel/presentationViewer/testDataPGrid'
// import testDataArc from '../../test/mainPanel/definitionViewer/testDataArcDiagram'

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
        <ol>
            <li><fluent-anchor href="#" appearance="hypertext">Mushroom-Sausage Ragù</fluent-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Tomato Bread Soup with Steamed Mussels</fluent-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Grilled Fish with Artichoke Caponata</-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Celery Root and Mushroom Lasagna</fluent-anchor></li>
            <li><fluent-anchor href="#" appearance="hypertext">Osso Buco with Citrus Gremolata</fluent-anchor></li>
        </ol>
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
    const presentationPanel = document.getElementById('presentationPanel')
    const rViewer = document.createElement('div')
    presentationPanel.appendChild(rViewer)
    rViewer.setAttribute('id', 'r-viewer')
    // mainPanel.appendChild(rViewer)
    renderPGridViewer(testDataPGrid)
    // renderArcDiagram(testDataArc)
}
