import TransactionTable from "./TransactionTable";

const Transaction: React.FC = () => {
  return (
    <div>
      <TransactionTable previewMode={true} />
    </div>
  );
};

export default Transaction;
