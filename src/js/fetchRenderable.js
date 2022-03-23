import id from './id'

export default (hash) => {
    const uuid = id()
    return fetch('folders/' + uuid + '/' + hash)
        .then(response => {
            if (response.status >= 400) {
                throw new Error('Bad response from server')
            }
            return response.json()
        })
}
