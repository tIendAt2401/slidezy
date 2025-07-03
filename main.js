
function Slidezy(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.log(`Không tìm thấy selector ${selector}`);
        return;
    }
    this.opt = Object.assign({
        item: 3,
        loop: true,
        speed: 300,
        nav: true,
        autoplay: true,
        autoplayTimeOut:2000,
        autoplayHoverPause:true
    }, options);
    this.slides = Array.from(this.container.children);
    this.currentIndex = this.opt.loop ? this.opt.item : 0;
    this._init();
    this.updatePosition()
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper")
    this._createTrack();
    this._createControls();
    if(this.opt.nav){
        this._createNav();
    }
    if(this.opt.autoplay){
        this._startAutoPlay();
        if(this.opt.autoplayHoverPause){
            this.container.onmouseenter= ()=>{
                this._stopAutoPlay();
            }
            this.container.onmouseleave= () => {
                this._startAutoPlay();
            }
        }
    }
};
Slidezy.prototype._startAutoPlay = function () {
    if(this.autoplayTimer) return;
    this.autoplayTimer=setInterval(() => {
        this.moveSlide(1); 
    }, this.opt.autoplayTimeOut);
}
Slidezy.prototype._stopAutoPlay = function () {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer=null;
}
Slidezy.prototype._createContent = function () {
    this.content = document.createElement("div");
    this.content.className = "slidezy-content";
    this.container.appendChild(this.content);
};
Slidezy.prototype._createTrack = function () {
    this.track = document.createElement('div');
    this.track.className = "slidezy-track";
    if (this.opt.loop) {
        const cloneHead = this.slides.slice(-this.opt.item).map((node) => node.cloneNode(true))
        const cloneTail = this.slides.slice(0, this.opt.item).map(node => node.cloneNode(true));
        this.slides = cloneHead.concat(this.slides.concat(cloneTail));
    }
    this.slides.forEach(slide => {
        slide.classList.add("slidezy-slide");
        slide.style.flexBasis = `calc(100% / ${this.opt.item})`;
        this.track.appendChild(slide);
    });

    this.container.appendChild(this.track);
}
Slidezy.prototype._createControls = function () {
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
Slidezy.prototype._createNav= function (){
    
    this.navWrapper = document.createElement("div");
    this.navWrapper.className="slidezy-nav";
    const slideCount=this.slides.length-(this.opt.loop ? 2*this.opt.item: 0);
    const pageCount= Math.ceil(slideCount/this.opt.item);
    for(let i=0; i<pageCount; i++){
        const dot= document.createElement("button");
        dot.className="slidezy-dot";
        if(i==0){
            dot.classList.add("active");
        }
        dot.onclick=()=>{
            this.currentIndex = this.opt.loop ? i*this.opt.item + this.opt.item : i*this.opt.item;
            this.updatePosition();
        }
        this.navWrapper.appendChild(dot);
    }
    this.container.appendChild(this.navWrapper);
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
Slidezy.prototype.updateNav = function () {
    let realIndex=this.currentIndex;
    if(this.opt.loop){
        const slideCount=this.slides.length-this.opt.item*2;
        realIndex=(this.currentIndex-this.opt.item+slideCount)%slideCount;
    }
    const pageIndex=Math.floor(realIndex/this.opt.item);
    const dots=Array.from(this.navWrapper.children);
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index===pageIndex)
    })
}
Slidezy.prototype.updatePosition = function (instant = false) {
    this.track.style.transition = instant ? 'none' : `transform ease ${this.opt.speed}ms`;
    this.offset = -(this.currentIndex * (100 / this.opt.item));
    this.track.style.transform = `translateX(${this.offset}%)`;
    if(this.opt.nav && !instant){
        this.updateNav()
    }
}
