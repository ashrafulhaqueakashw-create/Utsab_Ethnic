import { apiSlice } from '../api/apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => '/settings/banners',
      providesTags: ['Settings'],
    }),
    getDeliveryFees: builder.query({
      query: () => '/settings/delivery-fees',
      providesTags: ['Settings'],
    }),
  }),
});

export const { useGetBannersQuery, useGetDeliveryFeesQuery } = settingsApiSlice;
