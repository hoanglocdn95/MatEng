# MatEng

MatEng là ứng dụng PWA học Toán bằng tiếng Anh cơ bản cho học sinh tiểu học Việt Nam.

## Chạy tại máy

```sh
cd dist
python3 -m http.server 4173
```

Mở `http://localhost:4173`.

## Kiến trúc

- `dist/index.html`: shell ứng dụng.
- `dist/assets/data.js`: chương trình học dạng dữ liệu, có thể bổ sung bài mà không sửa logic.
- `dist/assets/app.js`: router, bài học, ôn tập và lưu tiến độ.
- `dist/assets/styles.css`: hệ thống thiết kế responsive.
- `dist/sw.js`: bộ nhớ đệm offline.

Không có tài khoản hoặc backend. Tiến độ và bản ghi luyện nói chỉ tồn tại trên thiết bị của người học.
