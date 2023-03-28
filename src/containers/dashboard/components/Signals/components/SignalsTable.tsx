import { FunctionComponent, useEffect, useMemo } from "react";
import { useGetHourlySignalsQuery } from "api/horosApi";
import { useState } from "react";
import { ConfigProvider, Pagination, Table } from "antd";
import DataRenderer from "../../../common/DataRenderer";
import { ReactComponent as FolderIcon } from "@images/icons/folder.svg";
import _, { cloneDeep } from "lodash";
import Filters from "containers/dashboard/common/Filters";
import { getSignalColumns } from "../utils";
import { IFilter } from "containers/dashboard/common/Filters/types";
import { cleanFilter, config } from "../constants";
import { Signal } from "api/types/signal";
import { useMediaQuery } from "usehooks-ts";
import { Player } from "@lottiefiles/react-lottie-player";
import { Strategy } from "containers/dashboard/common/Filters/constants";
import dayjs from "dayjs";
import { previewPaginationConfig } from "containers/dashboard/constants";

interface SignalsTableProps {
  type: keyof typeof Strategy;
  previewMode?: boolean;
  visible?: boolean;
}

const SignalsTable: FunctionComponent<SignalsTableProps> = ({
  type,
  previewMode,
  visible,
}) => {
  const [skip, setSkip] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<IFilter>(cloneDeep(cleanFilter));
  const { data, isFetching, refetch } = useGetHourlySignalsQuery(
    {
      resolution: "1h",
      status: Object.keys(filter.status).filter((key) => filter.status[key]),
      created_at__gte: dayjs(dayjs(new Date()).subtract(14, "day")).format(
        "YYYY-MM-DD HH:mm"
      ),
      created_at__lte: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      side: Object.keys(filter.side).filter((key) => filter.side[key]),
      coin: Object.keys(filter.coins)
        .filter((key) => filter.coins[key])
        .map((item) => `${item}`),
      page,
    },
    { skip }
  );
  const isDesktop = useMediaQuery("(min-width: 960px)");

  const [timestamps, setTimestamps] = useState<number[]>(
    localStorage.getItem("fetchTimestamp")
      ? [Number(localStorage.getItem("fetchTimestamp"))]
      : []
  );
  const [newItemsCount, setNewItemsCount] = useState(0);

  const fetchData = async () => {
    if (visible) {
      setSkip(false);
      await refetch();
      const now = Date.now();
      setTimestamps([...timestamps, now]);
      if (!previewMode) {
        localStorage.setItem("fetchTimestamp", now.toString());
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [refetch, visible]);

  const previewData = useMemo(() => {
    if (!data || !data.results.length) return [];
    const open = data.results.filter((item: Signal) => item.status === "OPEN");
    const closed = data.results.filter(
      (item: Signal) => item.status === "CLOSE"
    );
    return _.chain(open)
      .concat(closed)
      .sortBy(["created_at"])
      .reverse()
      .value()
      .slice(0, 2);
  }, [data]);

  const columns = useMemo(() => {
    return getSignalColumns(timestamps, !isDesktop);
  }, [isDesktop, timestamps]);

  useEffect(() => {
    if (!data?.results) return;
    const created_at = new Date(timestamps[timestamps.length - 2]).getTime();
    setNewItemsCount(
      data.results.filter((s) => new Date(s.created_at).getTime() > created_at)
        .length
    );
  }, [timestamps, data?.results]);

  const dataSource = useMemo(
    () => (previewMode ? previewData : data?.results),
    [data?.results, previewData, previewMode]
  );

  return (
    <>
      <div className="flex flex-col">
        {!previewMode && (
          <div className="mb-6 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start space-x-4">
              <Filters
                {...{
                  filter,
                  setFilter,
                  config,
                  options: { coinsset: type },
                }}
              />
              {/* <span className="text-nodata">{`${data?.results?.length.toString()} results`}</span> */}
            </div>
          </div>
        )}
        <DataRenderer
          isLoading={isFetching}
          pulsation={!previewMode}
          data={data?.results || []}
          view={
            <>
              <div className="flex flex-row justify-between border-t border-white/20 py-4">
                <div className="flex flex-row items-center space-x-2 text-white/60">
                  <div className=" notify" />

                  <span className="text-xs md:text-base">
                    Wisdomise AI is searching for new predictions
                  </span>
                </div>
                {newItemsCount && !previewMode ? (
                  <div className="flex flex-row space-x-2 text-xs md:text-base">
                    <span className="text-white/50">
                      {newItemsCount} new update{newItemsCount === 1 ? "" : "s"}
                    </span>
                    <div
                      className="horos-link"
                      onClick={() => setTimestamps([...timestamps, Date.now()])}
                    >
                      Mark all as read
                    </div>
                  </div>
                ) : null}
              </div>
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
                    dataSource={dataSource}
                    columns={columns}
                    pagination={previewPaginationConfig}
                    expandable={{
                      expandedRowKeys: dataSource
                        ?.filter(
                          ({ reason_to_close }) => reason_to_close === "sell"
                        )
                        .map(({ key }) => key),
                      showExpandColumn: false,
                      defaultExpandAllRows: true,
                      expandedRowRender: (signal: Signal) => (
                        <div className="flex flex-row items-center justify-center space-x-2 rounded-full bg-white/10 py-2 text-xs text-white/40">
                          <Player
                            autoplay
                            loop
                            src="/anim/signals-small.json"
                            className="w-4"
                          ></Player>
                          <span className="text-white">
                            {dayjs(signal.exited_at).format(
                              "HH:mm:ss A - MMM D, YYYY"
                            )}
                          </span>
                          <span>•</span>
                          <span className="text-error">Sell</span>
                          <span>•</span>
                          <span className="text-error">
                            {signal.exit_price}
                          </span>
                        </div>
                      ),
                      rowExpandable: ({ reason_to_close }) =>
                        reason_to_close === "sell",
                    }}
                    rowKey="_id"
                  />
                  {previewMode ? null : (
                    <div style={{ marginTop: 20 }}>
                      <Pagination
                        defaultCurrent={page}
                        total={data?.count}
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

export default SignalsTable;
