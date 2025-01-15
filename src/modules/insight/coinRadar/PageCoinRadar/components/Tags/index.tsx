import { bxGridAlt } from 'boxicons-quasar';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import Icon from 'shared/Icon';
import { data } from './data';

export function Tags({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange?: (v?: string) => void;
}) {
  return (
    <ButtonSelect
      options={[
        {
          label: (
            <>
              <Icon name={bxGridAlt} size={16} /> {'All'}
            </>
          ),
          value: '',
        },
        ...data.map(row => ({
          label: row.label,
          value: row.slug,
        })),
      ]}
      allowClear
      value={value ?? undefined}
      onChange={onChange}
      className={className}
      size="md"
      variant="primary"
    />
  );
}

export { data } from './data';
