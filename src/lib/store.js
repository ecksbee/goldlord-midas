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
    footnotes: null,
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
const showFootnotes = (r, c, q, i) => {
    setState('footnotes', () => ({
        rowIndex: r,
        columnIndex: c,
        linkbase: q,
        index: i,
    }))
}
const hideFootnotes = () => {
    setState('footnotes', () => null)
}
const footnotesInnerHtml = () => {
    if (!state.footnotes && !state.renderable) {
        return null
    }
    const { rowIndex, columnIndex, linkbase, index } = state.footnotes
    const superscripts = footnotesSuperscripts(state.renderable, rowIndex, columnIndex, linkbase)
    if (!superscripts.length) {
        return null
    }
    console.log(superscripts)
    let text = '<ul>'
    switch (linkbase) {
        case 'PGrid':
            state.renderable[linkbase].Footnotes.forEach(
                (footnote, i) => {
                    if (superscripts.includes(i + 1)) {
                        text += `<li>${footnote}</li>`
                    }
                }
            )
            break
        case 'DGrid':
            state.renderable[linkbase].RootDomains[index].Footnotes.forEach(
                (footnote, i) => {
                    if (superscripts.includes(i + 1)) {
                        text += `<li>${footnote}</li>`
                    }
                }
            )
            break
        case 'CGrid':
            state.renderable[linkbase].SummationItems[index].Footnotes.forEach(
                (footnote, i) => {
                    if (superscripts.includes(i + 1)) {
                        text += `<li>${footnote}</li>`
                    }
                }
            )
            break
    }
    text += '</ul>'
    return text
}
const footnotesSuperscripts = (renderable, rowIndex, columnIndex, linkbase, index) => {
    let ret = []
    switch (linkbase) {
        case 'PGrid':
            ret = renderable[linkbase].FootnoteGrid[rowIndex][columnIndex]
            break
        case 'DGrid':
            label = renderable[linkbase].RootDomains[index].FootnoteGrid[rowIndex][columnIndex]
            break
        case 'CGrid':
            label = renderable[linkbase].SummationItems[index].FootnoteGrid[rowIndex][columnIndex]
            break
    }

    const superscripts = renderable[linkbase].FootnoteGrid[rowIndex][columnIndex]
    return ret || []
}
const footnotesLabel = () => {
    if (!state.footnotes && !state.renderable) {
        return null
    }
    const { rowIndex, linkbase, index } = state.footnotes
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
const footnotesPeriodHeader = () => {
    if (!state.footnotes && !state.renderable) {
        return null
    }
    const { columnIndex, linkbase, index } = state.footnotes
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
    setCatalog(null)
    setRenderable(null)
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
    setRenderable(null)
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
    getFootnotes: () => state.footnotes,
    showFootnotes,
    hideFootnotes,
    footnotesSuperscripts,
    footnotesInnerHtml,
    footnotesLabel,
    footnotesPeriodHeader,
}