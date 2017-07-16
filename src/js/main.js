import '../scss/app.scss';

let globalInfo;
let currentGist;

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', (e) => {e.preventDefault(); getData();});

function cleanResults(){
	if (document.querySelector('.gist-container')){
		document.querySelectorAll('.gist-container').forEach(function(){
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		});
	}
	if (document.querySelector('.gist-container--expanded')){
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
}

function getData(){
	cleanResults();
	const username = document.querySelector('.form__username').value;
	fetch('https://api.github.com/users/'+username+'/gists')
		.then(response => response.json())
		.then(getBlurbInfo)
		.catch(console.log); 
}

function getBlurbInfo(data){
	globalInfo = data;
	const min = Math.min(data.length, 10);
	for (let x = 0; x<min; x++){
		const titleKey = Object.keys(data[x].files)[0];
		fetch(data[x].files[titleKey].raw_url)
			.then(response => response.text())
			.then((blurbInfo) => {currentGist = x; printInfo(blurbInfo, data[x]);})
			.catch(console.log);
	}	
}

function printInfo(blurbInfo, data){
	//create a div for each gist
	const gistContainer = document.createElement('div');
	gistContainer.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistContainer);

	//create the title
	let titleSpan = document.createElement('span');
	titleSpan.classList.add('gist-container__title');
	let titleTextNode = document.createTextNode(Object.keys(data.files)[0]);
	titleSpan.appendChild(titleTextNode);
	gistContainer.appendChild(titleSpan);

	//create the blurb
	const blurbParagraph = document.createElement('p');
	blurbParagraph.classList.add('gist-container__blurb');
	const blurbContent = blurbInfo.slice(0, 101);
	const blurb = document.createTextNode(blurbContent);

	const elipsesSpan = document.createElement('span');
	elipsesSpan.classList.add('gist-container__blurb-elipses');
	const elipses = document.createTextNode('...');

	elipsesSpan.appendChild(elipses);
	blurbParagraph.appendChild(blurb);
	blurbParagraph.appendChild(elipsesSpan);
	gistContainer.appendChild(blurbParagraph);

	//create a button
	const seeMoreButton = document.createElement('button');
	seeMoreButton.classList.add('gist-container__button');
	seeMoreButton.classList.add('btn');
	let seeMoreButtonText = document.createTextNode('See more');
	seeMoreButton.appendChild(seeMoreButtonText);
	gistContainer.appendChild(seeMoreButton);
	seeMoreButton.addEventListener('click', (e) => openModule(e, blurbInfo, data));
}

function openModule(e, blurbInfo, data){
	cleanResults();
	const expandedBlurbContainer = document.createElement('div');
	expandedBlurbContainer.classList.add('gist-container--expanded');

	let titleSpan = document.createElement('span');
	titleSpan.classList.add('gist-container__title');
	let titleTextNode = document.createTextNode(Object.keys(data.files)[0]);
	titleSpan.appendChild(titleTextNode);
	expandedBlurbContainer.appendChild(titleSpan);

	let blurbParagraph = document.createElement('p');
	blurbParagraph.classList.add('gist-container__blurb');
	const blurbTextExpanded = document.createTextNode(blurbInfo);
	blurbParagraph.appendChild(blurbTextExpanded);

	expandedBlurbContainer.appendChild(blurbParagraph);
	
	document.querySelector('.results').appendChild(expandedBlurbContainer);

	let backButton = document.createElement('button');
	backButton.classList.add('gist-container__button');
	backButton.classList.add('btn');
	let buttonText = document.createTextNode('Back to results');
	backButton.appendChild(buttonText);

	backButton.addEventListener('click', getData);

	const previousButton = document.createElement('button');
	const previousButtonText = document.createTextNode('<<');
	previousButton.classList.add('gist-container__back-button');
	previousButton.classList.add('btn');
	previousButton.appendChild(previousButtonText);

	const nextButton = document.createElement('button');
	const nextButtonText = document.createTextNode('>>');
	nextButton.classList.add('gist-container__next-button');
	nextButton.classList.add('btn');
	nextButton.appendChild(nextButtonText);

	previousButton.addEventListener('click', (e) => openModule(e, blurbInfo, globalInfo[currentGist-1]));
	nextButton.addEventListener('click', (e) => openModule(e, blurbInfo, globalInfo[currentGist+1]));

	expandedBlurbContainer.appendChild(previousButton);
	expandedBlurbContainer.appendChild(backButton);
	expandedBlurbContainer.appendChild(nextButton);
}