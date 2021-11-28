export default () => {
    const topPanel = document.getElementById('top-panel')
    if (!topPanel) {
        return
    }
    topPanel.innerHTML = `<h1>Entity</h1>
    <fluent-combobox>
      <fluent-option value="1">GOOG</fluent-option>
      <fluent-option value="2">fb</fluent-option>
      <fluent-option value="3">Microsoft</fluent-option>
    </fluent-combobox>
    <h1>Relationship Set</h1>
    <fluent-combobox>
      <fluent-option value="1">GOOG</fluent-option>
      <fluent-option value="2">fb</fluent-option>
      <fluent-option value="3">Microsoft</fluent-option>
    </fluent-combobox>`
}
