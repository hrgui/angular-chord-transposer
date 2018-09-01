/// <reference path="../typings/tsd.d.ts" />

interface MusicKey {
  name: string;
  value: number;
  type: string;
}

interface ChordAreaScope extends ng.IScope {
  chords: Array<string>;
  key: string;
  ctrl: Object;
}

/**
 * @ngdoc module
 * @name hg.chordArea
 * @description
 * Set of directives / constants / services related to music
 */
angular.module('hg.chordArea', ['hg.chordArea.tpls'])
  .constant('MusicKeys', [{
    name: 'Ab',
    value: 0,
    type: 'F'
  }, {
    name: 'A',
    value: 1,
    type: 'N'
  }, {
    name: 'A#',
    value: 2,
    type: 'S'
  }, {
    name: 'Bb',
    value: 2,
    type: 'F'
  }, {
    name: 'B',
    value: 3,
    type: 'N'
  }, {
    name: 'C',
    value: 4,
    type: 'N'
  }, {
    name: 'C#',
    value: 5,
    type: 'S'
  }, {
    name: 'Db',
    value: 5,
    type: 'F'
  }, {
    name: 'D',
    value: 6,
    type: 'N'
  }, {
    name: 'D#',
    value: 7,
    type: 'S'
  }, {
    name: 'Eb',
    value: 7,
    type: 'F'
  }, {
    name: 'E',
    value: 8,
    type: 'N'
  }, {
    name: 'F',
    value: 9,
    type: 'N'
  }, {
    name: 'F#',
    value: 10,
    type: 'S'
  }, {
    name: 'Gb',
    value: 10,
    type: 'F'
  }, {
    name: 'G',
    value: 11,
    type: 'N'
  }, {
    name: 'G#',
    value: 0,
    type: 'S'
  }]);

/**
 * @ngdoc directive
 * @module hg.chordArea
 * @name chordArea
 * @description
 * This directive takes in a string and interpolates it to a music chart that responds to transposition.
 * @param key {String} What key to interpolate this as. If key changes, the contents of the model will respond to the key change.
 * @param ngModel {String} The chord chart contents (e.g. lyrics and chords)
 */
