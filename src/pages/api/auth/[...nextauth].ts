import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ApiResponseLoginResponse } from '../../../../generated';
import { ISessionUser } from '@/types/next-auth';
import { publicApi } from '../../../libs';
import dayjs from 'dayjs';
import axios from 'axios';
import { appStoreContext } from '@/stores';

let refreshCount = 0;
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
const env = process.env.NEXT_PUBLIC_APP_ENV;

const options: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    // maxAge(seconds) = 2시간 (만료)
    maxAge: 1 * 60 * 60 * 2,
    // updateAge(seconds) = 30분 (갱신)
    updateAge: 1 * 60 * 30,
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        loginId: {
          type: 'text',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (credentials) {
          const { loginId, password } = credentials;
          const { data } = await publicApi.post<ApiResponseLoginResponse>('/auth/login', {
            loginId,
            password,
          });
          const { body } = data;
          const user = body?.user;
          const token = body?.token;
          if (user && token) {
            appStoreContext.setState({
              session: {
                user: {
                  ...user,
                  token,
                } as any,
                token,
                expires: token.accessTokenExpireDate!,
              },
            });
          }
          return {
            ...user,
            token,
            refreshCount,
          } as ISessionUser & {
            id: any;
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt(params) {
      const currentUser = params.user || params.token.user;
      if (currentUser) {
        // access token 만료시간 체크 (PROD, DEV: 30분 이하, LOCAL: 10분 이하)
        const seconds = env === 'local' ? 9999999 : 1800;
        const accessTokenExpired =
          new Date(currentUser.token.accessTokenExpireDate!) <=
          dayjs().add(seconds, 'seconds').toDate();
        if (!accessTokenExpired) {
          params.token.user = currentUser as any;
          return params.token;
        }
        try {
          // access token 만료 30분전이라면 refresh token으로 토큰 재발급
          // refresh token 만료시간 이전이면
          if (new Date(currentUser.token.refreshTokenExpireDate!) > dayjs().toDate()) {
            if (currentUser.token.accessToken) {
              const { data } = await axios.get(`${baseURL}/auth/refresh`, {
                headers: {
                  Authorization: `Bearer ${currentUser.token.accessToken}`,
                },
              });
              const { body, resultCode, resultMessage } = data;
              if (resultCode === 200) {
                refreshCount++;
                Object.assign(params.token, {
                  user: {
                    ...params.user,
                    ...currentUser,
                    token: body,
                    refreshCount,
                  },
                });
              } else {
                Object.assign(params.token, {
                  user: null,
                  error: resultMessage || '토큰 재발급 실패했습니다.',
                });
              }
            }
          } else {
            // refresh token 만료된 경우
            Object.assign(params.token, {
              user: null,
              error: '토큰이 만료되었습니다. 다시 로그인해 주세요.',
            });
          }
        } catch (err) {
          Object.assign(params, {
            token: {
              user: null,
              error: err,
            },
          });
        }
      }
      return params.token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      } else {
        const errorMsg = (token as any)?.error || '토큰이 존재하지 않습니다.';
        return {
          error: errorMsg,
        } as any;
      }
      return session;
    },
  },
};

export default NextAuth(options);
