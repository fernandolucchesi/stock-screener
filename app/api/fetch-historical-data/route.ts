import { NextResponse } from 'next/server'

const API_URL = 'https://financialmodelingprep.com/api/v3'
const API_KEY = process.env.FINANCIAL_MODELING_PREP_API_KEY

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const ticker = searchParams.get('ticker')

  if (!ticker) {
    return NextResponse.json(
      { error: 'Server error: Invalid or missing ticker parameter' },
      { status: 400 },
    )
  }

  // Function to format a Date object as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => date.toISOString().split('T')[0]

  const toDate = new Date()
  const fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000) // Subtract 30 days
  const toDateString = formatDate(toDate)
  const fromDateString = formatDate(fromDate)

  const url = `${API_URL}/historical-price-full/${ticker}?from=${fromDateString}&to=${toDateString}&apikey=${API_KEY}`

  try {
    const result = await fetch(url)
    if (result.ok) {
      const data = await result.json()
      return NextResponse.json({ data })
    } else {
      return NextResponse.json(
        { error: `API error: ${result.statusText}` },
        { status: result.status },
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Unknown server error: ${error}` },
      { status: 400 },
    )
  }
}
