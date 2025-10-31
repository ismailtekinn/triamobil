// import { ProductDataItem } from "../../types/apiresponse/searchProduct";
// import { SaleItem } from "../../types/saleType";

// export const mapProductToSaleItem = (item: ProductDataItem, index: number, startIndex: number): SaleItem => {
//   return new SaleItem({
//     Index: startIndex + index + 1,
//     ProductName: item.MAL_ADI ,
//     Barcode: Number(item.BARKOD) ,
//     Stock: Math.abs(Number(item.BAKIYE)),
//     Price: Number(item.SATIS_FIYATI_1.replace(",", ".")) ,
//     VatRate: Number(item.SATIS_KDV) ,
//     Rayon: item.REYON_ADI ,
//     Currency: "TL",
//     UrunId: Number(item.ID) || undefined,
//   });
// };

import { ProductDataItem } from "../../types/apiresponse/searchProduct";
import { SaleItem } from "../../types/saleType";

export const mapProductToSaleItem = (
  item: ProductDataItem,
  index: number,
  startIndex: number
): SaleItem => {
  return new SaleItem({
    Index: startIndex + index + 1,
    ProductName: item.MAL_ADI,
    Barcode: Number(item.BARKOD),
    Stock: Math.abs(Number(item.BAKIYE)),
    Price: Number(item.SATIS_FIYATI_1.replace(",", ".")),
    VatRate: Number(item.SATIS_KDV),
    Rayon: item.REYON_ADI,
    Currency: "TL",
    UrunId: Number(item.ID) || undefined,

    // Bunların dışında kalan optional alanlar
    Isconto: undefined,
    isCanceled: item.isCanceled || undefined,
    UrunTipi: item.UrunTipi || undefined,
    DepartmanNo: item.DepartmanNo || undefined,
    Birim: item.Birim || undefined,
    Adet: item.Adet || undefined,
    BirimFiyat: item.BirimFiyat || undefined,
    IndFlag: item.IndFlag || undefined,
    IndOran: item.IndOran || undefined,
    IndTutar: item.IndTutar || undefined,
    SaticiNo: item.SaticiNo || undefined,
    Puan: item.PUAN ? Number(item.PUAN) : undefined,
    KasiyerNo: item.KasiyerNo || undefined,
    UrunKartiFiyati: item.UrunKartiFiyati || undefined,
    UpdateDate: item.UpdateDate || undefined,
    QrCode: item.QrCode || undefined,
    SeriNo: item.SeriNo || undefined,
    Miad: item.Miad || undefined,
    PartiNo: item.PartiNo || undefined,
    DipIskonto: item.KAMU_ISKONTO_ORANI
      ? Number(item.KAMU_ISKONTO_ORANI)
      : undefined,
    DipArttirim: item.DipArttirim || undefined,
    FiyatNo: item.FiyatNo || undefined,
    UtsLi: item.UTS_STATUS ? Number(item.UTS_STATUS) : undefined,
    UtsLotNo: item.UtsLotNo || undefined,
    UtsSeriNo: item.UtsSeriNo || undefined,
    UtsUrunNo: item.UtsUrunNo || undefined,
    UtsEssizKimlikNo: item.UtsEssizKimlikNo || undefined,
    discount: item.discount || undefined,
    arttirim: item.arttirim || undefined,
  });
};
