/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { ReactComponent as CloseIcon } from "@images/close.svg";
import Modal from "components/modal/Modal";
import { useCallback, useRef, useState } from "react";
import styles from "./styles.module.scss";
interface IProps {
  isOpen: boolean;
  toggle: () => void;
  onCheck: () => void;
}

export default function TermsDialog({ isOpen, toggle, onCheck }: IProps) {
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollableRef.current) return;

    const { clientHeight, scrollTop, scrollHeight } = scrollableRef.current;
    if (scrollTop + clientHeight + 300 > scrollHeight) {
      setScrolledToEnd(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <Modal className={styles.modal} onClose={toggle}>
      <div className={styles.modalHeader}>
        Terms and Conditions
        <CloseIcon className="cursor-pointer fill-white" onClick={toggle} />
      </div>
      <div
        className={styles.modalBody}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        <>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              These General Terms and Conditions (“<b>this Agreement</b>”)
              <b> </b>
              contains provisions governing together with the Privacy Policy and
              the Cryptocurrency Risk Disclosure the contractual relationship
              between Wisdomise (Switzerland) AG, Neuhofstrasse 5A, 6304 Baar,
              Switzerland (hereinafter the &quot;<b>Service Provider</b>&quot;
              or “<b>Wisdomise</b>”) and the signatory (hereinafter the “
              <b>Client</b>”).
            </span>{" "}
            <span>
              For ease of reading, the masculine form refers to any gender.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              Please note that different paragraphs of these General Terms and
              Conditions may apply depending on the services used by the Client.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".5in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>&nbsp;</span>
            </b>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".5in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>“Wealth” Service Providing Agreement</span>
            </b>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".5in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          ></p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              This “Wealth” Service Providing Agreement (hereinafter “
              <b>Wealth Agreement</b>”) contains provisions governing together
              with the Terms and Conditions and the Cryptocurrency Risk
              Disclosure the contractual relationship between Service Provider
              and the Client if the Client uses the product “<b>Wealth</b>”.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                1.
                <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Subject</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client mandates the Service Provider to manage the
              cryptocurrencies deposited in his existing or in a new wallet to
              be created with a third party crypto exchange platform
              (hereinafter the &quot;<b>Portfolio</b>&quot;). The Service
              Provider performs the services under this Wealth Agreement by{" "}
            </span>
            <span>
              means of artificial intelligence (“<b>AI</b>”) and, in principle,
              without human intervention
            </span>
            <span>
              {" "}
              (hereinafter the “<b>Wealth Services</b>” or “<b>Wealth</b>”).
              Furthermore, the software helps to allocate the cryptocurrencies
              held in the wallet with a third party crypto exchange platform
              across a portfolio of crypto coins and track the cryptocurrencies
              over time. For the use of the Wealth Services, the Service
              Provider offers to open an account (hereinafter the “
              <b>Account</b>”).
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.2
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              If the Client selects the option to create a new wallet during the
              Account opening process, the Client agrees that the wallet will be
              opened with a third party crypto exchange provider. The Client
              agrees that the new wallet is not provided by the Service
              Provider, but by a third party.{" "}
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.3
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Based on the information provided by the Client when opening an
              Account, the Service Provider creates a risk profile (“
              <b>Client’s Risk Profile</b>
              ”). The Client’s Risk Profile is taken into account in the
              provision of the Wealth Services under this Wealth Agreement.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.4
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Before offering the Wealth Services, the Service Provider has
              carried out all usual initial checks and self-checks regarding the
              AI (including but not limited to regression testing, unit tests,
              integration tests, stress tests and user acceptance tests).
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.5
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider monitors the correct functioning of the AI on
              a regular basis by means of a monitoring dashboard.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.6
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              If the Service Provider identifies a malfunction of the AI or
              another risk related to the AI, it shall take all necessary
              actions to remedy this malfunction and/or risk.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              1.7
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider offers neither trade execution services nor
              custody services for cryptocurrencies under this Wealth Agreement.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                2.
                <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Authorization</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              2.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              In order to perform the Wealth Services, the Service Provider is
              authorized to act in the name of, for the account of and at the
              risk of the Client at the Service Provider’s own discretion within
              the framework of the provisions set out in this Wealth Agreement,
              including any future amendments. Additionally, the Service
              Provider is authorized to act in its own name and for the account
              of and at the risk of the Client at the Service Provider’s own
              discretion within the framework of the provisions set out in this
              Wealth Agreement, including any future amendments.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              2.2
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              In particular, but not exclusively, the Service Provider is
              authorized to make and execute, in the name of, for the account of
              and at the risk of the Client, as well as in its own name, but for
              the account of and at the risk of the Client, purchase and/or sell
              decisions regarding the Client’s Portfolio.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                3.
                <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>
                Investment objective and other information provided by the
                Client
              </span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              3.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms that the information provided when opening his
              Account, in particular with regard to the creation of the Client’s
              Risk Profile, is correct at the date of the first use of the
              Wealth Services. This includes, in particular, the Client&apos;s
              knowledge and investment experience, the Client’s trading patterns
              and the Client&apos;s risk appetite.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textIndent: "-.25in" }}
          >
            <span>
              3.2<span>&nbsp;</span>
            </span>
            <span dir="LTR" />
            <span>
              In addition, the Client confirms and acknowledges that, under
              normal circumstances, he does not need any cryptocurrencies
              deposited in the Portfolio to support himself and/or his
              dependents.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              3.3
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client undertakes to notify the Service Provider immediately
              of any changes to the information provided by him via his Account.
              The changes communicated by the Client via his Account shall
              replace, for the purposes of this Wealth Agreement, the
              information previously provided by the Client.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <b>
                <span>
                  4.
                  <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </b>
              <span dir="LTR" />
              <b>
                <span>Investment Strategy Parameters</span>
              </b>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              4.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The investment strategy implemented by the AI is based on the
              Client&apos;s Risk Profile, which is created on the basis of the
              Client&apos;s knowledge and investment experience, the
              Client&apos;s trading patterns and the Client’s risk appetite.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              4.2<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client must specify a maximum risk level for the Portfolio.
              The Client is provided with the definitions of the risk levels
              during the process of opening an Account.{" "}
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>
              Generally, the Client may choose between the following risk
              profiles: low risk low return (“LRLR”), medium risk medium return
              (“MRMR”) and high risk high return (“HRHR”). The higher the
              maximum risk level set by the Client, the greater the profit
              expectations usually are, but the higher the risk of loss.{" "}
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.4pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              The determination of a maximum risk level does not mean that the
              potential losses of the Portfolio are limited. However, the
              Service Provider sets limits, such as a “stop loss”, which does
              not limit the potential loss to a fixed level, but dynamically
              sets the stop loss levels based on the Client’s entry point.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.4pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              If the maximum risk level determined by the Client is exceeded,
              the composition of the Portfolio will be adjusted to bring the
              risk of the Portfolio back to a level below the maximum risk level
              determined by the Client. The maximum risk level determined by the
              Client may therefore be temporarily exceeded until the composition
              of the Portfolio has been adjusted.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              4.3
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              In carrying out this Wealth Agreement and within the limits set by
              the Client through the Client’s Risk Profile, the Service Provider
              reserves the right to limit the risk of the Portfolio to a level
              that the Service Provider considers appropriate in accordance with
              this Wealth Agreement. The Service Provider is not obliged to
              maintain the portfolio risk at the highest level accepted by the
              Client, nor at a level just below it. In the event of the death of
              the Client and in the absence of instructions from his heirs or
              their representative, the Service Provider is entitled to limit
              the level of risk of the Portfolio.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <span>
                4.4
                <span>&nbsp; </span>
              </span>
              <span dir="LTR" />
              <span>
                The Service Provider only provides Wealth Services regarding the
                cryptocurrencies mentioned in Annex I (hereinafter the “
                <b>Cryptocurrencies</b>”) including any future amendments.
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              4.5
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider reserves the right to, but is not obliged to,
              extend the Wealth Services to other cryptocurrencies. In the event
              that the Service Provider extends its Wealth Services to other
              cryptocurrencies, it shall amend Annex I accordingly. The Service
              Provider shall inform the Client of amendments to Annex I by email
              and by publishing the information on its website.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              4.6
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider changes the composition of the Portfolio at
              regular intervals in line with market developments (&quot;
              <b>Reallocations</b>&quot;). The Service Provider takes into
              account various circumstances (e.g. frequent intervals, market
              events) when performing Reallocations. Which circumstances are
              taken into account and how frequently Reallocations are made
              depends on the Client’s Risk Profile.
            </span>
            <span> A </span>
            <span>Reallocation</span>
            <span>
              {" "}
              will also be made if the maximum risk level determined by the
              Client is reached or exceeded.{" "}
            </span>
            <span>
              The more frequently Reallocations are made, the better the
              Client&aps;s investment objective can be pursued. However, as
              Reallocations may incur transaction costs, frequent Reallocations
              may increase the costs borne by the Client. The Reallocation
              frequency does not determine the exact time of the next
              Reallocation. In particular, for technical reasons or to protect
              the interests of its Clients, the Service Provider may carry out
              the Reallocation a few days earlier or later than the date
              determined by the Reallocation frequency.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <b>
                <span>
                  5.
                  <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </b>
              <span dir="LTR" />
              <b>
                <span>Instructions and Preferences of the Client</span>
              </b>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              5.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client may communicate preferences to the Service Provider
              regarding the execution of the Wealth Services under this Wealth
              Agreement. During the provision of the Wealth Services, the Client
              may only change these preferences by changing the Client’s Risk
              Profile. However, the change in the Client’s Risk Profile shall
              have no effect on the execution of decisions already taken at the
              time of the receipt of the change notice by the Service Provider.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <b>
                <span>
                  6.
                  <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </b>
              <span dir="LTR" />
              <b>
                <span>Communication channel</span>
              </b>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              6.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client may communicate with the Service Provider only via his
              Account (all other communication channels are excluded) for the
              execution of this Wealth Agreement.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <b>
                <span>
                  7.
                  <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </b>
              <span dir="LTR" />
              <b>
                <span>Investment Policy</span>
              </b>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              7.1<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider provides the Wealth Services under this
              Wealth Agreement using artificial intelligence, which enables it
              to make sale and/or purchase decisions on the Cryptocurrencies
              held in the Client’s Portfolio based on the Client&apos;s Risk
              Profile. The artificial intelligence used by the Service Provider
              consists of two main modules, a smart portfolio optimizer and an
              artificial intelligence core.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginLeft: "35.4pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              The Service Provider may define one or more strategies concerning
              the sale and purchase of the Cryptocurrencies, either for the
              entirety of clients, for specific client groups or only for
              certain clients.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.4pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              <span>
                The Service Provider uses quantitative (e.g., price changes) and
                other factors influencing the price of Cryptocurrencies for
                carrying out the Wealth Services.{" "}
                <span className="msoDel">
                  <del
                    cite="mailto:Arash%20Farahani"
                    dateTime="2023-05-16T12:39"
                  >
                    The Service Provider does not use qualitative methods like
                    following the latest news and tweets on the Cryptocurrencies
                    for carrying out the Wealth Services.
                  </del>
                </span>
              </span>
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.4pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>
              <span className="msoDel">
                <del cite="mailto:Arash%20Farahani" dateTime="2023-05-16T12:40">
                  Consequently, it does{" "}
                  <span>
                    not carry out any qualitative analysis of the
                    Cryptocurrencies, does not take note of any analysis that
                    third parties may carry out on the Cryptocurrencies (but
                    reserves the right to use the results of third parties&aps;
                    analysis of the Cryptocurrencies in a quantitative manner){" "}
                  </span>
                  and does not follow the latest news on the Cryptocurrencies.{" "}
                  <span>
                    The Service Provider refrains from making any subjective
                    assessment of the development of the Cryptocurrencies.
                  </span>
                </del>
              </span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                <span className="msoDel">
                  <del
                    cite="mailto:Arash%20Farahani"
                    dateTime="2023-05-16T12:40"
                  >
                    &nbsp;
                  </del>
                </span>
              </span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                <span className="msoDel">
                  <del
                    cite="mailto:Arash%20Farahani"
                    dateTime="2023-05-16T12:40"
                  >
                    &nbsp;
                  </del>
                </span>
              </span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                <span className="msoDel">
                  <del
                    cite="mailto:Arash%20Farahani"
                    dateTime="2023-05-16T12:40"
                  >
                    &nbsp;
                  </del>
                </span>
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              7.2<span> </span>
            </span>
            <span dir="LTR" />
            <span>The </span>
            <span>
              AI check on a regular basis, in accordance with the frequency of
              Reallocation, whether the Portfolio risk is in line with the
              Client’s Risk Profile.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              7.3
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>The</span>
            <span>
              Service Provider shall ensure that the Client’s Portfolio is
              diversified in accordance with the Client&aps;s{" "}
            </span>
            <span>Risk Profile.</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              7.4
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider does not take into account, even at the
              Client&apos;s request, any tax implications that the Wealth
              Services provided under this Wealth Agreement may have on the
              Client&apos;s situation.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <b>
                <span>
                  8.
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </span>
              </b>
              <span dir="LTR" />
              <b>
                <span>Special risks of these Wealth Services</span>
              </b>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.1
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms that he is aware of the risks associated with
              the purchase, sale and holding of Cryptocurrencies. Additionally,
              the Clients confirms that he has received and taken note of the
              Cryptocurrency Risk Disclosure.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.2<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms to understand and acknowledges that the
              Portfolio may suffer a significant loss in value up to and
              including a total loss of the amount deposited in the Portfolio
              even if the Service Provider is not at fault.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.3<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              If the Client selects to create a new wallet, the Client agrees to
              bear all risks associated with the wallet being held with a third
              party, such as, but not limited to, bankruptcy of the third party,
              unauthorized access to the wallet held with the third party due to
              a hacker attack or similar event. The Service Provider shall not
              be liable for any direct or indirect damages arising in connection
              with the holding of the wallet with a third party, unless such
              damage is due to Service Provider’s gross negligence or willful
              misconduct.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.4<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms that he is fully informed of and understands
              the specific risks associated with the Client’s investment
              objective and strategy and is aware of its possible consequences.
              The Client confirms and accepts in particular that the Wealth
              Services are, in principle, performed automatically and without
              human intervention.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.5<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms that he understands and accepts that the
              Service Provider is not involved in the execution of trades, but
              the trades are executed by the third party crypto exchange
              platform with which the Client holds his wallet. The Client
              confirms that he understands and accepts that there are risks
              associated with this third party crypto exchange platform which
              the Service Provider cannot foresee and cannot influence.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.6<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              Furthermore, the Client confirms that he understands and accepts
              the specific risks associated with the AI. These are described in
              Sections{" "}
            </span>
            <span>4</span>
            <span>,</span>
            <span>5</span>
            <span>,</span>
            <span>7</span>
            <span>, and </span>
            <span>8</span>
            <span>
              and relate in particular to the limited investment universe, the
              frequency of portfolio reallocation, the frequency of risk level
              control and the specific criteria for portfolio diversification.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              8.7<span> </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client confirms that he understands and accepts the technical
              risks of an automated management of sales and purchases of
              Cryptocurrencies, for example those related to a system error
              and/or connection difficulties. He also understands and accepts
              that the AI is based on sources that are considered reputable, but
              that it cannot be guaranteed that the information used by the AI
              is accurate, complete and up-to-date, and that this may have an
              impact on the management of the Client’s Portfolio.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "35.45pt",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                9.
                <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Fees</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <span>
                9.1
                <span>&nbsp;</span>
              </span>
              <span dir="LTR" />
              <span>
                If so agreed between the Service Provider and the Client during
                the Account opening process
                <span className="msoIns">
                  <ins
                    cite="mailto:Arash%20Farahani"
                    dateTime="2023-05-16T12:41"
                  >
                    {" "}
                    and activating any of the available investment packages
                  </ins>
                </span>
                , the Service Provider shall receive fees for its Wealth
                Services. The amount of the fees shall be based on a pricing
                model which the Client confirms when opening an Account.
              </span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                &nbsp;
              </span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                &nbsp;
              </span>
            </span>
            <span className="MsoCommentReference">
              <span style={{ fontSize: "8.0pt" }}>&nbsp;</span>
            </span>
            <span className="MsoCommentReference">
              <span lang="DE-CH" style={{ fontSize: "8.0pt" }}>
                &nbsp;
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              9.2
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              If the Client and the Service Provider have not entered into an
              agreement within the meaning of clause{" "}
            </span>
            <span>9.1</span>
            <span>, the Service Provider shall not receive fees.</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              9.3
              <span>&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client acknowledges and accepts that he has to bear and pay
              all fees, commissions and costs incurred for the execution of
              trades on a third party crypto exchange platform under this Wealth
              Agreement.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textAlign: "justify", lineHeight: "normal" }}
          >
            <i>
              <span>&nbsp;</span>
            </i>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                10.
                <span>&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Account statements</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              10.1
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              The Wealth Services carried out under this Wealth Agreement may be
              viewed by the Client at any time on the Client’s Account. The
              Service Provider is not obliged to send account statements to the
              Client by any other means.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                11.
                <span>&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>
                Exclusion of liability and limitation of due diligence
                obligations
              </span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{ textIndent: "-.25in" }}
          >
            <span>
              <span>
                11.1
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
              <span dir="LTR" />
              <span>
                The Service Provider will perform its contractual and legal
                obligations towards the Clients with the ordinary business
                diligence.
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              11.2
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              The Service Provider does not make any undertaking to achieve a
              particular performance. The Client understands and accepts that
              past performance is no guarantee of future performance. The
              Service Provider accepts no liability whatsoever for the outcome
              of the management of the Portfolio carried out by the AI or for
              any losses that may result for the Client, unless the Service
              Provider acts with gross negligence or willful misconduct.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <span>
                11.3
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
              <span dir="LTR" />
              <span>
                The Service Provider shall only be liable to the Client for
                direct losses caused by fraudulent or grossly negligent breaches
                of the Service Provider’s obligations under applicable Swiss law
                or the Wealth Agreement. In particular, but not limited to, the
                Service Provider shall not be liable for:
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "56.7pt",
              textAlign: "justify",
              textIndent: "-21.25pt",
              lineHeight: "normal",
            }}
          >
            <span>
              a)
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Damages arising from the access to and use, or any hindrance to
              the access and use, of the Service Provider’s website, the
              Client’s Account and the use of the information and Wealth
              Services available thereon;{" "}
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "56.7pt",
              textAlign: "justify",
              textIndent: "-21.25pt",
              lineHeight: "normal",
            }}
          >
            <span>
              b)
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Damages arising from the Service Provider’s lawful intervention
              pursuant to legal requirements and/or the Wealth Agreement;
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "56.7pt",
              textAlign: "justify",
              textIndent: "-21.25pt",
              lineHeight: "normal",
            }}
          >
            <span>
              c)
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Damages arising in connection with the holding of the wallet with
              a third party exchange;
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "56.7pt",
              textAlign: "justify",
              textIndent: "-21.25pt",
              lineHeight: "normal",
            }}
          >
            <span>
              d)
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Damages arising from events as described in Articles 9.11 to 9.14
              of the Terms and Conditions or any other materialization of any
              risks associated with Internet;
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginLeft: "56.7pt",
              textAlign: "justify",
              textIndent: "-21.25pt",
              lineHeight: "normal",
            }}
          >
            <span>
              e)
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span dir="LTR" />
            <span>
              Damages brought about directly or indirectly by extraordinary
              circumstances beyond the reasonable control of the Service
              Provider, which it may determine at its reasonable discretion and
              may only affect part of the Service Provider, and may include (but
              are not limited to) (i) technical difficulties (such as an
              electrical power cut, failures or breakdowns of information
              technology or communication channels and equipment), (ii)
              unavailability and/or malfunctioning of the Service Provider’s
              website and/or malfunctioning of software to access the Service
              Provider’s website for any reason whatsoever, (iii) declared or
              imminent wars, terrorist attacks, revolutions, civil unrest,
              hurricanes, earthquakes, floods and other natural disasters, (iv)
              mandatory provisions, steps taken by authorities, riots, strikes,
              lock-outs, boycotts, blockades and other significant labour
              disputes, regardless of whether or not the Service Provider is a
              party to the conflict, (v) the suspension, cessation or closure of
              any market for cryptocurrencies, or cryptocurrency (vi) the
              imposition of limits or special or unusual terms on the trading in
              any market for cryptocurrencies or cryptocurrency, (vii) the
              occurrence of a market disruption or of an exceptional movement in
              any market for cryptocurrencies or any cryptocurrency, and (viii)
              any other situation that may be defined as “act of God”
              (hereinafter collectively, “<b>Force Majeure Events</b>”).
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              <span>
                11.4
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
              <span dir="LTR" />
              <span>
                Under no circumstances shall the Service Provider be liable for
                indirect, accumulated or subsequent Damages, nor shall the
                Service Provider have any liability whatsoever for Damages
                caused by failure on the part of the Client to mitigate any
                Damages, in particular by failing to take immediate measures to
                prevent potential Damages or reduce existing Damages known or
                foreseeable or that should have been known or foreseeable if the
                Client had exercised due care and diligence. For instance, in
                the event that the Service Provider’s website and/or the Account
                are unavailable (e.g. due to technical problems).
              </span>
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              11.5
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>Subject to the provisions of Section </span>
            <span>11.1</span>
            <span> to </span>
            <span>11.4</span>
            <span>
              {" "}
              and if the Service Provider has failed to apply due business
              diligence, its liability for any Damages suffered by the Client
              shall in any case be limited to an amount equal to the loss of
              interest by the Client.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                12.
                <span>&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Miscellaneous </span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              12.1
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              The Client undertakes to read the notices provided by the Service
              Provider in the Client’s Account at regular short intervals.{" "}
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              12.2
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              This Wealth Agreement may be amended or supplemented by a written
              agreement between the Service Provider and the Client. The Service
              Provider allows the Client to change its investment objective
              online, as well as the other information provided by the Client
              when opening its Account with the Service Provider.
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              12.3
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              This Wealth Agreement supplements the existing agreements between
              the Client and the Service Provider, in particular the Service
              Provider&apos;s Terms and Conditions, which also apply to this
              Wealth Agreement. If the provisions of this Wealth Agreement and
              the provisions of other agreements concluded between the Client
              and the Service Provider conflict, the provisions of this Wealth
              Agreement shall prevail.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: "0in",
              marginRight: "0in",
              marginBottom: "0in",
              marginLeft: ".25in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                13.
                <span>&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Termination</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              13.1
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              This Wealth Agreement may be terminated at any time by the parties
              involved. As soon as the Service Provider has received the
              termination of this Wealth Agreement by the Client, it will no
              longer carry out the Wealth Services.{" "}
              <span>
                However, the termination of this Wealth Agreement shall have no
                effect on the execution of decisions already taken at the time
                of the receipt of the termination notice by the Service Provider
              </span>
              .
            </span>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              13.2
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              Termination of this Wealth Agreement shall not affect any other
              agreement between the Client and the Service Provider. This Wealth
              Agreement shall not terminate in the event of the Client&apos;s
              death, incapacity or disappearance, insolvency or bankruptcy.
            </span>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              lineHeight: "normal",
            }}
          >
            <span>&nbsp;</span>
          </p>
          <p
            className="MsoListParagraphCxSpFirst"
            style={{
              marginBottom: "0in",
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <b>
              <span>
                14.
                <span>&nbsp; </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Applicable law and place of jurisdiction</span>
            </b>
          </p>
          <p
            className="MsoListParagraphCxSpMiddle"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              14.1
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>This Wealth Agreement is governed by Swiss law.</span>
          </p>
          <p
            className="MsoListParagraphCxSpLast"
            style={{
              textAlign: "justify",
              textIndent: "-.25in",
              lineHeight: "normal",
            }}
          >
            <span>
              14.2
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </span>
            <span dir="LTR" />
            <span>
              The place of performance and enforcement for Clients domiciled
              abroad and the exclusive place of jurisdiction for all legal
              disputes in connection with this Wealth Agreement shall be Zug,
              Switzerland. The Service Provider shall, however, also be entitled
              to assert its rights in court at the Client&apos;s place of
              domicile or in any other competent authority. In this case Swiss
              law shall also be applicable.
            </span>
          </p>
        </>
      </div>
      <div className={styles.modalFooter}>
        <button
          onClick={onCheck}
          disabled={!isScrolledToEnd}
          className="mt-5 w-full rounded-full border-none bg-white px-9 py-3 text-base text-black disabled:bg-gray-main disabled:text-[#cccc] md:px-14 md:py-3 md:text-xl"
        >
          I have read and accept to the terms of service.
        </button>
      </div>
    </Modal>
  );
}
