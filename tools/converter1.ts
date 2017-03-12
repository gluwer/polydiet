let fs = require('fs');

const src = require('./db28.json');
src.push(null);

class NutritionMapping {
  private mapping = [
    '203', // Białko (g)
    '204', // Tłuszcz (g)
    '606', // Kwasy tłuszczowe nasycone (g)
    '605', // Kwasy tłuszczowe trans (g)

    '205', // Węglowodany (g)
    '269', // Cukry (g)

    '208', // kcal
    '291', // Błonnik pokarmowy (g)
    '601', // Cholesterol (mg)

    // Minerały
    '307', // Sód (mg)
    '301', // Wapń (mg)
    '303', // Żelazo (mg)
    '304', // Magnez (mg)
    '305', // Fosfor (mg)
    '306', // Potas (mg)
    '309', // Cynk (mg)
    '312', // Miedź (mg)
    '313', // Fluor (ug)
    '315', // Mangan (mg)
    '317', // Selen (ug)

    // Witaminy
    '320', // Witamin A, RAE (ug)
    '321', // beta-karoten (ug)
    '323', // Witamina E (mg)
    '328', // Witamina D (ug)
    '401', // Witaminca C (mg)
    '404', // Tiamina, B1 (mg)
    '405', // Ryboflawina, B2 (mg)
    '406', // Niacyna, B3 (mg)
    '410', // Kwas pantotenowy (mg)
    '415', // Witamina B6 (mg)
    '417', // Foliany (ug)
    '418', // Witamina B12 (ug)
    '430', // Witamina K (ug)
    '421', // Cholina (mg)

    // Inne
    '255', // Woda (g)
    '221', // Alkohol etylowy (g)
    '262', // Kofeina (mg)
    '337', // Likopen (ug)
    '338' // Luteina + zeaksantyna (ug)
  ];

  private foodGroups = {
    '0100': 1, // Nabiał i produkty jajeczne*
    '0200': 2, // Przyprawy i zioła*
    //'0300': 3, // Żywność dla dzieci
    '0400': 4, // Tłuszcze i oleje*
    '0500': 5, // Produkty dla drobiu
    '0600': 6, // Zup, sosów i sosów
    '0700': 7, // Kiełbasy i mięsa obiadowe
    '0800': 8, // Płatki śniadaniowe
    '0900': 9, // Owoce i soki owocowe
    '1000': 10, // Produkty wieprzowe
    '1100': 11, // Warzywa i produkty roślinne*
    '1200': 12, // Orzechy i nasiona*
    '1300': 13, // Produkty wołowe
    '1400': 14, // Napoje
    '1500': 15, // Ryby i skorupiaki
    '1600': 16, // Rośliny strączkowe
    '1700': 17, // Jagnięcina, cielęcina i zwierząt dzikich
    '1800': 18, // Produkty wypiekane
    '1900': 19, // Słodycze
    '2000': 20, // Ziarna zbóż i makarony
    //'2100': 21, // Fast food
    '2200': 22, // Przystawki i dania poboczne
    '2500': 23  // Przekąski
  };

  fromCodesToArray(codes: Object): Array<number> {
    let result = [];
    for (const k of this.mapping) {
      if (codes.hasOwnProperty(k)) {
        result.push(codes[k]);
      } else {
        result.push(-1);
      }
    }
    return result;
  }

  convertFoodGroupCode(code: string): number {
    return this.foodGroups[code] || null;
  }
}

let food = {
  id: ''
}, foods = [],
  nm = new NutritionMapping();

for (let i = 0; i <= 23; i++) {
  foods[i] = [];
}

for (let so of src) {
  if (so === null || so.id !== food.id) {
    if (food.id !== '') {
      food.id = parseInt(food.id + 100000, 10).toString(36);
      food.n = nm.fromCodesToArray(food.n);
      if (food.g !== null) {
        foods[food.g].push(food);
      }
    }
    if (so === null) {
      break;
    }
    food = {
      id: so.id,
      g: nm.convertFoodGroupCode(so.groupId),
      p: so.producer,
      t: '',
      te: so.desc_en,
      n: {}
    };
  }
  food.n[so.nutritionId] = so.nutritionVal;
}

for (let i = 1; i <= 23; i++) {
  fs.writeFileSync(i + '.json', JSON.stringify(foods[i], null, 2));
}

