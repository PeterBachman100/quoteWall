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

document.getElementById('download-btn').addEventListener('click', downloadQuotes);

function downloadQuotes() {
	const quotes = Array.from(document.querySelectorAll('.quote-card')).map(card => {
		const text = card.querySelector('blockquote').textContent;
		const author = card.querySelector('cite').textContent;
		return `["${text}", "${author}"]`;
	});

	const data = `const quotesArray = [\n  ${quotes.join(',\n  ')}\n];`;
	const blob = new Blob([data], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement('a');
	a.href = url;
	a.download = 'quotes.txt';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
document.getElementById('add-quote-btn').addEventListener('click', addNewQuote);

function addNewQuote() {
	const newQuoteText = document.getElementById('new-quote').value.trim();
	const newQuoteSource = document.getElementById('quote-source').value.trim();

	if (newQuoteText && newQuoteSource) {
		const quoteContainer = document.getElementById('quote-container');

		const card = document.createElement('div');
		card.className = 'quote-card';

		const quoteElement = document.createElement('blockquote');
		quoteElement.textContent = newQuoteText;

		const sourceElement = document.createElement('cite');
		sourceElement.textContent = newQuoteSource;

		card.appendChild(quoteElement);
		card.appendChild(sourceElement);
		quoteContainer.appendChild(card);

		// Clear input fields
		document.getElementById('new-quote').value = '';
		documentdocument.getElementById('download-xlsx-btn').addEventListener('click', downloadExcel);
		
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
.getElementById('quote-source').value = '';
	} else {
		alert("Please fill in both the quote and the source.");
	}
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
	<title>Exported Quotes</title>
	<style>
		#quote-container {
			margin: 20px;
			padding: 20px;
			columns: 30rem auto; /* Default setting for larger screens */
		}

		.quote-card {
			background-color: white;
			border-radius: 10px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			padding: 15px;
			margin-bottom: 20px;
			display: inline-block;
			width: 100%;
			box-sizing: border-box;
		}

		.quote-card blockquote {
			font-family: 'Georgia', serif;
			font-size: 18px;
			margin: 0;
			padding: 0;
		}

		.quote-card cite {
			display: block;
			font-size: 16px;
			text-align: left;
			margin-top: 5px;
			font-style: italic;
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

