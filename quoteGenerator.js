import quoteList from './quoteList.js';
console.log("Test");

document.addEventListener('DOMContentLoaded', () => {
	

	// Function to shuffle an array (Fisher-Yates shuffle)
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	
	// Shuffle the quotes array
	shuffleArray(quoteList);
	
	const quoteContainer = document.getElementById('quote-container');

	quoteList.forEach(quotePair => {
		const quoteText = quotePair[0];
		const quoteSource = quotePair[1];
	
		const card = document.createElement('div');
		card.className = 'quote-card';
	
		const quoteElement = document.createElement('blockquote');
		quoteElement.textContent = quoteText;
	
		const sourceElement = document.createElement('cite');
		sourceElement.textContent = quoteSource;
	
		card.appendChild(quoteElement);
		card.appendChild(sourceElement);
		quoteContainer.appendChild(card);
	});

});

//handle upload
document.getElementById('upload').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
	const reader = new FileReader();
	reader.onload = (event) => {
		const data = new Uint8Array(event.target.result);
		const workbook = XLSX.read(data, {type: 'array'});
		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];
		const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
		const quoteList = json.map(row => ({ text: row[0], author: row[1] }));

		// Clear existing quotes
		const quoteContainer = document.getElementById('quote-container');
		quoteContainer.innerHTML = '';

		// Append new quotes
		quoteList.forEach(quotePair => {
			const card = document.createElement('div');
			card.className = 'quote-card';

			const quoteElement = document.createElement('blockquote');
			quoteElement.textContent = quotePair.text;

			const sourceElement = document.createElement('cite');
			sourceElement.textContent = quotePair.author;

			card.appendChild(quoteElement);
			card.appendChild(sourceElement);
			quoteContainer.appendChild(card);
		});
	};
	reader.readAsArrayBuffer(event.target.files[0]);
}