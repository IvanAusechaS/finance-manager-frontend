import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { toast } from "../utils/toast";
import { transactionApi, tagApi, accountApi, authApi } from "../lib/api";
import type { Transaction, Tag, Account, TransactionFilters } from "../lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "../components/ui/badge";

/**
 * Validates amount field
 */
function validateAmount(amount: string): string {
  const parsedAmount = Number.parseFloat(amount);

  if (!amount || Number.isNaN(parsedAmount)) {
    return "El monto es requerido";
  }
  if (parsedAmount <= 0) {
    return "El monto debe ser mayor a 0";
  }
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return "El monto debe tener máximo 2 decimales";
  }
  return "";
}

/**
 * Validates transaction date
 */
function validateTransactionDate(transactionDate: Date | undefined): string {
  if (!transactionDate) {
    return "La fecha es requerida";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(transactionDate);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return "La fecha no puede ser futura";
  }
  return "";
}

/**
 * Validates description based on amount
 */
function validateDescription(amount: string, description: string): string {
  const parsedAmount = Number.parseFloat(amount);
  if (parsedAmount > 1000 && !description.trim()) {
    return "La descripción es obligatoria para montos mayores a $1,000";
  }
  return "";
}

/**
 * Applies filters to transactions
 */
function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
  searchQuery: string
): Transaction[] {
  let result = [...transactions];

  // Apply API filters
  if (filters.accountId) {
    result = result.filter((t) => t.tag?.accountId === filters.accountId);
  }
  if (filters.tagId) {
    result = result.filter((t) => t.tagId === filters.tagId);
  }
  if (filters.isIncome !== undefined) {
    result = result.filter((t) => t.isIncome === filters.isIncome);
  }

  // Apply search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (t) =>
        t.description?.toLowerCase().includes(query) ||
        t.tag?.name.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
    );
  }

  return result;
}

/**
 * Checks if form has unsaved changes
 */
function hasFormChanges(
  formData: { amount: string; description: string; tagId: string },
  editingTransaction: Transaction | null
): boolean {
  return (
    (formData.amount !== "" ||
      formData.description !== "" ||
      formData.tagId !== "") &&
    !editingTransaction
  );
}

/**
 * TransactionsPage Component
 * 
 * Comprehensive transaction management interface for tracking income and expenses.
 * Provides full CRUD operations with advanced filtering capabilities.
 * 
 * Features:
 * - Create, read, update, and delete transactions
 * - Filter by account, tag, transaction type (income/expense)
 * - Date range filtering with calendar picker
 * - Search transactions by description
 * - Visual distinction between income (green) and expense (red)
 * - Responsive card-based layout
 * - Real-time balance calculations
 * - Form validation and error handling
 * - Toast notifications for user feedback
 * 
 * @returns {JSX.Element} The transactions management page
 */
