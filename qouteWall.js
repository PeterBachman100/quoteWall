import quoteList from './quoteList.js';

//(Fisher-Yates shuffle)
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//Create and append quote cards
function createAndAppendQuote(quotePair, quoteContainer) {
	const quoteText = quotePair[0];
	const quoteSource = quotePair[1];
	
	const card = document.createElement('div');
	card.className = 'quote-card';
	
	const randomNum = Math.random();
	if(randomNum < 0.01) {
		card.classList.add('highlight-01');
	}
	else if (randomNum < 0.05) {
		card.classList.add('highlight-05');
	}
	else if(randomNum < 0.10) {
		card.classList.add('highlight-10');
	}
	
	const quoteElement = document.createElement('blockquote');
	quoteElement.textContent = quoteText;
	
	const sourceElement = document.createElement('cite');
	sourceElement.textContent = quoteSource;
	
	card.appendChild(quoteElement);
	card.appendChild(sourceElement);
	quoteContainer.appendChild(card);
}


//On page load
document.addEventListener('DOMContentLoaded', () => {
	
	// Shuffle the quotes array
	shuffleArray(quoteList);
	
	//get the quote container
	const quoteContainer = document.getElementById('quote-container');
	
	//create and append each quote
	quoteList.forEach(quotePair => {
		createAndAppendQuote(quotePair, quoteContainer);
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
		
		const quoteList = json.map(row => [row[0], row[1]]);

		// Clear existing quotes
		const quoteContainer = document.getElementById('quote-container');
		quoteContainer.innerHTML = '';

		// Append new quotes
		quoteList.forEach(quotePair => {
			createAndAppendQuote(quotePair, quoteContainer);
		});
	};
	reader.readAsArrayBuffer(event.target.files[0]);
}

document.getElementById('add-quote-btn').addEventListener('click', addNewQuote);

function addNewQuote() {
	const newQuoteText = document.getElementById('new-quote').value.trim();
	const newQuoteSource = document.getElementById('quote-source').value.trim();

	if (newQuoteText && newQuoteSource) {
		const quoteContainer = document.getElementById('quote-container');
		
		const quotePair = [newQuoteText, newQuoteSource];
		
		createAndAppendQuote(quotePair, quoteContainer);

		// Clear input fields
		document.getElementById('new-quote').value = '';
		
		document.getElementById('quote-source').value = '';
	} else {
		alert("Please fill in both the quote and the source.");
	}
}

document.getElementById('download-xlsx-btn').addEventListener('click', downloadExcel);

function downloadExcel() {
	const quotes = Array.from(document.querySelectorAll('.quote-card')).map(card => {
		const text = card.querySelector('blockquote').textContent;
		const author = card.querySelector('cite').textContent;
		return [text, author];
	});

	const worksheet = XLSX.utils.aoa_to_sheet(quotes);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Quotes");

	// Writing the file
	XLSX.writeFile(workbook, "quotes.xlsx");
}

document.getElementById('export-html-btn').addEventListener('click', exportAsHTML);

function exportAsHTML() {
	const quotes = Array.from(document.querySelectorAll('.quote-card')).map(card => {
		const text = card.querySelector('blockquote').textContent;
		const author = card.querySelector('cite').textContent;
		return `["${text}", "${author}"]`;
	});

	const quotesArrayString = `const quotesArray = [\n  ${quotes.join(',\n  ')}\n];`;

	const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My Quote Wall</title>
	<style>
		:root {
				--light-bg-color: #f5f5f5;
				--light-card-color: #eeeeee;
				--dark-text-color: #202020;
				--medium-text-color: #666666
			}
		
			* {
				margin: 0px;
				padding: 0px;
				box-sizing: border-box;
				font-family: 'Georgia', serif;
			}
			
			body {
				background-color: var(--light-bg-color);
				color: var(--dark-text-color);
			}
			
			hr {
				margin: 10px 0;
			}
			
			#quote-container {
				margin-top: 16px;
				padding: 8px;
				columns: 30rem auto; /* Default setting for larger screens */
			}
			
			.quote-card {
				background-color: var(--light-card-color);
				border-radius: 8px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
				padding: 16px;
				margin-bottom: 24px;
				display: inline-block;
				width: 100%;
				box-sizing: border-box;
			}
			
			.quote-card blockquote {
				font-size: 16px;
				margin: 0;
				padding: 0;
			}
			
			.quote-card cite {
				display: block;
				font-size: 16px;
				text-align: left;
				margin-top: 16px;
				margin-left: 4px;
				font-style: italic;
				color: var(--medium-text-color)
			}
			
			@media (max-width: 1000px) {
				#quote-container {
					columns: 20rem auto; /* Column width set to 20rem for smaller screens */
				}
			}

	</style>
</head>
<body>
	<div id="quote-container"></div>

	<script>
		${quotesArrayString}

		document.addEventListener('DOMContentLoaded', () => {
			const quoteContainer = document.getElementById('quote-container');
			
			function shuffleArray(array) {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
			}
			
			shuffleArray(quotesArray);
			
			quotesArray.forEach(quotePair => {
				const card = document.createElement('div');
				card.className = 'quote-card';
				const quoteElement = document.createElement('blockquote');
				quoteElement.textContent = quotePair[0];
				const sourceElement = document.createElement('cite');
				sourceElement.textContent = quotePair[1];
				card.appendChild(quoteElement);
				card.appendChild(sourceElement);
				quoteContainer.appendChild(card);
			});
		});
	</script>
</body>
</html>
	`;

	const blob = new Blob([htmlContent], { type: 'text/html' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'exported_quotes.html';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}


