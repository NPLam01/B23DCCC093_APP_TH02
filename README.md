# Ứng Dụng Dự Báo Thời Tiết (WeatherApp) - React Native

Ứng dụng di động dự báo thời tiết được xây dựng bằng **React Native**, kết hợp dữ liệu thời tiết trực tiếp từ **OpenWeatherMap API**, định vị **GPS** thực tế và giao diện hiện đại với tính năng **tự động thay đổi hình nền theo thời tiết** từ thư mục `assets`.

---

## Tính Năng Nổi Bật

1. **Xem thời tiết hiện tại**:
   - Tự động nhận diện vị trí hiện tại qua GPS (Reverse Geocoding hiển thị tên quận/thành phố).
   - Hiển thị nhiệt độ hiện tại, trạng thái thời tiết, nhiệt độ cao nhất / thấp nhất.
   - Hiển thị chỉ số cảm nhận thực tế (*Feels like*), chỉ số chất lượng không khí (AQI).
2. **Dự báo theo giờ (24 giờ tiếp theo)**:
   - Danh sách cuộn ngang trực quan gồm: Giờ dự báo, biểu tượng thời tiết, xác suất có mưa (%) và nhiệt độ.
3. **Dự báo 5 ngày**:
   - Danh sách các ngày trong tuần kèm trạng thái thời tiết và khoảng nhiệt độ (Cao nhất / Thấp nhất).
4. **Màn hình chi tiết thời tiết (Detail Screen)**:
   - Chạm vào từng ngày để xem chi tiết đầy đủ các thông số thời tiết.
5. **Theo dõi các chỉ số khí tượng chuyên sâu**:
   - Độ ẩm (%), Tốc độ gió & Hướng gió (m/s), Áp suất khí quyển (hPa), Độ che phủ của mây (%), Lượng mưa (mm), Tầm nhìn (km), Giờ bình minh & Hoàng hôn.
6. **Đổi hình nền tự động theo thời tiết (`assets/`)**:
   - ☀️ **Nắng / Trời quang** (`nang.jpg`): Thời tiết ban ngày ít mây hoặc nắng ráo.
   - 🌙 **Ban đêm** (`troitoi.jpg`): Thời tiết ban đêm trời quang đãng, ngập tràn sao trời.
   - 🌧️ **Trời mưa** (`mua.jpg`): Khi có mưa rào, mưa phùn hoặc dông bão.
   - ☁️ **Nhiều mây** (`may.jpg`): Khi trời âm u, nhiều mây, sương mù hoặc mù mịt.
   - ❄️ **Trời lạnh / Tuyết** (`lanh.jpg`): Khi nhiệt độ $\le 12^\circ\text{C}$ hoặc có tuyết rơi.
7. **Xử lý quyền vị trí GPS**:
   - Tự động hỏi quyền truy cập vị trí khi mở ứng dụng.
   - Có cơ chế xử lý trường hợp từ chối quyền, hiển thị thông báo và nút thử lại (*Retry*).

---

##  Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

- **Node.js**: Phiên bản `>= 18.x` hoặc `>= 20.x` (khuyến nghị bản LTS).
- **JDK (Java Development Kit)**: Phiên bản `JDK 17` (khuyến nghị OpenJDK hoặc Microsoft OpenJDK 17).
- **Android Studio**:
  - Đã cài đặt **Android SDK Platform** (Android 14 / 15, API 34+).
  - Đã cài đặt **Android SDK Build-Tools** và **Android SDK Platform-Tools** (`adb`).
- **Android Emulator** hoặc **Thiết bị thật Android** đã bật chế độ *USB Debugging*.

---

## Hướng Dẫn Cài Đặt Từng Bước

### Bước 1: Mở thư mục dự án

