let $ = require('jquery');
const CitySelector = require('./CitySelector');
let citySelector;

$('#createCitySelector').on('click', () => {
	citySelector = new CitySelector({
    elementId: 'citySelector',
    regionsUrl: 'http://localhost:3000/regions',
    localitiesUrl: 'http://localhost:3000/localities',
    saveUrl: 'http://localhost:3000/selectedRegions'
	});
})

$('#destroyCitySelector').on('click', () => {
	citySelector.destroy();
	citySelector = null;
});
/* Пример создания компонента:
const citySelector = new CitySelector({
    elementId: 'citySelector',
    regionsUrl: 'http://localhost:3000/regions',
    localitiesUrl: 'http://localhost:3000/localities',
    saveUrl: 'http://localhost:3000/selectedRegions'
});
*/
