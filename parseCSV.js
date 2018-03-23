const fs = require('fs')
const parse = require('csv-parse')
const async = require('async')

const splitLine = ([date, text, plus, minus, valuta, saldo], type) =>
({ date, text, plus, minus, valuta, saldo, type })

const textParser = {
	'GUTSCHRIFT': (r, type) => {
		const [_v, _a, ..._m] = r.text.split(':')
		const _mitteilung = _m.join(' ')
		const mitteilung = (_mitteilung.trim().length > 0) ? _mitteilung.trim() : null
		const _a_l = _a.split(' ')
		if(_a_l[_a_l.length - 1] === 'MITTEILUNGEN') { _a_l.pop() }
		const auftraggeber = _a_l.join(' ').trim()
		const _v_l = _v.split(' ')
		if(_v_l[_v_l.length - 1] === 'AUFTRAGGEBER') { _v_l.pop() }
		if(_v_l[0] === 'GUTSCHRIFT' && _v_l[1] === 'VON') {
			_v_l.shift()
			_v_l.shift()
		}
		const von = _v_l.join(' ')
		return {...r, mitteilung, auftraggeber, von, type}
	},
	'E-FINANCE': (r, type) => {
		const t = r.text.split(' ')
		const miete = (t[t.length - 1] === 'NEBENKOSTEN')
		return {
			...r, type, miete
		}
	},
	'GIRO': (r, type) => {
		const text = r.text.split(':')
		const lastW = m => ({...m, lastWord: m.split(' ').slice(-1)[0], text: r.text})
		const _mtt = ({text}) => {
			const [_text, mitteilungen] = text.split('MITTEILUNGEN: ')
			return { text: _text, mitteilungen }
		}
		const abs = text.map(lastW)
			.filter(({lastWord}) => lastWord === 'MITTEILUNGEN')
			.map(_mtt)
		const msg = text.map(lastW)
			.filter(({lastWord}) => lastWord === 'ABSENDER')
			.map(({text}) => {
				const [von, rest] = text.split('ABSENDER: ')
				const m = rest.split(':').map(lastW)
				const [ withAbsender ] = m
					.filter(({lastWord}) => lastWord === 'MITTEILUNGEN')
					.map(_mtt)
					.map(m => { const [von, absender] = m.text.split('ABSENDER: '); return {...m, von, absender}})
				return withAbsender
			})
		return {...r, ...abs[0], ...msg[0], text: r.text, type}
	},
	'UEBRIGE:': (r, type) => {
		const [t, kontonr, ...match] = r.text.split(' ')
		return {...r, kontonr, fuer: match.join(' '), type}
	},
	'EINZAHLUNGSSCHEIN': (r, type) => {
		const einzahlungsschein = true
		return {...r, einzahlungsschein, type}
	},
}

const parser = parse({delimiter: ';', from: 6, relax: true, relax_column_count: true }, function (err, data) {
	if(err) {
		console.error(err)
	} else {
		async.eachSeries(data, function (line, next) {
			next()
		})
	}
})

module.exports = function (inputFile, options, cb) {
    let transactions = []
	let stats = {}
	const p = fs.createReadStream(inputFile, options).pipe(parser)
	p.on('data', chunk => {
		if(chunk) {
			let transaction = null
			const line = splitLine(chunk)
			const text = line.text
			const first = text && text.split(' ')[0]
			if (first) {
				// count how many types there are
				stats[first] = Object.keys(stats).includes(first) ? stats[first] + 1 : 1
				// enrich transaction data with extracted text
				transaction = textParser[first](line, first)
				if(transaction) { transactions.push(transaction) }
			}
		}
	})
	p.on('end', () => {
		cb(transactions, stats)
	})
}
