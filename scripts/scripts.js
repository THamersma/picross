// TODO
// - add comments
// - fix CSS

$(document).ready(function(){
	//add puzzleselectors
	var template = $.templates("#puzzleSelectorTemplate");
	var htmlOutput = template.render(puzzles);
	$("#puzzleSelectorHolder").html(htmlOutput);

	// var template = $.templates("#backwallABCTemplate");
	// var htmlOutput = template.render(ABCs);
	// $("#backwallABCTemplateHolder").html(htmlOutput);

	var template = $.templates("#scribbleTemplate");
	var htmlOutput = template.render(scribbles);
	$("#scribbleHolder").html(htmlOutput);
	////////////////////////////////////////////////////////////
	//VARIABLES
	var aa = $(".button").length;
	var blockHeight = $(".sketchBlock").outerHeight(true);
	var blockState = [];
	var blockWidth = $(".sketchBlock").outerWidth(true);
	var borderColorFifth = "rgb(178, 178, 178)";
	var borderColorDefault = "rgb(229, 229, 229)";
	var currentPuzzle = puzzles[0];
	var currentView = 0;
	var defaultBlock = "rgb(255, 255, 255)";
	var disabledBlock = "0.6";
	var drag = false;
	var enabledBlock = "rgb(85, 85, 85)";
	var height = $(".button").outerHeight();
	var mainHeight = $("#main").height();
	var mainWidth = $("#main").width();
	var navigatorFadeSpeed = 500;
	var puzzleAmount = $(".puzzleSelector").length;
	var selectorFadeSpeed = 300;
	var selectorPerView = 6;
	var stateNumber; //0 or 1
	var width = $(".button").outerWidth();
	var y = mainHeight / blockHeight;
	var x = mainWidth / blockWidth;
	var z = y * x;

	//vars that require other vars
	var currentViewIndexMin = currentView * selectorPerView;
	var currentViewIndexMax = currentViewIndexMin + selectorPerView;
	var factor = x / 5;
	var blocksPerX = 5 * factor;
	var end = 25 * factor;
	var start = end - (5 * factor);
	var totalViews = Math.ceil(puzzleAmount / selectorPerView);
	var hintNumberColor = "#adadad";

	// //append content where needed
	// for (i = 0; i < (z - 1); i ++) {
	// 	//fill #main with amount of blocks that will fit
	// 	$("#main").append('<div class="sketchBlock"></div>')
	// };
	// for (i=0; i < (x); i++) {
	// 	//append required amount of top rows
	// 	$("#topIndicator").append('<div class="topIndicatorRow"></div>') //
	// }
	// for (i=0; i < (y); i++) {
	// 	//append required amount of side rows
	// 	$("#sideIndicator").append('<div class="sideIndicatorRow"></div>') //<div class="sideIndicatorBlock"></div>
	// }
	// //append default amount of blocks in indicator rows, default is 5
	// $(".topIndicatorRow").each(function() {
	// 	for(i = 0; i < (y / 2); i++) {
	// 		$(this).append('<div class="topIndicatorBlock"></div>');
	// 	};
	// });
	// $(".sideIndicatorRow").each(function() {
	// 	for(i = 0; i < (x / 2); i++) {
	// 		$(this).append('<div class="sideIndicatorBlock"></div>');
	// 	};
	// });
	$(".ABC").each(function() {
		var subjectABC = $(this);
		abcDiversity(subjectABC);
	})

	setMain();
	checkViewPuzzles();
	setMarkings();
	////////////////////////////////////////////////////////////
	//scripts for buttons
	//default button activation
	$(".button").first().addClass("activeButton");
	//add class on click, visual confirmation for user
	$(".button").click(function() {
		var clicked = $(this);
		$(".button.activeButton").toggleClass("activeButton");
		buttonActivation(clicked);
	});

	$(".puzzleSelector").click(function() {
		var clicked = $(this);
		$(".puzzleSelector.activeButton").toggleClass("activeButton");
		buttonActivation(clicked);
	});

	//automatically increase width of button holder

	$("#buttons").height((aa * height) + 2 * height);
	$("#buttons").width(width * 1.5);

	//when user clicks trasher button
	$("#trasher").click(function() {
		var clicked = $(this);
		resetPuzzleandButtons(clicked);
	})

	//creation mode, prompts some important questions and logs the solution
	$("#creator").click(function() {
		var name = prompt("enter a name for the puzzle");
		var number = prompt("what number is this puzzle?");
		var clicked = $(this);
		console.log('{name: "' + name + '", x: ' + x + ', y: ' + y + ', solution: new Array()}');
		for (i = 0; i < z; i++) {
			if (blockState[i] == 1) {
				console.log("puzzles["+ number +"].solution[" + i + "] = 1;");
			}
		}
		resetPuzzleandButtons(clicked);
	});

	$("#clearMessageButton").click(function() {
		$("#overlay, #messageHolder").fadeOut("fast");
	})

	////////////////////////////////////////////////////////////
	//etch-a-sketch functions
	//drag detector
	$(document).mousedown(function() {
		drag = true;
	});
	$(document).mouseup(function() {
		drag = false;
	});

	////////////////////////////////////////////////////////////
	//block functionality
	//block drag activation
	//when drag is true, user can call functions by hovering
	$(document).on("mouseover", ".sketchBlock", function() {
		var buttonState = $(".button.activeButton").attr("id");
		var subject = $(this);
		var blockColor = subject.css("background-color");
		var blockOpacity = subject.css("opacity");
		var blockIndex = subject.index();

		stateNumberDecider(buttonState);
		if (drag == true) {
			blockBehaviour(buttonState, subject, blockColor, blockOpacity, blockIndex);
			// blockStateChange(blockIndex, stateNumber);
			victoryCondition();
			}
		});

	//block click activation
	$(document).on("click", ".sketchBlock", function() {
		var buttonState = $(".button.activeButton").attr("id");
		var subject = $(this);
		var blockColor = subject.css("background-color");
		var blockOpacity = subject.css("opacity");
		var blockIndex = subject.index();

		stateNumberDecider(buttonState);
		blockBehaviour(buttonState, subject, blockColor, blockOpacity, blockIndex);
		// blockStateChange(blockIndex, stateNumber);
		victoryCondition();
	});

	////////////////////////////////////////////////////
	//puzzleSelector scripts
	//determine current puzzle
	$(".puzzleSelector").click(function(){
		var number = $(this).index();
		var clicked = $(this);
		currentPuzzle = puzzles[number];
		x = currentPuzzle.x;
		y = currentPuzzle.y;
		z = y * x;
		setPuzzle();
		setMain();
		setMarkings();
		setTopHints(".topIndicatorRow");
		setSideHints(".sideIndicatorRow");
		resetPuzzleandButtons();
	});

	$(".puzzleSelector").each(function() {
		var thisPuzzle = $(this).index();
		var name = "puzzleVictory";
		name = name+thisPuzzle;
		name = String(name);
		if (Cookies.get(name) == "true") {
			$(this).addClass("finishedPuzzle");
		};
	});

	$("#downNavigator").click(function() {
		currentView++;
		currentViewIndexMin = currentViewIndexMin + selectorPerView;
		currentViewIndexMax = currentViewIndexMax + selectorPerView;
		checkViewPuzzles();
	});

	$("#upNavigator").click(function() {
		$(".selectorFiller").remove();
		currentView--;
		currentViewIndexMin = currentViewIndexMin - selectorPerView;
		currentViewIndexMax = currentViewIndexMax - selectorPerView;
		checkViewPuzzles();
	});

	//buttonState, subject, blockColor, blockOpacity
	//logic behind each block
	function blockBehaviour(X, Y, Z, A, B) {
		if(X == "enabler" && A != disabledBlock) {
			Y.css("background-color", enabledBlock);
			var border = Y.css("border-right-color");
			var borderBottom = Y.css("border-bottom-color");
			var rowCheck = Math.floor(Y.index() / x);
			var indexCheck = (x + (x * rowCheck)) % Y.index();
			blockState[B] = 1;
			if (border == borderColorFifth && indexCheck != 1) {
				Y.css("border-right", "1px solid #000");
			}
			if (borderBottom != borderColorDefault) {
				Y.css("border-bottom", "1px solid #000");
			}

		} else if (X == "disabler" && Z != enabledBlock) {
			Y.css("opacity", disabledBlock);
			blockState[B] = 0;

		} else if (X == "neutraliser") {
			Y.css({"background-color": defaultBlock, "opacity": "1"});
			var border = Y.css("border-right-color");
			var borderBottom = Y.css("border-bottom-color");
			blockState[B] = 0;
			if (border == "rgb(0, 0, 0)") {
				Y.css("border-right", "1px solid " + borderColorFifth);
			}
			if (borderBottom == "rgb(0, 0, 0)") {
				Y.css("border-bottom", "1px solid " + borderColorFifth);
			}
		};
	};

	//styling of every fifth block is done in css, this removes border from last element in each row
	for (i = 0; i <= y; i++) {
			var current = (i*x)-1;
			$(".sketchBlock").eq(current).css("border-right", "none");
	};

	$(document).on("click", ".topIndicatorBlock, .sideIndicatorBlock", function() {
		var buttonHolderBackground = $("#buttons").css("background-color");
		var thisColor = $(this).css("color");
		if (thisColor == buttonHolderBackground) {
			$(this).css("color", hintNumberColor);
		} else {
			$(this).css("color", buttonHolderBackground);
		};
	});

	function abcDiversity(X) {
		var chance = Math.random();
		var random1 = Math.floor((Math.random() * 6) - 3);
		var A = Math.floor((Math.random() * 255));
		var B = Math.floor((Math.random() * 255));
		var C = Math.floor((Math.random() * 255));
		var D = 50 + Math.floor((Math.random() * 10) - 5);
		(X).css("top", D + "%");
		(X).children(".abcTopBar").css({"background-color": "rgb("+A+","+B+","+C+")", "transform": "translateY(-50%)"});
		if (chance > 0.7) {
			$(X).css("transform", "translateY(-50%) rotate("+random1+"deg)");
		};
	};

	//ZA = ".topIndicatorRow" or ".sideIndicatorRow"
	//ZB = "topIndicatorBlock" or "sideIndicatorBlock"
	function addHintFillers(ZA, ZB) {
		$(ZA).each(function() {
			if ($(this).has("div").length == 0) {
				$(this).append('<div class='+ ZB + '>0</div>');
			}
			var currentChildren = $(this).children("div").length;
			var wantedChildren = (x / 2) - currentChildren;
			for (i = 0; i < wantedChildren; i++) {
				$(this).append('<div class='+ ZB + ' style="order:6"></div>');
			};
		});
		if (x == 10) {
			$(".sketchBlock, .topIndicatorBlock, .sideIndicatorBlock").css({"width": "20px", "height": "20px", "font-size": "20px"});
			$(".topIndicatorRow").css("width", "20px");
			$(".sideIndicatorRow").css("height", "20px");
		} else if (x == 20) {
			$(".sketchBlock, .topIndicatorBlock, .sideIndicatorBlock").css({"width": "10px", "height": "10px", "font-size": "10px"});
			$(".topIndicatorRow").css("width", "10px");
			$(".sideIndicatorRow").css("height", "10px");
		};
	};

	// function blockStateChange(X, Y){
	// 	blockState[X] = Y;
	// };

	function buttonActivation(X){
		X.toggleClass("activeButton");
	};

	function checkViewPuzzles() {
		$(".puzzleSelector").fadeOut(0);
		for (i = currentViewIndexMin; i < currentViewIndexMax; i++) {
			$(".puzzleSelector").eq(i).fadeIn(selectorFadeSpeed);
		};
		if (currentView == 0 && totalViews > 1) {
			$("#downNavigator").fadeIn(navigatorFadeSpeed);
			$("#upNavigator").fadeOut(navigatorFadeSpeed);
		} else if (currentView > 0) {
			$("#upNavigator").fadeIn(navigatorFadeSpeed);
		};
		if (currentView == (totalViews - 1)) {
			$("#downNavigator").fadeOut(navigatorFadeSpeed);
			fillPuzzleHolder();
		};
	};

	function fillPuzzleHolder() {
		$(".selectorFiller").remove();
		if ($(".puzzleSelector").length % 6 != 0) {
			var rest = $(".puzzleSelector").length % 6;
			for (i = 0; i < (6 - rest);i++) {
			$("#puzzleSelectorHolder").append("<div class='selectorFiller'></div>");
			};
		};
	};

	function resetPuzzleandButtons(X) {
		var blocksAmount = $(".sketchBlock").length;
		$(".sketchBlock").each(function() {
			$(this).css({"background-color": enabledBlock, "opacity": "1"});
			if ($(this).css("border-right-color") != borderColorFifth && $(this).css("border-right-color") != borderColorDefault) {
				$(this).css("border-right", "1px solid " + borderColorFifth);
			};
			if ($(this).css("border-bottom-color") != borderColorDefault) {
				$(this).css("border-bottom", "1px solid " + borderColorFifth);
			};
		})
		// $(".sketchBlock").css({"background-color": enabledBlock, "opacity": "1"})
		// if ($(".sketchBlock").css("border-right-color") != borderColorFifth) {
		// 	$(this).css("border-right", "1px solid " + borderColorFifth);
		// }
		setTimeout(function(){
			$(".sketchBlock").css({"background-color": defaultBlock});
		}, 500);
		$(X).toggleClass("activeButton");
		if ($(".button").first().hasClass("activeButton") == false) {
				$(".button").first().toggleClass("activeButton");
			};
		for (i = 0; i < blocksAmount; i++) {
			//reset all blocks
			blockState[i] = 0;
		};
		$(".topIndicatorBlock, .sideIndicatorBlock").css("color", hintNumberColor);
	};

	//XB = topIndicatorRow or sideIndicatorRow
	//XC = x or 1
	//XD = y or x
	//XE = topIndicatorBlock or sideIndicatorBlock
	//XF = currentIndex or currentIndexY
	//XG = currentValue or currentValueY
	function setHints(XB, XC, XD, XE, XF, XG) {
		var order = 5;
		for (I = 0; I < y; I++) {
			if (currentPuzzle.solution[XF] === 1) {
				XG = XG + 1;
				XF = XF + XC;
				if (I == (XD - 1)) {
					$(XB).eq(i).append('<div class='+ XE +' style="order:'+order+'">' + XG + '</div>');
					order--;
				};
			} else if (currentPuzzle.solution[XF] === 0) {
				if (XG == 0) {
					XG = 0;
					XF = XF + XC;
				} else {
					$(XB).eq(i).append('<div class='+ XE +' style="order:'+order+'">' + XG + '</div>');
					order--;
					XG = 0;
					XF = XF + XC;
				};
			};
		};
	};

	function setMain() {
		//append content where needed
		$(".sketchBlock, .topIndicatorRow, .sideIndicatorRow, topIndicatorBlock, sideIndicatorBlock").remove();
		for (i = 0; i < z; i ++) {
			//fill #main with amount of blocks that will fit
			$("#main").append('<div class="sketchBlock"></div>')
		};
		for (i=0; i < x; i++) {
			//append required amount of top rows
			$("#topIndicator").append('<div class="topIndicatorRow"></div>') //
		}
		for (i=0; i < y; i++) {
			//append required amount of side rows
			$("#sideIndicator").append('<div class="sideIndicatorRow"></div>') //<div class="sideIndicatorBlock"></div>
		}
		//append default amount of blocks in indicator rows, default is 5
		$(".topIndicatorRow").each(function() {
			for(i = 0; i < (y / 2); i++) {
				$(this).append('<div class="topIndicatorBlock"></div>');
			};
		});
		$(".sideIndicatorRow").each(function() {
			for(i = 0; i < (x / 2); i++) {
				$(this).append('<div class="sideIndicatorBlock"></div>');
			};
		});
	};

	function setMarkings() {
		$(".topIndicatorRow").each(function() {
			var thisIndex = $(this).index();
			blocksPerY = currentPuzzle.y / 5;
			var blockIndexY = thisIndex + (4 * x);
			for (i = 0; i < (blocksPerY - 1); i++) {
				$(".sketchBlock").eq(blockIndexY + (i * (5 * x))).css("border-bottom", "1px solid #b2b2b2");
			};
		});
	};

	function setPuzzle() {
		var total = currentPuzzle.x * currentPuzzle.y;
		for (i = 0; i < total; i++) {
			blockState[i] = 0;
			if (currentPuzzle.solution[i] == 1) {
				continue;
			} else {
				currentPuzzle.solution[i] = 0;
			};
		};
	};

	function setSideHints(YA) {
		//x is amount of blocks on x-axis, y is amount of blocks on y-axis (see top of scripts.js, calculation of amount of blocks required)
		var totalIndex = $(YA).length;
		$(YA).empty();
		for (i = 0; i < totalIndex; i++) {
			var currentValueY = 0;
			var currentIndexY = i;
				if (i != 0) {
					currentIndexY = y + ((i - 1) * y);
				};
				setHints(".sideIndicatorRow", 1, x, "sideIndicatorBlock", currentIndexY, currentValueY);
			};
			addHintFillers(".sideIndicatorRow", "sideIndicatorBlock");
		};

		//XA = .topIndicatorRow
		function setTopHints(XA) {
			var totalIndex = $(XA).length;
			$(XA).empty();
			for (i = 0; i < totalIndex; i++) {
				var currentValue = 0;
				var currentIndex = i
				setHints(".topIndicatorRow", x, y, "topIndicatorBlock", currentIndex, currentValue);
			};
			addHintFillers(".topIndicatorRow", "topIndicatorBlock");
		};

		function stateNumberDecider(X) {
			if (X == "enabler") {
				stateNumber = 1;
			} else {
				stateNumber = 0;
			};
		};

		function victoryCondition() {
			//to compare arrays, convert to text
			if(JSON.stringify(blockState) == JSON.stringify(currentPuzzle.solution)) {
				setTimeout(function() {
					$("#overlay, #messageHolder").fadeIn("fast")}, 400);
				var puzzleNumber = $(".puzzleSelector.activeButton").index();
				var name = "puzzleVictory";
				$(".puzzleSelector").eq(puzzleNumber).addClass("finishedPuzzle");
				Cookies.set(name+puzzleNumber, true, {expires: 365});
			};
		};
});
