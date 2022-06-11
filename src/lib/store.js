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
const showNarrativeFact = (r, c, q, i) => {
    setState('narrativeFact', () => ({
        rowIndex: r,
        columnIndex: c,
        linkbase: q,
        index: i,
    }))
}
const hideNarrativeFact = () => {
    setState('narrativeFact', () => null)
}
const narrativeFactInnerHtml = () => {
    if (!state.narrativeFact && !state.renderable) {
        return null
    }
    const { rowIndex, columnIndex, linkbase } = state.narrativeFact
    const fact = state.renderable[linkbase].FactualQuadrant[rowIndex][columnIndex]
    return fact?.[state.lang].TextBlock
}
const narrativeFactLabel = () => {
    if (!state.narrativeFact && !state.renderable) {
        return null
    }
    const { rowIndex, linkbase, index } = state.narrativeFact
    let label = ''
    const dataGrid = state.renderable[linkbase]
    switch (linkbase) {
        case 'PGrid':
            label = dataGrid.IndentedLabels[rowIndex].Label[state.labelRole][state.lang]
            break
        case 'DGrid':
            label = dataGrid.RootDomains[index].PrimaryItems[rowIndex].Label[state.labelRole][state.lang]
            break
        case 'CGrid':
            label = dataGrid.SummationItems[index].ContributingConcepts[rowIndex].Label[state.labelRole][state.lang]
            break
    }
    return label
}
const narrativeFactPeriodHeader = () => {
    if (!state.narrativeFact && !state.renderable) {
        return null
    }
    const { columnIndex, linkbase, index } = state.narrativeFact
    let periodHeader = ''
    const dataGrid = state.renderable[linkbase]
    switch (linkbase) {
        case 'PGrid':
            periodHeader = dataGrid.PeriodHeaders[columnIndex][state.lang]
            break
        case 'DGrid':
            periodHeader = dataGrid.RootDomains[index].PeriodHeaders[columnIndex][state.lang]
            break
        case 'CGrid':
            periodHeader = dataGrid.SummationItems[index].PeriodHeaders[columnIndex][state.lang]
            break
    }
    return periodHeader
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
    narrativeFactLabel,
    narrativeFactPeriodHeader,
    getLang: () => state.lang,
    // setLang
    getLabelRole: () => state.labelRole,
    // setLabelRole
}