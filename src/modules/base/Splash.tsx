import { ReactComponent as Logo } from 'assets/monogram-green.svg';
import { useEmbedView } from 'modules/embedded/useEmbedView';

const Splash = () => {
  const { isEmbeddedView } = useEmbedView();
  if (isEmbeddedView) return null;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Logo className="h-[100px] w-full animate-pulse" />
    </div>
  );
};

export default Splash;
