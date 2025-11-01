export type SignIn = {
  phone?: string;
  KullaniciKodu: string;
  Sifre: string;
};

export type Register = {
  Name: string;
  Surname: string;
  Username: string;
  Email: string;
  Password: string;
  Phone: string;
};

export type SuplierFields = {
  supplierName: string;
  supplierSurname: string;
  phone: string;
};

export type SearchTempBelgeId = {
  KullaniciKodu: string;
  WebErisimKullanici: string;
  WebErisimSifre: string;
};
