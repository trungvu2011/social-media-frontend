// Existing login validations
export const validateEmail = (email: string): string => {
  if (!email) return 'Email là bắt buộc';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return '';
};

// Register validations
export const validateFirstName = (firstName: string): string => {
  if (!firstName) return 'Họ là bắt buộc';
  if (firstName.length < 2) return 'Họ phải có ít nhất 2 ký tự';
  return '';
};

export const validateLastName = (lastName: string): string => {
  if (!lastName) return 'Tên là bắt buộc';
  if (lastName.length < 2) return 'Tên phải có ít nhất 2 ký tự';
  return '';
};

export const validateUsername = (username: string): string => {
  if (!username) return 'Tên người dùng là bắt buộc';
  if (username.length < 3) return 'Tên người dùng phải có ít nhất 3 ký tự';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
  return '';
};