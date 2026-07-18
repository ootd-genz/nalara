export const starterPackage = {
  id: "website-katalog-produk",
  name: "Website Katalog Produk",
  description: "Katalog produk responsif dengan tombol pemesanan ke WhatsApp, marketplace, atau link affiliate.",
  price: 69_000,
  regularPrice: 150_000,
  currency: "IDR",
} as const;

export const onlineStorePackage = {
  id: "website-toko-online",
  name: "Website Toko Online",
  description: "Toko online dengan sistem pembayaran QRIS, transfer bank, DANA, dan metode pembayaran lainnya.",
  price: 599_000,
  regularPrice: 1_000_000,
  currency: "IDR",
} as const;

export function formatRupiah(amount: number) {
  return `Rp${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function getPackageById(packageId: unknown) {
  return packageId === starterPackage.id ? starterPackage : null;
}
