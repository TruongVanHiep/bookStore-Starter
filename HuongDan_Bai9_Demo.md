# BÁO CÁO & HƯỚNG DẪN DEMO BUỔI 9: BOOKSTORE ONLINE

Dự án đã hoàn thành trọn vẹn toàn bộ 8 nội dung bài tập Buổi 9 theo đúng yêu cầu đề bài:

---

## TỔNG HỢP NỘI DUNG ĐÃ THỰC HIỆN

| Bài | Nội dung | Kỹ năng chính | File triển khai chính | Trạng thái |
|---|---|---|---|---|
| **Bài 9.1** | Form thanh toán + validate | State form, giá trị dẫn xuất, disabled | `src/screens/CheckoutScreen.tsx` |  Hoàn thành |
| **Bài 9.2** | Gửi đơn hàng POST /orders | axios.post, loading/lỗi, clear giỏ | `src/screens/CheckoutScreen.tsx`<br>`src/services/orderService.ts` |  Hoàn thành |
| **Bài 9.3** | Đơn hàng của tôi | GET có _sort/_order, FlatList, mở rộng thẻ | `src/screens/OrdersScreen.tsx`<br>`src/services/orderService.ts` |  Hoàn thành |
| **Bài 9.4** | Xem và sửa hồ sơ | PATCH, cập nhật store sau khi lưu | `src/screens/ProfileScreen.tsx`<br>`src/services/userService.ts` |  Hoàn thành |
| **Bài 9.5** | Thông báo | Cập nhật lạc quan, điều hướng theo dữ liệu | `src/screens/NotificationsScreen.tsx`<br>`src/services/notificationService.ts` |  Hoàn thành |
| **Bài 9.6** | Kéo-để-làm-mới ở Home | RefreshControl, refreshing, onRefresh | `src/screens/HomeScreen.tsx`<br>`src/components/BookGrid.tsx` |  Hoàn thành |
| **Bài 9.7** | Tên, icon, splash | app.json, chạy thử bằng Expo Go | `app.json`<br>`assets/*` |  Hoàn thành |
| **Bài 9.8** | Rà soát và demo | Checklist luồng, dữ liệu demo | `db.json`, `HuongDan_Bai9_Demo.md` |  Hoàn thành |

---

## CHI TIẾT TỪNG BÀI

### 1. Bài 9.1: Form thanh toán + Validate (`src/screens/CheckoutScreen.tsx`)
- **State Form**: Quản lý các trường `name`, `phone`, `address`, `paymentMethod` ("cod" | "bank"), và `touched`.
- **Giá trị dẫn xuất (Derived State)**:
  - `nameError = validateRequired("họ tên")(name)`
  - `phoneError = validatePhone(phone)`
  - `addressError = validateRequired("địa chỉ nhận hàng")(address)`
  - `isValid = !nameError && !phoneError && !addressError`
- **Disabled**: Nút đặt hàng `disabled={!isValid || submitting}`. Chỉ khi thông tin hợp lệ mới bấm được.
- Gợi ý sẵn Họ tên và Số điện thoại từ tài khoản đang đăng nhập của người dùng.

### 2. Bài 9.2: Gửi đơn hàng POST /orders (`src/screens/CheckoutScreen.tsx` & `orderService.ts`)
- Khi người dùng bấm nút **Đặt hàng**:
  - Đặt `submitting = true`, ẩn lỗi cũ.
  - Gọi API `createOrder(...)` gửi `POST /orders` gồm `userId`, danh sách `items`, `total`, `address`, `paymentMethod`, `status: "pending"`, và `createdAt`.
  - Hiển thị ActivityIndicator trên nút đặt hàng trong lúc đợi server phản hồi.
  - Nếu gặp lỗi: bắt exception và hiển thị thông báo lỗi thân thiện.
  - Nếu thành công: Gọi action `clear()` từ `useCart()` để xóa giỏ hàng, hiển thị dialog chúc mừng thành công và chuyển sang màn hình **Đơn hàng của tôi (`OrdersScreen`)**.

