import type { NextPage } from 'next'

import { StockPage } from '@/components/StockPage'

const Home: NextPage = () => {
  return (
    <div>
      <main className="mt-8 p-4 mx-auto max-w-4xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-center">Stock Screener</h1>
        <StockPage />
      </main>
    </div>
  )
}

export default Home
