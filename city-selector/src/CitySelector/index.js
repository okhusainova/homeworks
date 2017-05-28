let $ = require('jquery');
require('./style.less');
// Your code...
class CitySelector {
	constructor(params) {
		this._elementId = params.elementId;
		this._regionsUrl = params.regionsUrl;
		this._localitiesUrl = params.localitiesUrl;
		this._saveUrl = params.saveUrl;

		this._currentCity = '';
		this._currentRegionId = null;

		this._init();
		this._initInfoBlock();
	}

	destroy() {
		$(`#${this._elementId}`).empty();
		this._clearInfoBlock();
	}

	_init() {
		$(`#${this._elementId}`).html(`
			<button class="selectRegionBtn">Выбрать регион</button>
			<div class="regionsContainer"></div>
			<div class="citiesContainer"></div>
			<button id="saveBtn" style="display:none">Сохранить</div>
		`);
		$('.selectRegionBtn').on('click', this._renderRegionsList('regionsContainer'));
		$('#saveBtn').on('click', this._saveCityData());

	}

	_renderRegionsList(regionsContainerClassName) {
		return () => {
			$.ajax({
				url: this._regionsUrl,
				method: 'get',
			}).done((regions) => {
				let html = '<ul class="regions">';
				regions.forEach((region) => {
					html += `
						<li data-id="${region.id}">
							<span>${region.title}</span>
						</li>
					`;
				});
				html += '</ul>';
				$(`.${regionsContainerClassName}`).html(html);
				$('.regions').on('click', 'li', this._handleRegionClick('citiesContainer'));
			})
		}
	}

	_handleRegionClick(citiesContainerClassName) {
		let localitiesUrl = this._localitiesUrl;
		let citySelector = this;
		return function() {
			let regionId = $(this).data('id');
			citySelector._currentRegionId = regionId;
			$('#regionText').html(regionId);
			$('#localityText').empty();
			$('#saveBtn').prop('disabled', true);
			$.ajax({
				url: `${localitiesUrl}/${regionId}`,
				method: 'get'
			}).done((cities) => {
				let html = '<ul class="cities">';
				cities.list.forEach((city) => {
					html += `
						<li class="city-item" data-city-name="${city}">
							<span class="city-name">${city}</span>
						</li>
					`;
				});
				html += '</ul>';
				$(`.${citiesContainerClassName}`).html(html);
				$('.cities').on('click', '.city-item', function() {
					let cityName = $(this).find('.city-name').text();
						$('#saveBtn').show();
						$('#localityText').html(cityName);
						citySelector._currentCity = cityName;
						$('#saveBtn').prop('disabled', false);
				})
			});
		}
	}

	_initInfoBlock() {
		$('#regionText').empty();
		$('#localityText').empty();
		$('#info').show();
	}

	_clearInfoBlock() {
		$('#info').hide();
	}

	_saveCityData() {
		let citySelector = this;
		return function() {
			$.ajax({
				url: citySelector._saveUrl,
				method: 'post',
				async: false,
				data: {
					region: citySelector._currentRegionId,
					city: citySelector._currentCity 
				},
				success: function() {
					  window.location.href = citySelector._saveUrl;
				}
			});
		}
	}
}



module.exports = CitySelector;
