import { bxEditAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { isPositionUpdatable, type Position } from 'api';
import useTraderDrawer from 'modules/autoTrader/BuySellTrader/useTraderDrawer';
import useIsMobile from 'utils/useIsMobile';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const EditButton: React.FC<{ position: Position }> = ({ position }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  if (!isPositionUpdatable(position)) return null;
  if (position.mode && position.mode !== 'buy_and_sell') return null;

  return (
    <Button
      variant="link"
      className="ms-auto !p-0 !text-xs text-v1-content-link"
      onClick={() =>
        isMobile
          ? navigate(
              `/trader/bot/${position.base_slug}?pos=${position.key}&quote=${position.quote_slug}`,
            )
          : openTraderDrawer({
              slug: position.base_slug,
              quote: position.quote_slug,
              positionKey: position.key,
            })
      }
    >
      <Icon name={bxEditAlt} size={16} />
      Edit
      {!isMobile && TraderDrawer}
    </Button>
  );
};

export default EditButton;
