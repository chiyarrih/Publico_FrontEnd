import { sendFunds } from "@admin/services/sendFundsService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function useSendFunds({projectId}:{projectId?:string}) {
  const [isOpeen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      amount: 0,
      reason: "",
      type: "",
    },
  });

  const onOpeen = () => setIsOpen(!isOpeen);

  const onSubmit = async (data: any) => {
    console.log("Submitted data:", data);
    reset();
    setIsOpen(!isOpeen)
    await sendFunds({projectId: projectId})
    
  };

  const onSend = async () => {
    
        await sendFunds({projectId: projectId})
  }

  return {
    isOpeen,
    onOpeen,
    onSubmit,
    register,
    handleSubmit,
    errors,
    onSend
  };
}
