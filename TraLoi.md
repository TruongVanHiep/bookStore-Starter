BÀI TẬP REACT NATIVE
1. Cờ ready trong useAutoPersist

Nếu bỏ điều kiện ready, ứng dụng có thể ghi đè giỏ hàng đã lưu bằng giỏ hàng rỗng.

Thứ tự render:

Render lần đầu: State giỏ hàng khởi tạo là [].
Effect lưu dữ liệu chạy và có thể ghi [] vào AsyncStorage.
Effect đọc dữ liệu cũ từ AsyncStorage.
State được cập nhật thành giỏ hàng đã lưu.
Dữ liệu cũ có nguy cơ đã bị ghi đè.

Cờ ready giúp ngăn việc lưu dữ liệu trước khi quá trình đọc và khôi phục dữ liệu hoàn tất.

2. Token giả

Hai điểm không an toàn:

Kiểm tra mật khẩu ở phía client: Người dùng có thể xem và can thiệp vào mã nguồn, làm giả kết quả đăng nhập.
Tự tạo token ở phía client: Token không được máy chủ xác thực phát hành, có thể bị giả mạo.

Trong hệ thống thật:

Backend chịu trách nhiệm kiểm tra mật khẩu.
Backend phát hành token sau khi xác thực thành công.
iOS nên lưu token trong Keychain.
Android nên sử dụng Keystore kết hợp giải pháp lưu trữ an toàn.
React Native có thể dùng thư viện react-native-keychain.

Không nên lưu token nhạy cảm trong AsyncStorage.

3. Hai effect trong CartItemRow

Effect setQty(item.quantity) dùng để đồng bộ số lượng hiển thị với Store.

Nếu xóa effect này, số lượng hiển thị có thể bị lệch khi:

Một component khác tăng số lượng sản phẩm.
Một component khác giảm số lượng sản phẩm.
Số lượng sản phẩm bị thay đổi hoặc xóa trong Store.

Ví dụ:

Ban đầu Store có số lượng 2.
Nút hiển thị 2.
Component khác cập nhật Store thành 5.
Store có giá trị 5 nhưng nút vẫn hiển thị 2.

Do đó, effect đồng bộ giúp state nội bộ luôn theo kịp dữ liệu trong Store.

4. Một nguồn State

Nếu mỗi HeartButton sử dụng useState riêng:

Nút tim ở danh sách sản phẩm có trạng thái riêng.
Nút tim ở trang chi tiết có trạng thái riêng.
Khi nhấn yêu thích ở một nơi, nơi còn lại có thể không cập nhật.

Store giải quyết vấn đề bằng cách cung cấp một nguồn state dùng chung.

Các component cùng đọc và cập nhật trạng thái yêu thích từ Store. Khi Store thay đổi, các component liên quan được cập nhật và hiển thị đồng nhất.

5. Thêm biểu tượng hiện/ẩn mật khẩu

Sử dụng state showPassword:

jsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text
} from 'react-native';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10
      }}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ flex: 1 }}
        />

        <Pressable
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={{ fontSize: 20 }}>
            {showPassword ? '🙈' : '👁'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
Kết quả:

Ban đầu mật khẩu được ẩn.
Nhấn biểu tượng 👁 để hiện mật khẩu.
Nhấn biểu tượng 🙈 để ẩn mật khẩu.

Ảnh chụp màn hình: Cần chạy ứng dụng trên thiết bị hoặc trình giả lập, sau đó chụp màn hình giao diện thực tế để bổ sung vào bài nộp.