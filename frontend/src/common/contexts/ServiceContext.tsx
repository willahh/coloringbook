// ServiceContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { BookDataService } from '@/services/book-data.service';
import { BookExportService } from '@/services/book-export.service';

// Définir le type des services
interface Services {
  bookDataService: BookDataService;
  bookExportService: BookExportService;
}

// Créer le contexte
const ServiceContext = createContext<Services | undefined>(undefined);

// Provider pour injecter les services
export const ServiceProvider = ({
  children,
  services,
}: {
  children: ReactNode;
  services: Services;
}) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

// Hook pour accéder aux services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
