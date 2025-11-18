import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Pencil, Trash2, Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  accountApi,
  categoryApi,
  authApi,
} from "../lib/api";
import type { Account, Category, ApiError } from "../lib/api";
import { Navbar } from "../components/Navbar";

export function AccountsPage() {
  console.log("🏦 [AccountsPage] Componente montado");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    money: "",
    categoryId: "",
  });

  // Load accounts and categories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // First, get user profile to get userId
      const profileResponse = await authApi.getProfile();
      const currentUserId = profileResponse.user.id;
      setUserId(currentUserId);

      // Then load categories
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);

      // If categories exist, try to load accounts
      if (categoriesData.length > 0) {
        try {
          const accountsData = await accountApi.getAll(currentUserId);
          setAccounts(accountsData);
        } catch (accountError) {
          // If account endpoint doesn't exist yet, just set empty array
          console.warn("Account endpoint not available yet:", accountError);
          setAccounts([]);
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al cargar datos", {
        description: apiError.message || "No se pudieron cargar las categorías",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Error: Usuario no identificado");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await accountApi.create({
        name: formData.name,
        money: parseFloat(formData.money),
        categoryId: parseInt(formData.categoryId),
        userId: userId,
      });

      toast.success("Cuenta creada exitosamente");
      setAccounts([...accounts, response.account]);
      setIsCreateOpen(false);
      setFormData({ name: "", money: "", categoryId: "" });
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error creating account:", error);
      toast.error("Error al crear cuenta", {
        description: apiError.message || "No se pudo crear la cuenta",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setIsSubmitting(true);

    try {
      const response = await accountApi.update(selectedAccount.id, {
        name: formData.name,
        money: parseFloat(formData.money),
        categoryId: parseInt(formData.categoryId),
      });

      toast.success("Cuenta actualizada exitosamente");
      setAccounts(
        accounts.map((acc) =>
          acc.id === selectedAccount.id ? response.account : acc
        )
      );
      setIsEditOpen(false);
      setSelectedAccount(null);
      setFormData({ name: "", money: "", categoryId: "" });
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al actualizar cuenta", {
        description: apiError.message || "No se pudo actualizar la cuenta",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;

    setIsSubmitting(true);

    try {
      await accountApi.delete(selectedAccount.id);
      toast.success("Cuenta eliminada exitosamente");
      setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
      setIsDeleteOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al eliminar cuenta", {
        description: apiError.message || "No se pudo eliminar la cuenta",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      name: account.name || "",
      money: account.money.toString(),
      categoryId: account.categoryId.toString(),
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteOpen(true);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.tipo || "Sin categoría";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Gestión de Cuentas
                </h1>
                <p className="text-slate-600">
                  Administra tus cuentas y saldos disponibles
                </p>
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={categories.length === 0}>
                    <Plus className="w-4 h-4" />
                    Nueva Cuenta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Cuenta</DialogTitle>
                    <DialogDescription>
                      Agrega una nueva cuenta para gestionar tus finanzas
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Cuenta</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ej: Cuenta de ahorros, Efectivo..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="money">Saldo Inicial</Label>
                      <Input
                        id="money"
                        type="number"
                        step="0.01"
                        value={formData.money}
                        onChange={(e) =>
                          setFormData({ ...formData, money: e.target.value })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Categoría</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, categoryId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          "Crear Cuenta"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : categories.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <div className="text-slate-400 mb-4">
                  <Wallet className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Primero crea categorías
                </h3>
                <p className="text-slate-600 mb-6">
                  Necesitas crear al menos una categoría antes de poder crear
                  cuentas
                </p>
                <Button
                  onClick={() => (window.location.href = "/categories")}
                  className="gap-2"
                >
                  Ir a Categorías
                </Button>
              </Card>
            ) : accounts.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <div className="text-slate-400 mb-4">
                  <Wallet className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay cuentas
                </h3>
                <p className="text-slate-600 mb-6">
                  Comienza creando tu primera cuenta para gestionar tus finanzas
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Primera Cuenta
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => (
                  <Card
                    key={account.id}
                    className="hover:shadow-lg transition-shadow bg-white"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-700">
                            <Wallet className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {account.name || "Sin nombre"}
                            </CardTitle>
                            <CardDescription>
                              {getCategoryName(account.categoryId)}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-1">
                          Saldo disponible
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(account.money)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => openEditDialog(account)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(account)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Cuenta</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la cuenta
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre de la Cuenta</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Cuenta de ahorros, Efectivo..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-money">Saldo</Label>
                  <Input
                    id="edit-money"
                    type="number"
                    step="0.01"
                    value={formData.money}
                    onChange={(e) =>
                      setFormData({ ...formData, money: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-categoryId">Categoría</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La cuenta "
                  {selectedAccount?.name}" será eliminada permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
    </>
  );
}
