import { ReactComponent as FolderIcon } from "@images/icons/folder.svg";
import { Avatar, ConfigProvider, Pagination, Table } from "antd";
import { useLazyGetTransactionHistoryQuery } from "api/horosApi";
import DataRenderer from "containers/dashboard/common/DataRenderer";
import { coins, previewPaginationConfig } from "containers/dashboard/constants";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useInvestorAssetStructuresQuery } from "shared/services";

interface TransactionHistoryProps {
  previewMode?: boolean;
}

const Transaction: React.FC<TransactionHistoryProps> = ({
  previewMode,
}: TransactionHistoryProps) => {
  const [page, setPage] = useState(1);
  const [array, setArray] = useState<any>([]);
  const ias = useInvestorAssetStructuresQuery();
  const key = ias.data?.[0]?.main_exchange_account.key;

  const [trigger, transactions] = useLazyGetTransactionHistoryQuery<any>();

  const convertData = () => {
    transactions.data?.deposit_history.map((item: any) => {
      setArray([...array, { ...item, side: "Deposit" }]);
    });

    transactions.data?.withdraw_history.map((item: any) => {
      setArray([...array, { ...item, side: "Withdraw" }]);
    });
  };

  useEffect(() => {
    if (key) trigger(key);
  }, [key]);

  useEffect(() => {
    if (transactions.data) convertData();
  }, [transactions.data]);

  const convertTimeStamp = (date: any) => {
    return dayjs(date).format("YYYY-MM-DD hh:mm A");
  };

  const sortedData = useMemo(() => {
    const sortListByTime = _.sortBy(array, [
      function (item) {
        return item.insertTime;
      },
    ]);

    sortListByTime.map((item: any) => {
      item.insertTime = convertTimeStamp(item.insertTime);
      item.status = item.status === 1 ? "Completed" : "Pending";
    });

    return sortListByTime;
  }, [array]);

  const columns = [
    {
      title: "Currency",
      dataIndex: "coin",
      key: "coin",
      render: (text: any) => {
        return (
          <div className="flex items-center justify-start">
            <Avatar src={coins["BNB"].icon} />
            <p className="ml-1">{text}</p>
          </div>
        );
      },
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
    },
    {
      title: "Time",
      dataIndex: "insertTime",
      key: "insertTime",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any) => {
        return (
          <p
            className={
              text === "Completed" ? "text-gradientFrom" : "text-warning"
            }
          >
            {text}
          </p>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col bg-gray-dark p-5">
        <h1 className="text-lg font-bold text-white">Transaction History</h1>
        <p className="my-5 text-gray-light">Last Transactions</p>
        <DataRenderer
          isLoading={transactions.isLoading}
          // pulsation={!previewMode}
          data={array || []}
          view={
            <>
              <div className="w-full overflow-auto">
                <ConfigProvider
                  renderEmpty={() => (
                    <div className="flex h-64 flex-col items-center justify-center space-y-4 text-nodata">
                      <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-gradientFrom/10 fill-gradientFrom">
                        <FolderIcon />
                      </div>
                      <span>No data found</span>
                    </div>
                  )}
                >
                  <Table
                    className="horos-table mb-2 w-[64rem] max-w-[64rem] md:mb-0 md:w-full md:max-w-none"
                    dataSource={sortedData}
                    columns={columns}
                    pagination={previewPaginationConfig}
                    rowKey="_id"
                  />
                  {previewMode ? null : (
                    <div style={{ marginTop: 20 }}>
                      <Pagination
                        defaultCurrent={page}
                        total={transactions?.data.count}
                        showSizeChanger={false}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  )}
                </ConfigProvider>
              </div>
            </>
          }
        />
      </div>
    </>
  );
};

export default Transaction;
