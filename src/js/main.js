import '../scss/app.scss';

let globalInfo;
let currentGist;

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', (e) => {e.preventDefault(); getData();});

function getData(){
	if (document.querySelector('.gist-container')){
		document.querySelectorAll('.gist-container').forEach(function(){
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		})
	}
	if (document.querySelector('.gist-container--expanded')){
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	const username = document.querySelector('.form__username').value;
	fetch('https://api.github.com/users/'+username+'/gists')
	.then(response => response.json())
	.then(getBlurbInfo)
	.catch(console.log) 
};

function getBlurbInfo(data){
	globalInfo = data;
	const min = Math.min(data.length, 10);
	for (let x = 0; x<min; x++){
	const titleKey = Object.keys(data[x].files)[0];
	fetch(data[x].files[titleKey].raw_url)
		.then(response => response.text())
		.then((blurbInfo) => {currentGist = x; printInfo(blurbInfo, data[x])})
		.catch(console.log);
	}	
}

function printInfo(blurbInfo, data){
	//create a div for each gist
	const gistContainer = document.createElement('div');
	gistContainer.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistContainer);

	//title
	let span = document.createElement('span');
	span.classList.add('gist-container__title')
	let textNode = document.createTextNode(Object.keys(data.files)[0]);
	span.appendChild(textNode);
	gistContainer.appendChild(span);

	//blurb
	const blurbContainer = document.createElement('div');
	blurbContainer.classList.add('gist-container__blurb');
	const p = document.createElement('p');
	p.classList.add('gist-container__blurb-text')
	const blurbContent = blurbInfo.slice(0, 101);
	const blurb = document.createTextNode(blurbContent);

	const elipsesSpan = document.createElement('span');
	elipsesSpan.classList.add('gist-container__blurb-text-elipses');
	const elipses = document.createTextNode('...');

	elipsesSpan.appendChild(elipses);
	p.appendChild(blurb);
	p.appendChild(elipsesSpan);
	blurbContainer.appendChild(p);
	gistContainer.appendChild(blurbContainer);

	//create a button
	let button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	let buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	gistContainer.appendChild(button);
	button.addEventListener('click', (e) => openModule(e, blurbInfo, data));
}

function openModule(e, blurbInfo, data){
	if (document.querySelector('.gist-container')){
		document.querySelectorAll('.gist-container').forEach(function(){
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		})
	}
	if (document.querySelector('.gist-container--expanded')){
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	const blurbExpand = document.createElement('div');
	blurbExpand.classList.add('gist-container--expanded');

	let titleP = document.createElement('span');
	titleP.classList.add('gist-container__title')
	let titleKey = Object.keys(data.files)[0];
	let titleText = document.createTextNode(titleKey);
	titleP.appendChild(titleText);
	blurbExpand.appendChild(titleP);

	let div = document.createElement('div');
	div.classList.add('gist-container__blurb');

	const blurbP = document.createElement('p');
	blurbP.classList.add('gist-container__blurb--expanded');
	const blurbTextExpanded = document.createTextNode(blurbInfo);
	blurbP.appendChild(blurbTextExpanded);

	let button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	let buttonText = document.createTextNode('Back');
	button.appendChild(buttonText);

	blurbExpand.appendChild(blurbP);
	
	document.querySelector('.results').appendChild(blurbExpand);

	button.addEventListener('click', getData);

	const backButton = document.createElement('button');
	const backButtonText = document.createTextNode('Previous Gist');
	backButton.classList.add('gist-container__back-button');
	backButton.classList.add('btn');
	backButton.appendChild(backButtonText);

	const nextButton = document.createElement('button');
	const nextButtonText = document.createTextNode('Next Gist');
	nextButton.classList.add('gist-container__next-button');
	nextButton.classList.add('btn');
	nextButton.appendChild(nextButtonText);

	backButton.addEventListener('click', (e) => openModule(e, blurbInfo, globalInfo[currentGist-1]));
	nextButton.addEventListener('click', (e) => openModule(e, blurbInfo, globalInfo[currentGist+1]));

	blurbExpand.appendChild(backButton);
	blurbExpand.appendChild(button);
	blurbExpand.appendChild(nextButton);
}