'use client'

import { useState } from 'react'

type StockWithoutPriceType = {
  symbol: string
  name: string
}

type PriceType = {
  price?: string
  change?: string
  changesPercentage?: string
}

export type StockType = StockWithoutPriceType & PriceType

type ErrorType = { error: string }

type ApiErrorType = { 'Error Message'?: string }

type FetchStocksDataType = { data: StockWithoutPriceType[] & ApiErrorType }

type FetchStockPriceDataType = { data: PriceType[] & ApiErrorType }

export default function useFetchStocks() {
  const [data, setData] = useState<StockType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function fetchStocksPrices(
    stocks: StockWithoutPriceType[],
  ): Promise<StockType[]> {
    const promises = stocks.map(async (stock) => {
      const response = await fetch(
        `/api/fetch-stock-price?ticker=${stock.symbol}`,
      )
      const data: FetchStockPriceDataType | ErrorType = await response.json()

      const apiError = (data as FetchStockPriceDataType).data?.['Error Message']

      if (apiError) throw new Error('Error fetching stock price: ' + apiError)

      if (!response.ok) {
        console.error(
          `Error fetching stock ${stock.symbol} price: ${
            (data as ErrorType).error
          }`,
        )
        return {
          ...stock,
          price: undefined,
          change: undefined,
          changesPercentage: undefined,
        }
      }

      const stockWithPrice = (data as FetchStockPriceDataType).data[0]
      return {
        ...stock,
        price: stockWithPrice.price,
        change: stockWithPrice.change,
        changesPercentage: stockWithPrice.changesPercentage,
      }
    })

    return Promise.all(promises)
  }

  const fetchData = async (ticker: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const response = await fetch(`/api/fetch-stocks?ticker=${ticker}`)
      const data: FetchStocksDataType | ErrorType = await response.json()

      if (!response.ok) throw new Error((data as ErrorType).error)

      // API returns 200 when API KEY is wrong
      const apiError = (data as FetchStocksDataType).data?.['Error Message']

      if (apiError) throw new Error('Error fetching stocks: ' + apiError)

      const stocks = await fetchStocksPrices((data as FetchStocksDataType).data)

      setData(stocks)
    } catch (error) {
      const message = (error as Error).message
      console.error(error)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}
