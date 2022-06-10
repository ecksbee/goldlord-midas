import { createStore } from 'solid-js/store'
import fetchCatalog from './fetchCatalog'
import fetchRenderabale from './fetchRenderabale'

const initialState = {
    catalog: null,
    hash: null,
    renderable: null,
    loading: true,
    error: false,
    visibleArcDiagram: false,
    narrativeFact: null,
    lang: 'Unlabelled',
    labelRole: 'Default',
}

const [state, setState] = createStore(initialState)
const setCatalog = (newCatalog) => {
    setState('catalog', () => newCatalog)
}
const setLoading = (newVal) => {
    setState('loading', () => newVal)
}
const setError = (newVal) => {
    setState('error', () => newVal)
}
const setHash = (newVal) => {
    setState('hash', () => newVal)
}
const setRenderable = (newRenderable) => {
    setState('renderable', () => newRenderable)
}
const setVisibleArcDiagram = (newVal) => {
    setState('visibleArcDiagram', () => !!newVal)
}
const showNarrativeFact = (r, c, q) => {
    setState('narrativeFact', () => ({
        rowIndex: r,
        columnIndex: c,
        linkbase: q,
    }))
}
const hideNarrativeFact = (r, c) => {
    setState('narrativeFact', () => null)
}
const narrativeFactInnerHtml = () => {
    if (!state.narrativeFact && !state.renderable) {
        return null
    }
    const { rowIndex, columnIndex, linkbase } = state.narrativeFact
    const fact = state.renderable[linkbase].FactualQuadrant[rowIndex][columnIndex]
    console.log(fact)
    return fact?.[state.lang].TextBlock
}

const loadCatalog = async () => {
    setLoading(true)
    setError(false)
    setHash(null)
    let fetched
    try {
      fetched = await fetchCatalog()
      setLoading(false)
      setError(false)
      setCatalog(fetched)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(true)
      setCatalog(null)
      setRenderable(null)
      return
    }
}
const loadRenderable = async (hash) => {
    setLoading(true)
    setError(false)
    setHash(hash)
    let fetched
    try {
      fetched = await fetchRenderabale(hash)
      setLoading(false)
      setError(false)
      setRenderable(fetched)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(true)
      setCatalog(null)
      setRenderable(null)
      return
    }
}

export default {
    loadCatalog,
    getCatalog: () => state.catalog,
    setCatalog,
    getLoading: () => state.loading,
    setLoading,
    getError: () => state.error,
    setError,
    getHash: () => state.hash,
    setHash,
    loadRenderable,
    getRenderable: () => state.renderable,
    setRenderable,
    getVisibleArcDiagram: () => state.visibleArcDiagram,
    setVisibleArcDiagram,
    getNarrativeFact: () => state.narrativeFact,
    showNarrativeFact,
    hideNarrativeFact,
    narrativeFactInnerHtml,
    getLang: () => state.lang,
    // setLang
    getLabelRole: () => state.labelRole,
    // setLabelRole
}