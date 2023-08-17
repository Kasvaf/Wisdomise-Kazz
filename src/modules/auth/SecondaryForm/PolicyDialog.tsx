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

export default function PolicyDialog({ isOpen, toggle, onCheck }: IProps) {
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
        Privacy Policy
        <CloseIcon className="cursor-pointer fill-white" onClick={toggle} />
      </div>
      <div
        className={styles.modalBody}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        <>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              PRIVACY POLICY REGARDING OUR DATA PROCESSING UNDER ARTICLES 13, 14
              AND 21 GENERAL DATA PROTECTION REGULATION (GDPR)
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                1.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Data Controller and contact details
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                lang="DE-CH"
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Data Controller:
              </span>
            </strong>
            <span
              lang="DE-CH"
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                Wisdomise (Switzerland) AG
              </span>
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                Neuhofstrasse 5A
              </span>
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                6340 Baar
              </span>
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                Switzerland
              </span>
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                T +41 41 761 55 64
              </span>
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                E-Mail{' '}
                <a href="mailto:support@wisdomise.io">support@wisdomise.io</a>
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              lang="DE-CH"
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                2.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                General information
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                  fontWeight: 'normal',
                }}
              >
                We use your data in compliance with the applicable data
                protection regulations.
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                  fontWeight: 'normal',
                }}
              >
                In the following, you will be informed about which personal data
                we collect and store from you. You will also receive information
                on how and for what purpose your data is used and what rights
                you have with regard to the use of your data.
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                  fontWeight: 'normal',
                }}
              >
                &nbsp;
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                3.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Collection and storage of personal data and the nature and
                purpose of their use
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span>
              <strong>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  a)
                  <span style={{ font: '7.0pt "Times New Roman"' }}>
                    &nbsp;&nbsp;&nbsp;{' '}
                  </span>
                </span>
              </strong>
              <span dir="LTR" />
              <strong>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  Visiting our website
                </span>
              </strong>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Whenever you visit our website, your browser automatically sends
              information to our website server where it is temporarily saved in
              a log file. The following files are automatically recorded and
              stored until they are automatically deleted:
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Browser type and browser version
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Operating system used
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Referrer URL
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Host name of the computer making access
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Time of the server inquiry
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              IP address
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              Operating system used
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              Amount of data sent in bytes
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The collection and processing of this data is carried out for the
              purpose of enabling the use of our website (connection setup), to
              ensure system security and stability on a permanent basis, to
              enable the technical administration of the network infrastructure
              and the optimization of our Internet offer as well as for internal
              statistical purposes.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The legal basis for data processing is Art. 6 para. 1 p. 1 lit. f
              GDPR. Our legitimate interest is based on the purposes of data
              collection listed above. Under no circumstances do we use the data
              collected for the purpose of drawing inferences concerning your
              person.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span>
              <strong>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  b)
                  <span style={{ font: '7.0pt "Times New Roman"' }}>
                    &nbsp;&nbsp;&nbsp;{' '}
                  </span>
                </span>
              </strong>
              <span dir="LTR" />
              <strong>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  General contact, contact via contact form
                </span>
              </strong>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              You can use the form provided on our website to contact us
              concerning any type of question. In addition to your form of
              address, first and last name as well as the name of your company,
              the provision of a valid email address is required, so that we
              know from whom the inquiry originates and to enable us to answer.
              Additional information can be provided on a voluntary basis. The
              data entered in the contact form will be transferred to us
              exclusively in encrypted form. You can also contact us by e-mail
              and provide us with personal data such as your surname, first
              name, e-mail address and postal address.{' '}
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                This data is used to process the contractual relationship, to
                process your enquiries and for our own advertising by post and
                e-mail. Any further use, in particular the passing on of data to
                third parties for the purposes of advertising, market or opinion
                research, does not take place.
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              We delete the data accruing in this context after the storage is
              no longer necessary or restrict the processing if there are
              statutory retention obligations.{' '}
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Data processing for the purpose of contacting us will be carried
              out on the basis of your voluntary consent in accordance with Art.
              6 (1) Sentence 1 lit. a GDPR. Otherwise, the legal basis for data
              processing is Art. 6 para. 1 lit. b) GDPR or Art. 6 para. 1 lit.
              f) GDPR.
            </span>
          </p>
          <p className="MsoListParagraph" style={{ textIndent: '-.25in' }}>
            <b>
              <span>
                c)
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>Account Information</span>
            </b>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '17.85pt',
              lineHeight: '150%',
            }}
          >
            <span>
              <span>
                When you create an account with us, we will collect information
                associated with your account, including your name, contact
                information, account credentials, payment card information,{' '}
                <span className="msoIns">
                  <ins
                    cite="mailto:Caroline%20Hermann"
                    dateTime="2023-05-10T08:36"
                  >
                    wallet address{' '}
                  </ins>
                </span>
                and transaction history.
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '17.85pt',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              This data is used to process the contractual relationship and to
              process your enquiries. Any further use, in particular the passing
              on of data to third parties for the purposes of advertising,
              market or opinion research, does not take place.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              We delete the data accruing in this context after the storage is
              no longer necessary or restrict the processing if there are
              statutory retention obligations.{' '}
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The legal basis for data processing is Art. 6 para. 1 lit. b) GDPR
              or Art. 6 para. 1 lit. f) GDPR.
            </span>
          </p>
          <p className="MsoListParagraph" style={{ textIndent: '-.25in' }}>
            <b>
              <span>
                d)
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </b>
            <span dir="LTR" />
            <b>
              <span>User Content</span>
            </b>
          </p>
          <p
            className="MsoNormal"
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
            }}
          >
            <span>
              <span>
                When you use our Services, we may collect Personal Information
                that is included in the input, file uploads, or feedback that
                you provide to our Services.
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '17.85pt',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              This data is used to process the contractual relationship and to
              process your enquiries. Any further use, in particular the passing
              on of data to third parties for the purposes of advertising,
              market or opinion research, does not take place.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              We delete the data accruing in this context after the storage is
              no longer necessary or restrict the processing if there are
              statutory retention obligations.{' '}
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The legal basis for data processing is Art. 6 para. 1 lit. b) GDPR
              or Art. 6 para. 1 lit. f)
              <span>GDPR</span>
            </span>
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              .
            </span>
          </p>
          <p
            style={{
              marginLeft: '.5in',
              textIndent: '-.25in',
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <b>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                e)
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </b>
            <span dir="LTR" />
            <span style={{ fontWeight: 'normal !msorm' }}>
              <b>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  <span className="msoIns">
                    <ins
                      cite="mailto:Caroline%20Hermann"
                      dateTime="2023-05-10T08:43"
                    >
                      User journeys
                    </ins>
                  </span>
                </span>
              </b>
            </span>
          </p>
          <p
            style={{
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:43"
                >
                  When you use our Services, we may collect Personal Information{' '}
                </ins>
              </span>
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:47"
                >
                  resulting from your journey while using our{' '}
                </ins>
              </span>
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:49"
                >
                  website
                </ins>
              </span>
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:43"
                >
                  that you provide to our Services.
                </ins>
              </span>
            </span>
          </p>
          <p
            style={{
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:43"
                >
                  This data is used to process the contractual relationship and
                  to process your enquiries. Any further use, in particular the
                  passing on of data to third parties for the purposes of
                  advertising, market or opinion research, does not take place.
                </ins>
              </span>
            </span>
          </p>
          <p
            style={{
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:43"
                >
                  We delete the data accruing in this context after the storage
                  is no longer necessary or restrict the processing if there are
                  statutory retention obligations.{' '}
                </ins>
              </span>
            </span>
          </p>
          <p
            style={{
              marginLeft: '.25in',
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <span className="msoIns">
                <ins
                  cite="mailto:Caroline%20Hermann"
                  dateTime="2023-05-10T08:43"
                >
                  The legal basis for data processing is Art. 6 para. 1 lit. b)
                  GDPR or Art. 6 para. 1 lit. f) GDPR.
                </ins>
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                4.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Transfer of your data to a third party
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              textIndent: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Your personal data will only be transferred to third parties if
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              you have given us consent to transmit data to third parties
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              this is necessary in accordance with Art. 6(1)(b) GDPR for the
              processing of a contractual relationships with you,
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              this is for the purpose of satisfying statutory requirements,
              under which we are obliged to provide information, to report or
              forward data,
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              for purposes where we are obligated or entitled to give
              information, notification or forward data, to the extent that
              external service providers commissioned by us process data as
              contract processors or parties that assume certain functions (e.g.
              external data centers, support and maintenance of IT applications,
              archiving, document processing, call center services, compliance
              services, controlling, data screening for anti-money laundering
              purposes, data validation and data protection, plausibility check,
              data destruction, purchasing/procurement, customer administration,
              letter shops, marketing, media technology, research, risk
              controlling, billing, telephony, website management, auditing
              services, credit institutions, printing plants or companies for
              data disposal, courier services, logistics, press relations work).
            </span>
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                We will moreover refrain from transmitting your data to third
                parties if we have not informed you of such separately. If we
                commission service providers within the framework of processing
                an order, your data will be subject there to the security
                standards stipulated by us in order to adequately protect your
                data. In all other cases, recipients may only use the data for
                purposes for which the data have been sent to them.
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              Those employees of our firm who come into contact with your data
              are, like ourselves, subject to a strict confidentiality
              obligation, compliance with which we constantly monitor. Other
              persons with whom we work and who come or could come into contact
              with your data have also been or will be obliged by us in writing
              to maintain confidentiality.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Within our firm, the internal departments and organizational units
              who need your data in order to fulfill our contractual and legal
              obligation or within the processing and implementation of our
              justified interest will receive your data.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                5.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Cookies
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              In addition to the aforementioned data, cookies are stored on your
              computer when you use our website. Cookies are small text files
              that are stored on your hard drive assigned to the browser you are
              using and through which certain information flows to the location
              that sets the cookie (here by us). Cookies cannot execute programs
              or transmit viruses to your computer. They serve to make the
              website more user-friendly and effective.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              textIndent: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Reach measurement &amp; cookies:
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              This website uses cookies for pseudonymised reach measurement,
              which are transferred to the user&apos;s browser either from our
              server or the server of a third party. Cookies are small files
              that are stored on your end device. Your browser accesses these
              files. The use of cookies increases the user-friendliness and
              security of this website.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              If you do not want cookies to be stored on your end device for the
              purpose of measuring reach, you can object to the use of these
              files here:
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <u>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                <span style={{ textDecoration: 'none' }}>&nbsp;</span>
              </span>
            </u>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span>
              <u>
                <span
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  Cookie deactivation page of the Network Advertising
                  Initiative:
                </span>
              </u>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              textIndent: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              https://optout.networkadvertising.org/?c=1#!/
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <u>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                <span style={{ textDecoration: 'none' }}>&nbsp;</span>
              </span>
            </u>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <u>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Cookie deactivation page of the US website:
              </span>
            </u>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <a href="https://optout.aboutads.info/?c=2#!/">
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                }}
              >
                https://optout.aboutads.info/?c=2#!/
              </span>
            </a>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <u>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                }}
              >
                Cookie deactivation page of the European website:
              </span>
            </u>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '0in',
              textIndent: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              https://optout.networkadvertising.org/?c=1#!/
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              Common browsers offer the setting option to not allow cookies.
            </span>
            <span className="MsoCommentReference">
              <span
                lang="DE-CH"
                style={{
                  fontSize: '8.0pt',
                  lineHeight: '150%',
                }}
              >
                <a className="msocomanchor" id="_anchor_9" href="#_msocom_9">
                  [CH9]
                </a>
                &nbsp;
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              Please note: It is not guaranteed that you will be able to access
              all functions of this website without restrictions if you make the
              corresponding settings.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <b>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Collection and processing of personal data
              </span>
            </b>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The website operator only collects, uses and discloses your
              personal data if this is permitted by law or if you consent to the
              data collection.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Personal data is any information that can be used to identify you
              and that can be traced back to you - for example, your name, email
              address and telephone number.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              You can also visit this website without providing any personal
              information. However, in order to improve our online services, we
              store (without personal reference) your access data to this
              website. This access data includes, for example, the file you
              requested or the name of your internet provider. By making the
              data anonymous, it is not possible to draw conclusions about your
              person.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                6.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Your data protection rights / Rights of data subjects
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              If certain conditions are met, you can assert the following data
              protection rights against us:
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              In accordance with Art. 7(3) GDPR, you may revoke the consent that
              you have granted to us at any time. The result of this is that we
              may no longer perform the data processing that this consent
              relates to in future.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              • Under Art. 15 GDPR, you have the right to obtain information on
              your personal data processed by us. In particular, you can request
              information about the processing purposes, the category of
              personal data, the categories of recipients to whom your data has
              been or will be disclosed, the planned storage period, the
              existence of a right to rectification, erasure, restriction of
              processing or objection, the existence of a right of complaint,
              the origin of your data if it has not been collected by us, as
              well as the existence of automated decision-making including
              profiling and, if applicable, meaningful information about its
              details.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Upon request, we will rectify or complete data stored on you in
              accordance with Art. 16 GDPR if such data is inaccurate or faulty.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Upon your request, we will erase your data in accordance with the
              principles of Art. 17 GDPR unless we are prohibited to do so by
              other statutory provisions (e.g., statutory retention obligations)
              or an overriding interest on our part (for example, to defend our
              rights and claims into account the preconditions laid down in Art.
              18 GDPR, you may request from us to restrict the processing of
              your data.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              In accordance with the provisions of Art. 20 GDPR, you also have
              the right to receive the personal data concerning you in a
              structured, commonly used and machine-readable format or transmit
              such data to a third party.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Furthermore, you may file an objection to the processing of your
              data in accordance with Art. 21 GDPR, as a result of which we have
              to stop processing your data. This right of objection only
              applies, however, if very special circumstances characterize your
              personal situation, whereby the rights of our firm may run counter
              to your right of objection.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              You furthermore have the right to revoke consent that has been
              issued to us to process personal data at any time with effect for
              the future.{' '}
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              In addition, you have the right to complain to a data protection
              authority (Art. 77 GDPR).
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Your applications regarding the exercising of your rights should
              be addressed if possible in writing to the abovementioned address.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <b>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                }}
              >
                7.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </b>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Information on your right of objection under Art. 21 GDPR
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              You have the right to file an objection at any time against
              processing of your data which is performed on the basis of Art.
              6(1)(f) GDPR (data processing on the basis of a weighing out of
              interests) or Art. Art. 6(1)(e) GDPR (data processing in the
              public interest). The precondition for this, however, is that
              there are grounds for your objection emanating from your special
              personal situation. This also applies to profiling that is based
              on this purpose within the meaning of Art. 4(4) GDPR.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              If you file an objection, we will no longer process your personal
              data unless we can demonstrate compelling reasons warranting
              protection for the processing that outweigh your interests, rights
              and freedoms, or the processing serves the purpose of asserting,
              exercising or defending legal claims.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              •
              <span style={{ font: '7.0pt "Times New Roman"' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
            </span>
            <span dir="LTR" />
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              We also process your personal data in order to perform direct
              advertising. If you do not want to receive any advertising, you
              have the right to file an objection thereto at any time. This also
              applies to the profiling to the extent that it is connected with
              such direct advertising. We will respect this objection with
              effect for the future.
            </span>
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              <br />
              <span style={{ border: 'none windowtext 1.0pt', padding: '0in' }}>
                • We will no longer process your data for the purpose of direct
                advertising if you object to processing for this purpose. The
                objection may be filed without adhering to any form requirements
                and should be sent to{' '}
              </span>
            </span>
            <span lang="DE-CH">
              <a href="mailto:support@wisdomise.io">
                <span
                  lang="EN-US"
                  style={{
                    fontSize: '11.0pt',
                    lineHeight: '150%',
                    border: 'none windowtext 1.0pt',
                    padding: '0in',
                  }}
                >
                  support@wisdomise.io
                </span>
              </a>
            </span>
            <span>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                .
              </span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <b>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                8.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </b>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Data security
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              We use appropriate technical and organizational security measures
              to protect your data against accidental or intentional
              manipulation, partial or total loss, destruction or against
              unauthorized access by third parties. Our security procedures are
              continually improved as new technology develops.
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
              }}
            >
              &nbsp;
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.5in',
              textIndent: '-.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                9.
                <span style={{ font: '7.0pt "Times New Roman"' }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                </span>
              </span>
            </strong>
            <span dir="LTR" />
            <strong>
              <span
                style={{
                  fontSize: '11.0pt',
                  lineHeight: '150%',
                  border: 'none windowtext 1.0pt',
                  padding: '0in',
                }}
              >
                Modifications to this Privacy Policy
              </span>
            </strong>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              The effective date of this Privacy Policy is{' '}
              <span style={{ color: 'yellow' }}>May 2023.</span>
            </span>
          </p>
          <p
            style={{
              marginTop: '6.0pt',
              marginRight: '0in',
              marginBottom: '6.0pt',
              marginLeft: '.25in',
              lineHeight: '150%',
              verticalAlign: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: '11.0pt',
                lineHeight: '150%',
                border: 'none windowtext 1.0pt',
                padding: '0in',
              }}
            >
              Due to the further development of our website or due to changed
              legal or official requirements, it may become necessary to amend
              this Privacy Policy. The current Privacy Policy can be accessed at
              any time here on our Website.
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
          I have read and accept the privacy policy.
        </button>
      </div>
    </Modal>
  );
}
