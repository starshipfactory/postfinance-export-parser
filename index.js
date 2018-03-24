const csvImporter = require('./parseCSV');

const file = './test.csv'

csvImporter(
	file,
	{ encoding: 'latin1'},
	(transactions, stats) => {
			// console.log(transactions)
			const j = JSON.stringify(transactions)
			console.log(j)
			returnValue = { transactions, stats }
	}
)
