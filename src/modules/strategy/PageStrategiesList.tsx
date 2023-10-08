import { NavLink } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import Card from 'shared/Card';
import Button from 'modules/shared/Button';

export default function PageStrategiesList() {
  const strategies = ['my simple strategy', 'advanced strategy'];

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Strategy Builder</h1>

      <div className="flex flex-col gap-4">
        {strategies.map(s => (
          <NavLink key={s} to={`/app/strategy/${s}`}>
            <Card className="cursor-pointer !p-6 hover:bg-white/10">{s}</Card>
          </NavLink>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button to="/app/strategy/new">New Strategy</Button>
      </div>
    </PageWrapper>
  );
}
