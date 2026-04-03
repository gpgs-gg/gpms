import { useEffect, useState } from "react";
import { Plus, MoveLeft, Trash2 } from "lucide-react";
// import axios from "axios";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUpdateCategoryStatus,
} from "../components/services/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCategoriesPage = ({ parent, onBack }) => {
  // const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [formData, setFormData] = useState({
    category_name: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories = [], isLoading } = useCategories(parent?.id);
  const updateStatus = useUpdateCategoryStatus();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // const fetchCategories = async () => {
  //   try {
  //     setIsLoading(true);

  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BASE_URL}/categories`,
  //     );

  //     const allCategories = res.data?.data || [];

  //     const filtered = allCategories.filter(
  //       (cat) => cat.main_service_id === parent?.id,
  //     );

  //     setCategories(filtered);
  //   } catch (error) {
  //     toast.error("Failed to fetch categories");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (parent?.id) {
  //     fetchCategories();
  //   }
  // }, [parent]);

  // ================= SUBMIT =================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     if (editingId) {
  //       await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/update`, {
  //         category_id: editingId,
  //         category_name: formData.category_name,
  //       });
  //       toast.success("Category updated successfully");
  //     } else {
  //       await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/create`, {
  //         main_service_id: parent?.id,
  //         category_name: formData.category_name,
  //       });
  //       toast.success("Category created successfully");
  //     }

  //     setFormData({ category_name: "" });
  //     setEditingId(null);
  //     setIsModalOpen(false);
  //     fetchCategories();
  //   } catch (error) {
  //     console.error("Submit failed", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateCategory.mutateAsync({
          category_id: editingId,
          category_name: formData.category_name,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync({
          main_service_id: parent?.id,
          category_name: formData.category_name,
        });
        toast.success("Category created successfully");
      }

      setFormData({ category_name: "" });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);

      await deleteCategory.mutateAsync({
        category_id: categoryToDelete.category_id,
      });

      toast.success("Category deleted successfully");

      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };
  // const confirmDelete = async () => {
  //   if (!categoryToDelete) return;

  //   try {
  //     setIsDeleting(true);

  //     await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/delete`, {
  //       category_id: categoryToDelete.category_id,
  //     });

  //     toast.success("Category deleted successfully");

  //     setIsDeleteModalOpen(false);
  //     setCategoryToDelete(null);
  //     fetchCategories();
  //   } catch (error) {
  //     toast.error("Failed to delete category");
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (category) => {
    setFormData({
      category_name: category.category_name || "",
    });

    setEditingId(category.category_id);
    setIsModalOpen(true);
  };
  const confirmStatusToggle = async () => {
    if (!categoryToToggle) return;

    try {
      const newStatus =
        categoryToToggle.status === "active" ? "inactive" : "active";

      setUpdatingStatusId(categoryToToggle.category_id);

      await updateStatus.mutateAsync({
        category_id: categoryToToggle.category_id,
        status: newStatus,
      });

      toast.success("Status updated successfully");

      setIsStatusModalOpen(false);
      setCategoryToToggle(null);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };
  // const confirmStatusToggle = async () => {
  //   if (!categoryToToggle) return;

  //   try {
  //     const newStatus =
  //       categoryToToggle.status === "active" ? "inactive" : "active";

  //     setUpdatingStatusId(categoryToToggle.category_id);

  //     await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/categories/update-status`,
  //       {
  //         category_id: categoryToToggle.category_id,
  //         status: newStatus,
  //       },
  //     );

  //     toast.success("Status updated successfully");

  //     setIsStatusModalOpen(false);
  //     setCategoryToToggle(null);

  //     await fetchCategories();
  //   } catch (error) {
  //     toast.error("Failed to update status");
  //   } finally {
  //     setUpdatingStatusId(null);
  //   }
  // };
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Categories - {parent?.title}
        </h1>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 flex items-center gap-2  py-2 border rounded-lg"
          >
            <MoveLeft className="w-5" /> Back
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ category_name: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow  border">
        <div className="max-h-[480px] overflow-y-auto overflow-x-auto ">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-black text-white text-xl">
              <tr>
                <th className="p-4 bg-black sticky top-0 left-0 z-50">
                  Category Name
                </th>
                <th className="p-4 bg-black sticky top-0">Status</th>
                <th className="p-4 bg-black sticky top-0">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                [...Array(categories.length || 5)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.category_id} className="border-t">
                    <td className="p-4 font-medium sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                      {category.category_name}
                    </td>

                    {/* <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          category.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td> */}

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Toggle */}
                        {/* <button
                          onClick={() => handleStatusToggle(category)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            category.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              category.status === "active"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button> */}

                        <button
                          disabled={updatingStatusId === category.category_id}
                          onClick={() => {
                            setCategoryToToggle(category);
                            setIsStatusModalOpen(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            category.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } ${
                            updatingStatusId === category.category_id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {updatingStatusId === category.category_id ? (
                            <span className="bw-loader-small"></span>
                          ) : (
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                category.status === "active"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-orange-500 hover:orange-blue-700 px-3 py-1"
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* status modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Category Status
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to{" "}
              <span className="font-medium text-black">
                {categoryToToggle?.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </span>{" "}
              <span className="font-medium text-black">
                {categoryToToggle?.category_name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setCategoryToToggle(null);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusToggle}
                disabled={updatingStatusId === categoryToToggle?.category_id}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  updatingStatusId === categoryToToggle?.category_id
                    ? "bg-gray-300 text-gray-600"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {updatingStatusId === categoryToToggle?.category_id ? (
                  <>
                    <span className="bw-loader"></span> Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Category Name"
                value={formData.category_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_name: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg ${
                    isSubmitting
                      ? "bg-gray-300 text-gray-600"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Category
            </h2>

            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {categoryToDelete?.category_name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isDeleting
                    ? "bg-gray-300 text-gray-600"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isDeleting ? (
                  <>
                    <span className="bw-loader"></span> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>

          <style>{`
      .bw-loader {
        border: 3px solid #e5e5e5;
        border-top: 3px solid #000;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        animation: spin 0.6s linear infinite;
      }
        .bw-loader-small {
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.6s linear infinite;
}

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
        </div>
      )}
    </div>
  );
};

export default ManageCategoriesPage;

// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ManageCategoriesPage = ({ parent, onBack }) => {
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [categoryToToggle, setCategoryToToggle] = useState(null);
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);
//   const [formData, setFormData] = useState({
//     category_name: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchCategories = async () => {
//     try {
//       setIsLoading(true);

//       const res = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/categories`,
//       );

//       const allCategories = res.data?.data || [];

//       const filtered = allCategories.filter(
//         (cat) => cat.main_service_id === parent?.id,
//       );

//       setCategories(filtered);
//     } catch (error) {
//       toast.error("Failed to fetch categories");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (parent?.id) {
//       fetchCategories();
//     }
//   }, [parent]);

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (editingId) {
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/update`, {
//           category_id: editingId,
//           category_name: formData.category_name,
//         });
//         toast.success("Category updated successfully");
//       } else {
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/create`, {
//           main_service_id: parent?.id,
//           category_name: formData.category_name,
//         });
//         toast.success("Category created successfully");
//       }

//       setFormData({ category_name: "" });
//       setEditingId(null);
//       setIsModalOpen(false);
//       fetchCategories();
//     } catch (error) {
//       console.error("Submit failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!categoryToDelete) return;

//     try {
//       setIsDeleting(true);

//       await axios.post(`${import.meta.env.VITE_BASE_URL}/categories/delete`, {
//         category_id: categoryToDelete.category_id,
//       });

//       toast.success("Category deleted successfully");

//       setIsDeleteModalOpen(false);
//       setCategoryToDelete(null);
//       fetchCategories();
//     } catch (error) {
//       toast.error("Failed to delete category");
//     } finally {
//       setIsDeleting(false);
//     }
//   };
//   const handleDelete = (category) => {
//     setCategoryToDelete(category);
//     setIsDeleteModalOpen(true);
//   };

//   const handleEdit = (category) => {
//     setFormData({
//       category_name: category.category_name || "",
//     });

//     setEditingId(category.category_id);
//     setIsModalOpen(true);
//   };
//   const confirmStatusToggle = async () => {
//     if (!categoryToToggle) return;

//     try {
//       const newStatus =
//         categoryToToggle.status === "active" ? "inactive" : "active";

//       setUpdatingStatusId(categoryToToggle.category_id);

//       await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/categories/update-status`,
//         {
//           category_id: categoryToToggle.category_id,
//           status: newStatus,
//         },
//       );

//       toast.success("Status updated successfully");

//       setIsStatusModalOpen(false);
//       setCategoryToToggle(null);

//       await fetchCategories();
//     } catch (error) {
//       toast.error("Failed to update status");
//     } finally {
//       setUpdatingStatusId(null);
//     }
//   };
//   return (
//     <div>
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Categories - {parent?.title}
//         </h1>

//         <div className="flex gap-3">
//           <button onClick={onBack} className="px-4 py-2 border rounded-lg">
//             Back
//           </button>

//           <button
//             onClick={() => {
//               setEditingId(null);
//               setFormData({ category_name: "" });
//               setIsModalOpen(true);
//             }}
//             className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
//           >
//             <Plus size={18} />
//             Add Category
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white shadow rounded-xl border">
//         <div className="max-h-[480px] overflow-y-auto overflow-x-auto rounded-xl">
//           <table className="w-full text-left min-w-[600px]">
//             <thead className="bg-black text-white text-xl">
//               <tr>
//                 <th className="p-4 bg-black sticky top-0 left-0 z-50">
//                   Category Name
//                 </th>
//                 <th className="p-4 bg-black sticky top-0">Status</th>
//                 <th className="p-4 bg-black sticky top-0">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {isLoading ? (
//                 [...Array(categories.length || 5)].map((_, i) => (
//                   <tr key={i} className="border-t">
//                     <td className="p-4">
//                       <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
//                     </td>
//                     <td className="p-4">
//                       <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
//                     </td>
//                     <td className="p-4">
//                       <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
//                     </td>
//                   </tr>
//                 ))
//               ) : categories.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4 text-gray-500">
//                     No categories found.
//                   </td>
//                 </tr>
//               ) : (
//                 categories.map((category) => (
//                   <tr key={category.category_id} className="border-t">
//                     <td className="p-4 font-medium sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
//                       {category.category_name}
//                     </td>

//                     {/* <td className="p-4">
//                       <button
//                         onClick={() => handleStatusToggle(category)}
//                         className={`px-3 py-1 rounded-full text-sm font-medium transition ${
//                           category.status === "active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {category.status === "active" ? "Active" : "Inactive"}
//                       </button>
//                     </td> */}

//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         {/* Toggle */}
//                         {/* <button
//                           onClick={() => handleStatusToggle(category)}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                             category.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                               category.status === "active"
//                                 ? "translate-x-6"
//                                 : "translate-x-1"
//                             }`}
//                           />
//                         </button> */}

//                         <button
//                           disabled={updatingStatusId === category.category_id}
//                           onClick={() => {
//                             setCategoryToToggle(category);
//                             setIsStatusModalOpen(true);
//                           }}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                             category.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           } ${
//                             updatingStatusId === category.category_id
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                         >
//                           {updatingStatusId === category.category_id ? (
//                             <span className="bw-loader-small"></span>
//                           ) : (
//                             <span
//                               className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                                 category.status === "active"
//                                   ? "translate-x-6"
//                                   : "translate-x-1"
//                               }`}
//                             />
//                           )}
//                         </button>
//                       </div>
//                     </td>

//                     <td className="p-4 flex gap-3">
//                       <button
//                         onClick={() => handleEdit(category)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <Pencil size={18} />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(category)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* status modal */}
//       {isStatusModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Change Category Status
//             </h2>

//             <p className="text-gray-600 mt-2">
//               Are you sure you want to{" "}
//               <span className="font-medium text-black">
//                 {categoryToToggle?.status === "active"
//                   ? "Deactivate"
//                   : "Activate"}
//               </span>{" "}
//               <span className="font-medium text-black">
//                 {categoryToToggle?.category_name}
//               </span>
//               ?
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setIsStatusModalOpen(false);
//                   setCategoryToToggle(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmStatusToggle}
//                 disabled={updatingStatusId === categoryToToggle?.category_id}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//                   updatingStatusId === categoryToToggle?.category_id
//                     ? "bg-gray-300 text-gray-600"
//                     : "bg-black text-white hover:bg-gray-800"
//                 }`}
//               >
//                 {updatingStatusId === categoryToToggle?.category_id ? (
//                   <>
//                     <span className="bw-loader"></span> Updating...
//                   </>
//                 ) : (
//                   "Confirm"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingId ? "Edit Category" : "Add Category"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Category Name"
//                 value={formData.category_name}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     category_name: e.target.value,
//                   })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 rounded-lg ${
//                     isSubmitting
//                       ? "bg-gray-300 text-gray-600"
//                       : "bg-black text-white hover:bg-gray-800"
//                   }`}
//                 >
//                   {isSubmitting ? "Saving..." : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Delete Category
//             </h2>

//             <p className="text-gray-600 mt-2">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-black">
//                 {categoryToDelete?.category_name}
//               </span>
//               ?
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setIsDeleteModalOpen(false);
//                   setCategoryToDelete(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={confirmDelete}
//                 disabled={isDeleting}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//                   isDeleting
//                     ? "bg-gray-300 text-gray-600"
//                     : "bg-black text-white hover:bg-gray-800"
//                 }`}
//               >
//                 {isDeleting ? (
//                   <>
//                     <span className="bw-loader"></span> Deleting...
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>

//           <style>{`
//       .bw-loader {
//         border: 3px solid #e5e5e5;
//         border-top: 3px solid #000;
//         border-radius: 50%;
//         width: 14px;
//         height: 14px;
//         animation: spin 0.6s linear infinite;
//       }
//         .bw-loader-small {
//   border: 2px solid #fff;
//   border-top: 2px solid transparent;
//   border-radius: 50%;
//   width: 14px;
//   height: 14px;
//   animation: spin 0.6s linear infinite;
// }

//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `}</style>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageCategoriesPage;
