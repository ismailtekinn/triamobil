import { useSlip } from "../../contex/salesscreen/AddSlipContext";
import { SaleItem } from "../../types/saleType";
import { SummaryState } from "../../contex/SalesContext";
import { formatDate, formatDateOnly } from "./dateFunc";
import { useEffect, useState } from "react";
import { tempBelgeIDVer } from "../../api/auth";

export const useConvertSlipData = () => {
  const { slip, setSlip } = useSlip();
  const [triaBelgeID, setTriaBelgeId] = useState();
  const fetchData = async () => {
    try {
      const response = await tempBelgeIDVer({
        KullaniciKodu: "ADMIN",
        WebErisimKullanici: "TRIA_TEST",
        WebErisimSifre: "SFR57220",
      });
      console.log("belge ıd değeri console yazdırılıyor :", response)
    } catch (error) {
      console.error("Belge ID alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const convert = (sepet: SaleItem[], total: SummaryState) => {
    const now = new Date();

    const slipDetayList = sepet.map((item) => ({
      MalId: item.UrunId,
      Miktar: 1,
      BirimFiyat: item.Price.toString() ?? "",
      IskontoOran: item.IndOran?.toString() ?? "0,00",
      IskontoTutar: item.IndTutar?.toString() ?? "0,00",
      Kdv: item.VatRate.toString(),
      Tutar: total.UrunTutar.toString(),
      Barkod: item.Barcode.toString(),
      InsertUser: "ADMIN",
      UpdateUser: "ADMIN",
      SeriNo: "",
      SaticiKodu: "",
      KMiad: "",
      KSeriNo: "",
      KPartiNo: "",
      QrKodDurum: 0,
      Miad: item.Miad ?? "",
      uts_urun_no: "",
      uts_seri_no: "",
      uts_lot_no: "",
      uts_durum: 0,
      uts_essiz_kimlik_no: "",
      DipIskonto: "",
      QRKod: "",
    }));

    const newSlip = {
      Id: 0,
      BelgeTarihi: formatDateOnly(now),
      CariKodu: "42800125316",
      InsertUser: "ADMIN",
      InsertDate: formatDate(now),
      UpdateUser: "ADMIN",
      UpdateDate: formatDate(now),
      Saat: formatDate(now),
      SaltTutar: total.UrunTutar.toString(),
      KdvTutar: "250,00",
      SatirIskontoTutar: total.TotalLineIsconto?.toString(),
      AraToplam: total.UrunTutar.toString(),
      GenelToplam: total.totalPrice.toString(),
      Toplam: total.totalPrice.toString(),
      MobilCihazDurum: 1,
      MobilBelgeId: 1,
      MobilBelgeNo: "0125102300001",
      MobilInsertDate: formatDate(now),
      MobilUpdateDate: formatDate(now),
      MobilSlipBasildi: 0,
      MobilCihazNo: 1,
      DipIskonto: total.IndTutar.toString(),
      DipIskontoOran: total.Isconto?.toString(),
      TPSStatus: 0,
      TPSSicilNo: "",
      SlipDetaylist: slipDetayList,
    };

    setSlip(newSlip);

    return newSlip;
  };

  return convert;
};

// const slipDetayList = sepet.map((item) => ({
//   MalId: item.UrunId,
//   Miktar: 1,
//   BirimFiyat: "2617,60",
//   IskontoOran: "0,00",
//   IskontoTutar: "0,00",
//   Kdv: "10,00",
//   Tutar: "2617,60",
//   Barkod: "1",
//   InsertUser: "ADMIN",
//   UpdateUser: "ADMIN",
//   SeriNo: "",
//   SaticiKodu: "",
//   KMiad: "",
//   KSeriNo: "",
//   KPartiNo: "",
//   QrKodDurum: 0,
//   Miad: "",
//   uts_urun_no: "",
//   uts_seri_no: "",
//   uts_lot_no: "",
//   uts_durum: 0,
//   uts_essiz_kimlik_no: "",
//   DipIskonto: "237,83",
//   QRKod: "",
// }));

// setSlip({
//   Id: 0,
//   BelgeTarihi: "23/10/2025",
//   CariKodu: "42800125316",
//   InsertUser: "ADMIN",
//   InsertDate: "23/10/2025 11:49",
//   UpdateUser: "ADMIN",
//   UpdateDate: "23/10/2025 11:50",
//   Saat: "23/10/2025 11:50",
//   SaltTutar: total.UrunTutar.toString(),
//   KdvTutar: "250,00",
//   SatirIskontoTutar: "0,00",
//   AraToplam: total.UrunTutar.toString(),
//   GenelToplam: total.totalPrice.toString(),
//   Toplam: total.totalPrice.toString(),
//   MobilCihazDurum: 1,
//   MobilBelgeId: 1,
//   MobilBelgeNo: "0125102300001",
//   MobilInsertDate: "23/10/2025 11:49",
//   MobilUpdateDate: "23/10/2025 11:50",
//   MobilSlipBasildi: 0,
//   MobilCihazNo: 1,
//   DipIskonto: "249,85",
//   DipIskontoOran: "9,09",
//   TPSStatus: 0,
//   TPSSicilNo: "",
//   SlipDetaylist: slipDetayList,
// });
