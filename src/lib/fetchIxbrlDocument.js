import id from './id'

export default async (name) => {
    const uuid = id()
    const response = await fetch('folders/' + uuid + '/' + name)
    if (response.status >= 400) {
        throw new Error('Bad response from server')
    }
    return response.text()
}
