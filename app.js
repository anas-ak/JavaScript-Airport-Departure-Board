var DBoard = function (element, options) {
            
    options = options || {};

    this._element = element;
    this._letters = [];

    element.className += ' departure-board';

    var rowCount = options.rowCount || 1,
       letterCount = options.letterCount || 25, 
       letter, 
       rowElement;

    for (var r = 0; r < rowCount; r++) {
        this._letters.push ([]);

        rowElement = document.createElement ('div');
        rowElement.className = 'row';
        element.appendChild (rowElement);

        for (var l = 0; l < letterCount; l++) {
            letter = new DBoard.Letter ();
            this._letters[r].push (letter);
            rowElement.appendChild (letter.getElement ());
        }
    }
};

DBoard.LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,':()&!?+-";

DBoard.prototype.spin = function () {




    var me = this;

    for (var i = 0, l = this._letters.length; i < l; i++) {
        (function (i) {
            window.setTimeout (function () {
                me._letters[i].spin ();
            }, 20 * i + Math.random () * 400); 
        })(i);
    }
};

DBoard.prototype.setValue = function (value) {
    if (!(value instanceof Array)) value = [value];
    var me = this;

    for (var r = 0, rl = this._letters.length; r < rl; r++) {
        value[r] = value[r]? value[r].toUpperCase () : '';

        for (var i = 0, l = this._letters[r].length; i < l; i++) {
            (function (r, i) {
                window.setTimeout (function () {
                    var letterValue = value[r].substr (i, 1) || '';
                    me._letters[r][i].setValue (letterValue);
                }, 2000 * r + 25 * i + Math.random () * 400);
            })(r, i);
        }
    }
};

DBoard.Letter = function() {
    this._element = document.createElement ('span');
    this._element.className = 'letter';

    this._bottom = document.createElement ('span');
    this._bottom.className = 'flap bottom';
    this._element.appendChild (this._bottom);

    this._bottomText = document.createElement ('span');
    this._bottomText.className = 'text';
    this._bottom.appendChild (this._bottomText);

    this._top = document.createElement ('span');
    this._top.className = 'flap top';
    this._element.appendChild (this._top);

    this._topText = document.createElement ('span');
    this._topText.className = 'text';
    this._top.appendChild (this._topText);

    this._fold = document.createElement ('span');
    this._fold.className = 'fold';
    this._element.appendChild (this._fold);

    this._falling = document.createElement ('span');
    this._falling.className = 'flap falling';
    this._fold.appendChild (this._falling);

    this._fallingText = document.createElement ('span');
    this._fallingText.className = 'text';
    
    this._fallingText.style.WebkitTransitionDuration = this._fallingText.style.MozTransitionDuration =this._fallingText.style.OTransitionDuration = this._fallingText.style.transitionDuration = DBoard.Letter.DROP_TIME * 0.5 + 'ms';

    this._falling.appendChild (this._fallingText);

    this._index = 0;
    this._interval = null;
    this._stopAt = null;
};

DBoard.Letter.DROP_TIME = 100;

DBoard.Letter.prototype.getElement = function () {
    return this._element;
};

DBoard.Letter.prototype.spin = function (clear) {
    if (clear !== false) this._stopAt = null;

    var me = this;
    this._interval = window.setInterval (function () { me._tick (); }, DBoard.Letter.DROP_TIME * 1.1);
};

DBoard.Letter.prototype.setValue = function (value) {
    this._stopAt = DBoard.LETTERS.indexOf (value);

    if (this._stopAt < 0) this._stopAt = 0;
    if (!this._interval && this._index != this._stopAt) this.spin (false);
};

DBoard.Letter.prototype._tick = function () {
    var me = this, 
        oldValue = DBoard.LETTERS.charAt (this._index),
        fallingStyle = this._falling.style,
        fallingTextStyle = this._fallingText.style,
        newValue;

    this._index = (this._index + 1) % DBoard.LETTERS.length;
    newValue = DBoard.LETTERS.charAt (this._index);

    this._fallingText.innerHTML = oldValue;
    fallingStyle.display = 'block';

    this._topText.innerHTML = newValue;

    window.setTimeout (function () {
        fallingTextStyle.WebkitTransitionTimingFunction = fallingTextStyle.MozTransitionTimingFunction = fallingTextStyle.OTransitionTimingFunction = fallingTextStyle.transitionTimingFunction = 'ease-in';
        fallingTextStyle.WebkitTransform = fallingTextStyle.MozTransform = fallingTextStyle.OTransform = fallingTextStyle.transform = 'scaleY(0)';
    }, 1);


    window.setTimeout (function () {
        me._fallingText.innerHTML = newValue;

        fallingStyle.top = '-0.03em';
        fallingStyle.bottom = 'auto';
        fallingTextStyle.top = '-0.65em';

        fallingTextStyle.WebkitTransitionTimingFunction = fallingTextStyle.MozTransitionTimingFunction = fallingTextStyle.OTransitionTimingFunction = fallingTextStyle.transitionTimingFunction = 'ease-out';
        fallingTextStyle.WebkitTransform = fallingTextStyle.MozTransform = fallingTextStyle.OTransform = fallingTextStyle.transform = 'scaleY(1)';
    }, DBoard.Letter.DROP_TIME / 2);

    window.setTimeout (function () {
        me._bottomText.innerHTML = newValue;
        fallingStyle.display = 'none';

        fallingStyle.top = 'auto';
        fallingStyle.bottom = 0;
        fallingTextStyle.top = 0;
    }, DBoard.Letter.DROP_TIME);


    if (this._index === this._stopAt) {
        clearInterval (this._interval);
        delete this._interval;
    }
};

var board = new DBoard (document.getElementById ('test'), { rowCount: 5, letterCount: 32 }); 
board.setValue (['14:30  SN 3205 VENICE      4-5 A ',
                     '14:50  SN 3737 MALAGA      4-5 A',
                     '14:50  fq 6918 DJERBA     11-  B',
                     '14:50  EZY4096 NICE       10-  A',
                     '15:55  KL 1726 AMSTERDAM   7-  A']);
                
window.setTimeout (function () {
        board.setValue (['17:00  RJ  106 AMMAN       1-  B',
                        '17:05  JAF6587 DJERBA     12-  B',
                        '17:10  SN 2721 GENEVA      4-5 A',
                        '17:15  FQ 6166 HURGHADA   11-  B',
                        '17:20  8B 8161 OUJDA        -   ']);
}, 18000);