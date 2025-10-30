import { IndirimTipi } from "../../types/enums/tria";

// export const calculateDiscountedPrice = (item: any, newCount: number) => {
//   const basePrice = item.Price ?? 0;
//   const newTotal = newCount * basePrice;

//   if (item.IndFlag === IndirimTipi.YuzdeIndirim) {
//     const discountAmount = basePrice * (item.IndOran / 100) * newCount;
//     return { newTotal: newTotal - discountAmount, discountAmount };
//   }

//   if (item.IndFlag === IndirimTipi.TutarIndirimi) {
//     const discountPerUnit = (item.IndTutar / (item.Stock || 1));
//     const discountAmount = discountPerUnit * newCount;
//     return { newTotal: newTotal - discountAmount, discountAmount };
//   }

//   return { newTotal, discountAmount: 0 };
// };

export const calculateDiscountedPrice = (item: any, newCount: number) => {
  const basePrice = item.Price ?? 0;
  const newTotal = newCount * basePrice;
  console.log(
    "adet hesaplama fonksiyonunda veriler konsole yazdırılıyor: ",
    item
  );
  if (item.IndFlag === IndirimTipi.YuzdeIndirim) {
    const discountAmount = parseFloat(
      (basePrice * (item.IndOran / 100) * newCount).toFixed(2)
    );
    return {
      newTotal: parseFloat((newTotal - discountAmount).toFixed(2)),
      discountAmount,
    };
  }

  if (item.IndFlag === IndirimTipi.TutarIndirimi) {
    const oldCount = item.Stock || 1;
    const discountRate = (item.IndTutar ?? 0) / (item.Price * oldCount);
    const discountAmount = parseFloat((newTotal * discountRate).toFixed(2));
    return {
      newTotal: parseFloat((newTotal - discountAmount).toFixed(2)),
      discountAmount,
    };
  }
  if (item.IndFlag === IndirimTipi.AlinacakTutar) {
    const unitTakePrice = (item.IndTutar ?? 0) / (item.Stock || 1); // birim başına alınacak tutar
    const newTotal = parseFloat((unitTakePrice * newCount).toFixed(2));
    const discountAmount = parseFloat(
      (item.Price * newCount - newTotal).toFixed(2)
    );
    return { newTotal, discountAmount };
  }

  return { newTotal: parseFloat(newTotal.toFixed(2)), discountAmount: 0 };
};
