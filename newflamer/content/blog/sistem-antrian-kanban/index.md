---
title: "Kanban Antrian: a Proposal for Visible Workloads."
date: "2025-01-10"
category: "proposal"
description: "a Proposal: papan kanban publik untuk antrian layanan, supaya bottleneck kelihatan oleh semua orang."
---

> Antrian yang tidak terlihat adalah antrian yang tidak akan pernah diperbaiki.

### Abstrak

Kanban Antrian adalah usulan sederhana: setiap unit layanan menampilkan papan kanban publik — fisik atau digital — yang menunjukkan berapa banyak permohonan sedang menunggu, sedang dikerjakan, dan selesai hari itu. Bukan dashboard eksekutif yang hanya bisa dilihat pejabat, tapi papan yang menghadap ke ruang tunggu.

### Permasalahan

Saat ini, sebuah permohonan yang masuk ke unit layanan menghilang ke dalam kotak hitam. Pemohon tidak tahu posisinya di antrian, petugas loket tidak tahu beban unit pemroses, dan pimpinan hanya tahu angka agregat bulanan yang sudah terlambat tiga minggu untuk ditindaklanjuti.

Ketidaktampakan ini menghasilkan tiga patologi:

- **Antrian bayangan** — permohonan "titipan" yang menyalip tanpa terlihat, karena tidak ada urutan publik yang bisa dilanggar secara terlihat.
- **Bottleneck abadi** — satu meja yang selalu kelebihan beban, tidak pernah dibantu, karena bebannya tidak pernah terlihat oleh meja sebelah.
- **Estimasi fiktif** — janji "tiga hari kerja" yang tidak berbasis data antrian sama sekali.

### Solusi yang ditawarkan

Tiga kolom, satu papan, menghadap publik:

```
| MENUNGGU (14) | DIPROSES (3) | SELESAI HARI INI (22) |
```

Setiap kartu hanya memuat nomor tiket dan tanggal masuk — tanpa data pribadi. Aturannya satu: kartu bergerak dari kiri ke kanan, dan tidak ada kartu yang boleh menyalip tanpa penanda merah yang menjelaskan alasannya.

Efeknya bukan teknologi, tapi sosial. Antrian yang terlihat menciptakan akuntabilitas horizontal: pemohon mengawasi urutan, petugas mengawasi beban, dan penyalipan menjadi tindakan yang harus dilakukan di depan semua orang.

### Catatan implementasi

Versi minimum bisa berjalan dengan papan tulis dan sticky notes dalam satu hari, tanpa anggaran, tanpa pengadaan. Versi digitalnya menyusul kalau versi fisiknya terbukti — bukan sebaliknya. Terlalu banyak sistem mati karena dibangun dari layar dulu, bukan dari perilaku dulu.
