import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { QueryClient, QueryClientProvider, QueryCache, Hydrate } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/stores';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onSuccess: async (e: any) => {
            //
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: 'always',
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} /> : ''}
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session} refetchOnWindowFocus={true} refetchInterval={60}>
          <AppProvider>
            <Layout>
              <Component {...pageProps} />;
            </Layout>
          </AppProvider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
