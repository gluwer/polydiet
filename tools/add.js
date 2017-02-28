const fs = require('fs');
const fats = require('./fats.json');

// for (let i = 1; i <= 23; i++) {
//   let foods = require('./' + i + '.json');

//   foods.forEach((f) => {
//     let fa = fats[f.id];

//     if (fa) {
//       f.n.push(...fa);
//     }
//   });

//   fs.writeFileSync(i + '.json', JSON.stringify(foods, null, 2));
// }
let foods = require('./3a.json');

foods.forEach((f) => {
  let fa = fats[f.id];

  if (fa) {
    f.n.push(...fa);
  }
});

fs.writeFileSync('3a.json', JSON.stringify(foods, null, 2));
