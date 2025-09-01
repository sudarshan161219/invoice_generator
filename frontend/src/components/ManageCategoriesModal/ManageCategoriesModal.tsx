// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import styles from "./index.module.css";
// import { useModal } from "@/hooks/useModal";

// type Category = {
//   id: number;
//   name: string;
//   color?: string;
//   isDefault?: boolean;
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onUpdated: () => void;
//   categories: Category[];
// };

// export const ManageCategoriesModal = ({
//   onUpdated,
//   categories,
// }: Props) => {
//   const [newName, setNewName] = useState("");
//   const [newColor, setNewColor] = useState("#ccc");
//   const { toggleModal } = useModal();

//   const handleAdd = async () => {
//     // 🔗 call your API to add category
//     // await api.post("/categories", { name: newName, color: newColor });
//     setNewName("");
//     onUpdated();
//   };

//   const handleDelete = async (id: number) => {
//     // 🔗 call your API to delete
//     // await api.delete(`/categories/${id}`);
//     onUpdated();
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalCard}>
//         <div className="space-y-3">
//           <div className="flex gap-2">
//             <Input
//               placeholder="New category name"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//             />
//             <input
//               type="color"
//               value={newColor}
//               onChange={(e) => setNewColor(e.target.value)}
//               className="w-12 h-10 p-0 border rounded"
//             />
//             <Button onClick={handleAdd}>Add</Button>
//           </div>

//           <div className="space-y-2">
//             {categories.map((cat) => (
//               <div
//                 key={cat.id}
//                 className="flex items-center justify-between p-2 border rounded"
//               >
//                 <div className="flex items-center gap-2">
//                   <span
//                     className="h-3 w-3 rounded-full"
//                     style={{ backgroundColor: cat.color || "#ccc" }}
//                   />
//                   {cat.name}
//                 </div>
//                 {!cat.isDefault && (
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => handleDelete(cat.id)}
//                   >
//                     Delete
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div onClick={toggleModal} className={styles.modalBg}></div>
//     </div>
//     // <Dialog open={open} onOpenChange={onClose}>
//     //   <DialogContent className="sm:max-w-lg">
//     //     <DialogHeader>
//     //       <DialogTitle>Manage Categories</DialogTitle>
//     //     </DialogHeader>

//     //   </DialogContent>
//     // </Dialog>
//   );
// };


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";
import { useModal } from "@/hooks/useModal";

type Category = {
  id: number;
  name: string;
  color?: string;
  isDefault?: boolean;
};

export const ManageCategoriesModal = () => {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#ccc");
  const { toggleModal, categories, setCategories } = useModal(); // ✅ from provider

  const handleAdd = async () => {
    if (!newName.trim()) return;

    // API call: POST category
    // const { data } = await api.post("/categories", { name: newName, color: newColor });

    const newCat: Category = {
      id: Date.now(), // temp id until API returns
      name: newName,
      color: newColor,
      isDefault: false,
    };

    setCategories((prev: Category[]) => [...prev, newCat]);
    setNewName("");
  };

  const handleDelete = async (id: number) => {
    // API call: DELETE category
    // await api.delete(`/categories/${id}`);

    setCategories((prev: Category[]) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-12 h-10 p-0 border rounded"
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          <div className="space-y-2">
            {categories.map((cat: Category) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#ccc" }}
                  />
                  {cat.name}
                </div>
                {!cat.isDefault && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div onClick={toggleModal} className={styles.modalBg}></div>
    </div>
  );
};
