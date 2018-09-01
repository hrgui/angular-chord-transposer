describe("Directive: chordArea", function() {
  var $scope,
      $compile;

  beforeEach(function() {
    module('hg.chordArea');
    inject(function($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    });
  });

  function compileHelper(data, key) {
    var el;
    $scope.data = data;
    $scope.key = key;
    el = $compile("<chord-area ng-model=\"data\" key=\"{{key}}\"></chord-area>")($scope);
    $scope.$digest();
    return el;
  }

  it("should compile correctly if given a set of chords and lyrics" , function() {
    var el;
    el = compileHelper("G   D     Em\nHO… SAN….. NA\nC              G     D   Em\nIN….. THE….. HIGH…. IGH….EST", 'G');
    expect(el.html()).toContain('chord-area__chord');
  });

  it("should respond to key changes (test changes key from G to A)" , function() {
    var el, chords, expectedChords = ['A', 'E', 'F#m', 'D', 'A', 'E', 'F#m'];
    el = compileHelper("G   D     Em\r\nHO… SAN….. NA\r\nC              G     D   Em\r\nIN….. THE….. HIGH…. IGH….EST", 'G');
    $scope.key = "A";
    $scope.$digest();
    chords = el[0].querySelectorAll(".chord-area__chord");

    for(var i = 0; i < chords.length; i++ ) {
      expect(chords[i].innerHTML).toBe(expectedChords[i]);
    }
  });
});
