import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import RoleManagement from './components/RoleManagement';
import UserManagement from './components/UserManagement';
import Products from './components/products/Products';
import Categories from './components/categories/Categories';
import Login from './components/Login';
import Signup from './components/Signup';
import { logout } from './redux/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;
  const canManageCategories = user?.isAdmin || user?.roles?.some(role =>
    role.permissions.includes('manage:categories')
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
  };

  const CategoryRoute = ({ children }) => {
    return isAuthenticated && (isAdmin || canManageCategories) ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              E-commerce
            </Link>
          </Typography>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/products">
                Products
              </Button>
              {(isAdmin || canManageCategories) && (
                <Button color="inherit" component={Link} to="/categories">
                  Categories
                </Button>
              )}
              {isAdmin && (
                <>
                  <Button color="inherit" component={Link} to="/roles">
                    Manage Roles
                  </Button>
                  <Button color="inherit" component={Link} to="/users">
                    Manage Users
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/" /> : <Signup />
          } />
          <Route path="/products" element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          } />
          <Route path="/categories" element={
            <CategoryRoute>
              <Categories />
            </CategoryRoute>
          } />
          <Route path="/roles" element={
            <AdminRoute>
              <RoleManagement />
            </AdminRoute>
          } />
          <Route path="/users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Navigate to="/products" />
            </PrivateRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
