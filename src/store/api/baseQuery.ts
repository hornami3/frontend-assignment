import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {RefreshTokenResponse} from './types';
import {BASE_URL, TOKEN_KEY, REFRESH_TOKEN_KEY} from '../../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/refresh-token',
          method: 'POST',
          body: {refreshToken},
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const {accessToken} = refreshResult.data as RefreshTokenResponse;
        localStorage.setItem(TOKEN_KEY, accessToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }

  return result;
};
