import App, {Container} from 'next/app';
import Head from 'next/head';
import React from 'react';
import Ticker from '../components/ticker';
import stores from '../stores';
import withStores from '../utils/with-stores';

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {pageProps};
  }

  render() {
    const {Component, pageProps} = this.props;

    return (
      <Container>
        <Ticker/>
        <Head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/0.5.0/modern-normalize.min.css"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css"/>
        </Head>
        <Component {...pageProps}/>
      </Container>
    );
  }
}

export default withStores(stores)(MyApp);
