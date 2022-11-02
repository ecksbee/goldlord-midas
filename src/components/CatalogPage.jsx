import { For, createSignal } from 'solid-js'

import store from '../lib/store'
import styles from './CatalogPage.module.css'
import commonStyles from './Common.module.css'

const title = 'Concept Network Browser'
const CatalogPage = () => {
    const catalog = store.getCatalog()
    const name = catalog.DocumentName
    const subjects = catalog.Subjects
    const rsets = catalog.RelationshipSets
    const initSubject = subjects[0].Entity.Scheme + '/' + subjects[0].Entity.CharData
    const initRoleURI = rsets[0].RoleURI
    const [subject, setSubject] = createSignal(initSubject)
    const [relationshipSet, setRelationshipSet] = createSignal(initRoleURI)
    return (<div id={styles['selector-panel']}>
            <h1 id={styles.title}>{title}</h1>
            <h2>Entity</h2>
            <fluent-combobox id={styles.subjectSelectize} class={commonStyles['combo-boxes']} current-value={initSubject} >
                <For each={subjects}>
                    {(subject) => {
                        const entityData = subject.Entity.Scheme + '/' + subject.Entity.CharData
                        return (<fluent-option value={entityData} onClick={e => {
                            setSubject(entityData)
                        }}>{entityData}</fluent-option>)
                    }}
                </For>
            </fluent-combobox>
            <h2>Relationship Set</h2>
            <fluent-combobox id={styles.relationshipSetSelectize} class={commonStyles['combo-boxes']} current-value={initRoleURI} >
                <For each={rsets}>
                    {(rset) => {
                        const roleURI = rset.RoleURI
                        return (<fluent-option value={roleURI} onClick={e => {
                            setRelationshipSet(roleURI)
                        }}>{roleURI}</fluent-option>)
                    }}
                </For>
            </fluent-combobox>
            <div>
                <fluent-button id='fetch-button' appearance='accent' onClick={
                    async e => {
                        const currSubject = subject()
                        const currRSet = relationshipSet()
                        if (!currSubject || !currRSet) {
                            return
                        }
                        const hash = catalog.Networks[currSubject][currRSet]
                        try {
                            await store.loadRenderable(hash)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }>Browse</fluent-button>
            </div>
            {
                name && name.length && <p><a href='#' onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    store.showFactExpressionViewer()
                }}>View Inline XBRL</a></p>
            }
        </div>
    )
}

export default CatalogPage
