window.onload = function() {

    // Check to see if ES6 is working
    var logUpperCase = function() {
        this.string = this.string.toUpperCase()
        return () => console.log(this.string)
        // This code example from https://webapplog.com/es6/
    }
    logUpperCase.call({ string: 'es6 rocks' })()

};