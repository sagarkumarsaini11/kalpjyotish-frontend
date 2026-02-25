import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Astrologers", "Products", "Poojas", "Auth", "Contact", "Horoscope", "Wallet"],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (id) => `/api/auth/user/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (_result, _error, id) => [{ type: "Auth", id }],
    }),
    getUserCallHistory: builder.query({
      query: (userId) => `/api/call/history/${userId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getAstrologers: builder.query({
      query: (params) => ({
        url: "/api/astrologer/all",
        params,
      }),
      transformResponse: (response) => response?.data || [],
      providesTags: ["Astrologers"],
    }),
    getAstrologerById: builder.query({
      query: (id) => `/api/astrologer/astrologerbyId/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (_result, _error, id) => [{ type: "Astrologers", id }],
    }),
    astrologerLogin: builder.mutation({
      query: (payload) => ({
        url: "/api/astro/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Astrologers"],
    }),
    astrologerSignup: builder.mutation({
      query: (body) => ({
        url: "/api/astro/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Astrologers"],
    }),
    getProducts: builder.query({
      query: () => "/api/products/all",
      transformResponse: (response) => response?.data || [],
      providesTags: ["Products"],

    }),
    getPoojas: builder.query({
      query: () => "/api/All-poojas",
      transformResponse: (response) => response?.data || response || [],
      providesTags: ["Poojas"],
    }),
    getPoojaById: builder.query({
      query: (id) => `/api/poojas/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (_result, _error, id) => [{ type: "Poojas", id }],
    }),
    sendContactQuery: builder.mutation({
      query: (body) => ({
        url: "/api/contact/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/send-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    signupUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    getHoroscope: builder.query({
      query: ({ sign, type }) => `/horoscope/${sign}/${type}`,
      providesTags: ["Horoscope"],
    }),
    getPrivateChatHistory: builder.query({
      query: ({ userId, astrologerId }) => `/api/chat/history/${userId}/${astrologerId}`,
    }),
    getAstrologerChatThreads: builder.query({
      query: (astrologerId) => `/api/chat/astrologer/${astrologerId}/threads`,
      transformResponse: (response) => response?.data || [],
    }),
    sendPrivateChatMessage: builder.mutation({
      query: (body) => ({
        url: "/api/chat/send",
        method: "POST",
        body,
      }),
    }),
    getAstroProfile: builder.query({
      query: (id) => `/api/astro/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (_result, _error, id) => [{ type: "Astrologers", id }],
    }),
    generateAgoraToken: builder.mutation({
      query: (body) => ({
        url: "/api/agora/token",
        method: "POST",
        body,
      }),
    }),
    startCallSession: builder.mutation({
      query: (body) => ({
        url: "/api/call/start",
        method: "POST",
        body,
      }),
    }),
    updateCallSessionStatus: builder.mutation({
      query: (body) => ({
        url: "/api/call/update-status",
        method: "POST",
        body,
      }),
    }),
    getIncomingCalls: builder.query({
      query: (astroId) => `/api/call/incoming/${astroId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getWalletSummary: builder.query({
      query: (userId) => `/api/wallet/summary/${userId}`,
      transformResponse: (response) => response?.data || { walletBalance: 0, freeMinutesRemaining: 0, currency: "INR" },
      providesTags: (_result, _error, userId) => [{ type: "Wallet", id: userId }],
    }),
    createRechargeOrder: builder.mutation({
      query: (body) => ({
        url: "/api/wallet/recharge/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyRechargePayment: builder.mutation({
      query: (body) => ({
        url: "/api/wallet/recharge/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, body) => [{ type: "Wallet", id: body?.userId }],
    }),
  }),
});

export const {
  useGetAstrologersQuery,
  useGetUserProfileQuery,
  useGetUserCallHistoryQuery,
  useGetAstrologerByIdQuery,
  useAstrologerLoginMutation,
  useAstrologerSignupMutation,
  useGetProductsQuery,
  useGetPoojasQuery,
  useGetPoojaByIdQuery,
  useSendContactQueryMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useSignupUserMutation,
  useLazyGetHoroscopeQuery,
  useGetPrivateChatHistoryQuery,
  useGetAstrologerChatThreadsQuery,
  useSendPrivateChatMessageMutation,
  useGetAstroProfileQuery,
  useGenerateAgoraTokenMutation,
  useStartCallSessionMutation,
  useUpdateCallSessionStatusMutation,
  useGetIncomingCallsQuery,
  useGetWalletSummaryQuery,
  useCreateRechargeOrderMutation,
  useVerifyRechargePaymentMutation,
} = backendApi;
