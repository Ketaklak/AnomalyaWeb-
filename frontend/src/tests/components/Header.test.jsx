import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock du contexte d'authentification
const mockAuthContext = {
  isAuthenticated: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
  isAdmin: false,
  isClient: false
};

// Composant wrapper pour les tests
const TestWrapper = ({ children, authValue = mockAuthContext }) => (
  <BrowserRouter>
    <AuthProvider value={authValue}>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation links', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Actualités')).toBeInTheDocument();
    expect(screen.getByText('Compétences')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Devis Gratuit')).toBeInTheDocument();
  });

  test('shows user info when authenticated as admin', () => {
    const authenticatedAdminContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { name: 'Admin User', role: 'admin' },
      isAdmin: true
    };

    render(
      <TestWrapper authValue={authenticatedAdminContext}>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Administrateur')).toBeInTheDocument();
  });

  test('shows user info when authenticated as client', () => {
    const authenticatedClientContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { 
        name: 'Client User', 
        role: 'client_standard',
        loyalty_points: 150,
        loyalty_tier: 'silver'
      },
      isClient: true
    };

    render(
      <TestWrapper authValue={authenticatedClientContext}>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Client User')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('150 pts')).toBeInTheDocument();
  });

  test('opens mobile menu on click', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Vérifier que le menu mobile s'ouvre
    const mobileNav = screen.getByRole('navigation');
    expect(mobileNav).toHaveClass('mobile-menu-open');
  });

  test('closes mobile menu when navigation link is clicked', async () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Cliquer sur un lien de navigation
    const servicesLink = screen.getByText('Services');
    fireEvent.click(servicesLink);
    
    // Le menu devrait se fermer
    await waitFor(() => {
      const mobileNav = screen.getByRole('navigation');
      expect(mobileNav).not.toHaveClass('mobile-menu-open');
    });
  });

  test('handles logout correctly', async () => {
    const logoutMock = jest.fn();
    const authenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { name: 'Test User', role: 'admin' },
      logout: logoutMock,
      isAdmin: true
    };

    render(
      <TestWrapper authValue={authenticatedContext}>
        <Header />
      </TestWrapper>
    );
    
    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);
    
    expect(logoutMock).toHaveBeenCalled();
  });

  test('shows admin navigation when user is admin', () => {
    const adminContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { name: 'Admin User', role: 'admin' },
      isAdmin: true
    };

    render(
      <TestWrapper authValue={adminContext}>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('shows client navigation when user is client', () => {
    const clientContext = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { 
        name: 'Client User', 
        role: 'client_standard',
        loyalty_points: 100
      },
      isClient: true
    };

    render(
      <TestWrapper authValue={clientContext}>
        <Header />
      </TestWrapper>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('displays correct loyalty tier colors', () => {
    const tiers = [
      { tier: 'bronze', color: 'text-amber-600' },
      { tier: 'silver', color: 'text-gray-400' },
      { tier: 'gold', color: 'text-yellow-500' },
      { tier: 'platinum', color: 'text-purple-400' }
    ];

    tiers.forEach(({ tier, color }) => {
      const clientContext = {
        ...mockAuthContext,
        isAuthenticated: true,
        user: { 
          name: 'Client User', 
          role: 'client_standard',
          loyalty_tier: tier,
          loyalty_points: 100
        },
        isClient: true
      };

      const { unmount } = render(
        <TestWrapper authValue={clientContext}>
          <Header />
        </TestWrapper>
      );
      
      const tierElement = screen.getByText(tier.charAt(0).toUpperCase() + tier.slice(1));
      expect(tierElement).toHaveClass(color);
      
      unmount();
    });
  });

  test('responsive design classes are applied', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'w-full', 'z-50');
    
    const container = header.querySelector('.container');
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
  });
});