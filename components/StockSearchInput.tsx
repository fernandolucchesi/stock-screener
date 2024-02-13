'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useStocks } from '@/lib/context/StocksContext'

const FormSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required'),
})

export function StockSearchInput() {
  const { loading, error, fetchData } = useStocks()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: '',
    },
  })

  const onSubmit = () => fetchData(form.getValues().ticker)

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-4"
        >
          <FormField
            control={form.control}
            name="ticker"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Search for a stock..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            Search
          </Button>
        </form>
      </Form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  )
}
