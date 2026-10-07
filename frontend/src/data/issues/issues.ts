import type { Issue, IssueStatus, Incident } from "../../types/issues";

export const INITIAL_ISSUES: Issue[] = [
  {
    id: "issue-101",
    room: "P101",
    vip: true,
    title: "Hỏng vòi nước bồn rửa mặt",
    description:
      "Vòi nước bị gãy chốt xoay, rò rỉ nước liên tục xuống gầm bồn rửa gây ngập nhẹ sàn nhà vệ sinh.",
    reporter: "Nguyễn Văn An",
    date: "01/10/2026",
    expectedCost: 150000,
    status: "TIEP_NHAN",
  },
  {
    id: "issue-205",
    room: "P205",
    title: "Rò rỉ đường ống nước ngấm tường",
    description:
      "Phát hiện thấm mốc tường góc phòng sát nhà vệ sinh, nước rỉ nhỏ giọt làm hư hại sàn gỗ công nghiệp.",
    reporter: "Trần Trí Bồ",
    date: "01/10/2026",
    expectedCost: 450000,
    status: "DANG_XU_LY",
  },
  {
    id: "issue-302",
    room: "P302",
    title: "Điều hòa không mát, chảy nước sàn",
    description:
      "Máy lạnh chỉ phả gió thường, cục nóng kêu to. Đội bảo trì đã đến vệ sinh lưới lọc và nạp thêm gas.",
    reporter: "Lê Hoàng Nam",
    date: "01/10/2026",
    expectedCost: 350000,
    actualCost: 350000,
    status: "HOAN_THANH",
  },
  {
    id: "issue-104",
    room: "P104",
    title: "Chập điện ổ cắm khu vực bếp",
    description:
      "Ổ cắm bị tóe lửa khi cắm nồi cơm điện, hiện tại toàn bộ hệ thống ổ cắm phụ tầng 1 đang mất điện.",
    reporter: "Phạm Minh Hải",
    date: "09/10/2026",
    expectedCost: 200000,
    status: "TIEP_NHAN",
  },
];

export const STATUS_LABEL: Record<IssueStatus, string> = {
  TIEP_NHAN: "Tiếp nhận",
  DANG_XU_LY: "Đang xử lý",
  HOAN_THANH: "Hoàn thành",
};

export const STATUS_CLASSES: Record<IssueStatus, string> = {
  TIEP_NHAN: "bg-[#fff3e0] text-[#d97706]",
  DANG_XU_LY: "bg-[#ebf3fe] text-[#3b82f6]",
  HOAN_THANH: "bg-[#e6f4ea] text-[#10b981]",
};

export const STATUS_ICONS: Record<IssueStatus, string> = {
  TIEP_NHAN: "/assets/72ce5.svg",
  DANG_XU_LY: "/assets/1cd6d.svg",
  HOAN_THANH: "/assets/f3dc6.svg",
};
export const initialIncidents: Incident[] = [
  {
    id: "1",
    title: "Sửa vòi nước nhà tắm",
    description:
      "Vòi nước bị rò rỉ ở phần chân từ sáng ngày 04/10. Nước chảy liên tục dù đã khóa vòi, làm sàn nhà tắm luôn bị ướt. Nhờ Chủ trọ kiểm tra và sửa giúp tôi.",
    room: "P101",
    date: "04/10/2026",
    time: "08:30",
    status: "TIEP_NHAN",
    imageName: "voi-nuoc-p101.jpg",
    icon: "/assets/5c658.svg",
  },
  {
    id: "2",
    title: "Máy lạnh không hoạt động",
    description: "Máy lạnh không làm mát, đèn báo nhấp nháy khi bật máy.",
    room: "P101",
    date: "03/10/2026",
    time: "19:15",
    status: "DANG_XU_LY",
    imageName: "may-lanh-p101.jpg",
    icon: "/assets/d8e28.svg",
  },
  {
    id: "3",
    title: "Đèn phòng bị hỏng",
    description:
      "Đèn trần phòng ngủ không sáng từ tối ngày 01/10. Tôi đã thử bật lại công tắc nhưng đèn vẫn không hoạt động. Nhờ Chủ trọ kiểm tra và thay bóng giúp tôi.",
    room: "P101",
    date: "01/10/2026",
    time: "20:00",
    status: "HOAN_THANH",
    imageName: "den-phong-p101.jpg",
    cost: 80000,
    icon: "/assets/89a79.svg",
  },
];
