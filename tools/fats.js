let fs = require('fs');
let parse = require('csv-parse/lib/sync');

let data = parse(fs.readFileSync('fats.csv', 'utf8'), {

});

// [ '1001',
//   '100',
//   'Butter, salted',
//   '',
//   '621',
//   '0.0',
//   '22:6 n-3 (DHA)' ]

// ID: [
// -1, // 645
// -1, // 646
// -1, // 621, 629, 631, 852
// -1  // 672, 675, 685, 853, 855
//]
let result = {

};

for (let d of data) {
  let id = parseInt(d[0] + 100000, 10).toString(36);
  if (!result[id]) {
    result[id] = [-1, -1, -1, -1];
  }
  let r = result[id];
  let v = parseFloat(d[5]);

  switch (d[4]) {
    case '645':
      r[0] = v;
      break;
    case '646':
      r[1] = v;
      break;
    case '621':
    case '629':
    case '631':
    case '852':
      if (r[2] === -1) r[2] = 0;
      r[2] += v;
      break;
    case '672':
    case '675':
    case '685':
    case '853':
    case '855':
      if (r[3] === -1) r[3] = 0;
      r[3] += v;
      break;
  }
}

fs.writeFileSync('fats.json', JSON.stringify(result, null, 2));