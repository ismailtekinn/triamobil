export interface Slip {
  Id?: number
  BelgeTarihi?: string
  CariKodu?: string
  InsertUser?: string
  InsertDate?: string
  UpdateUser?: string
  UpdateDate?: string
  Saat?: string
  SaltTutar?: string
  KdvTutar?: string
  SatirIskontoTutar?: string
  AraToplam?: string
  GenelToplam?: string
  Toplam?: string
  MobilCihazDurum?: number
  MobilBelgeId?: number
  MobilBelgeNo?: string
  MobilInsertDate?: string
  MobilUpdateDate?: string
  MobilSlipBasildi?: number
  MobilCihazNo?: number
  DipIskonto?: string
  DipIskontoOran?: string
  TPSStatus?: number
  TPSSicilNo?: string
  SlipDetaylist?: SlipDetaylist[]
}

export interface SlipDetaylist {
  MalId?: number
  Miktar?: number
  BirimFiyat?: string
  IskontoOran?: string
  IskontoTutar?: string
  Kdv?: string
  Tutar?: string
  Barkod?: string
  InsertUser?: string
  UpdateUser?: string
  SeriNo?: string
  SaticiKodu?: string
  KMiad?: string
  KSeriNo?: string
  KPartiNo?: string
  QrKodDurum?: number
  Miad?: string
  uts_urun_no?: string
  uts_seri_no?: string
  uts_lot_no?: string
  uts_durum?: number
  uts_essiz_kimlik_no?: string
  DipIskonto?: string
  QRKod?: string
}


export interface SlipContextType {
  slip: Slip;
  setSlip: React.Dispatch<React.SetStateAction<Slip>>;
  resetSlip: () => void;
}