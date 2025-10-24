// import TcpSocket from "react-native-tcp-socket";
// import { Alert } from "react-native";

// export const printCartReceipt = async (
//   selectedSale: any[],
//   printerIp: string = "192.168.0.44",
//   printerPort: number = 9100
// ): Promise<void> => {
//   if (!selectedSale || selectedSale.length === 0) {
//     Alert.alert("Hata", "Sepet boş!");
//     return;
//   }

//   // Windows-1254 (Turkish) karakter seti için doğru encoding
//   const turkishMap: Record<string, string> = {
//     'Ç': '\xC7',
//     'ç': '\xE7',
//     'Ğ': '\xD0',
//     'ğ': '\xF0',
//     'İ': '\xCE', // Büyük İ düzeltildi
//     'ı': '\xFD',
//     'Ö': '\xD6',
//     'ö': '\xF6',
//     'Ş': '\xDE',
//     'ş': '\xFE',
//     'Ü': '\xDC',
//     'ü': '\xFC',
//   };

//   const convertToTurkish = (str: string): string => {
//     return str.split('').map(char => {
//       return turkishMap[char] || char;
//     }).join('');
//   };

//   // Türkçe büyük harf dönüşümü
//   const toTurkishUpperCase = (str: string): string => {
//     return str
//       .replace(/i/g, 'İ')
//       .replace(/ı/g, 'I')
//       .toUpperCase();
//   };

//   return new Promise((resolve, reject) => {
//     const client = TcpSocket.createConnection(
//       { host: printerIp, port: printerPort },
//       () => {
//         const ESC = "\x1B";
//         const GS = "\x1D";

//         const subtotal = selectedSale.reduce((t, i) => t + i.Tutar, 0);
//         const totalQty = selectedSale.reduce((sum, i) => sum + i.Stock, 0);
//         const total = subtotal * 1.1;

//         let receipt = "";

//         // Yazıcıyı başlat ve Windows-1254 (Turkish) karakter seti
//         receipt += ESC + "@"; // Initialize
//         receipt += ESC + "t" + "\x12"; // Windows-1254 karakter seti
//         receipt += "\n";

//         // Başlık: Ters yazı
//         receipt += ESC + "a" + "\x01"; // Center
//         receipt += GS + "B" + "\x01"; // Reverse mode
//         receipt += ESC + "!" + "\x30"; // Double size bold
//         receipt += " " + convertToTurkish("SATIS SLIP BILGISI") + " \n";
//         receipt += GS + "B" + "\x00"; // Normal mode
//         receipt += ESC + "!" + "\x00";
//         receipt += "\n";

//         // Firma adı
//         receipt += ESC + "!" + "\x10"; // Bold
//         receipt += convertToTurkish("TRIA ECZANESI") + "\n";
//         receipt += ESC + "!" + "\x00";
//         receipt += ESC + "a" + "\x00"; // Left align
//         receipt += "\n";

//         // Slip bilgileri
//         receipt += convertToTurkish("Slip No       : 12345\n");
//         receipt += convertToTurkish("Musteri       : 10/2025/10000004\n");
//         receipt += convertToTurkish("Belge No      : 20251024-001\n");
//         receipt += convertToTurkish("Belge Tarihi  : 24/10/2025\n");
//         receipt += convertToTurkish("Personel No   : 01\n");
//         receipt += convertToTurkish("Personel Adi  : AHMET YILMAZ\n");
//         receipt += "\n";

//         receipt += "================================\n";

//         // Ürünler
//         selectedSale.forEach((item) => {
//           const productLine = `${item.Stock} X ${item.ProductName}`;
//           const priceLine = `${item.Price.toFixed(2)} ${item.Currency}`;

//           receipt += ESC + "!" + "\x08";
//           receipt += convertToTurkish(productLine) + "\n";
//           receipt += ESC + "!" + "\x00";
//           receipt += "    " + priceLine + "\n";
//         });

//         receipt += "================================\n";

//         // Özet
//         const summary = `Slipte ${selectedSale.length} CESIT, ${totalQty} ADET URUN BULUNMAKTADIR`;
//         receipt += convertToTurkish(summary) + "\n\n";

