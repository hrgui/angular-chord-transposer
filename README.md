ng-chord-transposer
===================
@author Harman Goei
@version 0.1.0

Angular.js directive that will transform any plain text guitar chord music chart allowing the user to change chords in a single click. Developers also can change the UI of the chord key selection (see the example angular.chordtransposer.html file). This directive was a conversion from jquery.chord.transposer (https://github.com/jessegavin/jQuery-Chord-Transposer) by Jesse Gavin. As of version 0.1.0, this directive no longer depends on jQuery 1.11.0, just uses angular's jQLite and $compile.

Usage
===
```html
<transpose-area ng-model="songSection" key="{{songKey}}">
</transpose-area>
```
* ngModel contains the guitar chord music chart.
* key is the value of the new key (must be major and standard key)


Dependencies
===
* <s>jQuery 1.11.0 (must be loaded before angular.js is loaded)</s>
* Angular.js 1.2.19


Differences from jquery.chord.transposer
===
* The key selection is currently set as a dropdown (intended for mobile usage), and has up/down levels
* Allows extra whitespacing at end/ tabs / etc (as long the line doesnt contain anything that doesn't make sense.
  * TODO: Might add (, ), [, ] to an exclusion list
* Doesn't use jQuery as of version 0.1.0, uses angular's scope instead to transpose
* Doesn't update whitespacing when a chord adds another character (e.g. # or b)

Changelog
===
0.1.0
---
* Took out the jQuery library dependency that the original jquery.chord.transposer has; reducing DOM manipulation and overall foot print
* All of the guitar chords are in the scope, and transposeSong, transposeChord has been changed signficantly
* Using the scope loses the whitespace updating that jquery.chord.transposer had


0.0.1
---
* First version converted from Jesse Gavin's jquery.chord.transposer (https://github.com/jessegavin/jQuery-Chord-Transposer)
* Allow extra whitespacing at end when checking for chord lines
* Key selection originally in links no longer used, changed it to a dropdown (easier on mobile)
* Still depends on jQuery

