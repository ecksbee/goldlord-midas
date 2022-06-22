import { onMount } from 'solid-js'
import store from '../lib/store'
import styles from './FactExpressionViewer.module.css'

const FactExpressionViewer = () => {
    let viewerIframe
    onMount(() => {
        const catalog = store.getCatalog()
        const expressions = catalog.Expressions
        const ixbrldocument = store.getIxbrlDocument()
        viewerIframe.contentDocument.write(ixbrldocument)
    })
    return <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        'min-width': 'calc(800px + 320px)',
        height: '100vh'
    }}>
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(100vw - 320px)',
            'min-width': '800px',
            height: '100vh'
        }}>
            <iframe ref={viewerIframe} width='100%' height='100%' />
        </div>
    </div>
}

export default FactExpressionViewer
