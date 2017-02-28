var fs = require('fs');
var src = require('./db28.json');
src.push(null);
var NutritionMapping = (function () {
    function NutritionMapping() {
        this.mapping = [
            '203',
            '204',
            '606',
            '605',
            '205',
            '269',
            '208',
            '291',
            '601',
            // Minerały
            '307',
            '301',
            '303',
            '304',
            '305',
            '306',
            '309',
            '312',
            '313',
            '315',
            '317',
            // Witaminy
            '320',
            '321',
            '323',
            '328',
            '401',
            '404',
            '405',
            '406',
            '410',
            '415',
            '417',
            '418',
            '430',
            '421',
            // Inne
            '255',
            '221',
            '262',
            '337',
            '338' // Luteina + zeaksantyna (ug)
        ];
        this.foodGroups = {
            '0100': 1,
            '0200': 2,
            '0300': 3,
            '0400': 4,
            '0500': 5,
            '0600': 6,
            '0700': 7,
            '0800': 8,
            '0900': 9,
            '1000': 10,
            '1100': 11,
            '1200': 12,
            '1300': 13,
            '1400': 14,
            '1500': 15,
            '1600': 16,
            '1700': 17,
            '1800': 18,
            '1900': 19,
            '2000': 20,
            '2100': 21,
            '2200': 22,
            '2500': 23 // Przekąski
        };
    }
    NutritionMapping.prototype.fromCodesToArray = function (codes) {
        var result = [];
        for (var _i = 0, _a = this.mapping; _i < _a.length; _i++) {
            var k = _a[_i];
            if (codes.hasOwnProperty(k)) {
                result.push(codes[k]);
            }
            else {
                result.push(-1);
            }
        }
        return result;
    };
    NutritionMapping.prototype.convertFoodGroupCode = function (code) {
        return this.foodGroups[code] || null;
    };
    return NutritionMapping;
}());
var food = {
    id: ''
}, foods = [], nm = new NutritionMapping();
for (var i = 0; i <= 23; i++) {
    foods[i] = [];
}
for (var _i = 0, src_1 = src; _i < src_1.length; _i++) {
    var so = src_1[_i];
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
for (var i = 1; i <= 23; i++) {
    fs.writeFileSync(i + '.json', JSON.stringify(foods[i], null, 2));
}
// "t": "Ziele angielskie, przyprawa",
//   "te": "Spices, allspice, ground",
//
//   "t": "Ziarna anyżu, przyprawa",
//   "te": "Spices, anise seed",
//
//   "t": "Bazylia suszona, przyprawa",
//   "te": "Spices, basil, dried",
//
//   "t": "Liść laurowy, przyprawa",
//   "te": "Spices, bay leaf",
