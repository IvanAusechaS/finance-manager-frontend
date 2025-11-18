import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { BarChart3, PieChart, TrendingUp, Calendar, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  transactionApi,
  accountApi,
  authApi,
  type Transaction,
  type Account,
} from "../lib/api";
import {
  format,
  startOfMonth,
  endOfMonth,
  parseISO,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

/**
 * Interface representing statistics for a spending category
 * @interface CategoryStats
 */
interface CategoryStats {
  /** Category/tag name */
  name: string;
  /** Total amount spent in this category */
  amount: number;
  /** Percentage of total expenses */
  percentage: number;
  /** Color code for visualization */
  color: string;
}

/**
 * Interface representing monthly financial trends
 * @interface MonthlyTrend
 */
interface MonthlyTrend {
  /** Month abbreviation (e.g., "Ene", "Feb") */
  month: string;
  /** Total income for the month */
  income: number;
  /** Total expenses for the month */
  expenses: number;
}

/**
 * Statistics page component for financial analysis
 * Displays monthly trends, category breakdowns, and summary metrics
 * @component
 */
export function StatisticsPage() {
  console.log("📈 [StatisticsPage] Component mounted");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<{
    incomeChange: number;
    expenseChange: number;
    transactionChange: number;
  }>({ incomeChange: 0, expenseChange: 0, transactionChange: 0 });

  const CHART_COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
  ];

  useEffect(() => {
    loadData();
  }, [selectedAccount]);

  /**
   * Load all necessary data for statistics calculation
   * Fetches user profile, accounts, and transactions
   * @async
   */
  const loadData = async () => {
    console.log("📊 [StatisticsPage] Loading data for account:", selectedAccount);
    try {
      setIsLoading(true);

      // Get user profile first to get userId
      const profileResponse = await authApi.getProfile();
      const userId = profileResponse.user.id;

      // Load accounts
      const accountsData = await accountApi.getAll(userId);
      setAccounts(accountsData);
      console.log("✅ [StatisticsPage] Loaded accounts:", accountsData.length);

      // Load transactions
      const filters: { accountId?: number } = {};
      if (selectedAccount !== "all") {
        filters.accountId = parseInt(selectedAccount);
      }

      const transactionsData = await transactionApi.getAll(filters);
      setTransactions(transactionsData);
      console.log("✅ [StatisticsPage] Loaded transactions:", transactionsData.length);

      // Calculate statistics
      calculateCategoryStats(transactionsData);
      calculateMonthlyTrends(transactionsData);
      calculateComparisons(transactionsData);
      console.log("✅ [StatisticsPage] Statistics calculated successfully");
    } catch (error) {
      console.error("❌ [StatisticsPage] Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculate spending statistics grouped by category/tag
   * @param {Transaction[]} transactions - Array of transactions to analyze
   */
  const calculateCategoryStats = (transactions: Transaction[]) => {
    console.log("📊 [StatisticsPage] Calculating category stats");
    // Group expenses by tag
    const expensesByTag: { [key: string]: number } = {};
    let totalExpenses = 0;

    transactions
      .filter((t) => !t.isIncome)
      .forEach((t) => {
        const tagName = t.tag?.name || "Sin categoría";
        expensesByTag[tagName] = (expensesByTag[tagName] || 0) + t.amount;
        totalExpenses += t.amount;
      });

    // Convert to array and calculate percentages
    const stats: CategoryStats[] = Object.entries(expensesByTag)
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: (amount / totalExpenses) * 100,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 categories

    setCategoryStats(stats);
    console.log("✅ [StatisticsPage] Category stats calculated:", stats.length, "categories");
  };

  /**
   * Calculate monthly income and expense trends for the last 6 months
   * @param {Transaction[]} transactions - Array of transactions to analyze
   */
  const calculateMonthlyTrends = (transactions: Transaction[]) => {
    console.log("📊 [StatisticsPage] Calculating monthly trends");
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    const trends: MonthlyTrend[] = months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTransactions = transactions.filter((t) => {
        const date = parseISO(t.transactionDate);
        return date >= monthStart && date <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, "MMM", { locale: es }),
        income,
        expenses,
      };
    });

    setMonthlyTrends(trends);
    console.log("✅ [StatisticsPage] Monthly trends calculated:", trends.length, "months");
  };

  /**
   * Calculate comparison metrics between current and previous month
   * @param {Transaction[]} transactions - Array of transactions to analyze
   */
  const calculateComparisons = (transactions: Transaction[]) => {
    console.log("📊 [StatisticsPage] Calculating comparison metrics");
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Current month transactions
    const currentMonthTransactions = transactions.filter((t) => {
      const date = parseISO(t.transactionDate);
      return date >= currentMonthStart;
    });

    // Previous month transactions
    const previousMonthTransactions = transactions.filter((t) => {
      const date = parseISO(t.transactionDate);
      return date >= previousMonthStart && date <= previousMonthEnd;
    });

    // Calculate totals
    const currentIncome = currentMonthTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousIncome = previousMonthTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousExpenses = previousMonthTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage changes
    const incomeChange = previousIncome > 0 
      ? ((currentIncome - previousIncome) / previousIncome) * 100 
      : 0;
    
    const expenseChange = previousExpenses > 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 
      : 0;
    
    const transactionChange = previousMonthTransactions.length > 0
      ? ((currentMonthTransactions.length - previousMonthTransactions.length) / previousMonthTransactions.length) * 100
      : 0;

    setComparisonData({ incomeChange, expenseChange, transactionChange });
    console.log("✅ [StatisticsPage] Comparisons calculated:", { incomeChange, expenseChange, transactionChange });
  };

  const maxValue = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.income, t.expenses))
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 overflow-auto bg-slate-50 mt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Estadísticas
              </h1>
              <p className="text-slate-600">
                Analiza tus patrones de gasto e ingreso
              </p>
            </div>
            <div className="w-64">
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las cuentas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las cuentas</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Cargando estadísticas...</p>
            </div>
          ) : (
            <>
              {/* Monthly Trends Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">
                        Tendencia Mensual
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Ingresos vs Gastos - Últimos 6 meses
                      </p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-end gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-slate-600">Ingresos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-slate-600">Gastos</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {monthlyTrends.map((trend, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-900 capitalize w-16">
                              {trend.month}
                            </span>
                            <div className="flex-1 mx-4 flex gap-1">
                              <div
                                className="bg-green-500 rounded h-8 transition-all"
                                style={{
                                  width: `${(trend.income / maxValue) * 100}%`,
                                }}
                                title={`Ingresos: $${trend.income.toFixed(2)}`}
                              />
                              <div
                                className="bg-red-500 rounded h-8 transition-all"
                                style={{
                                  width: `${
                                    (trend.expenses / maxValue) * 100
                                  }%`,
                                }}
                                title={`Gastos: $${trend.expenses.toFixed(2)}`}
                              />
                            </div>
                            <div className="flex gap-3 w-48 justify-end text-xs">
                              <span className="text-green-600 font-semibold">
                                +${trend.income.toFixed(0)}
                              </span>
                              <span className="text-red-600 font-semibold">
                                -${trend.expenses.toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">
                        Gastos por Categoría
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Distribución de tus gastos
                      </p>
                    </div>
                    <PieChart className="w-6 h-6 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  {categoryStats.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      No hay datos de gastos disponibles
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pie-like visualization */}
                      <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          {categoryStats.map((stat, index) => {
                            const cumulativePercentage = categoryStats
                              .slice(0, index)
                              .reduce((sum, s) => sum + s.percentage, 0);

                            return (
                              <div
                                key={stat.name}
                                className="absolute inset-0 rounded-full border-8 transition-all hover:scale-105"
                                style={{
                                  borderColor: stat.color,
                                  transform: `rotate(${
                                    cumulativePercentage * 3.6
                                  }deg)`,
                                  clipPath: `polygon(50% 50%, 50% 0%, ${
                                    50 +
                                    50 *
                                      Math.cos(
                                        (stat.percentage * 3.6 * Math.PI) / 180
                                      )
                                  }% ${
                                    50 -
                                    50 *
                                      Math.sin(
                                        (stat.percentage * 3.6 * Math.PI) / 180
                                      )
                                  }%)`,
                                }}
                                title={`${stat.name}: ${stat.percentage.toFixed(
                                  1
                                )}%`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend and details */}
                      <div className="space-y-3">
                        {categoryStats.map((stat) => (
                          <div
                            key={stat.name}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: stat.color }}
                              />
                              <span className="text-sm font-medium text-slate-900">
                                {stat.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">
                                ${stat.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {stat.percentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Total Transacciones
                      </CardTitle>
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">
                      {transactions.length}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-slate-500">
                        Registradas en el sistema
                      </p>
                      {comparisonData.transactionChange !== 0 && (
                        <span
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            comparisonData.transactionChange > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {comparisonData.transactionChange > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(comparisonData.transactionChange).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Promedio Mensual
                      </CardTitle>
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">
                      $
                      {monthlyTrends.length > 0
                        ? (
                            monthlyTrends.reduce(
                              (sum, t) => sum + t.income,
                              0
                            ) / monthlyTrends.length
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-slate-500">
                        Ingresos promedio
                      </p>
                      {comparisonData.incomeChange !== 0 && (
                        <span
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            comparisonData.incomeChange > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {comparisonData.incomeChange > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(comparisonData.incomeChange).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Categorías Activas
                      </CardTitle>
                      <PieChart className="w-5 h-5 text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-slate-900">
                      {categoryStats.length}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Con gastos registrados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Cambio en Gastos
                      </CardTitle>
                      <TrendingDown className="w-5 h-5 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-3xl font-bold ${
                        comparisonData.expenseChange > 0
                          ? "text-red-600"
                          : comparisonData.expenseChange < 0
                          ? "text-green-600"
                          : "text-slate-900"
                      }`}
                    >
                      {comparisonData.expenseChange > 0 ? "+" : ""}
                      {comparisonData.expenseChange.toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-slate-500">
                        vs. mes anterior
                      </p>
                      {comparisonData.expenseChange !== 0 && (
                        <span
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            comparisonData.expenseChange < 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {comparisonData.expenseChange < 0 ? "Mejora" : "Aumento"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
