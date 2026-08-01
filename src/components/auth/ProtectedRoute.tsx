import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppPerm } from '../../utils/permissions';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
  requireCampo?: boolean;
  requireGuest?: boolean;
  requirePerm?: AppPerm;
  redirectCampoTo?: string;
};

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireCampo = false,
  requireGuest = false,
  requirePerm,
  redirectCampoTo,
}: ProtectedRouteProps) => {
  const { isAdmin, isCampo, isAloneCampo, isAuthenticated, can, token } = useAuth();

  if (requireGuest) {
    if (token && isCampo) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (redirectCampoTo && isAloneCampo) {
    return <Navigate to={redirectCampoTo} replace />;
  }

  if (requirePerm && !can(requirePerm)) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireCampo && !isCampo) {
    return <Navigate to="/login" replace />;
  }

  if (!requireCampo && !requireAdmin && !requirePerm && !isAuthenticated && !isAloneCampo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
