"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  
  // State untuk mengontrol Pop-up dan Kunci Akses
  const [showModal, setShowModal] = useState(false);
  const [isProfileLengkap, setIsProfileLengkap] = useState(false);
  
  // State untuk form biodata
  const [asalSekolah, setAsalSekolah] = useState("");
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(false);

  // Mengecek status login dan kelengkapan profil secara otomatis
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Cek apakah siswa sudah punya data di koleksi 'users'
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().kelas) {
          setIsProfileLengkap(true);
          setShowModal(false);
        } else {
          setIsProfileLengkap(false);
          setShowModal(true); // Munculkan paksa pop-up jika belum ada data
        }
      } else {
        setIsProfileLengkap(false);
        setShowModal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginDenganGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Gagal login:", error);
      alert("Gagal memunculkan akun Google. Pastikan internet lancar dan coba lagi!");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsProfileLengkap(false);
  };

  // Fungsi untuk menyimpan biodata dari pop-up ke Firestore
  const simpanBiodata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asalSekolah.trim() || !kelas) return alert("Harap isi Asal Sekolah dan pilih Kelas!");
    
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        nama: user.displayName,
        email: user.email,
        asalSekolah: asalSekolah,
        kelas: kelas,
        waktuDaftar: new Date()
      });
      setIsProfileLengkap(true);
      setShowModal(false);
    } catch (error) {
      console.error("Gagal menyimpan biodata:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans relative">
      
      {/* ---------------- POP-UP GERBANG WAJIB (MODAL) ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-blue-100 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">🏫</div>
              <h2 className="text-2xl font-bold text-black">Lengkapi Biodata</h2>
              <p className="text-gray-800 text-sm mt-1">Sebelum mulai belajar, beri tahu kami asal sekolah dan kelasmu ya!</p>
            </div>
            
            <form onSubmit={simpanBiodata} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Asal Sekolah</label>
                <input 
                  type="text"
                  value={asalSekolah} 
                  onChange={(e) => setAsalSekolah(e.target.value)}
                  placeholder="Ketik nama sekolahmu (Cth: SMPN 1 Slogohimo)"
                  className="w-full border-2 border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition bg-white text-black font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Kelas</label>
                <select 
                  value={kelas} 
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full border-2 border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition bg-white text-black font-medium"
                  required
                >
                  <option value="" disabled>-- Pilih Kelas --</option>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="7C">Kelas 7C</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-50 mt-4"
              >
                {loading ? "Menyimpan..." : "Simpan & Mulai Belajar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- KONTEN UTAMA HALAMAN DEPAN ---------------- */}
      <div className={`max-w-4xl mx-auto space-y-8 ${showModal ? 'pointer-events-none opacity-40 blur-sm transition-all duration-300' : ''}`}>
        
        {/* Header dengan Tombol Login */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">LMS Matematika</h1>
          
          {user ? (
            <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <div className="text-right">
                <p className="text-sm font-bold text-black">Halo, {user?.displayName} 👋</p>
                <p className="text-xs text-gray-800">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="bg-white text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-700 transition text-sm shadow-sm"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button 
              onClick={loginDenganGoogle}
              className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              Masuk dengan Google
            </button>
          )}
        </header>

        {/* Konten Utama Modul */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-black mb-6">Materi Pembelajaran</h2>
          
          <div className="border border-blue-200 rounded-xl p-6 bg-blue-50/50 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-black">Matematika - Kelas 8</h3>
                <p className="text-blue-700 font-bold">Persamaan Garis Lurus (PGL)</p>
              </div>
              <span className="bg-blue-200 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">Modul Utama</span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-black mb-2">Target Kompetensi:</p>
              <ul className="text-sm text-gray-900 space-y-1.5 list-disc list-inside font-medium">
                <li>Menganalisis bentuk grafik <code className="bg-gray-200 px-1 rounded text-blue-700">y = mx + c</code></li>
                <li>Menghitung nilai gradien (kemiringan) garis</li>
                <li>Pendekatan Computational Thinking & Analisis Kasus</li>
              </ul>
            </div>

            {/* Logika Pengunci Tombol */}
            {user && isProfileLengkap ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/materi-visual" className="flex-1 text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-sm">
                  Mulai Materi Visual
                </Link>
                <Link href="/latihan-soal" className="flex-1 text-center bg-white text-blue-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition border-2 border-blue-200">
                  Latihan Soal
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => !user ? loginDenganGoogle() : setShowModal(true)}
                  className="w-full text-center bg-gray-200 text-black font-bold py-3.5 rounded-lg border-2 border-dashed border-gray-400 cursor-not-allowed flex items-center justify-center gap-2 transition hover:bg-gray-300"
                >
                  🔒 <span>Silakan Login & Isi Biodata untuk Membuka Akses</span>
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}