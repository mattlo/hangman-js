var Game = {
	instance: null
};

var wordRequests = [
	'Electricity',
	'Foot',
	'Hieroglyph',
	'Kaleidoscope',
	'Microscope',
	'Pendulum'
];

for (var i = 0; i < wordRequests.length; ++i) {
	Dictionary.register(wordRequests[i]);
}

function showDifficultyDialog() {
	$('.choose-difficulty').show();
	$('.game-in-progress').hide();
}

function showGame() {
	$('.choose-difficulty').hide();
	$('.game-in-progress').show();
}

function resetGame(difficulty) {
	Game.instance = new HangmanGame(difficulty);
	$('a.picked', '.letter-choices').each(function() {
		$(this).removeClass('picked')
	});
	showGame();
}

config.winCallback = function (game) {
	alert('You Won!');
	showDifficultyDialog()
};

config.lossCallback = function (game) {
	alert('You Lose!');
	showDifficultyDialog()
};

$(document).ready(function () {
	var i,
		letterChoicesWrapper = $('.letter-choices');
		
	for (i = 0; i < config.letters.length; ++i) {
		letterChoicesWrapper.append('<li><a>' + config.letters[i] + '</a></li>');
	}
	
	$('a', letterChoicesWrapper).click(function (e) {
		e.preventDefault();
		if ($(this).hasClass('picked') === false) {
			$(this).addClass('picked');
			Game.instance.requestLetter(this.innerHTML);
		}
	});
	
	$('.choose-difficulty select').change(function () {
		var v = parseInt($(this).val(), 10);
		if (v >= 0) {
			resetGame(v);
		}
		this.selectedIndex = 0;
	});
});