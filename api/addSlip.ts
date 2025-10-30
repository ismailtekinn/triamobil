import { Slip } from "../interface/ISlip";

const url = "http://192.168.0.162:44342/SlipEkle"
export const addSlip = async (slip: Slip) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slip),
    });

    if (!response.ok) {
      throw new Error(`Sunucudan hata geldi: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // backend'den dönen veri
  } catch (error: any) {
    console.error('Slip gönderilirken hata oluştu:', error.message);
    throw error;
  }
};
