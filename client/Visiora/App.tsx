import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { OrderItems } from './pages/OrderItems';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Funnel } from './pages/Funnel';
import { Fulfillment } from './pages/Fulfillment';
import { AbandonedCarts } from './pages/AbandonedCarts';
import { WebsiteTraffic } from './pages/WebsiteTraffic';
import { DiscountCodes } from './pages/DiscountCodes';

// Placeholder Components for routes not yet fully implemented
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
    <div className="text-muted-foreground mb-4">
      <svg className="w-16 h-16 mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
      </svg>
    </div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground max-w-md">
      This page is under development. It will feature detailed analytics and management tools for {title.toLowerCase()}.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-items" element={<OrderItems />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/fulfillment" element={<Fulfillment />} />
          <Route path="/abandoned-carts" element={<AbandonedCarts />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/traffic" element={<WebsiteTraffic />} />
          <Route path="/discounts" element={<DiscountCodes />} />
          
          <Route path="/settings" element={<Placeholder title="Settings" />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;