/**
 * angular.js chord transposer (ng-chord-transposer)
 * @author  Harman Goei
 */

var transposerModule = angular.module('chordTransposer', []);

transposerModule.directive('transposeArea', function($compile) {
  var el, currentKey,
    opts = {
      chordRegex: /^[A-G][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*(\/[A-G][b\#]*)*$/,
      chordReplaceRegex: /([A-G][b\#]?(2|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*)/g
    },
    keys = [{
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
    }];

  // input: a line
  // output: a wrapper
  var wrapChords = function(input, scope) {
    return input.replace(opts.chordReplaceRegex, function(match, p1) {
      scope.chords.push(p1);
      return '<span class="c">{{chords['+ (scope.chords.length - 1) +']}}</span>';
    });
  };

  // input: a line
  // output: determine if it's a chord line
  var isChordLine = function(input) {
    var tokens = input.replace(/\s+/, " ").split(" ");
    // replace whitespacing with single whitespacing, then split by single whitespacing

    for (var i = 0; i < tokens.length; i++) {
      //!tokens[i].trim().length == 0 doesnt make sense yet
      if (tokens[i] === "") {
        continue;
      }
      if (!tokens[i].match(opts.chordRegex)) {
        return false;
      }
    }

    return true;
  };

  function render(element, value, scope) {
    if (!value) return;

    var lines = value.split("\n");

    lines = lines.map(function(line) {
      if (isChordLine(line)) {
        return '<span>' + wrapChords(line, scope) + '</span>';
      } else {
        return '<span>' + line + '</span>';
      }
    });

    var chordArea = element[0].querySelector("pre");

    chordArea.innerHTML = lines.join("\n");
    $compile(angular.element(chordArea))(scope);

  };

  var getChordType = function(key) {
    switch (key.charAt(key.length - 1)) {
      case "b":
        return "F";
      case "#":
        return "S";
      default:
        return "N";
    }
  };

  var getDelta = function(oldIndex, newIndex) {
    if (oldIndex > newIndex)
      return 0 - (oldIndex - newIndex);
    else if (oldIndex < newIndex)
      return 0 + (newIndex - oldIndex);
    else
      return 0;
  };

  var getKeyByName = function(name) {
    if (name.charAt(name.length - 1) == "m") {
      name = name.substring(0, name.length - 1);
    }
    for (var i = 0; i < keys.length; i++) {
      if (name == keys[i].name) {
        return keys[i];
      }
    }
  };

  var getKeyByValue = function(name) {
    for (var i = 0; i < keys.length; i++) {
      if (name == keys[i].value) {
        return keys[i];
      }
    }
  };

  var transposeSongScope = function(element, key, scope) {
     var newKey = getKeyByName(key);
     var delta = getDelta(currentKey.value, newKey.value);

     for(var i = 0; i < scope.chords.length; i++) {
        scope.chords[i] = transposeChord(scope.chords[i], delta, newKey);
     }

     currentKey = newKey;
  };

  var transposeChord = function(oldChord, delta, targetKey) {
    var oldChordRoot = getChordRoot(oldChord), newChordRoot = getNewKey(oldChordRoot, delta, targetKey);
    return newChordRoot.name + oldChord.substr(oldChordRoot.length);
  }

  var getNewWhiteSpaceLength = function(a, b, c) {
    if (a > b)
      return (c + (a - b));
    else if (a < b)
      return (c - (b - a));
    else
      return c;
  };

  var makeString = function(s, repeat) {
    var o = [];
    for (var i = 0; i < repeat; i++) o.push(s);
    return o.join("");
  };

  var getChordRoot = function(input) {
    if (input.length > 1 && (input.charAt(1) == "b" || input.charAt(1) == "#"))
      return input.substr(0, 2);
    else
      return input.substr(0, 1);
  };

  var getNewKey = function(oldKey, delta, targetKey) {
    var keyValue = getKeyByName(oldKey).value + delta;

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
  };


  return {
    restrict: 'E',
    require: 'ngModel',
    replace: false,
    templateUrl: 'angular.chordtransposer.html',
    scope: {
      ngModel: '=ngModel',
      key: '@'
    },
    link: function compile(scope, element, attrs, controller, ngModel) {
      scope.chords = [];
      scope.$watch('ngModel', function(value) {
        currentKey = getKeyByName(scope.key);
        render(element, value, scope);
      });

      scope.$watch(function() {
        return scope.key;
      }, function(newKeyName, oldKeyName) {
        if(!newKeyName) return;
        if(oldKeyName) {
          currentKey = getKeyByName(oldKeyName);
        }
        transposeSongScope(element, newKeyName, scope);
      });
    },
    controller: function($scope) {
      $scope.keys = keys;

      function changeKeyByValue(keyValue) {
        var newKey = getKeyByValue(keyValue);
        $scope.key = newKey.name;
        // triggers the watch
      }

      $scope.keyUp = function() {
        var newKeyValue = currentKey.value + 1;
        if (newKeyValue > 11) {
          newKeyValue = 0;
        }
        changeKeyByValue(newKeyValue);
      };

      $scope.keyDown = function() {
        var newKeyValue = currentKey.value - 1;
        if (newKeyValue < 0) {
          newKeyValue = 11;
        }
        changeKeyByValue(newKeyValue);
      };
    }
  };
});