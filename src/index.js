import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
} from '@fluentui/web-components'
import renderSelectorPanel from './selectorPanel'
// import renderMainPanel from './mainPanel'
import testDataCatalog from '../test/selectorPanel/testDataCatalog'
import './global.scss'
const selectorPanel = document.createElement('div')
selectorPanel.setAttribute('id', 'selector-panel')
selectorPanel.classList.add('bigPanel')
const mainPanel = document.createElement('div')
mainPanel.setAttribute('id', 'main-panel')
document.body.appendChild(selectorPanel)
document.body.appendChild(mainPanel)
provideFluentDesignSystem().register(fluentCombobox(), fluentOption())
renderSelectorPanel(testDataCatalog)
// renderMainPanel()
