import { onMount, createSignal } from 'solid-js'
import store from '../lib/store'
import styles from './FactExpressionViewer.module.css'
import canvasDatagrid from 'canvas-datagrid'

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message)                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer))                     // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex;
}

function renderExpression(expressable, theCanvasGrid) {
    const labelRole = store.getLabelRole()
    const lang = store.getLang()
    let datagrid = []
    const period = expressable.Context.Period[lang]
    datagrid.push([ '', period, ''])
    const vq = expressable.Context.VoidQuadrant
    const cmg = expressable.Context.ContextualMemberGrid
    const dimensionless = !vq?.length && !cmg?.[0]?.length
    if (!dimensionless) {
        vq.forEach((vcell, i) => {
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
                datagrid.push([vtext, cmtext, ''])
            })
    }
    const concept = expressable.Labels[labelRole][lang]
    const fact = expressable.Expression
    let factvalue = ''
    if (fact.Unlabelled.Core) {
        if (fact[lang]) {
            factvalue =
                fact[lang].Head +
                    fact[lang].Core +
                    fact[lang].Tail
        } else {
            factvalue =
                fact.Unlabelled.Head +
                    fact.Unlabelled.Core +
                    fact.Unlabelled.Tail
        }
    } else if (fact.Unlabelled.InnerHtml) {
        factvalue = '...'
    } else {
        factvalue = ''
    }
    datagrid.push([concept, factvalue, ''])
    theCanvasGrid.data = datagrid
    theCanvasGrid.draw()
}

function mountFactTable(facttablediv, cb) {
    setTimeout(() => {
        const grid = canvasDatagrid({
            allowSorting: false, // affected by this bug https://github.com/TonyGermaneri/canvas-datagrid/issues/261
            allowColumnReordering: false,
            autoResizeColumns: false,
            editable: false,
            allowFreezingColumns: false,
            allowFreezingRows: false,
            style: {
                cellFont: '10.66px CarlitoRegular',
                columnHeaderCellFont: '12px CarlitoRegular',
                rowHeaderCellFont: '12px CarlitoRegular',
                activeCellFont: '10.66px CarlitoRegular',
            }
        })
        facttablediv.appendChild(grid)
        grid.style.height = '90vh'
        grid.style.width = '98%'
        grid.data = [['', ''],['', '']]
        grid.addEventListener('beforesortcolumn', e => {
            e.preventDefault()
        })
        grid.draw()
        cb(grid)
    }, 100)
}

