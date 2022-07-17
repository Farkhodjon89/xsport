import React, { Fragment } from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";

const SITE_URL = "https://fcnshop.uz";
const SITE_NAME = "FCN";
const DEFAULT_TITLE = "Брендовая одежда и обувь в Ташкенте | FCN";
const DEFAULT_DESCRIPTION =
  "Магазин брендовой одежды и обуви от Lacoste, Tommy Hilfiger, Benetton и т.д. Более 2000 товаров, скидки до 50%. Официальный дистрибьютер в Узбекистане ✅";
const SEPARATOR = "|";

const format = (text, data) => {
  let result = text;

  for (const key of Object.keys(data)) {
    result = result.replace(`{${key}}`, data[key]);
  }

  return result;
};

const META_DATA_FOR_PAGES = {
  "/catalog/": {
    title: "Купить {categoryTitle} в Ташкенте {separator} {siteName}",
    description:
      "{categoryTitle} от мировых брендов. Более 3000 товаров. Доставка по Узбекистану. Акции и скидки. Только на {siteName}",
  },
  "/product/": {
    title: "{productTitle}, цвет: {color} ({sku}), бренд: {brand}",
    description:
      "{productTitle} от {brand}, цвет: {color}. Купить за {price} сум в Ташкенте. Ваша модная одежда и обувь на {siteName} {separator} {sku}",
  },
};

export const HeadData = ({ title, description, pageUrl, pageData }) => {
  let _pageUrl = (pageUrl || "").split("/");

  if (_pageUrl.length > 2) {
    _pageUrl[_pageUrl.length - 1] = "";
  }

  _pageUrl = _pageUrl.join("/");

  const formatText = (data, property) => {
    const additionalData = { separator: SEPARATOR, siteName: SITE_NAME };
    const textData = {
      ...pageData,
      ...additionalData,
    };

    let text = format(data[property], textData);

    for (const key of Object.keys(textData)) {
      text = text.replace(key, "").trim();
    }

    return text;
  };

  const _title =
    title ||
    (META_DATA_FOR_PAGES[_pageUrl] &&
      formatText(META_DATA_FOR_PAGES[_pageUrl], "title")) ||
    DEFAULT_TITLE;
  const _description =
    description ||
    (META_DATA_FOR_PAGES[_pageUrl] &&
      formatText(META_DATA_FOR_PAGES[_pageUrl], "description")) ||
    DEFAULT_DESCRIPTION;

  return (
    <Fragment>
      <NextSeo
        title={_title}
        description={_description}
        openGraph={{
          images: [
            {
              url:
                pageData && pageData.image
                  ? pageData.image
                  : `${process.env.PUBLIC_URL}/logo.png`,
            },
          ],
          url: SITE_URL,
          title: _title,
          site_name: SITE_NAME,
          locale: "ru_RU",
          type: "website",
          description: _description,
        }}
        twitter={{
          cardType: "summary",
          handle: "@handle",
          site: "@site",
          title: _title,
          description: _description,
        }}
      />

      <Head>
        <title>{_title}</title>

        <link rel="icon" type="image/png" sizes="32x32" href={`/favicon.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/favicon.png`} />
      </Head>
    </Fragment>
  );
};
