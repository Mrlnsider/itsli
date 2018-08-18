const Slide = function ( imageURL, container ) {
    this.imageURL = imageURL
    let elem = container.appendChild (document.createElement ( 'div' ))
    elem.className = "slide"
    elem.style = `
        position: absolute;
        top: 0px;
        bottom: 0px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
        transition: all 0.8s;
        background-image: url(${imageURL});
    `
    this.init = function ( x ) {
      elem.style.left = x + '%'
      elem.style.width = window.innerWidth * 0.8 + 'px'
    }
    this.setPicture = pictureURL => {
            elem.style.backgroundImage = `url(${pictureURL})`
    }
    this.mcFromTo = function ( from, to, finalOpacity ) {
        var slideWidth = window.innerWidth * 0.8
        elem.style.transition = 'none'
        elem.style.left = from + '%'
        elem.style.opacity = 1 - finalOpacity
        elem.style.width = slideWidth + 'px'
        setTimeout ( function () {
          elem.style.transition = 'all 0.8s'
          elem.style.left = to + '%'
          elem.style.opacity = finalOpacity
        }, 50 )
    }
}
const Slider = function ( sourseData ) {
    this.pictures = []
    var slid = document.getElementById ("slider")
    this.container = this.createElem ( 'figure', slid )
    this.container.style = `
        position: relative;
        top: 0px;
        left: 0px;
        right: 0px;
        height: 550px;
        overflow: hidden;
        margin: 0px;
    `
    this.loadData ( sourseData )
    let currentIndex = 0
    let currentSlide = 0
    this.getNextIndex = dir => dir === 'left' ?
            ( currentIndex === 0 ?
                this.pictures.length - 1 : currentIndex - 1 ) :
            ( currentIndex === this.pictures.length - 1 ?
                0 : currentIndex + 1 )
    this.changePicture = direction => {
      let to = direction === 'left' ? 100 : -100
      let nextSlide = currentSlide === 0 ? 1 : 0
      var nextIndex = this.getNextIndex ( direction )
      this.slides [ nextSlide ].setPicture ( this.pictures [ nextIndex ] )
      this.slides [ nextSlide ].init ( -to )
      this.slides [ currentSlide ].mcFromTo ( 10, to, 0 )
      this.slides [ nextSlide ].mcFromTo ( -to, 10, 1 )
      setTimeout ( function () {
          currentSlide = nextSlide
          currentIndex = nextIndex
      }, 1000 )
    }
    this.btnLeft = this.createElem ( 'button', this.container )
    this.btnLeft.onclick = () => this.changePicture ( "left" )
    this.btnRight = this.createElem ( 'button', this.container )
    this.btnRight.onclick = () => this.changePicture ( "right" )
    this.btnLeft.innerHTML = '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>'
    this.btnRight.innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>'
    this.btnLeft.style = `
        left: 15%;
    `
    this.btnRight.style = `
        right: 15%;
    `
}
Slider.prototype.createElem = function ( tagName, container ) {
        return  ( !container ? document.body : container )
                .appendChild (
                  document.createElement ( tagName )
                )}
Slider.prototype.loadData = async function ( jsonURL ) {
      let promise = fetch ( jsonURL )
                        .then ( response => response.json()
                    )
        this.pictures = await promise
        this.slides = []
        this.slides [ 0 ] = new Slide (
                        this.pictures [ 0 ],
                        this.container
        )
        this.slides [ 0 ].mcFromTo ( 100, 10 )
        this.slides [ 1 ] = new Slide (
                        this.pictures [ 1 ],
                        this.container
        )
        this.slides [ 1 ].init ( 100 )

}
var slider = new Slider ( 'pictures.json' )