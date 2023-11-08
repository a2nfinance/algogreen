import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <title>Algogreen - Admin</title>
                <meta name="title" content="Algogreen - Admin" />
                <meta name="description" content="Allow admins to approve DAOs, Projects, and Carbon credits."/>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                />
               <meta property="og:url" content="https://admin-algogreen.a2n.finance/"></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}