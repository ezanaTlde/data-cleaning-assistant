const Papa = require('papaparse');
const csv = 'name,city\nAlice,\n,London\nCharlie,Paris\n';
const parsed = Papa.parse(csv, { skipEmptyLines: false, transform: (value) => value.trim() });
console.log(JSON.stringify(parsed.data, null, 2));
console.log(JSON.stringify(parsed.errors, null, 2));
