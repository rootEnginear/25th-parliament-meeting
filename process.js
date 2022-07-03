const fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const raw_data = require('./all_raw.json')

const process = () => {
	let data = []
	for (entry in raw_data) {
		const { document } = new JSDOM(raw_data[entry]).window

		/*
    สิ่งที่หา:
    1. ชุดเท่าไร ปีไหน สมัยไหน — อยู่ที่ `table > tbody > tr:nth-child(2)`
    2. ครั้งที่ วันที่ เวลา — อยู่ที่ `table > tbody > tr:nth-child(3)`
    3. เรื่องที่พิจารณา — อยู่ที่ `#mydetail > td`[0].children -> map(innerText) // ใช้ innertext เพราะจะเอา \n
    4. ใบประมวลผลการลงมติ — อยู่ที่ `#mydetail_o > td > ul > li > a[target]`
    5. ข้อมูลการประชุม — อยู่ที่ `table > tbody > tr > td > a[target]`

    Note:
    - ลิงก์ที่มี target คือ ลิงก์ที่กดไปดูไฟล์ได้
    - อย่าลืมปรับ domain ของลิงก์ด้วย โดยการ "https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/" + href
  */
		const category = document.querySelector('table > tbody > tr:nth-child(2)').textContent.trim()
		const no = document.querySelector('table > tbody > tr:nth-child(3)').textContent.trim()
		const title = [...document.querySelectorAll('#mydetail > td:first-of-type > *')]
			.map((el) => el.textContent.trim())
			.filter((el) => el.length > 0)
		const score_summary_docs = [...document.querySelectorAll('#mydetail_o > td > ul > li')].map(
			(el) => {
				const hasLink = el.querySelector('a[target]')
				if (hasLink)
					return [
						hasLink.textContent.trim(),
						(
							'https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/' +
							hasLink.href.replace('../parliament_report/', '')
						).trim(),
					]
				return el.textContent.trim()
			}
		)
		const meeting_docs = [...document.querySelectorAll('table > tbody > tr > td > a[target]')].map(
			(el) => [
				el.textContent.trim(),
				('https://msbis.parliament.go.th/ewtadmin/ewt/parliament_report/' + el.href).trim(),
			]
		)

		data.push({
			id: entry,
			category,
			no,
			title,
			score_summary_docs,
			meeting_docs,
		})
	}

	formatted_data = JSON.stringify(
		JSON.parse(
			JSON.stringify(data)
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
		),
		null,
		2
	)

	fs.writeFileSync('all_parsed.json', formatted_data)
}
process()
