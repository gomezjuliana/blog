import '../scss/app.scss';

document.querySelector('.form__button').addEventListener('click', getData);
document.querySelector('.form').addEventListener('submit', (e) => {e.preventDefault(); getData();});

function getData(){
	if (document.querySelector('.gist-container') || document.querySelector('.gist-container--expanded')){
		document.querySelectorAll('.gist-container').forEach(function(){
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));

		})
		document.querySelector('.results').removeChild(document.querySelector('.gist-container--expanded'));
	}
	const username = document.querySelector('.form__username').value;
	fetch('https://api.github.com/users/'+username+'/gists')
	.then(response => response.json())
	.then(getBlurbInfo)
	.catch(console.log) 
};

function getBlurbInfo(data){
	const min = Math.min(data.length, 10);
	for (let x = 0; x<min; x++){
	let titleKey = Object.keys(data[x].files)[0];
	fetch(data[x].files[titleKey].raw_url)
		.then(response => response.text())
		.then((blurbInfo) => printInfo(blurbInfo, data[x]))
		.catch(console.log);
	}	
}

function printInfo(blurbInfo, data){
	//create a div for each gist
	const gistDiv = document.createElement('div');
	gistDiv.classList.add('gist-container');
	document.querySelector('.results').appendChild(gistDiv);

	//title
	const titleP = document.createElement('p');
	titleP.classList.add('gist-container__title')
	let titleKey = Object.keys(data.files)[0];
	const titleText = document.createTextNode(titleKey);
	titleP.appendChild(titleText);
	gistDiv.appendChild(titleP);

	//blurb
	const blurbDiv = document.createElement('div');
	blurbDiv.classList.add('gist-container__blurb');
	const p = document.createElement('p');
	p.classList.add('gist-container__blurb-text')
	const blurbText = blurbInfo.slice(0, 101);
	const blurb = document.createTextNode(blurbText +'...');
	p.appendChild(blurb);
	blurbDiv.appendChild(p);
	gistDiv.appendChild(blurbDiv);

	//create a button
	let button = document.createElement('button');
	button.classList.add('gist-container__button');
	button.classList.add('btn');
	let buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	gistDiv.appendChild(button);
	button.addEventListener('click', (e) => openModule(e, blurbInfo, data));
}

function openModule(e, blurbInfo, data){
	if (document.querySelector('.gist-container')){
		document.querySelectorAll('.gist-container').forEach(function(){
			document.querySelector('.results').removeChild(document.querySelector('.gist-container'));
		})
	}
	const blurbExpand = document.createElement('div');
	blurbExpand.classList.add('gist-container--expanded');

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
	blurbExpand.appendChild(button);

	document.querySelector('.results').appendChild(blurbExpand);

	button.addEventListener('click', getData);
}