"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Komponen khusus untuk merender pecahan vertikal (atas-bawah)
const Pecahan = ({ atas, bawah }: { atas: React.ReactNode, bawah: React.ReactNode }) => (
  <span className="inline-flex flex-col items-center justify-center align-middle mx-1 font-bold text-sm">
    <span className="border-b-[1.5px] border-gray-800 px-1 w-full text-center leading-tight pb-0.5">{atas}</span>
    <span className="px-1 text-center leading-tight pt-0.5">{bawah}</span>
  </span>
);

// Bank Soal PGL - Instrumen Tesis (Pendekatan Computational Thinking)
const bankSoal = [
  {
    pertanyaan: "Sebuah algoritma memprediksi biaya operasional server cloud dengan persamaan y = 15000x + 500000. Dalam model ini, y adalah total biaya (dalam Rupiah) dan x adalah jumlah jam penggunaan. Berdasarkan konsep persamaan garis lurus y = mx + c, berapakah nilai gradien dan apa maknanya dalam kasus ini?",
    opsi: [
      { teks: "500000, merupakan biaya tetap bulanan server", isCorrect: false },
      { teks: "15000, merupakan biaya tambahan untuk setiap 1 jam penggunaan server", isCorrect: true },
      { teks: "15000, merupakan biaya total penggunaan server", isCorrect: false },
      { teks: "500000, merupakan biaya tambahan per jam", isCorrect: false },
      { teks: "515000, merupakan biaya maksimum server", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Persamaan biaya y = 15000x + 500000.<br/>
        - Bentuk umum persamaan garis adalah y = mx + c.<br/>
        <strong>Ditanya:</strong> Nilai gradien (m) dan maknanya?<br/>
        <strong>Dijawab:</strong><br/>
        Dari persamaan tersebut, diperoleh nilai m = 15000 dan c = 500000.<br/>
        Gradien (m) mewakili laju perubahan. Dalam konteks ini, 15000 adalah biaya operasional yang bertambah setiap kali nilai x (jam) bertambah 1.<br/>
        Jadi, maknanya adalah biaya tambahan per 1 jam penggunaan server.
      </>
    )
  },
  {
    pertanyaan: "Sebuah drone pemantau diprogram untuk lepas landas secara diagonal membentuk garis lurus. Sistem mencatat posisi drone pada detik ke-0 berada di ketinggian 10 meter (koordinat (0, 10)), dan pada detik ke-4 berada di ketinggian 30 meter (koordinat (4, 30)). Berapakah gradien lintasan drone tersebut?",
    opsi: [
      { teks: "2", isCorrect: false },
      { teks: "4", isCorrect: false },
      { teks: "5", isCorrect: true },
      { teks: "10", isCorrect: false },
      { teks: "20", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Titik awal (x₁, y₁) = (0, 10).<br/>
        - Titik akhir (x₂, y₂) = (4, 30).<br/>
        <strong>Ditanya:</strong> Gradien (m) lintasan?<br/>
        <strong>Dijawab:</strong><br/>
        m = <Pecahan atas="y₂ - y₁" bawah="x₂ - x₁" /><br/>
        m = <Pecahan atas="30 - 10" bawah="4 - 0" /><br/>
        m = <Pecahan atas="20" bawah="4" /><br/>
        m = 5.<br/>
        Jadi, gradien lintasan drone adalah 5.
      </>
    )
  },
  {
    pertanyaan: "Seorang analis memantau grafik persentase baterai sebuah perangkat IoT. Grafik tersebut berupa garis lurus yang dimulai dari angka 100% pada jam ke-0, dan terus menurun hingga 0% pada jam ke-10. Manakah persamaan yang paling tepat memodelkan sisa persentase baterai (y) terhadap waktu dalam jam (x)?",
    opsi: [
      { teks: "y = 10x + 100", isCorrect: false },
      { teks: "y = -10x + 100", isCorrect: true },
      { teks: "y = -10x - 100", isCorrect: false },
      { teks: "y = 100x - 10", isCorrect: false },
      { teks: "y = -100x + 10", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Titik awal (0, 100), maka intersep y atau c = 100.<br/>
        - Titik akhir baterai habis (10, 0).<br/>
        <strong>Ditanya:</strong> Persamaan garis lurus (y = mx + c)?<br/>
        <strong>Dijawab:</strong><br/>
        Cari gradien (m) terlebih dahulu:<br/>
        m = <Pecahan atas="0 - 100" bawah="10 - 0" /><br/>
        m = <Pecahan atas="-100" bawah="10" /><br/>
        m = -10.<br/>
        <br/>
        Masukkan nilai m dan c ke bentuk umum y = mx + c:<br/>
        y = -10x + 100.<br/>
        Jadi persamaannya adalah <strong>y = -10x + 100</strong>.
      </>
    )
  },
  {
    pertanyaan: "Anda sedang membandingkan dua algoritma pemanasan mesin industri. Suhu Mesin A mengikuti fungsi y = 4x + 20 (dengan y adalah suhu dalam Celcius, x adalah waktu dalam menit). Sementara itu, log data Mesin B menunjukkan suhunya adalah 30°C pada menit ke-2 dan 48°C pada menit ke-5. Mesin manakah yang mengalami kenaikan suhu lebih cepat dan berapakah nilai gradiennya?",
    opsi: [
      { teks: "Mesin A, dengan gradien 4", isCorrect: false },
      { teks: "Mesin B, dengan gradien 6", isCorrect: true },
      { teks: "Mesin A, dengan gradien 20", isCorrect: false },
      { teks: "Mesin B, dengan gradien 9", isCorrect: false },
      { teks: "Keduanya sama cepat, dengan gradien 4", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Mesin A: y = 4x + 20 (gradien m<sub>A</sub> = 4).<br/>
        - Mesin B: Titik (2, 30) dan (5, 48).<br/>
        <strong>Ditanya:</strong> Bandingkan m<sub>A</sub> dan m<sub>B</sub>, mana yang lebih besar?<br/>
        <strong>Dijawab:</strong><br/>
        Hitung gradien Mesin B:<br/>
        m<sub>B</sub> = <Pecahan atas="48 - 30" bawah="5 - 2" /><br/>
        m<sub>B</sub> = <Pecahan atas="18" bawah="3" /><br/>
        m<sub>B</sub> = 6.<br/>
        <br/>
        Karena m<sub>B</sub> (6) {">"} m<sub>A</sub> (4), maka Mesin B mengalami kenaikan suhu lebih cepat dengan gradien 6.
      </>
    )
  },
  {
    pertanyaan: "Sebuah sensor kelembapan tanah mengirimkan data secara linear. Sistem membaca bahwa kelembapan menurun sebesar 2% setiap jam. Pada jam ke-5, kelembapan tercatat sebesar 60%. Jika algoritma memodelkannya sebagai y = mx + c, berapakah nilai kelembapan awal (pada jam ke-0)?",
    opsi: [
      { teks: "50%", isCorrect: false },
      { teks: "60%", isCorrect: false },
      { teks: "68%", isCorrect: false },
      { teks: "70%", isCorrect: true },
      { teks: "72%", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Penurunan laju konstan (m) = -2.<br/>
        - Titik yang dilalui (x, y) = (5, 60).<br/>
        <strong>Ditanya:</strong> Kelembapan awal (nilai c saat x = 0)?<br/>
        <strong>Dijawab:</strong><br/>
        Gunakan persamaan y = mx + c:<br/>
        60 = (-2)(5) + c<br/>
        60 = -10 + c<br/>
        c = 60 + 10<br/>
        c = 70.<br/>
        Jadi, kelembapan awalnya adalah 70%.
      </>
    )
  },
  {
    pertanyaan: "Dua buah robot otonom dirancang agar bergerak dengan lintasan yang saling sejajar agar tidak bertabrakan. Lintasan Robot 1 mengikuti persamaan 2x - y + 5 = 0. Jika Robot 2 memulai pergerakannya dari titik koordinat (3, 4), manakah persamaan garis lintasan Robot 2?",
    opsi: [
      { teks: "y = 2x - 2", isCorrect: true },
      { teks: "y = -2x + 10", isCorrect: false },
      { teks: <>y = <Pecahan atas="1" bawah="2" />x + 2.5</>, isCorrect: false },
      { teks: "y = 2x + 2", isCorrect: false },
      { teks: "y = -2x - 2", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Lintasan 1: 2x - y + 5 = 0.<br/>
        - Lintasan 2 sejajar (m₁ = m₂) dan melalui (3, 4).<br/>
        <strong>Ditanya:</strong> Persamaan lintasan 2?<br/>
        <strong>Dijawab:</strong><br/>
        Ubah Lintasan 1 ke bentuk y = mx + c:<br/>
        -y = -2x - 5<br/>
        y = 2x + 5 (diperoleh m₁ = 2).<br/>
        <br/>
        Karena sejajar, m₂ = 2. Gunakan rumus persamaan melalui satu titik:<br/>
        y - y₁ = m₂(x - x₁)<br/>
        y - 4 = 2(x - 3)<br/>
        y - 4 = 2x - 6<br/>
        y = 2x - 6 + 4<br/>
        y = 2x - 2.
      </>
    )
  },
  {
    pertanyaan: "Program Artificial Intelligence memvalidasi keakuratan tiga titik data sensor. Data dianggap valid jika ketiganya membentuk garis lurus yang sempurna (kolinear). Titik datanya adalah (2, 10), (4, 18), dan (7, k). Berapakah nilai k agar sistem menerima data tersebut sebagai valid?",
    opsi: [
      { teks: "24", isCorrect: false },
      { teks: "26", isCorrect: false },
      { teks: "28", isCorrect: false },
      { teks: "30", isCorrect: true },
      { teks: "32", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Tiga titik segaris A(2, 10), B(4, 18), C(7, k).<br/>
        - Syarat kolinear adalah m<sub>AB</sub> = m<sub>BC</sub>.<br/>
        <strong>Ditanya:</strong> Nilai k?<br/>
        <strong>Dijawab:</strong><br/>
        m<sub>AB</sub> = <Pecahan atas="18 - 10" bawah="4 - 2" /><br/>
        m<sub>AB</sub> = <Pecahan atas="8" bawah="2" /><br/>
        m<sub>AB</sub> = 4.<br/>
        <br/>
        Maka m<sub>BC</sub> juga harus bernilai 4:<br/>
        <Pecahan atas="k - 18" bawah="7 - 4" /> = 4<br/>
        <br/>
        <Pecahan atas="k - 18" bawah="3" /> = 4<br/>
        <br/>
        k - 18 = 4 × 3<br/>
        k - 18 = 12<br/>
        k = 12 + 18<br/>
        k = 30.
      </>
    )
  },
  {
    pertanyaan: <>Dalam pemrograman game, tembakan laser pertama ditembakkan mengikuti persamaan garis y = <Pecahan atas="1" bawah="2" />x - 4. Sistem akan memunculkan tameng energi yang lintasannya tegak lurus sempurna dengan laser pertama dan saling berpotongan tepat di absis (nilai x) = 6. Manakah persamaan garis dari tameng energi tersebut?</>,
    opsi: [
      { teks: "2x + y = 11", isCorrect: true },
      { teks: "2x - y = 13", isCorrect: false },
      { teks: "x + 2y = 4", isCorrect: false },
      { teks: "-2x + y = -13", isCorrect: false },
      { teks: "2x + y = 12", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Garis 1: y = <Pecahan atas="1" bawah="2" />x - 4 (maka m₁ = <Pecahan atas="1" bawah="2" />).<br/>
        - Garis 2 tegak lurus berpotongan di x = 6.<br/>
        <strong>Ditanya:</strong> Persamaan Garis 2?<br/>
        <strong>Dijawab:</strong><br/>
        Substitusi x = 6 ke Garis 1 untuk mencari titik potong:<br/>
        y = <Pecahan atas="1" bawah="2" />(6) - 4<br/>
        y = 3 - 4<br/>
        y = -1.<br/>
        Titik potong berada di (6, -1).<br/>
        <br/>
        Karena tegak lurus:<br/>
        m₁ × m₂ = -1<br/>
        <Pecahan atas="1" bawah="2" /> × m₂ = -1<br/>
        m₂ = -2.<br/>
        <br/>
        Persamaan garis baru:<br/>
        y - y₁ = m₂(x - x₁)<br/>
        y - (-1) = -2(x - 6)<br/>
        y + 1 = -2x + 12<br/>
        2x + y = 11.
      </>
    )
  },
  {
    pertanyaan: "Sebuah script analisis data mencari titik Break Even Point (BEP) dengan menemukan titik potong dua fungsi garis linear. Biaya produksi direpresentasikan dengan y = 2000x + 15000, sedangkan pendapatan penjualan direpresentasikan dengan y = 3500x. Berapakah total nilai (y) yang tercatat oleh script pada saat terjadi titik potong (BEP) tersebut?",
    opsi: [
      { teks: "10", isCorrect: false },
      { teks: "15000", isCorrect: false },
      { teks: "25000", isCorrect: false },
      { teks: "35000", isCorrect: true },
      { teks: "40000", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Fungsi 1: y = 2000x + 15000.<br/>
        - Fungsi 2: y = 3500x.<br/>
        <strong>Ditanya:</strong> Nilai y saat kedua garis berpotongan (BEP)?<br/>
        <strong>Dijawab:</strong><br/>
        Samakan kedua persamaan untuk mencari x (Titik BEP):<br/>
        2000x + 15000 = 3500x<br/>
        15000 = 3500x - 2000x<br/>
        15000 = 1500x<br/>
        x = <Pecahan atas="15000" bawah="1500" /><br/>
        x = 10.<br/>
        <br/>
        Substitusikan x = 10 ke fungsi pendapatan (Fungsi 2):<br/>
        y = 3500(10)<br/>
        y = 35000.
      </>
    )
  },
  {
    pertanyaan: "Sebuah model matematika pada mulanya dibangun melalui titik (-2, -5) dan (2, 7). Akibat pembaruan sistem ekonomi, laju pertumbuhan (gradien) dari garis tersebut dideteksi harus digandakan (2 kali lipat dari semula) dan intersep-y (nilai c) ditambahkan dengan 10. Persamaan garis manakah yang merupakan hasil pembaruan sistem tersebut?",
    opsi: [
      { teks: "y = 3x + 1", isCorrect: false },
      { teks: "y = 6x + 10", isCorrect: false },
      { teks: "y = 6x + 11", isCorrect: true },
      { teks: "y = 3x + 11", isCorrect: false },
      { teks: "y = -6x + 1", isCorrect: false }
    ],
    pembahasan: (
      <>
        <strong>Diketahui:</strong><br/>
        - Garis awal melalui (-2, -5) & (2, 7).<br/>
        - m<sub>baru</sub> = 2(m<sub>awal</sub>).<br/>
        - c<sub>baru</sub> = c<sub>awal</sub> + 10.<br/>
        <strong>Ditanya:</strong> Persamaan garis baru dalam bentuk y = mx + c?<br/>
        <strong>Dijawab:</strong><br/>
        Cari gradien awal:<br/>
        m<sub>awal</sub> = <Pecahan atas="7 - (-5)" bawah="2 - (-2)" /><br/>
        m<sub>awal</sub> = <Pecahan atas="12" bawah="4" /><br/>
        m<sub>awal</sub> = 3.<br/>
        <br/>
        Cari intersep awal (c<sub>awal</sub>) dengan substitusi (2, 7):<br/>
        y = mx + c<br/>
        7 = 3(2) + c<br/>
        7 = 6 + c<br/>
        c<sub>awal</sub> = 1.<br/>
        <br/>
        Pembaruan sistem:<br/>
        m<sub>baru</sub> = 2(3) = 6.<br/>
        c<sub>baru</sub> = 1 + 10 = 11.<br/>
        <br/>
        Maka persamaan barunya adalah <strong>y = 6x + 11</strong>.
      </>
    )
  }
];

export default function LatihanSoal() {
  const [user, setUser] = useState<any>(null);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [skor, setSkor] = useState(0);
  
  const [sudahDijawab, setSudahDijawab] = useState(false);
  const [jawabanTerpilih, setJawabanTerpilih] = useState<number | null>(null);
  
  const [selesai, setSelesai] = useState(false);
  const [statusSimpan, setStatusSimpan] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const pilihJawaban = (indexOpsi: number, isCorrect: boolean) => {
    if (sudahDijawab) return; 
    
    setJawabanTerpilih(indexOpsi);
    setSudahDijawab(true);
    
    if (isCorrect) {
      setSkor((skorSaatIni) => skorSaatIni + (100 / bankSoal.length));
    }
  };

  const lanjutSoalBerikutnya = async () => {
    if (indeksSoal + 1 < bankSoal.length) {
      setIndeksSoal(indeksSoal + 1);
      setSudahDijawab(false);
      setJawabanTerpilih(null);
    } else {
      setSelesai(true);
      
      if (user) {
        setStatusSimpan("Menyimpan data ke database...");
        try {
          await addDoc(collection(db, "nilai_latihan"), {
            nama: user.displayName,
            email: user.email,
            nilai: Math.round(skor),
            materi: "PGL - Computational Thinking",
            waktuPengerjaan: serverTimestamp()
          });
          setStatusSimpan("Terekam! Nilai kamu sudah masuk ke database Guru.");
        } catch (error) {
          console.error("Gagal menyimpan:", error);
          setStatusSimpan("Gagal menyimpan nilai ke database.");
        }
      } else {
        setStatusSimpan("Nilai tidak direkam ke database karena kamu belum Login.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">Latihan Soal PGL</h1>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
            &larr; Kembali
          </Link>
        </header>

        {!user && !selesai && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm">
            <p className="font-bold text-sm">Peringatan: Kamu belum Login!</p>
            <p className="text-xs">Kerjakan soal ini sebagai tamu, namun nilaimu tidak akan terekam ke sistem.</p>
          </div>
        )}

        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          {!selesai ? (
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                  Soal {indeksSoal + 1} dari {bankSoal.length}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Computational Thinking
                </span>
              </div>
              
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-8 leading-relaxed">
                {bankSoal[indeksSoal].pertanyaan}
              </h2>

              <div className="space-y-3">
                {bankSoal[indeksSoal].opsi.map((opsi, index) => {
                  let stylingTombol = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white";
                  
                  if (sudahDijawab) {
                    if (opsi.isCorrect) {
                      stylingTombol = "border-green-500 bg-green-50 text-green-700 font-bold"; 
                    } else if (index === jawabanTerpilih && !opsi.isCorrect) {
                      stylingTombol = "border-red-500 bg-red-50 text-red-700 font-bold"; 
                    } else {
                      stylingTombol = "border-gray-100 bg-gray-50 text-gray-400 opacity-60"; 
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => pilihJawaban(index, opsi.isCorrect)}
                      disabled={sudahDijawab}
                      className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition shadow-sm ${stylingTombol}`}
                    >
                      {opsi.teks}
                    </button>
                  );
                })}
              </div>

              {sudahDijawab && (
                <div className="mt-8 animate-fade-in">
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      📝 Pembahasan
                    </h3>
                    <div className="text-gray-700 text-sm space-y-2 leading-relaxed">
                      {bankSoal[indeksSoal].pembahasan}
                    </div>
                  </div>
                  
                  <button
                    onClick={lanjutSoalBerikutnya}
                    className="mt-6 w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
                  >
                    {indeksSoal + 1 < bankSoal.length ? "Lanjut ke Soal Berikutnya" : "Selesaikan Latihan & Simpan Nilai"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Latihan Selesai!</h2>
              <p className="text-gray-500 mb-8">Berikut adalah hasil evaluasimu.</p>
              
              <div className="text-7xl font-black text-blue-600 mb-8">
                {Math.round(skor)}
              </div>

              <div className={`text-sm font-bold p-4 rounded-xl inline-block mb-10 shadow-sm ${statusSimpan.includes("Terekam") ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>
                {statusSimpan}
              </div>

              <div className="block">
                <Link href="/" className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md inline-block">
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}