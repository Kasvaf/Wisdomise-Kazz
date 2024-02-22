import { type PropsWithChildren } from 'react';
import styles from './style.module.css';

interface Props {
  isLoading?: boolean;
}
export const LoadingIndicator: React.FC<PropsWithChildren<Props>> = ({
  children,
  isLoading,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={styles.ldsRipple}>
      <div></div>
      <div></div>
    </div>
  );
};
