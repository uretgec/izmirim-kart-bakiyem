# İZMİRİM KART BAKİYEM #

İzmirim Kart bakiye sorgulama ekranı. İzmir Büyükşehir Belediyesinin "Açık Veri Portalı" içinde yer alan "İzmirim Kart Bakiye Sorgulama" servisini kullanarak kartlarınızın bakiyesini kontrol edebilirsiniz.

## Özellikler ##

- [Açık Veri Portalı->İzmirim Kart Bakiye Sorgulama](https://acikveri.bizizmir.com/tr/dataset/izmirim-kart-bakiye-sorgulama/resource/4f6b8d92-bf86-4707-98d4-6f1b29758062) adresindeki açık api kullanılmakta.
- Dilediğiniz kadar kartı ekleyip bakiye sorgusu yapabilirsiniz. (Sayfalama sistemi yok ne yazik ki)
- Tarayıcı üzerinde çalışır ve localstorage özelliğini kullanır. (Veriler açtığınız tarayıcı üzerinde kalır. )
- Kartlarınız son güncelleme tarihine göre listelenir.
- Api tarafından verilen tüm bilgiler görüntülenir.
- Kart sıralaması: en güncel kart en üstte listelenir.

### Eksikler ###

- [X] Localstorage entegresi
- [X] Yeni kart ekle butonu kart eklenene kadar disable olmalı
- [X] Kartlarım sıralaması (sıralama lat update time a göre yapılmalı)
- [] Chrome app haline en basit nasıl getirilebilir?
- [X] manifest dosyasının düzenlenmesi
- [X] yapay zekadan 1 tane logo üretmesini iste
- [X] Github page haline getirilmesi
- [X] Delete butonunun aktifleştirilmesi
- [X] console log temizliği

### Altyapı ###

- [Alpinejs](https://github.com/alpinejs/alpine) 3.14.1
- [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) 5.3.3
