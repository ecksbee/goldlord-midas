import { onMount } from 'solid-js'
import {
    provideFluentDesignSystem,
    fluentCombobox,
    fluentOption,
    fluentTab,
    fluentTabPanel,
    fluentTabs,
    fluentButton,
    fluentTextField,
    fluentListbox
} from '@fluentui/web-components'
import 'isomorphic-fetch'

import store from './lib/store'
import CatalogPage from './components/CatalogPage'
import BrowserPage from './components/BrowserPage'
import Leaflet from './components/Leaflet'
import logo from './logo.svg'
import FactExpressionViewer from './components/FactExpressionViewer'
import styles from './App.module.css'
provideFluentDesignSystem().register(
    fluentCombobox(),
    fluentOption(),
    fluentListbox(),
    fluentTab(),
    fluentTabPanel(),
    fluentTabs(),
    fluentButton(),
    fluentTextField()
)

const App = () => {
  onMount(async () => {
      try {
        await store.loadCatalog()
        const c = store.getCatalog()
        if (c.DocumentName) {
          await store.loadIxbrlDocument(c.DocumentName)
        }
      } catch (e) {
        console.error(e)
      }
  })
  return <>
    {store.getLoading() && !store.getError() && <div id={styles['splash-screen']}><img style={{height: '100%', width: '100%'}} src={logo} /></div>}
    {store.getError() && <div>error!</div>}
    {
      !store.getLoading() && !store.getError() && <>
        {
            store.isFactExpressionViewerVisible() && <FactExpressionViewer />
        }
        {
            !store.isFactExpressionViewerVisible() && <>
            {
                store.getCatalog() && !store.getHash() && <CatalogPage />
            }
            {
                store.getHash() && store.getRenderable() && <BrowserPage />
            }
            </>
        }
        {
            store.getNarrativeFact() && !store.getFootnotes() && <Leaflet />
        }
        {
            store.getFootnotes() && <Leaflet />
        }
      </>
    }
  </>
}

export default App