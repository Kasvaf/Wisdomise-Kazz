import ReactGA from "react-ga4";

export const gaClick = (target: string) => {
  ReactGA.event({ category: "site", action: "click", label: target });
};

export const gaLoaded = () => {
  ReactGA.send("pageview");
};
