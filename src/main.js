'use strict';
/**
 * Class methods and certain functionality from : https://medium.com/crazyprogrammer/building-html-5-javascript-linear-gauge-fabcc1f480bc
 *
 */
class linearBarGauge {

    /**
     * DOM element object
     */
    element;

    /**
     * Options object given from user
     */
    options = {};

    /**
     * Constructor, gets the selected element and the options given to generate the bar onto the page
     *
     * @param element
     * @param options
     * @return Object barSlider
     */
    constructor (element, options = {}) {
        // start with a 0 to 100 percent
        this.inputLow  = 0;
        this.inputHigh = 100;
        this.element   = element;

        if (!this.constructor.isEmpty(options)) {
            this.options = options;
        } else {
            // default options
            this.options = {
                // canvas width
                width: 300,
                // bar height
                height: 10,
                // canvas height
                outerHeight: 50,
                // range that the graph would start and end
                range: {
                    start: 1,
                    end: 5
                },
                // optional additional segments
                /*segments: [
                    {
                        start: 1,
                        end: 3,
                        colour: '#32CD32'
                    },
                    {
                        start: 3,
                        end: 4,
                        colour: '#FFA500'
                    },
                    {
                        start: 4,
                        end: 5,
                        colour: '#FF6347'
                    }
                ],*/
                segments: [
                    [20, '#32CD32'],
                    [50, '#FFC107'],
                    [80, '#FF6347']
                ],
                // exact value shown in the graph
                value: 3.5
            }
        }

        this.init();

        return this;
    }

    init () {
        // create and append the canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.outerHeight;
        this.canvas.className = 'lineGaugeCanvas';

        this.element.append(this.canvas);

        // create the canvas
        this.drawCanvas();

        if (this.options.value) {
            this.drawPointer(this.options.value);
        }
    }

    /**
     * Creates the range of
     */
    translateRange(Input , inputHigh , inputLow , outputHigh , OutputLow) {
        inputHigh = inputHigh ? inputHigh : this.inputHigh;
        inputLow = inputLow ? inputLow : this.inputLow;

        outputHigh =  outputHigh ? outputHigh : 1;
        OutputLow = OutputLow ? OutputLow : 0;

        return ((Input - inputLow) / (inputHigh - inputLow)) *
            (outputHigh - OutputLow) + OutputLow;
    }

    drawCanvas () {
        let stops = this.options.segments;

        // setup drawing context
        let ctx = this.canvas.getContext("2d");

        // define the gradient
        let gradient = ctx.createLinearGradient(
            0, 0, this.canvas.width, 0
        );

        // draw stops from an array
        // where every item is an array contains
        // the position and the color of the gradient
        for (let i = 0; i < stops.length; i++) {
            gradient.addColorStop(
                this.translateRange(stops[i][0]),
                stops[i][1]
            );
        }

        // defines the fill style on canvas
        ctx.fillStyle = gradient;

        this.zero_y_postion = ((this.options.outerHeight - this.options.height) / 2);

        // draw the a rect filled with created gradient
        ctx.fillRect(0, this.zero_y_postion, this.canvas.width, this.options.height);

        return this;
    }

    /**
    *  Draws the value pointer on the graph
    */
    drawPointer (value,color) {
        // convert input value into a percent value inside our predefined range
        value = Number((value / this.options.range.end) * 100);
        // setup drawing context
        let ctx = this.canvas.getContext("2d");

        //height = height ? height : 10;
        let height = 10;
        ctx.strokeStyle = color ? color : '#000';
        ctx.lineWidth = 2;

        // draw line indicate a value
        ctx.beginPath();

        ctx.moveTo(
            this.translateRange(
                value,
                this.inputHigh,
                this.inputLow,
                this.canvas.width,
                0
            ), // x1
            this.zero_y_postion // y1
        );

        ctx.lineTo(
            this.translateRange(
                value,
                this.inputHigh,
                this.inputLow,
                this.canvas.width,
                0
            ), // x2
            this.zero_y_postion + this.options.height//y2
        );

        ctx.stroke();

        this.drawValue();

        return this;
    }

    drawValue () {

    }

    static isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}