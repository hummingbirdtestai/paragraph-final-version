export default {
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/favicon.png",
    redirects: [
      {
        source: "/(.*)",
        destination: "/index.html",
        permanent: false,
      },
    ],
  },
};
