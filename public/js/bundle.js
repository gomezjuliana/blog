/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var globalInfo = void 0;
var currentGist = void 0;

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', function (e) {
	e.preventDefault();getData();
});

function getData() {
	if (document.querySelector('.gist-container')) {
		document.querySelectorAll('.gist-container').forEach(function () {
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		});
	}
	if (document.querySelector('.gist-container--expanded')) {
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	var username = document.querySelector('.form__username').value;
	fetch('https://api.github.com/users/' + username + '/gists').then(function (response) {
		return response.json();
	}).then(getBlurbInfo).catch(console.log);
};

function getBlurbInfo(data) {
	globalInfo = data;
	var min = Math.min(data.length, 10);

	var _loop = function _loop(x) {
		var titleKey = Object.keys(data[x].files)[0];
		fetch(data[x].files[titleKey].raw_url).then(function (response) {
			return response.text();
		}).then(function (blurbInfo) {
			currentGist = x;printInfo(blurbInfo, data[x]);
		}).catch(console.log);
	};

	for (var x = 0; x < min; x++) {
		_loop(x);
	}
}

function printInfo(blurbInfo, data) {
	//create a div for each gist
	var gistContainer = document.createElement('div');
	gistContainer.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistContainer);

	//title
	var span = document.createElement('span');
	span.classList.add('gist-container__title');
	var textNode = document.createTextNode(Object.keys(data.files)[0]);
	span.appendChild(textNode);
	gistContainer.appendChild(span);

	//blurb
	var blurbContainer = document.createElement('div');
	blurbContainer.classList.add('gist-container__blurb');
	var p = document.createElement('p');
	p.classList.add('gist-container__blurb-text');
	var blurbContent = blurbInfo.slice(0, 101);
	var blurb = document.createTextNode(blurbContent);

	var elipsesSpan = document.createElement('span');
	elipsesSpan.classList.add('gist-container__blurb-text-elipses');
	var elipses = document.createTextNode('...');

	elipsesSpan.appendChild(elipses);
	p.appendChild(blurb);
	p.appendChild(elipsesSpan);
	blurbContainer.appendChild(p);
	gistContainer.appendChild(blurbContainer);

	//create a button
	var button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	var buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	gistContainer.appendChild(button);
	button.addEventListener('click', function (e) {
		return openModule(e, blurbInfo, data);
	});
}

function openModule(e, blurbInfo, data) {
	if (document.querySelector('.gist-container')) {
		document.querySelectorAll('.gist-container').forEach(function () {
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		});
	}
	if (document.querySelector('.gist-container--expanded')) {
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	var blurbExpand = document.createElement('div');
	blurbExpand.classList.add('gist-container--expanded');

	var titleP = document.createElement('span');
	titleP.classList.add('gist-container__title');
	var titleKey = Object.keys(data.files)[0];
	var titleText = document.createTextNode(titleKey);
	titleP.appendChild(titleText);
	blurbExpand.appendChild(titleP);

	var div = document.createElement('div');
	div.classList.add('gist-container__blurb');

	var blurbP = document.createElement('p');
	blurbP.classList.add('gist-container__blurb--expanded');
	var blurbTextExpanded = document.createTextNode(blurbInfo);
	blurbP.appendChild(blurbTextExpanded);

	var button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	var buttonText = document.createTextNode('Back');
	button.appendChild(buttonText);

	blurbExpand.appendChild(blurbP);

	document.querySelector('.results').appendChild(blurbExpand);

	button.addEventListener('click', getData);

	var backButton = document.createElement('button');
	var backButtonText = document.createTextNode('Previous Gist');
	backButton.classList.add('gist-container__back-button');
	backButton.classList.add('btn');
	backButton.appendChild(backButtonText);

	var nextButton = document.createElement('button');
	var nextButtonText = document.createTextNode('Next Gist');
	nextButton.classList.add('gist-container__next-button');
	nextButton.classList.add('btn');
	nextButton.appendChild(nextButtonText);

	backButton.addEventListener('click', function (e) {
		return openModule(e, blurbInfo, globalInfo[currentGist - 1]);
	});
	nextButton.addEventListener('click', function (e) {
		return openModule(e, blurbInfo, globalInfo[currentGist + 1]);
	});

	blurbExpand.appendChild(backButton);
	blurbExpand.appendChild(button);
	blurbExpand.appendChild(nextButton);
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);