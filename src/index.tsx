import { StrictMode } from "react";
import { render } from "react-dom";

if (process.env.DEVELOPMENT) {
  const { getLCP, getFID, getCLS, getFCP, getTTFB } = await import(
    "web-vitals"
  );
  // eslint-disable-next-line no-console
  getLCP(console.log);
  // eslint-disable-next-line no-console
  getFID(console.log);
  // eslint-disable-next-line no-console
  getCLS(console.log);
  // eslint-disable-next-line no-console
  getFCP(console.log);
  // eslint-disable-next-line no-console
  getTTFB(console.log);
}

const root: HTMLElement | null = document.querySelector("#root");

render(<StrictMode></StrictMode>, root);
