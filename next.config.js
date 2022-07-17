module.exports = {
  images: {
    domains: ['xsportwp.billz.work'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  async redirects() {
    return [
      {
        source: '/help',
        destination: '/help/dostavka_i_oplata',
        permanent: false,
      },
      {
        source: '/about-us',
        destination: '/o-nas',
        permanent: false,
      },
    ];
  },
};
