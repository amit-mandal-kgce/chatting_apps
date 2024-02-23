import Dashboard from "./modules/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import From from "./modules/From";


const ProtectedRoute = ({children, auth=false})=>{
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  
  if(!isLoggedIn && auth) {
    return <Navigate to={'/users/sign_in'}/>
  } else if(isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }

  return children;
}
function App() {
  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute auth={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/sign_in"
          element={
            <ProtectedRoute>
              <From isSignInPage={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/sign_up"
          element={
            <ProtectedRoute>
              <From isSignInPage={false} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
