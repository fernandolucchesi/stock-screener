import type { NextPage } from 'next'
import Head from 'next/head'

import { StockPage } from '@/components/StockPage'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Stock Searcher</title>
        <meta
          name="description"
          content="Displaying stock symbols using Next.js and Shadcn UI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-8 p-4 mx-auto max-w-4xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-center">Stock Searcher</h1>
        <StockPage />
      </main>
    </div>
  )
}

export default Home
