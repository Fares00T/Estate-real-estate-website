import Home from "./routes/homePage/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/ListPage";
import { Layout, RequireAdmin, RequireAuth } from "./routes/layout/Layout";
import ListDetails from "./routes/listDetails/ListDetails";
import Profile from "./routes/profile/Profile";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import NewPostPage from "./routes/newPostPage/newPostPage";
import ProfileUpdatePage from "./routes/profileupdate/profileUpdate";
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./components/lib/loaders";
import AdminPage from "./routes/Admin/Admin";
import EditPost from "./routes/editpost/EditPost";
import AgencyApplicationForm from "./routes/agencyForm/agencyForm";
import AgenciesPage from "./routes/agenciesPage/agencies";
import ReportPage from "./routes/report/report";
import AgencyDashboard from "./routes/agencyDashboard/agencyDashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/agencies",
          element: <AgenciesPage />,
        },
        {
          path: "/report",
          element: <ReportPage />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id", // => /:id
          element: <ListDetails />,
          loader: singlePageLoader,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
          loader: profilePageLoader,
        },
        {
          path: "/agency",
          element: <AgencyApplicationForm />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/edit-post/:id",
          element: <EditPost />,
        },
        {
          path: "/agency-dashboard",
          element: <AgencyDashboard currentUser={currentUser} />,
        },
      ],
    },
    {
      path: "/admin",
      element: <RequireAdmin />,
      children: [
        { path: "/admin", element: <AdminPage />, loader: listPageLoader },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
