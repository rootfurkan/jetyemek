import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute — Kimlik doğrulama ve rol bazlı erişim kontrolü
 *
 * @param {string} allowedRole - İzin verilen kullanıcı rolü: 'customer' | 'restaurant' | 'admin'
 * @param {boolean} requireAuth - true ise giriş yapılmamışsa login'e yönlendir
 * @param {React.ReactNode} children - Korunan içerik
 */
export default function ProtectedRoute({ allowedRole, requireAuth = false, children }) {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const location = useLocation();

  // Giriş yapılmamışsa:
  if (!isAuthenticated) {
    // Müşteri rotaları ziyaretçiye açık (requireAuth=false), ancak
    // requireAuth=true ise (örn: siparişlerim) → login'e yönlendir
    if (requireAuth) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    // Restoran ve Admin rotaları her zaman auth gerektirir
    if (allowedRole && allowedRole !== 'customer') {
      return <Navigate to="/login" replace />;
    }
    // Müşteri paneli ziyaretçiye açık
    return children;
  }

  // Yanlış rol ile erişim denemesinde kendi paneline yönlendir
  if (allowedRole && userRole !== allowedRole) {
    const redirectMap = {
      customer: '/',
      restaurant: '/restaurant',
      admin: '/admin',
    };
    return <Navigate to={redirectMap[userRole] || '/login'} replace />;
  }

  return children;
}
