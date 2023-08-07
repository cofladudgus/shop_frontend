import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import { authApi } from '@/libs';
import { ApiResponsePageResponseUserResponsePaging } from '../../generated';

const Home = () => {
  /** 사용자 스토어 - API State **/
  const [paging, setPaging] = useUserStore((s) => [s.paging, s.setPaging]);

  const { data: userData } = useQuery(
    ['/user/paging', paging.curPage],
    () =>
      authApi.get<ApiResponsePageResponseUserResponsePaging>('/user/paging', {
        params: {
          curPage: paging.curPage,
          pageRowCount: paging.pageRowCount,
          // ...filters,
        },
      }),
    {
      onSuccess: (e) => {
        console.log('data : ', e.data);
        const { resultCode, body, resultMessage } = e.data;
        if (resultCode === 200) {
          setPaging(body?.paging);
        } else {
          alert(resultMessage);
        }
      },
    },
  );

  return (
    <div className={'flex flex-col items-center justify-center min-h-screen py-2'}>
      <Head>
        <title>Create Next App</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>
      <main className={'flex flex-col items-center justify-center w-full flex-1 px-20 text-center'}>
        <h1 className={'text-6xl font-bold'}>
          Welcome to{' '}
          <a className={'text-blue-600'} href={'https://nextjs.org'}>
            Next.js!
          </a>
        </h1>
        {userData && <div>{`${userData.data?.body?.rows}`}</div>}
      </main>
    </div>
  );
};

export default Home;
