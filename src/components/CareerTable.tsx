import { Career } from "@/data/types";

interface CareerTableProps {
  careers: Career[];
}

export default function CareerTable({ careers }: CareerTableProps) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-3 py-2 text-left">No.</th>
            <th className="border border-black px-3 py-2 text-left">
              Nama Karir
            </th>
            <th className="border border-black px-3 py-2 text-left">
              Deskripsi Singkat
            </th>
          </tr>
        </thead>
        <tbody>
          {careers.map((career, index) => (
            <tr key={index}>
              <td className="border border-black px-3 py-1.5">{index + 1}.</td>
              <td className="border border-black px-3 py-1.5">{career.name}</td>
              <td className="border border-black px-3 py-1.5">{career.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
