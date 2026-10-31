import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function getInitialPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const onHashChange = () => setPath(getInitialPath());
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/');
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function Link({
  to,
  className,
  children,
  onClick,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