```bash
cd e:\darkdate\APPP\app2\WeatherApp
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)

Cài đặt tất cả các thư viện cần thiết thông qua `npm`:

```bash
npm install
```

### Bước 3: Cấu hình đường dẫn Android SDK (`local.properties`)

Tạo hoặc kiểm tra file `android/local.properties`. File này cần chỉ định đường dẫn thư mục Android SDK trên máy của bạn.

Ví dụ trên Windows (đường dẫn chuẩn):
```properties
sdk.dir=C:\\Users\\Lenovo\\AppData\\Local\\Android\\Sdk
```
*(Thay thế `Lenovo` bằng tên User trên máy tính của bạn nếu khác).*

---

## Hướng Dẫn Khởi Chạy Ứng Dụng

### Bước 1: Khởi động máy ảo Android (Emulator) hoặc cắm điện thoại

Kiểm tra xem thiết bị đã sẵn sàng nhận kết nối hay chưa:

```bash
adb devices
```
*Kết quả xuất hiện thiết bị (ví dụ `emulator-5554 device`) là đã kết nối thành công.*

### Bước 2: Khởi chạy Metro Bundler

Mở một cửa sổ dòng lệnh (Terminal / PowerShell) và chạy lệnh:

```bash
npm start
```
*(Hoặc `npm start -- --reset-cache` nếu muốn xóa sạch cache cũ).*

### Bước 3: Biên dịch và chạy ứng dụng lên Android

Mở một cửa sổ dòng lệnh khác tại thư mục `WeatherApp` và chạy:

```bash
npm run android
```
*(hoặc dùng lệnh `npx react-native run-android`)*

Gradle sẽ tự động biên dịch mã nguồn, cài đặt file APK lên thiết bị và mở ứng dụng.

---

## Cấu Trúc Thư Mục Dự Án

```text
WeatherApp/
├── assets/                     # Bộ sưu tập hình ảnh nền theo thời tiết
│   ├── nang.jpg                # Nền trời nắng
│   ├── troitoi.jpg             # Nền bầu trời đêm
│   ├── mua.jpg                 # Nền mưa rơi
│   ├── may.jpg                 # Nền nhiều mây
│   └── lanh.jpg                # Nền mùa đông / lạnh giá
├── android/                    # Cấu hình dự án Android Native
│   ├── app/
│   │   └── src/main/AndroidManifest.xml  # Đã khai báo quyền GPS (ACCESS_FINE_LOCATION)
│   └── local.properties        # Đường dẫn SDK Android
├── src/
│   ├── components/
│   │   ├── DailyForecast.tsx   # Danh sách dự báo các ngày (nhiệt độ trực quan gọn gàng)
│   │   ├── HourlyForecast.tsx  # Thanh dự báo 24 giờ cuộn ngang
│   │   └── WeatherMetrics.tsx  # Khối hiển thị các thông số chi tiết (độ ẩm, gió, UV,...)
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Cấu hình Stack Navigation chuyển đổi màn hình
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Màn hình chính
│   │   ├── ForecastScreen.tsx  # Màn hình danh sách dự báo 5 ngày
│   │   └── DetailScreen.tsx    # Màn hình thông tin chi tiết của 1 ngày
│   ├── services/
│   │   └── weatherApi.ts       # Gọi OpenWeatherMap API (Thời tiết hiện tại & Forecast)
│   └── utils/
│       └── weatherUtils.ts     # Bộ hàm xử lý icon, đổi background theo thời tiết, format ngày giờ
├── App.tsx                     # Component gốc bọc GestureHandlerRootView
├── metro.config.js             # Cấu hình Metro bundler (hỗ trợ assets & avif)
├── package.json                # Danh sách dependencies & scripts
└── README.md                   # Tài liệu hướng dẫn sử dụng
```

---

## Xử Lý Sự Cố Thường Gặp (Troubleshooting)

### 1. Lỗi "SDK location not found"
- **Nguyên nhân**: Gradle không tìm thấy vị trí cài đặt Android SDK.
- **Khắc phục**: Tạo file `android/local.properties` và thêm dòng:
  ```properties
  sdk.dir=C:\\Users\\<TenUser>\\AppData\\Local\\Android\\Sdk
  ```

### 2. Ứng dụng báo lỗi quyền vị trí hoặc không lấy được thời tiết trên Emulator
- **Khắc phục**:
  1. Trong máy ảo Android, chọn **Cho phép khi dùng ứng dụng** (*Allow while using app*) khi có hộp thoại hỏi quyền vị trí.
  2. Bật tính năng định vị trên máy ảo: Vào menu **Settings** > **Location** > Bật **Use location**.
  3. Trong thanh điều khiển máy ảo (dấu 3 chấm `...`), mục **Location**, chọn một tọa độ bất kỳ và nhấn **Save** để máy ảo giả lập vị trí GPS.
  4. Kéo màn hình từ trên xuống để làm mới (Pull-to-Refresh) hoặc bấm nút **Thử lại**.

### 3. Lỗi xung đột cổng `8081` (Port 8081 already in use)
- **Khắc phục**: Chạy Metro trên cổng khác hoặc tắt tiến trình đang chiếm cổng:
  ```bash
  npx react-native start --port 8088
  npx react-native run-android --port 8088
  ```

### 4. Xóa cache và build lại sạch sẽ
Nếu gặp lỗi cache sau khi thêm thư viện hoặc đổi cấu hình:
```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
npm run android
```
