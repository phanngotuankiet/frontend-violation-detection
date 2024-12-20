/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faChartLine,
  faVideo,
  faArrowRight,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  V
                </span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Violation<span className="text-blue-200">Detector</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hệ thống phát hiện vi phạm thông minh
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Sử dụng công nghệ AI tiên tiến để phát hiện và ngăn chặn các hành
              vi vi phạm một cách hiệu quả và chính xác.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all space-x-2 group"
            >
              <span>Bắt đầu ngay</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={faShieldAlt}
              title="Bảo mật tối ưu"
              description="Hệ thống bảo mật đa lớp, đảm bảo an toàn cho dữ liệu của bạn"
            />
            <FeatureCard
              icon={faChartLine}
              title="Phân tích thời gian thực"
              description="Theo dõi và phân tích dữ liệu theo thời gian thực"
            />
            <FeatureCard
              icon={faVideo}
              title="Xử lý video AI"
              description="Công nghệ AI tiên tiến trong việc phát hiện vi phạm qua video"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="99.9%" text="Độ chính xác" />
            <StatCard number="1000+" text="Người dùng" />
            <StatCard number="24/7" text="Hỗ trợ" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Về chúng tôi</h3>
              <p className="text-gray-400">
                Chúng tôi cung cấp giải pháp phát hiện vi phạm thông minh, giúp
                bạn quản lý an ninh hiệu quả hơn.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Liên Hệ</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  contact@violation.com
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  +84 123 456 789
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Đà Nẵng, Việt Nam
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Theo dõi</h3>
              <div className="flex space-x-4">
                <SocialIcon icon={faFacebook} />
                <SocialIcon icon={faTwitter} />
                <SocialIcon icon={faLinkedin} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Tải ứng dụng</h3>
              <div className="space-y-2">
                <button className="w-full px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                  App Store
                </button>
                <button className="w-full px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                  Google Play
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 ViolationDetector. Mọi quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 text-center">
    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
      <FontAwesomeIcon icon={icon} className="text-2xl text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, text }: any) => (
  <div className="p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
    <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{text}</div>
  </div>
);

const SocialIcon = ({ icon }: any) => (
  <a
    href="#"
    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
  >
    <FontAwesomeIcon icon={icon} />
  </a>
);

export default Dashboard;
