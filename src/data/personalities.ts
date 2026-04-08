import { PersonalityInfo, PersonalityType } from "./types";

export const personalities: Record<PersonalityType, PersonalityInfo> = {
  realistic: {
    type: "realistic",
    label: "Realistic (Realistis)",
    description:
      "Seseorang dengan kepribadian ini menyukai pekerjaan yang melibatkan tindakan daripada berpikir, lebih menyukai hasil nyata atau yang dapat dilihat langsung. Orang dengan tipe kepribadian ini umumnya memiliki rasa ingin tahu yang tinggi tentang sains, benda-benda nyata, dan mekanika.",
  },
  investigative: {
    type: "investigative",
    label: "Investigative (Investigatif)",
    description:
      "Mereka yang termasuk dalam kepribadian investigative menyukai penggunaan kemampuan abstrak atau analisis untuk menemukan dan memecahkan masalah yang ada di sekitarnya. Mereka dapat dianggap sebagai 'pemikir' yang selalu berusaha menyelesaikan tugas dan sering bekerja secara mandiri. Menurut tes RIASEC Holland, kelompok ini cenderung analitis, suka menggali lebih dalam, dan mencari kebenaran atau fakta dari sebuah informasi.",
  },
  artistic: {
    type: "artistic",
    label: "Artistic (Artistik)",
    description:
      "Orang yang masuk dalam kepribadian Artistic pasti menyukai kreativitas dan kaya akan imaginasi, tetapi memiliki kepribadian yang sangat impulsif dan suka bekerja mengandalkan perasaan. Kamu mungkin lebih mudah dipengaruhi oleh emosi, lebih didominasi oleh perasaan daripada logika, dan tidak suka bekerja dalam batasan yang ketat.",
  },
  social: {
    type: "social",
    label: "Social (Sosial)",
    description:
      "Mereka yang berkepribadian Social cenderung suka membantu orang lain, berinteraksi, dan berkomunikasi. Mereka peduli pada masalah sosial dan memiliki kemampuan untuk mengekspresikan pendapat dengan baik serta ahli dalam mengajar orang lain. Pada dasarnya, mereka adalah pribadi yang ekstrovert, ramah, dan terbuka.",
  },
  enterprising: {
    type: "enterprising",
    label: "Enterprising (Wirausaha)",
    description:
      "Orang yang punya kepribadian Enterprising cenderung berani berpikir dan berinisiatif, condong pada peran kepemimpinan. Mereka bersedia menghadapi tantangan dan menghadapi banyak kesulitan, serta memiliki semangat berjuang.",
  },
  conventional: {
    type: "conventional",
    label: "Conventional (Konvensional)",
    description:
      "Conventional adalah tipe orang yang hati-hati, teliti, berprinsip, dan selalu mengikuti aturan. Mereka bekerja dengan angka, laporan data. Mereka cocok dengan pekerjaan kantor, pejabat pemerintah, pekerjaan yang membutuhkan kehati-hatian, detail, serta keteraturan.",
  },
};