export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [filterAccount, setFilterAccount] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    isIncome: true,
    transactionDate: new Date(),
    description: "",
    tagId: "",
  });

  const [errors, setErrors] = useState({
    amount: "",
    transactionDate: "",
    description: "",
    tagId: "",
  });

  const resetForm = () => {
    setFormData({
      amount: "",
      isIncome: true,
      transactionDate: new Date(),
      description: "",
      tagId: "",
    });
    setErrors({
      amount: "",
      transactionDate: "",
      description: "",
      tagId: "",
    });
    setEditingTransaction(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleSubmitShortcut = () => {
      const form = document.querySelector("form") as HTMLFormElement;
      form?.requestSubmit();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when dialog is open
      if (!isDialogOpen) return;

      // Ctrl+Enter to submit
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmitShortcut();
        return;
      }

      // ESC to cancel (with confirmation if there are changes)
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancelWithConfirmation();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen, formData]);

  const handleCancelWithConfirmation = () => {
    const hasChanges = hasFormChanges(formData, editingTransaction);
    const shouldCancel = !hasChanges || globalThis.confirm(
      "¿Estás seguro de cancelar? Se perderán los cambios sin guardar."
    );

    if (shouldCancel) {
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Load profile first to get userId
      const profileData = await authApi.getProfile();

      // Load other data in parallel
      const [transactionsData, tagsData, accountsData] = await Promise.all([
        transactionApi.getAll(),
        tagApi.getAll(),
        accountApi.getAll(profileData.user.id),
      ]);

      setTransactions(transactionsData);
      setTags(tagsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error("💰 [TransactionsPage] Error loading data:", error);
      toast.error(
        "Error al cargar los datos. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const result = applyTransactionFilters(transactions, filters, searchQuery);
    setFilteredTransactions(result);
  };

  const handleFilterChange = () => {
    const newFilters: TransactionFilters = {
      ...(filterAccount !== "all" && { accountId: Number(filterAccount) }),
      ...(filterTag !== "all" && { tagId: Number(filterTag) }),
      ...(filterType !== "all" && { isIncome: filterType === "income" }),
    };

    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterAccount("all");
    setFilterTag("all");
    setFilterType("all");
    setFilters({});
    setSearchQuery("");
  };

  const openCreateDialog = () => {
    // Si no hay tags, mostrar error y no abrir el diálogo
    if (tags.length === 0) {
      toast.error(
        "Debes crear al menos una etiqueta antes de crear una transacción"
      );
      return;
    }

    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      isIncome: transaction.isIncome,
      transactionDate: new Date(transaction.transactionDate),
      description: transaction.description || "",
      tagId: transaction.tagId.toString(),
    });
    setErrors({ amount: "", transactionDate: "", description: "", tagId: "" });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors = {
      amount: validateAmount(formData.amount),
      transactionDate: validateTransactionDate(formData.transactionDate),
      description: validateDescription(formData.amount, formData.description),
      tagId: formData.tagId ? "" : "Debe seleccionar una etiqueta",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.warn("⚠️ [TransactionsPage] Validación de formulario falló");
      return;
    }

    setSubmitting(true);

    try {
      const dataToSubmit = {
        amount: Number.parseFloat(formData.amount),
        isIncome: formData.isIncome,
        transactionDate: formData.transactionDate.toISOString(),
        description: formData.description || undefined,
        tagId: Number(formData.tagId),
      };

      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, dataToSubmit);
        toast.success("Transacción actualizada correctamente");
      } else {
        await transactionApi.create(dataToSubmit);
        toast.success("Transacción creada correctamente");
      }

      setIsDialogOpen(false);
      loadData();
    } catch (error: unknown) {
      console.error("❌ [TransactionsPage] Error al guardar transacción:", error);
      toast.error(
        (error as Error).message || "Error al guardar la transacción"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;

    try {
      await transactionApi.delete(deletingTransaction.id);
      toast.success("Transacción eliminada correctamente");
      setIsDeleteDialogOpen(false);
      setDeletingTransaction(null);
      loadData();
    } catch (error: unknown) {
      console.error("Error deleting transaction:", error);
      toast.error(
        (error as Error).message || "Error al eliminar la transacción"
      );
    }
  };

  // Calcular estadísticas
  const calculateStats = (transactions: Transaction[]) => {
    const income = transactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      total: transactions.length,
      income,
      expense,
      balance: income - expense,
    };
  };

  const stats = calculateStats(filteredTransactions);

  const hasActiveFilters =
    filterAccount !== "all" ||
    filterTag !== "all" ||
    filterType !== "all" ||
    searchQuery !== "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 overflow-auto w-full mt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Transacciones
              </h1>
              <p className="text-slate-600">
                Gestiona todos tus ingresos y gastos
              </p>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Transacción
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-slate-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Transacciones
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Ingresos Totales
                  </CardTitle>
                  <ArrowUpCircle className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.income.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Gastos Totales
                  </CardTitle>
                  <ArrowDownCircle className="w-5 h-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-slate-900">
                    ${stats.expense.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Balance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p
                    className={`text-3xl font-bold ${
                      stats.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${stats.balance.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por descripción, etiqueta o monto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-blue-100 text-blue-700"
                    >
                      {
                        [filterAccount, filterTag, filterType].filter(
                          (f) => f !== "all"
                        ).length
                      }
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 shadow-xl">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-slate-900">
                    Filtrar por
                  </h4>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Cuenta
                    </Label>
                    <Select
                      value={filterAccount}
                      onValueChange={setFilterAccount}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Todas las cuentas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las cuentas</SelectItem>
                        {accounts.length > 0 ? (
                          accounts.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={account.id.toString()}
                            >
                              {account.name || `Cuenta ${account.id}`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-accounts" disabled>
                            No hay cuentas disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Etiqueta
                    </Label>
                    <Select value={filterTag} onValueChange={setFilterTag}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Todas las etiquetas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las etiquetas</SelectItem>
                        {tags.length > 0 ? (
                          tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name}{" "}
                              {tag.account?.name ? `- ${tag.account.name}` : ""}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-tags" disabled>
                            No hay etiquetas disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Tipo
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="income">
                          <span className="flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4 text-green-600" />
                            Ingresos
                          </span>
                        </SelectItem>
                        <SelectItem value="expense">
                          <span className="flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            Gastos
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleFilterChange}
                      className="flex-1"
                      size="sm"
                    >
                      Aplicar
                    </Button>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                {hasActiveFilters ? (
                  <>
                    <Filter className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-center mb-4">
                      No se encontraron transacciones con los filtros aplicados
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpiar filtros
                    </Button>
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-center mb-4">
                      No tienes transacciones registradas aún
                    </p>
                    <Button onClick={openCreateDialog} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Crear Primera Transacción
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className={`hover:shadow-md transition-shadow ${
                    transaction.isIncome
                      ? "border-l-4 border-l-green-500"
                      : "border-l-4 border-l-red-500"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`p-3 rounded-lg ${
                            transaction.isIncome ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          {transaction.isIncome ? (
                            <ArrowUpCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {transaction.description || "Sin descripción"}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Badge variant="outline" className="font-medium">
                              {transaction.tag?.name}
                            </Badge>
                            {transaction.tag?.account?.name && (
                              <>
                                <span>•</span>
                                <span>{transaction.tag.account.name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              {format(
                                new Date(transaction.transactionDate),
                                "dd MMM yyyy, HH:mm",
                                { locale: es }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-2xl font-bold ${
                            transaction.isIncome
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.isIncome ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => openEditDialog(transaction)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteDialog(transaction)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction
                      ? "Editar Transacción"
                      : "Nueva Transacción"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTransaction
                      ? "Modifica los datos de la transacción"
                      : "Registra un nuevo ingreso o gasto"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.isIncome ? "default" : "outline"}
                        className="flex-1"
                        onClick={() =>
                          setFormData({ ...formData, isIncome: true })
                        }
                      >
                        <ArrowUpCircle className="w-4 h-4 mr-2" />
                        Ingreso
                      </Button>
                      <Button
                        type="button"
                        variant={formData.isIncome ? "outline" : "default"}
                        className="flex-1"
                        onClick={() =>
                          setFormData({ ...formData, isIncome: false })
                        }
                      >
                        <ArrowDownCircle className="w-4 h-4 mr-2" />
                        Gasto
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Monto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionDate">
                      Fecha <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            errors.transactionDate ? "border-red-500" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.transactionDate ? (
                            format(formData.transactionDate, "PPP", {
                              locale: es,
                            })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.transactionDate}
                          onSelect={(date: Date | undefined) =>
                            setFormData({
                              ...formData,
                              transactionDate: date || new Date(),
                            })
                          }
                          disabled={(date: Date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.transactionDate && (
                      <p className="text-sm text-red-500">
                        {errors.transactionDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagId">
                      Etiqueta <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.tagId}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, tagId: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.tagId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecciona una etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id.toString()}>
                            {tag.name} - {tag.account?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tagId && (
                      <p className="text-sm text-red-500">{errors.tagId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descripción
                      {Number.parseFloat(formData.amount) > 1000 && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe la transacción..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                    {Number.parseFloat(formData.amount) > 1000 && (
                      <p className="text-xs text-slate-500">
                        La descripción es obligatoria para montos mayores a
                        $1,000
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelWithConfirmation}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    )}
                    {!submitting && editingTransaction && "Actualizar"}
                    {!submitting && !editingTransaction && "Crear Transacción"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará la transacción de $
                  {deletingTransaction?.amount.toFixed(2)} y ajustará el balance
                  de la cuenta automáticamente. Esta acción no se puede
                  deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </>
  );
}
