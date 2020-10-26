import '../styles/globals.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <>
      <div className="root">
        <Component {...pageProps} />
      </div>
      
      <style jsx global>{`
        .root {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: -50px;
          min-height: 100vh;
        }
      `}</style>
    </>
  )
}

export default MyApp
