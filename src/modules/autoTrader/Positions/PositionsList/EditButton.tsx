import { bxEditAlt } from 'boxicons-quasar';
import useTraderDrawer from 'modules/autoTrader/BuySellTrader/useTraderDrawer';
import { useNavigate } from 'react-router-dom';
import { isPositionUpdatable, type Position } from 'services/rest';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';

const EditButton: React.FC<{ position: Position }> = ({ position }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  if (!isPositionUpdatable(position)) return null;
  if (position.mode && position.mode !== 'buy_and_sell') return null;

  return (
    <Button
      className="!p-0 !text-xs ms-auto text-v1-content-link"
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
      variant="link"
    >
      <Icon name={bxEditAlt} size={16} />
      Edit
      {!isMobile && TraderDrawer}
    </Button>
  );
};

export default EditButton;
