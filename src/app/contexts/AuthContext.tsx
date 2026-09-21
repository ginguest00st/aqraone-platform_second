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

  // Ambil profil dari tabel public.profiles
  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: Record<string, unknown>) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const profileData = data as unknown as Profile | null;

      if (error || !profileData) {
        // Fallback jika profile belum terisi dari trigger atau saat offline
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
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  useEffect(() => {
    // 1. Ambil session aktif saat inisialisasi
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
        console.error("Error checking auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Dengarkan perubahan status auth (login, logout, token refresh)
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

  // Fungsi Login Supabase Auth
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const role = await fetchProfile(
          data.user.id,
          data.user.email,
          data.user.user_metadata
        );
        return { error: null, role: role || "CUSTOMER" };
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
