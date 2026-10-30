"use client";

import Link from "next/link";
import { useState } from "react";

export default function LatihanSoal() {
  // Database soal sederhana
  const daftarSoal = [
    {
      id: 1,
      pertanyaan: "Jika diketahui sebuah persamaan garis y = 3x - 5, berapakah nilai gradien kemiringannya?",
      pilihan: ["-5", "3", "x", "5"],
      jawabanBenar: "3",
      pembahasan: "Tepat! Dalam bentuk y = mx + c, angka di depan x (m) adalah gradiennya."
    },
    {
      id: 2,
      pertanyaan: "Sebuah tangga disandarkan pada tembok. Ujung bawah tangga berada di koordinat (1, 1) dan ujung atasnya di (3, 5). Berapa gradien kemiringan tangga tersebut?",
      pilihan: ["2", "1/2", "4", "3"],
      jawabanBenar: "2",
      pembahasan: "Benar! Selisih tegak (5 - 1 = 4) dibagi selisih mendatar (3 - 1 = 2). 4/2 = 2."
    },
    {
      id: 3,
      pertanyaan: "Garis yang memiliki gradien negatif (-) akan memiliki bentuk visual grafik yang...",
      pilihan: ["Menanjak ke kanan", "Datar sejajar sumbu X", "Menurun ke kanan", "Tegak lurus sumbu Y"],
      jawabanBenar: "Menurun ke kanan",
      pembahasan: "Super! Gradien negatif selalu menggambarkan lintasan yang menurun jika dilihat dari kiri ke kanan."
    }
  ];

  // State untuk menjalankan kuis
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [skor, setSkor] = useState(0);
  const [kuisSelesai, setKuisSelesai] = useState(false);
  const [jawabanDipilih, setJawabanDipilih] = useState("");
  const [sudahDijawab, setSudahDijawab] = useState(false);

  // Fungsi saat siswa memilih jawaban
  const tanganiJawaban = (pilihan: string) => {
    if (sudahDijawab) return; // Mencegah klik dua kali
    
    setJawabanDipilih(pilihan);
    setSudahDijawab(true);

    if (pilihan === daftarSoal[indeksSoal].jawabanBenar) {
      setSkor(skor + 1);
    }
  };

  // Fungsi untuk lanjut ke soal berikutnya
  const lanjutSoal = () => {
    if (indeksSoal + 1 < daftarSoal.length) {
      setIndeksSoal(indeksSoal + 1);
      setJawabanDipilih("");
      setSudahDijawab(false);
    } else {
      setKuisSelesai(true);
    }
  };

  // Tampilan saat kuis selesai
  if (kuisSelesai) {
    const nilaiAkhir = Math.round((skor / daftarSoal.length) * 100);
    return (
      <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center border-t-8 border-blue-600">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Kuis Selesai! 🎉</h2>
          <p className="text-gray-600 mb-6">Kamu berhasil menjawab {skor} dari {daftarSoal.length} soal dengan benar.</p>
          <div className="text-6xl font-black text-blue-600 mb-8">{nilaiAkhir}</div>
          <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  // Tampilan saat kuis berjalan
  const soalSaatIni = daftarSoal[indeksSoal];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Latihan Soal PGL</h1>
          <span className="bg-blue-100 text-blue-800 font-bold px-4 py-1.5 rounded-full text-sm">
            Soal {indeksSoal + 1} dari {daftarSoal.length}
          </span>
        </header>

        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl text-gray-800 font-medium mb-8 leading-relaxed">
            {soalSaatIni.pertanyaan}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {soalSaatIni.pilihan.map((pilihan, idx) => (
              <button
                key={idx}
                onClick={() => tanganiJawaban(pilihan)}
                disabled={sudahDijawab}
                className={`text-left p-4 rounded-xl border-2 font-medium transition ${
                  sudahDijawab
                    ? pilihan === soalSaatIni.jawabanBenar
                      ? "bg-green-100 border-green-500 text-green-800" // Warna jika benar
                      : pilihan === jawabanDipilih
                      ? "bg-red-100 border-red-500 text-red-800" // Warna jika salah pilih
                      : "bg-gray-50 border-gray-200 text-gray-400" // Warna sisa pilihan
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                {pilihan}
              </button>
            ))}
          </div>

          {sudahDijawab && (
            <div className={`p-4 rounded-lg mb-6 ${
              jawabanDipilih === soalSaatIni.jawabanBenar ? "bg-green-50 text-green-800 border border-green-200" : "bg-orange-50 text-orange-800 border border-orange-200"
            }`}>
              <strong>{jawabanDipilih === soalSaatIni.jawabanBenar ? "Benar!" : "Kurang Tepat."}</strong> {soalSaatIni.pembahasan}
            </div>
          )}

          {sudahDijawab && (
            <div className="flex justify-end">
              <button 
                onClick={lanjutSoal}
                className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                {indeksSoal + 1 === daftarSoal.length ? "Lihat Hasil Akhir" : "Soal Berikutnya ➔"}
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}