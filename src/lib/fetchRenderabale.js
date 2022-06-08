import id from './id'

export default async (hash) => {
    const uuid = id()
    const response = await fetch('folders/' + uuid + '/' + hash)
    if (response.status >= 400) {
        throw new Error('Bad response from server')
    }
    return response.json()
}
