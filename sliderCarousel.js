'use strict';

class SliderCarousel {
	constructor( {
		main, 
		wrap, 
		next, 
		prev,
		infinity = false, 
		position = 0, 
		slidesToShow = 1,
		responsive = []
	}) {
		this.main = document.querySelector(main);
		this.wrap = document.querySelector(wrap);
		this.slides = document.querySelector(wrap).children;
		this.next = document.querySelector(next);
		this.prev = document.querySelector(prev);
		this.slidesToShow = slidesToShow;	
		this.options = {
			position,
			infinity,
			widthSlide: Math.floor(100 / this.slidesToShow),
			maxPosition: this.slides.length - this.slidesToShow
		};
		this.responsive = responsive;
	}
	init() {
		this.addGloClass();
		this.addStyle();
		if (this.prev && this.next) {
			this.controlSlider();
		}
		else {
			this.addArrow();
			this.controlSlider();
		}
		if (this.responsive) {
			this.responseInit();
		}
	}
	addGloClass() {
		this.main.classList.add('gloSlider');
		this.wrap.classList.add('gloSliderWrap');
		for (const item of this.slides) {
			item.classList.add('gloSliderItem');
		}
	}
	addStyle() {
		let style = document.getElementById('sliderCarouselStyle'); 
		if (!style) {
		style = document.createElement('style');
		style.id = 'sliderCarouselStyle';
		}
		style.textContent = ` 
			.gloSlider {
				overflow: hidden !important;
			}
			.gloSliderWrap {
				display: flex !important;
				transition: transform 0.5s !important;
				will-change: transform !important;
			}
			.gloSliderItem {
				display: flex !important;
				align-items: center;
				justify-content: center;
				flex: 0 0 ${this.options.widthSlide}% !important;
				margin: auto 0 !important;
			}
		`;
		document.head.appendChild(style);
	}
	controlSlider() {
		this.prev.addEventListener('click', this.prevSlider.bind(this));
		this.next.addEventListener('click', this.nextSlider.bind(this));
	}
	prevSlider() {
		if (this.options.infinity || this.options.position > 0) {
			--this.options.position;
			if (this.options.position < 0) {
				this.options.position = this.options.maxPosition;
			}
			this.wrap.style.transform = ` 
				translateX(-${
					this.options.position * this.options.widthSlide
				}%)
			`;
		}
	}
	nextSlider() {
		if (this.options.infinity || 
			this.options.position < this.options.maxPosition) {
			++this.options.position;
			if (this.options.position > this.options.maxPosition) {
				this.options.position = 0;
			}
			this.wrap.style.transform = ` 
				translateX(-${
					this.options.position * this.options.widthSlide
				}%)
			`;
		}
	}
	addArrow() {
		this.prev = document.createElement('button');
		this.next = document.createElement('button');
		this.prev.className = 'gloSliderPrev';
		this.next.className = 'gloSliderNext';
		this.main.appendChild(this.prev);
		this.main.appendChild(this.next);
		const style = document.createElement('style');
		style.textContent = ` 
			.gloSliderPrev,
			.gloSliderNext {
				margin: 0 10px;
				border: 20px solid transparent;
				background: transparent;
				cursor: pointer;
			}
			.gloSliderNext {
				border-left-color: #19b5fe;
			}
			.gloSliderPrev {
				border-right-color: #19b5fe;
			}
			.gloSliderPrev:hover,
			.gloSliderNext:hover,
			.gloSliderPrev:focus,
			.gloSliderNext:focus {
				background: transparent;
				outline: transparent;
			} 
		`;
		document.head.appendChild(style);
	}
	responseInit() {
		const slidesToShowDefault = this.slidesToShow;
		const allRespone = this.responsive.map(item => item.breakpoint);
		const maxResponse = Math.max(...allRespone);
		const checkResponse = () => {
			const widthWindow = document.documentElement.clientWidth;
			if (widthWindow < maxResponse) {
				for (let i = 0; i < allRespone.length; i++) {
					if (widthWindow < allRespone[i]) {
						this.slidesToShow = this.responsive[i].slidesToShow;
						this.options.widthSlide = Math.floor(100 / this.slidesToShow);
						this.addStyle();
					}
				}
			}
			else {
				this.slidesToShow = slidesToShowDefault;
				this.options.widthSlide = Math.floor(100 / this.slidesToShow);
				this.addStyle();
			}
		};
		checkResponse();
		window.addEventListener('resize', checkResponse);
	}
}