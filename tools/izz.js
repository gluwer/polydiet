const fs = require('fs');
const parse = require('csv-parse/lib/sync');

let data = parse(fs.readFileSync('izz.csv', 'utf8'));
data.splice(0, 3);

function convert(value, multiply = 1.0) {
  if (value === "") return -1;
  return parseFloat(value.replace(",", ".")) * multiply;
}

const foods = data.map((f) => {
  return {
    id: "izz" + f[0],
    "t": f[2] + " (IZZ)",
    "n": [
    convert(f[7]), // Białko (g)
    convert(f[10]), // Tłuszcz (g)
    convert(f[45]), // Kwasy tłuszczowe nasycone (g)
    -1, // Kwasy tłuszczowe trans (g)
    convert(f[11]), // Węglowodany (g)
    convert(f[82]) + convert(f[83]), // Cukry (g)
    convert(f[5]), // kcal
    convert(f[85]), // Błonnik pokarmowy (g)
    convert(f[63]), // Cholesterol (mg)
    convert(f[13]), // Sód (mg)
    convert(f[15]), // Wapń (mg)
    convert(f[18]), // Żelazo (mg)
    convert(f[17]), // Magnez (mg)
    convert(f[16]), // Fosfor (mg)
    convert(f[14]), // Potas (mg)
    convert(f[19]), // Cynk (mg)
    convert(f[20]), // Miedź (mg)
    -1, // Fluor (ug)
    convert(f[21]), // Mangan (mg)
    -1, // Selen (ug)
    convert(f[22]), // Witamin A, RAE (ug)
    convert(f[24]), // beta-karoten (ug)
    convert(f[26]), // Witamina E (mg)
    convert(f[25]), // Witamina D (ug)
    convert(f[33]), // Witaminca C (mg)
    convert(f[27]), // Tiamina, B1 (mg)
    convert(f[28]), // Ryboflawina, B2 (mg)
    convert(f[29]), // Niacyna, B3 (mg)
    -1, // Kwas pantotenowy (mg)
    convert(f[30]), // Witamina B6 (mg)
    convert(f[31]), // Foliany (ug)
    convert(f[32]), // Witamina B12 (ug)
    -1, // Witamina K (ug)
    -1, // Cholina (mg)
    convert(f[6]), // Woda (g)
    -1, // Alkohol etylowy (g)
    -1, // Kofeina (mg)
    -1, // Likopen (ug)
    -1, // Luteina + zeaksantyna (ug)
    convert(f[53]), // Tłuszcz nienas. (g)
    convert(f[62]), // Tłuszcz wielonie. (g)
    convert(f[61]) + convert(f[59]) + convert(f[60]) +convert(f[55]) + convert(f[57]), // Tłuszcz n-3 (g) 22:6, 20:5, 22:5, 18:3, 20:3
    convert(f[54]) + convert(f[58])  // Tłuszcz n-6 (g) 20:2, 18:2, 20:4
    ]
  }
});

fs.writeFileSync('izz.json', JSON.stringify(foods, null, 2));