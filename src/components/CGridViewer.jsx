import { onMount } from 'solid-js'

import store from '../lib/store'
import dataGrid from '../lib/dataGrid'
import transformSummationItem from '../lib/transformSummationItem'

const CGridViewer = () => {
    let summationItemDiv
    onMount(async ()=> {
        try {
            const renderable = await store.getRenderable()
            const cGrid = renderable.CGrid
            if (!cGrid.SummationItems?.length) {
                setTimeout(
                    () => {
                        dataGrid([['']], 1, 1, summationItemDiv, null)
                    },
                    100
                )
                return
            }
            const siIndex = 0
            const summationItem = cGrid.SummationItems[siIndex]
            const blob = transformSummationItem(summationItem)
            const lang = 'Unlabelled'
            const labelRole = 'Default'
            setTimeout(() => {
                dataGrid(blob.grid, blob.numFrozenRows, 2, summationItemDiv, (grid, e) => {
                    if (e.cell) {
                        const r = e.cell.rowIndex - blob.numFrozenRows
                        const c = e.cell.columnIndex - 2
                        if (r > -1 && c > -1) {
                            const fact = summationItem.FactualQuadrant[r][c]
                            if (fact?.[lang].TextBlock) {
                                e.items.push({
                                    title: 'Show Narrative',
                                    click: () => {
                                        store.showNarrativeFact(r, c, 'CGrid', siIndex)
                                    },
                                })
                            }
                            const superscripts = store.footnotesSuperscripts(renderable, r, c, 'CGrid', siIndex)
                            if (superscripts.length) {
                                e.items.push({
                                    title: 'Show Footnotes',
                                    click: () => {
                                        store.showFootnotes(r, c, 'CGrid', siIndex)
                                    },
                                })
                            }
                        }
                    }
                    cGrid.SummationItems.forEach(item => {
                        e.items.push({
                            title: item.Href,
                            click: () => {
                                const blob = transformSummationItem(item)
                                grid.data = blob.grid
                                grid.frozenRow = blob.numFrozenRows
                                grid.draw()
                            },
                        })
                    })
                })
            }, 100)
        } catch (e) {
            console.error(e)
        }
    })
    return <div id='r-viewerCalculation'>
            <div id='summationItem' ref={summationItemDiv} />
        </div>
}

export default CGridViewer
