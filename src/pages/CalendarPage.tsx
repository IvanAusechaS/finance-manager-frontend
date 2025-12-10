import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { SimpleCalendar } from "../components/ui/SimpleCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
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
  isSameDay,
  parseISO,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MonthlyStats {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

export function CalendarPage() {
  console.log("📅 [CalendarPage] Componente montado");
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [stats, setStats] = useState<MonthlyStats>({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    balanceChange: 0,
    incomeChange: 0,
    expensesChange: 0,
    savingsChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    loadData();
  }, [selectedAccount]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Get user profile first to get userId
      const profileResponse = await authApi.getProfile();
      const userId = profileResponse.user.id;

      // Load accounts
      const accountsData = await accountApi.getAll(userId);
      setAccounts(accountsData);

      // Load transactions
      const filters: { accountId?: number } = {};
      if (selectedAccount !== "all") {
        filters.accountId = parseInt(selectedAccount);
      }

      const transactionsData = await transactionApi.getAll(filters);
      setTransactions(transactionsData);

      // Calculate monthly stats
      calculateMonthlyStats(transactionsData, accountsData);

      // Get recent transactions (last 5)
      const sorted = [...transactionsData].sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      );
      setRecentTransactions(sorted.slice(0, 5));
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyStats = (
    transactions: Transaction[],
    accounts: Account[]
  ) => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Current month
    const currentMonthTransactions = transactions.filter((t) => {
      const date = parseISO(t.transactionDate);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const currentIncome = currentMonthTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month
    const lastMonthTransactions = transactions.filter((t) => {
      const date = parseISO(t.transactionDate);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    const lastIncome = lastMonthTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const lastExpenses = lastMonthTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate balance from accounts
    let totalBalance = 0;
    if (selectedAccount === "all") {
      totalBalance = accounts.reduce((sum, acc) => sum + acc.money, 0);
    } else {
      const account = accounts.find(
        (acc) => acc.id === parseInt(selectedAccount)
      );
      totalBalance = account?.money || 0;
    }

    const currentSavings = currentIncome - currentExpenses;
    const lastSavings = lastIncome - lastExpenses;

    // Calculate percentage changes
    const incomeChange =
      lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
    const expensesChange =
      lastExpenses > 0
        ? ((currentExpenses - lastExpenses) / lastExpenses) * 100
        : 0;
    const savingsChange =
      lastSavings > 0
        ? ((currentSavings - lastSavings) / lastSavings) * 100
        : 0;
    const balanceChange =
      lastIncome > 0
        ? ((totalBalance - (totalBalance - currentSavings + lastSavings)) /
            (totalBalance - currentSavings + lastSavings)) *
          100
        : 0;

    setStats({
      balance: totalBalance,
      income: currentIncome,
      expenses: currentExpenses,
      savings: currentSavings,
      balanceChange,
      incomeChange,
      expensesChange,
      savingsChange,
    });
  };

  // Get transactions for a specific day
  const getTransactionsForDay = (day: Date): Transaction[] => {
    return transactions.filter((t) => {
      const transactionDate = parseISO(t.transactionDate);
      return isSameDay(transactionDate, day);
    });
  };

  // Handle "Ver más..." click
  const handleViewMore = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    navigate(`/transactions?date=${dateStr}`);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 overflow-auto w-full mt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Calendario Financiero
              </h1>
              <p className="text-slate-600">
                Visualiza tus transacciones y rendimiento mensual
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Balance Total */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Balance Total
                  </CardTitle>
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.balance.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      stats.balanceChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.balanceChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {Math.abs(stats.balanceChange).toFixed(1)}%
                    </span>
                    <span className="ml-1 text-slate-500">vs mes anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingresos del Mes */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Ingresos del Mes
                  </CardTitle>
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.income.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      stats.incomeChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.incomeChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {Math.abs(stats.incomeChange).toFixed(1)}%
                    </span>
                    <span className="ml-1 text-slate-500">vs mes anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gastos del Mes */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Gastos del Mes
                  </CardTitle>
                  <ArrowDownRight className="w-5 h-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.expenses.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      stats.expensesChange <= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.expensesChange <= 0 ? (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {Math.abs(stats.expensesChange).toFixed(1)}%
                    </span>
                    <span className="ml-1 text-slate-500">vs mes anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ahorro */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Ahorro
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.savings.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      stats.savingsChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.savingsChange >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">
                      {Math.abs(stats.savingsChange).toFixed(1)}%
                    </span>
                    <span className="ml-1 text-slate-500">vs mes anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar - Takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Calendario de Transacciones
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Haz clic en un día para ver las transacciones
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="rounded-md border p-4 w-full bg-white">
                    <SimpleCalendar
                      selected={date}
                      onSelect={setDate}
                    />
                  </div>

                  {/* Transactions for selected day */}
                  {date && (
                    <div className="w-full mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
                          {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                        </h3>
                        <Badge variant="secondary">
                          {getTransactionsForDay(date).length} transacciones
                        </Badge>
                      </div>

                      {getTransactionsForDay(date).length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">
                          No hay transacciones en este día
                        </p>
                      ) : (
                        <>
                          {getTransactionsForDay(date)
                            .slice(0, 5)
                            .map((transaction) => (
                              <div
                                key={transaction.id}
                                className={`p-3 bg-slate-50 rounded-lg border-l-4 ${
                                  transaction.isIncome
                                    ? "border-l-green-500"
                                    : "border-l-red-500"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-900">
                                      {transaction.description}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                      {transaction.tag?.account?.name ||
                                        "Sin cuenta"}{" "}
                                      •{" "}
                                      {transaction.tag?.name || "Sin etiqueta"}
                                    </p>
                                  </div>
                                  <div
                                    className={`text-right ${
                                      transaction.isIncome
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    <p className="font-bold">
                                      {transaction.isIncome ? "+" : "-"}$
                                      {transaction.amount.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {getTransactionsForDay(date).length > 5 && (
                            <button
                              onClick={() => handleViewMore(date)}
                              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              Ver más...
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions - Takes 1 column */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Transacciones Recientes
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Últimos 5 movimientos
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoading ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                      Cargando...
                    </p>
                  ) : recentTransactions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No hay transacciones recientes
                    </p>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`p-3 bg-slate-50 rounded-lg border-l-4 ${
                          transaction.isIncome
                            ? "border-l-green-500"
                            : "border-l-red-500"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(
                                parseISO(transaction.transactionDate),
                                "d MMM",
                                { locale: es }
                              )}{" "}
                              • {transaction.tag?.name || "Sin etiqueta"}
                            </p>
                          </div>
                          <div
                            className={`text-right font-bold whitespace-nowrap ${
                              transaction.isIncome
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.isIncome ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
