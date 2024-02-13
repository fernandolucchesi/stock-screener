import { NextResponse } from 'next/server'

const API_URL = 'https://financialmodelingprep.com/api/v3'
const API_KEY = process.env.FINANCIAL_MODELING_PREP_API_KEY

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const ticker = searchParams.get('ticker')
  const url = `${API_URL}/quote/${ticker}?apikey=${API_KEY}`

  if (!ticker) {
    return NextResponse.json(
      { error: 'Server error: Invalid or missing ticker parameter' },
      { status: 400 },
    )
  }

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
