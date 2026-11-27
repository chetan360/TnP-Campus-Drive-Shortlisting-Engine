import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useLoaderData,
  useLocation,
  ScrollRestoration,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Flash from "./components/Flash";
import Footer from "./components/Footer";
import DriveForm from "./pages/DriveForm";
import DriveShortlist from "./pages/DriveShortlist";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import Results from "./pages/Results";
import Shortlist from "./pages/Shortlist";
import DriveCatalog from "./pages/DriveCatalog";
import Home from "./pages/Home";
import Application from "./pages/Application";
import Login from "./pages/Login";

const routes = [
  ["/", Home],
  ["/auth/login", Login],
  ["/auth/signup", Signup],
  ["/admin/dashboard", Dashboard],
  ["/drives", DriveCatalog],
  ["/drives/new", DriveForm],
  ["/drives/results", Results],
  ["/drives/:id/edit", DriveForm],
  ["/drives/:id/apply", Application],
  ["/drives/:id/shortlist", DriveShortlist],
  ["/shortlist", Shortlist],
  ["*", ErrorPage],
];

async function loadPage({ request }) {
  const response = await fetch(request.url, {
    signal: request.signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const page = await response.json();
  if (response.redirected && response.url !== request.url) {
    const url = new URL(response.url);
    throw redirect(url.pathname + url.search);
  }
  return page;
}

function validate(event) {
  const form = event.target;
  if (!form.matches("form.needs-validation")) return;
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    event.preventDefault();
    form.querySelector(":invalid")?.focus();
  }
}

function Layout({ component }) {
  const { page, data, messages, currentUser } = useLoaderData();
  const location = useLocation();
  const Page = page === "ErrorPage" ? ErrorPage : component;
  return (
    <React.Fragment key={location.key}>
      <Navbar currentUser={currentUser} />
      <main className="grow flex flex-col" onSubmit={validate}>
        <div className="page-container my-auto grow flex flex-col">
          <Flash messages={messages} />
          <Page {...data} currentUser={currentUser} />
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </React.Fragment>
  );
}

const definitions = routes.map(([path, component]) => ({
  path,
  id: path,
  loader: loadPage,
  element: <Layout component={component} />,
}));
const router = createBrowserRouter(definitions);
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
