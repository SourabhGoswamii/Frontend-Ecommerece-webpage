import { Routes, Route } from "react-router-dom";
import Home from "../Layerouts/Home";
import React from "react";

import Signup from "../Layerouts/signup";
import Cart from "../Layerouts/Cart"
import Orders from "../Layerouts/order"
import Account from "../Layerouts/Account"
import Adminauth from "../Components/adminauth";
import Admin from "../Layerouts/Admin/Adminlayerout"
import About from "../Layerouts/Aboutus.jsx"
import Contactus from "../Layerouts/Contactus.jsx"
import Privacypolicy from "../Layerouts/privacypolicy.jsx"
import Refundpolicy from "../Layerouts/refundpolict.jsx"
import Returnpolicy from "../Layerouts/returnpolicy.jsx"
import Error404 from "../Layerouts/ERRORS/ERROR404.jsx"
import Error403 from "../Layerouts/ERRORS/ERROR403.jsx"
import Login2 from "../Layerouts/login2.jsx"
import ProductDetail from "../Layerouts/productDetails.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login2 />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/cart" element={<Cart />}/>
      <Route path="/order" element={<Orders />}/>
      <Route path="/Account" element={<Account/>}/>
      <Route path="/admin" element={<Adminauth><Admin/></Adminauth>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contactus/>}/>
      <Route path="/privacy" element={<Privacypolicy/>}/>
      <Route path="/returns" element={<Returnpolicy/>}/>
      <Route path="/refunds" element={<Refundpolicy/>}/>
      <Route path="/Error403" element={<Error403/>}/>
      <Route path="/*" element={<Error404/>}/>
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
