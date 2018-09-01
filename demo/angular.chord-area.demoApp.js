angular.module('hgDemoApp.chordArea', ['hg.chordArea'])
  .controller('DemoCtrl', function() {
    var _this = this,
        _swap = function(srcIndex, dstIndex, object) {
          var tmp = object[srcIndex];
          object[srcIndex] = object[dstIndex];
          object[dstIndex] = tmp;
        };
    this.song = {
      "artist": "True Worshippers",
      "createdAt": "2014-01-23T06:18:40.385Z",
      "key": "G",
      "sections": [
        {
          "title": "Main",
          "body": "G   D     Em\nHO… SAN….. NA\nC              G     D   Em\nIN….. THE….. HIGH…. IGH….EST\nC                            D\nLET   OUR KING   BE LIFT….ED UP \nAm    D    G\nHO…..SAN…..NA",
          "active": false
        },
        {
          "title": "Overtoned Main  (1 Key Higher)",
          "body": "A   E     F#m\nHO… SAN….. NA\nD              A     E   F#m\nIN….. THE….. HIGH…. IGH….EST\nD                            E\nLET   OUR KING   BE LIFT….ED UP \nBm    E    A\nHO…..SAN…..NA",
          "active": false
        },
        {
          "title": "Bridge (continue from Overtoned Main)",
          "body": "D                \nBe lifted higher\nBm      \nHigher\nA            F#m\nBe lifted higher\n\n(x3):\nD   \nJesus you be lifted higher\nBm      \nHigher\nA            F#m\nBe lifted higher",
          "active": true,
          "highlight": true
        }
      ],
      "title": "Be Lifted Higher (Hosanna)",
      "updatedAt": "2014-01-26T05:47:30.630Z",
      "youtube": "http://www.youtube.com/watch?v=lAlS217byt0",
      "id": "52e0b440c8eae42c11b44c87"
    };

    this.moveUp = function(index) {
      _swap(index, index - 1, _this.song.sections);
    };

    this.moveDown = function(index) {
      _swap(index, index + 1, _this.song.sections);
    };

    this.delete = function(index) {
      _this.song.sections.splice(index, 1);
    };


    this.addSection = function() {
      _this.song.sections.push({
        title: "",
        body: ""
      });
    };


  });
