import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Slip, SlipContextType } from '../../interface/ISlip';



const AddSlipContext = createContext<SlipContextType | undefined>(undefined);

const initialSlipState: Slip = {
  Id: 0,
  BelgeTarihi: "23/10/2025",
  CariKodu: "42800125316",
  InsertUser: "ADMIN",
  InsertDate: "23/10/2025 11:49",
  UpdateUser: "ADMIN",
  UpdateDate: "23/10/2025 11:50",
  Saat: "23/10/2025 11:50",
  SaltTutar: "2749,85",
  KdvTutar: "250,00",
  SatirIskontoTutar: "0,00",
  AraToplam: "2499,85",
  GenelToplam: "2540,00",
  Toplam: "2500,00",
  MobilCihazDurum: 1,
  MobilBelgeId: 1,
  MobilBelgeNo: "0125102300001",
  MobilInsertDate: "23/10/2025 11:49",
  MobilUpdateDate: "23/10/2025 11:50",
  MobilSlipBasildi: 0,
  MobilCihazNo: 1,
  DipIskonto: "249,85",
  DipIskontoOran: "9,09",
  TPSStatus: 0,
  TPSSicilNo: "",
  SlipDetaylist: [
    {
      MalId: 12296,
      Miktar: 1,
      BirimFiyat: "2617,60",
      IskontoOran: "0,00",
      IskontoTutar: "0,00",
      Kdv: "10,00",
      Tutar: "2617,60",
      Barkod: "1",
      InsertUser: "ADMIN",
      UpdateUser: "ADMIN",
      SeriNo: "",
      SaticiKodu: "",
      KMiad: "",
      KSeriNo: "",
      KPartiNo: "",
      QrKodDurum: 0,
      Miad: "",
      uts_urun_no: "",
      uts_seri_no: "",
      uts_lot_no: "",
      uts_durum: 0,
      uts_essiz_kimlik_no: "",
      DipIskonto: "237,83",
      QRKod: ""
    }
  ]
};

export const SlipProvider = ({ children }: { children: ReactNode }) => {
  const [slip, setSlip] = useState<Slip>(initialSlipState); 

  const resetSlip = () => setSlip({});

  return (
    <AddSlipContext.Provider value={{ slip, setSlip, resetSlip }}>
      {children}
    </AddSlipContext.Provider>
  );
};

export const useSlip = () => {
  const context = useContext(AddSlipContext);
  if (!context) throw new Error('useSlip must be used within a SlipProvider');
  return context;
};
