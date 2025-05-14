import { bxArrowBack } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';

const BtnBackDesktop = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex cursor-pointer select-none items-center rounded-md border border-white/10 px-1.5 text-xs hover:text-v1-content-link-hover"
      onClick={() => navigate(-1)}
    >
      <Icon name={bxArrowBack} size={12} className="mr-1" /> Go Back
    </div>
  );
};

export default BtnBackDesktop;