//         // Toplam
//         receipt += ESC + "!" + "\x30";
//         receipt += convertToTurkish("TOPLAM: ") + total.toFixed(2) + " TL\n";
//         receipt += ESC + "!" + "\x00";
//         receipt += "\n";

//         // Footer
//         receipt += ESC + "a" + "\x01";
//         receipt += "www.triazone.com\n";
//         receipt += "\n\n";

//         // Kağıt kes
//         receipt += GS + "V" + "\x41" + "\x10";

//         client.write(receipt);

//         setTimeout(() => {
//           client.destroy();
//           resolve();
//         }, 1000);
//       }
//     );

//     client.on("error", (err) => {
//       console.error("Yazıcı hatası:", err);
//       reject(err);
//     });

//     client.on("close", () => {
//       console.log("Yazıcı bağlantısı kapatıldı");
//     });
//   });
// };

import TcpSocket from "react-native-tcp-socket";

export const printCartReceipt = async (
  selectedSale: any[],
  printerIp: string = "192.168.0.44",
  printerPort: number = 9100
): Promise<void> => {
  const ESC = "\x1B";
  const GS = "\x1D";

  let receipt = "";

  // Başlık
  receipt += ESC + "!" + "\x30"; // double height + double width
  receipt += ESC + "a" + "\x01"; // center
  receipt += "SATIS SLIP BILGISI\n";
  receipt += ESC + "!" + "\x00"; // normal font
  receipt += ESC + "a" + "\x00"; // left align
  receipt += "\n";

  // Firma ve slip bilgileri
  receipt += "TRIA ECZANESI\n";
  receipt += "Slip No : 12345\n";
  receipt += "Musteri : 10/2025/10000004\n";
  receipt += "Belge No: 20251024-001\n";
  receipt += "Tarih   : 24/10/2025\n";
  receipt += "\n";
  receipt += "==============================\n";

  const lineWidth = 42; // yazıcıya göre satır genişliği

  // Ürünler
  selectedSale.forEach((item) => {
    const quantity = item.Stock ?? 1;
    const price = item.Tutar ?? item.Price ?? 0;
    const name = item.ProductName ?? "Bilinmeyen Ürün";

    const priceText = `${price.toFixed(2)} TL`;
    const firstLinePrefix = `${quantity} X `;

    const maxNameLengthFirstLine = lineWidth - firstLinePrefix.length - priceText.length;
    const firstLineName = name.substring(0, maxNameLengthFirstLine);
    const remainingName = name.substring(maxNameLengthFirstLine);

const extraSpace = 3; // fiyat ile ürün adı arasında ekstra boşluk
const spaces = " ".repeat(lineWidth - firstLinePrefix.length - firstLineName.length - priceText.length + extraSpace);
receipt += firstLinePrefix + firstLineName + spaces + priceText + "\n";

    // Eğer ürün adı uzun ise alt satırlara yaz
    if (remainingName.length > 0) {
      let rem = remainingName;
      while (rem.length > 0) {
        const lineText = rem.substring(0, lineWidth - 3); // alt satır genişliği
        rem = rem.substring(lineWidth - 3);
        receipt += "   " + lineText + "\n"; // alt satır başında boşluk
      }
    }
  });

  receipt += "==============================\n";

  // Özet
  const totalQty = selectedSale.reduce((t, i) => t + (i.Stock ?? 1), 0);
  receipt += `Slipde ${selectedSale.length} Cesit, ${totalQty} ADET URUN BULUNMAKTADIR\n\n`;

  // Toplam
  const total = selectedSale.reduce((t, i) => t + (i.Tutar ?? 0), 0);
  const totalText = "TOPLAM:";
  const totalPrice = `${total.toFixed(2)} TL`;
  const totalSpaces = " ".repeat(lineWidth - totalText.length - totalPrice.length);

  receipt += ESC + "!" + "\x30"; // bold + double
  receipt += totalText + totalSpaces + totalPrice + "\n";
  receipt += ESC + "!" + "\x00";
  receipt += "\n";

  // Footer
  receipt += ESC + "a" + "\x01"; // center
  receipt += "www.triazone.com\n\n";

  // Kağıt kes
  receipt += GS + "V" + "\x41" + "\x10";

  return new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection(
      { host: printerIp, port: printerPort },
      () => {
        client.write(receipt);
        setTimeout(() => {
          client.destroy();
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
