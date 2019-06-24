# Linear bar gauge library

## Overview

The library was created in order to generate a visualising bar gauge.

## How it works

To initialise a bar gauge you need to first load the library in the page. 
After that you can simply create a `new linearBarGauge(element, options)` passing the selected element as first parameter and an object with all the options as a second parameter.

Example : 

```JavaScript
new linearBarGauge(el, {
    width: 400,
    height: 10,
    outerHeight: 50,
    range: {
        start: 0,
        end: 10
    },
    segments: [
        [20, '#32CD32'],
        [50, '#FFC107'],
        [80, '#FF6347']
    ],
    value: 2.3
});
```
