"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function RekapGuru() {
  const [dataProgres, setDataProgres] = useState<any[]>([]);
  const [dataNilai, setDataNilai] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        // Ambil data progres materi
        const qProgres = query(collection(db, "progres_materi"), orderBy("waktuPenyelesaian", "desc"));
        const snapshotProgres = await getDocs(qProgres);
        const progres = snapshotProgres.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDataProgres(progres);

        // Ambil data nilai latihan soal (jika koleksinya sudah ada)
        const qNilai = query(collection(db, "nilai_latihan"), orderBy("waktuPengerjaan", "desc"));
        const snapshotNilai = await getDocs(qNilai);
        const nilai = snapshotNilai.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDataNilai(nilai);

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 Dasbor Rekapitulasi Guru</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau progres belajar dan nilai latihan siswa secara real-time.</p>
          </div>
          <Link href="/" className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold px-5 py-2.5 rounded-xl transition text-center text-sm">
            Kembali ke Beranda
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat data dari database...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Tabel 1: Progres Materi Visual */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-600 p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  🎥 Riwayat Penyelesaian Materi & Misi Detektif
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-blue-50 text-blue-800 border-b border-blue-100">
                    <tr>
                      <th className="p-4 font-bold">Nama Siswa</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold text-center">Status Video</th>
                      <th className="p-4 font-bold text-center">Jawaban Misi</th>
                      <th className="p-4 font-bold text-center">Hasil Misi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProgres.length > 0 ? (
                      dataProgres.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">{item.nama || "Tanpa Nama"}</td>
                          <td className="p-4">{item.email || "-"}</td>
                          <td className="p-4 text-center">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.statusTontonVideo || "Selesai"}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono bg-gray-50">{item.jawabanMisiDetektif || "-"}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.statusMisiDetektif === "Benar" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {item.statusMisiDetektif || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data progres siswa.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tabel 2: Nilai Latihan Soal */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-orange-500 p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  📝 Rekap Nilai Latihan Soal Pilihan Ganda
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-orange-50 text-orange-800 border-b border-orange-100">
                    <tr>
                      <th className="p-4 font-bold">Nama Siswa</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold text-center">Benar</th>
                      <th className="p-4 font-bold text-center">Salah</th>
                      <th className="p-4 font-bold text-center">Skor Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataNilai.length > 0 ? (
                      dataNilai.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="p-4 font-medium text-gray-800">{item.nama || "Tanpa Nama"}</td>
                          <td className="p-4">{item.email || "-"}</td>
                          <td className="p-4 text-center text-green-600 font-bold">{item.jumlahBenar || 0}</td>
                          <td className="p-4 text-center text-red-500 font-bold">{item.jumlahSalah || 0}</td>
                          <td className="p-4 text-center">
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-bold text-base">
                              {item.skor || 0}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data nilai latihan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}