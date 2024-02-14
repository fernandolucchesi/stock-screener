'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { useStocks } from '@/lib/context/StocksContext'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

const StockTable = () => {
  const { loading, data: stocks, error, setActiveStock } = useStocks()
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    // There is probably a better way to do this...
    loading && setUserInteracted(true)
  }, [loading])

  return stocks.length > 0 || loading ? (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Change %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? [...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(5)].map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="m-0.5 flex h-[16px] rounded-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : stocks.map((stock) => (
              <TableRow
                onClick={() => setActiveStock(stock.symbol)}
                key={stock.symbol}
                className="cursor-pointer"
              >
                <TableCell>{stock.symbol}</TableCell>
                <TableCell className="max-w-52">{stock.name}</TableCell>
                <TableCell>{stock.price || '-'}</TableCell>
                <TableCell
                  className={cn(
                    parseFloat(stock.change || '') > 0 && 'text-green-600',
                    parseFloat(stock.change || '') < 0 && 'text-red-600',
                  )}
                >
                  {stock.change || '-'}
                </TableCell>
                <TableCell>{stock.changesPercentage || '-'}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  ) : (
    userInteracted && !error && <div className="mx-auto">No results found</div>
  )
}

export default StockTable
