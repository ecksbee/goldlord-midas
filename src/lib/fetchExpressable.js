import id from './id'

export default async (name, contextref) => {
    const uuid = id()
    const query = new URLSearchParams({
        name: name || '',
        contextref: contextref || ''
      }).toString()
    const response = await fetch('folders/' + uuid+ '/facts?' + query)
    if (response.status >= 400) {
        throw new Error('Bad response from server')
    }
    return response.json()
}