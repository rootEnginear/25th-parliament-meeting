import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const raw_data = require('./src/data/all_raw.json');

const formatString = (str) => {
	return str
		.replace(/๐/g, '0')
		.replace(/๑/g, '1')
		.replace(/๒/g, '2')
		.replace(/๓/g, '3')
		.replace(/๔/g, '4')
		.replace(/๕/g, '5')
		.replace(/๖/g, '6')
		.replace(/๗/g, '7')
		.replace(/๘/g, '8')
		.replace(/๙/g, '9')
		.replace(/\u00a0/g, ' ')
		.replace(/\u2013/g, '-')
		.replace(/\\n/g, ' ')
		.replace(/\\t/g, ' ')
		.replace(/\u201c/g, '\\"')
		.replace(/\u201d/g, '\\"')
		.replace(/\s+/g, ' ')
		.trim();
};

const process = () => {
	let data = [];
	for (let entry in raw_data) {
		const { document } = new JSDOM(raw_data[entry]).window;

		//  1. ชุดเท่าไร ปีไหน สมัยไหน — อยู่ที่ `table > tbody > tr:nth-child(2)`
		const category = formatString(
			document.querySelector('table > tbody > tr:nth-child(2)').textContent
		);

		// 2. ครั้งที่ วันที่ เวลา — อยู่ที่ `table > tbody > tr:nth-child(3)`
		const no = formatString(document.querySelector('table > tbody > tr:nth-child(3)').textContent);

		// 3. เรื่องที่พิจารณา — อยู่ที่ `#mydetail > td`[0].children -> map(innerText) // ใช้ innertext เพราะจะเอา \n
		const title = [...document.querySelectorAll('#mydetail > td:first-of-type > *')]
			.map((el) => formatString(el.textContent))
			.filter((el) => el.length > 0);

		// 4. ใบประมวลผลการลงมติ — อยู่ที่ `#mydetail_o > td > ul > li > a[target]`
		const score_summary_docs = [...document.querySelectorAll('#mydetail_o > td > ul > li')].map(
			(el) => {
				const hasLink = el.querySelector('a[target]');
				if (hasLink)
					return [
						formatString(hasLink.textContent),
						(
							'https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/' +
							hasLink.href.replace('../parliament_report/', '')
						).trim()
					];
				return formatString(el.textContent);
			}
		);

		// 5. ข้อมูลการประชุม — อยู่ที่ `table > tbody > tr > td > a[target]`
		const meeting_docs = [...document.querySelectorAll('table > tbody > tr > td > a[target]')].map(
			(el) => [
				formatString(el.textContent),
				('https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/' + el.href).trim()
			]
		);

		data.push({
			id: entry,
			category,
			no,
			title,
			score_summary_docs,
			meeting_docs
		});
	}

	data = data.sort((a, z) => z.id - a.id);

	let formatted_data = JSON.stringify(data);

	fs.writeFileSync('src/data/all_parsed.json', formatted_data);
};
process();
