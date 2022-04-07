import renderPGridViewer from './presentationViewer/pGridViewer'
import renderRootDomain from './definitionViewer/rootDomainViewer'
import renderSummationItemViewer from './calculationViewer/summationItemViewer'
import renderSelectorPanel from './../selectorPanel'
import initializeSelectorPanel from '../index'

const renderPresentationTab = (e, renderable) => {
    const temp = document.getElementById('r-viewerPresentation')
    if (temp) {
        return
    }
    const presentationPanel = document.getElementById('presentationPanel')
    const rViewerPresentation = document.createElement('div')
    presentationPanel.appendChild(rViewerPresentation)
    rViewerPresentation.setAttribute('id', 'r-viewerPresentation')
    renderPGridViewer(renderable.PGrid)
}

const returnToSelectorPanel = (catalog) => {
    document.getElementById('main-panel').innerHTML=''
    renderSelectorPanel(catalog)
    initializeSelectorPanel(catalog)
}

const renderDefinitionTab = (e, renderable) => {
    const temp = document.getElementById('r-viewerDefinition')
    if (temp) {
        return
    }
    const definitionPanel = document.getElementById('definitionPanel')
    const rViewerDefinition = document.createElement('div')
    definitionPanel.appendChild(rViewerDefinition)
    rViewerDefinition.setAttribute('id', 'r-viewerDefinition')
    renderRootDomain(renderable.DGrid)
}

const renderCalculationTab = (e, renderable) => {
    const temp = document.getElementById('r-viewerCalculation')
    if (temp) {
        return
    }
    const calculationPanel = document.getElementById('calculationPanel')
    const rViewerCalculation = document.createElement('div')
    calculationPanel.appendChild(rViewerCalculation)
    rViewerCalculation.setAttribute('id', 'r-viewerCalculation')
    renderSummationItemViewer(renderable.CGrid)
}

export default (title, renderable, catalog) => {
    const mainPanel = document.getElementById('main-panel')
    if (!mainPanel) {
        return
    }
    const mainTitleBar = document.createElement('div')
    mainTitleBar.innerHTML = `<h1 class='truncate'>` + title + `</h1><br/><fluent-button id="returnHomeButton" appearance="accent">Back to Home</fluent-button>`
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
        </fluent-tab-panel>
    </fluent-tabs>
    `
    mainPanel.appendChild(mainPanelTabs)

    renderPresentationTab(null, renderable)

    document
        .getElementById('presentation')
        .addEventListener('click', e => renderPresentationTab(e, renderable))

    document
        .getElementById('definition')
        .addEventListener('click', e => renderDefinitionTab(e, renderable))

    document
        .getElementById('calculation')
        .addEventListener('click', e => renderCalculationTab(e, renderable))
    
    document
        .getElementById('returnHomeButton')
        .addEventListener('click', e => returnToSelectorPanel(catalog))
}
