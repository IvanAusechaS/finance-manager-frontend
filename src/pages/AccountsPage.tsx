import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "../utils/toast";
import { accountApi, categoryApi } from "../lib/api";
import type { Account, Category } from "../lib/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    money: "",
    categoryId: "",
  });

  const loadAccounts = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await accountApi.getAll(user.id);
      setAccounts(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar las cuentas"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar las categorías"
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAccounts();
      loadCategories();
    }
  }, [user, loadAccounts, loadCategories]);

  const resetForm = () => {
    setFormData({ name: "", money: "", categoryId: "" });
    setSelectedAccount(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name.trim()) {
      toast.error("El nombre de la cuenta es requerido");
      return;
    }

    if (!formData.money || parseFloat(formData.money) < 0) {
      toast.error("El monto debe ser un número válido mayor o igual a 0");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Debe seleccionar una categoría");
      return;
    }

    try {
      const response = await accountApi.create({
        name: formData.name,
        money: parseFloat(formData.money),
        categoryId: parseInt(formData.categoryId),
        userId: user.id,
      });
      toast.success("Cuenta creada exitosamente");
      setAccounts([...accounts, response.account]);
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear la cuenta"
      );
    }
  };

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      name: account.name || "",
      money: account.money.toString(),
      categoryId: account.categoryId.toString(),
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    if (!formData.name.trim()) {
      toast.error("El nombre de la cuenta es requerido");
      return;
    }

    if (!formData.money || parseFloat(formData.money) < 0) {
      toast.error("El monto debe ser un número válido mayor o igual a 0");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Debe seleccionar una categoría");
      return;
    }

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
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar la cuenta"
      );
    }
  };

  const handleDeleteClick = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;

    try {
      await accountApi.delete(selectedAccount.id);
      toast.success("Cuenta eliminada exitosamente");
      setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
      setIsDeleteOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar la cuenta"
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex py-12 min-h-screen bg-slate-50">
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Gestión de Cuentas
                </h1>
                <p className="text-slate-600">
                  Administra tus cuentas bancarias y registra tus finanzas
                </p>
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Cuenta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva Cuenta</DialogTitle>
                    <DialogDescription>
                      Crea una nueva cuenta para gestionar tus finanzas
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreate}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nombre *</Label>
                  <Input
                    id="create-name"
                    placeholder="Mi cuenta bancaria"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-money">Saldo Inicial *</Label>
                  <Input
                    id="create-money"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.money}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, money: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-category">Categoría *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger id="create-category">
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
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Crear Cuenta</Button>
              </DialogFooter>
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
            ) : accounts.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <div className="text-slate-400 mb-4">
                  <p className="text-lg font-medium">No hay cuentas registradas</p>
                  <p className="text-sm mt-2">
                    Comienza creando tu primera cuenta bancaria
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <Card
                    key={account.id}
                    className="hover:shadow-lg transition-shadow bg-white"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{account.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(account)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(account)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-slate-500">
                            Saldo:
                          </span>
                          <p className="text-xl font-bold text-green-600">
                            ${account.money.toFixed(2)}
                          </p>
                        </div>
                        {account.category && (
                          <div>
                            <span className="text-sm text-slate-500">
                              Categoría:
                            </span>
                            <p className="font-medium">{account.category.tipo}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cuenta</DialogTitle>
              <DialogDescription>
                Modifica los datos de la cuenta
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Mi cuenta bancaria"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-money">Saldo *</Label>
                  <Input
                    id="edit-money"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.money}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, money: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger id="edit-category">
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
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará
                permanentemente la cuenta{" "}
                <span className="font-semibold">{selectedAccount?.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={resetForm}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}

