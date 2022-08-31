<script lang="ts">
	import 'styles/master.css';
	import data from 'data/all_parsed.json';

	import { onMount } from 'svelte';

	let article: HTMLElement[] = [];
	let highlighted_p: HTMLElement[] = [];
	let search_text = '';
	let search_btn_label = 'Loading...';

	const goTop = () => {
		window.scrollTo(0, 0);
	};

	const goBottom = () => {
		window.scrollTo(0, document.body.scrollHeight);
	};

	const walkParagraph = () => {
		search_btn_label = 'Marking...';
		const words = search_text.trim().split(' ');

		highlighted_p.forEach((e) => e.classList.remove('highlight'));
		highlighted_p = [];

		if (search_text.trim() !== '') {
			article.forEach((e) => {
				try {
					let text_temp = e.textContent;
					for (const word of words) {
						if (!text_temp?.includes(word)) throw new Error();
					}
					// pass
					e.classList.add('highlight');
					highlighted_p.push(e);
				} catch (e) {
					// has no match - skipped
				}
			});
		}

		if (highlighted_p[0]) highlighted_p[0].parentElement?.scrollIntoView();

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
