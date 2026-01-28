import React from "react";
import { NavLink } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-blue-600 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-indigo-500/40">
          <h1 className="text-2xl font-semibold">Centro Médico</h1>
        </div>

        <nav className="flex-1 px-4 py-4 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-100/80">
            Menú
          </p>

          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 transition ${
                    isActive
                      ? "bg-indigo-500/60 font-semibold"
                      : "hover:bg-indigo-500/40"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/turnos"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 transition ${
                    isActive
                      ? "bg-indigo-500/60 font-semibold"
                      : "hover:bg-indigo-500/40"
                  }`
                }
              >
                Turnos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/pacientes"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 transition ${
                    isActive
                      ? "bg-indigo-500/60 font-semibold"
                      : "hover:bg-indigo-500/40"
                  }`
                }
              >
                Pacientes
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/medicos"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 transition ${
                    isActive
                      ? "bg-indigo-500/60 font-semibold"
                      : "hover:bg-indigo-500/40"
                  }`
                }
              >
                Médicos
              </NavLink>
            </li>    
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}

export default Layout;
