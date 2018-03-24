const test = require('ava')
const transform = require('./transform.js')

const text = 'GUTSCHRIFT VON FREMDBANK 762 AUFTRAGGEBER: ZYNA ROMERWEG 21 CH-4000 ZUERICH MITTEILUNGEN: DEIN GELD'
const keys = {
auftraggeber: 'AUFTRAGGEBER: ',
absender: 'ABSENDER: ',
postomat: 'POSTOMAT: ',
mitteilungen: 'MITTEILUNGEN: ',
von: 'GUTSCHRIFT VON ',
giro: 'GIRO AUS ',
}

test('assign keyword content to key', t => {
	t.deepEqual(transform(text, keys), {
		auftraggeber: 'ZYNA ROMERWEG 21 CH-4000 ZUERICH',
		mitteilungen: 'DEIN GELD',
		type: 'GUTSCHRIFT',
		von: 'FREMDBANK 762',
	})
})

