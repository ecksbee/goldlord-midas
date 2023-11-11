import { createStore } from 'solid-js/store'
import fetchCatalog from './fetchCatalog'
import fetchRenderabale from './fetchRenderabale'
import fetchIxbrlDocument from './fetchIxbrlDocument'
import fetchExpressable from './fetchExpressable'
 
const initialState = {
    mode: 'concept_network_browser',
    catalog: null,
    hash: null,
    ixbrlDocument: null,
    renderable: null,
    expressable: null,
    loading: true,
    error: false,
    visibleArcDiagram: false,
    narrativeFact: null,
    lang: 'Truncated',
    labelRole: 'Default',
    footnotes: null,
}

const [state, setState] = createStore(initialState)
const setLang = (newVal) => {
    setState('lang', () => newVal)
}
const setLabelRole = (newVal) => {
    setState('labelRole', () => newVal)
}
const showFactExpressionViewer = (newVal) => {
    setState('mode', () => 'fact_expression_viewer')
}
const hideFactExpressionViewer = (newVal) => {
    setState('mode', () => 'concept_network_browser')
}
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
const setIxbrlDocument = (ixbrlDocument) => {
    setState('ixbrlDocument', () => ixbrlDocument)
}
const setRenderable = (newRenderable) => {
    setState('renderable', () => newRenderable)
}
const setExpressable = (newExpressable) => {
    setState('expressable', () => newExpressable || null)
}
const setVisibleArcDiagram = (newVal) => {
    setState('visibleArcDiagram', () => !!newVal)
}
const showNarrativeFact = (r, c, q, i) => {
    console.log("hello")
    console.dir({
        rowIndex: r,
        columnIndex: c,
        linkbase: q,
        index: i,
    })
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
    if (state.narrativeFact) {
        if (state.renderable) {
            const { rowIndex, columnIndex, linkbase } = state.narrativeFact
            const fact = state.renderable[linkbase].FactualQuadrant[rowIndex][columnIndex]
            return fact?.[state.lang].InnerHtml
        }
        if (state.expressable) {
            return state.expressable.Expression?.[state.lang].InnerHtml
        }
    }
    return null
}
const narrativeFactLabel = () => {
    if (state.narrativeFact) {
        if (state.renderable) {
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
        if (state.expressable) {
            return state.expressable.Labels[state.labelRole][state.lang]
        }
    }
    return null
}
const narrativeFactPeriodHeader = () => {
    if (state.narrativeFact) {
        if (state.renderable) {
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
        if (state.expressable) {
            return state.expressable.Context.Period[state.lang]
        }
    }
    return null
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
    if (state.footnotes && state.renderable ) {
        const { rowIndex, columnIndex, linkbase, index } = state.footnotes
        const superscripts = footnotesSuperscripts(state.renderable, rowIndex, columnIndex, linkbase, index)
        if (!superscripts.length) {
            return null
        }
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
    if (state.expressable) {
        let text = '<ul>'
        state.expressable.Footnotes.forEach(
            (footnote, i) => {
                if (superscripts.includes(i + 1)) {
                    text += `<li>${footnote}</li>`
                }
            }
        )
        text += '</ul>'
        return text
    }
    return null
}
const footnotesSuperscripts = (renderable, rowIndex, columnIndex, linkbase, index) => {
    let ret = []
    switch (linkbase) {
        case 'PGrid':
            ret = renderable[linkbase].FootnoteGrid[rowIndex][columnIndex]
            break
        case 'DGrid':
            ret = renderable[linkbase].RootDomains[index].FootnoteGrid[rowIndex][columnIndex]
            break
        case 'CGrid':
            ret = renderable[linkbase].SummationItems[index].FootnoteGrid[rowIndex][columnIndex]
            break
    }
    return ret || []
}
const footnotesLabel = () => {
    if (state.footnotes && state.renderable) {
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
    if (state.expressable) {
        return state.expressable.Labels[state.labelRole][state.lang]
    }
    return null
}
const footnotesPeriodHeader = () => {
    if (state.footnotes && state.renderable) {
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
    if (state.expressable) {
        return state.expressable.Context.Period[state.lang]
    }
    return null
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
const loadIxbrlDocument = async (documentname) => {
    setLoading(true)
    setError(false)
    setIxbrlDocument(null)
    let fetched
    try {
      fetched = await fetchIxbrlDocument(documentname)
      setLoading(false)
      setError(false)
      setIxbrlDocument(fetched)
    } catch (e) {
      console.error(e)
      setLoading(false)
      setError(true)
      setIxbrlDocument(null)
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
const loadExpressable = async (name, contextref) => {
    // setLoading(true)
    setError(false)
    setExpressable(null)
    let fetched
    try {
      fetched = await fetchExpressable(name, contextref)
    //   setLoading(false)
      setError(false)
      setExpressable(fetched)
    } catch (e) {
      console.error(e)
    //   setLoading(false)
      setError(true)
      setExpressable(null)
      return
    }
}

export default {
    isFactExpressionViewerVisible: () => state.mode === 'fact_expression_viewer',
    showFactExpressionViewer,
    hideFactExpressionViewer,
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
    loadIxbrlDocument,
    getIxbrlDocument: () => state.ixbrlDocument,
    setIxbrlDocument,
    getVisibleArcDiagram: () => state.visibleArcDiagram,
    setVisibleArcDiagram,
    getNarrativeFact: () => state.narrativeFact,
    showNarrativeFact,
    hideNarrativeFact,
    narrativeFactInnerHtml,
    narrativeFactLabel,
    narrativeFactPeriodHeader,
    getLang: () => state.lang,
    setLang,
    getLabelRole: () => state.labelRole,
    setLabelRole,
    getFootnotes: () => state.footnotes,
    showFootnotes,
    hideFootnotes,
    footnotesSuperscripts,
    footnotesInnerHtml,
    footnotesLabel,
    footnotesPeriodHeader,
    loadExpressable,
    getExpressable: () => state.expressable,
    setExpressable,
}