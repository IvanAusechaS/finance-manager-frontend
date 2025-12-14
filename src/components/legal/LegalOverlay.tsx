import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface LegalOverlayProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly lastUpdated: string;
  readonly children: React.ReactNode;
}

export function LegalOverlay({
  isOpen,
  onClose,
  title,
  lastUpdated,
  children,
}: LegalOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600 mt-1">
                Última actualización: {lastUpdated}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="prose prose-slate max-w-none">{children}</div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <Button onClick={onClose} className="px-6">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
