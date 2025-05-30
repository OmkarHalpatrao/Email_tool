import EmailReferralTool from "@/components/email-referral-tool"
import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Email Tool</title>
        <meta name="description" content="A mobile-friendly email referral tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Email Referral Tool</h1>
          <EmailReferralTool />
        </div>
      </main>
    </>
  )
}
