import React from 'react';
import { Route, Switch } from 'wouter';
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/use-auth';
import { CartProvider } from './contexts/cart-context';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route>404 - Not Found</Route>
        </Switch>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
