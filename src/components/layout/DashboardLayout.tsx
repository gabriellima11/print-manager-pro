import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Printer, AlertTriangle, BarChart3, Building2, Menu, X, LogOut, Package } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/impressoras", icon: Printer, label: "Impressoras" },
  { to: "/alertas", icon: AlertTriangle, label: "Alertas" },
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { to: "/sedes", icon: Building2, label: "Sedes" },
  { to: "/estoque", icon: Package, label: "Estoque" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Printer className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-foreground font-bold text-lg tracking-tight">PrintWatch</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary glow-primary-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
