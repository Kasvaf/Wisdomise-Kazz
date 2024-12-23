import { ReactComponent as SupportIcon } from './support.svg';

const FabSupport = () => {
  return (
    <a
      href="#"
      target="_blank"
      className="fixed bottom-20 right-6 z-20 rounded-full bg-v1-background-selected p-3"
    >
      <SupportIcon />
    </a>
  );
};

export default FabSupport;
