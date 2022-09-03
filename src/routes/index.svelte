<script lang="ts">
	import 'styles/master.css';
	import data from 'data/all_parsed.json';

	import { onMount } from 'svelte';

	let article: HTMLElement[] = [];
	let highlighted_el: HTMLElement[] = [];
	let search_text = '';
	let search_btn_label = 'Loading...';
	let el_dialog: HTMLDialogElement;

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
		<span class="b">วิธีการใช้:</span> กด <kbd>CTRL+F</kbd> แล้วหาคำที่ต้องการ หรือใช้กล่องทางขวา — ไม่ควรใช้
		Scrollbar
	</span>
	<span>กล่องค้นหาละเอียด <button on:click={() => el_dialog?.showModal()}>วิธีใช้</button></span>
	<div class="search-container">
		<input type="input" bind:value={search_text} placeholder="ไม่ไว้วางใจ +ประยุทธ์ -ประวิทย์" />
		<button type="button" on:click={walkParagraph}>{search_btn_label}</button>
	</div>
</div>
<dialog bind:this={el_dialog}>
	<h1 class="b">วิธีการใช้กล่องค้นหาละเอียด</h1>
	<ol>
		<li>
			ใส่คำค้นหาที่ต้องการ
			<ul>
				<li>"คำค้นหา" สามารถมีกี่คำก็ได้ โดยแยกด้วยการเว้นวรรค เช่น "ไม่ไว้วางใจ ชลน่าน"</li>
				<li>หากต้องการใส่ช่องว่างลงในคำค้นหา ให้ใช้เครื่องหมาย _ เช่น "รังสิมันต์_โรม"</li>
				<li>
					หากต้องการบังคับให้มติที่ค้นหา<strong>มีคำนั้น</strong> ให้ใส่เครื่องหมาย + ข้างหน้าคำค้นหา
					เช่น "ไม่ไว้วางใจ +ประยุทธ์"
				</li>
				<li>
					หากต้องการบังคับให้มติที่ค้นหา<strong>ไม่มีคำนั้น</strong> ให้ใส่เครื่องหมาย - ข้างหน้าคำค้นหา
					เช่น "ไม่ไว้วางใจ -ประวิทย์"
				</li>
				<li>
					คำค้นหาที่ไม่มีเครื่องหมาย + หรือ - จะต้องปรากฏในมติอย่างน้อย 1 ครั้ง<strong
						>จากทุกคำ</strong
					>
					เช่น "ไม่ไว้วางใจ ชลน่าน"<br />จะต้องมีคำว่า "ไม่ไว้วางใจ" <em>หรือ</em> "ชลน่าน" (คำใดคำหนึ่ง
					หรือทั้งสองคำ) ปรากฏในมติ 1 ครั้ง
				</li>
			</ul>
		</li>
		<li>กด Mark — มติทุกอันที่ตรงตามเงื่อนไขจะมีสัญลักษณ์ <span class="hash" /> ปรากฏขึ้นมา</li>
		<li>ใช้กล่องค้นหาของเบราเซอร์ (<kbd>CTRL+F</kbd>) ค้นหาตัวอักษร <span class="hash" /></li>
	</ol>
	<form method="dialog">
		<button>ปิด</button>
	</form>
</dialog>
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
							<strong class="header">{m}</strong>
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
