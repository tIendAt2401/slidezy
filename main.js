
function Slidezy(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.log(`Không tìm thấy selector ${selector}`);
        return;
    }
    this.opt = Object.assign({
        item: 3,
        loop: false,
        speed: 300,
    }, options);
    this.slides = Array.from(this.container.children);
    this.currentIndex = this.opt.loop ? this.opt.item : 0;
    this._init();
    this.updatePosition()
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper")
    this._createTrack();
    this._createNavigation();
};
Slidezy.prototype._createTrack = function () {
    this.track = document.createElement('div');
    this.track.className = "slidezy-track";
    if (this.opt.loop) {
        const cloneHead = this.slides.slice(-this.opt.item).map((node) => node.cloneNode(true))
        const cloneTail = this.slides.slice(0, this.opt.item).map(node => node.cloneNode(true));
        this.slides = cloneHead.concat(this.slides.concat(cloneTail));
        console.log(this.slides);

    }
    this.slides.forEach(slide => {
        slide.classList.add("slidezy-slide");
        slide.style.flexBasis = `calc(100% / ${this.opt.item})`;
        this.track.appendChild(slide);
    });
    this.container.appendChild(this.track);
}
Slidezy.prototype._createNavigation = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");
    this.prevBtn.textContent = '<';
    this.nextBtn.textContent = '>';
    this.prevBtn.className = 'sildezy-prev';
    this.nextBtn.className = 'slidezy-next';
    this.container.append(this.prevBtn, this.nextBtn);
    this.prevBtn.onclick = () => {
        this.moveSlide(-1);
    }
    this.nextBtn.onclick = () => {
        this.moveSlide(1);
    }
}
Slidezy.prototype.moveSlide = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;
    this.currentIndex = Math.min(Math.max(this.currentIndex + step, 0), this.slides.length - this.opt.item);
    
    setTimeout(() => {
        if (this.opt.loop) {
            const maxIndex = this.slides.length - this.opt.item;
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.item;
            }
            else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.item;
            }
            this.updatePosition(true)
        }
        this._isAnimating = false;
    }, this.opt.speed);
    this.updatePosition();
}
Slidezy.prototype.updatePosition = function (instant = false) {
    this.track.style.transition = instant ? 'none' : `transform ease ${this.opt.speed}ms`;
    this.offset = -(this.currentIndex * (100 / this.opt.item));
    this.track.style.transform = `translateX(${this.offset}%)`;
}