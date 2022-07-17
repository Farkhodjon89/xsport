import React, {useState, useEffect} from 'react';
import '../styles/globals.scss';
import {PersistGate} from 'redux-persist/integration/react';
import Router from 'next/router';
import {useStore} from 'react-redux';
import {store} from '../redux/store';
import Head from 'next/head';
import Loader from '../components/Loader/loader';

if (process.browser) {
  var hours = 6;
  var now = Date.now();
  var setupTime = localStorage.getItem('version');
  if (setupTime == null) {
    localStorage.clear();
    localStorage.setItem('version', now);
  } else if (now - setupTime > hours * 60 * 60 * 1000) {
    localStorage.clear();
    localStorage.setItem('version', now);
  }
}

function MyApp({Component, pageProps}) {
  const store = useStore();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
      <>
        <Head>
          <title>Интернет-магазин одежды и обуви для взрослых и детей | XSport</title>
          <meta
              name="description"
              content="Если вы ищите мужскую одежду, женскую одежду или одежду для детей, а также обувь для детей и взрослых, то интернет магазин XSport для вас! "
          />
          <link rel="shortcut icon" type="image/jpg" href="/Xsportfavicon.ico"/>
          {process.env.NODE_ENV === 'production' ? (
              <>
                <script
                    dangerouslySetInnerHTML={{
                      __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(87025774, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true
   });
                        `,
                    }}
                />
                <noscript
                    dangerouslySetInnerHTML={{
                      __html: `
                    <div><img src="https://mc.yandex.ru/watch/87025774" style="position:absolute; left:-9999px;" alt="" /></div>
                        `,
                    }}
                />
                <script async src='https://www.googletagmanager.com/gtag/js?id=UA-217036253-1'/>
                <script dangerouslySetInnerHTML={{__html: `
                window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag(‘js’, new Date());
                  gtag(‘config’, ‘UA-217036253-1’);
                `}}/>

              </>
          ) : null}
        </Head>
        <PersistGate persistor={store.__persistor}>
          {loading ? <Loader/> : () => <Component {...pageProps} />}
        </PersistGate>
      </>
  );
}

export default store.withRedux(MyApp);
