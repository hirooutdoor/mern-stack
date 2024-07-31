import { useAppSelector } from '../app/store';

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const { theme } = useAppSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white dark:bg-[rgb(16,23,42)] text-gray-700 dark:text-gray-200 min-h-screen">
        {children}
      </div>
    </div>
  );
};
