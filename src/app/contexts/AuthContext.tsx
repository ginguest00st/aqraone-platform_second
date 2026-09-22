import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import type { Profile, UserRole } from "../../types/database.types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | null;
  phone?: string | null;
  profile?: Profile | null;
}

export interface RegisterParams {
  email: string;
  password: string;
  nama: string;
  role: UserRole;
  no_hp?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null; role?: UserRole }>;
  register: (params: RegisterParams) => Promise<{ error: Error | null; user?: User }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil profil dari tabel public.profiles di Supabase
  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: Record<string, unknown>) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const profileData = data as unknown as Profile | null;

      if (error || !profileData) {
        // Fallback dari user_metadata jika row profiles belum siap
        const fallbackRole = (userMeta?.role as UserRole) || "CUSTOMER";
        const fallbackName = (userMeta?.nama as string) || (userMeta?.name as string) || userEmail?.split("@")[0] || "Pengguna";
        
        const fallbackUser: User = {
          id: userId,
          name: fallbackName,
          email: userEmail || "",
          role: fallbackRole,
        };
        setUser(fallbackUser);
        setProfile(null);
        return fallbackRole;
      }

      setProfile(profileData);
      const appUser: User = {
        id: profileData.id,
        name: profileData.nama,
        email: profileData.email,
        role: profileData.role,
        phone: profileData.no_hp,
        profile: profileData,
      };
      setUser(appUser);
      return profileData.role;
    } catch (err) {
      console.error("Error fetching user profile from Supabase:", err);
      return null;
    }
  };

  useEffect(() => {
    // Bersihkan sisa data demo lama jika ada
    localStorage.removeItem("aqraone_demo_user");

    // 1. Ambil session aktif langsung dari Supabase Auth
    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata
          );
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error checking Supabase auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Dengarkan perubahan status auth dari Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata
          );
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi Login murni melalui Supabase Auth
  const login = async (email: string, password: string) => {
    let cleanEmail = email.trim().toLowerCase();
    let cleanPassword = password.trim();

    // Shorthand mapper untuk mempermudah login & demo
    if (
      cleanEmail === "admin" ||
      cleanEmail === "admin@aqra.com" ||
      cleanEmail === "admin@aqraone.id" ||
      cleanEmail === "admin@gmail.com"
    ) {
      cleanEmail = "admin@aqraone.com";
      if (!cleanPassword || cleanPassword === "admin") {
        cleanPassword = "admin123";
      }
    } else if (
      cleanEmail === "umkm" ||
      cleanEmail === "batik" ||
      cleanEmail === "danar" ||
      cleanEmail === "mulyadi"
    ) {
      cleanEmail = "batik.danar@aqraone.id";
      if (!cleanPassword || cleanPassword === "umkm") {
        cleanPassword = "password123";
      }
    } else if (
      cleanEmail === "customer" ||
      cleanEmail === "pembeli" ||
      cleanEmail === "andi"
    ) {
      cleanEmail = "customer@gmail.com";
      if (!cleanPassword || cleanPassword === "customer") {
        cleanPassword = "password";
      }
    }

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      // Jika gagal dan akun admin, coba variasi password umum untuk kenyamanan
      if (error && cleanEmail === "admin@aqraone.com") {
        const altPasswords = ["admin123", "Admin@aqra1", "Admin123", "admin", "password", "password123"];
        for (const alt of altPasswords) {
          if (alt === cleanPassword) continue;
          const retry = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: alt,
          });
          if (!retry.error && retry.data?.user) {
            data = retry.data;
            error = null;
            break;
          }
        }
      }

      if (error) {
        return { error };
      }

      if (data?.user) {
        const role = await fetchProfile(
          data.user.id,
          data.user.email,
          data.user.user_metadata
        );
        // Pastikan role admin selalu valid
        const finalRole = cleanEmail === "admin@aqraone.com" ? "ADMIN" : (role || "CUSTOMER");
        return { error: null, role: finalRole };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Fungsi Register Supabase Auth
  const register = async ({ email, password, nama, role, no_hp }: RegisterParams) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nama,
            name: nama,
            role,
            no_hp: no_hp || null,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email, { nama, role, no_hp });
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Fungsi Logout Supabase Auth
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
