"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as XLSX from "xlsx";

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

        // Ambil data nilai latihan soal
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

  // Fungsi untuk mengunduh data menjadi file Excel
  const unduhExcel = () => {
    // 1. Merapikan data untuk Sheet Progres Materi
    const barisProgres = dataProgres.map((item, index) => ({
      "No": index + 1,
      "Nama Siswa": item.nama || "Tanpa Nama",
      "Email": item.email || "-",
      "Status Video": item.statusTontonVideo || "Selesai",
      "Jawaban Misi": item.jawabanMisiDetektif || "-",
      "Hasil Misi": item.statusMisiDetektif || "-",
      "Waktu Selesai": item.waktuPenyelesaian ? new Date(item.waktuPenyelesaian.seconds * 1000).toLocaleString('id-ID') : "-"
    }));

    // 2. Merapikan data untuk Sheet Nilai Latihan
    const barisNilai = dataNilai.map((item, index) => ({
      "No": index + 1,
      "Nama Siswa": item.nama || "Tanpa Nama",
      "Email": item.email || "-",
      "Jumlah Benar": item.jumlahBenar || 0,
      "Jumlah Salah": item.jumlahSalah || 0,
      "Skor Akhir": item.skor || 0,
      "Waktu Pengerjaan": item.waktuPengerjaan ? new Date(item.waktuPengerjaan.seconds * 1000).toLocaleString('id-ID') : "-"
    }));

    // 3. Membuat lembar kerja (Worksheet)
    const sheetProgres = XLSX.utils.json_to_sheet(barisProgres);
    const sheetNilai = XLSX.utils.json_to_sheet(barisNilai);

    // 4. Menyatukan lembar kerja ke dalam satu file Excel (Workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheetProgres, "Progres Materi");
    XLSX.utils.book_append_sheet(workbook, sheetNilai, "Nilai Latihan");

    // 5. Mengunduh file ke laptop
    XLSX.writeFile(workbook, "Rekap_LMS_Kelas_7C.xlsx");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 Dasbor Rekapitulasi Guru</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau progres belajar dan nilai latihan siswa secara real-time.</p>
          </div>
          <div className="flex gap-3">
            {/* Tombol Download Excel */}
            <button 
              onClick={unduhExcel}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-5 py-2.5 rounded-xl transition text-center text-sm flex items-center justify-center gap-2"
            >
              📥 Download Excel
            </button>
            <Link href="/" className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold px-5 py-2.5 rounded-xl transition text-center text-sm flex items-center justify-center">
              Kembali ke Beranda
            </Link>
          </div>
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