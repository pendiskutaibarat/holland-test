"use client";

interface UserInfoStepProps {
  name: string;
  birthDate: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (date: string) => void;
  errors: { name?: string; birthDate?: string };
}

export default function UserInfoStep({
  name,
  birthDate,
  onNameChange,
  onBirthDateChange,
  errors,
}: UserInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="text-center">
        <img
          src="/banner.png"
          alt="Holland RIASEC"
          className="mx-auto rounded-lg"
        />
      </div>

      <h1 className="text-2xl font-bold text-center text-blue-500">
        TES BAKAT HOLLAND RIASEC
      </h1>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-gray-800 font-bold mt-0 mb-2">CARA MENGERJAKAN</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
          <li>
            Tes terbagi menjadi 6 bagian, masing-masing memiliki 15 pernyataan.
            Waktu pengerjaan adalah sekitar 5-10 menit.
          </li>
          <li>
            Centang kotak di pernyataan yang menurutmu paling benar (tidak ada
            ketentuan maksimal atau minimal centang).
          </li>
          <li>Setiap kotak yang dicentang bernilai 1 poin.</li>
        </ul>
      </div>

      {/* Notes */}
      <div className="italic text-gray-500 text-sm">
        <strong>CATATAN</strong>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>
            Tak perlu memikirkan jawaban terlalu lama, tidak ada jawaban benar
            maupun salah.
          </li>
          <li>
            Tujuan tes ini bukanlah untuk mengumpulkan poin. Pilihlah jawaban
            yang sesuai dengan pikiran dan tindakanmu.
          </li>
          <li>
            Hasil tes merupakan gambaran sementara dan tidak bisa digunakan
            sebagai pengganti konsultasi dengan konsultan karir profesional.
          </li>
        </ul>
      </div>

      {/* User Info Form */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block mb-1 font-bold text-gray-700"
          >
            NAMA LENGKAP:
          </label>
          <input
            type="text"
            id="fullName"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`w-full p-2 border rounded-md box-border ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="birthDate"
            className="block mb-1 font-bold text-gray-700"
          >
            TANGGAL LAHIR:
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className={`w-full p-2 border rounded-md box-border ${
              errors.birthDate ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
