
export default _ => {
    const urlParams = new URLSearchParams(window.location.search)
    const idFromQuery = urlParams.get('id')
    return idFromQuery
}
