import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminFloatingBar = () => {
  const { isAdmin, profile, signOut } = useAuth();
  const location = useLocation();

  // Don't show on admin pages or login pages
  const isAdminPage = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.includes("logg-inn");

  if (!isAdmin || isAdminPage || isLoginPage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-2.5 bg-card/95 backdrop-blur-2xl border border-border/30 rounded-full shadow-2xl"
      >
        <span className="text-[11px] tracking-widest uppercase text-muted-foreground font-medium select-none">
          Admin: {profile?.name?.split(" ")[0]}
        </span>

        <div className="w-px h-5 bg-border/30" />

        <Link
          to="/admin"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary-foreground bg-primary rounded-full hover:scale-[1.03] transition-all duration-300 tracking-wide"
        >
          <LayoutDashboard size={13} />
          Dashboard
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/40 transition-all duration-300"
        >
          <LogOut size={13} />
          Logg ut
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminFloatingBar;
