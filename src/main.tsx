import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./lib/ErrorBoundary.tsx";
import { GlobalStyles } from "./styles/GlobalStyles";

console.log(
  "%cmidi",
  `
      display: block;
      font-family: 'Arial';
      font-size: 30px;
      text-align: center;
      color: black; background: #89CC04;
      padding: 30px;
      transform: scale(11);
     `,
);

console.log("Questions? Concerns? Chit-chat? Email me at james@jameslewis.io");

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <GlobalStyles />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
