import { StrictMode } from "react";
import { render } from "react-dom";

if (process.env.DEVELOPMENT) {
  const { getLCP, getFID, getCLS, getFCP, getTTFB } = await import(
    "web-vitals"
  );
  getLCP(console.log);
  getFID(console.log);
  getCLS(console.log);
  getFCP(console.log);
  getTTFB(console.log);
}

const root: HTMLElement | null = document.querySelector("#root");

render(<StrictMode></StrictMode>, root);
