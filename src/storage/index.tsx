import { useState, useEffect } from "react";

type StorageType = "local" | "session";

function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = "local"
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storage = type === "local" ? localStorage : sessionStorage;

  // Lấy giá trị ban đầu từ storage hoặc dùng giá trị mặc định
  const [value, setValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading ${key} from ${type}Storage`, error);
      return initialValue;
    }
  });

  // Khi value thay đổi, lưu lại vào storage
  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing ${key} to ${type}Storage`, error);
    }
  }, [key, value, storage]);

  return [value, setValue];
}

export const STORAGE_KEY = {
  I18N_LANGUAGE: "i18n_language",
};

export default useStorage;
