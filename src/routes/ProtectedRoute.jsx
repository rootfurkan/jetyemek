import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute — Kimlik doğrulama ve rol bazlı erişim kontrolü
 * 
 * @param {string} allowedRole - İzin verilen kullanıcı tipi: 'customer' | 'restaurant' | 'admin'
 * @param {React.ReactNode} children - Korunan içerik
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  // Giriş yapılmamışsa, hedef müşteri paneli ise misafir girişine izin ver, yoksa login'e yönlendir
  if (!isAuthenticated) {
    if (allowedRole === 'customer') {
      return children;
    }
    return <Navigate to="/login" replace />;
  }

  // Yanlış rol ile erişim denemesinde kendi paneline yönlendir
  if (allowedRole && userType !== allowedRole) {
    const redirectMap = {
      customer: '/',
      restaurant: '/restaurant',
      admin: '/admin',
    };
    return <Navigate to={redirectMap[userType] || '/login'} replace />;
  }

  return children;
}
