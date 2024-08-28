import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import { Register } from './pages/register/Register';
import { Login } from './pages/login/Login';
import { Home } from './pages/home/Home';
import { Cars } from './pages/cars/Cars';
import { CarReg } from './pages/carReg/CarReg';
import { Forms } from './pages/forms/Forms';
import { Form } from './pages/form/Form';
import { ChangeOwner } from './pages/changeOwner/ChangeOwner';
import { UserProfile } from './pages/userProfile/UserProfile';
import { Navbar } from './components/Navbar';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {

  const {currentUser} = useContext(AuthContext);


  const Layout = () => {

  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>

  )
  }

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login"/>
    }
    return children
  }

  const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <ProtectedRoute>
        <Layout/>
      </ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/cars",
        element: <Cars/>
      },
      {
        path: "/carReg",
        element: <CarReg/>
      },
      {
        path: "/forms",
        element: <Forms/>
      },
      {
        path: "/form/:id",
        element: <Form/>
      },
      {
        path: "/changeOwner",
        element: <ChangeOwner/>
      },
      {
        path: "/userProfile",
        element: <UserProfile/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }

  ]);

  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <RouterProvider router={router}/>
      </div>
    </QueryClientProvider>
  );
}

export default App;
