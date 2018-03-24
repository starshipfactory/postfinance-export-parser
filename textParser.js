const defaultReturn = (r, type) => ({...r, type})

const textParser = {
    'GUTSCHRIFT': defaultReturn,
    'E-FINANCE': (r, type) => {
        const t = r.text.split(' ')
        const miete = (t[t.length - 1] === 'NEBENKOSTEN')
        return {
            ...r, type, miete
        }
    },
	'GIRO': defaultReturn,
    'UEBRIGE:': (r, type) => {
        const [t, kontonr, ...match] = r.text.split(' ')
        return {...r, kontonr, fuer: match.join(' '), type}
    },
    'EINZAHLUNGSSCHEIN': (r, type) => {
        return {...r, einzahlungsschein: true, type}
    },
    'AUFTRAG': defaultReturn,
    'BARGELDBEZUG': defaultReturn,
    'EINZAHLUNG': defaultReturn,
    'KARTE': defaultReturn,
    'KAUF/DIENSTLEISTUNG': defaultReturn,
    'KAUF/ONLINE-SHOPPING': defaultReturn,
    'ÜBERTRAG': defaultReturn,
    'ZINSABSCHLUSS': defaultReturn,
}

module.exports = textParser