const FactExpressionViewer = () => {
    const [title, setTitle] = createSignal('...')
    const [getGrid, setGrid] = createSignal(null)
    let viewerIframe, facttablediv
    const highlightPrefix = 'hl-'
    onMount(async () => {
        mountFactTable(facttablediv, (grid) => {
            setGrid(grid)
        })
        const catalog = store.getCatalog()
        setTitle(catalog.DocumentName)
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
            .numeric:hover {
                border-top: 3pt solid orange;
                border-bottom: 3pt solid orange;
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
        const nonFractions = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonfraction")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
        let allNonFractions = []
        try {
            let thisNode = nonFractions.iterateNext()
            while (thisNode) {
                let name = thisNode.getAttribute('name')
                let contextref = thisNode.getAttribute('contextref')
                thisNode.addEventListener('click', async ev => {
                    const mynonNumerics = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonnumeric")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                    const mynonFractions = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonfraction")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                    let offNarratives = []
                    let offNumerics = []
                    try {
                        let mynode = mynonNumerics.iterateNext()
                        while (mynode) {
                            offNarratives.push(mynode)
                            mynode = mynonNumerics.iterateNext()
                        }
                    }
                    catch(e) {
                        console.error(e)
                    }
                    try {
                        let mynode = mynonFractions.iterateNext()
                        while (mynode) {
                            offNumerics.push(mynode)
                            mynode = mynonFractions.iterateNext()
                        }
                    }
                    catch(e) {
                        console.error(e)
                    }
                    offNarratives.forEach(async mynode => {
                        mynode.classList.remove('narrative')
                        let name = mynode.getAttribute('name')
                        let contextref = mynode.getAttribute('contextref')
                        const offId = await digestMessage(name+'/'+contextref)
                        const offnarrativeHighlight = viewerIframe.contentDocument.getElementById(highlightPrefix + offId)
                        offnarrativeHighlight.style.width = `0`
                        offnarrativeHighlight.style.display = `none`
                    })
                    offNumerics.forEach(mynode => {
                        mynode.classList.remove('numeric')
                    })
                    const targetNode = viewerIframe.contentDocument.querySelector(`[contextref="${contextref}"][name="${name}"]`)
                    targetNode.classList.add('numeric')
                    ev.stopPropagation()
                    await store.loadExpressable(name, contextref)
                    const expressable = store.getExpressable()
                    renderExpression(expressable, getGrid())
                })
                allNonFractions.push(thisNode)
                thisNode = nonFractions.iterateNext()
            }
        }
        catch(e) {
            console.error(e)
        }
        allNonFractions.forEach(thisNode => {
            thisNode.classList.add('numeric')
        })
        const nonNumerics = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonnumeric")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
        let allNonNumerics = []
        try {
            let thisNode = nonNumerics.iterateNext()
            while (thisNode) {
                let name = thisNode.getAttribute('name')
                let contextref = thisNode.getAttribute('contextref')
                const targetId = await digestMessage(name+'/'+contextref)
                thisNode.addEventListener('click', async ev => {
                    const mynonNumerics = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonnumeric")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                    const mynonFractions = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonfraction")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                    let offNarratives = []
                    let offNumerics = []
                    try {
                        let mynode = mynonNumerics.iterateNext()
                        while (mynode) {
                            offNarratives.push(mynode)
                            mynode = mynonNumerics.iterateNext()
                        }
                    }
                    catch(e) {
                        console.error(e)
                    }
                    try {
                        let mynode = mynonFractions.iterateNext()
                        while (mynode) {
                            offNumerics.push(mynode)
                            mynode = mynonFractions.iterateNext()
                        }
                    }
                    catch(e) {
                        console.error(e)
                    }
                    offNarratives.forEach(async mynode => {
                        mynode.classList.remove('narrative')
                        let name = mynode.getAttribute('name')
                        let contextref = mynode.getAttribute('contextref')
                        const offId = await digestMessage(name+'/'+contextref)
                        if (targetId == offId) {
                            return
                        }
                        const offnarrativeHighlight = viewerIframe.contentDocument.getElementById(highlightPrefix + offId)
                        offnarrativeHighlight.style.width = `0`
                        offnarrativeHighlight.style.display = `none`
                    })
                    offNumerics.forEach(mynode => {
                        mynode.classList.remove('numeric')
                    })
                    const targetNode = viewerIframe.contentDocument.querySelector(`[contextref="${contextref}"][name="${name}"]`)
                    targetNode.classList.add('narrative')
                    const clickednarrativeHighlight = viewerIframe.contentDocument.getElementById(highlightPrefix + targetId)
                    clickednarrativeHighlight.style.width = `100vw`
                    clickednarrativeHighlight.style.display = `block`
                    ev.stopPropagation()
                    await store.loadExpressable(name, contextref)
                    const expressable = store.getExpressable()
                    renderExpression(expressable, getGrid())
                })
                allNonNumerics.push(thisNode)
                thisNode = nonNumerics.iterateNext()
            }
        }
        catch(e) {
            console.error(e)
        }
        const iframeBody = viewerIframe.contentDocument.body
        allNonNumerics.forEach(async thisNode => {
            thisNode.classList.add('narrative')
            const narrativeHighlight = viewerIframe.contentDocument.createElement('div')
            const top = thisNode.getBoundingClientRect().top
            let bottom = thisNode.getBoundingClientRect().bottom
            let continuedat = thisNode.getAttribute('continuedat')
            while (continuedat) {
                let cont = viewerIframe.contentDocument.getElementById(continuedat)
                bottom = cont.getBoundingClientRect().bottom
                continuedat = cont.getAttribute('continuedat')
            }
            let name = thisNode.getAttribute('name')
            let contextref = thisNode.getAttribute('contextref')
            const targetId = await digestMessage(name+'/'+contextref)
            narrativeHighlight.id = highlightPrefix + targetId
            narrativeHighlight.classList.add('narrative-highlight')
            narrativeHighlight.style.top = `${top}px`
            narrativeHighlight.style.height = `${bottom - top}px`
            narrativeHighlight.style.width = `0`
            narrativeHighlight.style.display = `none`
            iframeBody.appendChild(narrativeHighlight)
        })
    })
    return <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        'min-width': 'calc(800px + 600px)',
        height: '100vh',
    }}>
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(100vw - 600px)',
            'min-width': '800px',
            height: '100vh'
        }}>
            <iframe ref={viewerIframe} width='100%' height='100%' />
        </div>
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            'min-width': '600px',
            height: '96vh',
        }}>
            <div id={styles['title-container']}>
                <h1>{title()}
                <a href='#' onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    store.hideFactExpressionViewer()
                }}>[X]</a>
                </h1>
            </div>
        <div id={styles.results} ref={facttablediv}>
                        
                        
            {/* <div id={styles.viewer}><fluent-button appearance='accent' onClick={
                            e => {
                                const mynonNumerics = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonnumeric")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                                const mynonFractions = viewerIframe.contentDocument.evaluate('//*[contains(name(),"nonfraction")]', viewerIframe.contentDocument, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
                                const allNonFractions = []
                                const allNonNumerics = []
                                try {
                                    let mynode = mynonNumerics.iterateNext()
                                    while (mynode) {
                                        allNonNumerics(mynode)
                                        mynode = iterator.iterateNext()
                                    }
                                }
                                catch(e) {
                                    console.error(e)
                                }
                                try {
                                    let mynode = mynonFractions.iterateNext()
                                    while (mynode) {
                                        allNonFractions.push(mynode)
                                        mynode = mynonFractions.iterateNext()
                                    }
                                }
                                catch(e) {
                                    console.error(e)
                                }
                                allNonFractions.forEach(mynode => {
                                    mynode.classList.add('numeric')
                                })
                                allNonNumerics.forEach(async mynode => {
                                    mynode.classList.add('narrative')
                                    let name = mynode.getAttribute('name')
                                    let contextref = mynode.getAttribute('contextref')
                                    const otherID = await digestMessage(name+'/'+contextref)
                                    const othernarrativeHighlight = viewerIframe.contentDocument.getElementById(highlightPrefix + otherID)
                                    othernarrativeHighlight.style.width = `0`
                                    othernarrativeHighlight.style.display = `none`
                                })
                                store.setExpressable(null)
                            }
                        }>Clear</fluent-button></div> */}
            </div>
        </div>
    </div>
}

export default FactExpressionViewer
