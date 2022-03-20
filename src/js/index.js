import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
    fluentTab,
    fluentTabPanel,
    fluentTabs,
} from '@fluentui/web-components'
import 'isomorphic-fetch'
import renderSelectorPanel from './selectorPanel'
import renderMainPanel from './mainPanel'
import testDataCatalog from '../test/selectorPanel/testDataCatalog'
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

renderSelectorPanel(testDataCatalog)

document.getElementById('fetch-button').addEventListener('click', e => {
    const uuid = 'test_gold' // todo
    let a = document
        .getElementById('subjectSelectize')
        .getAttribute(`current-value`)
    console.log(a)
    let b = document
        .getElementById('relationshipSetSelectize')
        .getAttribute('current-value')
    // let c = testDataCatalog.Networks[a][b]
    fetch('folders/' + uuid)
        .then(response => {
            if (response.status >= 400) {
                throw new Error('Bad response from server')
            }
            return response.json()
        })
        .then(stories => {
            console.log(stories)
        })
    // TODO use c (the hash) to fetch the renderable.
    while (selectorPanel.firstChild) {
        selectorPanel.removeChild(selectorPanel.firstChild)
    }

    let relationshipSetsLen = testDataCatalog.RelationshipSets.length
    let checkedURI = ''
    let mainPanelTitle = ''
    // todo: turn this into a "foreach" loop for better performance.
    for (let i = 0; i < relationshipSetsLen; i++) {
        checkedURI = testDataCatalog.RelationshipSets[i].RoleURI
        if (checkedURI === b) {
            mainPanelTitle = testDataCatalog.RelationshipSets[i].Title
            break
        }
    }

    let subjectsLen = testDataCatalog.Subjects.length
    let checkedEntity = ''
    // todo: turn this into a "foreach" loop for better performance.
    for (let i = 0; i < subjectsLen; i++) {
        checkedEntity =
            testDataCatalog.Subjects[i].Entity.Scheme +
            '/' +
            testDataCatalog.Subjects[i].Entity.CharData
        if (checkedEntity === a) {
            mainPanelTitle += ' | ' + testDataCatalog.Subjects[i].Name
            break
        }
    }
    renderMainPanel(mainPanelTitle)
    e.stopPropagation()
    e.preventDefault()
})
