import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const SalesCharts = ({ stats }) => (
  <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
    <div className="parfum-panel-solid p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="parfum-eyebrow">Performance</p>
          <h3 className="mt-2 font-title text-2xl font-black">Ventes par jour</h3>
        </div>
        <span className="rounded-full bg-[#F6E7CA] px-4 py-2 text-xs font-black text-[#6F5A4A]">7 jours</span>
      </div>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.salesByDay}>
            <defs>
              <linearGradient id="salesGold" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#D8B87E" stopOpacity={0.52} />
                <stop offset="95%" stopColor="#D8B87E" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#B98D4B" strokeWidth={3} fill="url(#salesGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="parfum-panel-solid p-6">
      <p className="parfum-eyebrow">Mix catalogue</p>
      <h3 className="mt-2 font-title text-2xl font-black">Ventes par categorie</h3>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={stats.categorySales} dataKey="value" nameKey="name" outerRadius={110} label>
              {stats.categorySales.map((_, index) => <Cell key={index} fill={["#D8B87E", "#B98D4B", "#C79078", "#211817", "#F6E7CA"][index % 5]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="parfum-panel-solid p-6 xl:col-span-2">
      <p className="parfum-eyebrow">Volume</p>
      <h3 className="mt-2 font-title text-2xl font-black">Comparatif hebdomadaire</h3>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.salesByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#211817" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
