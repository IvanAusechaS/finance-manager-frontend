import { Navbar } from "../components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useRedirect from "../basicFunctions/functions";
import { useState, useEffect } from "react";
import { accountApi, transactionApi, authApi } from "../lib/api";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export function DashboardPage() {
  console.log("📊 [DashboardPage] Componente montado");
  const { goToHome } = useRedirect();

  const [loading, setLoading] = useState(true);
  // Unused state variables - reserved for future features
  // const [userId, setUserId] = useState<number | null>(null);
  // const [accounts, setAccounts] = useState<Account[]>([]);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthIncome: 0,
    monthExpenses: 0,
    savings: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoryData, setCategoryData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user profile
      const profileResponse = await authApi.getProfile();
      const currentUserId = profileResponse.user.id;
      // setUserId(currentUserId); // Unused for now

      // Fetch accounts
      const accountsData = await accountApi.getAll(currentUserId);
      // setAccounts(accountsData); // Unused for now

      // Calculate total balance
      const totalBalance = accountsData.reduce(
        (sum, acc) => sum + acc.money,
        0
      );

      // Fetch all transactions
      const transactionsData = await transactionApi.getAll();
      // setTransactions(transactionsData); // Unused for now

      // Calculate current month stats
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const currentMonthTransactions = transactionsData.filter((t) => {
        const date = new Date(t.transactionDate);
        return date >= monthStart && date <= monthEnd;
      });

      const monthIncome = currentMonthTransactions
        .filter((t) => t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpenses = currentMonthTransactions
        .filter((t) => !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const savings = monthIncome - monthExpenses;

      setStats({
        totalBalance,
        monthIncome,
        monthExpenses,
        savings,
      });

      // Generate monthly data for chart (last 6 months)
      const monthsData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        const monthTransactions = transactionsData.filter((t) => {
          const date = new Date(t.transactionDate);
          return date >= monthStart && date <= monthEnd;
        });

        const income = monthTransactions
          .filter((t) => t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
          .filter((t) => !t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);

        monthsData.push({
          name: format(monthDate, "MMM", { locale: es }),
          ingresos: income,
          gastos: expenses,
        });
      }
      setMonthlyData(monthsData);

      // Generate category data for pie chart
      const categoryMap = new Map<string, number>();
      const colors = [
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
        "#06b6d4",
        "#ef4444",
      ];

      currentMonthTransactions
        .filter((t) => !t.isIncome)
        .forEach((t) => {
          const categoryName = t.tag?.name || "Sin categoría";
          categoryMap.set(
            categoryName,
            (categoryMap.get(categoryName) || 0) + t.amount
          );
        });

      const categoryDataArray = Array.from(categoryMap.entries())
        .map(([name, value]) => ({
          name,
          value,
          color: colors[Array.from(categoryMap.keys()).indexOf(name) % colors.length],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);

      setCategoryData(categoryDataArray);

      // Get recent transactions (last 5)
      const recentTxs = [...transactionsData]
        .sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        )
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          description: t.description || "Sin descripción",
          category: t.tag?.name || "Sin categoría",
          amount: t.isIncome ? t.amount : -t.amount,
          date: format(new Date(t.transactionDate), "yyyy-MM-dd"),
          type: t.isIncome ? "income" : "expense",
        }));

      setRecentTransactions(recentTxs);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando datos...</p>
          </div>
        </div>
      </>
    );
  }

  const statsCards = [
    {
      title: "Balance Total",
      value: `$${stats.totalBalance.toFixed(2)}`,
      change: "",
      trend: "neutral",
      icon: Wallet,
      color: "blue",
    },
    {
      title: "Ingresos del Mes",
      value: `$${stats.monthIncome.toFixed(2)}`,
      change: "",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Gastos del Mes",
      value: `$${stats.monthExpenses.toFixed(2)}`,
      change: "",
      trend: "down",
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Ahorro",
      value: `$${stats.savings.toFixed(2)}`,
      change: "",
      trend: stats.savings >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "indigo",
    },
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
          <div>
            <h1 className="text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              Bienvenido de nuevo, aquí está tu resumen financiero
            </p>
            <button
              onClick={goToHome}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to home
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-900 mb-1">{stat.value}</div>
                    {stat.change && (
                      <div className="flex items-center gap-3 text-sm">
                        {stat.trend === "up" && (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        )}
                        {stat.trend === "down" && (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={
                            stat.trend === "up"
                              ? "text-green-600"
                              : stat.trend === "down"
                                ? "text-red-600"
                                : "text-slate-600"
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-slate-500">vs mes anterior</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart - Ingresos vs Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">
                  Ingresos vs Gastos
                </CardTitle>
                <CardDescription>
                  Comparación mensual de los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ingresos"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="gastos"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Gastos por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">
                  Gastos por Categoría
                </CardTitle>
                <CardDescription>
                  Distribución de gastos este mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">
                Transacciones Recientes
              </CardTitle>
              <CardDescription>
                Últimos movimientos en tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-slate-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-slate-500">
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                ))}{" "}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
