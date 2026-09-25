import { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { useAuth } from "../../app/contexts/AuthContext";
import { useCart } from "../../app/contexts/CartContext";
import { orderService, type Order } from "../../services/order.service";
import { supabase } from "../../lib/supabase";

export default function CustomerProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { cartCount } = useCart();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "Andi Pratama",
    email: "customer@gmail.com",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 45, Bandung",
  });
  const [orders, setOrders] = useState<Order[]>(() => orderService.getCustomerOrders(user?.email));

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "Andi Pratama",
        email: user.email || "customer@gmail.com",
        phone: user.phone || "0812-3456-7890",
        address: "Jl. Merdeka No. 45, Bandung",
      });
    }
  }, [user]);

  useEffect(() => {
    const syncOrders = () => {
      setOrders(orderService.getCustomerOrders(user?.email));
    };

    syncOrders();
    orderService.fetchOrdersFromDatabase().then(() => {
      syncOrders();
    });

    const unsubscribe = orderService.subscribe(() => {
      syncOrders();
    });

    return () => {
      unsubscribe();
    };
  }, [user?.email]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!edit) {
      setEdit(true);
      return;
    }

    setSaving(true);
    try {
      if (user?.id) {
        await (supabase.from("profiles") as any).upsert([
          {
            id: user.id,
            email: form.email.trim(),
            nama: form.name.trim(),
            no_hp: form.phone.trim(),
            role: "CUSTOMER",
            updated_at: new Date().toISOString(),
          },
        ]);
        if (refreshProfile) {
          await refreshProfile();
        }
      }
      setEdit(false);
    } catch (err) {
      console.error("Gagal simpan profil customer:", err);
    } finally {
      setSaving(false);
    }
  };

  const totalPesanan = orders.length;
  const pesananSelesai = orders.filter((o) => o.orderStatus === "SELESAI").length;
  const totalBelanjaNum = orders
    .filter((o) => o.payStatus === "PAID")
    .reduce((acc, o) => acc + o.total, 0);

  const totalBelanjaFormatted =
    totalBelanjaNum >= 1000000
      ? `Rp${(totalBelanjaNum / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`
      : `Rp${totalBelanjaNum.toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={cartCount} user={{ name: form.name.split(" ")[0] || "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-[#FFF5D6] border-4 border-[#D4AF37] flex items-center justify-center text-3xl font-bold text-[#D4AF37] mx-auto">
                  {(form.name[0] || "A").toUpperCase()}
                </div>
                <p className="font-semibold text-[#202020] mt-2">{form.name}</p>
                <p className="text-xs text-[#6B6B6B]">Customer</p>
              </div>
              <nav className="space-y-1">
                {[
                  { icon: "👤", label: "Profil", active: true, to: "/profile" },
                  { icon: "📦", label: "Pesanan", to: "/orders", count: totalPesanan },
                  { icon: "❤️", label: "Wishlist", to: "#" },
                  { icon: "📍", label: "Alamat", to: "#" },
                  { icon: "⚙️", label: "Settings", to: "#" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to || "#"}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      item.active
                        ? "bg-[#FFF5D6] text-[#D4AF37] font-medium"
                        : "text-[#6B6B6B] hover:bg-[#F8F8F6]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[11px] bg-[#D4AF37]/20 text-[#A07C10] px-2 py-0.5 rounded-full font-bold">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[#202020]">Profil Saya</h2>
                <Button
                  variant={edit ? "primary" : "outline-gold"}
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Menyimpan..." : edit ? "Simpan Perubahan" : "Edit Profil"}
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nama Lengkap" value={form.name} onChange={update("name")} disabled={!edit} />
                <Input label="Email" value={form.email} onChange={update("email")} disabled={!edit} />
                <Input label="Nomor HP" value={form.phone} onChange={update("phone")} disabled={!edit} />
                <Input label="Alamat" value={form.address} onChange={update("address")} disabled={!edit} />
              </div>
            </div>

            {/* Real Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Pesanan", value: String(totalPesanan) },
                { label: "Pesanan Selesai", value: String(pesananSelesai) },
                { label: "Total Belanja", value: totalBelanjaFormatted },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-center shadow-xs">
                  <p className="text-2xl font-bold text-[#D4AF37]">{value}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Pesanan Terbaru */}
            {orders.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#202020]">Pesanan Terbaru</h3>
                  <Link to="/orders" className="text-xs text-[#D4AF37] font-semibold hover:underline">
                    Lihat Semua ({orders.length}) →
                  </Link>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl border border-[#F0EFEA] bg-[#FAFAF8] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ord.items[0]?.image || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=120"}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-[#E8E6E1] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#202020] truncate">
                            {ord.items[0]?.name || "Produk UMKM"}
                            {ord.items.length > 1 && ` +${ord.items.length - 1} lainnya`}
                          </p>
                          <p className="text-[11px] text-[#8A8780]">{ord.id} · {ord.umkm}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <StatusBadge status={ord.orderStatus} />
                        <Link to={`/orders/${ord.id}`} className="block text-[11px] text-[#D4AF37] font-semibold mt-1 hover:underline">
                          Detail →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
