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
        const ids = Object.keys(expressions)
        ids.forEach(
            id => {
                const ixtag = viewerIframe.contentWindow.document.getElementById(id)
                let tagName = ixtag.tagName
                const colonIndex = tagName.indexOf(':')
                if (colonIndex > -1) {
                    tagName = tagName.substring(colonIndex + 1)
                }
                switch (tagName.toLowerCase()) {
                    case 'nonnumeric':
                        ixtag.style['box-shadow'] = `-2px 0px 0px 0px orange, 2px 0px 0px 0px orange`
                        break;
                    case 'nonfraction':
                        ixtag.style['border-top'] = `1pt solid orange`
                        ixtag.style['border-bottom'] = `1pt solid orange`
                        ixtag.style.display = `inline`
                        break;
                    default:
                }

            }
        )
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
