import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ViewShot from "react-native-view-shot";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { RootStackParamList } from "../types";
import { printTestReceipt } from "../api/escPostRequest";

const ReceiptScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const items = [
    { id: "1", name: "FURABYM V. 100 TL", qty: 1, price: 2517.6 },
    { id: "2", name: "MEDSANAX TAHSIVAN 0LCER", qty: 1, price: 30.0 },
    { id: "3", name: "SERTMUX SERUM", qty: 2, price: 2.0 },
  ];

  const subtotal = items.reduce((t, i) => t + i.qty * i.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const receiptRef = useRef<ViewShot>(null);
  
const handlePrint = async () => {
  setLoading(true);
  try {
    // ViewShot'tan görüntü al
    const uri = await receiptRef.current?.capture?.();
    
    if (!uri) {
      Alert.alert("Hata", "Görüntü yakalanamadı");
      return;
    }

    console.log("Görüntü yakalandı:", uri);

    // Görüntüyü yazıcıya gönder
    const result = await printTestReceipt(uri);
    
    Alert.alert("Başarılı", result || "Fiş başarıyla yazdırıldı");
  } catch (error: any) {
    console.error("Yazdırma hatası:", error);
    Alert.alert("Hata", error.message || "Yazıcıya bağlanılamadı");
  } finally {
    setLoading(false);
  }
};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ViewShot ref={receiptRef} options={{ format: "png", quality: 1.0 }}>
          <View style={styles.container}>
            {/* Logo/Marka Alanı - Siyah Arka Plan */}
            <View style={styles.headerBox}>
              <Text style={styles.brandName}>SATIŞ SLİP BİLGİSİ</Text>
            </View>

            {/* Şirket Bilgileri */}
            <Text style={styles.companyName}>TRİA ECZANESİ</Text>
            <Text style={styles.smallText}>Müşteri :10/2025/10000004</Text>
            <Text style={styles.smallText}>Belge No :</Text>
            <Text style={styles.smallText}>Belge Tarihi :</Text>
            <Text style={styles.smallText}>Personel No :</Text>
            <Text style={styles.smallText}>Personel Adı :</Text>

            {/* Müşteri Bilgileri */}
            <View style={styles.sectionDivider} />
            <Text style={styles.smallText}>Ürün Toplam:</Text>
            <Text style={styles.smallText}>Satır İndirim:</Text>
            <Text style={styles.smallText}>Belge İndirim:</Text>

            {/* Ürün Listesi Başlıkları */}
            <View style={styles.thickLine} />

            {/* Ürünler */}
            {items.map((item) => (
              <View key={item.id} style={styles.productSection}>
                <View style={styles.productRow}>
                  <Text style={styles.qtyBox}>{item.qty} X</Text>
                  <Text style={styles.productName}>{item.name}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Sİnde 1 Adet: Ürün Bulunmaktır
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.thickLine} />
            <Text style={styles.priceLabel}>
              Slipte {items.length} ÇEŞİT,{" "}
              {items.reduce((sum, i) => sum + i.qty, 0)} ADET ÜRÜN BULUNMAKTADIR
            </Text>
            {/* Alt Bilgiler */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Toplam</Text>
                <Text style={styles.totalAmount}>: {total.toFixed(2)} TL</Text>
              </View>
            </View>

            {/* QR Kod Alanı (Placeholder) */}
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>[QR KOD]</Text>
            </View>

            {/* Fiş No */}
            <Text style={styles.receiptNumber}>2639 60</Text>
            <Text style={styles.receiptInfo}>149 60 TL</Text>
            <Text style={styles.receiptInfo}>0.00 TL</Text>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>www.triazone.com</Text>
            </View>
          </View>
      </ViewShot>

      <TouchableOpacity onPress={handlePrint}>
        <Text>Yazdır</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 10,
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
  },

  // Header - Siyah kutu
  headerBox: {
    backgroundColor: "#000",
    padding: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  brandName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Şirket bilgileri
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 14,
    color: "#333",
  },

  // Bölüm ayırıcı
  sectionDivider: {
    height: 8,
  },

  // Kalın çizgi
  thickLine: {
    borderBottomWidth: 2,
    borderColor: "#000",
    marginVertical: 8,
  },

  // Ürün bölümü
  productSection: {
    marginVertical: 4,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  qtyBox: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 30,
  },
  productName: {
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 14,
  },
  priceRow: {
    marginTop: 2,
    marginLeft: 38,
  },
  priceLabel: {
    fontSize: 9,
    color: "#666",
    lineHeight: 12,
  },

  // Toplam bölümü
  totalSection: {
    marginTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "900",
  },

  // QR Kod
  qrPlaceholder: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 12,
  },
  qrText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  // Fiş numarası
  receiptNumber: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  receiptInfo: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },

  // Footer
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerText: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
});

export default ReceiptScreen;
