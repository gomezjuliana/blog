import '../scss/app.scss';

let globalInfo;
let currentGist;
let blurbInfoList = [];

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', (e) => {e.preventDefault(); getData();});

/**
* This function cleans up '.results' to cleanly display new info
*/
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

/**
* This first fetch grabs the info needed for the lookup to look (title, # of entries, urls)
*/
function getData(){
	cleanResults();
	const username = document.querySelector('.form__username').value;
	fetch(`https://api.github.com/users/${username}/gists`)
		.then(response => response.json())
		.then(getBlurbInfo)
		.catch(() => alert('Oops! Something went wrong!')); 
}

/**
* This second fetch grabs the blurb text
*/
function getBlurbInfo(data){
	globalInfo = data;
	blurbInfoList = [];
	const min = Math.min(data.length, 10); /*** the following loop uses this number to know when to stop */
	for (let x = 0; x<min; x++){
		const titleKey = Object.keys(data[x].files)[0];
		fetch(data[x].files[titleKey].raw_url)
			.then(response => response.text())
			/***start passing x in next line to use in forward and backward function later on*/
			.then((blurbInfo) => {blurbInfoList.push(blurbInfo); printInfo(blurbInfo, data[x], x);}) 
			.catch(() => alert('Oops! Something went wrong!'));
	}	
}

/**
* This function prints the primary results of the search aka the first page
*/
function printInfo(blurbInfo, data, x){
	/***create a div for each gist*/
	const gistContainer = document.createElement('div');
	gistContainer.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistContainer);

	/***create the title*/
	let titleSpan = document.createElement('span');
	titleSpan.classList.add('gist-container__title');
	let titleTextNode = document.createTextNode(Object.keys(data.files)[0]);
	titleSpan.appendChild(titleTextNode);
	gistContainer.appendChild(titleSpan);

	/***create the blurb*/
	const blurbParagraph = document.createElement('p');
	blurbParagraph.classList.add('gist-container__blurb');
	const blurb = document.createTextNode(blurbInfo.slice(0, 101)); /*** slicing here to cut the blurb to 100 characters*/
	blurbParagraph.appendChild(blurb);
	gistContainer.appendChild(blurbParagraph);

	/***create a span so we can style just the elipses red*/
	const elipsesSpan = document.createElement('span');
	elipsesSpan.classList.add('gist-container__blurb-elipses');
	const elipses = document.createTextNode('...');
	elipsesSpan.appendChild(elipses);
	blurbParagraph.appendChild(elipsesSpan);

	/***create the 'See More' button*/
	createButton('gist-container__button', 'See more', gistContainer, 
		(e) => openModule(e, blurbInfo, data, x));
}

/**
* This function prints the full text of the chosen Gist aka the second page
*/
function openModule(e, blurbInfo, data, x){
	currentGist = x; /***this updates currentGist which we'll need to move forward and backwards between entires*/
	cleanResults();
	
	//create a div for the blog post
	const expandedBlurbContainer = document.createElement('div');
	expandedBlurbContainer.classList.add('gist-container--expanded');
	document.querySelector('.results').appendChild(expandedBlurbContainer);

	//grab the title
	let titleSpan = document.createElement('span');
	titleSpan.classList.add('gist-container__title');
	/***the title of the gist is stored as a property so use Object.keys to grab it*/
	let titleTextNode = document.createTextNode(Object.keys(data.files)[0]);
	titleSpan.appendChild(titleTextNode);
	expandedBlurbContainer.appendChild(titleSpan);

	//create the text
	let blurbParagraph = document.createElement('p');
	blurbParagraph.classList.add('gist-container__blurb');
	const blurbTextExpanded = document.createTextNode(blurbInfo);
	blurbParagraph.appendChild(blurbTextExpanded);
	expandedBlurbContainer.appendChild(blurbParagraph);

	/***these variables make sure that the carousel of forwards and backwards doesn't break at either end*/
	const previousGistId = currentGist <= 0 ? blurbInfoList.length -1 : currentGist-1; 
	const nextGistId = currentGist >= blurbInfoList.length -1 ? 0 : currentGist+1; 

	//create a button to go to last entry
	createButton('gist-container__back-button', '<<', expandedBlurbContainer, 
		(e) => openModule(e, blurbInfoList[previousGistId], globalInfo[previousGistId], previousGistId));

	//create a button to go back to results
	createButton('gist-container__button', 'Back to results', expandedBlurbContainer, getData);

	//create a button to go to the next entry
	createButton('gist-container__next-button', '>>', expandedBlurbContainer, 
		(e) => openModule(e, blurbInfoList[nextGistId], globalInfo[nextGistId], nextGistId));	
}

/**
* This function creates a button
*/
function createButton(className, textNode, parent, action){
	const button = document.createElement('button');
	button.classList.add(className);
	button.classList.add('btn');
	const text = document.createTextNode(textNode);
	button.appendChild(text);
	parent.appendChild(button);
	button.addEventListener('click', action);
}