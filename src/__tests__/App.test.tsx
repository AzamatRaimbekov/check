import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock React Router
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    
    // App should render without throwing an error
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
