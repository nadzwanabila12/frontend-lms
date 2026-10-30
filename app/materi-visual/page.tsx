"use client";

import Link from "next/link";
import { useState } from "react";

export default function MateriVisual() {
  // Ini adalah "ingatan" untuk menyimpan jawaban apa yang diklik siswa
  const [jawaban, setJawaban] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigasi */}
        <Link href="/" className="text-blue-600 hover:underline font-medium inline-block mb-2">
          &larr; Kembali ke Dashboard
        </Link>
        
        {/* Header Modul */}
        <header className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bab 1: Persamaan Garis Lurus</h1>
          <p className="text-gray-500">Mari bereksperimen dengan titik, garis, dan tingkat kemiringan!</p>
        </header>

        {/* Bagian 1: Studi Kasus */}
        <section className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-sm">
          <h2 className="text-xl font-bold text-orange-800 mb-3">👷‍♂️ Misi Kita Hari Ini: Desain Atap Kandang!</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Bayangkan kita sedang membangun sebuah <strong>kandang ayam semi-permanen</strong>. Agar air hujan bisa mengalir lancar turun ke tanah dan tidak merusak pondasi bata yang sudah kita buat, atapnya tentu tidak boleh datar. Atap tersebut harus dipasang miring.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Seberapa miring atap itu harus dipasang? Tingkat kemiringan inilah yang dalam matematika kita sebut sebagai <strong>Gradien</strong>. Mari kita lihat grafiknya!
          </p>
        </section>

        {/* Bagian 2: Kanvas GeoGebra */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">🎨 Kanvas Eksplorasi</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Interaktif</span>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            <strong>Instruksi:</strong> Ini adalah kanvas GeoGebra. Ketikkan persamaan <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">y = 2x + 1</code> di kolom sebelah kiri, lalu tekan Enter. Coba ganti angka 2 dan 1 dengan angka lain untuk melihat arah garisnya berubah!
          </p>
          
          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-blue-100 relative bg-gray-100">
            <iframe 
              src="https://www.geogebra.org/graphing?embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen>
            </iframe>
          </div>
        </section>

        {/* Bagian 3: Konsep Dasar */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🧠 Konsep Dasar: Bentuk Umum PGL</h2>
          <p className="text-gray-700 mb-4">
            Dari eksperimen di atas, kita bisa menyimpulkan bahwa semua garis lurus memiliki satu "DNA" atau bentuk rumus yang sama, yaitu:
          </p>
          
          <div className="bg-blue-600 text-white text-center py-6 rounded-xl mb-6 shadow-inner">
            <h3 className="text-4xl font-mono font-bold tracking-widest">y = mx + c</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-blue-600 text-lg mb-1">m = Gradien (Kemiringan)</h4>
              <p className="text-sm text-gray-600">Angka di depan <em>x</em>. Semakin besar angkanya, semakin menanjak garisnya (seperti tebing). Jika minus, garisnya menurun (seperti seluncuran).</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-blue-600 text-lg mb-1">c = Titik Potong (Konstanta)</h4>
              <p className="text-sm text-gray-600">Angka yang berdiri sendiri. Ini menentukan di titik mana garis tersebut menabrak tiang tegak (Sumbu Y).</p>
            </div>
          </div>
        </section>

        {/* Bagian 4: Algoritma Penyelesaian */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Langkah Logis (Algoritma) Menemukan Kemiringan</h2>
          <p className="text-gray-700 mb-4">
            Jika kamu hanya diberi tahu posisi dua ujung atap (Titik A dan Titik B), ikuti 3 langkah pasti ini untuk menemukan gradiennya:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">1</div>
              <div>
                <h4 className="font-bold text-gray-800">Dekomposisi (Pecah Data)</h4>
                <p className="text-sm text-gray-600">Tentukan siapa yang menjadi (x₁, y₁) dan siapa yang menjadi (x₂, y₂).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">2</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Hitung Selisih Tegak dan Mendatar</h4>
                <div className="text-sm text-gray-600 flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 w-fit">
                  <span className="font-bold text-lg italic">m</span>
                  <span className="font-bold text-lg">=</span>
                  <div className="flex flex-col items-center font-bold text-blue-700">
                    <span className="border-b-2 border-blue-700 px-2 pb-1">y₂ - y₁</span>
                    <span className="px-2 pt-1">x₂ - x₁</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">3</div>
              <div>
                <h4 className="font-bold text-gray-800">Evaluasi Hasil</h4>
                <p className="text-sm text-gray-600">Cek ulang! Jika m positif, atapmu menanjak ke kanan. Jika m negatif, atapmu menurun ke kanan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian 5: Studi Kasus Mini */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 md:p-8 rounded-2xl shadow-lg text-white mb-4 transform transition hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🛹</span>
            <h2 className="text-2xl font-bold">Misi Detektif: Lintasan Skateboard!</h2>
          </div>
          <p className="text-indigo-50 mb-6 leading-relaxed">
            Sebuah taman bermain sedang membangun lintasan <em>skateboard</em> (ramp) baru. Agar aman saat dimainkan dan tidak terlalu ekstrem, arsitek meminta bantuanmu mengecek kemiringannya. 
            Ujung bawah lintasan ada di titik <strong className="whitespace-nowrap">(0, 0)</strong> dan ujung atasnya ada di titik <strong className="whitespace-nowrap">(4, 2)</strong>.
          </p>
          
          <div className="bg-white/10 p-5 rounded-xl border border-white/20 backdrop-blur-sm mb-6">
            <h3 className="font-bold text-lg mb-3">Tantangan Terakhirmu:</h3>
            
            <div className="bg-purple-900/40 p-4 rounded-lg border border-purple-400/30 mb-5 text-sm shadow-inner">
              <p className="font-bold text-yellow-300 mb-2">💡 Misi Uji Coba GeoGebra:</p>
              <ol className="list-decimal ml-4 text-indigo-50 space-y-2">
                <li>Gulir (scroll) ke atas menuju Kanvas GeoGebra.</li>
                <li>Ketikkan titik sasaran: <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-white">(4, 2)</code> lalu tekan Enter.</li>
                <li className="leading-loose">
                  Uji ketiga nilai m di bawah ini dengan mengetikkan persamaannya secara bergantian (contoh: 
                  <code className="inline-flex items-center gap-1 bg-white/20 px-1.5 py-0.5 mx-1 rounded font-mono text-white align-middle">
                    <span>y =</span>
                    <span className="flex flex-col items-center text-[10px] leading-none">
                      <span className="border-b border-white px-0.5 pb-[1px]">1</span>
                      <span className="px-0.5 pt-[1px]">2</span>
                    </span>
                    <span>x</span>
                  </code>
                  , lalu coba <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-white">y = 2x</code>).
                </li>
                <li>Garis manakah yang tepat menabrak titik sasaran? Itulah rumus persamaan umumnya!</li>
              </ol>
            </div>

            <p className="text-sm text-white font-medium mb-4">Berdasarkan hasil eksperimenmu, berapakah nilai Gradien (m) dari lintasan tersebut?</p>
            
            <div className="flex flex-wrap gap-4 items-center">
              
              {/* Tombol m = 1/2 */}
              <button 
                onClick={() => setJawaban("1/2")}
                className={`font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 border ${
                  jawaban === "1/2" 
                    ? "bg-green-500 text-white border-green-400 ring-4 ring-green-500/30 shadow-sm" 
                    : "bg-white/20 text-white hover:bg-white/30 border-white/30"
                }`}
              >
                <span>m =</span>
                <div className="flex flex-col items-center text-sm leading-none">
                  <span className="border-b-2 border-white px-1 pb-0.5">1</span>
                  <span className="px-1 pt-0.5">2</span>
                </div>
              </button>
              
              {/* Tombol m = 2 */}
              <button 
                onClick={() => setJawaban("2")}
                className={`font-bold py-3 px-6 rounded-lg transition border ${
                  jawaban === "2"
                    ? "bg-red-500 text-white border-red-400 ring-4 ring-red-500/30 shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30 border-white/30"
                }`}
              >
                m = 2
              </button>
              
              {/* Tombol m = 4 */}
              <button 
                onClick={() => setJawaban("4")}
                className={`font-bold py-3 px-6 rounded-lg transition border ${
                  jawaban === "4"
                    ? "bg-red-500 text-white border-red-400 ring-4 ring-red-500/30 shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30 border-white/30"
                }`}
              >
                m = 4
              </button>
            </div>

            {/* Kotak Pesan Hasil Umpan Balik */}
            {jawaban === "1/2" && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-green-50 text-sm">
                <strong>🎉 Tepat sekali!</strong> Karena selisih tegaknya (2) dibagi selisih mendatarnya (4), maka 2/4 disederhanakan menjadi 1/2. Garis y = 1/2x akan tepat mengenai titik sasaran (4, 2).
              </div>
            )}
            
            {(jawaban === "2" || jawaban === "4") && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-50 text-sm">
                <strong>😅 Wah, grafiknya meleset!</strong> Coba ingat lagi rumusnya: m = selisih tegak dibagi selisih mendatar. Artinya 2 dibagi 4, bukan 4 dibagi 2 ya! Coba hitung ulang.
              </div>
            )}

          </div>
          <p className="text-xs text-indigo-200 italic">
            *Atau, kamu juga bisa membuktikannya menggunakan rumus selisih tegak & mendatar di Langkah ke-2 tadi!
          </p>
        </section>

      </div>
    </main>
  );
}