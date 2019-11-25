import React, { lazy, Suspense } from "react";

// React routing imports
import { Switch, BrowserRouter, Route } from "react-router-dom";

// Navigation component
import Header from "../components/navigation/Header";

// Custom routing guard
import PublicRouter from "../components/navigation/PublicRouter";

// 404 SVG
import NotFoundSVG from '../assets/svg/404.svg';

// Public component
const Signin = lazy(() => import("../views/auth/signin"));
const Signup = lazy(() => import("../views/auth/signup"));
const Signout = lazy(() => import("../views/auth/signout"));

// Private route
const Home = lazy(() => import("../views/home"));

// Scss Loader
const Loader = _ => (
  <div className="full-page-center ">
    <div className="ripple-loader">
      <div></div>
      <div></div>
    </div>
  </div>
);

// 404 Page
const PageNotFound = _ => (
  <div className="not-found-page" style={{ backgroundImage: `url(${NotFoundSVG})` }}>
    <h1>Page not found</h1> 
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<Loader />}>
        <Switch>
          <PublicRouter path="/sign-up" component={Signup} exact={true} />
          <PublicRouter path="/sign-in" component={Signin} exact={true} />
          <Route path="/sign-out" component={Signout} exact={true} />
          <Route path="/" component={Home} exact={true} />
          <Route component={PageNotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
