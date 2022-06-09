import { createSignal } from 'solid-js'

import store from '../lib/store'
import PGridViewer from './PGridViewer'
import DGridViewer from './DGridViewer'
import CGridViewer from './CGridViewer'
import styles from './BrowserPage.module.css'

const BrowserPage = () => {
    const [currentTab, setCurrentTab] = createSignal('presentation')
    const catalog = store.getCatalog()
    const hash = store.getHash()
    const relationshipSetsLen = catalog.RelationshipSets.length
    let relationshipSet
    let subject
    for (let s in catalog.Networks) {
        if (relationshipSet && subject) {
            break
        }
        for (let r in catalog.Networks[s]) {
            if (hash === catalog.Networks[s][r]) {
                relationshipSet = r
                subject = s
                break
            }
        }
    } 
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
    return (<div id={styles['main-panel']}>
            <div id={styles['main-panel-title']}>
                <h1 class={styles.truncate + ' ' + styles['main-panel-title-h1']}>{mainPanelTitle}</h1>
            </div>
            <div>
                <fluent-button id='back-to-catalog-button' appearance='accent' onClick={
                    e => {
                        store.setHash(null)
                    }
                }>Back</fluent-button>
            </div>
            <div id={styles['main-panel-body']}>
                <fluent-tabs activeid={currentTab()}>
                    <fluent-tab id='presentation' onClick={e => setCurrentTab('presentation')}>
                        Presentation</fluent-tab>
                    <fluent-tab id='definition' onClick={e => setCurrentTab('definition')}>
                        Definition</fluent-tab>
                    <fluent-tab id='calculation' onClick={e => setCurrentTab('calculation')}>
                        Calculation</fluent-tab>
                    <fluent-tab-panel id='presentationPanel'>
                        { currentTab() === 'presentation' && <PGridViewer /> }
                    </fluent-tab-panel>
                    <fluent-tab-panel id='definitionPanel'>
                        { currentTab() === 'definition' && <DGridViewer /> }
                    </fluent-tab-panel>
                    <fluent-tab-panel id='calculationPanel'>
                        { currentTab() === 'calculation' && <CGridViewer />} 
                    </fluent-tab-panel>
                </fluent-tabs>
            </div>
    </div>)
}

export default BrowserPage
