ng-chord-transposer
===================
@author Harman Goei

Angular.js directive that will transform any plain text guitar chord music chart allowing the user to change chords in a single click. Developers also can change the UI of the chord key selection (see the example angular.chordtransposer.html file). This directive was a conversion of jquery.chord.transposer (https://github.com/jessegavin/jQuery-Chord-Transposer) by Jesse Gavin, intended for angular/ionic usage, whatever you'd like.

Usage
---
```html
<transpose-area ng-model="songSection" key="{{songKey}}">
</transpose-area>
```
* ngModel contains the guitar chord music chart.
* key is the value of the new key (must be major and standard key)


Dependencies
===
jQuery 1.11.0 (must be loaded before angular.js is loaded)
Angular.js 1.2.19


Differences from jquery.chord.transposer
===
* The key selection is currently set as a dropdown (intended for mobile usage), and has up/down levels
* Allows extra whitespacing/ tabs / etc (as long the line doesnt contain anything that doesn't make sense.
  * TODO: Might add (, ), [, ] to an exclusion list


