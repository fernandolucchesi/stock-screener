'use client'

import React from 'react'
import { StockSearchInput } from './StockSearchInput'
import StockTable from './StockTable'
import { StocksProvider } from '@/lib/context/StocksContext'
import { StockGraph } from './StockGraph'

export const StockPage = () => {
  return (
    <StocksProvider>
      <div className="w-full md:w-96 mx-auto">
        <StockSearchInput />
      </div>
      <StockTable />
      <StockGraph />
    </StocksProvider>
  )
}
