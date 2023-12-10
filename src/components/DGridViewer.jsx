import { onMount } from 'solid-js'

import store from '../lib/store'
import dataGrid from '../lib/dataGrid'
import arcDiagram from '../lib/arcDiagramVertical'
import transformRootDomain from '../lib/transformRootDomain'
import transformDRS from '../lib/transformDRS'

const DGridViewer = ({labelRole, lang}) => {
    let dGridDiv
    let arcDiagramDiv
    onMount(()=> {
        const renderable = store.getRenderable()
        const dGrid = renderable.DGrid
        if (!dGrid.RootDomains?.length) {
            setTimeout(
                () => {
                    dataGrid([['']], 1, 1, dGridDiv, null)
                },
                100
            )
            return
        }
        const rdIndex = 0
        const rootDomain = dGrid.RootDomains[rdIndex]
        const rootDomainBlob = transformRootDomain(rootDomain, labelRole, lang)
        setTimeout(() => {
            dataGrid(rootDomainBlob.grid, rootDomainBlob.numFrozenRows, 1, dGridDiv, (grid, e) => {
                if (e.cell) {
                    const r = e.cell.rowIndex - rootDomainBlob.numFrozenRows
                    const c = e.cell.columnIndex - 1
                    if (r > -1 && c > -1) {
                        const fact = rootDomain.FactualQuadrant[r][c]
                        if (fact?.[lang].InnerHtml || fact?.Unlabelled.InnerHtml) {
                            e.items.push({
                                title: 'Show Narrative',
                                click: () => {
                                    store.showNarrativeFact(r, c, 'DGrid', rdIndex)
                                },
                            })
                        }
                        const superscripts = store.footnotesSuperscripts(renderable, r, c, 'DGrid', rdIndex)
                        if (superscripts.length) {
                            e.items.push({
                                title: 'Show Footnotes',
                                click: () => {
                                    store.showFootnotes(r, c, 'DGrid', rdIndex)
                                },
                            })
                        }
                    }
                }
                e.items.push({
                    title: 'Visualize DRS',
                    click: () => {
                        store.setVisibleArcDiagram(true)
                    },
                })
                dGrid.RootDomains.forEach(item => {
                    e.items.push({
                        title: item.Href,
                        click: () => {
                            const blob = transformRootDomain(item)
                            grid.data = blob.grid
                            grid.frozenRow = blob.numFrozenRows
                            grid.draw()
                        },
                    })
                })
            }, rootDomain.FootnoteGrid, rootDomain.Footnotes)
        }, 100)
        setTimeout(
            () => {
                const arcDiagramData = transformDRS(dGrid.DRS, labelRole, lang)
                arcDiagram(arcDiagramData, arcDiagramDiv)
            },
            100
        )
    })
    return <>
        <div id='r-viewerDefinition'>
            <div id='dgrid' ref={dGridDiv} />
        </div>
        <div id='arc-diagram-wrapper' style={{
            position: 'fixed',
            'z-index': 9999,
            'background-color': 'white',
            color: 'black',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            display: store.getVisibleArcDiagram() ? 'block' : 'none'
        }}>
            <a href='#' onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                store.setVisibleArcDiagram(false)
            }}>[X]</a>
            <svg id='arc-diagram' ref={arcDiagramDiv} width='100vw' height='100vh'></svg>
        </div>
    </>
}

export default DGridViewer