angular.module('hg.chordArea').directive('chordArea', ['$compile', 'MusicKeys', function ($compile, keys) {
    var _regexes = {
        chordRegex: /^\(?[A-G][b#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7#5|7#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|M7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*(\/[A-G][b#]*)*\)?$/,
        chordReplaceRegex: /([A-G][b#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7#5|7#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|M7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*)/g
      },
      _wrapChords = (input:string, scope: ChordAreaScope) => {
        return input.replace(_regexes.chordReplaceRegex, function (match, p1) {
          scope.chords.push(p1);
          return '<span class="chord-area__chord">{{chords[' + (scope.chords.length - 1) + ']}}</span>';
        });
      },
      _isChordLine = (input:string) => {
        var tokens = input.replace(/\s+/, " ").split(" ");
        // replace whitespacing with single whitespacing, then split by single whitespacing

        for (var i = 0; i < tokens.length; i++) {
          //!tokens[i].trim().length == 0 doesnt make sense yet
          if (tokens[i] === "") {
            continue;
          }
          if (!tokens[i].match(_regexes.chordRegex)) {
            return false;
          }
        }

        return true;
      },
      _render = (element, value:string, scope) => {
        var lines,
          chordArea = element[0].querySelector("pre");

        if (!value) {
          return;
        }

        lines = value.split("\n").map(function (line) {
          if (_isChordLine(line)) {
            return '<span>' + _wrapChords(line, scope) + '</span>';
          } else {
            return '<span>' + line + '</span>';
          }
        });
        chordArea.innerHTML = lines.join("\n");
        $compile(angular.element(chordArea))(scope);
      },
      _getDelta = (oldIndex : number, newIndex : number) => {
        if (oldIndex > newIndex)
          return 0 - (oldIndex - newIndex);
        else if (oldIndex < newIndex)
          return newIndex - oldIndex;
        else
          return 0;
      },
      _getKeyByName = (name: string) => {
        var i;
        if (name.charAt(name.length - 1) == "m") {
          name = name.substring(0, name.length - 1);
        }
        for (i = 0; i < keys.length; i++) {
          if (name == keys[i].name) {
            return keys[i];
          }
        }
      },
      _getKeyByValue = (name : string) => {
        var i;
        for (i = 0; i < keys.length; i++) {
          if (name == keys[i].value) {
            return keys[i];
          }
        }
      },
      _getNewKey = (oldKey, delta, targetKey) => {
        var keyValue = _getKeyByName(oldKey).value + delta;

        if (keyValue > 11) {
          keyValue -= 12;
        } else if (keyValue < 0) {
          keyValue += 12;
        }

        var i = 0;
        if (keyValue == 0 || keyValue == 2 || keyValue == 5 || keyValue == 7 || keyValue == 10) {
          // Return the Flat or Sharp Key
          switch (targetKey.name) {
            case "A":
            case "A#":
            case "B":
            case "C":
            case "C#":
            case "D":
            case "D#":
            case "E":
            case "F#":
            case "G":
            case "G#":
              for (; i < keys.length; i++) {
                if (keys[i].value == keyValue && keys[i].type == "S") {
                  return keys[i];
                }
              }
            default:
              for (; i < keys.length; i++) {
                if (keys[i].value == keyValue && keys[i].type == "F") {
                  return keys[i];
                }
              }
          }
        } else {
          // Return the Natural Key
          for (; i < keys.length; i++) {
            if (keys[i].value == keyValue) {
              return keys[i];
            }
          }
        }
      },
      _getChordRoot = function (input) {
        if (input.length > 1 && (input.charAt(1) == "b" || input.charAt(1) == "#"))
          return input.substr(0, 2);
        else
          return input.substr(0, 1);
      },
      _transposeChord = function (oldChord, delta, targetKey) {
        var oldChordRoot = _getChordRoot(oldChord),
          newChordRoot = _getNewKey(oldChordRoot, delta, targetKey);
        return newChordRoot.name + oldChord.substr(oldChordRoot.length);
      };


    return {
      restrict: 'E',
      scope: {
        key: '@',
        ngModel: '='
      },
      controller: ['$scope', '$element', function ($scope : ChordAreaScope, $element)  {
        var _transposeSongScope = (element, key, scope) => {
            var newKey = _getKeyByName(key);
            var delta = _getDelta(this.currentKey.value, newKey.value);

            for (var i = 0; i < scope.chords.length; i++) {
              scope.chords[i] = _transposeChord(scope.chords[i], delta, newKey);
            }
            this.currentKey = newKey;
          },
          _changeKeyByValue = (keyValue) => {
            var newKey = _getKeyByValue(keyValue);
            $scope.key = newKey.name;
          };

        this.keyUp = () => {
          var newKeyValue = this.currentKey.value + 1;
          if (newKeyValue > 11) {
            newKeyValue = 0;
          }
          _changeKeyByValue(newKeyValue);
        };

        this.keyDown = () => {
          var newKeyValue = this.currentKey.value - 1;
          if (newKeyValue < 0) {
            newKeyValue = 11;
          }
          _changeKeyByValue(newKeyValue);
        };

        this.keys = keys;
        // start point
        $scope.ctrl = this;
        $scope.chords = [];
        $scope.$watch('ngModel', (value) => {
          if(!value) {
            return;
          }
          this.currentKey = _getKeyByName($scope.key);
          _render($element, value, $scope);
        });

        $scope.$watch(() => {
          return $scope.key;
        }, (newKeyName, oldKeyName) => {
          if (!newKeyName) return;
          if (oldKeyName) {
            this.currentKey = _getKeyByName(oldKeyName);
          }
          _transposeSongScope($element, newKeyName, $scope);
        });
      }],
      templateUrl: 'angular.chord-area.html'
    };
  }]);
