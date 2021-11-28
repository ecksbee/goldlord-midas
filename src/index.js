import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
} from '@fluentui/web-components'
import renderTopPanel from './topPanel'
import renderMainPanel from './mainPanel'
import './global.scss'
const topPanel = document.createElement('div')
topPanel.setAttribute('id', 'top-panel')
const mainPanel = document.createElement('div')
mainPanel.setAttribute('id', 'main-panel')
document.body.appendChild(topPanel)
document.body.appendChild(mainPanel)
provideFluentDesignSystem().register(fluentCombobox(), fluentOption())
renderTopPanel()
renderMainPanel()
