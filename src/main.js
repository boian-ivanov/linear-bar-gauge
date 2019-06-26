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

        // create the y = 0 position on the canvas (currently at 2/3rds of the canvas' overall height)
        this.zero_y_postion = ((this.options.outerHeight - this.options.height) / 1.5);

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

        const height = this.options.height ? this.options.height : 10;

        ctx.strokeStyle = color ? color : '#000';
        ctx.lineWidth = 3;

        // draw line indicate a value
        ctx.beginPath();

        const start_x = Number(this.translateRange(
            value,
            this.inputHigh,
            this.inputLow,
            this.canvas.width,
            0
        ));

        ctx.moveTo(
            start_x, // x1
            this.zero_y_postion // y1
        );

        ctx.lineTo(
            start_x, // x2
            this.zero_y_postion + height//y2
        );

        ctx.stroke();

        this.drawValue(start_x);

        return this;
    }

    /**
     * Draw value box and number
     *
     * @param {Number} start_x The starting x position
     */
    drawValue (start_x) {
        const rect_w = 45;
        const rect_h = 35;
        // get the starting x point of the rectangle
        const rect_x_start = start_x - (rect_w/2);

        let ctx = this.canvas.getContext("2d");

        // add the rectangle with the value
        ctx.lineWidth = 2;

        this.roundRect(
            rect_x_start,
            this.zero_y_postion - rect_h - ctx.lineWidth + 1,
            rect_w, // w
            rect_h,  // h
            8
        );

        // add text
        const font_size = 25; // in pixels
        ctx.fillStyle = "red";
        ctx.font = font_size + "px sans-serif";
        ctx.fillText(
            this.options.value,
            Number(rect_x_start + ((rect_w - font_size) / 4)), // center the text inside the rectangle
            this.zero_y_postion - (rect_h - font_size) + (ctx.lineWidth / 2) // get y = 0 position, move to
        );
    }

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * Method from : https://stackoverflow.com/a/3368118
     *
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundRect (x, y, width, height, radius, fill, stroke) {
        let ctx = this.canvas.getContext("2d");

        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    static isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}