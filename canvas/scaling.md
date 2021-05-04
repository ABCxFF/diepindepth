# Scaling algorithm

The end goal is to calculate scalingFactor, but before that, we need to understand what FOV and windowScaling are.

## FOV
Stands for field of view. The closer the number to 0, the more zoomed out we are. This value isn't calculated, but rather, sent by the server.

Unlike scalingFactor, this value does not change if our window dimensions change.

## windowScaling

Calculated using the following:
```js
function windowScaling() {
  const a = window.innerHeight / 1080;
  const b = window.innerWidth / 1920;
  return b < a ? a : b;
}
```
The values 1920 and 1080 are in a 16:9 ratio.

To conceptualize this code, let's say that our current window is 1920 x 1080. `a` and `b` would be 1.
```js
const a = 1080 / 1080;
const b = 1920 / 1920;
```
If we were to increase our width to 2000, our window will be wider than 16:9.
```js
const a = 1080 / 1080;
const b = 2000 / 1920;
return 1.0416 < 1 ? 1 : 1.0416; // this will yield 1.0416
```
This will cause `windowScaling()` to depend on the width for scaling, so that changing the width will have noticeable effect in the scaling.

If our window was longer than 16:9, the scaling will depend on the height.

## scalingFactor

The units for this is (canvas pixels / diep units). This value is fundamental for converting between diep units and canvas pixels.

This value is calculated using `scalingFactor = fov * windowScaling()`

Examples of how to convert from one another:
- 10 diep units * scalingFactor gives us canvas pixels
- 10 canvas pixels / scalingFactor gives us diep units

Some remarks: this value only appears when diep draws the grid. It draws the grid by first drawing a portion of the grid onto a separate canvas (with scaling of 1 canvas pixel = 1 diep unit), then using createPattern to draw the entire grid. Before drawing the grid onto the main canvas however, it setTransforms the main canvas so that the horizontal and vertical scaling is equal to the scalingFactor.