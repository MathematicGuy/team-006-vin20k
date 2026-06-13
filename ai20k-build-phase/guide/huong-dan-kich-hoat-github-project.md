# Hướng Dẫn Kích Hoạt Dự Án GitHub (GitHub Projects) 🚀

Hãy làm theo các bước sau để thiết lập hệ thống quản lý công việc chuyên nghiệp cho dự án AI của nhóm bạn.

## 1. Thiết lập ban đầu (Xây dựng nền móng)

- [ ] **Tạo Dự án**: Vào Organization/Profile của bạn > Projects > New Project > Chọn giao diện Board.
- [ ] **Liên kết Repository**: Vào Settings > Linked repositories > Chọn repo của dự án.
  Việc này giúp các Issue tự động đồng bộ giữa code và bảng quản lý.
- [ ] **Quyền truy cập**: Đảm bảo tất cả thành viên trong nhóm đều có quyền `Admin` hoặc `Write` trong phần cài đặt dự án.

## 2. Tùy chỉnh Quy trình làm việc (Các cột trạng thái)

Chuẩn hóa các cột để phản ánh đúng vòng đời phát triển của một sản phẩm AI:

- **Backlog (Ý tưởng)**: Nơi chứa các ý tưởng thô và các task chưa được phân công.
- **Ready for Dev (Sẵn sàng)**: Các task đã có mô tả rõ ràng (prompt/spec) và sẵn sàng để code.
- **In Progress (Đang làm)**: Đang thực hiện code hoặc tinh chỉnh Prompt (Prompt Engineering).
- **Review/QA (Kiểm thử)**: Đang đánh giá kết quả từ LLM hoặc duyệt Pull Request (PR).
- **Done (Hoàn thành)**: Task đã được merge và kiểm tra kỹ lưỡng.

## 3. Tự động hóa "Phải có" (Tăng hiệu suất)

Truy cập tab **Workflows** (góc trên bên phải) và kích hoạt các tính năng sau:

- [ ] **Item added to project**: Tự động chuyển các Issue mới tạo vào cột `Backlog`.
- [ ] **Item closed**: Tự động chuyển Issue sang cột `Done` khi Pull Request được merge.
- [ ] **Auto-add from Repo**: Cấu hình để bất kỳ Issue nào được tạo trong repo liên kết sẽ tự động xuất hiện trên bảng Project này.

## 4. Quy tắc thực hành tốt nhất cho sinh viên

- **Chia nhỏ Task (Atomic Design)**: Một Issue = Một nhiệm vụ cụ thể.
  Ví dụ: `Viết hàm gọi API OpenAI` chứ **không phải** `Làm phần backend`.
- **Quy tắc Assignee**: Không có task nào được nằm ở cột `In Progress` mà không có tên thành viên chịu trách nhiệm.
- **Nhãn dán (Labels)**: Sử dụng label để phân loại độ ưu tiên (`priority-high`), loại lỗi (`type-bug`), hoặc lĩnh vực (`area-prompt-eng`).
- **Liên kết PR với Issue**: Luôn sử dụng thanh sidebar `Development` trong Issue để liên kết với Pull Request. Khi đóng PR, Issue sẽ tự động đóng theo.

## 5. Quy định Quản lý AI20K Build Phase 🛡️

Dự án được quản lý theo tinh thần **"Làm như startup thật"**. Đội ngũ cần bám sát các quy định sau:

### 5.1 Quản lý tiến độ (Bắt buộc)

- **Daily Standup**: Tất cả thành viên phải dùng lệnh `/daily` báo cáo tiến độ trước **10:00 sáng** mỗi ngày.
- **Mentor Duty**: Một bạn đại diện báo cáo cho Coach trước **18:00** vào ngày có Workshop theo format chuẩn:
  `Done / Doing / Blocked / Link / Q&A`.

### 5.2 Lộ trình công việc (Sprints)

- **Thiết kế trước khi code**: Team phải tự viết PRD (User stories, wireframes), vẽ System Architecture và chốt DB schema trước để tránh refactor cực nhọc.
- **Chiến thuật Sprint (1-4)**: Ưu tiên code phần AI chạy được trước, sau đó lên UI cơ bản, tiếp đến quản lý User, cuối cùng hoàn thiện UI/UX.

## 🌟 Nguyên tắc vàng

Mỗi tuần đều phải demo được một tiến triển nào đó, tuyệt đối không **"code ngầm"** quá lâu.
