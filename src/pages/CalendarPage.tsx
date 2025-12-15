import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { transactionApi } from "../lib/api";
import type { Transaction } from "../lib/api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [currentDate]);

  useEffect(() => {
    applyFilters();
  }, [transactions, selectedDate, filterType]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Get transactions for the current month
      const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const data = await transactionApi.getAll({
        startDate: monthStart,
        endDate: monthEnd,
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(t => 
        isSameDay(parseISO(t.transactionDate), selectedDate)
      );
    }

    // Filter by type
    if (filterType === 'income') {
      filtered = filtered.filter(t => t.isIncome);
    } else if (filterType === 'expense') {
      filtered = filtered.filter(t => !t.isIncome);
    }

    setFilteredTransactions(filtered);
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getTransactionsForDay = (day: Date) => {
    return transactions.filter(t => 
      isSameDay(parseISO(t.transactionDate), day)
    );
  };

  const getTotalForDay = (day: Date) => {
    const dayTransactions = getTransactionsForDay(day);
    const income = dayTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const isToday = (day: Date) => isSameDay(day, new Date());
  const isCurrentMonth = (day: Date) => day.getMonth() === currentDate.getMonth();

  const days = getDaysInMonth();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Calendario de Transacciones</h1>
            </div>
            <p className="text-gray-600">Visualiza tus transacciones por día, semana o mes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900">
                      {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </CardTitle>
                    <CardDescription>Selecciona un día para ver detalles</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={previousMonth}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando transacciones...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {/* Week days header */}
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                        {day}
                      </div>
                    ))}

                    {/* Days */}
                    {days.map((day, idx) => {
                      const dayTotal = getTotalForDay(day);
                      const hasTransactions = getTransactionsForDay(day).length > 0;
                      const isSelected = selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            relative p-2 md:p-3 rounded-lg transition-all min-h-[60px] md:min-h-[80px]
                            ${!isCurrentMonth(day) ? 'text-gray-300' : 'text-gray-900'}
                            ${isToday(day) ? 'bg-indigo-100 font-bold' : ''}
                            ${isSelected ? 'ring-2 ring-indigo-600 bg-indigo-50' : 'hover:bg-gray-50'}
                            ${hasTransactions ? 'border-l-2 border-l-green-500' : ''}
                          `}
                        >
                          <div className="text-sm md:text-base">{format(day, 'd')}</div>
                          {hasTransactions && (
                            <div className="mt-1 space-y-0.5">
                              {dayTotal.income > 0 && (
                                <div className="text-[10px] md:text-xs text-green-600 font-medium">
                                  +${dayTotal.income.toFixed(0)}
                                </div>
                              )}
                              {dayTotal.expense > 0 && (
                                <div className="text-[10px] md:text-xs text-red-600 font-medium">
                                  -${dayTotal.expense.toFixed(0)}
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">
                  {selectedDate 
                    ? format(selectedDate, "d 'de' MMMM", { locale: es })
                    : 'Todas las transacciones'
                  }
                </CardTitle>
                <CardDescription>
                  {filteredTransactions.length} transacción(es)
                </CardDescription>

                {/* Filters */}
                <div className="flex items-center gap-2 mt-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="all">Todas</option>
                    <option value="income">Ingresos</option>
                    <option value="expense">Gastos</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay transacciones</p>
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="mt-2 text-indigo-600 hover:underline text-sm"
                        >
                          Ver todas las transacciones
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredTransactions.map(transaction => (
                      <div
                        key={transaction.id}
                        className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {format(parseISO(transaction.transactionDate), "d 'de' MMMM, yyyy", { locale: es })}
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction.isIncome ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Summary */}
                {filteredTransactions.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Ingresos:</span>
                        <span className="text-green-600 font-semibold">
                          ${filteredTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Gastos:</span>
                        <span className="text-red-600 font-semibold">
                          ${filteredTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                        <span className="text-gray-900">Balance:</span>
                        <span className={
                          filteredTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0) -
                          filteredTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }>
                          ${(
                            filteredTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0) -
                            filteredTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
