window.onload = function() {

    // Check to see if ES6 is working
    // Code example from https://webapplog.com/es6/
    var logUpperCase = function() {
        this.string = this.string.toUpperCase()
        return () => console.log(this.string)
    }
    logUpperCase.call({ string: 'es6 rocks' })()

    var title = document.querySelector('.js-title');
    title.onclick = () => {
        console.log('click');
    }

    var title = document.querySelector('.js-title');
    var tl = new TimelineMax({ repeat: -1 });
    tl.to(title, 1, { x: 100, ease: Power1.easeInOut })
        .to(title, 1, { x: 0, ease: Power1.easeInOut })
        .to(title, 1, { x: -100, ease: Power1.easeInOut })
        .to(title, 1, { x: 0, ease: Power1.easeInOut });
};