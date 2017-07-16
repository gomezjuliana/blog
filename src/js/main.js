import '../scss/app.scss';

let globalInfo;
let currentGist;

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', (e) => {e.preventDefault(); getData();});

// use this function to wipe "results" div clean
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
		.catch(() => alert('Oops! Something went wrong!')); 
}

function getBlurbInfo(data){
	globalInfo = data;
	const min = Math.min(data.length, 10); // the following loop uses this number to know when to stop
	for (let x = 0; x<min; x++){
		const titleKey = Object.keys(data[x].files)[0];
		fetch(data[x].files[titleKey].raw_url)
			.then(response => response.text())
			.then((blurbInfo) => {currentGist = x; printInfo(blurbInfo, data[x]);})
			.catch(() => alert('Oops! Something went wrong!'));
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
	createButton('gist-container__button', 'See more', gistContainer, (e) => openModule(e, blurbInfo, data));
}

function openModule(e, blurbInfo, data){
	cleanResults();
	
	//create a div for the blog post
	const expandedBlurbContainer = document.createElement('div');
	expandedBlurbContainer.classList.add('gist-container--expanded');

	//grab the title
	let titleSpan = document.createElement('span');
	titleSpan.classList.add('gist-container__title');
	let titleTextNode = document.createTextNode(Object.keys(data.files)[0]);
	titleSpan.appendChild(titleTextNode);
	expandedBlurbContainer.appendChild(titleSpan);

	//create the text
	let blurbParagraph = document.createElement('p');
	blurbParagraph.classList.add('gist-container__blurb');
	const blurbTextExpanded = document.createTextNode(blurbInfo);
	blurbParagraph.appendChild(blurbTextExpanded);
	expandedBlurbContainer.appendChild(blurbParagraph);
	document.querySelector('.results').appendChild(expandedBlurbContainer);

	//create a button to go to last entry
	createButton('gist-container__back-button', '<<', 
				expandedBlurbContainer, 
				(e) => openModule(e, blurbInfo, globalInfo[currentGist-1]));

	//create a button to go back to results
	createButton('gist-container__button', 'Back to results', expandedBlurbContainer, getData);

	//create a button to go to the next entry
	createButton('gist-container__next-button', '>>', expandedBlurbContainer, (e) => openModule(e, blurbInfo, globalInfo[currentGist+1]));	
}

function createButton(className, textNode, parent, action){
	const button = document.createElement('button');
	button.classList.add(className);
	button.classList.add('btn');
	const text = document.createTextNode(textNode);
	button.appendChild(text);
	parent.appendChild(button);
	button.addEventListener('click', action);
}