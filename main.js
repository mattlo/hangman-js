var config = {
	letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	lossCallback: function () {},
	winCallback: function () {}
};

function Word(word) {
	word = $.trim(word);
	
	if (word.length === 0) {
		throw new Error('Word must have at least 1 letter');
	}
	
	this.value = word.toLowerCase();
}

Word.prototype = {
	get: function () {
		return this.value;
	},
	getCharAtValues: function (letter) {
		var i,
			values = [];
			
		for (i = 0; i < this.value.length; ++i) {
			if (this.value.charAt(i) === letter) {
				values.push(i);
			}
		}
		
		return values;
	}
};

var Dictionary = {
	wordList: [],
	register: function (word) {
		this.wordList.push(new Word(word));
	},
	getRandomWord: function () {
		return this.getRandomWords(1)[0];
	},
	getRandomWords: function (amount) {
		if (amount > this.wordList.length) {
			throw new Error('Requested random amount cannot exceed registered words');
		}
		
		var i,
			randomOut = [],
			randomList = Util.shuffle(this.wordList);
			
		for (i = 0; i < amount; ++i) {
			randomOut.push(randomList[i]);
		}
		
		return randomOut;
	}
}

function HangmanGame(difficulty) {
	this.words = Dictionary.getRandomWords(DifficultyDelegator(difficulty));
	this.usedLetterList = [];
	this.ui = [];
	HangmanImage.reset();
	
	var i;
	
	for (i = 0; i < this.words.length; ++i) {
		this.createOutputInterface(this.words[i].get());
	}
}

HangmanGame.prototype = {
	requestLetter: function (letter) {
		var i,
			found = false;
		
		for (i = 0; i < this.usedLetterList; ++i) {
			if (letter === this.usedLetterList[i]) {
				throw new Error('Letter already used');
			}
		}
		
		this.usedLetterList.push(letter);
		
		for (i = 0; i < this.words.length; ++i) {
			if (this.letterExists(letter, this.words[i], i) === true) {
				found = true;
			}
		}
		
		if (found === false) {
			this.loseLife();
		} else {
			this.checkWon();
		}
	},
	loseLife: function () {
		HangmanImage.removeLife();
		if (HangmanImage.life.length === 0) {
			config.lossCallback(this);
			this.kill();
		}
	},
	checkWon: function () {
		var won = true;
		$('li', this.ul).each(function () {
			if (this.innerHTML.length === 0) {
				won = false;
			}
		});
		
		if (won === true) {
			config.winCallback(this);
			this.kill();
		}
	},
	letterExists: function (letter, word, wordIndex) {
		var i,
			found = false,
			list = word.getCharAtValues(letter);
		
		if (list.length > 0) {
			found = true;
			
			for (i = 0; i < list.length; ++i) {
				$('li', this.ui[wordIndex]).eq(list[i]).text(letter);
			}
		}
		
		return found;
	},
	createOutputInterface: function (word) {
		var wrapper = $('<ul class="word" />'),
			i;
		
		for (i = 0; i < word.length; ++i) {
			wrapper.append($('<li />'));
		}
		
		$('.word-visual').append(wrapper);
		
		this.ui.push(wrapper);
	},
	kill: function () {
		var i;
		for (i = 0; i < this.ui.length; ++i) {
			this.ui[i].remove();
		}
		HangmanImage.reset();
	}
};

function DifficultyDelegator(difficulty) {
	var wordCount = 1;
	
	switch (difficulty) {
	case 1:
		wordCount = 2;
		break;
	case 2:
		wordCount = 4;
		break;
	}
	
	return wordCount;
}

var HangmanImage = {
	lifeLimit: 6,
	life: [],
	reset: function () {
		var i;
		this.life = [];
		
		for (i = 0; i <= this.lifeLimit; ++i) {
			this.life.push(i);
		}
		
		$('.hangman-visual')[0].className = 'hangman-visual';
	},
	removeLife: function () {
		$('.hangman-visual').addClass('state-' + this.life.shift());
	}
};

var Util = {
	shuffle: function (o) {
		var j, 
			x, 
			i;
		for	(i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
};

var Difficulty = {
	Easy: 0,
	Intermediate: 1,
	Hard: 2
}