import PageWrapper from 'modules/base/PageWrapper';
import ShotImg from './shot.png';

const PageNoDesktop = () => {
  return (
    <PageWrapper>
      <div className="mx-auto flex max-w-6xl items-center gap-8">
        <div className="w-2/3 rounded-xl border border-v1-border-notice bg-v1-surface-l2 p-6 font-light">
          <h2 className="mb-4">
            Please open our Auto-Trader App on your{' '}
            <span className="text-v1-content-notice">mobile device</span> to
            access the full feature set!
          </h2>
          <p className="mb-2">
            While our desktop version is coming soon, here&apos;s what you can
            enjoy right now on mobile:
          </p>
          <ul className="mb-2 flex list-disc flex-col gap-2 pl-4">
            <li>
              <strong>Custom Positions:</strong> Create trading positions with
              multiple take profit and stop loss targets.
            </li>
            <li>
              <strong>Flexible Entries:</strong> Open positions at different
              prices, each with its own volume allocation.
            </li>
            <li>
              <strong>Smart AI Presets:</strong> Get a head start with
              AI-generated templates for your multi TP/SL and open setups.
            </li>
          </ul>
          <p>
            Thank you for your patience — we&apos;re excited to bring these
            features to desktop soon!
          </p>
        </div>
        <div className="w-1/3">
          <img src={ShotImg} className="rounded-xl border-2 border-white" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default PageNoDesktop;
