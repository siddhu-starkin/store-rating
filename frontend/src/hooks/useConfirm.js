// USAGE:
//   const [ConfirmDialog, confirm] = useConfirm(
//     "Delete Item",
//     "Are you sure you want to delete this item? This action cannot be undone."
//   );

//   const handleDelete = async () => {
//     const result = await confirm();
//     if (result) {
//       / user clicked confirm
//       console.log("Deleted!");
//     } else {
//       / user canceled
//       console.log("Canceled");
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={handleDelete}
//         className="bg-red-600 text-white px-4 py-2 rounded-md"
//       >
//         Delete
//       </button>

//       <ConfirmDialog />
//     </>
//   );
// }

import { useState } from "react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toast } from "sonner";

export const useConfirm = (title, message) => {
  const [promise, setPromise] = useState(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
    toast.success("Your requested action is confirmed.");
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => (
    <ConfirmationDialog
      isOpen={promise != null}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={title}
      message={message}
    />
  );

  return [ConfirmDialog, confirm];
};
