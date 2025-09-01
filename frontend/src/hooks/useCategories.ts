import { useState } from "react";

export type Category = {
  id: number;
  name: string;
  color: string;
  isDefault: boolean;
};

export const useCategories = (initial: Category[]) => {
  const [categories, setCategories] = useState<Category[]>(initial);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const addCategory = (name: string, color: string) => {
    if (!name.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name, color, isDefault: false },
    ]);
  };

  const removeCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setSelectedCategory((prev) => (prev === id.toString() ? undefined : prev));
  };

  const selectCategory = (id?: string) => {
    setSelectedCategory((prev) => (prev === id ? undefined : id));
  };

  return {
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory: selectCategory,
    addCategory,
    removeCategory,
  };
};
