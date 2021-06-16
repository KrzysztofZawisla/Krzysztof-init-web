import { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import useErrorBoundary, { UseErrorBoundaryState } from "use-error-boundary";
import HomePage from "~root/pages/HomePage/HomePage";
import GlobalStyle from "../GlobalStyle/GlobalStyle";

const AppWrapper = (): JSX.Element => {
  const { ErrorBoundary, didCatch }: UseErrorBoundaryState = useErrorBoundary();
  return (
    <>
      <GlobalStyle />
      {didCatch ? (
        <></>
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<></>}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
};

export default AppWrapper;
