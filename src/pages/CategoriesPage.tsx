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
import { Plus, Pencil, Trash2, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "../utils/toast";
import { categoryApi } from "../lib/api";
import type { Category, ApiError } from "../lib/api";
import { Navbar } from "../components/Navbar";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tipo: "",
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al cargar categorías", {
        description: apiError.message || "No se pudieron cargar las categorías",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await categoryApi.create({
        tipo: formData.tipo,
      });

      toast.success("Categoría creada exitosamente");
      setCategories([...categories, response.category]);
      setIsCreateOpen(false);
      setFormData({ tipo: "" });
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al crear categoría", {
        description: apiError.message || "No se pudo crear la categoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setIsSubmitting(true);

    try {
      const response = await categoryApi.update(selectedCategory.id, {
        tipo: formData.tipo,
      });

      toast.success("Categoría actualizada exitosamente");
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? response.category : cat
        )
      );
      setIsEditOpen(false);
      setSelectedCategory(null);
      setFormData({ tipo: "" });
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al actualizar categoría", {
        description: apiError.message || "No se pudo actualizar la categoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);

    try {
      await categoryApi.delete(selectedCategory.id);
      toast.success("Categoría eliminada exitosamente");
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error("Error al eliminar categoría", {
        description: apiError.message || "No se pudo eliminar la categoría",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      tipo: category.tipo,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
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
                  Gestión de Categorías
                </h1>
                <p className="text-slate-600">
                  Organiza tus finanzas con categorías personalizadas
                </p>
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Categoría</DialogTitle>
                    <DialogDescription>
                      Define una nueva categoría para clasificar tus
                      transacciones
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Nombre de la Categoría</Label>
                      <Input
                        id="tipo"
                        value={formData.tipo}
                        onChange={(e) =>
                          setFormData({ ...formData, tipo: e.target.value })
                        }
                        placeholder="Ej: Alimentación, Transporte, Salario..."
                        required
                      />
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
                          "Crear Categoría"
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
                  <TrendingUp className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay categorías
                </h3>
                <p className="text-slate-600 mb-6">
                  Comienza creando tu primera categoría para organizar tus
                  finanzas
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Primera Categoría
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow bg-white"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {category.tipo}
                            </CardTitle>
                            <CardDescription>Categoría general</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(category)}
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
        </main>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la categoría
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Nombre de la Categoría</Label>
                <Input
                  id="edit-tipo"
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  placeholder="Ej: Alimentación, Transporte, Salario..."
                  required
                />
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
                Esta acción no se puede deshacer. La categoría "
                {selectedCategory?.tipo}" será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
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
