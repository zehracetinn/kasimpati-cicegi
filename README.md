# 🌼 Kasımpatı — küçük bir dijital bahçe

Bağlantı açılır açılmaz yaprakları tek tek açılan, yıldızlarla ve ışık parçacıklarıyla süslenmiş interaktif bir kasımpatı web sitesi.

## Özellikler
- Sayfa açılır açılmaz çiçek açma animasyonu
- Altın sarısı, pembe ve leylak renk seçenekleri
- Tek tuşla animasyonu yeniden oynatma
- İsim ve kişisel mesaj içeren paylaşılabilir bağlantı
- Mobil ve masaüstü uyumlu, yalnızca HTML/CSS/JavaScript
- Hareket hassasiyetini dikkate alan erişilebilir animasyonlar

## Bilgisayarda açma

`index.html` dosyasını tarayıcıda açman yeterli. Herhangi bir paket kurmana gerek yok.

## GitHub Pages ile ücretsiz yayınlama

1. GitHub'da **New repository** ile `kasimpati-cicegi` adlı herkese açık bir depo oluştur.
2. Bu klasördeki `index.html`, `styles.css`, `app.js` ve `.nojekyll` dosyalarını deponun ana dizinine yükle.
3. GitHub'da **Settings → Pages → Build and deployment** bölümüne gir.
4. **Source: Deploy from a branch**, **Branch: main** ve **Folder: /(root)** seçip **Save** de.
5. Site hazır olunca adresin genellikle `https://KULLANICI_ADIN.github.io/kasimpati-cicegi/` olur.

> Sitenin başkaları tarafından açılabilmesi için önce internette yayınlanmış olması gerekir. `file://` adresini paylaşmak işe yaramaz.

## Kişiye özel bağlantı örneği

Yayındaki adresinin sonuna şunları ekleyebilirsin:

`?isim=Deniz&mesaj=Bu%20çiçek%20senin%20için&renk=rose`

Veya sitedeki **Birine gönder** düğmesine tıkla; ismi ve notu gir, linkini oluştur.

## Dosyalar

- `index.html`: Sayfa içeriği ve çiçek SVG'si
- `styles.css`: Tasarım, responsive görünüm ve geçiş animasyonları
- `app.js`: Kasımpatı yapraklarını oluşturma, ışık efektleri, renk seçimi ve paylaşım
- `.nojekyll`: GitHub Pages'ın projeyi doğrudan statik site olarak sunmasına yardımcı olur

Her şey tarayıcıda çalışır; sunucu, veritabanı veya ücretli API gerekmez.
