import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

//  kiểm tra sự hết hạn của token
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // kiểm tra value của biến 'exp' trong access token có nhỏ hơn currentTime hay không
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
