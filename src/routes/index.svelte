<script lang="ts">
	import 'styles/master.css';
	import data from 'data/all_parsed.json';

	import { onMount } from 'svelte';

	let article: HTMLElement[] = [];
	let highlighted_el: HTMLElement[] = [];
	let search_text = '';
	let search_btn_label = 'Loading...';

	const goTop = () => {
		window.scrollTo(0, 0);
	};

	const goBottom = () => {
		window.scrollTo(0, document.body.scrollHeight);
	};

	const walkParagraph = () => {
		let i, j;
		search_btn_label = 'Marking...';
		const tokenized_search_list = [
			...new Set(
				search_text
					.split(' ')
					.map((e) => e.replace(/_/g, ' ').replace(/\\ /g, '_').trim())
					.filter((e) => e)
			)
		];

		const some: string[] = [];
		const must: string[] = [];
		const no: string[] = [];

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

		console.log(must, no, some);
		if (some.length + must.length + no.length !== 0) {
			article_loop: for (i = 0; i < article.length; i++) {
				const content = article[i].textContent;
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

				article[i].classList.add('highlight');
				highlighted_el.push(article[i]);
			}
		}

		if (highlighted_el[0]) highlighted_el[0].scrollIntoView();

		window.queueMicrotask(() => {
			search_btn_label = 'Marked';
			setTimeout(() => (search_btn_label = 'Mark'), 500);
		});
	};

	onMount(() => {
		article = Array.from(document.querySelectorAll('article'));
		search_btn_label = 'Mark';
	});
</script>

<div class="instruction">
	<span class="instruction-text">
		<span class="b">วิธีการใช้:</span> ใส่คำค้นลงในกล่องทางขวา ถ้ามีหลาย Keyword ให้เว้นด้วย Space
		แล้วกด Mark หลังจากนั้นให้กด <kbd>CTRL+F</kbd> หาตัวอักษร <code class="hash" /> — ไม่ควรใช้ Scrollbar
	</span>
	<div class="search-container">
		<input type="input" bind:value={search_text} placeholder="แยก Keyword ด้วยเว้นวรรค" />
		<button type="button" on:click={walkParagraph}>{search_btn_label}</button>
	</div>
</div>
<main>
	{#each data as d (d.id)}
		<article itemscope itemtype="https://schema.org/Report">
			{#if d.title.length !== 0}
				<p itemprop="articleBody">
					<span class="custom-search-marker" role="none">#</span>{d.title.join('\n')}
				</p>
			{/if}
			{#if d.score_summary_docs.length !== 0}
				<details>
					<summary>ใบประมวลผลการลงมติ (เช็คคนมา, ผลโหวตแต่ละเรื่อง)</summary>
					{#each d.score_summary_docs as m}
						{#if typeof m === 'string'}
							<strong>{m}</strong>
						{:else}
							<a href={m[1]} target="_blank" rel="nofollow noopener noreferrer">
								{m[0]}
							</a>
						{/if}
					{/each}
				</details>
			{/if}
			<hr />
			{#if d.meeting_docs.length !== 0}
				<details>
					<summary>ข้อมูลการประชุม (บันทึกการประชุม)</summary>
					{#each d.meeting_docs as [t, l] (l)}
						<a href={l} target="_blank" rel="nofollow noopener noreferrer">
							{t}
						</a>
					{/each}
				</details>
			{/if}
			<h1>
				<a
					itemprop="sameAs"
					href={`https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/main_warehouse_detail.php?mid=${d.id}`}
					target="_blank"
					rel="nofollow noopener noreferrer"
				>
					<span itemprop="reportNumber">{d.id}</span>
					{#if d.category !== 'หน้าหลัก'}
						— <span itemprop="name">{d.category} {d.no}</span>
					{/if}
				</a>
			</h1>
		</article>
	{/each}
</main>
<button class="gotop" type="button" on:click={goTop}>⏫&#xFE0E;</button>
<button class="gobottom" type="button" on:click={goBottom}>⏬&#xFE0E;</button>
