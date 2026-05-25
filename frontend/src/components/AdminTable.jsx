const AdminTable = ({ headers, children }) => (
  <div className="panel overflow-x-auto">
    <table className="w-full min-w-[820px] text-left text-sm">
      <thead className="bg-beige text-ink">
        <tr>{headers.map((header) => <th key={header} className="px-5 py-4 font-bold">{header}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-ink/10 bg-white">{children}</tbody>
    </table>
  </div>
);

export default AdminTable;
