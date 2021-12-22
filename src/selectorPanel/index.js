// function fetcher (e) {
//     alert('hello')
//     return null
// }

const catalogToSubjectDataString = catalog => {
    let subjectDataString = ``
    for (let i = 0; i < catalog.Subjects.length; i++) {
        subjectDataString +=
            `<fluent-option value="` +
            catalog.Subjects[i].Entity.Scheme +
            `/` +
            catalog.Subjects[i].Entity.CharData +
            `">` +
            catalog.Subjects[i].Entity.Scheme +
            `/` +
            catalog.Subjects[i].Entity.CharData +
            `</fluent-option>`
    }
    return subjectDataString
}
const catalogToRelationshipSetDataString = catalog => {
    let relationshipSetDataString = ``
    for (let i = 0; i < catalog.RelationshipSets.length; i++) {
        relationshipSetDataString +=
            `<fluent-option value="` +
            catalog.RelationshipSets[i].RoleURI +
            `">` +
            catalog.RelationshipSets[i].RoleURI +
            `</fluent-option>`
    }
    return relationshipSetDataString
}

export default catalog => {
    const selectorPanel = document.getElementById('selector-panel')
    if (!selectorPanel) {
        return
    }

    const subjectDataString = catalogToSubjectDataString(catalog)
    const relationshipSetDataString = catalogToRelationshipSetDataString(
        catalog
    )
    selectorPanel.innerHTML =
        `<h1>Concept Network Browser</h1>
    <h2>Entity</h2>
    <fluent-combobox class="combo-boxes">` +
        subjectDataString +
        `
    </fluent-combobox>
    <h2>Relationship Set</h2>
    <fluent-combobox class="combo-boxes">` +
        relationshipSetDataString +
        `
    </fluent-combobox>
    </br>
    <button onclick="fetcher()">Browse</button>`
}
