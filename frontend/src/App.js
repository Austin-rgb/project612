
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductData from './components/Catalog';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CartDetail from './components/CartDetail';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/login" element={Login} />
			<Route path="/cart" element={<ProtectedRoute path="/cart" component={CartDetail} />}/>
            <Route path="/" element={<ProductData/>} />
          </Routes>
      </Router>
  );
}

export default App;
