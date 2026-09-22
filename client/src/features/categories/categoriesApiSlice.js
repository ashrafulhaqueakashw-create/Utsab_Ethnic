import { apiSlice } from '../api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
