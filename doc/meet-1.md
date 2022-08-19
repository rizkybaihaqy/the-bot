## Bot check order

1. trigger `/order [order_number]`
2. scrap html from `https://indihome.co.id/tracking-order?trackid=MYID-2122202231153`
3. return data

## Bot sales visit report

1. Sales report ke grup telegram (bot ada di grup)
2. `/visit [sales_id] [DEAL]? [MIP]?` kalo bisa save foto
3. save ke db
    1. counter visit sales di hari itu + 1
    2. counter Registrasi + 1 (ketika sudah input data)
4. return success

### Dashboard

Isi data sales dan visit
Leaderboard sales
bisa di filter data sales

## Bot sensus visit sales

1. trigger `/shareloc` untuk share location saat ini ke bot
2. save ke db
3. return success

## Dashboard

Berbentuk map dengan pin lokasi yang sudah dikunjugi/ deal
