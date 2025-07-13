import { ref, computed } from 'vue';

export function usePagination(items: any[], initialItemsPerPage = 10) {
  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);

  const totalPages = computed(() => Math.ceil(items.length / itemsPerPage.value));

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return items.slice(start, start + itemsPerPage.value);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  };
}
