export const state = {
  sort: {
    key: "employeeId",
    asc: true,
  },
  filters: {
    skills: [],
  },
  filterSearchTerms: {
    skills: "",
  },
  searchTerm: "",
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    lastPage: 1,
  },
  activeMenu: undefined,
};
