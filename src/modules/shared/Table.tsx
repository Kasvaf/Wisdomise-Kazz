import { Table as AntTable, type TableProps } from 'antd';

export default function Table<RecordType extends Record<string, unknown>>({
  pagination,
  ...props
}: TableProps<RecordType>) {
  return (
    <AntTable<RecordType>
      {...props}
      pagination={{
        ...pagination,
        showSizeChanger: false,
        showPrevNextJumpers: false,
        nextIcon: (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.88867 1.55554L6.33312 3.99999L3.88867 6.44443"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        prevIcon: (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.77734 6.44446L2.3329 4.00001L4.77734 1.55557"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      }}
    />
  );
}
