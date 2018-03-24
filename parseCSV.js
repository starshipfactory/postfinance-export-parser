const fs = require('fs')
const parse = require('csv-parse')
const async = require('async')
const textParser = require('./textParser')
const transform = require('./transform')

const keywords = {
		absender: 'ABSENDER: ',
		auftraggeber: 'AUFTRAGGEBER: ',
		mitteilungen: 'MITTEILUNGEN: ',
		referenznr: 'REFERENZ-NR: ',
		postomat: 'POSTOMAT: ',
		uebrige: 'UEBRIGE: ',
		zahlungsempfaenger: 'ZAHLUNGSEMPFÄNGER: ',
		idnr: 'ID-NR. DES ZAHLUNGSEMPFÄNGERS: ',
		von: 'GUTSCHRIFT VON ',
}

const splitLine = ([date, text, plus, minus, valuta, saldo], type) =>
({ date, plus, minus, valuta, saldo, type, text, ...transform(text, keywords) })

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
