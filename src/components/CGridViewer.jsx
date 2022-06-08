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
            const summationItem = cGrid.SummationItems[0]
            const blob = transformSummationItem(summationItem)
            setTimeout(() => {
                dataGrid(blob.grid, blob.numFrozenRows, 2, summationItemDiv, (grid, e) => {
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
