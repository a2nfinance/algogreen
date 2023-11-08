import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <title>Algogreen - Marketplace</title>
                <meta name="title" content="Algogreen - Marketplace" />
                <meta name="description" content="A carbon offset marketplace created by A2N Finance"/>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                />
                <meta property="og:url" content="https://marketplace-algogreen.a2n.finance/"></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}