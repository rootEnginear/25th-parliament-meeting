const el_dialog = document.getElementById('instruction-dialog');
const el_search_input = document.getElementById('search-input');
const el_search_btn = document.getElementById('search-btn');

const el_articles = Array.from(document.querySelectorAll('article'));
let highlighted_el = [];

const goTop = () => {
	window.scrollTo(0, 0);
};

const goBottom = () => {
	window.scrollTo(0, document.body.scrollHeight);
};

const showInstruction = () => {
	el_dialog?.showModal();
};

const markArticles = (event) => {
	if (event.type === 'keydown' && event.key !== 'Enter') return;
	let i, j;
	el_search_btn.innerText = 'Marking...';
	const tokenized_search_list = [
		...new Set(
			el_search_input.value
				.split(' ')
				.map((e) => e.replace(/_/g, ' ').replace(/\\ /g, '_').trim())
				.filter((e) => e)
		)
	];

	const some = [];
	const must = [];
	const no = [];

	for (i = 0; i < tokenized_search_list.length; i++) {
		const term = tokenized_search_list[i];
		if (term[0] === '+') {
			must.push(term.substring(1));
		} else if (term[0] === '-') {
			no.push(term.substring(1));
		} else {
			some.push(term);
		}
	}

	highlighted_el.forEach((e) => e.classList.remove('highlight'));
	highlighted_el = [];

	if (some.length + must.length + no.length !== 0) {
		article_loop: for (i = 0; i < el_articles.length; i++) {
			const content = el_articles[i].textContent;
			for (j = 0; j < no.length; j++) {
				if (content?.includes(no[j])) continue article_loop;
			}
			for (j = 0; j < must.length; j++) {
				if (!content?.includes(must[j])) continue article_loop;
			}
			for (j = 0; j < some.length; j++) {
				if (content?.includes(some[j])) break;
			}
			if (j === some.length) continue article_loop;

			el_articles[i].classList.add('highlight');
			highlighted_el.push(el_articles[i]);
		}
	}

	if (highlighted_el[0]) highlighted_el[0].scrollIntoView();

	window.queueMicrotask(() => {
		el_search_btn.innerText = 'Marked';
		setTimeout(() => (el_search_btn.innerText = 'Mark'), 500);
	});
};

el_search_input.addEventListener('keydown', markArticles);
el_search_btn.addEventListener('click', markArticles);

el_search_btn.innerText = 'Mark';

Array.from(document.querySelectorAll('link[media="print"]')).forEach((l) => (l.media = 'all'));
