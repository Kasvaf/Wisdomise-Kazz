import { bxRightArrowAlt } from 'boxicons-quasar';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import usePositionDetailModal, { type PositionDetails } from '.';

const BtnMultiTpSl: React.FC<{
  position?: PositionDetails | null;
  label?: string;
  className?: string;
}> = ({ position: p, label, className }) => {
  const [PositionDetailModal, showPositionDetailModal] =
    usePositionDetailModal(p);

  if (
    // reverse condition used for when number is NaN
    !(
      Number(p?.manager?.take_profit?.length) > 1 ||
      Number(p?.manager?.stop_loss?.length) > 1
    )
  )
    return null;

  return (
    <div className={className}>
      {PositionDetailModal}
      <Button
        variant="alternative"
        className="!px-2 !py-0 text-xxs"
        onClick={showPositionDetailModal}
      >
        {label ?? 'Multi TP/SL'}
        <Icon name={bxRightArrowAlt} size={16} />
      </Button>
    </div>
  );
};

export default BtnMultiTpSl;
