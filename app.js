const { ref, computed, onMounted } = Vue

Vue.createApp({
	setup() {
		const data = ref({})

		onMounted(() => {
			fetch('all_parsed.json')
				.then((res) => res.json())
				.then((v) => {
					data.value = v.sort((a, z) => z.id - a.id)
				})
		})

		return { data }
	},
}).mount('#app')
