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
	for (let x = 0; x<=10; x++){
		let usernameP = document.createElement('p');
		let usernameText = document.createTextNode(data[x].owner.login);
		usernameP.appendChild(usernameText);
		rootDiv.appendChild(usernameP);
		//title
		let titleP = document.createElement('p');
		let titleKey = Object.keys(data[x].files)[0];
		let titleText = document.createTextNode(titleKey);
		titleP.appendChild(titleText);
		rootDiv.appendChild(titleP);
		//blurb
		fetch(data[x].files[titleKey].raw_url)
		.then(response => response.text())
		.then(blurb)
		.catch(()=> console.log('Whoops'));
	}
}

function blurb(data){
	console.log(data);
	let p = document.createElement('p');
	p.classList.add('make-this-pretty')
	let blurbText = data.slice(0, 101);
	let blurb = document.createTextNode(blurbText +'...');
	p.appendChild(blurb);
	document.querySelector('.root').appendChild(p);

	let button = document.createElement('button');
	buttonText = document.createTextNode('See more');
	button.appendChild(buttonText);
	document.querySelector('.root').appendChild(button);
}