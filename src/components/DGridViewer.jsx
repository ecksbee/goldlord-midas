import { onMount } from 'solid-js'

import store from '../lib/store'
import dataGrid from '../lib/dataGrid'
import arcDiagram from '../lib/arcDiagram'
import transformRootDomain from '../lib/transformRootDomain'
import transformDRS from '../lib/transformDRS'

const DGridViewer = () => {
    let dGridDiv
    let arcDiagramDiv
    onMount(()=> {
        const renderable = store.getRenderable()
        const dGrid = renderable.DGrid
        const rootDomain = dGrid.RootDomains[0]
        const rootDomainBlob = transformRootDomain(rootDomain)
        setTimeout(() => {
            dataGrid(rootDomainBlob.grid, rootDomainBlob.numFrozenRows, 1, dGridDiv, (grid, e) => {
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
            })
        }, 100)
        setTimeout(
            () => {
                const arcDiagramData = transformDRS(dGrid.DRS)
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
            'background-color': 'black',
            color: 'white',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            display: store.getVisibleArcDiagram() ? 'block' : 'none'
        }}>
            <fluent-button id='hide-arc-diagram-button' appearance='accent' onClick={
                    e => {
                        store.setVisibleArcDiagram(false)
                    }
                }>Back</fluent-button>
            <div id='arc-diagram' ref={arcDiagramDiv} />
        </div>
    </>
}

export default DGridViewer