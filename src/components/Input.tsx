
interface InputPros extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type,
  id,
  name,
  onChange,
  ...props
}: InputPros) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      onChange={onChange}
      {...props}
    />
  )
}
