import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
    fluentTab,
    fluentTabPanel,
    fluentTabs,
} from '@fluentui/web-components'
import renderSelectorPanel from './selectorPanel'
import renderMainPanel from './mainPanel'
import testDataCatalog from '../test/selectorPanel/testDataCatalog'
import './global.scss'
const selectorPanel = document.createElement('div')
selectorPanel.setAttribute('id', 'selector-panel')
selectorPanel.classList.add('bigPanel')
const mainPanel = document.createElement('div')
mainPanel.setAttribute('id', 'main-panel')
document.body.appendChild(selectorPanel)
document.body.appendChild(mainPanel)
provideFluentDesignSystem().register(
    fluentCombobox(),
    fluentOption(),
    fluentTab(),
    fluentTabPanel(),
    fluentTabs()
)

renderSelectorPanel(testDataCatalog)
// where event listeners should be added.

document.getElementById('fetch-button').addEventListener('click', () => {
    // alert('it works')
    let a = document
        .getElementById('subjectSelectize')
        .getAttribute(`current-value`)
    console.log(a)
    let b = document
        .getElementById('relationshipSetSelectize')
        .getAttribute('current-value')
    let c = testDataCatalog.Networks[a][b]
    console.log(b)
    console.log(c)
    renderMainPanel(a,b)
    // remove all child elements of the selector panel.
    while (selectorPanel.firstChild) {
        selectorPanel.removeChild(selectorPanel.firstChild)
    }
    //todo: pick work back up here.
    let aSearch=0
    alert(testDataCatalog[0])

})
