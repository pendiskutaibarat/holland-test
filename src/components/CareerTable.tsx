import { Career } from "@/data/types";

interface CareerTableProps {
  careers: Career[];
}

export default function CareerTable({ careers }: CareerTableProps) {
  return (
    <div className="overflow-x-auto mt-3 rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Daftar karir yang cocok</caption>
        <thead>
          <tr className="bg-slate-50">
            <th
              scope="col"
              className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800"
            >
              No.
            </th>
            <th
              scope="col"
              className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800"
            >
              Nama Karir
            </th>
            <th
              scope="col"
              className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800"
            >
              Deskripsi Singkat
            </th>
          </tr>
        </thead>
        <tbody>
          {careers.map((career, index) => (
            <tr
              key={index}
              className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-2 text-slate-600">
                {index + 1}.
              </td>
              <td className="px-4 py-2 font-medium text-slate-800">
                {career.name}
              </td>
              <td className="px-4 py-2 text-slate-600">
                {career.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}