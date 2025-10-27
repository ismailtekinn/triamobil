import TcpSocket from "react-native-tcp-socket";

export const printCartReceipt = async (
  selectedSale: any[],
  printerIp: string = "192.168.0.44",
  printerPort: number = 9100
): Promise<void> => {
  const ESC = "\x1B";
  const GS = "\x1D";
  const lineWidth = 48;
  let receipt = "";

  // --- Yazıcıyı başlat ---
  receipt += ESC + "@"; // Initialize printer
  receipt += ESC + "t" + "\x09"; // PC857 Turkish

  // --- BAŞLIK ---
  receipt += ESC + "!" + "\x30"; // Bold + Double Height (opsiyonel)
  receipt += ESC + "a" + "\x01"; // Ortala
  receipt += "SATIS SLIP BILGISI\n\n";
  receipt += ESC + "!" + "\x00"; // Normal font
  receipt += "     MAGAZA ADI\n\n";
  receipt += ESC + "a" + "\x00"; // Soldan hizala

  const tarih = "25/10/2025";

  // soldaki ve sağdaki metinleri hizala
  const padBoth = (leftText: string, rightText: string, width: number) => {
    const spaceCount = width - (leftText.length + rightText.length);
    return leftText + " ".repeat(Math.max(0, spaceCount)) + rightText;
  };
  receipt += padBoth("Slip No : 12345", `TARIH : ${tarih}`, lineWidth) + "\n";
  receipt +=
    padBoth("Musteri : Ahmet Yilmaz", "Belge No: 121345433", lineWidth) + "\n";
  receipt += "-".repeat(lineWidth) + "\n\n";

  // --- ÜRÜNLER ---
  selectedSale.forEach((item) => {
    const quantity = item.Stock ?? 1;
    const unitPrice = item.Price ?? 0;
    const total = item.Tutar ?? unitPrice * quantity;
    const name = item.ProductName ?? "Bilinmeyen Urun";
    const discount = item.IndTutar ?? 0;

    receipt += `${quantity} Ad x ${unitPrice.toFixed(2)} TL\n`;

    const priceText = `${total.toFixed(2)} TL`;
    const maxLen = 34; // ürün adı maksimum karakter

    // ürün adını 34 karakterden kesip boşluklardan kır
    const wrapped: string[] = [];
    let remaining = name;
    while (remaining.length > maxLen) {
      let cutIndex = maxLen;
      for (let i = maxLen; i > 0; i--) {
        if (remaining[i] === " ") {
          cutIndex = i;
          break;
        }
      }
      wrapped.push(remaining.slice(0, cutIndex));
      remaining = remaining.slice(cutIndex).trimStart();
    }
    if (remaining.length > 0) wrapped.push(remaining);

    // İlk satır ürün adı + fiyat (sağa hizalı)
    const firstLine = wrapped[0];
    const spaceCount = lineWidth - firstLine.length - priceText.length;
    receipt +=
      firstLine + " ".repeat(Math.max(0, spaceCount)) + priceText + "\n";

    // kalan satırlar sadece ürün adı
    for (let i = 1; i < wrapped.length; i++) {
      receipt += wrapped[i] + "\n";
    }

    // indirim varsa alt satır
    if (discount > 0) {
      const label = "  INDIRIM";
      const discountText = `-${discount.toFixed(2)} TL`;
      const spaceCountDiscount = lineWidth - label.length - discountText.length;
      receipt +=
        label +
        " ".repeat(Math.max(0, spaceCountDiscount)) +
        discountText +
        "\n";
    }

    receipt += "\n";
  });

  receipt += "-".repeat(lineWidth) + "\n\n";

  // --- TOPLAM ---
  const araToplam = selectedSale.reduce(
    (t, i) => t + (i.Tutar ?? (i.Price ?? 0) * (i.Stock ?? 1)),
    0
  );
  const toplamIndirim = selectedSale.reduce((t, i) => t + (i.IndTutar ?? 0), 0);
  const genelToplam = araToplam - toplamIndirim;

  const printLine = (label: string, value: string) => {
    const spaces = lineWidth - label.length - value.length;
    return label + " ".repeat(Math.max(0, spaces)) + value + "\n";
  };

  receipt += printLine("ARA TOPLAM", `${araToplam.toFixed(2)} TL`);
  receipt += printLine("INDIRIM", `-${toplamIndirim.toFixed(2)} TL`);
  receipt += "\n";
  receipt += `Slipde ${selectedSale.length} Cesit, ${selectedSale.reduce(
    (t, i) => t + (i.Stock ?? 1),
    0
  )} Adet Urun Bulunmaktadir\n\n`;
  receipt += printLine("Odeme Tipi: Nakit", `${genelToplam.toFixed(2)} TL`);
  receipt += printLine(
    "TOPLAM INDIRIM TUTARI",
    `-${toplamIndirim.toFixed(2)} TL`
  );
  receipt += "TOPLAM KDV\n";
  receipt += printLine("TOPLAM", `${genelToplam.toFixed(2)} TL`);

const qrData = "https://triaeczane.com";

// site metni ortalı
const siteText = "triaeczane.com";
const leftSpacesSite = Math.floor((lineWidth - siteText.length) / 2);
receipt += " ".repeat(leftSpacesSite) + siteText + "\n\n";

// QR kodu ortala
// ESC a 1 ile ortala modu, QR komutunu doğrudan gönder
receipt += ESC + "a" + "\x01"; // ortala

const qrStore =
  GS +
  "(k" +
  String.fromCharCode(
    (qrData.length + 3) % 256,
    Math.floor((qrData.length + 3) / 256),
    49,
    80,
    48
  ) +
  qrData;
const qrPrint = GS + "(k" + "\x03\x00" + "\x31\x51\x30";

receipt += qrStore + qrPrint + "\n\n";

// Yazdırdıktan sonra hizalamayı tekrar sola çek
receipt += ESC + "a" + "\x00"; // sola hizala

// --- Kağıt kes ---
receipt += GS + "V" + "\x41" + "\x10";

  return new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection(
      { host: printerIp, port: printerPort },
      () => {
        client.write(receipt, "binary");
        setTimeout(() => {
          try {
            client.destroy();
          } catch {}
          resolve();
        }, 1000);
      }
    );

    client.on("error", (err) => {
      console.log("Printer error", err);
      reject(err);
    });
  });
};
