import store from '../lib/store'
import styles from './Leaflet.module.css'

const Leaflet = () => {
    let title = ''
    let label = ''
    let periodHeader = ''
    let body = ''
    const narrativeFact = store.getNarrativeFact()
    if (store.getFootnotes()) {
        title = 'Footnotes'
        label = store.footnotesLabel()
        periodHeader = store.footnotesPeriodHeader()
        body = store.footnotesInnerHtml()
    } else if (narrativeFact) {
        title = 'Narrative Fact'
        label = store.narrativeFactLabel()
        periodHeader = store.narrativeFactPeriodHeader()
        body = store.narrativeFactInnerHtml()
    }
    return (<div id={styles['leaflet-wrapper']}>
        <div id={styles.leafletTitleWrapper}>
            <h1 id={styles.leafletTitle}>{title}</h1>
            <fluent-button id={styles['close-narrative-fact-button']} appearance='accent' onClick={
                e => {
                    if (store.getNarrativeFact()) {
                        store.hideNarrativeFact()
                    }
                    if (store.getFootnotes()) {
                        store.hideFootnotes()
                    }
                }
            }>Close</fluent-button>
        </div>
        <div id={styles.leafletLabel}><h2>{label}</h2></div>
        <div id={styles.leafletPeriodHeader}><h3>{periodHeader}</h3></div>
        <hr class={styles.leafletRule}/>
        <div id={styles.leafletBody}>
            <div id={styles.leafletBodyContent} innerHTML={body} />
        </div>
        {
            store.getNarrativeFact() && 
            store.footnotesSuperscripts(
                store.getRenderable(), 
                narrativeFact.rowIndex, narrativeFact.columnIndex, 
                narrativeFact.linkbase, narrativeFact.index).length && <div><a onClick={e => {
                store.showFootnotes(rowIndex, columnIndex, linkbase, index)
            }}>Show footnotes</a></div>
        }
    </div>)
}

export default Leaflet
