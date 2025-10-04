import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart as RBarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Search,
  Filter,
  Download,
  CalendarDays,
  Moon,
  Sun,
  TrendingUp,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Factory,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* =====================================================
   Mock Data & Utils (replace with API later)
   ===================================================== */
const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]; // blue, green, amber, red, violet

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function range(n: number) { return Array.from({ length: n }, (_, i) => i); }

function makeMonthly(n = 12) {
  // returns array of {month, orders, revenue, returns}
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return range(n).map((i) => {
    const orders = 200 + Math.floor(Math.random() * 400);
    const revenue = orders * (2500 + Math.floor(Math.random() * 4500));
    const returns = Math.floor(orders * (0.02 + Math.random() * 0.05));
    return { month: months[i], orders, revenue, returns };
  });
}

function makeTopSkus(n = 8) {
  return range(n).map((i) => ({
    sku: `SKU-${1000 + i}`,
    name: ["Sofa Alpha","Sofa Beta","Recliner Pro","Bed Frame","Side Table","TV Unit","Dining Set","Wardrobe"][i % 8],
    qty: 50 + Math.floor(Math.random() * 240),
    revenue: 150000 + Math.floor(Math.random() * 900000),
  }));
}

function makeIssues(n = 6) {
  const sev = ["Low","Medium","High","Critical"];
  const area = ["Production","Logistics","QC","Payments","Returns","Inventory"];
  return range(n).map((i) => ({
    id: `ISS-${2340 + i}`,
    title: ["QC variance","Packing delay","Payment gateway error","Inventory mismatch","Shipment hold","Label printing error"][i % 6],
    area: area[i % area.length],
    severity: sev[Math.min(3, Math.floor(Math.random() * 4))],
    openSince: `${1 + Math.floor(Math.random() * 12)}d`,
    owner: ["Aditi","Rohit","System","Arun","Meera"][i % 5],
    status: ["Open","Investigating","Mitigated"][i % 3],
  }));
}

const monthly = makeMonthly(12);
const topSkus = makeTopSkus(8);
const issues = makeIssues(7);

/* KPI calculations */
const totals = monthly.reduce(
  (acc, m) => {
    acc.orders += m.orders;
    acc.revenue += m.revenue;
    acc.returns += m.returns;
    return acc;
  },
  { orders: 0, revenue: 0, returns: 0 }
);

/* =====================================================
   Reusable Atoms
   ===================================================== */
