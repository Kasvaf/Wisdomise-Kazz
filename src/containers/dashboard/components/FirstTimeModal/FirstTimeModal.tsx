import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import Warning from '@images/warning.svg';

interface FirstTimeModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => unknown;
}

function FirstTimeModal({ showModal, setShowModal }: FirstTimeModalProps) {
  const navigate = useNavigate();

  const aknowledgeClick = () => {
    setShowModal(false);
    navigate('#');
  };
  return (
    <Modal
      wrapClassName="horos-modal"
      visible={showModal}
      closable={false}
      footer={null}
      onOk={() => setShowModal(false)}
      okText="Aknowlegde"
    >
      <div className="bg-modal p-8 text-white">
        <div className="mb-8 flex w-full flex-row justify-center">
          <img className="w-40" src={Warning} alt="warning" />
        </div>
        <p className="mb-8">
          Wisdomise AI is currently running on the Binance Spot Test Network.
          Hence, Wisdomise will operate in real-time, use real data, and access
          updated asset prices. The AI and trading features also function as
          they exactly will in a real market environment. However, the assets
          being used <strong>are not real</strong> and{' '}
          <strong>do not hold value.</strong> Additional limitations of the
          Binance testnet include:
        </p>
        <ul className="mb-8">
          <li>
            The testnet may be unavailable at times due to Binance maintenance
            checks; these interruptions cannot be avoided.
          </li>
          <li>
            The testnet is also subject to periodical resets for all orders.{' '}
            Resets will happen once per month and Binance will not notify you.
          </li>
          <li>
            There may be some crypto assets that are not being available on the
            testnet. Binance keeps updating the testnet environment to perfectly
            mimic the mainnet environment.
          </li>
        </ul>
        <button
          type="button"
          className="horos-btn w-full"
          onClick={aknowledgeClick}
        >
          Aknowledge
        </button>
      </div>
    </Modal>
  );
}

export default FirstTimeModal;
