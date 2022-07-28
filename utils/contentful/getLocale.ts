const getLocale = (locale: string) => {
  switch (locale) {
    case "en":
      return "en-US";
    case "es":
      return "es-ES";
    default:
      return {};
  }
};

export default getLocale;
