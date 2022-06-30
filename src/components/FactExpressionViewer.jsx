import { onMount, createSignal } from 'solid-js'
import Fuse from 'fuse.js'
import store from '../lib/store'
import styles from './FactExpressionViewer.module.css'

const FactExpressionViewer = () => {
    const [title, setTitle] = createSignal('...')
    const [indexes, setIndexes] = createSignal(null)
    const [results, setResults] = createSignal([])
    const [selected, setSelected] = createSignal(null)
    let viewerIframe
    let highlightStacks = []
    const highlightPrefix = 'hl-'
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
            .numeric {
                border-top: 1pt solid orange;
                border-bottom: 1pt solid orange;
                display: inline;
            }
            .narrative {
                box-shadow: -2px 0px 0px 0px orange, 2px 0px 0px 0px orange;
            }
            .narrative::before {
                content: "  ";
                background-color: orange;
            }
            .narrative::after {
                content: "  ";
                background-color: orange;
            }
            .narrative-highlight {
                z-index: 99999;
                position: absolute;
                left: 0;
                background-image: linear-gradient(to right, rgba(255,165,0,0), rgba(255,165,0,0.5));
            }
            .narrative-focused {
                z-index: -99999;
                position: fixed;
                left: 0;
                width: 100vw;
                background-image: linear-gradient(to right, rgba(255,165,0,0), rgba(255,165,0,0.5));
            }
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
        iframeHead.appendChild(iframeStyle)
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
                const expression = expressions[id]
                ixtag.addEventListener('click', e => {
                    setSelected(expression)
                    ids.forEach(
                        tempid => {
                            const ixtag = viewerIframe.contentWindow.document.getElementById(tempid)
                            let tagName = ixtag.tagName
                            const colonIndex = tagName.indexOf(':')
                            if (colonIndex > -1) {
                                tagName = tagName.substring(colonIndex + 1)
                            }
                            switch (tagName.toLowerCase()) {
                                case 'nonnumeric':
                                    if (id === tempid) {
                                        ixtag.classList.add('narrative')
                                        const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + id)
                                        narrativeHighlight.style.width = `100vw`
                                        narrativeHighlight.style.display = `block`
                                    } else {
                                        ixtag.classList.remove('narrative')
                                        const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + tempid)
                                        narrativeHighlight.style.width = `0`
                                        narrativeHighlight.style.display = `none`
                                    }
                                    break;
                                case 'nonfraction':
                                    if (id === tempid) {
                                        ixtag.classList.add('numeric')
                                    } else {
                                        ixtag.classList.remove('numeric')
                                    }
                                    break;
                                default:
                            }
                        }
                    )
                    e.stopPropagation()
                })
                switch (tagName.toLowerCase()) {
                    case 'nonnumeric':
                        ixtag.classList.add('narrative')
                        const iframeBody = viewerIframe.contentDocument.body
                        const narrativeHighlight = viewerIframe.contentDocument.createElement('div')
                        const top = ixtag.getBoundingClientRect().top
                        let bottom = ixtag.getBoundingClientRect().bottom
                        let continuedat = ixtag.getAttribute('continuedat')
                        while (continuedat) {
                            let cont = viewerIframe.contentWindow.document.getElementById(continuedat)
                            bottom = cont.getBoundingClientRect().bottom
                            continuedat = cont.getAttribute('continuedat')
                        }
                        narrativeHighlight.id = highlightPrefix + id
                        narrativeHighlight.classList.add('narrative-highlight')
                        narrativeHighlight.style.top = `${top}px`
                        narrativeHighlight.style.height = `${bottom - top}px`
                        narrativeHighlight.style.width = `0`
                        narrativeHighlight.style.display = `none`
                        iframeBody.appendChild(narrativeHighlight)
                        break;
                    case 'nonfraction':
                        ixtag.classList.add('numeric')
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
            {
                !selected() && <div id={styles['search-container']}>
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
                                                    const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + id)
                                                    if (highlighted.includes(id)) {
                                                        ixtag.classList.add('narrative')
                                                        narrativeHighlight.style.width = `100vw`
                                                        narrativeHighlight.style.display = `block`
                                                    } else {
                                                        ixtag.classList.remove('narrative')
                                                        narrativeHighlight.style.width = `0`
                                                        narrativeHighlight.style.display = `none`
                                                    }
                                                    break;
                                                case 'nonfraction':
                                                    if (highlighted.includes(id)) {
                                                        ixtag.classList.add('numeric')
                                                    } else {
                                                        ixtag.classList.remove('numeric')
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
                                                    const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + id)
                                                    ixtag.classList.add('narrative')
                                                    narrativeHighlight.style.width = `0`
                                                    narrativeHighlight.style.display = `none`
                                                    break;
                                                case 'nonfraction':
                                                    ixtag.classList.add('numeric')
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
            }
            <div id={styles.results}>
                {
                    !selected() && results() && <ul id={styles['results-list']}>{results().map(
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
                                                    const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + id)
                                                    if (targetId === id) {
                                                        ixtag.classList.add('narrative')
                                                        target = ixtag
                                                        narrativeHighlight.style.width = `100vw`
                                                        narrativeHighlight.style.display = `block`
                                                    } else {
                                                        ixtag.classList.remove('narrative')
                                                        narrativeHighlight.style.width = `0`
                                                        narrativeHighlight.style.display = `none`
                                                    }
                                                    break;
                                                case 'nonfraction':
                                                    if (targetId === id) {
                                                        ixtag.classList.add('numeric')
                                                        target = ixtag
                                                    } else {
                                                        ixtag.classList.remove('numeric')
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
                                        setSelected(expressions[targetId])
                                    }
                                }
                            }>{text}</li>
                        }
                    )}</ul>
                }
                {
                    selected() && <>
                        <h2>{
                            () => {
                                const labelRole = store.getLabelRole()
                                const lang = store.getLang()
                                return selected().Labels[labelRole][lang]
                            }
                        }</h2>
                        <h3>{
                            () => {
                                const lang = store.getLang()
                                return selected().Context.Period[lang]
                            }
                        }</h3>
                        {
                            () => {
                                const labelRole = store.getLabelRole()
                                const lang = store.getLang()
                                const vq = selected().Context.VoidQuadrant
                                const cmg = selected().Context.ContextualMemberGrid
                                if (!vq?.length && !cmg?.[0]?.length) {
                                    return null
                                }
                                return <ul>{
                                    vq.map(
                                        (vcell, i) => {
                                            let vtext = ''
                                            let cmtext = ''
                                            if (vcell.TypedDomain) {
                                                if (vcell.TypedDomain.Label[labelRole]) {
                                                    const langVal =
                                                        vcell.TypedDomain.Label[labelRole][lang]
                                                    const unlabelledVal =
                                                        vcell.TypedDomain.Label.Default
                                                            .Unlabelled
                                                    vtext = langVal || unlabelledVal
                                                } else {
                                                    vtext = vcell.TypedDomain.Label.Default
                                                        .Unlabelled
                                                }
                                            } else {
                                                if (vcell.Dimension.Label[labelRole]) {
                                                    const langVal =
                                                        vcell.Dimension.Label[labelRole][lang]
                                                    const unlabelledVal =
                                                        vcell.Dimension.Label.Default.Unlabelled
                                                        vtext = langVal || unlabelledVal
                                                } else {
                                                    vtext = vcell.Dimension.Label.Default.Unlabelled
                                                }
                                            }
                                            const memberCell = cmg[0][i]
                                            if (memberCell.TypedMember) {
                                                cmtext = memberCell.TypedMember
                                            } else if (memberCell.ExplicitMember) {
                                                if (memberCell.ExplicitMember.Label[labelRole]) {
                                                    const explicitMember = memberCell.ExplicitMember
                                                    const langVal =
                                                        explicitMember.Label[labelRole][lang]
                                                    const unlabelledVal =
                                                        explicitMember.Label.Default.Unlabelled
                                                    cmtext = langVal || unlabelledVal
                                                } else {
                                                    cmtext = memberCell.ExplicitMember.Label.Default
                                                        .Unlabelled
                                                }
                                            } else {
                                                cmtext = ''
                                            }
                                            return <li><h3>{vtext}</h3>: <h4>{cmtext}</h4></li>
                                        }
                                    )
                                }</ul>
                            }
                        }
                        <p>Measurement: {selected().Measurement || 'nil'}</p>
                        <p>Precision: {selected().Precision}</p>
                        {selected()?.Footnotes.length && <>
                            <h3>Footnotes</h3>
                            <ol>
                                {
                                    selected().Footnotes.map(
                                        f => <li>{f}</li>
                                    )
                                }
                            </ol>
                        </>}
                        <div id={styles.viewer}><fluent-button appearance='accent' onClick={
                            e => {
                                const catalog = store.getCatalog()
                                const expressions = catalog.Expressions
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
                                                const narrativeHighlight = viewerIframe.contentWindow.document.getElementById(highlightPrefix + id)
                                                ixtag.classList.add('narrative')
                                                narrativeHighlight.style.width = `0`
                                                narrativeHighlight.style.display = `none`
                                                break;
                                            case 'nonfraction':
                                                ixtag.classList.add('numeric')
                                                break;
                                            default:
                                        }
                                    }
                                )
                                setSelected(null)
                            }
                        }>Clear</fluent-button></div>
                    </>
                }
            </div>
        </div>
    </div>
}

export default FactExpressionViewer
