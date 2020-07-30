class Filters {

	static composition = new Seriously();
	static target = this.composition.target('#canvas');
	static effect = null;

	static go() {
		if (this.effect) {
			this.effect.source = 'video';
			this.target.source = this.effect;
		}
		else {
			this.target.source = 'video';
		}
		this.composition.go();
	}

	static setEffect(effect) {
		this.effect = effect !== '' ? this.composition.effect(effect) : null;
		this.go();
	}

}

const dropdown = document.getElementById('dropdown');
dropdown.addEventListener('change', e => Filters.setEffect(e.target.value));
