import { onMount, createSignal } from 'solid-js'
import Fuse from 'fuse.js'
import store from '../lib/store'
import styles from './FactExpressionViewer.module.css'

const FactExpressionViewer = () => {
    const [title, setTitle] = createSignal('...')
    const [indexes, setIndexes] = createSignal(null)
    const [results, setResults] = createSignal([])
    let viewerIframe
    onMount(() => {
        const catalog = store.getCatalog()
        setTitle(catalog.DocumentName)
        const expressions = catalog.Expressions
        const ixbrldocument = store.getIxbrlDocument()
        viewerIframe.contentDocument.write(ixbrldocument)
        const iframeHead = viewerIframe.contentDocument.head
        const iframeStyle = viewerIframe.contentDocument.createElement('style')
        iframeHead.appendChild(iframeStyle)
        iframeStyle.appendChild(document.createTextNode(`
            .alert-fact {
                animation-name: alert-fact;
                animation-duration: 4s;
                animation-timing-function: linear;
                animation-iteration-count: 1;
            }
            @keyframes alert-fact {
                0%   {
                    transform: scale(2);
                    background-color: yellow;
                }
                25%  {
                    transform: scale(1.5);
                    background-color: orange;
                }
                50%  {
                    transform: scale(2);
                    background-color: unset;
                }
                100% {
                    transform: scale(1);
                    background-color: orange;
                }
            }
        `))
        const ids = Object.keys(expressions)
        const searchDocs = ids.map(
            id => {
                return {
                    ...(expressions[id]),
                    id
                }
            }
        )
        const commonOptions = {
            isCaseSensitive: false,
            includeScore: false,
            shouldSort: true,
            includeMatches: true,   //todo highlight matches
            findAllMatches: false,
            minMatchCharLength: 1,
            location: 0,
            threshold: 0.6,
            distance: 100,
            useExtendedSearch: false,
            ignoreLocation: false,
            ignoreFieldNorm: false,
            fieldNormWeight: 1,
        }
        setIndexes({
            'Default': {
                'Unlabelled': new Fuse(searchDocs, {
                    ...commonOptions,
                    keys: [
                        'Labels.Default.Unlabelled',
                    ]
                })
            }
        })
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
        height: '100vh',
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
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            'min-width': '320px',
            height: '100vh',
        }}>
            <div id={styles['title-container']}>
                <h1>{title()}</h1>
            </div>
            <div id={styles['search-container']}>
                <fluent-text-field id={styles.search} appearance='filled' placeholder='Search fact expressions' 
                    onChange={
                        e => {
                            const catalog = store.getCatalog()
                            const expressions = catalog.Expressions
                            const ids = Object.keys(expressions)
                            if (e?.target?.value) {
                                const labelRole = store.getLabelRole()
                                const lang = store.getLang()
                                const currIndex = indexes()[labelRole][lang]
                                const res = currIndex.search(e?.target?.value) 
                                setResults(
                                    res || []
                                )
                                const highlighted = res.map( r => r.item.id)
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
                                                if (highlighted.includes(id)) {
                                                    ixtag.style['box-shadow'] = `-2px 0px 0px 0px orange, 2px 0px 0px 0px orange`
                                                } else {
                                                    ixtag.style['box-shadow'] = `unset`
                                                }
                                                break;
                                            case 'nonfraction':
                                                if (highlighted.includes(id)) {
                                                    ixtag.style['border-top'] = `2pt solid orange`
                                                    ixtag.style['border-bottom'] = `2pt solid orange`
                                                    ixtag.style.display = `inline`
                                                } else {
                                                    ixtag.style['border-top'] = `unset`
                                                    ixtag.style['border-bottom'] = `unset`
                                                    ixtag.style.display = `inline`
                                                }
                                                break;
                                            default:
                                        }
                                    }
                                )
                            } else {
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
                                                ixtag.style['border-top'] = `2pt solid orange`
                                                ixtag.style['border-bottom'] = `2pt solid orange`
                                                ixtag.style.display = `inline`
                                                break;
                                            default:
                                        }
                                    }
                                )
                            }
                        }
                    }
                />
            </div>
            <div id={styles.results}>
                {
                    results() && <ul id={styles['results-list']}>{results().map(
                        r => {
                            const labelRole = store.getLabelRole()
                            const lang = store.getLang()
                            const text = r.item.Labels[labelRole][lang]
                            const targetId = r.item.id
                            const catalog = store.getCatalog()
                            const expressions = catalog.Expressions
                            const ids = Object.keys(expressions)
                            return <li onClick={
                                e => {
                                    let target
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
                                                    if (targetId === id) {
                                                        ixtag.style['box-shadow'] = `-2px 0px 0px 0px orange, 2px 0px 0px 0px orange`
                                                        target = ixtag
                                                    } else {
                                                        ixtag.style['box-shadow'] = `unset`
                                                    }
                                                    break;
                                                case 'nonfraction':
                                                    if (targetId === id) {
                                                        ixtag.style['border-top'] = `2pt solid orange`
                                                        ixtag.style['border-bottom'] = `2pt solid orange`
                                                        ixtag.style.display = `inline-block`
                                                        target = ixtag
                                                    } else {
                                                        ixtag.style['border-top'] = `unset`
                                                        ixtag.style['border-bottom'] = `unset`
                                                        ixtag.style.display = `inline`
                                                    }
                                                    break;
                                                default:
                                            }
                                        }
                                    )
                                    if (target) {
                                        target.scrollIntoView()
                                        target.classList.add('alert-fact')
                                        setTimeout(
                                            () => {
                                                target.classList.remove('alert-fact')
                                            },
                                            5000
                                        )
                                    }
                                }
                            }>{text}</li>
                        }
                    )}</ul>
                }
            </div>
        </div>
    </div>
}

export default FactExpressionViewer
