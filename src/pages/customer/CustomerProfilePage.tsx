import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function CustomerProfilePage() {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "Andi Pratama", email: "andi@email.com", phone: "0812-3456-7890", address: "Jl. Merdeka No. 45, Bandung" });
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-[#FFF5D6] border-4 border-[#D4AF37] flex items-center justify-center text-3xl font-bold text-[#D4AF37] mx-auto">A</div>
                <p className="font-semibold text-[#202020] mt-2">Andi Pratama</p>
                <p className="text-xs text-[#6B6B6B]">Customer</p>
              </div>
              <nav className="space-y-1">
                {[
                  { icon: "👤", label: "Profil", active: true },
                  { icon: "📦", label: "Pesanan", to: "/orders" },
                  { icon: "❤️", label: "Wishlist" },
                  { icon: "📍", label: "Alamat" },
                  { icon: "⚙️", label: "Settings" },
                ].map(item => (
                  <Link key={item.label} to={item.to || "#"}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${item.active ? "bg-[#FFF5D6] text-[#D4AF37] font-medium" : "text-[#6B6B6B] hover:bg-[#F8F8F6]"}`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[#202020]">Profil Saya</h2>
                <Button variant={edit ? "primary" : "outline-gold"} size="sm" onClick={() => setEdit(!edit)}>
                  {edit ? "Simpan" : "Edit Profil"}
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nama Lengkap" value={form.name} onChange={update("name")} disabled={!edit} />
                <Input label="Email" value={form.email} onChange={update("email")} disabled={!edit} />
                <Input label="Nomor HP" value={form.phone} onChange={update("phone")} disabled={!edit} />
                <Input label="Alamat" value={form.address} onChange={update("address")} disabled={!edit} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Pesanan", value: "8" },
                { label: "Pesanan Selesai", value: "6" },
                { label: "Total Belanja", value: "Rp1,2jt" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-center">
                  <p className="text-2xl font-bold text-[#D4AF37]">{value}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
