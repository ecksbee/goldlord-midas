import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
    fluentTab,
    fluentTabPanel,
    fluentTabs,
} from '@fluentui/web-components'
import 'isomorphic-fetch'
import fetchCatalog from './fetchCatalog'
import fetchRenderable from './fetchRenderable'
import renderSelectorPanel from './selectorPanel'
import renderMainPanel from './mainPanel'
import '../scss/global.scss'
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

fetchCatalog().then(
    catalog => {
        renderSelectorPanel(catalog)
        document.getElementById('fetch-button').addEventListener('click', e => {
            const subject = document
                .getElementById('subjectSelectize')
                .getAttribute(`current-value`)
            const relationshipSet = document
                .getElementById('relationshipSetSelectize')
                .getAttribute('current-value')
            const hash = catalog.Networks[subject][relationshipSet]
            while (selectorPanel.firstChild) {
                selectorPanel.removeChild(selectorPanel.firstChild)
            }
            fetchRenderable(hash).then(
                renderable => {
                    const relationshipSetsLen = catalog.RelationshipSets.length
                    let checkedURI = ''
                    let mainPanelTitle = ''
                    for (let i = 0; i < relationshipSetsLen; i++) {
                        checkedURI = catalog.RelationshipSets[i].RoleURI
                        if (checkedURI === relationshipSet) {
                            mainPanelTitle = catalog.RelationshipSets[i].Title
                            break
                        }
                    }
                    const subjectsLen = catalog.Subjects.length
                    let checkedEntity = ''
                    for (let i = 0; i < subjectsLen; i++) {
                        checkedEntity =
                            catalog.Subjects[i].Entity.Scheme +
                            '/' +
                            catalog.Subjects[i].Entity.CharData
                        if (checkedEntity === subject) {
                            mainPanelTitle += ' | ' + catalog.Subjects[i].Name
                            break
                        }
                    }
                    renderMainPanel(mainPanelTitle, renderable)
                    e.stopPropagation()
                    e.preventDefault()
                }
            )
        })
    }
)
