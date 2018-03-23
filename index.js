const csvImporter = require('./parseCSV');

const file = './test.csv'

csvImporter(file, { encoding: 'latin1'}, (transactions, stats) => console.log(transactions.length, stats))
