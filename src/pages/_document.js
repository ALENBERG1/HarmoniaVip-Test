import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* FontAwesome CSS per icone */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
          integrity="sha384-ksm3yWu6JZ8ZB03uDmMkdyKuvAz7br/Q12WxMjxCUM8SY0OnQ0CMbfq4MlZz6Lpc" 
          crossOrigin="anonymous" 
        />
        {/* Telegram WebApp JavaScript SDK */}
        <script 
          src="https://telegram.org/js/telegram-web-app.js" 
          async 
        ></script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
