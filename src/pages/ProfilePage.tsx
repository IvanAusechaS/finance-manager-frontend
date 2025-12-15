import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { toast } from "../utils/toast";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Mail, Lock, Trash2, Edit } from "lucide-react";

interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: "", email: "" });

  // Change Password Dialog
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete Account Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getProfile();
      setUser(response.user);
      setEditForm({
        nickname: response.user.nickname || "",
        email: response.user.email,
      });
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error al cargar perfil");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.nickname.trim()) {
      toast.error("El nombre de usuario es requerido");
      return;
    }

    if (!editForm.email.trim()) {
      toast.error("El email es requerido");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.updateProfile({
        nickname: editForm.nickname,
        email: editForm.email,
      });

      setUser(response.user);
      toast.success("Perfil actualizado exitosamente");
      setIsEditDialogOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error al actualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      toast.success("Contraseña actualizada exitosamente");
      setIsPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error al cambiar contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("La contraseña es requerida");
      return;
    }

    if (!deleteConfirm) {
      toast.error(
        "Debes confirmar que entiendes que esta acción es irreversible"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.deleteAccount({ password: deletePassword });

      toast.success("Cuenta eliminada exitosamente");
      navigate("/login");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error al eliminar cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center mt-16">
          <div className="text-slate-600">Cargando perfil...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Gestión de Cuenta
            </h1>
            <p className="text-slate-600 mt-1">
              Administra tu información personal y preferencias
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Información del Perfil
                </h2>
                <Button
                  onClick={() => setIsEditDialogOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>

              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {user && getInitials(user.nickname || user.email)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-slate-400" />
                      <Label className="text-sm text-slate-600">
                        Nombre de usuario
                      </Label>
                    </div>
                    <p className="text-slate-900 font-medium">
                      {user?.nickname || "Sin nombre"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <Label className="text-sm text-slate-600">
                        Correo electrónico
                      </Label>
                    </div>
                    <p className="text-slate-900 font-medium">{user?.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-600">
                      Miembro desde
                    </Label>
                    <p className="text-slate-900 font-medium">
                      {user && formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Seguridad
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Contraseña</p>
                      <p className="text-sm text-slate-600">
                        Última actualización: hace tiempo
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPasswordDialogOpen(true)}
                    variant="outline"
                    size="sm"
                  >
                    Cambiar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Zona de Peligro
              </h2>
              <p className="text-slate-600 mb-4">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor,
                está seguro.
              </p>

              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Actualiza tu información personal
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProfile}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nombre de usuario</Label>
                  <Input
                    id="nickname"
                    value={editForm.nickname}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nickname: e.target.value })
                    }
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Contraseña</DialogTitle>
              <DialogDescription>
                Ingresa tu contraseña actual y la nueva contraseña
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Tu contraseña actual"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Nueva contraseña"
                  />
                  <p className="text-xs text-slate-600">
                    Mínimo 8 caracteres, con mayúscula, minúscula, número y
                    carácter especial
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar nueva contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Account AlertDialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                ¿Estás absolutamente seguro?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p className="font-semibold text-slate-900">
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente tu cuenta y todos tus datos asociados.
                </p>

                <div className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">
                      Ingresa tu contraseña para confirmar
                    </Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Tu contraseña"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      id="deleteConfirm"
                      type="checkbox"
                      checked={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.checked)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="deleteConfirm"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Entiendo que esta acción es irreversible y eliminará
                      permanentemente mi cuenta y todos mis datos
                    </Label>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeletePassword("");
                  setDeleteConfirm(false);
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isSubmitting || !deletePassword || !deleteConfirm}
                className="bg-red-600 hover:bg-red-700 !text-white"
              >
                {isSubmitting ? "Eliminando..." : "Eliminar mi cuenta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
