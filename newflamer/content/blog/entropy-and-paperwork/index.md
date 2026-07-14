---
title: "Entropy and Paperwork: a Thermodynamic Reading."
date: "2025-06-02"
category: "bullshitology"
description: "Kenapa setiap sistem administrasi menuju kekacauan maksimum, dan kenapa lemari arsip adalah mesin panas yang buruk."
---

Hukum kedua termodinamika menyatakan bahwa entropi dalam sistem tertutup selalu bertambah. Hukum kedua administrasi menyatakan hal yang sama, hanya lebih cepat, dan dengan lebih banyak stempel.

Setiap dokumen yang lahir di sebuah institusi akan bermultiplikasi. Satu surat masuk menghasilkan satu lembar disposisi, dua fotokopi, satu arsip, dan — jika nasib sedang buruk — satu rapat. Rapat menghasilkan notulen. Notulen menghasilkan tindak lanjut. Tindak lanjut menghasilkan surat baru. Siklus ini tidak memiliki kondisi berhenti.

### Formalisasi masalah

Jika kita modelkan pertumbuhan dokumen secara naif:

```
D(t+1) = D(t) × (1 + r_disposisi + r_fotokopi)
         - shredding(t)      // selalu nol; tidak ada yang berani
         + rapat(t) × notulen_factor
```

Karena `shredding(t) = 0` untuk semua `t` (tidak ada pegawai yang berani memusnahkan arsip tanpa berita acara, dan berita acara pemusnahan membutuhkan arsip baru), fungsi ini monoton naik. Lemari arsip adalah bukti fisiknya: sebuah mesin panas yang mengubah energi pegawai menjadi kertas, tanpa pernah menghasilkan kerja yang berguna.

### Maxwell's demon, edisi tata usaha

Dalam eksperimen pikiran Maxwell, seekor iblis kecil menyortir molekul untuk melawan entropi. Setiap kantor punya iblis Maxwell-nya sendiri: satu orang staf tata usaha yang hafal letak semua dokumen. Sistem berjalan bukan karena sistemnya baik, tetapi karena iblis ini belum pensiun.

Saat ia pensiun, entropi menagih utangnya sekaligus. Tidak ada serah terima yang bisa mentransfer pengetahuan sepuluh tahun tentang "map merah di laci ketiga dari bawah, di balik map yang tulisannya sudah pudar".

### Kesimpulan sementara

Perlawanan terhadap entropi administrasi tidak bisa dimenangkan, hanya bisa ditunda. Digitalisasi sering dijual sebagai solusinya, tapi tanpa perubahan perilaku, digitalisasi hanya memindahkan tumpukan kertas menjadi tumpukan folder bernama `FINAL_rev3_FIX_benar2final (2).pdf`.

Entropi tidak bisa dilawan. Tapi ia bisa didokumentasikan — dan itulah yang blog ini lakukan.