### 3. Bài 9.3: Đơn hàng của tôi (`src/screens/OrdersScreen.tsx`)
- Gọi API GET `/orders?userId={userId}&_sort=createdAt&_order=desc` lấy danh sách đơn của user đã đăng nhập.
- Hiển thị dạng `FlatList` với:
  - Mã đơn hàng `#id`, ngày đặt, tổng tiền, nhãn trạng thái nhiều màu: *Chờ xác nhận (Vàng)*, *Đang giao (Xanh lam)*, *Đã hoàn tất (Xanh lá)*, *Đã hủy (Đỏ)*.
  - **Mở rộng thẻ (Expandable Card)**: Bấm vào thẻ để mở rộng/thu gọn chi tiết: xem từng quyển sách (tên, đơn giá, số lượng, thành tiền), thông tin người nhận, địa chỉ giao hàng, và phương thức thanh toán.
  - Kéo để làm mới với `RefreshControl`.

### 4. Bài 9.4: Xem và sửa hồ sơ (`src/screens/ProfileScreen.tsx`)
- Hiển thị thông tin người dùng: Avatar, Họ tên, Email (chế độ chỉ đọc/disabled), Số điện thoại.
- Validate: Họ tên bắt buộc, Số điện thoại phải đúng 10 số Việt Nam.
- Kiểm tra `hasChanged`: Nút "Lưu thay đổi" chỉ sáng lên khi người dùng có chỉnh sửa thông tin thực sự và dữ liệu hợp lệ.
- Khi bấm Lưu:
  - Gửi `PATCH /users/:id` với `{ name, phone }`.
  - Sau khi server phản hồi thành công, gọi `patchUser({ name, phone })` cập nhật Redux store `authSlice`.
  - Store cập nhật kích hoạt `usePersistence` tự động lưu lại vào `AsyncStorage`.
  - Hiển thị thông báo thành công và quay lại màn hình trước.

### 5. Bài 9.5: Thông báo (`src/screens/NotificationsScreen.tsx`)
- Gọi GET `/notifications?userId={userId}&_sort=createdAt&_order=desc`.
- Phân biệt rõ thông báo chưa đọc (chấm xanh + nền xanh nhạt + chữ đậm) và đã đọc.
- **Cập nhật lạc quan (Optimistic Update)**:
  - Khi bấm vào thông báo chưa đọc, UI lập tức chuyển sang trạng thái đã đọc ngay tại chỗ mà không cần chờ API.
  - Đồng thời gửi ngầm `PATCH /notifications/:id` với `{ read: true }`.
- **Điều hướng theo dữ liệu (Data-driven navigation)**:
  - Nếu thông báo có `target.screen === "Orders"`: Tự động điều hướng đến màn hình `Orders`.
  - Nếu thông báo có `target.screen === "BookDetail"`: Tự động điều hướng đến chi tiết cuốn sách tương ứng với `bookId`.
  - Nếu không có target: Mở thông báo xem chi tiết nội dung.

### 6. Bài 9.6: Kéo-để-làm-mới ở Home (`src/screens/HomeScreen.tsx`)
- Thêm state `refreshing` và hàm `onRefresh`.
- Gắn `RefreshControl` vào `BookGrid` (FlatList).
- Khi người dùng vuốt từ mép trên xuống, spinner hiện lên và app tự động fetch lại toàn bộ sách và danh mục mới nhất từ server.

### 7. Bài 9.7: Tên, icon, splash (`app.json` & thư mục `assets/`)
- Tên app: `"BookStore Online"`
- Slug: `"bookstore-online"`
- Thiết lập icon (`./assets/icon.png`), splash screen (`./assets/splash-icon.png`, nền `#0B1F5C`), adaptive icon cho Android (`./assets/adaptive-icon.png`).
- Đầy đủ asset, chạy mượt mà trên Expo Go không phát sinh cảnh báo thiếu hình.

