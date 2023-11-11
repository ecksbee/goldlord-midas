import { For } from 'solid-js'
import store from '../lib/store'
import commonStyles from './Common.module.css'

const LabelManager = () => {
    const labelRoles = store.getRenderable().LabelRoles
    const languages = store.getRenderable().Lang
    return <div>
        <label>LabelRole</label>
        <fluent-combobox class={commonStyles['combo-boxes']} current-value={store.getLabelRole()} >
            <For each={labelRoles}>
                {(labelRole) => (<fluent-option value={labelRole} onClick={e => {
                        store.setLabelRole(labelRole)
                    }}>{labelRole}</fluent-option>)}
            </For>
        </fluent-combobox>
        <label>Lang</label>
        <fluent-combobox class={commonStyles['combo-boxes']} current-value={store.getLang()} >
            <For each={languages}>
                {(lang) => (<fluent-option value={lang} onClick={e => {
                        store.setLang(lang)
                    }}>{lang}</fluent-option>)}
            </For>
        </fluent-combobox>
        </div>
}

export default LabelManager
