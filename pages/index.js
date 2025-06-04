import Head from 'next/head';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

const ChatUI = dynamic(() => import('../components/CoinsbeatAIChat'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Coinsbeat AI Chatbot</title>
      </Head>
      <main className="min-h-screen bg-white dark:bg-black p-4">
        <ChatUI />
      </main>
    </>
  );
}