### 8. Bài 9.8: Rà soát và demo (Checklist luồng)
Dưới đây là kịch bản kiểm thử (checklist) chi tiết để chạy demo:

```
[+] BƯỚC 1: Khởi động hệ thống
    1. Mở Terminal 1: npm run api (chạy json-server trên cổng 3000)
    2. Mở Terminal 2: npx expo start (chạy Expo)
    3. Tài khoản demo: demo@bookstore.vn / 123456

[+] BƯỚC 2: Kiểm tra Home & Kéo-để-làm-mới (Bài 9.6)
    1. Tại màn hình Home, kéo vuốt từ trên xuống.
    2. Xuất hiện spinner xoay indigo và danh sách sách được tải lại.

[+] BƯỚC 3: Mua hàng & Form Thanh Toán (Bài 9.1 & Bài 9.2)
    1. Chọn một cuốn sách bất kỳ, bấm "Thêm vào giỏ".
    2. Vào tab "Giỏ hàng", bấm nút "Thanh toán".
    3. Nếu chưa đăng nhập -> Màn hình Login xuất hiện -> Đăng nhập bằng demo@bookstore.vn / 123456 -> Tự động chuyển đến màn hình "Thanh toán".
    4. Kiểm tra validate:
       - Xóa trắng ô Họ tên hoặc Số điện thoại -> Báo lỗi đỏ ngay dưới ô.
       - Nút "Đặt hàng" bị vô hiệu hóa (mờ đi).
       - Nhập đầy đủ thông tin hợp lệ -> Nút "Đặt hàng" sáng lên.
    5. Chọn phương thức COD hoặc Ngân hàng.
    6. Nhấn "Đặt hàng":
       - Spinner hiển thị trên nút.
       - Gửi POST /orders thành công -> Giỏ hàng được xóa rỗng.
       - Hiển thị Alert chúc mừng kèm mã đơn hàng.
       - Tự động chuyển sang màn hình "Đơn hàng của tôi".

[+] BƯỚC 4: Đơn hàng của tôi (Bài 9.3)
    1. Màn hình "Đơn hàng của tôi" hiển thị đơn vừa đặt ở vị trí đầu tiên.
    2. Thấy rõ mã đơn, ngày giờ, nhãn "Chờ xác nhận", tổng tiền.
    3. Nhấn vào thẻ đơn hàng -> Thẻ mở rộng hiển thị chi tiết từng cuốn sách, giá tiền, địa chỉ và phương thức thanh toán. Nhấn lần nữa để thu gọn.

[+] BƯỚC 5: Xem và sửa hồ sơ (Bài 9.4)
    1. Vào tab "Tài khoản" -> Chọn "Thông tin cá nhân".
    2. Sửa họ tên hoặc số điện thoại.
    3. Nút "Lưu thay đổi" kích hoạt -> Bấm Lưu.
    4. Gửi PATCH /users/1 -> Cập nhật thành công -> Redux store cập nhật -> Tab Tài khoản hiển thị ngay tên mới.

[+] BƯỚC 6: Thông báo & Cập nhật lạc quan (Bài 9.5)
    1. Vào tab "Tài khoản" -> Chọn "Thông báo" (hoặc bấm biểu tượng chuông trên Header).
    2. Thấy danh sách thông báo (có thông báo chưa đọc với chấm xanh).
    3. Nhấn vào thông báo "Đơn hàng #2 đang giao" -> Chấm xanh biến mất ngay lập tức (cập nhật lạc quan) và màn hình tự động chuyển sang "Đơn hàng của tôi".
    4. Nhấn vào thông báo "Sách mới: Sapiens" -> Tự động chuyển ngay đến màn hình Chi tiết sách cuốn Sapiens.
```

