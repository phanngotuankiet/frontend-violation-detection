import React, { useState } from "react";
import { IztrolabeProps } from "../Iztrolabe/Iztrolabe.type";

interface FormData {
  birthday: string;
  birthTime: number;
  gender: "male" | "female";
  birthdayType: "solar" | "lunar";
  name: string;
}

export const FormInputIztro = ({
  onSubmit,
}: {
  onSubmit: (data: IztrolabeProps) => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    birthday: "",
    birthTime: 0,
    gender: "male",
    birthdayType: "solar",
    name: "",
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">
        Thông tin lá số
      </h2>

      {/* Birthday Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Loại ngày sinh <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <button
            className={`px-6 py-2 rounded-lg transition-all ${
              formData.birthdayType === "solar"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setFormData({ ...formData, birthdayType: "solar" })}
          >
            Dương lịch
          </button>
          <button
            className={`px-6 py-2 rounded-lg transition-all ${
              formData.birthdayType === "lunar"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setFormData({ ...formData, birthdayType: "lunar" })}
          >
            Âm lịch
          </button>
        </div>
      </div>

      {/* Birthday Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ngày sinh <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ví dụ: 2001-12-9"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.birthday}
          onChange={(e) => {
            // Allow typing any character first
            setFormData({ ...formData, birthday: e.target.value });
            
            // Optional: Basic format validation when user stops typing
            const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
            if (datePattern.test(e.target.value)) {
              const [year, month, day] = e.target.value.split('-');
              if (
                parseInt(year) > 1900 && 
                parseInt(year) < 2100 &&
                parseInt(month) >= 1 && 
                parseInt(month) <= 12 && 
                parseInt(day) >= 1 && 
                parseInt(day) <= 31
              ) {
                // Format the date if valid
                const formattedDate = `${year}-${parseInt(month)}-${parseInt(day)}`;
                setFormData(prev => ({ ...prev, birthday: formattedDate }));
              }
            }
          }}
        />
      </div>

      {/* Birth Time Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Thời gian sinh <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: Number(e.target.value) })}
        >
          <option value={0}>Giờ tý sớm (00:00~01:00)</option>
          <option value={1}>Giờ sửu (01:00~03:00)</option>
          <option value={2}>Giờ dần (03:00~05:00)</option>
          <option value={3}>Giờ mão(05:00~07:00)</option>
          <option value={4}>Giờ thìn (07:00~09:00)</option>
          <option value={5}>Giờ tỵ (09:00~11:00)</option>
          <option value={6}>Giờ ngọ (11:00~13:00)</option>
          <option value={7}>Giờ mùi (13:00~15:00)</option>
          <option value={8}>Giờ thân (15:00~17:00)</option>
          <option value={9}>Giờ dậu (17:00~19:00)</option>
          <option value={10}>Giờ tuất (19:00~21:00)</option>
          <option value={11}>Giờ hợi (21:00~23:00)</option>
          <option value={12}>Giờ tý muộn (23:00~00:00)</option>
        </select>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Giới tính <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="w-4 h-4 text-purple-600"
              checked={formData.gender === "male"}
              onChange={() => setFormData({ ...formData, gender: "male" })}
            />
            <span>Nam</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              className="w-4 h-4 text-purple-600"
              checked={formData.gender === "female"}
              onChange={() => setFormData({ ...formData, gender: "female" })}
            />
            <span>Nữ</span>
          </label>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tên</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập tên của bạn"
        />
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        onClick={() => {
          // Validate required fields
          if (!formData.birthday || !formData.birthTime || !formData.gender) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
          }
          onSubmit({
            ...formData,
            fixLeap: true,
            isLeapMonth: true,
            lang: 'vi',
            options: {}
          });
        }}
      >
        Phát ra
      </button>
    </div>
  );
};
