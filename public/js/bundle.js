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

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', function (e) {
	e.preventDefault();getData();
});

function getData() {
	if (document.querySelector('.gist-container') || document.querySelector('.gist-container--expanded')) {
		document.querySelectorAll('.gist-container').forEach(function () {
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		});
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	var username = document.querySelector('.form__username').value;
	fetch('https://api.github.com/users/' + username + '/gists').then(function (response) {
		return response.json();
	}).then(getBlurbInfo).catch(console.log);
};

function getBlurbInfo(data) {
	var min = Math.min(data.length, 10);

	var _loop = function _loop(x) {
		var titleKey = Object.keys(data[x].files)[0];
		fetch(data[x].files[titleKey].raw_url).then(function (response) {
			return response.text();
		}).then(function (blurbInfo) {
			return printInfo(blurbInfo, data[x]);
		}).catch(console.log);
	};

	for (var x = 0; x < min; x++) {
		_loop(x);
	}
}

function printInfo(blurbInfo, data) {
	//create a div for each gist
	var gistDiv = document.createElement('div');
	gistDiv.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistDiv);

	//title
	var titleP = document.createElement('p');
	titleP.classList.add('gist-container__title');
	var titleKey = Object.keys(data.files)[0];
	var titleText = document.createTextNode(titleKey);
	titleP.appendChild(titleText);
	gistDiv.appendChild(titleP);

	//blurb
	var blurbDiv = document.createElement('div');
	blurbDiv.classList.add('gist-container__blurb');
	var p = document.createElement('p');
	p.classList.add('gist-container__blurb-text');
	var blurbText = blurbInfo.slice(0, 101);
	var blurb = document.createTextNode(blurbText + '...');
	p.appendChild(blurb);
	blurbDiv.appendChild(p);
	gistDiv.appendChild(blurbDiv);

	//create a button
	var button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	var buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	gistDiv.appendChild(button);
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
	var blurbExpand = document.createElement('div');
	blurbExpand.classList.add('gist-container--expanded');

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
	blurbExpand.appendChild(button);

	document.querySelector('.results').appendChild(blurbExpand);

	button.addEventListener('click', getData);
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);