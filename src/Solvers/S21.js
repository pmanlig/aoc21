// import React from 'react';
import Solver from './Solver';

export class S21a extends Solver {
	allWithAllergen(a, foods) {
		return foods.filter(f => f.allergens.includes(a));
	}

	allWithIngredient(i, foods) {
		return foods.filter(f => f.ingredients.includes(i));
	}

	possibleAllergens(ingredient, foods, allergens) {
		return allergens.filter(a => {
			let pf = this.allWithAllergen(a, foods);
			return pf.filter(f => f.ingredients.includes(ingredient)).length === pf.length;
		});
	}

	solve(input) {
		// input = "mxmxvkd kfcds sqjhc nhms (contains dairy, fish)\ntrh fvjkl sbzzf mxmxvkd (contains dairy)\nsqjhc fvjkl (contains soy)\nsqjhc mxmxvkd sbzzf (contains fish)";
		let foods = input.split('\n').map(f => {
			let a = f.match(/^(.*) \(contains (.*)\)$/);
			if (a) {
				f = a[1];
				a = a[2].split(", ");
			}
			else { a = []; }
			return { ingredients: f.split(' '), allergens: a }
		});
		let allergens = [...new Set(foods.flatMap(f => f.allergens))];
		let ingredients = {};
		let add = i => {
			if (ingredients[i] === undefined) { ingredients[i] = { name: i, count: 0 } }
			ingredients[i].count++;
		}
		foods.forEach(f => f.ingredients.forEach(add));
		Object.keys(ingredients).forEach(k => { ingredients[k].possibleAllergens = this.possibleAllergens(k, foods, allergens); });
		let sum = Object.keys(ingredients).map(k => ingredients[k].possibleAllergens.length === 0 ? ingredients[k].count : 0).reduce((a, b) => a + b, 0);
		let dangers = Object.keys(ingredients).map(k => ingredients[k]).filter(i => i.possibleAllergens.length > 0);
		let identified = [];
		while (dangers.length > 0) {
			let id = dangers.filter(i => i.possibleAllergens.length === 1);
			identified = identified.concat(id);
			dangers = dangers.filter(i => !id.includes(i));
			id = id.flatMap(i => i.possibleAllergens);
			dangers.forEach(i => { i.possibleAllergens = i.possibleAllergens.filter(a => !id.includes(a)) });
		}
		identified.sort((a, b) => a.possibleAllergens[0] < b.possibleAllergens[0] ? -1 : (a.possibleAllergens[0] > b.possibleAllergens[0] ? 1 : 0));
		let canon = identified.map(i => i.name).join(',');
		this.setState({ solution: `Foods: ${foods.length}\nAllergens: ${allergens.length}\nIngredients: ${Object.keys(ingredients).length}\nSum: ${sum}\nCanonical: ${canon}` });
	}
}

export class S21b extends Solver {
}