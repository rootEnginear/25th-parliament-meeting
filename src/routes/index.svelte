<script lang="ts">
	import 'styles/master.css';
	import data from 'data/all_parsed.json';

	const goTop = () => {
		window.scrollTo(0, 0);
	};

	const goBottom = () => {
		window.scrollTo(0, document.body.scrollHeight);
	};
</script>

<small class="instruction">
	วิธีการใช้: <kbd>CTRL+F</kbd> หาของที่อยากหาได้เลย ไม่ควรใช้ Scrollbar
</small>
{#each data as d (d.id)}
	<article itemscope itemtype="https://schema.org/Report">
		{#if d.title.length !== 0}
			<p itemprop="articleBody">{d.title.join('\n')}</p>
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
<button class="gotop" type="button" on:click={goTop}>⭱</button>
<button class="gobottom" type="button" on:click={goBottom}>⭳</button>
