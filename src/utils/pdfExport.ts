export async function downloadPdf(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Clone element into a hidden off-screen container so getComputedStyle works
  const hiddenContainer = document.createElement("div");
  hiddenContainer.style.position = "absolute";
  hiddenContainer.style.left = "-9999px";
  hiddenContainer.style.top = "0";
  hiddenContainer.style.width = "1000px";
  hiddenContainer.appendChild(element.cloneNode(true));
  document.body.appendChild(hiddenContainer);

  const clone = hiddenContainer.firstElementChild as HTMLElement;

  // Copy canvas pixel data (radar chart etc.)
  const originalCanvases = element.querySelectorAll("canvas");
  const cloneCanvases = clone.querySelectorAll("canvas");
  originalCanvases.forEach((orig, i) => {
    const cloned = cloneCanvases[i];
    if (cloned) {
      const ctx = cloned.getContext("2d");
      if (ctx) {
        ctx.drawImage(orig, 0, 0);
      }
    }
  });

  // Convert oklch/lab/color-mix colors to RGB inline styles
  const tempEl = document.createElement("div");
  document.body.appendChild(tempEl);

  const allElements = clone.querySelectorAll("*");
  const colorProps = [
    "color",
    "background-color",
    "border-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
  ];

  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const style = (el as HTMLElement).style;

    colorProps.forEach((prop) => {
      const val = computed.getPropertyValue(prop);
      if (
        val &&
        val !== "rgba(0, 0, 0, 0)" &&
        val !== "transparent" &&
        (val.includes("oklch") ||
          val.includes("lab") ||
          val.includes("color-mix"))
      ) {
        tempEl.style.color = val;
        const rgb = window.getComputedStyle(tempEl).color;
        if (rgb && rgb !== val) {
          style.setProperty(prop, rgb, "important");
        }
      }
    });
  });

  document.body.removeChild(tempEl);

  // Generate PDF from the cleaned clone
  const html2pdf = (await import("html2pdf.js")).default;

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
  };

  try {
    await html2pdf().set(opt).from(clone).save();
  } finally {
    document.body.removeChild(hiddenContainer);
  }
}
