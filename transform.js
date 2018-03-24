const transform = (text, keys) => {
	if(!text) { return {} }
    const type = text.split(' ')[0]
    return Object.entries(keys)
        .filter(([key, delimiter]) => text.includes(delimiter))
        .map(([key, delimiter]) => {
            const r = text.split(delimiter)[1]
            if(!Object.values(keys).some(k => r.includes(k)) || type === 'MITTEILUNGEN') {
                return { [key]: r}
            }
            const rest = r.split(':')[0].split(' ')
            rest.pop()
            return { [key]: rest.join(' ') }
        })
        .reduce((a, c) => ({...a, ...c}),{type})
}

module.exports = transform
