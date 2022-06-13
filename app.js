const { ref, computed, onMounted } = Vue;

Vue.createApp({
  setup() {
    const data = ref({});

    onMounted(() => {
      fetch("all_parsed.json")
        .then((res) => res.json())
        .then((v) => {
          data.value = v;
          console.log(v);
        });
    });

    return { data };
  },
}).mount("#app");
