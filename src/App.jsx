import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardList from "./components/CardList";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header/Header";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import Checkout from "./components/Checkout";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<CardList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
