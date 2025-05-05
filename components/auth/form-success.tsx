import { FaExclamationCircle } from "react-icons/fa";

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-700/15 text-emerald-950 p-3 rounded-md flex items-center gap-x-2 text-sm">
      <FaExclamationCircle />
      <p>{message}</p>
    </div>
  );
};
