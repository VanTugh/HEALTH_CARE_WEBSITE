const listDoctorData = [
  {
    id: 1,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Vũ Văn Hòe",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2024/02/02/144127-bs-hoe1.jpg",
      description:
        "Bác sĩ có 35 năm kinh nghiệm về Cột sống, thần kinh, cơ xương khớp.",
      position: "Phó chủ tịch hội Phẫu thuật cột sống Việt Nam",
      note: "Bác sĩ nhận khám từ 7 tuổi trở lên",
      location: "Hà Nội",
    },
    schedule: {
      date: "29/10",
      bookingFee: 0,
      slots: [
        { time: "08:00 - 08:30", available: true },
        { time: "08:30 - 09:00", available: true },
        { time: "09:00 - 09:30", available: false },
        { time: "10:00 - 10:30", available: true },
        { time: "10:30 - 11:00", available: true },
        { time: "11:30 - 12:00", available: true },
        { time: "13:30 - 14:00", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Spinetech Clinic",
      address: "Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, Hà Nội",
    },
    price: {
      formatted: "500.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 2,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Nguyễn Thị Hạnh",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2023/06/05/100000-bs-hanh.jpg",
      description:
        "Chuyên gia cơ xương khớp với hơn 20 năm kinh nghiệm tại Bệnh viện Bạch Mai.",
      position: "Trưởng khoa Cơ xương khớp - BV Bạch Mai",
      note: "Khám và tư vấn tất cả các bệnh lý cơ xương khớp người lớn.",
      location: "Hà Nội",
    },
    schedule: {
      date: "29/10",
      bookingFee: 0,
      slots: [
        { time: "09:00 - 09:30", available: true },
        { time: "09:30 - 10:00", available: true },
        { time: "10:00 - 10:30", available: true },
        { time: "10:30 - 11:00", available: false },
      ],
    },
    clinic: {
      name: "Phòng khám Đa khoa Hòa Bình",
      address: "80 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    },
    price: {
      formatted: "450.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 3,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Trần Văn Dũng",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2023/05/21/101000-bs-dung.jpg",
      description:
        "Bác sĩ chuyên sâu về chấn thương chỉnh hình và phục hồi chức năng.",
      position: "Bệnh viện Việt Đức",
      note: "Khám từ 10 tuổi trở lên.",
      location: "Hà Nội",
    },
    schedule: {
      date: "30/10",
      bookingFee: 0,
      slots: [
        { time: "13:30 - 14:00", available: true },
        { time: "14:00 - 14:30", available: true },
        { time: "14:30 - 15:00", available: false },
        { time: "15:00 - 15:30", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Việt Đức Plus",
      address: "16-18 Phủ Doãn, Hoàn Kiếm, Hà Nội",
    },
    price: {
      formatted: "550.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 4,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Phạm Thị Lan",
      avatar: "https://cdn.bookingcare.vn/fo/w256/2023/08/15/141245-bs-lan.jpg",
      description:
        "Chuyên khoa cơ xương khớp, đặc biệt về viêm khớp dạng thấp và loãng xương.",
      position: "Bệnh viện Đại học Y Hà Nội",
      note: "Khám mọi đối tượng, ưu tiên người cao tuổi.",
      location: "Hà Nội",
    },
    schedule: {
      date: "30/10",
      bookingFee: 0,
      slots: [
        { time: "08:00 - 08:30", available: true },
        { time: "08:30 - 09:00", available: false },
        { time: "09:00 - 09:30", available: true },
        { time: "10:00 - 10:30", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Y học cổ truyền 108",
      address: "1 Trần Hưng Đạo, Hai Bà Trưng, Hà Nội",
    },
    price: {
      formatted: "400.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 5,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Lê Quang Huy",
      avatar: "https://cdn.bookingcare.vn/fo/w256/2023/07/01/110000-bs-huy.jpg",
      description: "Chuyên gia chỉnh hình và điều trị đau cột sống mãn tính.",
      position: "Bệnh viện Trung ương Quân đội 108",
      note: "Chỉ nhận khám buổi chiều.",
      location: "Hà Nội",
    },
    schedule: {
      date: "31/10",
      bookingFee: 0,
      slots: [
        { time: "13:30 - 14:00", available: true },
        { time: "14:00 - 14:30", available: true },
        { time: "14:30 - 15:00", available: true },
        { time: "15:00 - 15:30", available: false },
      ],
    },
    clinic: {
      name: "Phòng khám 108 Clinic",
      address: "Số 8 Phan Chu Trinh, Hoàn Kiếm, Hà Nội",
    },
    price: {
      formatted: "500.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 6,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Nguyễn Văn Phong",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2023/04/28/090000-bs-phong.jpg",
      description: "Bác sĩ chuyên về thoái hóa khớp, viêm cột sống dính khớp.",
      position: "Trưởng khoa Nội cơ xương khớp - BV E",
      note: "Khám từ 16 tuổi trở lên.",
      location: "Hà Nội",
    },
    schedule: {
      date: "31/10",
      bookingFee: 0,
      slots: [
        { time: "08:00 - 08:30", available: true },
        { time: "08:30 - 09:00", available: false },
        { time: "09:00 - 09:30", available: true },
        { time: "09:30 - 10:00", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Cơ Xương Khớp E Plus",
      address: "89 Trần Cung, Cầu Giấy, Hà Nội",
    },
    price: {
      formatted: "480.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 7,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Lưu Minh Đức",
      avatar: "https://cdn.bookingcare.vn/fo/w256/2023/09/01/150000-bs-duc.jpg",
      description:
        "Bác sĩ chấn thương chỉnh hình, chuyên phục hồi sau gãy xương và tai nạn thể thao.",
      position: "BV Thể thao Việt Nam",
      note: "Khám cả trẻ em và người lớn.",
      location: "Hà Nội",
    },
    schedule: {
      date: "01/11",
      bookingFee: 0,
      slots: [
        { time: "09:00 - 09:30", available: true },
        { time: "09:30 - 10:00", available: true },
        { time: "10:00 - 10:30", available: true },
        { time: "10:30 - 11:00", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Thể thao Việt Đức",
      address: "12 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
    },
    price: {
      formatted: "450.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 8,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Nguyễn Văn Hùng",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2023/06/02/100000-bs-hung.jpg",
      description:
        "Bác sĩ chuyên cơ xương khớp với 15 năm kinh nghiệm điều trị đau vai gáy.",
      position: "Bệnh viện Hữu nghị Việt Xô",
      note: "Khám từ thứ 2 đến thứ 6 hàng tuần.",
      location: "Hà Nội",
    },
    schedule: {
      date: "01/11",
      bookingFee: 0,
      slots: [
        { time: "14:00 - 14:30", available: true },
        { time: "14:30 - 15:00", available: false },
        { time: "15:00 - 15:30", available: true },
        { time: "15:30 - 16:00", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Hữu nghị Việt Xô",
      address: "1 Trần Khánh Dư, Hai Bà Trưng, Hà Nội",
    },
    price: {
      formatted: "520.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 9,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Phạm Đức Long",
      avatar:
        "https://cdn.bookingcare.vn/fo/w256/2024/03/01/101010-bs-long.jpg",
      description:
        "Bác sĩ điều trị chuyên sâu các bệnh lý cơ xương khớp mãn tính.",
      position: "Bệnh viện Quân Y 103",
      note: "Chỉ nhận khám buổi sáng.",
      location: "Hà Nội",
    },
    schedule: {
      date: "02/11",
      bookingFee: 0,
      slots: [
        { time: "08:00 - 08:30", available: true },
        { time: "08:30 - 09:00", available: true },
        { time: "09:00 - 09:30", available: false },
        { time: "09:30 - 10:00", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Quân Y 103",
      address: "261 Phùng Hưng, Hà Đông, Hà Nội",
    },
    price: {
      formatted: "470.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
  {
    id: 10,
    specialtySlug: "co-xuong-khop",
    specialtyName: "Cơ xương khớp",
    doctor: {
      name: "Lê Thị Thu",
      avatar: "https://cdn.bookingcare.vn/fo/w256/2023/11/03/100500-bs-thu.jpg",
      description: "Chuyên gia phục hồi chức năng và đau cơ xương sau tai nạn.",
      position: "Trung tâm phục hồi chức năng Việt Đức",
      note: "Nhận khám mọi đối tượng.",
      location: "Hà Nội",
    },
    schedule: {
      date: "02/11",
      bookingFee: 0,
      slots: [
        { time: "13:30 - 14:00", available: true },
        { time: "14:00 - 14:30", available: true },
        { time: "14:30 - 15:00", available: false },
        { time: "15:00 - 15:30", available: true },
      ],
    },
    clinic: {
      name: "Phòng khám Việt Đức Care",
      address: "Số 5 Hàng Bài, Hoàn Kiếm, Hà Nội",
    },
    price: {
      formatted: "500.000đ",
    },
    insurance: {
      detailUrl: "#",
    },
  },
];

export default listDoctorData;
