import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import AppLayout from './AppLayout'

export function generateStaticParams() {
  return routing.locales.map(lang => ({ lang }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  console.log('LocaleLayout', lang)

  // Validate that the incoming `lang` parameter is valid
  if (!routing.locales.includes(lang as any)) {
    notFound()
  }

  console.log('LocaleLayout correct')

  // Providing all messages to the client side is the simplest setup.
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AppLayout>{children}</AppLayout>
    </NextIntlClientProvider>
  )
}
