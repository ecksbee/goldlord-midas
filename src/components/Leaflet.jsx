import { createSignal } from 'solid-js'

import store from '../lib/store'
import styles from './Leaflet.module.css'

const Leaflet = () => {
    return (<div id={styles['leaflet-wrapper']}>
        <div id={styles.leafletTitle}>
         //todo add close button
        </div>
        <div id={styles.leafletBody}>
            <div id={styles.leafletBodyContent} innerHTML={store.narrativeFactInnerHtml()} />
        </div>
    </div>)
}

export default Leaflet
