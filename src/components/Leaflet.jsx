import { createSignal } from 'solid-js'

import store from '../lib/store'
import styles from './Leaflet.module.css'

const Leaflet = () => {
    return (<div id={styles['leaflet-wrapper']}>
        <div id={styles.leafletTitleWrapper}>
            <h1 id={styles.leafletTitle}>Narrative Fact</h1>
            <fluent-button id={styles['close-narrative-fact-button']} appearance='accent' onClick={
                e => {
                    store.hideNarrativeFact()
                }
            }>Close</fluent-button>
        </div>
        <div id={styles.leafletLabel}><h2>{store.narrativeFactLabel()}</h2></div>
        <div id={styles.leafletPeriodHeader}><h3>{store.narrativeFactPeriodHeader()}</h3></div>
        <hr class={styles.leafletRule}/>
        <div id={styles.leafletBody}>
            <div id={styles.leafletBodyContent} innerHTML={store.narrativeFactInnerHtml()} />
        </div>
    </div>)
}

export default Leaflet
