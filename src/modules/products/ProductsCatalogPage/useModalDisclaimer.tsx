import useConfirm from 'shared/useConfirm';

const useModalDisclaimer = () => {
  return useConfirm({
    yesTitle: 'Accept',
    noTitle: 'Cancel',
    icon: null,
    message: (
      <div className="">
        <h1 className="mb-6 text-center text-[#F1AA40]">Attention</h1>
        <div className="h-[14rem] overflow-auto text-white">
          <p className="mb-2">
            Your wallet will be opened on Binance. Wisdomise (Switzerland) AG
            itself does not provide any wallet and / or custody services. Please
            note that the cryptocurrencies you transfer to this wallet will be
            stored on Binance. Binance is a third party crypto exchange provider
            that is not regulated in Switzerland. Hence, there are risks
            associated with holding a wallet on Binance. The risks associated
            with Binance cannot be controlled by Wisdomise (Switzerland) AG.
            Such risks may include but are not limited to:
          </p>

          <ul className="mb-2 list-inside list-disc pl-2">
            <li>bankruptcy of Binance;</li>
            <li>
              unauthorized access to the wallet held on Binance by third parties
              due to a hacker attack or similar event;
            </li>
            <li>
              prohibition of the operation of its business by a public
              authority.
            </li>
          </ul>

          <p>
            These risks include the risk of significant or total loss of the
            cryptocurrencies transferred to the wallet on Binance. By creating a
            wallet to use Wisdomise’s services, you agree to bear all risks
            associated with holding the cryptocurrencies in a wallet on Binance.
            Wisdomise (Switzerland) AG accepts no liability whatsoever for any
            damage incurred in connection with holding the cryptocurrencies in a
            wallet on Binance.
          </p>
        </div>
      </div>
    ),
  });
};

export default useModalDisclaimer;