function MiniSpark({ data, dataKey = "orders" }: { data: Record<string, any>[], dataKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
        <Area type="monotone" dataKey={dataKey} stroke="#2563eb" fill="#bfdbfe" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ title, value, delta, icon, trendKey }: { title: string, value: string, delta: number, icon: React.ReactNode, trendKey: string }) {
  const DeltaIcon = delta >= 0 ? ArrowUpRight : ArrowDownRight;
  const deltaClass = delta >= 0 ? "text-green-600" : "text-red-600";
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <Badge variant="secondary" className={`gap-1 ${deltaClass}`}>
          <DeltaIcon className="w-3 h-3" /> {Math.abs(delta)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="mt-2">
          <MiniSpark data={monthly} dataKey={trendKey} />
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, children, right }: { title: string, children: React.ReactNode, right?: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-2xl shadow-sm">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">{right}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* =====================================================
   Main Dashboard
   ===================================================== */
export default function DashboardPro() {
  const [dark, setDark] = useState(false);
  const [rangeDays, setRangeDays] = useState(90);
  const [query, setQuery] = useState("");

  // Derived: filter monthly data by range (demo-only)
  const dataInRange = useMemo(() => monthly.slice(-Math.min(12, Math.ceil(rangeDays / 30))), [rangeDays]);

  const revenueTrend = useMemo(() => dataInRange.map((m) => ({ month: m.month, revenue: m.revenue, orders: m.orders, returns: m.returns })), [dataInRange]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className={`min-h-screen ${dark ? "bg-neutral-900 text-neutral-100" : "bg-gray-50 text-neutral-900"} p-6`}> 
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ERP Dashboard</h1>
            <Badge variant="outline" className="hidden md:inline">Live</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders, customers, SKUs..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/> Filters</Button>
            <Button variant="outline" className="gap-2" onClick={() => setDark((d) => !d)}>
              {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              {dark ? "Light" : "Dark"}
            </Button>
            <Button className="gap-2"><Download className="w-4 h-4"/> Export</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={totals.orders.toLocaleString()} delta={8} icon={<Package className="w-4 h-4 text-blue-500"/>} trendKey="orders" />
          <StatCard title="Revenue" value={fmtINR(totals.revenue)} delta={12} icon={<TrendingUp className="w-4 h-4 text-green-600"/>} trendKey="revenue" />
          <StatCard title="Returns" value={totals.returns.toLocaleString()} delta={-3} icon={<AlertTriangle className="w-4 h-4 text-amber-500"/>} trendKey="returns" />
          <StatCard title="OTIF (On-time In-full)" value={"92%"} delta={2} icon={<Truck className="w-4 h-4 text-violet-500"/>} trendKey="orders" />
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales vs Orders */}
          <Section title="Sales vs Orders (last period)" right={<DateRange rangeDays={rangeDays} setRangeDays={setRangeDays} />}> 
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" name="Orders" fill={COLORS[0]} radius={[6,6,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS[1]} strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Fulfillment Funnel */}
          <Section title="Fulfillment Funnel" right={<Badge variant="secondary">This week</Badge>}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Packed", val: 820 },
                { label: "Shipped", val: 760 },
                { label: "Delivered", val: 690 },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-semibold mt-1">{s.val}</div>
                  <div className="h-2 rounded bg-muted overflow-hidden mt-3">
                    <div className="h-full" style={{ width: `${Math.min(100, (s.val/900)*100)}%`, background: COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Drop-off from Packed → Delivered: <span className="font-medium text-amber-600">16%</span></div>
          </Section>

          {/* Production Utilization */}
          <Section title="Production Utilization" right={<Factory className="w-4 h-4"/>}>
            <div className="h-72 grid grid-cols-2 gap-4 items-center">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="35%" outerRadius="90%" data={[{ name: "Utilization", uv: 76 }]} startAngle={90} endAngle={-270}>
                    <RadialBar background dataKey="uv" fill={COLORS[2]} />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span>Cutting</span><span className="font-medium">82%</span></div>
                <div className="w-full h-2 bg-muted rounded"><div className="h-2 rounded" style={{width:"82%", background:COLORS[0]}}/></div>
                <div className="flex items-center justify-between"><span>Assembly</span><span className="font-medium">74%</span></div>
                <div className="w-full h-2 bg-muted rounded"><div className="h-2 rounded" style={{width:"74%", background:COLORS[1]}}/></div>
                <div className="flex items-center justify-between"><span>Polishing</span><span className="font-medium">69%</span></div>
                <div className="w-full h-2 bg-muted rounded"><div className="h-2 rounded" style={{width:"69%", background:COLORS[3]}}/></div>
              </div>
            </div>
          </Section>
        </div>

        {/* Tables & Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top SKUs */}
          <Section title="Top SKUs by Revenue" right={<Button variant="outline" size="sm">View All</Button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left p-2">SKU</th>
                    <th className="text-left p-2">Product</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topSkus.map((r) => (
                    <tr key={r.sku} className="hover:bg-muted/30">
                      <td className="p-2 font-mono">{r.sku}</td>
                      <td className="p-2">{r.name}</td>
                      <td className="p-2 text-right">{r.qty}</td>
                      <td className="p-2 text-right">{fmtINR(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Issue Center */}
          <Section title="Issue Center" right={<Badge variant="destructive">{issues.length} Open</Badge>}>
            <div className="space-y-3">
              {issues.map((iss) => (
                <div key={iss.id} className="rounded-xl border p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{iss.area}</Badge>
                      <span className={`text-xs ${iss.severity === 'Critical' ? 'text-red-600' : iss.severity === 'High' ? 'text-amber-600' : 'text-muted-foreground'}`}>{iss.severity}</span>
                    </div>
                    <div className="font-medium mt-1">{iss.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Owner: {iss.owner} • Open {iss.openSince}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Snooze</Button>
                    <Button size="sm">Resolve</Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Activity Feed */}
          <Section title="Activity" right={<Activity className="w-4 h-4"/>}>
            <ul className="space-y-3 text-sm">
              {[1,2,3,4,5,6].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-1"/>
                  <div>
                    <div className="font-medium">Order ORD-{1012 + i} updated</div>
                    <div className="text-muted-foreground">Status changed to Shipped • {1 + i}h ago</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Returns Breakdown">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: "Damaged", value: 32 },
                    { name: "Defect", value: 21 },
                    { name: "Wrong Item", value: 14 },
                    { name: "Customer Remorse", value: 18 },
                    { name: "Other", value: 15 },
                  ]} dataKey="value" cx="50%" cy="50%" outerRadius={96} label>
                    {range(5).map((i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Lead Time Trend (days)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={dataInRange}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke={COLORS[0]} />
                  <Line type="monotone" dataKey="returns" stroke={COLORS[3]} />
                </RLineChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

      </div>
    </div>
  );
}

/* =====================================================
   Small Controls
   ===================================================== */
function DateRange({ rangeDays, setRangeDays }: { rangeDays: number, setRangeDays: (days: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CalendarDays className="w-4 h-4 text-muted-foreground"/>
      <span className="text-muted-foreground">Range:</span>
      <div className="flex items-center gap-1">
        {[30, 90, 180, 365].map((d) => (
          <button
            key={d}
            onClick={() => setRangeDays(d)}
            className={`px-2 py-1 rounded border text-xs ${rangeDays===d ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
          >
            {d === 365 ? '1Y' : `${d}D`}
          </button>
        ))}
      </div>
    </div>
  );
}
