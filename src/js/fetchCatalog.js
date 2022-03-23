import id from './id'

export default _ => {
    const uuid = id()
    return fetch('folders/' + uuid)
        .then(response => {
            if (response.status >= 400) {
                throw new Error('Bad response from server')
            }
            return response.json()
        })
}
