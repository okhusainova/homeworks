let $ = require('jquery');
require('./style.less');
// Your code...
class CitySelector {
	constructor(params) {
		this.$elementId = $('#' + params.elementId);
		this._regionsUrl = params.regionsUrl;
		this._localitiesUrl = params.localitiesUrl;
		this.saveUrl = params.saveUrl;

		this.currentCity = '';
		this.currentRegionId = null;

		this._init();
		this._initInfoBlock();	

	}

	destroy() {
		this.$elementId.empty();
		this._clearInfoBlock();
	}

	_init() {
		this.$elementId.html(`
			<button class="selectRegionBtn">Выбрать регион</button>
			<div class="regionsContainer"></div>
			<div class="citiesContainer"></div>
			<button id="saveBtn" style="display:none">Сохранить</div>
		`);
		this.$elementId.on('click', '.selectRegionBtn', { className: 'regionsContainer'}, this._renderRegionsList.bind(this));
		this.$elementId.on('click', '#saveBtn', this._saveCityData());
		this.$elementId.on('click', '.regions > li', this._handleRegionClick('citiesContainer'));
	}

	_renderRegionsList(event) {
		 const className = event.data.className;
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
				$(`.${className}`).html(html);
			})
	}

	_handleRegionClick(citiesContainerClassName) {
		let localitiesUrl = this._localitiesUrl;
		let citySelector = this;
		return function() {
			let regionId = $(this).data('id');
			citySelector.currentRegionId = regionId;
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
						citySelector.currentCity = cityName;
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
				url: citySelector.saveUrl,
				method: 'post',
				async: false,
				data: {
					region: citySelector.currentRegionId,
					city: citySelector.currentCity 
				},
				success: function() {
					  window.location.href = citySelector.saveUrl;
				}
			});
		}
	}
}



module.exports = CitySelector;
