import { approveBudget, sendFunds } from "@admin/services/sendFundsService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
    await sendFunds({projectId: projectId, phaseNumber: data.phaseNumber, milestoneId: data.milestoneId})
    
  };

  const onSend = async () => {
      await sendFunds({projectId: projectId})
  }

  const onApprove = async () => {
      await approveBudget({projectId: projectId})
  }

  return {
    isOpeen,
    onOpeen,
    onSubmit,
    register,
    handleSubmit,
    errors,
    onSend,
    onApprove
  };
}
