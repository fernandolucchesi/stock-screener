import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useStocks } from '@/lib/context/StocksContext'
import { Skeleton } from './ui/skeleton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

type ChartDataType = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    tension: number
  }[]
}

type StockData = {
  data: {
    symbol: string
    historical: HistoricalData[]
  } & ApiErrorType
}

type ErrorType = { error: string }

type ApiErrorType = { 'Error Message'?: string }

type HistoricalData = {
  date: string
  close: number
}

export const StockGraph = () => {
  const { activeStock } = useStocks()
  const [chartData, setChartData] = useState<ChartDataType>()
  const [loading, setLoading] = useState(false)
  const [chartError, setChartError] = useState<string>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setChartError('')

      try {
        const response = await fetch(
          `/api/fetch-historical-data?ticker=${activeStock}`,
        )
        const data: StockData | ErrorType = await response.json()

        if (!response.ok) throw new Error((data as ErrorType).error)

        const apiError = (data as StockData).data?.['Error Message']

        if (apiError) throw new Error('Error fetching stock price: ' + apiError)

        if (Object.keys((data as StockData).data).length === 0)
          throw new Error('Stock data is not available')

        processChartData(data as StockData)
      } catch (error) {
        const message = (error as Error).message
        console.error(error)
        setChartError(message)
      } finally {
        setLoading(false)
      }
    }

    if (activeStock) {
      fetchData()
    }
  }, [activeStock, setChartError])

  const processChartData = (data: StockData) => {
    const reversedHistoricalData = [...data.data.historical].reverse()

    const labels = reversedHistoricalData.map((item: any) => {
      const date = new Date(item.date)
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`
      return formattedDate
    })
    const closePrices = reversedHistoricalData.map((item) => item.close)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Price',
          data: closePrices,
          borderColor: '#000',
          tension: 0.1,
        },
      ],
    })
  }

  return (
    activeStock && (
      <div>
        <h3 className="text-lg">{activeStock}</h3>
        {chartError ? (
          <p className="mt-2 text-sm text-red-600">{chartError}</p>
        ) : loading && !activeStock ? (
          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-row gap-4 h-[250px] md:h-[400px]">
              <Skeleton className="w-[30px]" />
              <Skeleton className="w-full" />
            </div>
            <Skeleton className="w-full h-[20px]" />
          </div>
        ) : (
          chartData && <Line data={chartData} />
        )}
      </div>
    )
  )
}
