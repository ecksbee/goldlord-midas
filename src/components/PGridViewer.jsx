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
            console.log(blob.grid)
            setTimeout(() => {
                dataGrid(blob.grid, blob.numFrozenRows, 1, pGridDiv, null)
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
