/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useRef, useState } from 'react';
import { ReactComponent as CloseIcon } from '@images/close.svg';
import Modal from 'shared/Modal';
import styles from './styles.module.scss';
interface IProps {
  isOpen: boolean;
  toggle: () => void;
  onCheck: () => void;
}

export default function DisclosureDialog({ isOpen, toggle, onCheck }: IProps) {
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollableRef.current == null) return;

    const { clientHeight, scrollTop, scrollHeight } = scrollableRef.current;
    if (scrollTop + clientHeight + 300 > scrollHeight) {
      setScrolledToEnd(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <Modal className={styles.modal} onClose={toggle}>
      <div className={styles.modalHeader}>
        Cryptocurrency Risk Disclosure
        <CloseIcon className="cursor-pointer fill-white" onClick={toggle} />
      </div>
      <div
        className={styles.modalBody}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        <p>
          This Cryptocurrency Risk Disclosure provides a description of certain
          risks associated with the Services and Cryptocurrencies. However, it
          DOES NOT DISCLOSE OR EXPLAIN ALL THE RISKS INVOLVED IN THE INVESTMENT
          IN CRYPTOCURRENCIES AND/OR THE USE OF THE SERVICES. There may be
          additional risks that are not foreseen or mentioned in the Service
          Providing Agreement or in this Cryptocurrencies Risk Disclosure.
        </p>
        <p>
          <strong>
            THE SERVICE PROVIDER STRONGLY RECOMMENDS THAT THE CLIENT SEEKS
            PROFESSIONAL ADVICE BEFORE DECIDING TO USE THE SOFTWARE.
          </strong>
        </p>
        <br />
        <ol style={{ marginLeft: '2rem' }}>
          <li>
            <strong>1. Incorporation by reference</strong>
            <ul>
              <li>
                1.1. All risk disclosures and similar disclaimers set out in the
                Terms and Conditions and/or the Service Providing Agreement are
                incorporated herein by reference.
              </li>
              <li>
                1.2. Capitalized terms used in this Cryptocurrency Risk
                Disclosure and not otherwise defined shall have the meaning
                ascribed to them in the Service Providing Agreement and in the
                Terms and Conditions.
              </li>
              <li>
                1.3. For ease of reading, the masculine form refers to any
                gender.
              </li>
            </ul>
          </li>
        </ol>
        <p>&nbsp;</p>
        <ol start={2} style={{ marginLeft: '2rem' }}>
          <li>
            <strong>2. Risk profile of Cryptocurrencies</strong>
            <ul>
              <li>
                2.1. Various financial and nonfinancial rights, claims and/or
                assets, including rights and obligations not usually found in
                (traditional) financial markets instruments, e.g., equity and
                fixed income securities, may be granted by Cryptocurrencies.{' '}
                <strong>
                  Clients intending to purchase Cryptocurrencies must carefully
                  review the rights and obligations granted by the
                  Cryptocurrencies before making any decisions.
                </strong>
              </li>
              <li>
                2.2. Cryptocurrencies usually serve as means of payment.
                Therefore, the fair value of Cryptocurrencies may be very
                difficult to assess and may ultimately turn out to be much lower
                than expected.
              </li>
              <li>
                2.3. The value of the Cryptocurrencies is primarily derived from
                the rights embodied therein. As the Client may not be able to
                exercise these rights, the Client may potentially derive very
                little benefits from the Cryptocurrencies as long as the Client
                holds such Cryptocurrencies through a centralized exchange. In
                particular, the Client may not be able to take advantage of
                opportunities, e.g. to redeem the Cryptocurrencies and/or to pay
                for products and/or services offered by the Issuer or third
                parties.
              </li>
              <li>
                2.4. Furthermore, the technical functionalities of
                Cryptocurrencies (e.g., the possibility to transfer them, to
                create new Cryptocurrencies, the number of decimals up to which
                a Cryptocurrency may be traded, etc.) depend, inter alia, on the
                distributed ledger technology on which the cryptocurrency is
                based. A blockchain is essentially a digital ledger of
                transactions that is duplicated and distributed across the
                entire network of computer systems on the blockchain. The Client
                should review and ensure that he understands how the relevant
                Cryptocurrency and blockchain works before using the Services of
                the Service Provider.
              </li>
              <li>
                2.5. There is no guarantee that the distributed ledger network
                on which the Cryptocurrency is based, are bug- free and will
                function in accordance with the Clients&rsquo; expectations.
              </li>
            </ul>
          </li>
        </ol>
        <p>
          <strong>&nbsp;</strong>
        </p>
        <ol style={{ marginLeft: '2rem' }} start={3}>
          <li>
            <strong>
              3. Legal and regulatory uncertainty; Bankruptcy treatment
            </strong>
            <ul>
              <li>
                3.1. Cryptocurrencies have only existed for a few years and
                various regulatory bodies in Switzerland and worldwide have
                formed or are in the process of forming an opinion on necessary
                legal or regulatory measures in relation to Cryptocurrencies
                (e.g., regulation regarding money laundering, taxation, consumer
                protection, publicity requirements or capital controls, as well
                as the civil law characterization of Cryptocurrencies). Any
                forthcoming legal or regulatory measures may result in the
                illegality of Cryptocurrencies or the imposition of controls on
                the sale and/or purchase of Cryptocurrencies in (and thus
                illiquidity of) some or all of the Cryptocurrencies. In
                addition, control mechanisms may significantly increase
                transaction costs of Cryptocurrencies.{' '}
                <strong>
                  By using the Services, the Client bears the risk of
                  uncertainty regarding to the legal, regulatory and tax
                  treatment of Cryptocurrencies.
                </strong>
              </li>
            </ul>
          </li>
        </ol>
        <p>&nbsp;</p>
        <ol start={4} style={{ marginLeft: '2rem' }}>
          <li>
            <strong>
              4. Valuation issues; volatility; no or limited liquidity
            </strong>
            <ul>
              <li>
                4.1. The value of Cryptocurrencies may change significantly
                (even within a day) and the price movements of the
                Cryptocurrencies may be unpredictable.
              </li>
              <li>
                4.2. While the volatility of the value of Cryptocurrencies is
                (perceived as) high, changes and advances in technology, fraud,
                theft and cyberattacks and regulatory changes, among others, may
                further increase volatility&ndash; and thus the potential for
                investment gains and losses. Additionally, Cryptocurrencies do
                not have the historical track record of other currencies or
                commodities, like gold, which could provide insight in whether
                current volatility levels are typical or atypical.
              </li>
              <li>
                4.3. Investments in Cryptocurrencies are considered{' '}
                <strong>highly speculative </strong> Cryptocurrencies are
                subject to <strong>high volatility</strong>, i.e. the price of
                Cryptocurrencies may fall as well as rise rapidly on any given
                day. The movements of Cryptocurrencies are unpredictable. The
                Client acknowledges that Cryptocurrencies are not supervised by
                authorities or institutions such as central banks and that,
                therefore, there is no authority or institution that can
                intervene to stabilize the value of Cryptocurrencies and/or
                prevent or mitigate irrational price movements.{' '}
                <strong>
                  There is a risk of significant or total loss when purchasing
                  or selling Cryptocurrencies. The Client acknowledges and
                  agrees that he accesses and uses the Services at his own risk.{' '}
                </strong>
              </li>
              <li>
                4.4. Investments in Cryptocurrencies are vulnerable to
                irrational bubbles or loss of confidence, that could cause
                demand to collapse relative to supply, e.g. due to unexpected
                changes imposed by the software developers or others, a
                government crackdown, the creation of superior competing
                alternative Cryptocurrencies, or a spiral of deflation or
                inflation. Trust might also collapse due to technical problems,
                for example if significant amounts of Cryptocurrencies are lost
                or stolen or if hackers or governments are able to prevent
                transactions from being settled.
              </li>
              <li>
                4.5.{' '}
                <strong>
                  The market for the relevant Cryptocurrencies may experience
                  periods of lower liquidity or even periods of illiquidity.{' '}
                </strong>
                The prices for the purchase or sale Cryptocurrencies are
                determined by the centralized exchange the Client trades its
                Cryptocurrencies. The Service Provider has no influence on the
                pricing of Cryptocurrencies. In addition, lower liquidity may
                lead to very fast and hectic price movements, wider spreads
                and/or in higher rejection rates. The Client&rsquo;s ability to
                buy or sell Cryptocurrencies and compare the Cryptocurrency
                prices may consequently be limited.
              </li>
            </ul>
          </li>
        </ol>
        <p>&nbsp;</p>
        <ol start={5} style={{ marginLeft: '2rem' }}>
          <li>
            <strong>5. Technology risks</strong>
            <ul>
              <li>
                5.1. The functioning of the Cryptocurrencies is based on the
                distributed ledger technology, which is still at an early stage
                and best practices have yet to be established and implemented.
                It is likely that the distributed ledger technology changes
                significantly in the future. Technological advances in code
                breaking, cryptography or quantum computing etc. may pose a risk
                to the security of Cryptocurrencies. In addition, alternative
                technologies to certain cryptocurrencies could be established,
                causing the Cryptocurrencies to lose significance or become
                obsolete. If the Cryptocurrencies are traded on a distributed
                ledger that becomes less relevant or obsolete, this could have a
                negative impact on the price and the liquidity of the
                Cryptocurrencies.
              </li>
              <li>
                5.2. The functioning of Cryptocurrencies is based on open-source
                software. The Service Provider does not employ or control the
                developers of such opensource software. Developers may introduce
                vulnerabilities and/or programming errors into the open-source
                software or may cease development of the open-source software
                (especially at a critical time, when a security update might be
                necessary). This could leave Cryptocurrencies exposed to
                vulnerabilities, programming errors and risks of fraud, theft
                and cyber-attacks.
              </li>
              <li>
                5.3. In recent years, the number of transactions in distributed
                ledger networks has increased sharply. An increasing number of
                transactions combined with the inability to make changes to
                distributed ledger technology may result in a slower processing
                time of transactions and/or a significant increase in the
                transaction fees. This may result in an increase in the fees and
                costs.
              </li>
              <li>
                5.4. As there is no central body (like a government authority or
                a central bank) overseeing the development of distributed ledger
                technology, the functioning of distributed ledger systems, and
                further improvements to that functioning (e.g. ability to
                increase the number of transactions, reduce processing time,
                lower transaction fees, introduce security updates), depend on
                the cooperation and consent of stakeholders, among others,
                developers improving the open-source software related to
                Cryptocurrencies or so called &quot;miners&quot; who facilitate
                the processing of transactions. Disagreements among these
                stakeholders can result in a hard fork. Hard forks may lead to
                the instability of a particular version of a relevant
                distributed ledger system. In addition, hard forks or the threat
                of a potential hard fork may prevent the establishment of
                Cryptocurrencies as a realizable alternative to traditional
                asset trading. Hard forks or the possibility of a hard fork may
                lead to an increase of the fees.
              </li>
              <li>
                5.5. Due to Cryptocurrencies&rsquo; special characteristics
                (like transactions are usually non-reversible and are carried
                out largely anonymously; Cryptocurrencies exist only virtually
                on a computer network) Cryptocurrencies are an attractive target
                for fraud, theft and cyber-attacks. Various techniques have been
                developed (or vulnerabilities identified) to steal
                Cryptocurrencies or disrupt the underlying distributed ledger
                technology, including e.g. the &quot;51% attack&quot; where
                attackers take control over a relevant distributed ledger
                network by providing 51% of the computer power in the relevant
                distributed ledger network, or the &quot;denial of service
                attack&quot; where attackers try to make the distributed ledger
                network&apos;s resources unavailable by overwhelming it with
                service requests. The Client is directly exposed to fraud, theft
                and cyber-attacks as high profile losses resulting of such
                events may increase skepticism about the long-term future of
                Cryptocurrencies and may prevent the establishment of
                Cryptocurrencies as an accepted means of representing
                currencies, as well as increasing the volatility and illiquidity
                of the Cryptocurrencies.
              </li>
              <li>
                5.6. Cryptocurrencies have no physical equivalent as they only
                exist virtually on a computer network. Establishing a value for
                Cryptocurrencies is difficult as the value depends on the
                expectation and confidence that Cryptocurrencies can be used for
                payment transactions in the future and/or as a medium of
                exchange. Among others, continued high volatility, changes and
                advances in technology, fraud, theft and cyber-attacks and
                regulatory changes may prevent Cryptocurrencies from
                establishing themselves as an accepted medium of exchange
                potentially rendering Cryptocurrencies worthless.
              </li>
            </ul>
          </li>
        </ol>
        <p>&nbsp;</p>
        <ol start={6} style={{ marginLeft: '2rem' }}>
          <li>
            <strong>6. Privacy; Public nature of Distributed Ledgers</strong>
            <ul>
              <li>
                6.1. The Client should be aware that any transfer, sale and
                purchase of Cryptocurrencies may be recorded in a public
                distributed ledger and may therefore be visible to the public.
              </li>
              <li>
                6.2. Distributed ledgers on which Cryptocurrencies are issued
                and/or recorded is neither the property of, nor under any
                control of the Service Provider. Information available on the
                distributed ledgers may be processed, exploited or misused by
                third parties, including in unforeseen ways.
              </li>
            </ul>
          </li>
        </ol>
      </div>
      <div className={styles.modalFooter}>
        <button
          onClick={onCheck}
          disabled={!isScrolledToEnd}
          className="mt-5 w-full rounded-full border-none bg-white px-9 py-3 text-base text-black disabled:bg-gray-main disabled:text-[#cccc] md:px-14 md:py-3 md:text-xl"
        >
          I have read and accept to cryptocurrency risk disclosure
        </button>
      </div>
    </Modal>
  );
}
