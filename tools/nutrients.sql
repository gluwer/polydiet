-- SQL to retrieve all necessary data from https://github.com/alyssaq/usda-sqlite
select fd.`id` as id, fd.`food_group_id` as groupId, fd.`long_desc` desc_en, fd.`manufac_name` as producer,
       nd.`nutrient_id` as nutritionId, nd.`amount` as nutritionVal,
       def.`name` as nutritionDesc_en
from food fd join nutrition nd on fd.id = nd.food_id
  join nutrient def on def.`id` = nd.`nutrient_id`

where nd.`nutrient_id` in ( 
  203, -- Protein
  204, -- FAT	Total lipid (fat)
  205, -- Carbohydrate, by difference
  208, -- kcal
  210, -- Sucrose
  211, -- g	GLUS	Glucose (dextrose)
  212, -- g	FRUS	Fructose
  213, -- g	LACS	Lactose
  214, -- g	MALS	Maltose
  221, -- g	ALC	Alcohol, ethyl
  255, -- g	WATER	Water
  262, -- mg	CAFFN	Caffeine
  263, -- mg	THEBRN	Theobromine
  269, -- g	SUGAR	Sugars, total
  287, -- g	GALS	Galactose
  291, -- g	FIBTG	Fiber, total dietary
  301, -- mg	CA	Calcium, Ca
  303, -- mg	FE	Iron, Fe
  304, -- mg	MG	Magnesium, Mg
  305, -- mg	P	Phosphorus, P
  306, -- mg	K	Potassium, K
  307, -- mg	NA	Sodium, Na
  309, -- mg	ZN	Zinc, Zn
  312, -- mg	CU	Copper, Cu
  313, -- g	FLD	Fluoride, F
  315, -- mg	MN	Manganese, Mn
  317, -- g	SE	Selenium, Se
  318, -- IU	VITA_IU	Vitamin A, IU
  319, -- g	RETOL	Retinol
  320, -- g	VITA_RAE	Vitamin A, RAE
  321, -- g	CARTB	Carotene, beta
  322, -- g	CARTA	Carotene, alpha
  323, -- mg	TOCPHA	Vitamin E (alpha-tocopherol)
  324, -- IU	VITD	Vitamin D
  328, -- g	VITD	Vitamin D (D2 + D3)
  334, -- g	CRYPX	Cryptoxanthin, beta
  337, -- g	LYCPN	Lycopene
  338, -- g	LUT+ZEA	Lutein + zeaxanthin
  401, -- mg	VITC	Vitamin C, total ascorbic acid
  404, -- mg	THIA	Thiamin
  405, -- mg	RIBF	Riboflavin
  406, -- mg	NIA	Niacin
  410, -- mg	PANTAC	Pantothenic acid
  415, -- mg	VITB6A	Vitamin B-6
  417, -- g	FOL	Folate, total
  418, -- g	VITB12	Vitamin B-12
  421, -- mg	CHOLN	Choline, total
  430, -- g	VITK1	Vitamin K (phylloquinone)
  431, -- g	FOLAC	Folic acid
  432, -- g	FOLFD	Folate, food
  435, -- g	FOLDFE	Folate, DFE
  454, -- mg	BETN	Betaine
  601, -- mg	CHOLE	Cholesterol
  605, -- g	FATRN	Fatty acids, total trans
  606, -- g	FASAT	Fatty acids, total saturated
  621, -- g F22D6 22:6 n-3 (DHA)
  629, -- g F20D5 20:5 n-3 (EPA)
  631, -- g F22D5 22:5 n-3 (DPA)
  645, -- g FAMS Fatty acids, total monounsaturated
  646, -- g Fatty acids, total polyunsaturated
  672, -- g 20:2 n-6 c,c
  675, -- g 18:2 n-6 c,c
  685, -- g 18:3 n-6 c,c,c
  851, -- g 18:3 n-3 c,c,c (ALA)
  852, -- g 20:3 n-3
  853, -- g 20:3 n-6
  855 -- g 20:4 n-6
);
