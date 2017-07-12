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
/***/ (function(module, exports) {

document.querySelector('.search-btn').addEventListener('click', getInfo);

function getInfo(){
	let username = document.getElementById('username').value;
	fetch('https://api.github.com/users/'+username+'/gists')
	.then(response => response.json())
	.then(printInfo)
	.catch(()=> console.log('Oops!'))
};

function printInfo(data){
	console.log(data);
	let rootDiv = document.querySelector('.root');
	//username
	let usernameP = document.createElement('p');
	let usernameText = document.createTextNode(data[0].owner.login);
	usernameP.appendChild(usernameText);
	rootDiv.appendChild(usernameP);
	//title
	let titleP = document.createElement('p');
	let titleKey = Object.keys(data[0].files)[0];
	let titleText = document.createTextNode(titleKey);
	titleP.appendChild(titleText);
	rootDiv.appendChild(titleP);
	//blurb
	fetch(data[0].files[titleKey].raw_url)
	.then(response => response.text())
	.then(blurb)
	.catch(()=> console.log('Whoops'));
}

function blurb(data){
	console.log(data);
	let p = document.createElement('p');
	p.classList.add('make-this-pretty')
	let blurb = document.createTextNode(data);
	p.appendChild(blurb);
	document.querySelector('.root').appendChild(p);

	let button = document.createElement('button');
	buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	document.querySelector('.root').appendChild(button);
}

/***/ })
/******/ ]);