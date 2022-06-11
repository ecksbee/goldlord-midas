import { onMount } from 'solid-js'

import store from '../lib/store'
import dataGrid from '../lib/dataGrid'
import transformPGrid from '../lib/transformPGrid'

const PGridViewer = () => {
    let pGridDiv
    onMount(async ()=> {
        try {
            const renderable = await store.getRenderable()
            const pGrid = renderable.PGrid
            const blob = transformPGrid(pGrid)
            const lang = 'Unlabelled'
            const labelRole = 'Default'
            setTimeout(() => {
                dataGrid(blob.grid, blob.numFrozenRows, 1, pGridDiv, (grid, e) => {
                    if (e.cell) {
                        const r = e.cell.rowIndex - blob.numFrozenRows
                        const c = e.cell.columnIndex - 1
                        if (r > -1 && c > -1) {
                            const fact = pGrid.FactualQuadrant[r][c]
                            if (fact?.[lang].TextBlock) {
                                e.items.push({
                                    title: 'Show Narrative',
                                    click: () => {
                                        store.showNarrativeFact(r, c, 'PGrid', null)
                                    },
                                })
                            }
                        }
                    }
                })
            }, 100)
        } catch (e) {
            console.error(e)
        }
    })
    return <div id='r-viewerPresentation'>
            <div id='pgrid' ref={pGridDiv} />
        </div>
}

export default PGridViewer
