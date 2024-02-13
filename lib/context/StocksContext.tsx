import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import useFetchStocks, { StockType } from '../hooks/useFetchStocks'

interface StocksContextType {
  data: StockType[]
  loading: boolean
  error: string | undefined
  fetchData: (ticker: string) => Promise<void>
  activeStock: string | undefined
  setActiveStock: Dispatch<SetStateAction<string | undefined>>
}

const StocksContext = createContext<StocksContextType | undefined>(undefined)

interface StocksProviderProps {
  children: ReactNode
}

export const StocksProvider: React.FC<StocksProviderProps> = ({ children }) => {
  const stocks = useFetchStocks()
  const [activeStock, setActiveStock] = useState<string>()

  useEffect(() => {
    stocks.loading && setActiveStock(undefined)
  }, [stocks.loading])

  return (
    <StocksContext.Provider value={{ ...stocks, activeStock, setActiveStock }}>
      {children}
    </StocksContext.Provider>
  )
}

export const useStocks = (): StocksContextType => {
  const context = useContext(StocksContext)
  if (context === undefined) {
    throw new Error('useStocks must be used within a StocksProvider')
  }
  return context
}
